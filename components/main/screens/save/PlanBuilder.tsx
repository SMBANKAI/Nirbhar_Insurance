import React, { useState } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { SavingsAccount } from '../../../../types';

interface PlanBuilderProps {
    account: SavingsAccount;
    onClose: () => void;
    onPlanCreated: () => void;
}

const PlanBuilder: React.FC<PlanBuilderProps> = ({ account, onClose, onPlanCreated }) => {
    const [step, setStep] = useState(1);
    const [target, setTarget] = useState<number | null>(null);
    const [rule, setRule] = useState<string | null>(null);
    const { t } = useTranslation();

    const renderStep = () => {
        switch(step) {
            case 1: return <Step1 onSelect={setTarget} onNext={() => setStep(2)} t={t} />;
            case 2: return <Step2 account={account} onSelect={setRule} onNext={() => setStep(3)} onBack={() => setStep(1)} t={t} />;
            case 3: return <Step3 target={target} rule={rule} onConfirm={onPlanCreated} onBack={() => setStep(2)} t={t} />;
            default: return null;
        }
    }
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                {step > 1 && (
                     <button onClick={() => setStep(s => s - 1)} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <h1 className="text-xl font-bold text-text-primary">{t('save.plan.title')}</h1>
                 <button onClick={onClose} className="ml-auto text-2xl text-text-secondary">&times;</button>
            </header>
            <main className="flex-1 p-6">
                {renderStep()}
            </main>
        </div>
    );
};

interface StepProps {
    onNext?: () => void;
    onBack?: () => void;
    onSelect?: (value: any) => void;
    t: (key: string, options?: any) => string;
}

const Step1: React.FC<StepProps> = ({ onSelect, onNext, t }) => {
    const options = [
        { value: 1, key: 'save.plan.step1.option1' },
        { value: 3, key: 'save.plan.step1.option3' },
        { value: 6, key: 'save.plan.step1.option6' },
    ];
    
    const handleSelect = (value: number) => {
        if(onSelect) onSelect(value);
        if(onNext) onNext();
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-text-primary mb-2">{t('save.plan.step1.title')}</h2>
            <p className="text-center text-text-secondary mb-8">{t('save.plan.step1.subtitle')}</p>
            <div className="space-y-4">
                {options.map(opt => (
                     <button key={opt.value} onClick={() => handleSelect(opt.value)} className="w-full text-left bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-colors">
                        <p className="text-lg font-bold text-text-primary">{t(opt.key)}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface Step2Props extends StepProps {
    account: SavingsAccount;
}

const Step2: React.FC<Step2Props> = ({ account, onSelect, onNext, t }) => {
    const [dailyAmount, setDailyAmount] = useState<number>(20);

    const handleSelect = (value: string) => {
        if(onSelect) onSelect(value);
        if(onNext) onNext();
    }
    
    const daysToTarget = Math.ceil(Math.max(0, account.goal - account.balance) / dailyAmount);

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-text-primary mb-2">{t('save.plan.step2.title')}</h2>
            <p className="text-center text-text-secondary mb-8">{t('save.plan.step2.subtitle')}</p>
            <div className="space-y-4">
                 <div className="w-full text-left bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-colors group">
                    <h3 className="text-lg font-bold text-text-primary">{t('save.plan.step2.autoSaveTitle')}</h3>
                    <p className="text-text-secondary">{t('save.plan.step2.autoSaveDesc')}</p>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex space-x-2">
                            {[10, 20, 50].map(amount => (
                                <button key={amount} onClick={() => setDailyAmount(amount)} className={`px-4 py-2 rounded-full font-bold ${dailyAmount === amount ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'}`}>
                                    ₹{amount}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-accent">{t('save.plan.step2.daysToTarget', { days: daysToTarget })}</p>
                    </div>
                     <button onClick={() => handleSelect(`auto-save-${dailyAmount}`)} className="w-full bg-primary text-white font-bold py-2 rounded-lg mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Select & Continue</button>
                </div>
                 <button onClick={() => handleSelect('round-up')} className="w-full text-left bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-primary transition-colors">
                    <h3 className="text-lg font-bold text-text-primary">{t('save.plan.step2.roundUpTitle')}</h3>
                    <p className="text-text-secondary">{t('save.plan.step2.roundUpDesc')}</p>
                </button>
            </div>
        </div>
    );
};

interface Step3Props extends StepProps {
    target: number | null;
    rule: string | null;
    onConfirm: () => void;
}

const Step3: React.FC<Step3Props> = ({ target, rule, onConfirm, t }) => {
    return (
         <div>
            <h2 className="text-2xl font-bold text-center text-text-primary mb-8">{t('save.plan.step3.title')}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 mb-8">
                <h3 className="font-bold text-lg text-center text-text-primary border-b pb-3">{t('save.plan.step3.summaryTitle')}</h3>
                <div className="flex justify-between">
                    <span className="text-text-secondary">{t('save.plan.step3.target')}</span>
                    <span className="font-bold text-text-primary">{target}x {t('save.plan.step1.option1').split(' ')[1]}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-secondary">{t('save.plan.step3.rule')}</span>
                    <span className="font-bold text-text-primary">{rule?.startsWith('auto-save') ? `Auto-Save (₹${rule.split('-')[2]}/day)` : 'Round-Up'}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-text-secondary">{t('save.plan.step3.schedule')}</span>
                    <span className="font-bold text-text-primary">Daily</span>
                </div>
            </div>
            <button onClick={onConfirm} className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors text-lg">
                {t('save.plan.step3.cta')}
            </button>
        </div>
    )
};

export default PlanBuilder;