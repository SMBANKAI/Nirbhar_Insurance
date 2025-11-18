import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { USER_POLICIES, INSURANCE_PRODUCTS } from '../../../../constants';
import * as Icons from '../../../ui/Icons';

interface MyPoliciesScreenProps {
    onClose: () => void;
}

const MyPoliciesScreen: React.FC<MyPoliciesScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();

    const policies = USER_POLICIES.map(userPolicy => {
        const productDetails = INSURANCE_PRODUCTS.find(p => p.id === userPolicy.policyId);
        return {
            ...userPolicy,
            productDetails
        };
    });

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('myPolicies.title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {policies.map(policy => {
                    if (!policy.productDetails) return null;
                    const Icon = Icons.getIcon(policy.productDetails.header.icons[0]);

                    return (
                        <div key={policy.id} className="bg-white rounded-2xl shadow-lg p-4">
                            <div className="flex items-start space-x-4 mb-4">
                                <Icon className="w-8 h-8 text-primary mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{t(policy.productDetails.productNameKey)}</h3>
                                    <p className="text-sm text-text-secondary">{t('myPolicies.policyNumber')}: {policy.policyNumber}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-text-secondary">{t('myPolicies.coverage')}</p>
                                    <p className="font-bold text-text-primary">₹{policy.coverage.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">{t('myPolicies.premium')}</p>
                                    <p className="font-bold text-text-primary">₹{policy.premium}/day</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">{t('myPolicies.dueDate')}</p>
                                    <p className="font-bold text-text-primary">{policy.dueDate}</p>
                                </div>
                            </div>
                             <button className="w-full mt-4 bg-orange-100 text-primary font-bold py-2.5 rounded-xl border-2 border-transparent hover:border-primary transition-colors">
                                {t('myPolicies.viewDetails')}
                            </button>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default MyPoliciesScreen;
