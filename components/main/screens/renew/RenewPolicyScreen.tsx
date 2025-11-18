import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { INSURANCE_PRODUCTS } from '../../../../constants';
import * as Icons from '../../../ui/Icons';

interface RenewPolicyScreenProps {
    onRenewPolicy: (policyId: number) => void;
}

const RenewPolicyScreen: React.FC<RenewPolicyScreenProps> = ({ onRenewPolicy }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-text-primary">{t('renew.title')}</h2>
                <p className="text-text-secondary mt-1">{t('renew.subtitle')}</p>
            </div>
            
            <div className="space-y-3">
                {INSURANCE_PRODUCTS.slice(0, 6).map(policy => (
                    <PolicyRenewCard 
                        key={policy.id}
                        policy={policy}
                        onRenewPolicy={() => onRenewPolicy(policy.id)}
                    />
                ))}
            </div>
        </div>
    );
};

interface PolicyRenewCardProps {
    policy: typeof INSURANCE_PRODUCTS[0];
    onRenewPolicy: () => void;
}

const PolicyRenewCard: React.FC<PolicyRenewCardProps> = ({ policy, onRenewPolicy }) => {
    const { t } = useTranslation();
    
    const IconComponent = Icons.getIcon(policy.header.icons[0]);

    // Mock due date (e.g., 15 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    const formattedDueDate = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {IconComponent && <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />}
                <div>
                    <h3 className="font-bold text-text-primary">{t(policy.productNameKey)}</h3>
                    <p className="text-sm text-text-secondary">Due: {formattedDueDate}</p>
                </div>
            </div>
            <button 
                onClick={onRenewPolicy}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm flex-shrink-0"
            >
                {t('renew.button')}
            </button>
        </div>
    );
};

export default RenewPolicyScreen;
