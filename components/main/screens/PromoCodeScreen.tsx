import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface PromoCodeScreenProps {
    onClose: () => void;
}

const PromoCodeScreen: React.FC<PromoCodeScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [code, setCode] = useState('');

    const handleApply = () => {
        if (!code.trim()) {
            return;
        }
        // Dummy validation
        if (code.trim().toUpperCase() === 'NIRBHAR50') {
             alert(t('promo.success'));
        } else {
             alert(t('promo.invalid'));
        }
        setCode('');
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('promo.title')}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <form onSubmit={(e) => { e.preventDefault(); handleApply(); }}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={t('promo.placeholder')}
                                className="w-full text-center text-lg px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary tracking-widest"
                                required
                            />
                        </div>
                    </form>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
                <button 
                    onClick={handleApply}
                    disabled={!code.trim()}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors text-lg disabled:bg-gray-400"
                >
                    {t('promo.button')}
                </button>
            </footer>
        </div>
    );
};

export default PromoCodeScreen;