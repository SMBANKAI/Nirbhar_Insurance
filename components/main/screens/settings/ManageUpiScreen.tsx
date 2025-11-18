import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { UPI_MANDATES, INSURANCE_PRODUCTS } from '../../../../constants';

interface ManageUpiScreenProps {
    onClose: () => void;
}

const UPI_APPS_LOGOS: { [key: string]: string } = {
    gpay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png',
    phonepe: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg',
    paytm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png'
};

const ManageUpiScreen: React.FC<ManageUpiScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();

    const mandates = UPI_MANDATES.map(mandate => {
        const policy = INSURANCE_PRODUCTS.find(p => p.id === mandate.policyId);
        return {
            ...mandate,
            policyNameKey: policy ? policy.productNameKey : '',
            logo: UPI_APPS_LOGOS[mandate.upiApp] || ''
        };
    });

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('manageUpi.title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <h2 className="font-bold text-lg text-text-primary px-2 mb-3">{t('manageUpi.activeMandates')}</h2>
                <div className="space-y-4">
                    {mandates.map(mandate => (
                        <div key={mandate.id} className="bg-white rounded-2xl shadow-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-bold text-text-primary">{t('manageUpi.forPolicy', { policyName: t(mandate.policyNameKey) })}</p>
                                    <p className="text-sm font-bold text-text-primary">{t('manageUpi.amount', { amount: mandate.amount })}</p>
                                </div>
                                {mandate.logo && <img src={mandate.logo} alt={mandate.upiApp} className="w-16 h-8 object-contain" />}
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="flex-1 py-2 px-4 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm hover:bg-yellow-200 transition-colors">{t('manageUpi.pause')}</button>
                                <button className="flex-1 py-2 px-4 rounded-lg bg-red-100 text-red-800 font-semibold text-sm hover:bg-red-200 transition-colors">{t('manageUpi.cancel')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ManageUpiScreen;
