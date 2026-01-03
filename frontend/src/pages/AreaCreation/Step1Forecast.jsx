import { useState } from 'react'
import FileUpload from '../../components/FileUpload/FileUpload'
import ForecastList from '../../components/ForecastList/ForecastList'
import './Step1Forecast.css'

function Step1Forecast({ formData, onFormChange }) {
    const [activeTab, setActiveTab] = useState('upload')

    const handleFileSelect = (file) => {
        onFormChange({ ...formData, uploadedFile: file })
    }

    const handleForecastSelect = (forecast) => {
        onFormChange({ ...formData, selectedForecast: forecast })
    }

    return (
        <div className="step1-content">
            <div className="form-row">
                <div className="form-group">
                    <label className="label label-required">Forecast Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="DNIN Forecast 1"
                        value={formData.forecastName || ''}
                        onChange={(e) => onFormChange({ ...formData, forecastName: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="label label-required">Select Plant</label>
                    <select
                        className="select"
                        value={formData.plant || 'DNHA_M'}
                        onChange={(e) => onFormChange({ ...formData, plant: e.target.value })}
                    >
                        <option value="DNHA_M">DNHA_M</option>
                        <option value="DNHA_J">DNHA_J</option>
                        <option value="DNIN">DNIN</option>
                        <option value="DNKI">DNKI</option>
                    </select>
                </div>
            </div>

            <div className="tab-container">
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 11V5M8 5L5 8M8 5L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 11V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Upload Files
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'select' ? 'active' : ''}`}
                        onClick={() => setActiveTab('select')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="2" y="7" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="2" y="11" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Select Forecast
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'upload' ? (
                        <FileUpload onFileSelect={handleFileSelect} />
                    ) : (
                        <ForecastList
                            onSelect={handleForecastSelect}
                            selectedId={formData.selectedForecast?.id}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Step1Forecast
