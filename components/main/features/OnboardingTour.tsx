import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { GiftIcon } from '../../ui/Icons';

interface OnboardingTourProps {
  onFinish: () => void;
}

const TOUR_STEPS = [
  { id: 'tour-step-1', key: 'step1' },
  { id: 'tour-step-2', key: 'step2' },
  { id: 'tour-step-chat', key: 'step3' },
  { id: 'tour-step-3', key: 'step4' },
  { id: 'tour-step-save', key: 'step5' },
  { id: 'tour-step-settings', key: 'step6' },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showReward, setShowReward] = useState(false);
  const { t } = useTranslation();

  const currentStep = TOUR_STEPS[stepIndex];

  const updateTargetRect = useCallback(() => {
    if (!currentStep) return;
    const element = document.querySelector(`[data-tour-id="${currentStep.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      // Use a timeout to wait for scroll to finish before getting rect
      setTimeout(() => {
        setTargetRect(element.getBoundingClientRect());
      }, 300); // 300ms delay for scroll animation
    } else {
        // If element not found, try again after a short delay
        setTimeout(updateTargetRect, 100);
    }
  }, [currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);

    return () => {
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect);
    };
  }, [stepIndex, updateTargetRect]);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setTargetRect(null); // Hide card while transitioning
      setStepIndex(stepIndex + 1);
    } else {
      setShowReward(true);
    }
  };
  
  const handleSkip = () => {
      onFinish();
  };

  const handleFinishWithReward = () => {
    const currentPoints = parseInt(localStorage.getItem('nirbhar_total_points') || '0', 10);
    localStorage.setItem('nirbhar_total_points', (currentPoints + 50).toString());
    setShowReward(false);
    onFinish();
  };
  
  if (showReward) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-xl p-8 text-center animate-scale-in max-w-sm">
          <GiftIcon className="w-16 h-16 mx-auto text-highlight mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">{t('tour.reward.title')}</h2>
          <p className="text-text-secondary mb-6">{t('tour.reward.body')}</p>
          <button
            onClick={handleFinishWithReward}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('tour.reward.button')}
          </button>
        </div>
      </div>
    );
  }

  const highlightStyle: React.CSSProperties = targetRect ? {
    width: targetRect.width + 16,
    height: targetRect.height + 16,
    top: targetRect.top - 8,
    left: targetRect.left - 8,
  } : {
    // Default to a small, centered, invisible box while transitioning
    width: 0,
    height: 0,
    top: '50%',
    left: '50%',
  };

  const cardPosition = targetRect && targetRect.top > window.innerHeight / 2 ? 'top-6' : 'bottom-6';

  return (
    <div className="fixed inset-0 z-[99]" aria-live="polite" aria-atomic="true">
      <div
        className="fixed pointer-events-none rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-500 ease-in-out"
        style={highlightStyle}
      />

      {targetRect && (
        <div
          key={stepIndex}
          className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-surface rounded-2xl shadow-2xl p-6 animate-fade-in-fast ${cardPosition}`}
          role="dialog"
          aria-labelledby="tour-title"
          aria-describedby="tour-content"
        >
          <h3 id="tour-title" className="text-xl font-bold text-text-primary mb-2">{t(`tour.${currentStep.key}.title`)}</h3>
          <p id="tour-content" className="text-text-secondary mb-6">{t(`tour.${currentStep.key}.content`)}</p>

          <div className="flex items-center justify-between">
            <div className="w-24 bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
                aria-label={`Step ${stepIndex + 1} of ${TOUR_STEPS.length}`}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={handleSkip} className="font-semibold text-text-secondary hover:text-text-primary transition-colors">
                {t('tour.skip')}
              </button>
              <button onClick={handleNext} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-orange-700 transition-colors">
                {stepIndex === TOUR_STEPS.length - 1 ? t('tour.finish') : t('tour.next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTour;
