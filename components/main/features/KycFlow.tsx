

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { IdentificationIcon, CameraIcon, DocumentArrowUpIcon, CheckBadgeIcon } from '../../ui/Icons';

type KycStep = 'intro' | 'pan' | 'aadhaar' | 'aadhaar-otp' | 'selfie' | 'selfie-preview' | 'upload' | 'success';

interface KycFlowProps {
    onClose: () => void;
    onComplete: () => void;
}

const KycFlow: React.FC<KycFlowProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState<KycStep>('intro');
    const { t } = useTranslation();

    const renderStepContent = () => {
        switch (step) {
            case 'intro': return <IntroStep onNext={() => setStep('pan')} />;
            case 'pan': return <PanStep onNext={() => setStep('aadhaar')} />;
            case 'aadhaar': return <AadhaarStep onNext={() => setStep('aadhaar-otp')} />;
            case 'aadhaar-otp': return <AadhaarOtpStep onNext={() => setStep('selfie')} />;
            case 'selfie': return <SelfieStep onNext={() => setStep('upload')} />;
            case 'upload': return <UploadStep onNext={() => setStep('success')} />;
            case 'success': return <SuccessStep onComplete={onComplete} />;
            default: return null;
        }
    };

    const STEPS: KycStep[] = ['intro', 'pan', 'aadhaar', 'selfie', 'upload', 'success'];
    const currentStepIndex = STEPS.indexOf(step === 'aadhaar-otp' ? 'aadhaar' : step);
    const totalSteps = STEPS.length - 2; // Don't count intro/success in progress

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-text-primary">{t('kyc.title')}</h2>
                    <button onClick={onClose} className="text-2xl font-bold text-text-secondary hover:text-text-primary">&times;</button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderStepContent()}
                </main>
                {currentStepIndex > 0 && currentStepIndex <= totalSteps && (
                    <footer className="p-4 border-t text-center text-sm text-text-secondary">
                        {t('kyc.step', { current: currentStepIndex, total: totalSteps })}
                    </footer>
                )}
            </div>
        </div>
    );
};

const StepContainer: React.FC<{ icon: React.ReactNode, title: string, body?: string, children: React.ReactNode }> = ({ icon, title, body, children }) => {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
            {body && <p className="text-text-secondary mt-2 mb-6">{body}</p>}
            {children}
        </div>
    );
};

const IntroStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    return (
        <StepContainer 
            icon={<IdentificationIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.intro.title')}
            body={t('kyc.intro.body')}>
            <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-4 hover:bg-orange-700 transition-colors">
                {t('kyc.intro.button')}
            </button>
        </StepContainer>
    );
};

const PanStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [pan, setPan] = useState('');
    return (
        <StepContainer 
            icon={<IdentificationIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.pan.title')}>
            <div className="mt-6 text-left">
                <label className="text-sm font-medium text-text-secondary" htmlFor="pan-input">{t('kyc.pan.label')}</label>
                <input id="pan-input" type="text" value={pan} onChange={e => setPan(e.target.value.toUpperCase())} maxLength={10} placeholder={t('kyc.pan.placeholder')} className="w-full mt-1 p-3 border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition" />
            </div>
            <button onClick={onNext} disabled={pan.length !== 10} className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-6 hover:bg-orange-700 transition-colors disabled:bg-slate-400">
                {t('kyc.pan.button')}
            </button>
        </StepContainer>
    );
};

const AadhaarStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [aadhaar, setAadhaar] = useState('');
    return (
        <StepContainer 
            icon={<IdentificationIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.aadhaar.title')}>
            <div className="mt-6 text-left">
                <label className="text-sm font-medium text-text-secondary" htmlFor="aadhaar-input">{t('kyc.aadhaar.label')}</label>
                <input id="aadhaar-input" type="tel" value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))} maxLength={12} placeholder={t('kyc.aadhaar.placeholder')} className="w-full mt-1 p-3 border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition" />
            </div>
            <button onClick={onNext} disabled={aadhaar.length !== 12} className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-6 hover:bg-orange-700 transition-colors disabled:bg-slate-400">
                {t('kyc.aadhaar.button')}
            </button>
        </StepContainer>
    );
};

const AadhaarOtpStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    return (
        <StepContainer 
            icon={<IdentificationIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.aadhaar.otpTitle')}
            body={t('kyc.aadhaar.otpSubtitle')}>
            <div className="flex justify-center gap-3 my-6">
                {[...Array(6)].map((_, i) => (
                    <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-200 bg-slate-50 rounded-xl focus:ring-primary focus:border-primary transition" />
                ))}
            </div>
            <button onClick={onNext} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                {t('kyc.aadhaar.otpButton')}
            </button>
        </StepContainer>
    );
};

const SelfieStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = useCallback(async () => {
        setImageSrc(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => { // Cleanup: stop camera stream when component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            setImageSrc(canvas.toDataURL('image/jpeg'));

            // Stop the camera stream
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <StepContainer 
            icon={<CameraIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.selfie.title')}
            body={t('kyc.selfie.body')}>
            <div className="w-full aspect-square bg-slate-200 rounded-2xl overflow-hidden my-4 relative">
                {imageSrc ? (
                    <img src={imageSrc} alt="User selfie" className="w-full h-full object-cover" />
                ) : (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            {imageSrc ? (
                <div className="flex gap-4">
                     <button onClick={startCamera} className="flex-1 bg-slate-200 text-text-primary font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
                        {t('kyc.selfie.retakeButton')}
                    </button>
                    <button onClick={onNext} className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                        {t('common.continue')}
                    </button>
                </div>
            ) : (
                <button onClick={handleCapture} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                    {t('kyc.selfie.captureButton')}
                </button>
            )}
        </StepContainer>
    );
};

const UploadStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    return (
        <StepContainer 
            icon={<DocumentArrowUpIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.upload.title')}
            body={t('kyc.upload.body')}>
            <button onClick={onNext} className="w-full border-2 border-dashed border-primary text-primary font-bold py-6 rounded-lg mt-4 hover:bg-primary/10 transition-colors">
                {t('kyc.upload.button')}
            </button>
        </StepContainer>
    );
};

const SuccessStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { t } = useTranslation();
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);
    return (
        <StepContainer 
            icon={<CheckBadgeIcon className="w-8 h-8 text-primary" />}
            title={t('kyc.success.title')}
            body={t('kyc.success.body')}>
             <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mt-6"></div>
        </StepContainer>
    );
};

export default KycFlow;
