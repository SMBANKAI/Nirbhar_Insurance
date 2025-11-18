
import React, { useState, useMemo } from 'react';
import type { InsuranceProduct } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { CalendarDaysIcon } from '../../ui/Icons';
import UpiPaymentDemo from '../features/UpiPaymentDemo';

interface PremiumSchedulerProps {
    policy: InsuranceProduct;
    onClose: () => void;
    onPurchaseSuccess?: (amount: number) => void;
}

const PremiumScheduler: React.FC<PremiumSchedulerProps> = ({ policy, onClose, onPurchaseSuccess }) => {
    const { t } = useTranslation();
    const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
    const [showPaymentDemo, setShowPaymentDemo] = useState(false);

    const premiumAmount = useMemo(() => {
        const ctaText = t(policy.cta.textKey);
        const match = ctaText.match(/₹(\d+)/);
        return match ? parseInt(match[1], 10) : 5; // Default to 5 if not found
    }, [policy.cta.textKey, t]);

    const handleConfirm = () => {
        if (!selectedUpiApp) {
            alert('Please select a UPI app to set up auto-pay.');
            return;
        }
        setShowPaymentDemo(true);
    };

    const handlePaymentComplete = () => {
        if (onPurchaseSuccess) {
             onPurchaseSuccess(premiumAmount);
        } else {
             onClose();
        }
    };

    if (showPaymentDemo) {
        return (
            <UpiPaymentDemo 
                amount={premiumAmount}
                policyName={t(policy.productNameKey)}
                onComplete={handlePaymentComplete}
                onClose={() => setShowPaymentDemo(false)}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-surface sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-slate-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('scheduler.title')}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                <div className="bg-surface rounded-2xl shadow-lg p-6">
                    <div className="flex items-center text-text-primary mb-4">
                        <CalendarDaysIcon className="w-6 h-6 mr-3 text-primary" />
                        <h3 className="font-bold text-lg">{t('scheduler.calendarTitle')}</h3>
                    </div>
                    <CalendarView />
                </div>

                <div className="bg-surface rounded-2xl shadow-lg p-6">
                     <h3 className="font-bold text-lg text-text-primary mb-1">{t('scheduler.paymentTitle')}</h3>
                     <p className="text-text-secondary mb-4 text-sm">{t('scheduler.paymentSubtitle')}</p>
                     <UpiSelection selectedApp={selectedUpiApp} onSelectApp={setSelectedUpiApp} />
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-surface border-t p-4 z-10">
                 <button 
                    onClick={handleConfirm}
                    disabled={!selectedUpiApp}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-colors text-lg disabled:bg-slate-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {t('scheduler.confirmButton')} (₹{premiumAmount}/day)
                </button>
            </footer>
        </div>
    );
};

const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
    
    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = useMemo(() => {
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        const d = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            d.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && i === today.getDate();
            d.push(
                <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-full relative ${isToday ? 'bg-primary text-white font-bold' : ''}`}>
                    {i}
                    <div className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></div>
                </div>
            );
        }
        return d;
    }, [daysInMonth, firstDayOfMonth, month, year]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                <h4 className="font-bold text-text-primary">{monthName} {year}</h4>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="font-semibold text-text-secondary">{day}</div>
                ))}
                {days}
            </div>
        </div>
    );
}

const UPI_APPS = [
    { id: 'gpay', name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png' },
    { id: 'phonepe', name: 'PhonePe', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
    { id: 'paytm', name: 'Paytm', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png' },
]

interface UpiSelectionProps {
    selectedApp: string | null;
    onSelectApp: (appId: string) => void;
}

const UpiSelection: React.FC<UpiSelectionProps> = ({ selectedApp, onSelectApp }) => {
    return (
        <div className="space-y-3">
            {UPI_APPS.map(app => (
                <button 
                    key={app.id}
                    onClick={() => onSelectApp(app.id)}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-colors ${selectedApp === app.id ? 'border-primary bg-orange-50' : 'border-slate-200 bg-surface hover:border-slate-300'}`}
                >
                    <img src={app.logo} alt={`${app.name} logo`} className="w-16 h-8 object-contain mr-4" />
                    <span className="font-semibold text-text-primary">{app.name}</span>
                    <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedApp === app.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                        {selectedApp === app.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                </button>
            ))}
        </div>
    )
}

export default PremiumScheduler;
