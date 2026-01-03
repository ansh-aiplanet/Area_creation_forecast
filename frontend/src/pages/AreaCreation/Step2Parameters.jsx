import { useState } from 'react'
import ParameterSlider from '../../components/ParameterSlider/ParameterSlider'
import FormulaCard from '../../components/FormulaCard/FormulaCard'
import './Step2Parameters.css'

const productionFormulas = [
    'Required_Hours = Volume × (1 + Safety_Buffer) × Cycle_Time',
    'Required_Machines = Required_Hours ÷ (OEE × Working_Hours)',
    'Production_Area = Required_Machines × Machine_Footprint',
]

const productionExplanation = "First, we calculate how many machine hours are needed by adding a safety buffer to the sales volume and multiplying by cycle time. Then we determine how many machines are required based on equipment efficiency and working hours. Finally, we multiply machines by their footprint to get the total production area needed."

const inventoryFormulas = [
    'Daily_Volume = Annual_Volume ÷ 365',
    'Average_Inventory = Daily_Volume × Inventory_Days',
    'Inventory_Area = Average_Inventory ÷ Warehouse_Capacity',
]

const inventoryExplanation = "We start by converting annual sales to daily sales. Then we calculate how much inventory to keep on hand by multiplying daily sales by the number of inventory days. Finally, we divide the inventory units by warehouse capacity to determine the storage area required."

const derivedCategories = [
    { label: 'Passage', color: '#E5E7EB', description: 'Calculated as a ratio of Production + Inventory areas' },
    { label: 'Admin', color: '#DBEAFE', description: 'Calculated as a ratio of Production area' },
    { label: 'Customer WH', color: '#E5E7EB', description: 'Calculated as a ratio of Inventory area from historical data' },
    { label: 'Vacant', color: '#D1FAE5', description: 'Remaining area after all allocations' },
]

// Parameter tooltips
const paramTooltips = {
    cycleTime: 'Time taken to produce one unit. Enter in seconds (will be converted to hours for calculation).',
    workingHours: 'Total operating hours per year. Typically 4,000 for 2 shifts or 6,000 for 3 shifts.',
    oee: 'Overall Equipment Effectiveness - percentage of time machines are productive (50-100%).',
    machineFootprint: 'Floor space occupied by one machine. Enter in square feet (will be converted to m²).',
    safetyBuffer: 'Extra capacity percentage added for planning uncertainty and future growth (0-30%).',
    inventoryDays: 'Number of days of inventory to maintain based on demand patterns (1-60 days).',
    warehouseCapacity: 'Storage density - how many units can be stored per square meter (units/m²).',
}

