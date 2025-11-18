import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { GiftIcon } from '../../../ui/Icons';

interface RewardsScreenProps {
    onClose: () => void;
    totalPoints: number;
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ onClose, totalPoints }) => {
    const { t } = useTranslation();

    // Mock history data
    const history = [
        { id: 1, reason: 'Daily Savings Setup', points: 100, date: '25 Jul 2024' },
        { id: 2, reason: 'Onboarding Tour', points: 50, date: '25 Jul 2024' },
    ];

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('rewards.title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-gradient-to-br from-highlight to-primary text-white rounded-2xl shadow-lg p-6 text-center">
                    <p className="font-semibold opacity-80">{t('rewards.totalPoints')}</p>
                    <div className="flex items-center justify-center gap-2">
                        <GiftIcon className="w-10 h-10" />
                        <p className="text-5xl font-bold">{totalPoints}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <h2 className="font-bold text-lg text-text-primary px-2 mb-2">{t('rewards.history')}</h2>
                    <ul className="divide-y divide-slate-100">
                        {history.map(item => (
                            <li key={item.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-text-primary">{item.reason}</p>
                                    <p className="text-sm text-text-secondary">{item.date}</p>
                                </div>
                                <p className="font-bold text-accent">+ {item.points} pts</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default RewardsScreen;