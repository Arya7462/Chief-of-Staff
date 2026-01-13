
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ChatMessage, Task, CalendarEvent, EmailInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a world-class Digital Chief of Staff for a high-growth executive. 
Your personality: Hyper-competent, strategic, concise, and radically proactive. 

Core Responsibilities:
1. Strategic Foresight: Identify Risks and Opportunities.
2. Noise Filtration: Ruthlessly prioritize what moves the needle.
3. Voice Briefing: Speak like a calm, professional female advisor.
`;

export const generateExecutiveAvatar = async (role: string, company: string): Promise<string | null> => {
  try {
    const prompt = `A ultra-professional, hyper-realistic corporate headshot of a high-level ${role} at a cutting-edge ${company}. Cinematic soft lighting, studio background, sophisticated business attire, 8k resolution, photorealistic.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.error("Avatar Generation Error:", err);
    return null;
  }
};

export const getChiefOfStaffResponse = async (
  message: string,
  history: ChatMessage[],
  context?: {
    tasks: Task[];
    events: CalendarEvent[];
    emails: EmailInsight[];
  }
): Promise<{ text: string; sources?: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + (context ? `\n\nUser Context:\nTasks: ${JSON.stringify(context.tasks)}\nEvents: ${JSON.stringify(context.events)}\nEmails: ${JSON.stringify(context.emails)}` : ''),
        temperature: 0.4,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { 
      text: response.text || "I'm monitoring the situation.",
      sources 
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { text: "Connection error. Re-establishing link." };
  }
};

export const generatePlannerVoiceBriefing = async (tasks: Task[]): Promise<Uint8Array | null> => {
  try {
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
    const briefText = highPriority.length > 0 
      ? `Tactical update. Your main effort today is ${highPriority[0].title}. You have ${highPriority.length} high-stakes items total. I recommend clearing the schedule for the next two hours.`
      : `Operational status green. No high-priority blocks remaining. Suggesting a pivot to long-term strategy work.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Read this tactical update with professional urgency and female clarity: ${briefText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) return decodeBase64(base64Audio);
    return null;
  } catch (err) {
    console.error("Planner Briefing Error:", err);
    return null;
  }
};

export const generateVoiceBriefing = async (emails: EmailInsight[]): Promise<Uint8Array | null> => {
  try {
    const urgentEmails = emails.filter(e => e.category === 'Urgent');
    const briefText = urgentEmails.length > 0 
      ? `Intelligence update. You have ${urgentEmails.length} urgent communications requiring immediate review. Strategic priority is recommended.`
      : `Inbox status optimal. No urgent flags detected in your current communications stack.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Read this email update with professional female authority: ${briefText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) return decodeBase64(base64Audio);
    return null;
  } catch (err) {
    console.error("Email Briefing Error:", err);
    return null;
  }
};

export const generateVoiceSummary = async (analysisText: string): Promise<Uint8Array | null> => {
  try {
    const cleanText = analysisText.replace(/<br\/>/g, ' ').replace(/[#*]/g, '');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Read this executive summary with professional female authority: ${cleanText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) return decodeBase64(base64Audio);
    return null;
  } catch (err) {
    console.error("Voice Summary Error:", err);
    return null;
  }
};

const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const analyzeDailyPlan = async (
  events: CalendarEvent[],
  emails: EmailInsight[]
): Promise<string> => {
  try {
    const prompt = `Perform high-level executive analysis of today's schedule and emails. Identify the Main Effort, Schedule Risk, and Strategic Opportunity.\nContext: Events: ${JSON.stringify(events)}, Emails: ${JSON.stringify(emails)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }] 
      }
    });
    return response.text || "Dashboard analysis failed.";
  } catch (err) {
    return "Briefing offline.";
  }
};

export const summarizeTask = async (task: Task): Promise<{ summary: string; subtasks: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this task and suggest 3-5 sub-tasks to achieve it: ${JSON.stringify(task)}`,
      config: {
        systemInstruction: "You are an expert executive project manager. Provide a crisp summary and a list of actionable sub-tasks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            subtasks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "subtasks"]
        }
      }
    });
    
    return JSON.parse(response.text || '{"summary": "No summary available", "subtasks": []}');
  } catch (err) {
    console.error("Summarize Task Error:", err);
    return { summary: "Error generating summary.", subtasks: [] };
  }
};

export const summarizeMeeting = async (transcript: string): Promise<{ summary: string, actionItems: string[], decisions: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Extract an executive summary, action items, and key decisions from this transcript: ${transcript}`,
      config: {
        systemInstruction: "You are a professional secretary and chief of staff. Focus on outcome-oriented items.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            decisions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "actionItems", "decisions"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error("Meeting Summary Error:", err);
    return { summary: "Failed to process transcript.", actionItems: [], decisions: [] };
  }
};
