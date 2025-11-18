
import React, { useState } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { SaveScreenView, SavingsAccount } from '../../../../types';
import { ClockIcon, ArrowDownTrayIcon, ArrowUpRightIcon, SparklesIcon, CurrencyRupeeIcon, GiftIcon } from '../../../ui/Icons';
import QuickAddSheet from './QuickAddSheet';

interface SaveHomeScreenProps {
    savingsAccounts: SavingsAccount[];
    onNavigate: (view: SaveScreenView) => void;
    onStartPlan: (accountId: string) => void;
    onStartWithdrawal: (account: SavingsAccount) => void;
}

const SaveHomeScreen: React.FC<SaveHomeScreenProps> = ({ savingsAccounts, onNavigate, onStartPlan, onStartWithdrawal }) => {
    const { t } = useTranslation();
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    
    const emergencyFund = savingsAccounts.find(acc => acc.type === 'emergency');
    const otherAccounts = savingsAccounts.filter(acc => acc.type !== 'emergency');

    const handleAddMoney = (amount: number) => {
        console.log(`Adding ₹${amount} to Emergency Fund`);
        // In a real app, you would dispatch an action to update the state
        setIsQuickAddOpen(false);
        alert(`₹${amount} added to your Emergency Fund!`);
    };

    if (!emergencyFund) {
        return (
            <div className="p-4 text-center">
                <p>No savings accounts found.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-3xl font-bold text-text-primary px-2">{t('save.tabTitle')}</h2>
            
            <EmergencyFundCard 
                account={emergencyFund}
                onNavigate={() => onNavigate(SaveScreenView.Chart)}
                onAddMoney={() => setIsQuickAddOpen(true)}
                onWithdraw={() => onStartWithdrawal(emergencyFund)}
                t={t}
            />
            
            {otherAccounts.length > 0 && (
                <OtherAccountsList accounts={otherAccounts} t={t} />
            )}

            <SavingsAutomationCard 
                onStartPlan={() => onStartPlan(emergencyFund.id)} 
                planActive={emergencyFund.planActive} 
                t={t}
            />

            <SevenDayActivityChart 
                planActive={emergencyFund.planActive} 
                onStartPlan={() => onStartPlan(emergencyFund.id)}
                t={t}
            />
            
            {isQuickAddOpen && (
                <QuickAddSheet 
                    onClose={() => setIsQuickAddOpen(false)}
                    onConfirm={handleAddMoney}
                />
            )}
        </div>
    );
};

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-white/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-white transform -rotate-90 origin-center"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{progress}%</span>
                <span className="text-xs opacity-70">Funded</span>
            </div>
        </div>
    );
};

