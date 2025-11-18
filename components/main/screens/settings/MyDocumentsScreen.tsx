import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { USER_DOCUMENTS } from '../../../../constants';
import { IdentificationIcon, CheckCircleIcon, ClockIcon } from '../../../ui/Icons';

interface MyDocumentsScreenProps {
    onClose: () => void;
}

const MyDocumentsScreen: React.FC<MyDocumentsScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('myDocuments.title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-3">
                {USER_DOCUMENTS.map(doc => (
                    <div key={doc.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                                <IdentificationIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-text-primary">{t(doc.nameKey)}</p>
                                {doc.status === 'verified' ? (
                                    <div className="flex items-center text-sm text-accent">
                                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                                        <span>{t('myDocuments.verified')}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-sm text-yellow-600">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        <span>{t('myDocuments.pending')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                         <button className="text-primary font-bold text-sm">View</button>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default MyDocumentsScreen;
