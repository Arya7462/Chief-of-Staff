
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ChatMessage, Task, CalendarEvent, EmailInsight, User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are ExecAI, a Tier-1 Digital Chief of Staff for elite executives (Founders, CXOs).
Your primary objective is to maximize the user's focus and operational velocity.

Persona Guidelines:
- Tone: Strategic, concise, proactive, and radically professional.
- Philosophy: "Signal over noise." Ruthlessly prioritize items that impact growth or mission-critical objectives.
- Intelligence: Use context from tasks, emails, and calendar to offer predictive advice.
- Action: Don't just answer; suggest the next executive directive.

If the user asks for news or external data, use Google Search grounding. 
When providing a voice briefing, maintain a calm, authoritative professional female tone (Persona: Kore).
`;

export const generateExecutiveAvatar = async (role: string, company: string, age?: number, gender?: string): Promise<string | null> => {
  try {
    const personDesc = `${age ? age + ' year old' : ''} ${gender || ''}`.trim();
    const prompt = `A premium, high-fidelity corporate headshot of a ${personDesc || 'professional'} executive ${role} at a top-tier global ${company}. Cinematic lighting, minimalist modern office background, sophisticated business attire, 8k resolution, photorealistic, professional color grade, neutral expression, masterpiece.`;
    
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
        systemInstruction: SYSTEM_INSTRUCTION + (context ? `\n\nEXECUTIVE CONTEXT:\nTasks: ${JSON.stringify(context.tasks)}\nEvents: ${JSON.stringify(context.events)}\nEmails: ${JSON.stringify(context.emails)}` : ''),
        temperature: 0.3,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { 
      text: response.text || "Operational link established. Standby for synthesis.",
      sources 
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { text: "Link degraded. Re-establishing secure uplink." };
  }
};

export const generatePlannerVoiceBriefing = async (tasks: Task[]): Promise<Uint8Array | null> => {
  try {
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
    const briefText = highPriority.length > 0 
      ? `Command update. Your primary objective today is ${highPriority[0].title}. Total high-stakes items remaining: ${highPriority.length}. I recommend clearing low-value blocks to maintain velocity.`
      : `Operational environment clear. High-priority items are zero. Pivot to strategic long-range planning is advised.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Read this tactical summary with absolute clarity and professional female authority: ${briefText}` }] }],
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
      ? `Inbox intelligence. You have ${urgentEmails.length} urgent communications. Primary focus should be on the board follow-up received two hours ago.`
      : `Inbox status green. No high-risk communications detected in the current stack.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Read this intelligence brief with calm, professional female authority: ${briefText}` }] }],
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
      contents: [{ parts: [{ text: `Read this executive synthesis with professional authority: ${cleanText}` }] }],
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
    const prompt = `Synthesize today's executive status. Deliver the 'Main Effort', 'Strategic Risk', and 'Decision Window'. Keep it high-density.\nContext: Events: ${JSON.stringify(events)}, Emails: ${JSON.stringify(emails)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }] 
      }
    });
    return response.text || "Strategic synthesis offline.";
  } catch (err) {
    return "Intelligence uplink failed.";
  }
};

export const summarizeTask = async (task: Task): Promise<{ summary: string; subtasks: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform tactical breakdown of this objective: ${JSON.stringify(task)}`,
      config: {
        systemInstruction: "You are an elite executive project manager. Deliver a crisp summary and actionable tactical steps.",
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
    return { summary: "Tactical analysis error.", subtasks: [] };
  }
};

export const summarizeMeeting = async (transcript: string): Promise<{ summary: string, actionItems: string[], decisions: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Extract decision intelligence from this transcript: ${transcript}`,
      config: {
        systemInstruction: "You are a world-class secretary and Chief of Staff. Focus on decisions and outcomes.",
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
    return { summary: "Decision intelligence processing failed.", actionItems: [], decisions: [] };
  }
};
