import './StepIndicator.css'

const steps = [
    { id: 1, label: 'Select/Upload Forecast', icon: 'trend' },
    { id: 2, label: 'Parameters', icon: 'sliders' },
    { id: 3, label: 'Area Results', icon: 'chart' },
]

const icons = {
    trend: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 11L6 7L9 10L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 5H14V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    sliders: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H6M10 4H14M6 4C6 5.10457 6.89543 6 8 6C9.10457 6 10 5.10457 10 4C10 2.89543 9.10457 2 8 2C6.89543 2 6 2.89543 6 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 12H4M8 12H14M4 12C4 13.1046 4.89543 14 6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    chart: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),
}

function StepIndicator({ currentStep }) {
    return (
        <div className="step-indicator">
            {steps.map((step, index) => (
                <div key={step.id} className="step-wrapper">
                    <button
                        className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                    >
                        <span className="step-icon">{icons[step.icon]}</span>
                        <span className="step-label">{step.id}. {step.label}</span>
                    </button>
                    {index < steps.length - 1 && <div className="step-connector" />}
                </div>
            ))}
        </div>
    )
}

export default StepIndicator
