import { useState } from 'react'
import './ParameterSlider.css'

function ParameterSlider({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    suffix = '',
    displayValue,
    info,
    onShowTooltip,
    onHideTooltip,
}) {
    const percentage = ((value - min) / (max - min)) * 100

    const handleMouseEnter = (e) => {
        if (info && onShowTooltip) {
            onShowTooltip(e, info)
        }
    }

    const handleMouseLeave = () => {
        if (onHideTooltip) {
            onHideTooltip()
        }
    }

    return (
        <div className="param-slider">
            <div className="param-slider-header">
                <div className="param-slider-label">
                    <span>{label}</span>
                    {info && (
                        <span 
                            className="param-info" 
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="7" cy="4" r="0.75" fill="currentColor" />
                            </svg>
                        </span>
                    )}
                </div>
                <span className="param-slider-value">
                    {displayValue !== undefined ? displayValue : value}{suffix}
                </span>
            </div>
            <div className="param-slider-track-container">
                <span className="param-slider-min-value">{value}</span>
                <div className="param-slider-track">
                    <div
                        className="param-slider-fill"
                        style={{ width: `${percentage}%` }}
                    />
                    {/* Thumb circle that moves with the value */}
                    <div
                        className="param-slider-thumb"
                        style={{ left: `calc(${percentage}% - 8px)` }}
                    />
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        className="param-slider-input"
                    />
                </div>
            </div>
        </div>
    )
}

export default ParameterSlider
