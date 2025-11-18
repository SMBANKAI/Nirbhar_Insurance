import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { SaveScreenView, DistributionDataPoint, SavingsTransaction } from '../../../../types';
import { DISTRIBUTION_DATA, SAVINGS_TRANSACTIONS } from '../../../../constants';
import { PencilSquareIcon, TrashIcon } from '../../../ui/Icons';

interface SavingsDistributionPieProps {
    onNavigate: (view: SaveScreenView) => void;
}

const SavingsDistributionPie: React.FC<SavingsDistributionPieProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<string[]>(() => DISTRIBUTION_DATA.map(d => d.id));
    
    const filteredData = useMemo(() => {
        return DISTRIBUTION_DATA.filter(d => visibleCategories.includes(d.id));
    }, [visibleCategories]);

    const totalBalance = useMemo(() => {
        return filteredData.reduce((sum, item) => sum + item.value, 0);
    }, [filteredData]);

    const filteredTransactions = useMemo(() => {
        if (activeIndex === null) return null; // Return null to show all transactions
        const activeCategory = filteredData[activeIndex];
        if (!activeCategory) return null;
        return SAVINGS_TRANSACTIONS.filter(tx => tx.accountId === activeCategory.id);
    }, [activeIndex, filteredData]);
    
    const toggleCategory = (id: string) => {
        setVisibleCategories(prev => 
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
        setActiveIndex(null);
    };

    return (
        <div className="p-4">
             <button onClick={() => onNavigate(SaveScreenView.Home)} className="font-semibold text-text-primary mb-4">&larr; {t('common.back')}</button>
            <div className="bg-white rounded-2xl shadow-lg p-4">
                <PieChart data={filteredData} total={totalBalance} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                <Legend data={DISTRIBUTION_DATA} visibleCategories={visibleCategories} onToggle={toggleCategory} />
                <div className="text-center p-3 mt-4 bg-orange-50 rounded-lg text-sm text-orange-800">
                    <p>{t('save.chart.nudge')}</p>
                </div>
            </div>
            
            <div className="mt-6">
                <h3 className="text-lg font-bold text-text-primary mb-2">{t('save.chart.transactionsTitle')}</h3>
                <TransactionList initialTransactions={SAVINGS_TRANSACTIONS} filterBy={filteredTransactions} />
            </div>
        </div>
    );
};

// ... PieChart and Legend components remain the same

interface PieChartProps {
    data: DistributionDataPoint[];
    total: number;
    activeIndex: number | null;
    setActiveIndex: (index: number | null) => void;
}

const PieChart: React.FC<PieChartProps> = ({ data, total, activeIndex, setActiveIndex }) => {
    const { t } = useTranslation();
    const size = 300;
    const radius = size / 2 - 20;
    const center = size / 2;

    let startAngle = 0;
    const paths = data.map((slice, index) => {
        if (total === 0) return null;
        const angle = (slice.value / total) * 360;
        const endAngle = startAngle + angle;

        const start = {
            x: center + radius * Math.cos(startAngle * Math.PI / 180),
            y: center + radius * Math.sin(startAngle * Math.PI / 180)
        };
        const end = {
            x: center + radius * Math.cos(endAngle * Math.PI / 180),
            y: center + radius * Math.sin(endAngle * Math.PI / 180)
        };
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        const pathData = `M ${center},${center} L ${start.x},${start.y} A ${radius},${radius} 0 ${largeArcFlag},1 ${end.x},${end.y} Z`;
        
        startAngle += angle;
        
        return (
            <path
                key={slice.id}
                d={pathData}
                className={`fill-current text-${slice.color} cursor-pointer transition-transform duration-300`}
                transform={activeIndex === index ? `scale(1.06)` : `scale(1)`}
                style={{ transformOrigin: 'center center' }}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            />
        );
    });
    
    const activeSlice = activeIndex !== null ? data[activeIndex] : null;

    return (
        <div className="relative flex justify-center items-center" role="img" aria-label={`Distribution: ${data.map(d => `${d.name} ${total > 0 ? ((d.value/total)*100).toFixed(0) : 0}%`).join(', ')}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {paths}
            </svg>
            <div className="absolute text-center">
                <p className="text-2xl font-bold text-text-primary">₹{Math.round(activeSlice?.value ?? total).toLocaleString('en-IN')}</p>
                <p className="text-sm text-text-secondary">{activeSlice ? activeSlice.name : t('save.chart.title')}</p>
            </div>
        </div>
    );
};

interface LegendProps {
    data: DistributionDataPoint[];
    visibleCategories: string[];
    onToggle: (id: string) => void;
}

const Legend: React.FC<LegendProps> = ({ data, visibleCategories, onToggle }) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
            {data.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => onToggle(item.id)}
                    className={`flex items-center text-xs px-2 py-1 rounded-full border-2 ${visibleCategories.includes(item.id) ? `border-${item.color}` : 'border-gray-200 opacity-50'}`}
                >
                    <span className={`w-3 h-3 rounded-full mr-1.5 bg-${item.color}`}></span>
                    {item.name}
                </button>
            ))}
        </div>
    );
};

const TransactionList: React.FC<{initialTransactions: SavingsTransaction[], filterBy: SavingsTransaction[] | null}> = ({ initialTransactions, filterBy }) => {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [deletingTx, setDeletingTx] = useState<SavingsTransaction | null>(null);

    const displayTransactions = filterBy === null ? transactions : filterBy;
    
    const handleDelete = (txId: number) => {
        setTransactions(prev => prev.filter(tx => tx.id !== txId));
        setDeletingTx(null);
    }

    return (
        <>
        <div className="bg-white rounded-2xl shadow-lg p-2 space-y-1">
            {displayTransactions.map(tx => (
                <div key={tx.id} className="p-3 flex justify-between items-center hover:bg-gray-50 rounded-lg group">
                    <div>
                        <p className="font-semibold text-text-primary">{tx.description}</p>
                        <p className="text-sm text-text-secondary">{tx.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p className="font-bold text-accent">+₹{tx.amount}</p>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-500 hover:text-primary"><PencilSquareIcon /></button>
                            <button onClick={() => setDeletingTx(tx)} className="p-1.5 text-gray-500 hover:text-secondary"><TrashIcon /></button>
                        </div>
                    </div>
                </div>
            ))}
            {displayTransactions.length === 0 && (
                <p className="p-4 text-center text-text-secondary">No transactions in this category.</p>
            )}
        </div>
        {deletingTx && <DeleteConfirmationModal transaction={deletingTx} onConfirm={() => handleDelete(deletingTx.id)} onCancel={() => setDeletingTx(null)} />}
        </>
    )
};

const DeleteConfirmationModal: React.FC<{transaction: SavingsTransaction, onConfirm: () => void, onCancel: () => void}> = ({ transaction, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full animate-fade-in-fast">
                <h3 className="text-lg font-bold text-text-primary">{t('save.delete.title')}</h3>
                <p className="text-text-secondary my-4">{t('save.delete.body', { description: transaction.description, amount: transaction.amount })}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onCancel} className="font-bold py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300">{t('common.cancel')}</button>
                    <button onClick={onConfirm} className="font-bold py-2 px-4 rounded-lg bg-secondary text-white hover:bg-red-700">{t('save.delete.confirm')}</button>
                </div>
            </div>
        </div>
    )
}


export default SavingsDistributionPie;