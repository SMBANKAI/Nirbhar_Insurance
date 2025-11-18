import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { LockClosedIcon, CheckCircleSolidIcon } from '../../ui/Icons';

interface UpiPaymentDemoProps {
    onComplete: () => void;
    onClose: () => void;
    amount: number;
    policyName: string;
}

type PaymentStep = 'pin' | 'processing' | 'success';

const UpiPaymentDemo: React.FC<UpiPaymentDemoProps> = ({ onComplete, onClose, amount, policyName }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<PaymentStep>('pin');
    const [pin, setPin] = useState<string[]>([]);
    
    useEffect(() => {
        if (pin.length === 4) {
            setStep('processing');
            setTimeout(() => {
                setStep('success');
                setTimeout(() => {
                    onComplete();
                }, 2500);
            }, 2000);
        }
    }, [pin, onComplete]);

    const handleKeyPress = (key: string) => {
        if (pin.length < 4) {
            setPin(prev => [...prev, key]);
        }
    };
    
    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const renderContent = () => {
        switch(step) {
            case 'pin':
                return <PinEntryScreen pin={pin} onKeyPress={handleKeyPress} onDelete={handleDelete} amount={amount} t={t} />;
            case 'processing':
                return <ProcessingScreen t={t} />;
            case 'success':
                return <SuccessScreen amount={amount} policyName={policyName} t={t} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 z-[60] flex flex-col animate-fade-in-fast">
            <header className="p-4 flex justify-between items-center bg-white shadow-sm">
                <h1 className="text-lg font-bold text-text-primary">{t('upi.title')}</h1>
                 <button onClick={onClose} className="text-2xl text-text-secondary">&times;</button>
            </header>
            <main className="flex-1 flex flex-col">
                {renderContent()}
            </main>
        </div>
    );
};


const PinEntryScreen: React.FC<{ pin: string[], onKeyPress: (k:string)=>void, onDelete: ()=>void, amount: number, t: (key: string) => string }> = ({ pin, onKeyPress, onDelete, amount, t }) => (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-center">
        <div>
            <p className="text-text-secondary">{t('upi.payTo')}</p>
            <p className="text-3xl font-bold text-text-primary mt-2">₹{amount.toLocaleString('en-IN')}</p>
        </div>
        <div>
            <p className="font-semibold text-text-primary mb-4">{t('upi.enterPin')}</p>
            <div className="flex justify-center items-center gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full transition-colors ${i < pin.length ? 'bg-secondary' : 'bg-slate-300'}`}></div>
                ))}
            </div>
            <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5"><LockClosedIcon className="w-3 h-3"/> {t('upi.secure')}</p>
        </div>
        <Keypad onKeyPress={onKeyPress} onDelete={onDelete} />
    </div>
);

const ProcessingScreen: React.FC<{ t: (key: string) => string }> = ({ t }) => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white text-center p-6">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="font-semibold text-text-secondary mt-6">{t('upi.processing')}</p>
    </div>
);

const SuccessScreen: React.FC<{ amount: number, policyName: string, t: (key: string, opts: any) => string }> = ({ amount, policyName, t }) => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white text-center p-6 animate-scale-in">
        <CheckCircleSolidIcon className="w-24 h-24 text-accent mb-6" />
        <h2 className="text-2xl font-bold text-text-primary">{t('upi.successTitle')}</h2>
        <p className="text-text-secondary mt-2 max-w-xs">{t('upi.successBody', { policyName, amount })}</p>
    </div>
);


const Keypad: React.FC<{ onKeyPress: (k:string)=>void, onDelete: ()=>void }> = ({ onKeyPress, onDelete }) => {
    const keys = ['1','2','3','4','5','6','7','8','9','', '0'];
    return (
        <div className="grid grid-cols-3 gap-2">
            {keys.map(k => (
                <button key={k} onClick={() => k && onKeyPress(k)} className="h-16 rounded-lg text-2xl font-semibold text-text-primary active:bg-slate-200 transition-colors disabled:opacity-0" disabled={!k}>
                    {k}
                </button>
            ))}
             <button onClick={onDelete} className="h-16 flex items-center justify-center text-text-primary active:bg-slate-200 rounded-lg">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 9.828M3 12h6.414a2 2 0 001.414 0L12 10.586" /></svg>
            </button>
        </div>
    );
};

export default UpiPaymentDemo;