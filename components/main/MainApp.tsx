
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, InsuranceProduct, ActivePolicy, TransactionScreenView } from '../../types';
import { NirbharLogo, BellIcon, HomeIcon, CompassIcon, DocumentTextIcon, IdentificationIcon, ExclamationCircleIcon, CurrencyRupeeIcon, Cog6ToothIcon, ChevronDownIcon, CheckIcon, ShieldCheckIcon, DocumentDuplicateIcon, GiftIcon, UsersIcon, GlobeAltIcon, QuestionMarkCircleIcon, UserPlusIcon, TicketIcon, ArrowLeftOnRectangleIcon } from '../ui/Icons';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import SaveScreen from './screens/SaveScreen';
import { useTranslation } from '../../hooks/useTranslation';
import OnboardingTour from './features/OnboardingTour';
import PolicyDetailScreen from './screens/PolicyDetailScreen';
import { INSURANCE_PRODUCTS, LANGUAGES } from '../../constants';
import NomineeScreen from './screens/NomineeScreen';
import PromoCodeScreen from './screens/PromoCodeScreen';
import PremiumScheduler from './screens/PremiumScheduler';
import ClaimFilingScreen from './screens/claims/ClaimFilingScreen';
import KycFlow from './features/KycFlow';
import NotificationsPanel from './features/NotificationsPanel';
import RenewPolicyDetailScreen from './screens/renew/RenewPolicyDetailScreen';
import SosScreen from './screens/settings/SosScreen';
import MyPoliciesScreen from './screens/settings/MyPoliciesScreen';
import MyDocumentsScreen from './screens/settings/MyDocumentsScreen';
import ManageUpiScreen from './screens/settings/ManageUpiScreen';
import RewardsScreen from './screens/settings/RewardsScreen';

// Placeholder for analytics
const logAnalyticsEvent = (eventName: string, params: object) => {
    console.log(`[Analytics] Event: ${eventName}`, params);
};

type KycStatus = 'not_started' | 'verified';

const MainApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeScreen, setActiveScreen] = useState<AppScreen>(AppScreen.Home);
    const [isTourActive, setIsTourActive] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<InsuranceProduct | null>(null);
    const [isNomineeScreenOpen, setIsNomineeScreenOpen] = useState(false);
    const [isPromoCodeScreenOpen, setIsPromoCodeScreenOpen] = useState(false);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [policyForScheduler, setPolicyForScheduler] = useState<InsuranceProduct | null>(null);
    const [isClaimFilingOpen, setIsClaimFilingOpen] = useState(false);
    const [policyForClaim, setPolicyForClaim] = useState<InsuranceProduct | null>(null);
    const [isKycFlowOpen, setIsKycFlowOpen] = useState(false);
    const [kycStatus, setKycStatus] = useState<KycStatus>('not_started');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const [isRenewPolicyOpen, setIsRenewPolicyOpen] = useState(false);
    const [policyForRenewal, setPolicyForRenewal] = useState<InsuranceProduct | null>(null);
    const [activePolicies, setActivePolicies] = useState<ActivePolicy[]>([]); // Store purchased policies here
    const { t } = useTranslation();

    // State for new settings screens
    const [isSosOpen, setIsSosOpen] = useState(false);
    const [isMyPoliciesOpen, setIsMyPoliciesOpen] = useState(false);
    const [isMyDocumentsOpen, setIsMyDocumentsOpen] = useState(false);
    const [isManageUpiOpen, setIsManageUpiOpen] = useState(false);
    const [isRewardsOpen, setIsRewardsOpen] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [transactionScreenView, setTransactionScreenView] = useState<TransactionScreenView>(TransactionScreenView.Portfolio); // Default to Portfolio

    useEffect(() => {
        const tourCompleted = localStorage.getItem('nirbhar_tour_completed');
        if (!tourCompleted) {
            setIsTourActive(true);
        }

        const savedPoints = parseInt(localStorage.getItem('nirbhar_total_points') || '0', 10);
        setTotalPoints(savedPoints);

        const reminderTime = localStorage.getItem('nirbhar_savings_reminder_time');
        if (reminderTime) {
            const now = new Date();
            const [hours, minutes] = reminderTime.split(':').map(Number);
            
            const reminderDate = new Date();
            reminderDate.setHours(hours, minutes, 0, 0);

            if (reminderDate > now) {
                const timeout = reminderDate.getTime() - now.getTime();
                const timerId = setTimeout(() => {
                    alert(t('reminders.notification'));
                }, timeout);
                return () => clearTimeout(timerId);
            }
        }
    }, [t]);

    const handleTourFinish = () => {
        localStorage.setItem('nirbhar_tour_completed', 'true');
        setIsTourActive(false);
        // Refresh points after tour is finished
        const savedPoints = parseInt(localStorage.getItem('nirbhar_total_points') || '0', 10);
        setTotalPoints(savedPoints);
    };
    
    const handleSelectPolicy = (policyId: number) => {
        const policy = INSURANCE_PRODUCTS.find(p => p.id === policyId);
        if (policy) {
            setSelectedPolicy(policy);
        }
    };
    
    const handleToggleNotifications = () => {
        setIsNotificationsOpen(prev => !prev);
        if (hasUnreadNotifications) {
            setHasUnreadNotifications(false);
        }
    };

    const handleCloseNotifications = () => {
        setIsNotificationsOpen(false);
    };

    const handleClosePolicy = () => setSelectedPolicy(null);
    const handleOpenNomineeScreen = () => setIsNomineeScreenOpen(true);
    const handleCloseNomineeScreen = () => setIsNomineeScreenOpen(false);
    const handleOpenPromoCodeScreen = () => setIsPromoCodeScreenOpen(true);
    const handleClosePromoCodeScreen = () => setIsPromoCodeScreenOpen(false);

    const handleOpenScheduler = (policy: InsuranceProduct) => {
        setPolicyForScheduler(policy);
        setIsSchedulerOpen(true);
        handleClosePolicy(); // Close detailed view when opening scheduler
    };

    const handleCloseScheduler = () => {
        setIsSchedulerOpen(false);
        setPolicyForScheduler(null);
    };
    
    const handlePurchasePolicy = (policy: InsuranceProduct, amount: number) => {
        const newPolicy: ActivePolicy = {
            id: `POL-${Date.now()}`,
            policyId: policy.id,
            purchaseDate: new Date().toLocaleDateString(),
            premiumAmount: amount,
            nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(), // Next day
            status: 'active'
        };
        setActivePolicies(prev => [...prev, newPolicy]);
        
        // Navigate to Portfolio to show the new purchase
        setActiveScreen(AppScreen.Transactions);
        setTransactionScreenView(TransactionScreenView.Portfolio);
        handleCloseScheduler();
    };

    const handleOpenFileClaim = (policyId: number) => {
        const policy = INSURANCE_PRODUCTS.find(p => p.id === policyId);
        if (policy) {
            setPolicyForClaim(policy);
            setIsClaimFilingOpen(true);
        }
    };
    
    const handleCloseFileClaim = () => {
        setIsClaimFilingOpen(false);
        setPolicyForClaim(null);
    };

    const handleOpenRenewPolicy = (policyId: number) => {
        const policy = INSURANCE_PRODUCTS.find(p => p.id === policyId);
        if (policy) {
            setPolicyForRenewal(policy);
            setIsRenewPolicyOpen(true);
        }
    };

    const handleCloseRenewPolicy = () => {
        setIsRenewPolicyOpen(false);
        setPolicyForRenewal(null);
    };

    const handleCompleteKyc = () => {
        setKycStatus('verified');
        setIsKycFlowOpen(false);
    };

    // Handlers for new screens
    const handleOpenSos = () => setIsSosOpen(true);
    const handleCloseSos = () => setIsSosOpen(false);
    const handleOpenMyPolicies = () => setIsMyPoliciesOpen(true);
    const handleCloseMyPolicies = () => setIsMyPoliciesOpen(false);
    const handleOpenMyDocuments = () => setIsMyDocumentsOpen(true);
    const handleCloseMyDocuments = () => setIsMyDocumentsOpen(false);
    const handleOpenManageUpi = () => setIsManageUpiOpen(true);
    const handleCloseManageUpi = () => setIsManageUpiOpen(false);
    const handleOpenRewards = () => setIsRewardsOpen(true);
    const handleCloseRewards = () => setIsRewardsOpen(false);
    const handleNavigateToTransactions = () => {
        setActiveScreen(AppScreen.Transactions);
        setTransactionScreenView(TransactionScreenView.Transactions);
    }
    
    useEffect(() => {
        if (activeScreen === AppScreen.Save) {
            logAnalyticsEvent('save_tab_opened', {});
        }
    }, [activeScreen]);

    const renderScreen = () => {
        switch (activeScreen) {
            case AppScreen.Home:
                return <HomeScreen onSelectPolicy={handleSelectPolicy} onNavigate={setActiveScreen} onOpenKyc={() => setIsKycFlowOpen(true)} kycStatus={kycStatus} />;
            case AppScreen.Explore:
                return <ExploreScreen />;
            case AppScreen.Save:
                return <SaveScreen />;
            case AppScreen.Transactions:
                return <TransactionsScreen activePolicies={activePolicies} initialView={transactionScreenView} onFileClaim={handleOpenFileClaim} onRenewPolicy={handleOpenRenewPolicy} />;
            default:
                return <HomeScreen onSelectPolicy={handleSelectPolicy} onNavigate={setActiveScreen} onOpenKyc={() => setIsKycFlowOpen(true)} kycStatus={kycStatus} />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header 
                onLogoClick={() => setActiveScreen(AppScreen.Home)}
                onOpenNominee={handleOpenNomineeScreen} 
                onOpenPromoCode={handleOpenPromoCodeScreen}
                onToggleNotifications={handleToggleNotifications}
                hasUnreadNotifications={hasUnreadNotifications}
                onOpenSos={handleOpenSos}
                onOpenMyPolicies={handleOpenMyPolicies}
                onOpenMyDocuments={handleOpenMyDocuments}
                onOpenManageUpi={handleOpenManageUpi}
                onOpenRewards={handleOpenRewards}
                onNavigateToTransactions={handleNavigateToTransactions}
                onLogout={onLogout}
            />
            <main className="flex-1 overflow-y-auto pb-24">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            {isTourActive && <OnboardingTour onFinish={handleTourFinish} />}
            {selectedPolicy && <PolicyDetailScreen policy={selectedPolicy} onClose={handleClosePolicy} onOpenScheduler={handleOpenScheduler} />}
            {isNomineeScreenOpen && <NomineeScreen onClose={handleCloseNomineeScreen} />}
            {isPromoCodeScreenOpen && <PromoCodeScreen onClose={handleClosePromoCodeScreen} />}
            {isSchedulerOpen && policyForScheduler && <PremiumScheduler policy={policyForScheduler} onClose={handleCloseScheduler} onPurchaseSuccess={(amount) => handlePurchasePolicy(policyForScheduler, amount)} />}
            {isClaimFilingOpen && policyForClaim && <ClaimFilingScreen policy={policyForClaim} onClose={handleCloseFileClaim} />}
            {isKycFlowOpen && <KycFlow onComplete={handleCompleteKyc} onClose={() => setIsKycFlowOpen(false)} />}
            {isNotificationsOpen && <NotificationsPanel onClose={handleCloseNotifications} />}
            {isRenewPolicyOpen && policyForRenewal && <RenewPolicyDetailScreen policy={policyForRenewal} onClose={handleCloseRenewPolicy} />}
            {isSosOpen && <SosScreen onClose={handleCloseSos} />}
            {isMyPoliciesOpen && <MyPoliciesScreen onClose={handleCloseMyPolicies} />}
            {isMyDocumentsOpen && <MyDocumentsScreen onClose={handleCloseMyDocuments} />}
            {isManageUpiOpen && <ManageUpiScreen onClose={handleCloseManageUpi} />}
            {isRewardsOpen && <RewardsScreen totalPoints={totalPoints} onClose={handleCloseRewards} />}
        </div>
    );
};

const MenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isDanger?: boolean;
    children?: React.ReactNode;
    className?: string;
}> = ({ icon, label, onClick, isDanger = false, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`w-full text-left flex items-center px-3 py-2 text-sm transition-colors rounded-lg ${
            isDanger
                ? 'text-danger hover:bg-red-50'
                : 'text-text-primary hover:bg-slate-100'
        } ${className}`}
    >
        <div className={`mr-3 w-5 flex justify-center ${isDanger ? 'text-danger' : 'text-text-secondary'}`}>
            {icon}
        </div>
        <span className="flex-1 font-medium">{label}</span>
        {children}
    </button>
);


const Header: React.FC<{
    onLogoClick: () => void; 
    onOpenNominee: () => void; 
    onOpenPromoCode: () => void;
    onToggleNotifications: () => void;
    hasUnreadNotifications: boolean;
    onOpenSos: () => void;
    onOpenMyPolicies: () => void;
    onOpenMyDocuments: () => void;
    onOpenManageUpi: () => void;
    onOpenRewards: () => void;
    onNavigateToTransactions: () => void;
    onLogout: () => void;
}> = ({ onLogoClick, onOpenNominee, onOpenPromoCode, onToggleNotifications, hasUnreadNotifications, onOpenSos, onOpenMyPolicies, onOpenMyDocuments, onOpenManageUpi, onOpenRewards, onNavigateToTransactions, onLogout }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    const { t, language, setLanguage } = useTranslation();

    const handleMenuItemClick = (action: () => void) => {
        action();
        setIsSettingsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-surface/80 backdrop-blur-lg border-b border-slate-200/50 p-4 flex justify-between items-center sticky top-0 z-20">
            <button onClick={onLogoClick} className="flex items-center gap-2">
                <NirbharLogo className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-text-primary">Nirbhar</h1>
            </button>
            <div className="flex items-center space-x-1">
                <button onClick={onToggleNotifications} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors relative">
                    <BellIcon className="w-6 h-6 text-text-primary" />
                    {hasUnreadNotifications && <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-danger animate-pulse"></span>}
                </button>
                <div className="relative" ref={settingsMenuRef}>
                    <button data-tour-id="tour-step-settings" onClick={() => setIsSettingsOpen(prev => !prev)} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors">
                        <Cog6ToothIcon className="w-6 h-6 text-text-primary" />
                    </button>
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-surface rounded-2xl shadow-xl z-30 animate-fade-in-fast border border-slate-100 p-2">
                            {/* Profile Section */}
                            <MenuItem icon={<IdentificationIcon className="w-5 h-5"/>} label={t('profileMenu.accountDetails')} />
                            <MenuItem icon={<UserPlusIcon className="w-5 h-5"/>} label={t('settings.addNominee')} onClick={() => handleMenuItemClick(onOpenNominee)} />

                            <div className="border-t my-2 border-slate-100"></div>

                            {/* My Nirbhar Section */}
                            <div className="px-3 pt-1 pb-1 text-xs font-semibold text-text-tertiary uppercase tracking-wider">My Nirbhar</div>
                            <MenuItem icon={<ShieldCheckIcon className="w-5 h-5"/>} label={t('profileMenu.myPolicies')} onClick={() => handleMenuItemClick(onOpenMyPolicies)} />
                            <MenuItem icon={<DocumentTextIcon className="w-5 h-5"/>} label={t('profileMenu.transactions')} onClick={() => handleMenuItemClick(onNavigateToTransactions)} />
                            <MenuItem icon={<DocumentDuplicateIcon className="w-5 h-5"/>} label={t('profileMenu.myDocuments')} onClick={() => handleMenuItemClick(onOpenMyDocuments)} />
                            <MenuItem icon={<CurrencyRupeeIcon className="w-5 h-5"/>} label={t('profileMenu.manageUpi')} onClick={() => handleMenuItemClick(onOpenManageUpi)} />

                            <div className="border-t my-2 border-slate-100"></div>
                            
                            {/* App Section */}
                            <MenuItem icon={<GiftIcon className="w-5 h-5"/>} label={t('profileMenu.rewards')} onClick={() => handleMenuItemClick(onOpenRewards)} />
                            <MenuItem icon={<UsersIcon className="w-5 h-5"/>} label={t('profileMenu.referFriend')} />
                            <MenuItem icon={<TicketIcon className="w-5 h-5"/>} label={t('settings.promoCode')} onClick={() => handleMenuItemClick(onOpenPromoCode)} />
                            
                            <div className="border-t my-2 border-slate-100"></div>
                            
                            {/* Settings & Support */}
                            <MenuItem icon={<BellIcon className="w-5 h-5"/>} label={t('settings.notifications')} />
                            <div className="relative">
                                <MenuItem 
                                    icon={<GlobeAltIcon className="w-5 h-5" />} 
                                    label={t('settings.changeLanguage')}
                                    onClick={() => setIsLangMenuOpen(prev => !prev)}
                                >
                                    <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                                </MenuItem>
                                {isLangMenuOpen && (
                                    <div className="pl-8 pt-1 space-y-1">
                                        {LANGUAGES.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => { setLanguage(lang.code); setIsLangMenuOpen(false); }}
                                                className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-slate-100 rounded-lg"
                                            >
                                                <span>{lang.name}</span>
                                                {language === lang.code && <CheckIcon className="w-5 h-5 text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <MenuItem icon={<QuestionMarkCircleIcon className="w-5 h-5"/>} label={t('profileMenu.helpSupport')} />

                            <div className="border-t my-2 border-slate-100"></div>
                             
                            {/* Actions */}
                            <MenuItem icon={<ExclamationCircleIcon className="w-5 h-5"/>} label={t('profileMenu.sos')} onClick={() => handleMenuItemClick(onOpenSos)} isDanger />
                            <MenuItem icon={<ArrowLeftOnRectangleIcon className="w-5 h-5"/>} label={t('settings.logout')} isDanger onClick={() => handleMenuItemClick(onLogout)} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


interface BottomNavProps {
    activeScreen: AppScreen;
    setActiveScreen: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    const { t } = useTranslation();
    const navItems = [
        { screen: AppScreen.Home, label: t('nav.home'), icon: HomeIcon, tourId: 'tour-step-1' },
        { screen: AppScreen.Explore, label: t('nav.explore'), icon: CompassIcon, tourId: 'tour-step-3' },
        { screen: AppScreen.Save, label: t('nav.save'), icon: CurrencyRupeeIcon, tourId: 'tour-step-save' },
        { screen: AppScreen.Transactions, label: t('nav.transactions'), icon: DocumentTextIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-slate-200/50 flex justify-around p-2 z-10">
            {navItems.map(item => (
                <button
                    key={item.label}
                    data-tour-id={item.tourId}
                    onClick={() => setActiveScreen(item.screen)}
                    className={`flex flex-col items-center justify-center w-full rounded-xl py-1 transition-all duration-300 relative ${
                        activeScreen === item.screen ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                    }`}
                    role="tab"
                    aria-selected={activeScreen === item.screen}
                >
                    <item.icon className="w-7 h-7 mb-0.5" />
                    <span className="text-xs font-semibold">{item.label}</span>
                    {activeScreen === item.screen && (
                        <div className="absolute -bottom-2 h-1 w-8 bg-primary rounded-full"></div>
                    )}
                </button>
            ))}
        </nav>
    );
};

export default MainApp;
