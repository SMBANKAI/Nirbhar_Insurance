import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SparklesIcon, BuildingLibraryIcon, AcademicCapIcon, MapPinIcon, VideoCameraIcon, MicIcon, ChatBubbleOvalLeftEllipsisIcon } from '../../ui/Icons';
import { getSmartInsuranceRecommendation, getGroundedResponse, generateVideo, checkVideoOperation } from '../../../services/geminiService';
import { VEO_LOADING_MESSAGES } from '../../../constants';
import { useTranslation } from '../../../hooks/useTranslation';
import GovernmentSchemesScreen from './explore/GovernmentSchemesScreen';

type Feature = 'advisor' | 'location' | 'video' | 'transcribe' | 'live';
type ExploreTab = 'ai' | 'govt';

const ExploreScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ExploreTab>('ai');
    const { t } = useTranslation();
    
    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold text-text-primary px-2 mb-6">{t('nav.explore')}</h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 mb-6">
                <TabButton 
                    label={t('explore.tabs.aiFeatures')} 
                    icon={<SparklesIcon className="w-5 h-5 mr-2" />}
                    isActive={activeTab === 'ai'} 
                    onClick={() => setActiveTab('ai')}
                />
                <TabButton 
                    label={t('explore.tabs.govtSchemes')}
                    icon={<BuildingLibraryIcon className="w-5 h-5 mr-2" />}
                    isActive={activeTab === 'govt'} 
                    onClick={() => setActiveTab('govt')}
                />
            </div>
            
            {/* Tab Content */}
            <div>
                {activeTab === 'ai' && <AiFeaturesView />}
                {activeTab === 'govt' && <GovernmentSchemesScreen />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center py-3 font-semibold text-sm transition-all relative ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
    >
        {icon}
        {label}
        {isActive && <div className="absolute bottom-0 h-0.5 w-full bg-primary rounded-full"></div>}
    </button>
);

