
import React, { useState, useMemo } from 'react';
import type { InsuranceProduct, RoiGraphData } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import * as Icons from '../../ui/Icons';

interface PolicyDetailScreenProps {
    policy: InsuranceProduct;
    onClose: () => void;
    onOpenScheduler: (policy: InsuranceProduct) => void;
}

type PolicyTab = 'overview' | 'coverage' | 'benefits';

const PolicyDetailScreen: React.FC<PolicyDetailScreenProps> = ({ policy, onClose, onOpenScheduler }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<PolicyTab>('overview');

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-surface sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-slate-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t(policy.productNameKey)}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                
                {/* Header Section (Always Visible) */}
                <HeaderSection policy={policy} />

                {/* Tab Navigation */}
                <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 sticky top-0 z-10">
                    <TabButton label={t('policy.tabs.overview')} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <TabButton label={t('policy.tabs.coverage')} isActive={activeTab === 'coverage'} onClick={() => setActiveTab('coverage')} />
                    <TabButton label={t('policy.tabs.benefits')} isActive={activeTab === 'benefits'} onClick={() => setActiveTab('benefits')} />
                </div>
                
                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && <OverviewTabContent policy={policy} />}
                    {activeTab === 'coverage' && <CoverageTabContent policy={policy} />}
                    {activeTab === 'benefits' && <BenefitsTabContent policy={policy} />}
                </div>

            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-surface border-t p-4 z-10">
                 <button 
                    onClick={() => onOpenScheduler(policy)}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                 >
                    {t(policy.cta.textKey)}
                </button>
            </footer>
        </div>
    );
};

