import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import type { InsuranceProduct, PolicyClaimInfo, ClaimScenario, ClaimDocument } from '../../../../types';
import { CLAIM_DOCUMENTS_MAP } from '../../../../constants';

interface ClaimFilingScreenProps {
    policy: InsuranceProduct;
    onClose: () => void;
}

const ClaimFilingScreen: React.FC<ClaimFilingScreenProps> = ({ policy, onClose }) => {
    const { t } = useTranslation();
    const [selectedScenario, setSelectedScenario] = useState<ClaimScenario | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
    const [isSubmitted, setIsSubmitted] = useState(false);

    const claimInfo = useMemo(() => {
        return CLAIM_DOCUMENTS_MAP.find(p => p.policyId === policy.id);
    }, [policy.id]);

    const documentsToList = useMemo(() => {
        if (!claimInfo) return [];
        if (claimInfo.scenarios) {
            return selectedScenario ? selectedScenario.documents : [];
        }
        return claimInfo.documents || [];
    }, [claimInfo, selectedScenario]);

    const handleUpload = (docKey: string) => {
        // Simulate upload
        setUploadedDocs(prev => new Set(prev).add(docKey));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-primary text-center">{t('claims.filing.successMessage')}</h2>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('claims.filing.title')} {t(policy.productNameKey)}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                {claimInfo?.scenarios && !selectedScenario && (
                    <ScenarioSelector scenarios={claimInfo.scenarios} onSelect={setSelectedScenario} />
                )}

                {(documentsToList.length > 0) && (
                    <DocumentUploader 
                        documents={documentsToList} 
                        uploadedDocs={uploadedDocs}
                        onUpload={handleUpload}
                    />
                )}
            </main>

            {documentsToList.length > 0 && (
                 <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
                     <button 
                        onClick={handleSubmit}
                        disabled={uploadedDocs.size !== documentsToList.length}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors text-lg disabled:bg-gray-400"
                    >
                        {t('claims.filing.submitButton')}
                    </button>
                </footer>
            )}
        </div>
    );
};

const ScenarioSelector: React.FC<{ scenarios: ClaimScenario[], onSelect: (s: ClaimScenario) => void }> = ({ scenarios, onSelect }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 text-center">{t('claims.filing.scenarioTitle')}</h2>
            <div className="space-y-3">
                {scenarios.map(scenario => (
                    <button 
                        key={scenario.key}
                        onClick={() => onSelect(scenario)}
                        className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors font-semibold"
                    >
                        {t(scenario.nameKey)}
                    </button>
                ))}
            </div>
        </div>
    );
};

const DocumentUploader: React.FC<{ documents: ClaimDocument[], uploadedDocs: Set<string>, onUpload: (key: string) => void }> = ({ documents, uploadedDocs, onUpload }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
             <h2 className="text-lg font-bold text-text-primary mb-4">{t('claims.filing.documentsTitle')}</h2>
             <ul className="divide-y divide-gray-200">
                {documents.map(doc => (
                    <li key={doc.key} className="py-3 flex items-center justify-between">
                        <span className="text-text-secondary">{t(doc.nameKey)}</span>
                        {uploadedDocs.has(doc.key) ? (
                            <div className="flex items-center text-accent font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Uploaded
                            </div>
                        ) : (
                             <button onClick={() => onUpload(doc.key)} className="text-primary font-bold text-sm">
                                {t('claims.filing.uploadButton')}
                            </button>
                        )}
                    </li>
                ))}
             </ul>
        </div>
    );
};

export default ClaimFilingScreen;