const AiFeaturesView: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
    const { t } = useTranslation();

    const features = [
        { id: 'advisor', title: t('explore.advisor.title'), description: t('explore.advisor.description'), icon: AcademicCapIcon, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
        { id: 'location', title: t('explore.location.title'), description: t('explore.location.description'), icon: MapPinIcon, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
        { id: 'video', title: t('explore.video.title'), description: t('explore.video.description'), icon: VideoCameraIcon, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
        { id: 'transcribe', title: t('explore.transcribe.title'), description: t('explore.transcribe.description'), icon: MicIcon, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', disabled: true },
        { id: 'live', title: t('explore.live.title'), description: t('explore.live.description'), icon: ChatBubbleOvalLeftEllipsisIcon, iconBg: 'bg-sky-100', iconColor: 'text-sky-600', disabled: true },
    ];
    
    const renderFeatureComponent = () => {
        switch(activeFeature) {
            case 'advisor': return <InsuranceAdvisor />;
            case 'location': return <LocationInsurance />;
            case 'video': return <VideoGenerator />;
            default: return null;
        }
    };

    if (activeFeature) {
        return (
            <div>
                <button onClick={() => setActiveFeature(null)} className="font-semibold text-text-primary mb-4 flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>{t('explore.back')}</span>
                </button>
                {renderFeatureComponent()}
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {features.map(feature => {
                    const Icon = feature.icon;
                    return (
                        <div 
                            key={feature.id} 
                            onClick={() => !feature.disabled && setActiveFeature(feature.id as Feature)} 
                            className={`bg-surface rounded-2xl shadow-lg p-5 text-left relative overflow-hidden border border-slate-200/50 ${feature.disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.iconBg}`}>
                                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{feature.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
                                </div>
                            </div>
                            {feature.disabled && 
                                <div className="absolute top-3 right-3">
                                    <span className="font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">SOON</span>
                                </div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- Feature Components ---

const InsuranceAdvisor: React.FC = () => {
    const { t, language } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const QUESTIONS = useMemo(() => [
        { key: 'age', question: t('explore.advisor.chat.q_age'), type: 'text', placeholder: 'e.g., 35' },
        { key: 'profession', question: t('explore.advisor.chat.q_profession'), type: 'text', placeholder: 'e.g., Farmer' },
        { key: 'location', question: t('explore.advisor.chat.q_location'), type: 'options', options: [t('explore.advisor.chat.q_location_rural'), t('explore.advisor.chat.q_location_urban')] },
        { key: 'family', question: t('explore.advisor.chat.q_family'), type: 'text', placeholder: 'e.g., Married, 2 children' },
        { key: 'income', question: t('explore.advisor.chat.q_income'), type: 'text', placeholder: 'e.g., 15000' }
    ], [t]);

    const initialConversation = [
        { sender: 'bot', text: t('explore.advisor.chat.start') },
        { sender: 'bot', text: QUESTIONS[0].question }
    ];
    
    const [conversation, setConversation] = useState(initialConversation);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{[key: string]: string}>({});
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [conversation]);
    
    const handleRestart = () => {
        setConversation(initialConversation);
        setCurrentStep(0);
        setAnswers({});
        setUserInput('');
        setIsLoading(false);
        setIsFinished(false);
    };

    const fetchRecommendation = async (finalAnswers: {[key: string]: string}) => {
        setIsLoading(true);
        setConversation(prev => [...prev, { sender: 'bot', text: t('explore.advisor.chat.thanks') }]);

        const prompt = `I am ${finalAnswers.age} years old. My profession is ${finalAnswers.profession}. I live in a ${finalAnswers.location} area. My family details are: ${finalAnswers.family}. My approximate monthly income is ${finalAnswers.income}.`;
        
        const result = await getSmartInsuranceRecommendation(prompt, language);
        
        setConversation(prev => [...prev, { sender: 'bot', text: result }]);
        setIsLoading(false);
    };

    const handleAnswerSubmit = (answerText: string) => {
        if (!answerText.trim()) return;

        const newAnswers = { ...answers, [QUESTIONS[currentStep].key]: answerText };
        setAnswers(newAnswers);

        setConversation(prev => [...prev, { sender: 'user', text: answerText }]);
        setUserInput('');

        if (currentStep < QUESTIONS.length - 1) {
            const nextStepIndex = currentStep + 1;
            setCurrentStep(nextStepIndex);
            setTimeout(() => {
                setConversation(prev => [...prev, { sender: 'bot', text: QUESTIONS[nextStepIndex].question }]);
            }, 500);
        } else {
            setIsFinished(true);
            setTimeout(() => fetchRecommendation(newAnswers), 500);
        }
    };
    
    const currentQuestion = QUESTIONS[currentStep];

    return (
        <div className="bg-surface rounded-2xl shadow-lg p-0 flex flex-col h-[70vh]">
            <h3 className="font-bold text-xl text-text-primary p-4 flex items-center border-b"><AcademicCapIcon className="w-6 h-6 text-indigo-600 mr-2" /> {t('explore.advisor.title')}</h3>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversation.map((msg, index) => (
                     <div key={index} className={`flex items-end gap-2 ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0"><AcademicCapIcon className="w-5 h-5"/></div>}
                        <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'bot' ? 'bg-slate-100 text-text-primary rounded-bl-none' : 'bg-primary text-white rounded-br-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0"><AcademicCapIcon className="w-5 h-5"/></div>
                        <div className="px-4 py-3 rounded-2xl bg-slate-100 rounded-bl-none">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white/50 backdrop-blur-sm rounded-b-2xl">
                {!isFinished ? (
                    currentQuestion.type === 'text' ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit(userInput)}
                                placeholder={currentQuestion.placeholder}
                                className="flex-1 p-3 border-2 border-slate-200 bg-slate-50 rounded-full focus:ring-primary focus:border-primary transition"
                            />
                            <button onClick={() => handleAnswerSubmit(userInput)} disabled={!userInput.trim()} className="bg-primary text-white p-3 rounded-full disabled:bg-slate-400 hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 justify-center">
                            {currentQuestion.options?.map(option => (
                                <button key={option} onClick={() => handleAnswerSubmit(option)} className="bg-primary/10 text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/20 transition-colors">
                                    {option}
                                </button>
                            ))}
                        </div>
                    )
                ) : (
                    <button onClick={handleRestart} className="w-full bg-slate-200 text-text-primary font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
                        {t('explore.advisor.chat.restart')}
                    </button>
                )}
            </div>
        </div>
    );
}

const LocationInsurance: React.FC = () => {
    const [result, setResult] = useState<{text: string, sources: any[]}|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t, language } = useTranslation();

    const handleFetch = () => {
        setIsLoading(true);
        setError('');
        setResult(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const response = await getGroundedResponse(t('explore.location.prompt'), [], { latitude, longitude }, language);
                setResult(response);
                setIsLoading(false);
            },
            (err) => {
                setError(`${t('explore.location.error')}: ${err.message}`);
                setIsLoading(false);
            }
        );
    };
    
    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-xl text-text-primary mb-4 flex items-center"><MapPinIcon className="w-6 h-6 text-primary mr-2" /> {t('explore.location.title')}</h3>
             <p className="text-text-secondary mb-4">{t('explore.location.body')}</p>
            <button onClick={handleFetch} disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:bg-slate-400 hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {isLoading ? t('common.finding') : t('explore.location.button')}
            </button>
            {error && <p className="mt-4 text-danger">{error}</p>}
            {result && (
                <div className="mt-6 p-4 bg-background rounded-lg">
                    <p className="whitespace-pre-wrap text-text-primary">{result.text}</p>
                     {result.sources.length > 0 && (
                        <div className="mt-4 border-t pt-2">
                            <h4 className="font-semibold text-sm text-text-primary">{t('common.sources')}:</h4>
                            <ul className="list-disc pl-5 text-sm">
                                {result.sources.map((source, i) => (
                                    <li key={i}>
                                        <a href={source.maps?.uri || source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {source.maps?.title || source.web?.title || 'Source link'}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(VEO_LOADING_MESSAGES[0]);
    const { t } = useTranslation();

    useEffect(() => {
      const checkKey = async () => {
          if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
              const hasKey = await window.aistudio.hasSelectedApiKey();
              setApiKeySelected(hasKey);
          } else {
             console.warn("window.aistudio not found. Simulating API key selection.");
             setTimeout(() => setApiKeySelected(true), 1000);
          }
      };
      checkKey();
    }, []);

    const handleSelectKey = async () => {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true);
      }
    };
    
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            interval = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = VEO_LOADING_MESSAGES.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % VEO_LOADING_MESSAGES.length;
                    return VEO_LOADING_MESSAGES[nextIndex];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setVideoUrl('');

        try {
            let operation = await generateVideo(prompt, '16:9');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await checkVideoOperation(operation);
            }
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
// FIX: Replaced import.meta.env.VITE_API_KEY with process.env.API_KEY and removed the unnecessary API key check.
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                setVideoUrl(URL.createObjectURL(blob));
            } else {
                throw new Error("Video generation succeeded but no download link found.");
            }
        } catch (error: any) {
            console.error(error);
            if (error?.message?.includes("Requested entity was not found")) {
                setApiKeySelected(false);
            }
            alert(t('explore.video.errorAlert'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKeySelected) {
      return (
        <div className="bg-surface rounded-2xl shadow-lg p-6 text-center">
          <h3 className="font-bold text-xl text-text-primary mb-4 flex items-center justify-center"><VideoCameraIcon className="w-6 h-6 text-primary mr-2" /> {t('explore.video.apiKeyTitle')}</h3>
          <p className="text-text-secondary mb-4">{t('explore.video.apiKeyBody')}</p>
          <button onClick={handleSelectKey} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            {t('explore.video.apiKeyButton')}
          </button>
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 mt-2 block hover:underline">
                {t('explore.video.billingLink')}
           </a>
        </div>
      )
    }

    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-xl text-text-primary mb-4 flex items-center"><VideoCameraIcon className="w-6 h-6 text-primary mr-2" /> {t('explore.video.title')}</h3>
            <p className="text-text-secondary mb-4">{t('explore.video.body')}</p>
            <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 border-2 bg-slate-50 border-slate-200 rounded-lg mb-4 focus:ring-primary focus:border-primary transition"
                placeholder={t('explore.video.placeholder')}
                disabled={isLoading}
            />
            <button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:bg-slate-400 hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {isLoading ? t('explore.video.loading') : t('explore.video.button')}
            </button>
            {isLoading && (
                <div className="mt-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-text-secondary">{loadingMessage}</p>
                </div>
            )}
            {videoUrl && (
                <div className="mt-6">
                    <h4 className="font-bold mb-2 text-text-primary">{t('explore.video.ready')}</h4>
                    <video controls src={videoUrl} className="w-full rounded-lg shadow-lg"></video>
                </div>
            )}
        </div>
    );
};


export default ExploreScreen;