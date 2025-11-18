import React, { useState, useMemo, useRef } from 'react';
import { SAVINGS_AMOUNTS, INSURANCE_PRODUCTS_SUMMARY, SAVINGS_ACCOUNTS } from '../../../constants';
import { SparklesIcon, getIcon } from '../../ui/Icons';
import ChatWindow from '../features/ChatWindow';
import { useTranslation } from '../../../hooks/useTranslation';
import { AppScreen } from '../../../types';

interface HomeScreenProps {
    onSelectPolicy: (policyId: number) => void;
    onNavigate: (screen: AppScreen) => void;
    onOpenKyc: () => void;
    kycStatus: 'not_started' | 'verified';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectPolicy, onNavigate, onOpenKyc, kycStatus }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const kycProgress = kycStatus === 'verified' ? 100 : 25;
    const { t } = useTranslation();
    const emergencyFund = SAVINGS_ACCOUNTS.find(acc => acc.type === 'emergency');

    return (
        <div className="p-4 space-y-6">
            <div className="bg-surface rounded-2xl shadow-lg p-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">{t(kycStatus === 'verified' ? 'home.kyc.verifiedTitle' : 'home.kyc.title')}</h2>
                    <p className="text-text-secondary mb-4 text-sm max-w-xs">{t(kycStatus === 'verified' ? 'home.kyc.verifiedBody' : 'home.kyc.body')}</p>
                    <button 
                        onClick={onOpenKyc}
                        disabled={kycStatus === 'verified'}
                        className="bg-secondary text-white font-bold py-2 px-5 rounded-xl hover:bg-blue-900 transition-colors text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {t(kycStatus === 'verified' ? 'home.kyc.verifiedButton' : 'home.kyc.button')}
                    </button>
                </div>
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e6e6e6"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="url(#kycGradient)"
                            strokeWidth="3"
                            strokeDasharray={`${kycProgress}, 100`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                        />
                        <defs>
                             <linearGradient id="kycGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#34D399" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-lg text-accent">{kycProgress}%</span>
                    </div>
                </div>
            </div>
            
            {emergencyFund && (
                 <div className="bg-surface rounded-2xl shadow-lg p-5">
                    <h3 className="font-bold text-text-primary text-lg mb-4">{t('home.savingsGoal.title')}</h3>
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold text-text-primary">{t(emergencyFund.titleKey)}</span>
                            <span className="text-sm text-text-secondary">
                                ₹{emergencyFund.balance.toLocaleString('en-IN')} / ₹{emergencyFund.goal.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-highlight h-2.5 rounded-full" style={{ width: `${(emergencyFund.balance / emergencyFund.goal) * 100}%` }}></div>
                        </div>
                        <button onClick={() => onNavigate(AppScreen.Save)} className="w-full mt-4 bg-transparent text-primary font-bold py-2.5 rounded-xl border-2 border-primary hover:bg-orange-50 transition-colors">
                            {t('home.savingsGoal.cta')}
                        </button>
                    </div>
                </div>
            )}

            <DailySavingsHabitCard />

            <div data-tour-id="tour-step-2">
                <h3 className="font-bold text-text-primary text-xl mb-4 px-2">{t('home.insurance.title')}</h3>
                <div className="space-y-3">
                    {INSURANCE_PRODUCTS_SUMMARY.map(product => (
                        <InsuranceCard
                            key={product.id}
                            title={t(product.productNameKey)}
                            description={t(`insurance.${product.id}.description`)}
                            icon={product.icon}
                            color={product.color}
                            onClick={() => onSelectPolicy(product.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Chat Button */}
            <div data-tour-id="tour-step-chat" className="fixed bottom-24 right-4 z-20">
                 <button onClick={() => setIsChatOpen(true)} className="bg-secondary p-4 rounded-full shadow-xl hover:scale-110 transition-transform hover:rotate-12">
                    <SparklesIcon className="w-8 h-8 text-white" />
                </button>
            </div>
            
            {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
        </div>
    );
};

interface InsuranceCardProps {
    title: string;
    description: string;
    icon: string;
    color: { bg: string, text: string };
    onClick: () => void;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ title, description, icon, color, onClick }) => {
    const IconComponent = getIcon(icon);
    return (
        <button 
            onClick={onClick} 
            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-surface border border-slate-200/50 hover:bg-slate-50/50 hover:shadow-lg transition-all text-left transform hover:-translate-y-px"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
                <IconComponent className={`w-8 h-8 ${color.text}`} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-text-primary text-base">{title}</h4>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
};

const DailySavingsHabitCard: React.FC = () => {
    const { t } = useTranslation();
    const [dailyAmount, setDailyAmount] = useState(20);
    const sliderRef = useRef<HTMLInputElement>(null);

    const projections = useMemo(() => {
        const principal1 = dailyAmount * 365;
        const principal2 = dailyAmount * 365 * 2;
        const principal3 = dailyAmount * 365 * 3;

        return {
            year1: principal1,
            year2: principal2,
            year3: principal3,
        };
    }, [dailyAmount]);

    const min = 5;
    const max = 100;
    const percentage = (dailyAmount - min) / (max - min);

    // This calculation compensates for the thumb's width (approx. 16px) to center the tooltip.
    const tooltipStyle: React.CSSProperties = {
        left: `calc(${percentage * 100}% + ${8 - percentage * 16}px)`,
        transform: 'translateX(-50%)',
    };

    return (
        <div data-tour-id="tour-step-0" className="bg-surface rounded-2xl shadow-lg p-5 space-y-4">
            <div>
                <h3 className="font-bold text-text-primary text-lg">{t('home.dailyHabit.title')}</h3>
                <p className="text-sm text-text-secondary">{t('home.dailyHabit.subtitle')}</p>
            </div>

            <div className="pt-8">
                <div className="relative">
                    <div
                        style={tooltipStyle}
                        className="absolute -top-10 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-md shadow-lg"
                    >
                        ₹{dailyAmount}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-secondary"></div>
                    </div>
                    <input
                        ref={sliderRef}
                        id="daily-saving-slider"
                        type="range"
                        min={min}
                        max={max}
                        step="5"
                        value={dailyAmount}
                        onChange={(e) => setDailyAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-2">
                        <span>₹{min}</span>
                        <span>₹{max}</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-text-primary mb-2">{t('home.dailyHabit.projectionTitle')}</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <ProjectionCard label={t('home.dailyHabit.year1')} value={projections.year1} />
                    <ProjectionCard label={t('home.dailyHabit.year2')} value={projections.year2} />
                    <ProjectionCard label={t('home.dailyHabit.year3')} value={projections.year3} />
                </div>
            </div>

             <button className="w-full mt-2 bg-secondary text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t('home.dailyHabit.button')}
            </button>
        </div>
    );
};

const ProjectionCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="bg-slate-100 rounded-lg p-3 transition-all duration-300">
        <p className="text-xl md:text-2xl font-bold text-secondary">₹{value.toLocaleString('en-IN')}</p>
        <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
);


export default HomeScreen;