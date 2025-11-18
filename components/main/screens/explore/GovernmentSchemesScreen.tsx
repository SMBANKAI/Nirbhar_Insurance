import React, { useState } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { GOVERNMENT_SCHEMES_IDS } from '../../../../constants';
import { ChevronRightIcon } from '../../../ui/Icons';

const GovernmentSchemesScreen: React.FC = () => {
    const { t } = useTranslation();
    const [openScheme, setOpenScheme] = useState<number | null>(null);

    const toggleScheme = (id: number) => {
        setOpenScheme(prev => (prev === id ? null : id));
    };

    return (
        <div className="space-y-3">
             <h3 className="text-xl font-bold text-text-primary px-2 mb-2">{t('govtSchemes.title')}</h3>
            {GOVERNMENT_SCHEMES_IDS.map(id => (
                <div key={id} className="bg-surface rounded-2xl shadow-lg overflow-hidden border border-slate-200/50">
                    <button
                        onClick={() => toggleScheme(id)}
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                        aria-expanded={openScheme === id}
                        aria-controls={`scheme-content-${id}`}
                    >
                        <span className="font-bold text-text-primary">{t(`govtSchemes.${id}.name`)}</span>
                        <ChevronRightIcon className={`w-5 h-5 text-text-secondary transition-transform ${openScheme === id ? 'rotate-90' : ''}`} />
                    </button>
                    {openScheme === id && (
                        <div
                            id={`scheme-content-${id}`}
                            className="p-4 pt-0 text-text-secondary whitespace-pre-wrap animate-fade-in-fast"
                        >
                            {t(`govtSchemes.${id}.description`)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GovernmentSchemesScreen;
