import React, { useState } from 'react';
import { SaveScreenView, SavingsAccount } from '../../../types';
import SaveHomeScreen from './save/SaveHomeScreen';
import SavingsDistributionPie from './save/SavingsDistributionPie';
import PlanBuilder from './save/PlanBuilder';
import { SAVINGS_ACCOUNTS } from '../../../constants';
import WithdrawalModal from './save/WithdrawalModal';

const SaveScreen: React.FC = () => {
    const [view, setView] = useState<SaveScreenView>(SaveScreenView.Home);
    const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
    const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>(SAVINGS_ACCOUNTS);
    const [accountForPlan, setAccountForPlan] = useState<SavingsAccount | null>(null);
    const [accountForWithdrawal, setAccountForWithdrawal] = useState<SavingsAccount | null>(null);

    const handleNavigate = (targetView: SaveScreenView) => {
        setView(targetView);
    };

    const openPlanBuilder = (accountId: string) => {
        const account = savingsAccounts.find(acc => acc.id === accountId);
        if (account) {
            setAccountForPlan(account);
            setIsPlanBuilderOpen(true);
        }
    };
    
    const closePlanBuilder = () => {
        setIsPlanBuilderOpen(false);
        setAccountForPlan(null);
    };

    const handlePlanCreated = (accountId: string) => {
        setSavingsAccounts(prevAccounts => 
            prevAccounts.map(acc => 
                acc.id === accountId ? { ...acc, planActive: true } : acc
            )
        );
        closePlanBuilder();
    };

    const openWithdrawalModal = (account: SavingsAccount) => {
        setAccountForWithdrawal(account);
    };

    const closeWithdrawalModal = () => {
        setAccountForWithdrawal(null);
    };

    const handleWithdrawal = (accountId: string, amount: number) => {
        setSavingsAccounts(prev => 
            prev.map(acc => 
                acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc
            )
        );
        closeWithdrawalModal();
    };


    const renderView = () => {
        switch (view) {
            case SaveScreenView.Home:
                return <SaveHomeScreen savingsAccounts={savingsAccounts} onNavigate={handleNavigate} onStartPlan={openPlanBuilder} onStartWithdrawal={openWithdrawalModal} />;
            case SaveScreenView.Chart:
                return <SavingsDistributionPie onNavigate={handleNavigate} />;
            default:
                return <SaveHomeScreen savingsAccounts={savingsAccounts} onNavigate={handleNavigate} onStartPlan={openPlanBuilder} onStartWithdrawal={openWithdrawalModal} />;
        }
    };

    return (
        <div className="relative">
            {renderView()}
            {isPlanBuilderOpen && accountForPlan && <PlanBuilder account={accountForPlan} onClose={closePlanBuilder} onPlanCreated={() => handlePlanCreated(accountForPlan.id)} />}
            {accountForWithdrawal && <WithdrawalModal account={accountForWithdrawal} onConfirm={handleWithdrawal} onClose={closeWithdrawalModal} />}
        </div>
    );
};

export default SaveScreen;