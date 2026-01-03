import { useState } from 'react'
import './ForecastList.css'

const mockForecasts = [
    { id: 1, name: 'Q3 2023 Baseline', volume: '1.2K', revenue: '$45K', change: '+12%', changeType: 'positive' },
    { id: 2, name: 'Q4 2023 Optimistic', volume: '1.8K', revenue: '$62K', change: '+8%', changeType: 'positive' },
    { id: 3, name: 'FY 2024 Conservative', volume: '4.5K', revenue: '$180K', change: '-3%', changeType: 'negative' },
    { id: 4, name: 'FY 2024 Aggressive', volume: '6.2K', revenue: '$240K', change: '+24%', changeType: 'positive' },
    { id: 5, name: 'Q1 2025 Early Look', volume: '1.1K', revenue: '$42K', change: '-1%', changeType: 'negative' },
    { id: 6, name: 'Holiday Season Promo', volume: '2.4K', revenue: '$95K', change: '+15%', changeType: 'positive' },
]

function ForecastList({ onSelect, selectedId }) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredForecasts = mockForecasts.filter((forecast) =>
        forecast.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="forecast-list">
            <div className="forecast-list-header">
                <div className="forecast-list-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>Sales Forecasts</span>
                </div>
                <div className="forecast-search">
                    <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search Forecasts"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="forecast-items">
                {filteredForecasts.map((forecast) => (
                    <div
                        key={forecast.id}
                        className={`forecast-item ${selectedId === forecast.id ? 'selected' : ''}`}
                        onClick={() => onSelect?.(forecast)}
                    >
                        <span className="forecast-name">{forecast.name}</span>
                        <div className="forecast-metrics">
                            <span className="metric">
                                <span className="metric-label">Vol</span>
                                <span className="metric-value">{forecast.volume}</span>
                            </span>
                            <span className="metric">
                                <span className="metric-label">Rev</span>
                                <span className="metric-value">{forecast.revenue}</span>
                            </span>
                            <span className={`metric-change ${forecast.changeType}`}>
                                {forecast.changeType === 'positive' ? '📈' : '📉'} {forecast.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ForecastList
