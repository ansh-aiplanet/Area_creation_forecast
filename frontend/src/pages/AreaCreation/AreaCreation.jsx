import { useState } from 'react'
import StepIndicator from '../../components/StepIndicator/StepIndicator'
import Step1Forecast from './Step1Forecast'
import Step2Parameters from './Step2Parameters'
import Step3Results from './Step3Results'
import './AreaCreation.css'

const API_BASE_URL = 'http://localhost:8080'

function AreaCreation() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [formData, setFormData] = useState({
        forecastName: '',
        plant: 'DNHA_M',
        uploadedFile: null,
        selectedForecast: null,
        parameters: {
            cycleTime: 45,
            workingHours: 4000,
            oee: 85,
            machineFootprint: 150,
            safetyBuffer: 10,
            inventoryDays: 14,
            warehouseCapacity: 25,
        }
    })

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleCalculate = async () => {
        setIsLoading(true)
        setCurrentStep(3)
        setResults(null)

        try {
            const params = formData.parameters

            // Debug: Log the plant name being sent
            console.log('[FRONTEND DEBUG] Sending plant_name:', formData.plant)
            console.log('[FRONTEND DEBUG] Full formData:', formData)

            // Build query params
            const queryParams = new URLSearchParams({
                plant_name: formData.plant,
                cycle_time_hours: (params.cycleTime).toString(), // Convert seconds to hours
                base_oee: (params.oee / 100).toString(), // Convert percentage to decimal
                working_hours_year: params.workingHours.toString(),
                machine_size_m2: (params.machineFootprint).toString(), // Convert sq ft to m²
                safety_buffer: (params.safetyBuffer / 100).toString(), // Convert percentage to decimal
                warehouse_capacity_units_m2: params.warehouseCapacity.toString(),
                // total_plant_area will use plant default if not provided
            })

            console.log('Fetching from:', `${API_BASE_URL}/api/area-forecast?${queryParams}`)

            const response = await fetch(`${API_BASE_URL}/api/area-forecast?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            console.log('Response status:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error response:', errorText)
                let errorMessage = `Failed to fetch forecast: ${response.status}`
                try {
                    const errorJson = JSON.parse(errorText)
                    errorMessage = errorJson.detail || errorMessage
                } catch (e) {
                    // If not JSON, use the text as is
                    errorMessage = errorText || errorMessage
                }
                throw new Error(errorMessage)
            }

            const data = await response.json()
            console.log('Received data:', data)
            
            // Check if response has the expected structure
            if (data.status === 'success' && data.forecast) {
                setResults(data)
            } else {
                console.error('Unexpected response structure:', data)
                throw new Error('Invalid response format from server')
            }
        } catch (error) {
            console.error('Error calculating forecast:', error)
            // Set an error result to show in UI
            setResults({ error: error.message || 'Failed to fetch results' })
        } finally {
            setIsLoading(false)
        }
    }

    const getButtonConfig = () => {
        switch (currentStep) {
            case 1:
                return {
                    label: 'Continue to Parameters',
                    icon: '→',
                    onClick: handleNext,
                    disabled: !formData.forecastName && !formData.selectedForecast && !formData.uploadedFile,
                }
            case 2:
                return {
                    label: 'Calculate Area Results',
                    icon: '→',
                    onClick: handleCalculate,
                    disabled: false,
                }
            case 3:
                return {
                    label: 'Save Area Plan',
                    icon: '💾',
                    onClick: () => { },
                    disabled: !results,
                }
            default:
                return { label: 'Next', onClick: handleNext }
        }
    }

    const buttonConfig = getButtonConfig()

    return (
        <div className="area-creation">
            <div className="area-creation-header">
                <div className="header-left">
                    {currentStep > 1 && (
                        <button className="back-btn" onClick={handleBack}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                    <h2>New Area Creation</h2>
                </div>
                <button
                    className="btn btn-primary action-btn"
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                >
                    {buttonConfig.label} <span className="btn-icon">{buttonConfig.icon}</span>
                </button>
            </div>

            <div className="step-indicator-container">
                <StepIndicator currentStep={currentStep} />
            </div>

            <div className="step-content card">
                {currentStep === 1 && (
                    <Step1Forecast formData={formData} onFormChange={setFormData} />
                )}
                {currentStep === 2 && (
                    <Step2Parameters formData={formData} onFormChange={setFormData} />
                )}
                {currentStep === 3 && (
                    <Step3Results formData={formData} isLoading={isLoading} results={results} />
                )}
            </div>
        </div>
    )
}

export default AreaCreation