const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full py-2.5 font-semibold text-sm rounded-lg transition-all ${isActive ? 'bg-surface shadow text-primary' : 'text-text-secondary hover:bg-slate-200'}`}
    >
        {label}
    </button>
);

const HeaderSection: React.FC<{ policy: InsuranceProduct }> = ({ policy }) => {
    const { t } = useTranslation();
    const renderIcon = (iconName: string, index: number) => {
        const IconComponent = Icons.getIcon(iconName);
        return IconComponent ? <IconComponent key={index} className="w-8 h-8 text-primary" /> : null;
    };
    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
                {policy.header.icons.map(renderIcon)}
            </div>
            <h2 className="text-2xl font-bold text-text-primary">{t(policy.header.titleKey)}</h2>
            <p className="text-text-secondary mt-1">{t(policy.header.subtextKey)}</p>
        </div>
    );
};

const OverviewTabContent: React.FC<{ policy: InsuranceProduct }> = ({ policy }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6 animate-fade-in-fast">
            {policy.video.url && (
                <div className="rounded-2xl overflow-hidden shadow-lg bg-black w-full aspect-video relative">
                    <iframe 
                        src={policy.video.url} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allow="autoplay; fullscreen"
                        className="absolute top-0 left-0 w-full h-full"
                        title={t(policy.video.titleKey)}
                    ></iframe>
                </div>
            )}

            <div className="bg-surface rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-text-primary mb-3 flex items-center">
                     <Icons.DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
                     {t('policy.common.overviewTitle')}
                </h3>
                <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                    {policy.video.script.map((lineKey, idx) => (
                        <p key={idx} className="flex items-start">
                            <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                            {t(lineKey)}
                        </p>
                    ))}
                </div>
            </div>
            <RoiGraph policy={policy} />
        </div>
    );
};

const CoverageTabContent: React.FC<{ policy: InsuranceProduct }> = ({ policy }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6 space-y-4 animate-fade-in-fast">
            <div>
                <h4 className="font-semibold text-accent mb-2 text-lg flex items-center">
                    <Icons.CheckCircleSolidIcon className="w-5 h-5 mr-2" />
                    {t('policy.common.covered')}
                </h4>
                <ul className="space-y-3">
                    {policy.coverage.summary.map(item => (
                        <li key={item.key} className="flex items-start bg-green-50 p-3 rounded-lg">
                            <span className="text-text-primary font-medium">{t(item.key)}</span>
                            {item.value && <span className="text-text-secondary ml-auto text-sm">{item.value}</span>}
                        </li>
                    ))}
                </ul>
            </div>
             <div className="border-t border-slate-200 my-4"></div>
             <div>
                <h4 className="font-semibold text-danger mb-2 text-lg flex items-center">
                    <Icons.XCircleIcon className="w-5 h-5 mr-2" />
                    {t('policy.common.notCovered')}
                </h4>
                 <ul className="space-y-3">
                    {policy.coverage.notCovered.map(itemKey => (
                        <li key={itemKey} className="flex items-start bg-red-50 p-3 rounded-lg text-sm text-text-secondary">
                            {t(itemKey)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const BenefitsTabContent: React.FC<{ policy: InsuranceProduct }> = ({ policy }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6 animate-fade-in-fast">
            {policy.benefits.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-text-primary mb-4">{t('policy.common.benefitsTitle')}</h3>
                    <ul className="space-y-3">
                        {policy.benefits.map(itemKey => (
                            <li key={itemKey} className="flex items-start">
                                <Icons.SparklesIcon className="w-5 h-5 text-highlight mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-text-secondary">{t(itemKey)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             {policy.eligibility.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-text-primary mb-4">{t('policy.common.eligibilityTitle')}</h3>
                    <ul className="space-y-2">
                        {policy.eligibility.map(itemKey => (
                            <li key={itemKey} className="flex items-start">
                                <Icons.CheckIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-text-secondary">{t(itemKey)}</span>
                             </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

interface RoiGraphProps {
    policy: InsuranceProduct;
}

const STACK_COLORS: { [key: string]: string } = {
    premium: 'bg-slate-300',
    pending: 'bg-slate-200',
    coverage: 'bg-primary', // Standard coverage color
    // ... specific ones
    income: 'bg-primary',
    bonus: 'bg-highlight',
    default: 'bg-primary',
};

const RoiGraph: React.FC<RoiGraphProps> = ({ policy }) => {
    const { t } = useTranslation();
    const [activeTooltip, setActiveTooltip] = useState<RoiGraphData | null>(null);

    const { titleKey, xAxisKey, yAxisKey, legend, data, type } = policy.roiGraph;

    const maxTotalValue = useMemo(() => {
        return Math.max(...data.map(d => Object.values(d.stacks).reduce((a: number, b: number) => a + b, 0)), 1);
    }, [data]);
    
    const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

    return (
        <div className="bg-surface rounded-2xl shadow-lg p-6 animate-scale-in">
            <h3 className="font-bold text-lg text-text-primary mb-2">{t(titleKey)}</h3>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4 text-xs">
                {Object.entries(legend).filter(([key]) => key !== 'roi').map(([key, valueKey]) => (
                    <div key={key} className="flex items-center">
                         <div className={`w-3 h-3 rounded-sm ${STACK_COLORS[key] || STACK_COLORS.default} mr-1.5`}></div>
                         <span>{t(valueKey as string)}</span>
                    </div>
                ))}
            </div>

            <div className="relative h-56 flex items-end px-4 pt-8">
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-text-secondary">{t(yAxisKey)}</span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-text-secondary">{t(xAxisKey)}</span>
                
                <div className="w-full h-full border-l border-b border-gray-200 flex items-end justify-around">
                    {data.map((d, dataIndex) => (
                        <div key={d.label} className="h-full flex-1 flex items-end justify-center relative group" onMouseLeave={() => setActiveTooltip(null)} onMouseEnter={() => setActiveTooltip(d)}>
                            <div className={`w-8 md:w-12 h-full flex flex-col-reverse ${type === 'area' ? 'opacity-70' : ''}`}>
                                {Object.entries(d.stacks).map(([key, value]) => (
                                    <div 
                                        key={key}
                                        className={`${STACK_COLORS[key] || STACK_COLORS.default} transition-all duration-500 ease-out ${type === 'bar' ? 'first:rounded-t-md last:rounded-b-md' : ''}`}
                                        style={{ height: `${((value as number) / maxTotalValue) * 100}%`, animation: `grow 0.8s ${dataIndex * 0.1}s ease-out forwards`, transformOrigin: 'bottom' }}
                                    ></div>
                                ))}
                            </div>
                            <span className="absolute -bottom-5 text-xs text-text-secondary whitespace-nowrap">{d.label}</span>
                            
                            {/* ROI Badge */}
                            {d.roi > 0 && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {d.roi}x ROI
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {activeTooltip && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none animate-fade-in-fast shadow-lg z-10 whitespace-nowrap">
                       {Object.entries(activeTooltip.stacks).map(([key, value]) => (
                           <div key={key}>{t(legend[key])}: {formatCurrency(value as number)}</div>
                       ))}
                    </div>
                )}
            </div>
             <style>{`
                @keyframes grow {
                    0% { transform: scaleY(0); }
                    100% { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default PolicyDetailScreen;
