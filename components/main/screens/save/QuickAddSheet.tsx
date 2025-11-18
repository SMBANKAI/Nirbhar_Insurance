
import React, { useState } from 'react';
import { XMarkIcon } from '../../../ui/Icons';
import { SAVINGS_AMOUNTS } from '../../../../constants';
import { useTranslation } from '../../../../hooks/useTranslation';

interface QuickAddSheetProps {
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

const QuickAddSheet: React.FC<QuickAddSheetProps> = ({ onClose, onConfirm }) => {
    const [amount, setAmount] = useState<number | string>('');
    const { t } = useTranslation();

    const handleConfirm = () => {
        const numAmount = Number(amount);
        if (numAmount > 0) {
            onConfirm(numAmount);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-surface rounded-t-3xl p-4 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Add Money</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="text-center mb-6">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="₹0"
                        className="text-5xl font-bold text-center bg-transparent w-full focus:outline-none text-text-primary"
                        aria-label="Amount to add"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {SAVINGS_AMOUNTS.slice(0, 6).map(val => (
                        <button 
                            key={val} 
                            onClick={() => setAmount(val)} 
                            className="p-3 bg-slate-100 rounded-lg text-center font-bold text-text-primary hover:bg-slate-200 transition-colors focus:ring-2 focus:ring-primary"
                        >
                            ₹{val}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleConfirm} 
                    disabled={!amount || Number(amount) <= 0} 
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                >
                    {t('save.plan.step3.cta')}
                </button>
            </div>
        </div>
    );
};

export default QuickAddSheet;
