
import React, { useState, useEffect } from 'react';
import { OnboardingStep, Language } from '../../types';
import { LANGUAGES, SAVINGS_AMOUNTS } from '../../constants';
import { SparklesIcon, BellIcon, GiftIcon } from '../ui/Icons';
import { useTranslation } from '../../hooks/useTranslation';

interface OnboardingFlowProps {
  onOnboardingComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onOnboardingComplete }) => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.SplashScreen);
  const { t } = useTranslation();

  const nextStep = () => setStep(prev => prev + 1);

  const renderStep = () => {
    switch (step) {
      case OnboardingStep.SplashScreen:
        return <SplashScreen onNext={nextStep} />;
      case OnboardingStep.LanguageSelection:
        return <LanguageSelectionStep onNext={nextStep} t={t} />;
      case OnboardingStep.NotificationPermission:
        return <NotificationPermissionStep onNext={nextStep} t={t} />;
      case OnboardingStep.Welcome:
        return <WelcomeStep onNext={nextStep} t={t} />;
      case OnboardingStep.VideoIntro:
        return <VideoIntroStep onNext={nextStep} t={t} />;
      case OnboardingStep.Login:
        return <LoginStep onNext={nextStep} t={t} />;
      case OnboardingStep.Otp:
        return <OtpStep onNext={nextStep} t={t} />;
      case OnboardingStep.CreateAccount:
        return <CreateAccountStep onNext={nextStep} t={t} />;
      case OnboardingStep.Congratulations:
        return <CongratulationsStep onNext={nextStep} t={t} />;
      case OnboardingStep.SavingsSetup:
        return <SavingsSetupStep onComplete={onOnboardingComplete} t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 text-text-primary overflow-hidden">
      <div className="w-full max-w-md mx-auto">{renderStep()}</div>
    </div>
  );
};

const SplashScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    useEffect(() => {
        const timer = setTimeout(onNext, 2000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="fixed inset-0 bg-white z-[100]">
             <img 
                src="https://i.postimg.cc/qvRJjx3D/Orange-Peach-Live-Q-A-Promotion-Instagram-Post.png" 
                alt="Welcome to Nirbhar" 
                className="w-full h-full object-cover animate-fade-in-fast" 
             />
        </div>
    );
};

const OnboardingCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-surface rounded-3xl shadow-xl p-8 animate-scale-in ${className}`}>
        {children}
    </div>
);

const NotificationPermissionStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => {
    const handleAllow = () => {
        console.log("Notification permission requested");
        onNext();
    };
    return (
        <OnboardingCard className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-float">
                <BellIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-text-primary">{t('onboarding.notifications.title')}</h2>
            <p className="text-center text-text-secondary mb-8">{t('onboarding.notifications.body')}</p>
            <button onClick={handleAllow} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t('onboarding.notifications.allow')}
            </button>
            <button onClick={onNext} className="w-full text-text-secondary font-medium py-3 rounded-lg mt-2 hover:bg-slate-100 transition-colors">
                {t('onboarding.notifications.later')}
            </button>
        </OnboardingCard>
    );
};

const LanguageSelectionStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => {
    const { setLanguage } = useTranslation();
    const handleSelect = (lang: Language) => {
        setLanguage(lang.code);
        onNext();
    };
    return (
        <OnboardingCard>
            <div className="text-center mb-8">
                 <img 
                    src="https://i.postimg.cc/MTdhjyrw/language.jpg" 
                    alt="Language Selection" 
                    className="w-32 h-32 mx-auto mb-6 animate-float object-contain" 
                 />
                <h2 className="text-2xl font-bold text-text-primary">{t('onboarding.language.title')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => handleSelect(lang)} className="p-4 border-2 rounded-xl text-center font-semibold text-text-primary hover:bg-orange-50 hover:border-primary transition-all transform hover:scale-105">
                        {lang.name}
                    </button>
                ))}
            </div>
        </OnboardingCard>
    );
};

const WelcomeStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => {
    useEffect(() => {
        const timer = setTimeout(onNext, 3000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <OnboardingCard className="text-center">
            <img src="https://i.postimg.cc/zfxDD175/1743746752138-6ym-Fjy-NBZ4Cek-Xt-Txuu-M.jpg" alt="A group of happy Indian women" className="rounded-2xl mb-6 w-full object-cover h-48" />
            <h2 className="text-2xl font-bold text-text-primary">{t('onboarding.welcome.title')}</h2>
        </OnboardingCard>
    );
};

const VideoIntroStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => {
    useEffect(() => {
        const timer = setTimeout(onNext, 8000); // Auto-advance after 8 seconds
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
         <OnboardingCard className="text-center">
             <div className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-black w-full aspect-video relative">
                <iframe 
                    src="https://streamable.com/e/id77nx?autoplay=1" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen"
                    className="absolute top-0 left-0 w-full h-full"
                    title="Nirbhar Intro"
                ></iframe>
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-6">{t('onboarding.video.title')}</h2>
            <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t('common.continue')}
            </button>
        </OnboardingCard>
    );
};

const LoginStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => (
    <OnboardingCard>
        <h2 className="text-2xl font-bold text-center mb-2 text-text-primary">{t('onboarding.login.title')}</h2>
        <p className="text-center text-text-secondary mb-8">{t('onboarding.login.subtitle')}</p>
        <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary font-semibold">+91</span>
            <input type="tel" placeholder={t('onboarding.login.placeholder')} className="w-full pl-14 pr-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition" />
        </div>
        <div className="flex items-center mb-6">
            <input id="terms" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
            <label htmlFor="terms" className="ml-2 block text-sm text-text-secondary">{t('onboarding.login.terms')}</label>
        </div>
        <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            {t('onboarding.login.button')}
        </button>
        <p className="text-center text-xs text-danger mt-2">*Click to Proceed ( Backend not Connected )</p>
    </OnboardingCard>
);

const OtpStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => (
    <OnboardingCard>
        <h2 className="text-2xl font-bold text-center mb-2 text-text-primary">{t('onboarding.otp.title')}</h2>
        <p className="text-center text-text-secondary mb-8">{t('onboarding.otp.subtitle')}</p>
        <div className="flex justify-center gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
                <input key={i} type="text" maxLength={1} className="w-14 h-14 text-center text-3xl font-bold border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition" />
            ))}
        </div>
        <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            {t('common.verify')}
        </button>
        <p className="text-center text-xs text-danger mt-2">*Click to Proceed ( Backend not Connected )</p>
    </OnboardingCard>
);

const CreateAccountStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => (
    <OnboardingCard>
        <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">{t('onboarding.createAccount.title')}</h2>
        <input type="text" placeholder={t('onboarding.createAccount.placeholder')} className="w-full px-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition mb-6" />
        <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            {t('onboarding.createAccount.button')}
        </button>
    </OnboardingCard>
);

const CongratulationsStep: React.FC<{ onNext: () => void; t: (key: string) => string; }> = ({ onNext, t }) => {
     useEffect(() => {
        const timer = setTimeout(onNext, 3000);
        return () => clearTimeout(timer);
    }, [onNext]);
    return (
        <OnboardingCard className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-scale-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-text-primary">{t('onboarding.congratulations.title')}</h2>
            <p className="text-text-secondary mt-2 text-lg">{t('onboarding.congratulations.subtitle')}</p>
        </OnboardingCard>
    );
};


const SavingsSetupStep: React.FC<{ onComplete: () => void; t: (key: string, options?: any) => string; }> = ({ onComplete, t }) => {
    const [showWhy, setShowWhy] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const handleSelectAmount = (amount: number) => {
        setSelectedAmount(amount);
    };

    const handleComplete = () => {
        if (selectedAmount) {
            const currentPoints = parseInt(localStorage.getItem('nirbhar_total_points') || '0', 10);
            const newTotal = currentPoints + selectedAmount;
            localStorage.setItem('nirbhar_total_points', newTotal.toString());
        }
        onComplete();
    };

    if (showWhy) {
        return (
            <OnboardingCard>
                <h2 className="text-2xl font-bold text-center mb-4 text-text-primary">{t('onboarding.savingsWhy.title')}</h2>
                <ul className="space-y-4 text-text-secondary mb-8">
                    <li className="flex items-start"><span className="text-accent mr-3 mt-1 font-bold">✓</span> {t('onboarding.savingsWhy.point1')}</li>
                    <li className="flex items-start"><span className="text-accent mr-3 mt-1 font-bold">✓</span> {t('onboarding.savingsWhy.point2')}</li>
                    <li className="flex items-start"><span className="text-accent mr-3 mt-1 font-bold">✓</span> {t('onboarding.savingsWhy.point3')}</li>
                </ul>
                <button onClick={() => setShowWhy(false)} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {t('onboarding.savingsWhy.continue')}
                </button>
                <button onClick={onComplete} className="w-full text-text-secondary font-medium py-3 rounded-lg mt-2 hover:bg-slate-100 transition-colors">
                    {t('common.cancel')}
                </button>
            </OnboardingCard>
        );
    }

    return (
        <div className="relative">
             <OnboardingCard>
                <button onClick={() => setShowWhy(true)} className="absolute top-4 right-4 text-sm font-semibold text-primary">{t('onboarding.savingsWhy.why')}</button>
                <div className="text-center">
                    <SparklesIcon className="w-16 h-16 mx-auto text-highlight mb-4" />
                    <h2 className="text-3xl font-bold mb-2 text-text-primary">{t('onboarding.savingsSetup.title')}</h2>
                    <p className="text-text-secondary mb-4 text-lg">{t('onboarding.savingsSetup.subtitle')}</p>
                    <div className="h-8 flex items-center justify-center">
                        {selectedAmount ? (
                            <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full animate-fade-in-fast">
                                <GiftIcon className="w-5 h-5" />
                                <span>{t('onboarding.savingsSetup.earnPoints', { points: selectedAmount })}</span>
                            </div>
                        ) : (
                            <p className="text-text-secondary">{t('onboarding.savingsSetup.selectAmount')}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 my-6">
                    {SAVINGS_AMOUNTS.map(amount => (
                        <button 
                            key={amount} 
                            onClick={() => handleSelectAmount(amount)}
                            className={`p-4 border-2 rounded-xl text-center font-bold text-xl text-text-primary transition-all transform hover:scale-105 ${selectedAmount === amount ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-slate-200 hover:border-primary'}`}
                        >
                            ₹{amount}
                        </button>
                    ))}
                </div>
                <button onClick={handleComplete} className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                     {selectedAmount
                        ? t('onboarding.savingsSetup.buttonWithPoints', { points: selectedAmount })
                        : t('onboarding.savingsSetup.button')
                    }
                </button>
                 <button onClick={onComplete} className="w-full text-text-secondary font-medium py-3 rounded-lg mt-2 hover:bg-slate-100 transition-colors">
                    {t('common.skip')}
                </button>
             </OnboardingCard>
        </div>
    );
};


export default OnboardingFlow;
