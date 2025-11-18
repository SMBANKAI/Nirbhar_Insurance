import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface NomineeScreenProps {
    onClose: () => void;
}

const NomineeScreen: React.FC<NomineeScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phone, setPhone] = useState('');

    const handleSave = () => {
        if (!name.trim() || !relationship.trim() || !phone.trim()) {
            alert('Please fill out all fields.');
            return;
        }
        console.log({
            nomineeName: name,
            relationship,
            phone,
        });
        alert('Nominee details saved!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('nominee.title')}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">
                                    {t('nominee.form.nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('nominee.form.namePlaceholder')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="relationship" className="block text-sm font-medium text-text-secondary mb-1">
                                    {t('nominee.form.relationshipLabel')}
                                </label>
                                <input
                                    type="text"
                                    id="relationship"
                                    value={relationship}
                                    onChange={(e) => setRelationship(e.target.value)}
                                    placeholder={t('nominee.form.relationshipPlaceholder')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">
                                    {t('nominee.form.phoneLabel')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={t('nominee.form.phonePlaceholder')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
                <button 
                    onClick={handleSave}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors text-lg"
                >
                    {t('nominee.form.saveButton')}
                </button>
            </footer>
        </div>
    );
};

export default NomineeScreen;
