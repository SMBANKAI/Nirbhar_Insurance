import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { XMarkIcon, CheckCircleIcon, GiftIcon, ArrowPathIcon, ShieldCheckIcon } from '../../ui/Icons';

interface NotificationsPanelProps {
    onClose: () => void;
}

type NotificationType = 'savings' | 'reward' | 'kyc' | 'reminder' | 'claim';

interface Notification {
    id: number;
    type: NotificationType;
    icon: React.FC<{ className?: string }>;
    iconColor: string;
    params?: { [key: string]: string | number };
    time: string;
}

// Mock data for demonstration purposes
const mockNotifications: Notification[] = [
    { id: 1, type: 'savings', icon: CheckCircleIcon, iconColor: 'text-accent', params: { amount: 10 }, time: '2 hours ago' },
    { id: 2, type: 'reward', icon: GiftIcon, iconColor: 'text-highlight', params: { points: 50 }, time: '1 day ago' },
    { id: 3, type: 'kyc', icon: CheckCircleIcon, iconColor: 'text-accent', time: '2 days ago' },
    { id: 4, type: 'reminder', icon: ShieldCheckIcon, iconColor: 'text-secondary', params: { policyName: 'Daily Accident Cover' }, time: '3 days ago' },
    { id: 5, type: 'claim', icon: ArrowPathIcon, iconColor: 'text-primary', params: { policyName: 'Micro Health Floater' }, time: '4 days ago' },
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black/40 z-40" role="dialog" aria-modal="true">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
            
            <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-background flex flex-col shadow-2xl animate-slide-in-right">
                <header className="p-4 flex justify-between items-center border-b bg-surface sticky top-0">
                    <h2 className="text-xl font-bold text-text-primary">{t('notifications.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-6 h-6 text-text-secondary" />
                    </button>
                </header>
                
                <main className="flex-1 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {mockNotifications.map(notification => (
                                <li key={notification.id} className="p-4 flex items-start space-x-4 hover:bg-slate-50">
                                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-opacity-10 ${notification.iconColor.replace('text-', 'bg-')}`}>
                                        <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-primary">{t(`notifications.type.${notification.type}`)}</h3>
                                        <p className="text-sm text-text-secondary mt-0.5">{t(`notifications.body.${notification.type}`, notification.params)}</p>
                                        <p className="text-xs text-text-tertiary mt-1">{notification.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-text-secondary p-8">
                            <p>{t('notifications.empty')}</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default NotificationsPanel;
