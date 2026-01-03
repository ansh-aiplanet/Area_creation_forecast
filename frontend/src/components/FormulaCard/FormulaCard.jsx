import './FormulaCard.css'

function FormulaCard({ title, formulas, explanation }) {
    return (
        <div className="formula-card">
            <div className="formula-header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{title}</span>
            </div>
            {explanation && (
                <p className="formula-explanation">{explanation}</p>
            )}
            <div className="formula-content">
                {formulas.map((formula, index) => (
                    <code key={index} className="formula-line">
                        {formula}
                    </code>
                ))}
            </div>
        </div>
    )
}

export default FormulaCard
