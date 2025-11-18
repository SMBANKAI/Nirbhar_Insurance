import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { INSURANCE_PRODUCTS } from '../../../../constants';
import * as Icons from '../../../ui/Icons';

interface ClaimsScreenProps {
    onFileClaim: (policyId: number) => void;
}

const ClaimsScreen: React.FC<ClaimsScreenProps> = ({ onFileClaim }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-text-primary">{t('claims.title')}</h2>
                <p className="text-text-secondary mt-1">{t('claims.subtitle')}</p>
            </div>
            
            <div className="space-y-3">
                {INSURANCE_PRODUCTS.map(policy => (
                    <PolicyClaimCard 
                        key={policy.id}
                        policy={policy}
                        onFileClaim={() => onFileClaim(policy.id)}
                    />
                ))}
            </div>
        </div>
    );
};

interface PolicyClaimCardProps {
    policy: typeof INSURANCE_PRODUCTS[0];
    onFileClaim: () => void;
}

const PolicyClaimCard: React.FC<PolicyClaimCardProps> = ({ policy, onFileClaim }) => {
    const { t } = useTranslation();
    
    const IconComponent = Icons.getIcon(policy.header.icons[0]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {IconComponent && <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />}
                <div>
                    <h3 className="font-bold text-text-primary">{t(policy.productNameKey)}</h3>
                    <p className="text-sm text-text-secondary">{t(`insurance.${policy.id}.description`)}</p>
                </div>
            </div>
            <button 
                onClick={onFileClaim}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm flex-shrink-0"
            >
                {t('claims.button')}
            </button>
        </div>
    );
};

export default ClaimsScreen;
