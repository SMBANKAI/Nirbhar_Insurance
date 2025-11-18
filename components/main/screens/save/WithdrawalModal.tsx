import React, { useState } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { SavingsAccount } from '../../../../types';
import { CalendarDaysIcon } from '../../../ui/Icons';

interface WithdrawalModalProps {
    account: SavingsAccount;
    onClose: () => void;
    onConfirm: (accountId: string, amount: number) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ account, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [transferType, setTransferType] = useState<'instant' | 'scheduled'>('instant');
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleConfirm = () => {
        const withdrawalAmount = parseFloat(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            setError(t('save.withdraw.errorInvalidAmount'));
            return;
        }
        if (withdrawalAmount > account.balance) {
            setError(t('save.withdraw.errorAmount'));
            return;
        }
        setError('');

        if (transferType === 'instant') {
            alert(t('save.withdraw.successInstant', { amount: withdrawalAmount }));
        } else {
            alert(t('save.withdraw.successScheduled', { amount: withdrawalAmount, date: new Date(scheduleDate).toLocaleDateString() }));
        }
        onConfirm(account.id, withdrawalAmount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full animate-fade-in-fast">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-text-primary">{t('save.withdraw.title')}</h3>
                    <button onClick={onClose} className="text-2xl text-text-secondary">&times;</button>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg text-center mb-4">
                    <p className="text-sm text-text-secondary">{t(account.titleKey)}</p>
                    <p className="text-sm text-text-secondary">{t('save.withdraw.balance')}: <span className="font-bold text-text-primary">₹{account.balance.toLocaleString('en-IN')}</span></p>
                </div>

                {/* Amount */}
                <div className="mb-4">
                    <label htmlFor="withdrawAmount" className="block text-sm font-medium text-text-secondary mb-1">{t('save.withdraw.amountLabel')}</label>
                    <input
                        id="withdrawAmount"
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(''); }}
                        placeholder={t('save.withdraw.amountPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                {/* Transfer Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text-secondary mb-2">{t('save.withdraw.transferTypeLabel')}</label>
                    <div className="flex rounded-lg border border-gray-300">
                        <button onClick={() => setTransferType('instant')} className={`flex-1 py-2 rounded-l-md text-sm font-semibold transition-colors ${transferType === 'instant' ? 'bg-primary text-white' : 'bg-white text-text-primary'}`}>{t('save.withdraw.instant')}</button>
                        <button onClick={() => setTransferType('scheduled')} className={`flex-1 py-2 rounded-r-md text-sm font-semibold transition-colors ${transferType === 'scheduled' ? 'bg-primary text-white' : 'bg-white text-text-primary'}`}>{t('save.withdraw.scheduled')}</button>
                    </div>
                </div>

                {/* Schedule Date */}
                {transferType === 'scheduled' && (
                    <div className="mb-6 animate-fade-in-fast">
                        <label htmlFor="scheduleDate" className="block text-sm font-medium text-text-secondary mb-1">{t('save.withdraw.scheduleDateLabel')}</label>
                        <div className="relative">
                            <input
                                id="scheduleDate"
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            />
                            <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                )}
                
                <button onClick={handleConfirm} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400" disabled={!amount}>
                    {t('save.withdraw.confirmButton')}
                </button>
            </div>
        </div>
    );
};

export default WithdrawalModal;
