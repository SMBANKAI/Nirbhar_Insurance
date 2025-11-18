
import { GoogleGenAI, GenerateContentResponse, Type, Modality, GroundingChunk as GenAIGroundingChunk, Content } from "@google/genai";
import type { GroundingChunk, Message } from "../types";
import { LANGUAGES } from "../constants";

// FIX: Replaced import.meta.env.VITE_API_KEY with process.env.API_KEY
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text & Chat ---

// Helper function to format chat history for the Gemini API.
const formatHistoryForGemini = (history: Message[]): Content[] => {
    // Filter out the initial bot message if it's the only one, as history should start with a user message.
    const historyToFormat = (history.length === 1 && history[0].id === 'initial') ? [] : history;
    
    return historyToFormat.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

export const getChatResponseStream = async (message: string, history: Message[], language: string) => {
    const ai = getAiClient();
    const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';

    const fullConversationHistory = formatHistoryForGemini(history);
    const latestUserMessage: Content = { role: 'user', parts: [{ text: message }] };
    const contents = [...fullConversationHistory, latestUserMessage];

    return ai.models.generateContentStream({
        model: 'gemini-2.0-flash-exp',
        contents: contents,
        config: {
            systemInstruction: `You are a helpful chatbot for Nirbhar, an insurance and savings app for people in India. Be polite, helpful, and clear in your responses. Respond ONLY in ${langName}.`,
        },
    });
};


export const getSmartInsuranceRecommendation = async (prompt: string, language: string = 'en'): Promise<string> => {
    try {
        const ai = getAiClient();
        const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';

        const systemInstruction = `You are an expert financial advisor for Nirbhar, an insurance and savings app for people in India. Based on the user's profile, recommend the best micro-insurance and savings plans. Explain your reasoning clearly and simply. Respond ONLY in ${langName}.`;
        const contents = `User profile: ${prompt}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting smart recommendation:", error);
        return "Sorry, I couldn't process that request right now. Please try again later.";
    }
};

// --- Grounding ---

export const getGroundedResponse = async (prompt: string, history: Message[], location: { latitude: number; longitude: number } | null, language: string = 'en') => {
    try {
        const ai = getAiClient();
        const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';

        const fullConversationHistory = formatHistoryForGemini(history);
        const latestUserMessage: Content = { role: 'user', parts: [{ text: prompt }] };
        const contents = [...fullConversationHistory, latestUserMessage];

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: `You are a helpful assistant for Nirbhar, an insurance and savings app for people in India. Be polite, helpful, and clear in your responses. Respond ONLY in ${langName}.`,
                tools: [{ googleMaps: {} }, { googleSearch: {} }],
                toolConfig: location ? {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }
                    }
                } : undefined,
            },
        });

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const chunks: GroundingChunk[] = (groundingMetadata?.groundingChunks as GenAIGroundingChunk[] || []).map(chunk => ({
            web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title || '' } : undefined,
            maps: chunk.maps ? { uri: chunk.maps.uri, title: chunk.maps.title || '' } : undefined,
        }));

        return { text: response.text, sources: chunks };
    } catch (error) {
        console.error("Error getting grounded response:", error);
        return { text: "Sorry, I had trouble finding information for you. Please try again.", sources: [] };
    }
};

// --- Audio ---

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A pleasant voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};

// --- Video ---
export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
    try {
        const ai = getAiClient(); // Create a fresh instance for Veo
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            }
        });
        return operation;
    } catch (error) {
        console.error("Error initiating video generation:", error);
        throw error;
    }
};

export const checkVideoOperation = async (operation: any) => {
    try {
        const ai = getAiClient(); // Create a fresh instance for Veo
        return await ai.operations.getVideosOperation({ operation: operation });
    } catch (error) {
        console.error("Error checking video operation status:", error);
        throw error;
    }
};