function Step2Parameters({ formData, onFormChange }) {
    const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })

    const updateParam = (key, value) => {
        onFormChange({
            ...formData,
            parameters: { ...formData.parameters, [key]: value }
        })
    }

    const showTooltip = (e, text) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setTooltip({ show: true, text, x: rect.left + rect.width / 2, y: rect.top - 10 })
    }

    const hideTooltip = () => {
        setTooltip({ show: false, text: '', x: 0, y: 0 })
    }

    const params = formData.parameters || {
        cycleTime: 45,
        workingHours: 4000,
        oee: 85,
        machineFootprint: 150,
        safetyBuffer: 10,
        inventoryDays: 14,
        warehouseCapacity: 25,
    }

    return (
        <div className="step2-content">
            {tooltip.show && (
                <div
                    className="param-tooltip"
                    style={{
                        position: 'fixed',
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translate(-50%, -100%)',
                        backgroundColor: '#1f2937',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        maxWidth: '250px',
                        zIndex: 1000,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    {tooltip.text}
                    <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #1f2937',
                    }}></div>
                </div>
            )}
            {/* Production Area Parameters */}
            <div className="card section-card">
                <h3 className="section-title">Production Area Parameters</h3>
                <p className="section-description">
                    Configure parameters for calculating production floor requirements based on CRP formulas.
                </p>

                <div className="params-grid">
                    <div className="form-group">
                        <label className="label">
                            Cycle Time
                            <span
                                className="param-info"
                                onMouseEnter={(e) => showTooltip(e, paramTooltips.cycleTime)}
                                onMouseLeave={hideTooltip}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7" cy="4" r="0.75" fill="currentColor" />
                                </svg>
                            </span>
                        </label>
                        <div className="input-with-suffix">
                            <input
                                type="number"
                                className="input"
                                value={params.cycleTime}
                                onChange={(e) => updateParam('cycleTime', parseFloat(e.target.value) || 0)}
                            />
                            <span className="input-suffix">{params.cycleTime} sec</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">
                            Working Hours/Year
                            <span
                                className="param-info"
                                onMouseEnter={(e) => showTooltip(e, paramTooltips.workingHours)}
                                onMouseLeave={hideTooltip}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7" cy="4" r="0.75" fill="currentColor" />
                                </svg>
                            </span>
                        </label>
                        <div className="input-with-suffix">
                            <select
                                className="select"
                                value={params.workingHours}
                                onChange={(e) => updateParam('workingHours', parseInt(e.target.value))}
                            >
                                <option value="4000">4,000 (2 Shifts)</option>
                                <option value="6000">6,000 (3 Shifts)</option>
                            </select>
                            <span className="input-suffix">{params.workingHours.toLocaleString()} hrs</span>
                        </div>
                    </div>

                    <ParameterSlider
                        label="OEE (Overall Equipment Effectiveness)"
                        value={params.oee}
                        onChange={(v) => updateParam('oee', v)}
                        min={50}
                        max={100}
                        step={1}
                        suffix=" %"
                        info={paramTooltips.oee}
                        onShowTooltip={showTooltip}
                        onHideTooltip={hideTooltip}
                    />

                    <div className="form-group">
                        <label className="label">
                            Machine Footprint
                            <span
                                className="param-info"
                                onMouseEnter={(e) => showTooltip(e, paramTooltips.machineFootprint)}
                                onMouseLeave={hideTooltip}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7" cy="4" r="0.75" fill="currentColor" />
                                </svg>
                            </span>
                        </label>
                        <div className="input-with-suffix">
                            <input
                                type="number"
                                className="input"
                                value={params.machineFootprint}
                                onChange={(e) => updateParam('machineFootprint', parseFloat(e.target.value))}
                            />
                            <span className="input-suffix">{params.machineFootprint} sq ft</span>
                        </div>
                    </div>

                    <div className="params-full-width">
                        <ParameterSlider
                            label="Safety Buffer"
                            value={params.safetyBuffer}
                            onChange={(v) => updateParam('safetyBuffer', v)}
                            min={0}
                            max={30}
                            step={1}
                            suffix=" %"
                            info={paramTooltips.safetyBuffer}
                            onShowTooltip={showTooltip}
                            onHideTooltip={hideTooltip}
                        />
                    </div>
                </div>

                <FormulaCard title="Production Area Formula" formulas={productionFormulas} explanation={productionExplanation} />
            </div>

            {/* Inventory Area Parameters */}
            <div className="card section-card">
                <h3 className="section-title">Inventory Area Parameters</h3>
                <p className="section-description">
                    Configure parameters for calculating inventory and warehouse space requirements.
                </p>

                <div className="params-grid">
                    <ParameterSlider
                        label="Inventory Days of Cover"
                        value={params.inventoryDays}
                        onChange={(v) => updateParam('inventoryDays', v)}
                        min={1}
                        max={60}
                        step={1}
                        suffix=" days"
                        info={paramTooltips.inventoryDays}
                        onShowTooltip={showTooltip}
                        onHideTooltip={hideTooltip}
                    />

                    <div className="form-group">
                        <label className="label">
                            Warehouse Capacity
                            <span
                                className="param-info"
                                onMouseEnter={(e) => showTooltip(e, paramTooltips.warehouseCapacity)}
                                onMouseLeave={hideTooltip}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7" cy="4" r="0.75" fill="currentColor" />
                                </svg>
                            </span>
                        </label>
                        <div className="input-with-suffix">
                            <input
                                type="number"
                                className="input"
                                value={params.warehouseCapacity}
                                onChange={(e) => updateParam('warehouseCapacity', parseFloat(e.target.value))}
                            />
                            <span className="input-suffix">{params.warehouseCapacity} units/m²</span>
                        </div>
                    </div>
                </div>

                <FormulaCard title="Inventory Area Formula" formulas={inventoryFormulas} explanation={inventoryExplanation} />
            </div>

            {/* Derived Area Categories */}
            <div className="card section-card">
                <h3 className="section-title">Derived Area Categories</h3>
                <p className="section-description">
                    The following areas are calculated using calibrated ratios from historical data:
                </p>
                <div className="derived-categories">
                    {derivedCategories.map((cat) => (
                        <div key={cat.label} className="derived-category">
                            <span className="category-badge" style={{ backgroundColor: cat.color }}>
                                {cat.label}
                            </span>
                            <span className="category-description">{cat.description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Step2Parameters
