import React, { useState, useRef, useEffect } from 'react';
import { getChatResponseStream, getGroundedResponse, generateSpeech } from '../../../services/geminiService';
import type { Message } from '../../../types';
import { SpeakerWaveIcon, SparklesIcon, XMarkIcon, ArrowPathIcon, DocumentDuplicateIcon, CheckIcon } from '../../ui/Icons';
import { useTranslation } from '../../../hooks/useTranslation';

// --- Audio Utility Functions ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface ChatWindowProps {
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const { t, language } = useTranslation();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedMessages = localStorage.getItem('nirbhar_chat_history');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                if (Array.isArray(parsedMessages)) {
                    return parsedMessages;
                }
            } catch (e) {
                console.error("Failed to parse chat history from localStorage", e);
            }
        }
        return [{ id: 'initial', text: t('chat.initialMessage'), sender: 'bot' }];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [audioState, setAudioState] = useState<{ loadingId: string | null; playingId: string | null }>({ loadingId: null, playingId: null });
    const audioContextRef = useRef<AudioContext | null>(null);
    const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('nirbhar_chat_history', JSON.stringify(messages));
        } catch (e) {
            console.error("Failed to save chat history to localStorage", e);
        }
    }, [messages]);

    // Update initial message translation if language changes and it's the only message
    useEffect(() => {
        if (messages.length === 1 && messages[0].id === 'initial') {
            setMessages([{ id: 'initial', text: t('chat.initialMessage'), sender: 'bot' }]);
        }
    }, [language, t, messages]);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        return () => {
            currentAudioSourceRef.current?.stop();
            audioContextRef.current?.close();
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handlePlayAudio = async (messageId: string, text: string) => {
        if (audioState.loadingId || !audioContextRef.current) return;

        if (currentAudioSourceRef.current) {
            currentAudioSourceRef.current.stop();
            currentAudioSourceRef.current = null;
        }

        if (audioState.playingId === messageId) {
            setAudioState({ loadingId: null, playingId: null });
            return;
        }

        setAudioState({ loadingId: messageId, playingId: null });

        try {
            const base64Audio = await generateSpeech(text);
            if (base64Audio && audioContextRef.current) {
                const audioData = decode(base64Audio);
                const audioBuffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
                
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.onended = () => {
                    if (currentAudioSourceRef.current === source) {
                        setAudioState(prev => prev.playingId === messageId ? { loadingId: null, playingId: null } : prev);
                        currentAudioSourceRef.current = null;
                    }
                };
                source.start();
                currentAudioSourceRef.current = source;
                setAudioState({ loadingId: null, playingId: messageId });
            } else {
                throw new Error("TTS generation failed or AudioContext not available");
            }
        } catch (error) {
            console.error("Error playing audio:", error);
            setAudioState({ loadingId: null, playingId: null });
        }
    };


    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        
        // Capture the history for the API call *before* updating the state
        const historyForApi = [...messages];

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot' }]);

        try {
            const groundingKeywords = ['latest', 'news', 'find', 'near', 'who won', 'what is the price'];
            const needsGrounding = groundingKeywords.some(kw => input.toLowerCase().includes(kw));

            if (needsGrounding) {
                 const { text, sources } = await getGroundedResponse(input, historyForApi, null, language);
                 setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text, sources: sources } : m));
            } else {
                const stream = await getChatResponseStream(input, historyForApi, language);
                for await (const chunk of stream) {
                    const chunkText = chunk.text;
                    setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: m.text + chunkText } : m));
                }
            }

        } catch (error) {
            console.error("Error fetching chat response:", error);
             setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: t('chat.error') } : m));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([{ id: 'initial', text: t('chat.initialMessage'), sender: 'bot' }]);
        localStorage.removeItem('nirbhar_chat_history');
        setShowClearConfirm(false);
    };

    const handleCopy = (text: string, id: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
            });
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50">
            <div className="flex-1" onClick={onClose}></div>
            <div className="bg-background rounded-t-3xl flex flex-col h-[85%] animate-slide-up relative">
                <header className="p-4 border-b border-slate-200 flex justify-between items-center bg-surface rounded-t-3xl sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-secondary" />
                        {t('chat.title')}
                    </h2>
                     <div className="flex items-center gap-1">
                        <button onClick={() => setShowClearConfirm(true)} className="p-2 rounded-full text-text-secondary hover:bg-slate-100 hover:text-text-primary" aria-label="New Chat">
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-slate-100 hover:text-text-primary" aria-label="Close Chat">
                           <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <ChatMessage 
                            key={msg.id} 
                            message={msg} 
                            audioState={audioState} 
                            onPlayAudio={handlePlayAudio}
                            onCopy={handleCopy}
                            isCopied={copiedId === msg.id}
                            t={t}
                        />
                    ))}
                     {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'bot' && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-slate-200 bg-surface">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('chat.placeholder')}
                            className="flex-1 p-3 border-2 border-slate-200 bg-slate-50 rounded-full focus:ring-primary focus:border-primary transition"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary text-white p-3 rounded-full disabled:bg-slate-400 hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" aria-label="Send Message">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
                {showClearConfirm && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 z-20 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center animate-fade-in-fast">
                            <h3 className="text-lg font-bold text-text-primary">New Chat?</h3>
                            <p className="text-text-secondary my-4">This will clear your current conversation. Are you sure?</p>
                            <div className="flex justify-center space-x-3">
                                <button onClick={() => setShowClearConfirm(false)} className="font-bold py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                                <button onClick={handleClearChat} className="font-bold py-2 px-6 rounded-lg bg-primary text-white hover:bg-orange-700">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ChatMessageProps {
    message: Message;
    audioState: { loadingId: string | null; playingId: string | null };
    onPlayAudio: (messageId: string, text: string) => void;
    onCopy: (text: string, id: string) => void;
    isCopied: boolean;
    t: (key: string) => string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, audioState, onPlayAudio, onCopy, isCopied, t }) => {
    const isBot = message.sender === 'bot';
    const isLoadingAudio = audioState.loadingId === message.id;
    const isPlayingAudio = audioState.playingId === message.id;

    return (
        <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
            <div className="relative group">
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${isBot ? 'bg-surface text-text-primary rounded-bl-none shadow-sm' : 'bg-primary text-white rounded-br-none shadow-md'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                         <div className="mt-3 border-t pt-2">
                            <h4 className={`font-semibold text-xs mb-1 ${isBot ? 'border-slate-200' : 'border-orange-300'}`}>{t('common.sources')}:</h4>
                            <ul className="space-y-1">
                                {message.sources.map((source, i) => (
                                     <li key={i} className="text-xs">
                                        <a href={source.maps?.uri || source.web?.uri} target="_blank" rel="noopener noreferrer" className={`hover:underline ${isBot ? 'text-blue-600' : 'text-orange-200'}`}>
                                            {source.maps?.title || source.web?.title || 'Source link'}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 {isBot && message.text && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ zIndex: 1 }}>
                        <button 
                            onClick={() => onCopy(message.text, message.id)} 
                            className="p-1 bg-white rounded-full shadow-md text-slate-500 hover:text-primary disabled:cursor-not-allowed"
                            aria-label="Copy message"
                            disabled={isCopied}
                        >
                            {isCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
            {isBot && message.text && (
                 <button
                    onClick={() => onPlayAudio(message.id, message.text)}
                    disabled={audioState.loadingId !== null && !isLoadingAudio}
                    className={`p-2 rounded-full transition-colors ${
                        isPlayingAudio 
                            ? 'bg-orange-100 text-primary' 
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label="Play message audio"
                >
                    {isLoadingAudio ? (
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-primary rounded-full animate-spin"></div>
                    ) : (
                        <SpeakerWaveIcon className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>
        <div className="px-4 py-3 rounded-2xl bg-surface rounded-bl-none shadow-sm">
             <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
        </div>
    </div>
);


export default ChatWindow;