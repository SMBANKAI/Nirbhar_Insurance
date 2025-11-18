
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { PhoneIcon, ShieldExclamationIcon, MapPinIcon } from '../../../ui/Icons';

interface SosScreenProps {
    onClose: () => void;
}

const SosScreen: React.FC<SosScreenProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location for SOS", error);
            }
        );
    }, []);

    const officialContacts = [
        { name: t('sos.ambulance'), number: '102' },
        { name: t('sos.police'), number: '100' },
        { name: t('sos.assistant'), number: '1800-456-7890' },
        { name: t('sos.insurance'), number: '1800-123-4567' },
    ];
    
    const personalContacts = [
        { name: 'Ramesh Kumar (Nominee)', number: '+91 98765 43210' },
        { name: 'Sunita Devi (Spouse)', number: '+91 91234 56789' },
    ];

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
            <header className="p-4 flex items-center border-b bg-white sticky top-0">
                <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-text-primary">{t('sos.title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                
                <a href="tel:112" className="block text-center bg-gradient-to-br from-red-500 to-danger text-white rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                    <ShieldExclamationIcon className="w-16 h-16 mx-auto mb-2" />
                    <h2 className="text-3xl font-bold">SOS</h2>
                    <p className="opacity-80">Tap to call National Emergency Line (112)</p>
                </a>
                
                {location && (
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <h3 className="font-bold text-text-primary mb-2 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-primary" /> Your Location</h3>
                        <p className="text-text-secondary font-mono text-sm">{location.lat.toFixed(6)}, {location.lon.toFixed(6)}</p>
                    </div>
                )}
                
                <div>
                    <h3 className="font-bold text-lg text-text-primary px-2 mb-2">Official Contacts</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {officialContacts.map(contact => (
                            <ContactCard key={contact.name} name={contact.name} number={contact.number} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-text-primary px-2 mb-2">Personal Contacts</h3>
                     <div className="space-y-3">
                        {personalContacts.map(contact => (
                            <ContactCard key={contact.name} name={contact.name} number={contact.number} fullWidth />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

const ContactCard: React.FC<{ name: string, number: string, fullWidth?: boolean }> = ({ name, number, fullWidth }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-4 ${fullWidth ? 'col-span-2 flex items-center justify-between' : 'text-center'}`}>
        <div>
            <p className={`font-bold text-text-primary ${!fullWidth ? '' : 'text-left'}`}>{name}</p>
            <p className={`text-sm text-text-secondary ${!fullWidth ? 'mb-3' : 'text-left'}`}>{number}</p>
        </div>
        <a href={`tel:${number}`} className={`inline-flex items-center justify-center gap-2 bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors ${!fullWidth ? 'w-full' : ''}`}>
            <PhoneIcon className="w-4 h-4" /> Call
        </a>
    </div>
);

export default SosScreen;
