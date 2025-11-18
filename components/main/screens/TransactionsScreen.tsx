
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { TransactionScreenView, ActivePolicy } from '../../../types';
import ClaimsScreen from './claims/ClaimsScreen';
import { ArrowUpTrayIcon, GiftIcon, ShieldCheckIcon, CalendarDaysIcon, ChevronDownIcon } from '../../ui/Icons';
import RenewPolicyScreen from './renew/RenewPolicyScreen';
import { INSURANCE_PRODUCTS } from '../../../constants';

interface TransactionsScreenProps {
    activePolicies: ActivePolicy[];
    initialView: TransactionScreenView;
    onFileClaim: (policyId: number) => void;
    onRenewPolicy: (policyId: number) => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ activePolicies, initialView, onFileClaim, onRenewPolicy }) => {
    const { t } = useTranslation();
    const [activeView, setActiveView] = useState<TransactionScreenView>(initialView);

    useEffect(() => {
        setActiveView(initialView);
    }, [initialView]);

    return (
        <div className="p-4 space-y-6 pb-24">
             <h2 className="text-3xl font-bold text-text-primary px-2">{t('transactions.title')}</h2>
            <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 overflow-x-auto">
                <TabButton
                    label="My Portfolio"
                    isActive={activeView === TransactionScreenView.Portfolio}
                    onClick={() => setActiveView(TransactionScreenView.Portfolio)}
                />
                <TabButton
                    label={t('transactions.title')}
                    isActive={activeView === TransactionScreenView.Transactions}
                    onClick={() => setActiveView(TransactionScreenView.Transactions)}
                />
                <TabButton
                    label={t('claims.tabTitle')}
                    isActive={activeView === TransactionScreenView.Claims}
                    onClick={() => setActiveView(TransactionScreenView.Claims)}
                />
                 <TabButton
                    label={t('renew.tabTitle')}
                    isActive={activeView === TransactionScreenView.Renew}
                    onClick={() => setActiveView(TransactionScreenView.Renew)}
                />
            </div>
            
            <div>
                {activeView === TransactionScreenView.Portfolio && <PortfolioView policies={activePolicies} />}
                {activeView === TransactionScreenView.Transactions && <TransactionList />}
                {activeView === TransactionScreenView.Claims && <ClaimsScreen onFileClaim={onFileClaim} />}
                {activeView === TransactionScreenView.Renew && <RenewPolicyScreen onRenewPolicy={onRenewPolicy} />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 whitespace-nowrap px-3 py-2.5 font-semibold text-sm rounded-lg transition-all ${isActive ? 'bg-surface shadow text-primary' : 'text-text-secondary hover:bg-slate-200'}`}
    >
        {label}
    </button>
);

const PortfolioView: React.FC<{ policies: ActivePolicy[] }> = ({ policies }) => {
    const totalDailyInvestment = policies.reduce((acc, p) => acc + p.premiumAmount, 0);
    // Mock calculation for total cover value based on policies
    const totalCoverValue = policies.length * 100000; // Simplified for demo

    return (
        <div className="space-y-6 animate-fade-in-fast">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-secondary to-blue-900 text-white rounded-3xl shadow-xl p-6 text-center">
                <p className="opacity-80 font-medium mb-1">Daily Investment</p>
                <p className="text-4xl font-bold mb-4">₹{totalDailyInvestment}</p>
                <div className="flex justify-center gap-8 border-t border-white/20 pt-4">
                    <div>
                        <p className="text-xs opacity-70 mb-1">Active Policies</p>
                        <p className="text-xl font-bold">{policies.length}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-70 mb-1">Total Protection</p>
                        <p className="text-xl font-bold">₹{totalCoverValue.toLocaleString('en-IN')}+</p>
                    </div>
                </div>
            </div>

            {/* Policy List */}
            <div>
                <h3 className="font-bold text-text-primary text-lg mb-3 px-2">Your Protection</h3>
                {policies.length === 0 ? (
                    <div className="text-center py-10 bg-surface rounded-2xl border border-dashed border-slate-300">
                        <ShieldCheckIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                        <p className="text-text-secondary">No active policies found.</p>
                        <p className="text-sm text-text-tertiary mt-1">Explore policies to start securing your future.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {policies.map(policy => (
                            <ActivePolicyCard key={policy.id} policy={policy} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivePolicyCard: React.FC<{ policy: ActivePolicy }> = ({ policy }) => {
    const product = INSURANCE_PRODUCTS.find(p => p.id === policy.policyId);
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!product) return null;

    return (
        <div className="bg-surface rounded-2xl shadow-md overflow-hidden border border-slate-100 transition-all">
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-text-primary">{product.productNameKey.includes('.') ? 'Policy' : product.productNameKey}</h4>
                        <p className="text-xs text-text-secondary">Next Payment: {policy.nextDueDate}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-primary">₹{policy.premiumAmount}/day</p>
                    <ChevronDownIcon className={`w-4 h-4 ml-auto mt-1 text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            {isExpanded && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-slide-down">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                            <p className="text-xs text-text-secondary mb-1">Total Paid</p>
                            <p className="font-bold text-text-primary">₹{policy.premiumAmount * 1}</p>
                        </div>
                         <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                            <p className="text-xs text-text-secondary mb-1">Days Covered</p>
                            <p className="font-bold text-text-primary">1 Day</p>
                        </div>
                    </div>
                    
                    {/* Mini ROI Graph for individual policy */}
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-text-secondary mb-2">Projected Value (1 Year)</p>
                         <div className="h-24 flex items-end gap-2 px-2">
                            <div className="w-1/2 bg-slate-200 rounded-t-md relative group h-1/4">
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px]">₹{policy.premiumAmount * 365}</span>
                                <p className="absolute bottom-1 w-full text-center text-[10px] text-slate-500">Cost</p>
                            </div>
                            <div className="w-1/2 bg-green-500 rounded-t-md relative h-full">
                                 <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-700">High Value</span>
                                 <p className="absolute bottom-1 w-full text-center text-[10px] text-white/80">Benefit</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TransactionList: React.FC = () => {
    const { t } = useTranslation();
    const transactions = [
        { id: 1, type: 'Daily Saving', amount: -10, date: 'Today, 9:00 AM', status: 'Completed', icon: ArrowUpTrayIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 2, type: 'Reward Points', amount: 50, date: 'Yesterday, 2:30 PM', status: 'Credited', icon: GiftIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 3, type: 'Daily Saving', amount: -10, date: 'Yesterday, 9:00 AM', status: 'Completed', icon: ArrowUpTrayIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 4, type: 'Instant Saving', amount: -100, date: '2 days ago', status: 'Completed', icon: ArrowUpTrayIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 5, type: 'Daily Saving', amount: -10, date: '2 days ago', status: 'Completed', icon: ArrowUpTrayIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    const getTransactionType = (type: string) => {
        const key = `transactions.type.${type.toLowerCase().replace(' ', '')}`;
        const translated = t(key);
        return translated === key ? type : translated;
    }

    const getStatus = (status: string) => {
        const key = `transactions.status.${status.toLowerCase()}`;
        const translated = t(key);
        return translated === key ? status : translated;
    }

    return (
         <div className="bg-surface rounded-2xl shadow-lg p-2 animate-fade-in-fast">
            <ul className="divide-y divide-slate-100">
                {transactions.map(tx => (
                    <li key={tx.id} className="p-3 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.bg}`}>
                                <tx.icon className={`w-6 h-6 ${tx.color}`} />
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary">{getTransactionType(tx.type)}</p>
                                <p className="text-sm text-text-secondary">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold ${tx.amount > 0 ? 'text-accent' : 'text-text-primary'}`}>
                                {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                            </p>
                            <p className="text-sm text-text-secondary">{getStatus(tx.status)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TransactionsScreen;