const EmergencyFundCard: React.FC<{
    account: SavingsAccount,
    onNavigate: () => void,
    onAddMoney: () => void,
    onWithdraw: () => void,
    t: (key: string) => string
}> = ({ account, onNavigate, onAddMoney, onWithdraw, t }) => {
    const progress = Math.min(Math.round((account.balance / account.goal) * 100), 100);

    return (
        <div className="bg-gradient-to-br from-secondary to-blue-900 text-white rounded-3xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{t(account.titleKey)}</h3>
                <button onClick={onNavigate} className="flex items-center text-sm font-semibold bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                    View Breakdown <ArrowUpRightIcon className="w-4 h-4 ml-1.5" />
                </button>
            </div>
            <div className="flex items-center justify-between gap-4">
                <CircularProgress progress={progress} />
                <div className="text-right">
                    <p className="text-sm opacity-80">Current Balance</p>
                    <p className="text-3xl font-bold">₹{account.balance.toLocaleString('en-IN')}</p>
                    <p className="text-sm opacity-80 mt-1">Goal: ₹{account.goal.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <div className="flex gap-3 pt-3">
                <button onClick={onWithdraw} className="flex-1 bg-white/20 font-bold py-3 rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                    <ArrowDownTrayIcon className="w-5 h-5"/> Withdraw
                </button>
                <button onClick={onAddMoney} className="flex-1 bg-white text-primary font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
                    Add Money
                </button>
            </div>
        </div>
    );
};

const OtherAccountsList: React.FC<{ accounts: SavingsAccount[], t: (key: string) => string }> = ({ accounts, t }) => {
    const getIcon = (type: string) => {
        if (type === 'daily') return <SparklesIcon className="w-6 h-6 text-yellow-500" />;
        if (type === 'goal') return <GiftIcon className="w-6 h-6 text-green-500" />;
        return <CurrencyRupeeIcon className="w-6 h-6 text-slate-500" />;
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-text-primary px-2 mb-3">Other Funds</h3>
            <div className="space-y-3">
                {accounts.map(account => (
                    <div key={account.id} className="bg-surface rounded-2xl shadow-lg p-4 flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${account.type === 'daily' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                            {getIcon(account.type)}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-text-primary">{t(account.titleKey)}</p>
                            <p className="text-sm text-text-secondary">₹{account.balance.toLocaleString('en-IN')} of ₹{account.goal.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="w-16 text-right">
                             <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(account.balance / account.goal) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SavingsAutomationCard: React.FC<{ 
    onStartPlan: () => void; 
    planActive: boolean; 
    t: (key: string) => string;
}> = ({ onStartPlan, planActive, t }) => {
    return (
        <div className="bg-surface rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-text-primary">{t('save.home.autoSave')}</h3>
                <p className="text-sm text-text-secondary">{planActive ? "Your auto-save plan is active" : "Automate your savings daily"}</p>
            </div>
            <button onClick={onStartPlan} className="text-sm font-bold text-primary bg-orange-100 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors">
                {planActive ? t('save.home.viewPlan') : t('save.home.buildPlan')}
            </button>
        </div>
    );
};

const SevenDayActivityChart: React.FC<{
    planActive: boolean;
    onStartPlan: () => void;
    t: (key: string, options?: any) => string;
}> = ({ planActive, onStartPlan, t }) => {
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6);

    if (!planActive) {
        return (
            <div className="bg-surface rounded-2xl shadow-lg p-6 relative overflow-hidden">
                <h3 className="font-bold text-text-primary text-lg">{t('save.home.activity')}</h3>
                <div className="h-48 mt-4 flex items-end justify-around space-x-2 blur-sm pointer-events-none" aria-hidden="true">
                    {[30, 40, 70, 50, 60, 45, 80].map((height, index) => (
                        <div key={index} className="flex-1 h-full flex flex-col items-center justify-end text-center">
                            <div className="w-full h-full flex items-end">
                                <div className="w-full bg-slate-200 rounded-md" style={{ height: `${height}%` }}></div>
                            </div>
                            <span className="text-xs mt-2 font-semibold text-text-secondary">{'SMTWTFS'[index]}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-surface/80 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                     <p className="font-bold text-text-primary mb-4 text-center px-4">Activate a plan to track your activity</p>
                     <button onClick={onStartPlan} className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                        {t('save.home.buildPlan')}
                    </button>
                </div>
            </div>
        );
    }
    
    const data = [20, 28, 78, 32, 40, 25, 95];
    const max = Math.max(...data, 1);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const selectedValue = data[selectedDayIndex];
    const dayOfWeekForSelected = (today.getDay() - (6 - selectedDayIndex) + 7) % 7;
    const selectedDayName = dayNames[dayOfWeekForSelected];
    const totalWeeklySavings = data.reduce((sum, value) => sum + value, 0);

    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-text-primary text-lg">{t('save.home.activity')}</h3>
                    <p className="text-sm text-text-secondary min-h-[20px]">
                        Saved <span className="font-bold text-text-primary">₹{selectedValue}</span> on {selectedDayName}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-text-secondary">Total This Week</p>
                    <p className="font-bold text-accent text-2xl">₹{totalWeeklySavings}</p>
                </div>
            </div>
            <div className="h-40 flex items-end justify-around space-x-2 cursor-pointer" role="group" aria-label="Weekly savings chart">
                {data.map((value, index) => {
                    const isSelected = selectedDayIndex === index;
                    const dayIndex = (today.getDay() - (6 - index) + 7) % 7;
                    const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayIndex];
                    const barHeight = `${(value / max) * 90}%`;

                    return (
                        <div 
                            key={index} 
                            onClick={() => setSelectedDayIndex(index)} 
                            className="flex-1 h-full flex flex-col items-center justify-end text-center group" 
                            role="button" 
                            aria-pressed={isSelected}
                            aria-label={`Day ${dayLabel}, saved ${value} rupees`}
                        >
                           <div className="w-full h-full flex items-end relative">
                                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg transition-all duration-300 pointer-events-none z-10 ${isSelected ? 'opacity-100 -translate-y-8' : 'opacity-0 -translate-y-4'}`}>
                                    ₹{value}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-secondary"></div>
                                </div>
                                <div 
                                    className={`w-full rounded-md transition-all duration-300 ease-in-out transform origin-bottom ${isSelected ? 'bg-gradient-to-b from-primary-light to-primary scale-y-110' : 'bg-slate-200 group-hover:bg-slate-300'}`} 
                                    style={{ height: barHeight }}
                                >
                                </div>
                            </div>
                            <span className={`text-xs mt-2 font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>{dayLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default SaveHomeScreen;
