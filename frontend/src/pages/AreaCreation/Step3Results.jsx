import { useState, useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import './Step3Results.css'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

// Area category colors
const AREA_COLORS = {
    production: '#3B82F6',        // Blue
    inventory: '#6366F1',         // Indigo  
    customer_wh: '#F59E0B',       // Amber
    passage: '#10B981',           // Green
    admin: '#EF4444',             // Red
    people: '#8B5CF6',            // Purple
    external_wh: '#06B6D4',       // Cyan
    vacant: '#9CA3AF',            // Gray
}

const AREA_LABELS = {
    production_area_m2: 'Production',
    inventory_area_m2: 'Inventory/Stock',
    customer_wh_area_m2: 'Customer WH',
    passage_area_m2: 'Passage',
    admin_area_m2: 'Administrative',
    people_gathering_area_m2: 'People Gathering',
    external_wh_area_m2: 'External WH',
    vacant_area_m2: 'Vacant',
}

function Step3Results({ formData, isLoading, results }) {
    const [selectedYear, setSelectedYear] = useState('all')

    // Calculate summary data
    const summaryData = useMemo(() => {
        if (!results?.forecast?.length) return null

        const totalPlantArea = results.operational_params?.total_plant_area || 0
        const latestForecast = results.forecast[results.forecast.length - 1]
        const totalRequired = latestForecast?.total_area_m2 || 0
        const netChange = totalRequired - totalPlantArea

        return {
            totalPlantArea,
            totalRequired,
            netChange,
            utilizationRate: totalPlantArea > 0 ? ((totalRequired / totalPlantArea) * 100).toFixed(1) : 0,
        }
    }, [results])

    // Prepare donut chart data for area distribution
    const donutChartData = useMemo(() => {
        if (!results?.forecast?.length) return null

        const latestForecast = results.forecast[results.forecast.length - 1]

        const areaData = [
            { key: 'production_area_m2', value: latestForecast.production_area_m2, color: AREA_COLORS.production },
            { key: 'inventory_area_m2', value: latestForecast.inventory_area_m2, color: AREA_COLORS.inventory },
            { key: 'customer_wh_area_m2', value: latestForecast.customer_wh_area_m2, color: AREA_COLORS.customer_wh },
            { key: 'passage_area_m2', value: latestForecast.passage_area_m2, color: AREA_COLORS.passage },
            { key: 'admin_area_m2', value: latestForecast.admin_area_m2, color: AREA_COLORS.admin },
            { key: 'people_gathering_area_m2', value: latestForecast.people_gathering_area_m2, color: AREA_COLORS.people },
            { key: 'external_wh_area_m2', value: latestForecast.external_wh_area_m2, color: AREA_COLORS.external_wh },
            { key: 'vacant_area_m2', value: latestForecast.vacant_area_m2, color: AREA_COLORS.vacant },
        ].filter(d => d.value > 0)

        return {
            labels: areaData.map(d => AREA_LABELS[d.key]),
            datasets: [{
                data: areaData.map(d => d.value),
                backgroundColor: areaData.map(d => d.color),
                borderWidth: 0,
                cutout: '65%',
            }]
        }
    }, [results])

    // Prepare horizontal bar chart data for current vs required
    const horizontalBarData = useMemo(() => {
        if (!results?.forecast?.length) return null

        const latestForecast = results.forecast[results.forecast.length - 1]

        // Get latest historical data (current state)
        const latestHistorical = results.historical_areas?.length
            ? results.historical_areas[results.historical_areas.length - 1]
            : null

        const categories = [
            {
                key: 'production_area_m2',
                label: 'Production',
                current: latestHistorical?.production_area || 0,
                required: latestForecast.production_area_m2
            },
            {
                key: 'inventory_area_m2',
                label: 'Inventory/Stock',
                current: latestHistorical?.inventory_area || 0,
                required: latestForecast.inventory_area_m2
            },
            {
                key: 'customer_wh_area_m2',
                label: 'Customer WH',
                current: latestHistorical?.customer_wh_area || 0,
                required: latestForecast.customer_wh_area_m2
            },
            {
                key: 'passage_area_m2',
                label: 'Passage',
                current: latestHistorical?.passage_area || 0,
                required: latestForecast.passage_area_m2
            },
            {
                key: 'admin_area_m2',
                label: 'Administrative',
                current: latestHistorical?.admin_area || 0,
                required: latestForecast.admin_area_m2
            },
            {
                key: 'people_gathering_area_m2',
                label: 'People Gathering',
                current: latestHistorical?.people_area || 0,
                required: latestForecast.people_gathering_area_m2
            },
            {
                key: 'external_wh_area_m2',
                label: 'External WH',
                current: latestHistorical?.external_wh_area || 0,
                required: latestForecast.external_wh_area_m2
            },
            {
                key: 'vacant_area_m2',
                label: 'Vacant',
                current: latestHistorical?.vacant_area || 0,
                required: latestForecast.vacant_area_m2
            },
        ]

        return {
            labels: categories.map(c => c.label),
            datasets: [
                {
                    label: 'Current',
                    data: categories.map(c => c.current / 1000), // Convert to thousands
                    backgroundColor: '#9CA3AF', // Gray for current
                    borderRadius: 4,
                },
                {
                    label: 'Required',
                    data: categories.map(c => c.required / 1000), // Convert to thousands
                    backgroundColor: '#DC2626', // Red for required
                    borderRadius: 4,
                }
            ]
        }
    }, [results])


    // Prepare stacked bar chart data for floor space utilization
    const stackedBarData = useMemo(() => {
        if (!results?.forecast?.length) return null

        // Include historical data if available - use historical_areas which has all area data
        let allData = []
        if (results.historical_areas?.length) {
            allData = results.historical_areas.map(h => ({
                FY: h.FY,
                production_area_m2: h.production_area || 0,
                inventory_area_m2: h.inventory_area || 0,
                passage_area_m2: h.passage_area || 0,
                people_gathering_area_m2: h.people_area || 0, // historical uses people_area
                admin_area_m2: h.admin_area || 0,
                external_wh_area_m2: h.external_wh_area || 0,
                customer_wh_area_m2: h.customer_wh_area || 0,
                vacant_area_m2: h.vacant_area || 0,
            }))
        }
        allData = [...allData, ...results.forecast]

        // Filter by selected year
        const filteredData = selectedYear === 'all'
            ? allData
            : allData.filter(d => d.FY.toString() === selectedYear)

        const labels = filteredData.map(d => `FY${d.FY}`)

        return {
            labels,
            datasets: [
                {
                    label: 'Production',
                    data: filteredData.map(d => d.production_area_m2 || 0),
                    backgroundColor: AREA_COLORS.production,
                },
                {
                    label: 'Stock & Inventory',
                    data: filteredData.map(d => d.inventory_area_m2 || 0),
                    backgroundColor: AREA_COLORS.inventory,
                },
                {
                    label: 'Customer Demand WH',
                    data: filteredData.map(d => d.customer_wh_area_m2 || 0),
                    backgroundColor: AREA_COLORS.customer_wh,
                },
                {
                    label: 'Passage',
                    data: filteredData.map(d => d.passage_area_m2 || 0),
                    backgroundColor: AREA_COLORS.passage,
                },
                {
                    label: 'Administrative',
                    data: filteredData.map(d => d.admin_area_m2 || 0),
                    backgroundColor: AREA_COLORS.admin,
                },
                {
                    label: 'People Gathering',
                    data: filteredData.map(d => d.people_gathering_area_m2 || 0),
                    backgroundColor: AREA_COLORS.people,
                },
                {
                    label: 'External Warehouse',
                    data: filteredData.map(d => d.external_wh_area_m2 || 0),
                    backgroundColor: AREA_COLORS.external_wh,
                },
                {
                    label: 'Vacant Lot',
                    data: filteredData.map(d => d.vacant_area_m2 || 0),
                    backgroundColor: AREA_COLORS.vacant,
                },
            ]
        }
    }, [results, selectedYear])

    // Chart options
    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.raw.toLocaleString()} m²`
                }
            }
        },
    }

    const horizontalBarOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}K m²`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Area (in thousands m²)' },
            },
            y: {
                grid: { display: false },
            },
        },
    }

    const stackedBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { usePointStyle: true, padding: 15 },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} m²`
                }
            }
        },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
                stacked: true,
                grid: { color: '#f0f0f0' },
                title: { display: true, text: 'Area (m²)' },
            },
        },
    }

    // Get available years for filter (include historical and forecast years)
    const availableYears = useMemo(() => {
        const years = []
        if (results?.historical_areas) {
            years.push(...results.historical_areas.map(h => h.FY.toString()))
        }
        if (results?.forecast) {
            years.push(...results.forecast.map(f => f.FY.toString()))
        }
        // Remove duplicates and sort
        return [...new Set(years)].sort()
    }, [results])

    if (isLoading) {
        return (
            <div className="step3-loading">
                <div className="loading-spinner" />
                <p>Calculating area requirements...</p>
            </div>
        )
    }

    if (!results) {
        return (
            <div className="step3-empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="16" width="10" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
                    <rect x="19" y="10" width="10" height="30" rx="2" stroke="currentColor" strokeWidth="2" />
                    <rect x="32" y="4" width="10" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
                </svg>
                <h3>No Results Yet</h3>
                <p>Click "Calculate Area Results" to generate forecast results.</p>
            </div>
        )
    }

    // Show error state if there was an API error
    if (results.error) {
        return (
            <div className="step3-empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="#EF4444" strokeWidth="2" />
                    <path d="M24 14V28" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="24" cy="34" r="2" fill="#EF4444" />
                </svg>
                <h3 style={{ color: '#EF4444' }}>Error Loading Results</h3>
                <p>{results.error}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Check browser console (F12) for details</p>
            </div>
        )
    }

    return (
        <div className="step3-content">
            {/* Section 1: Summary Cards + Area Distribution Charts */}
            <div className="summary-section">
                <div className="summary-cards">
                    <div className="summary-card">
                        <span className="summary-label">Total Plant Area (sq ft)</span>
                        <span className="summary-value">{(summaryData?.totalPlantArea / 1000).toFixed(0)}K</span>
                        <span className="summary-sub">Capacity Limit</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Total Required (sq ft)</span>
                        <span className="summary-value">{(summaryData?.totalRequired / 1000).toFixed(0)}K</span>
                        <span className="summary-sub">{summaryData?.utilizationRate}% Utilization</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Net Change (sq ft)</span>
                        <span className={`summary-value ${summaryData?.netChange >= 0 ? 'positive' : 'negative'}`}>
                            {summaryData?.netChange >= 0 ? '+' : ''}{(summaryData?.netChange / 1000).toFixed(1)}K
                        </span>
                        <span className="summary-sub">{summaryData?.netChange === 0 ? 'Balanced' : summaryData?.netChange > 0 ? 'Over Capacity' : 'Under Capacity'}</span>
                    </div>
                </div>

                <div className="charts-row">
                    <div className="chart-card">
                        <h4>Area Distribution</h4>
                        <p className="chart-description">Required area breakdown by category</p>
                        <div className="donut-chart-container">
                            {donutChartData && (
                                <>
                                    <Doughnut data={donutChartData} options={donutOptions} />
                                    <div className="donut-center">
                                        <span className="donut-value">{(summaryData?.totalRequired / 1000).toFixed(0)}K</span>
                                        <span className="donut-label">Total Sq Ft</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.production }}></span> Production</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.inventory }}></span> Inventory/Stock</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.customer_wh }}></span> Customer WH</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.passage }}></span> Passage</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.admin }}></span> Administrative</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.people }}></span> People Gathering</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.external_wh }}></span> External WH</span>
                            <span className="legend-item"><span className="dot" style={{ background: AREA_COLORS.vacant }}></span> Vacant</span>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h4>Current vs Required</h4>
                        <p className="chart-description">Comparison by area category (in thousands)</p>
                        <div className="bar-chart-container">
                            {horizontalBarData && (
                                <Bar data={horizontalBarData} options={horizontalBarOptions} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Historical Calibration */}
            <div className="card section-card">
                <h4>Historical Calibration</h4>
                <p className="chart-description">Planning parameters are calibrated using historical performance trends to improve forecast accuracy.</p>

                <div className="calibration-cards">
                    <div className="calibration-card">
                        <span className="calibration-label">Productivity Factor</span>
                        <span className="calibration-value green">{results.calibration?.productivity_factor?.toFixed(3)}</span>
                    </div>
                    <div className="calibration-card">
                        <span className="calibration-label">Inventory Days</span>
                        <span className="calibration-value green">{results.calibration?.inventory_days?.toFixed(1)}</span>
                    </div>
                    <div className="calibration-card">
                        <span className="calibration-label">Passage Ratio</span>
                        <span className="calibration-value green">{results.calibration?.passage_ratio?.toFixed(3)}</span>
                    </div>
                </div>

                <div className="calibration-explanations" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Calculation Methodology</h5>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h6 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>1. Productivity Factor</h6>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                            The productivity factor represents the average relationship between the actual production area used and the theoretical production area calculated using capacity planning rules across historical years. It reflects how efficiently a plant converts physical floor space into output compared to an ideal, theoretical layout. <br></br>The theoretical (baseline) production area is calculated using Capacity Requirements Planning (CRP) based on sales volume and operational parameters such as cycle time, OEE, working hours, and machine footprint. The productivity factor is then applied to this baseline to adjust future production area estimates so they reflect real plant behavior observed in the past, including layout efficiency, automation, and shared resource usage.
                        </p>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#1f2937', border: '1px solid #e5e7eb' }}>
                            <strong>Formula:</strong> Productivity Factor = Mean(Production Area / Baseline Production Area)<br />
                            <strong>Where:</strong> Baseline Production Area = (Sales Units × Cycle Time) / (Working Hours/Year × OEE × Machine Size)
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h6 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>2. Inventory Days</h6>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                            Inventory days of cover represents the average number of days of production or sales that the plant historically holds in inventory. It captures inventory policy and supply chain strategy, rather than demand volatility or forecasting uncertainty. <br></br>This parameter is derived from historical inventory area usage and sales throughput and is used to convert future sales volumes into required inventory quantities. By applying this calibrated value, the model ensures that future inventory area estimates are aligned with established stock-holding practices rather than reacting mechanically to volume changes.
                        </p>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#1f2937', border: '1px solid #e5e7eb' }}>
                            <strong>Formula:</strong> Inventory Days = Mean((Inventory Area × Warehouse Capacity × 365) / Sales Units)<br />
                            <strong>Where:</strong> Warehouse Capacity = units per m² storage capacity
                        </div>
                    </div>

                    <div>
                        <h6 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>3. Passage Ratio</h6>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                            The passage ratio represents the proportion of non-productive space required for material movement, safety, and regulatory compliance, such as aisles, forklift paths, and emergency clearances. This space is structurally required and exists independently of production volume.<br></br>The ratio is calculated from historical data as the share of passage area relative to production and inventory areas. It is then applied consistently in future years to ensure that any increase in functional areas is accompanied by the necessary structural space, preserving layout feasibility and safety standards.
                        </p>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#1f2937', border: '1px solid #e5e7eb' }}>
                            <strong>Formula:</strong> Passage Ratio = Mean(Passage Area / (Production Area + Inventory Area))
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Floor Space Utilization Stacked Bar Chart */}
            <div className="card section-card">
                <div className="section-header-row">
                    <div>
                        <h4>Floor Space Utilization by Classification</h4>
                        <p className="chart-description">FY2026-FY2030 with planned usable area target</p>
                    </div>
                    <div className="chart-stats">
                        <div className="stat">
                            <span className="stat-label">Current Total (FY2030)</span>
                            <span className="stat-value">{results.forecast?.[results.forecast.length - 1]?.total_area_m2?.toLocaleString()} m²</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Utilization Rate</span>
                            <span className="stat-value">{summaryData?.utilizationRate}%</span>
                        </div>
                    </div>
                </div>

                <div className="filter-row">
                    <label>Filter by Year:</label>
                    <select
                        className="select year-filter"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="all">All Years</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>FY{year}</option>
                        ))}
                    </select>
                </div>

                <div className="stacked-bar-container">
                    {stackedBarData && (
                        <Bar data={stackedBarData} options={stackedBarOptions} />
                    )}
                </div>

                <p className="chart-hint">💡 Hover segments to zoom details • Click legend items to isolate categories</p>
            </div>

            {/* Section 4: Data Table */}
            <div className="card section-card">
                <h4>Area Classification Table</h4>
                <p className="chart-description">Detailed breakdown by fiscal year (Area in m²)</p>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="sticky-col">Classification</th>
                                {results.historical_areas?.map(h => (
                                    <th key={`hist-${h.FY}`}>FY{h.FY}</th>
                                ))}
                                {results.forecast?.map(f => (
                                    <th key={`fore-${f.FY}`}>FY{f.FY}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="sticky-col">1. Production</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-prod-${h.FY}`}>{h.production_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-prod-${f.FY}`}>{f.production_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">2. Vacant Lot</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-vac-${h.FY}`}>{h.vacant_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-vac-${f.FY}`}>{f.vacant_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">3. Passage</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-pas-${h.FY}`}>{h.passage_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-pas-${f.FY}`}>{f.passage_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">4. People Gathering</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-peo-${h.FY}`}>{h.people_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-peo-${f.FY}`}>{f.people_gathering_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">5. Administrative & Indirect</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-adm-${h.FY}`}>{h.admin_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-adm-${f.FY}`}>{f.admin_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">6. Stock & Inventory</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-inv-${h.FY}`}>{h.inventory_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-inv-${f.FY}`}>{f.inventory_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">7. External WH</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-ext-${h.FY}`}>{h.external_wh_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-ext-${f.FY}`}>{f.external_wh_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky-col">8. Customer Demand WH</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-cus-${h.FY}`}>{h.customer_wh_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-cus-${f.FY}`}>{f.customer_wh_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                            <tr className="total-row">
                                <td className="sticky-col">SUM of Using Floor Space</td>
                                {results.historical_areas?.map(h => (
                                    <td key={`hist-tot-${h.FY}`}>{h.total_area?.toLocaleString() || '-'}</td>
                                ))}
                                {results.forecast?.map(f => (
                                    <td key={`fore-tot-${f.FY}`}>{f.total_area_m2?.toLocaleString()}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Step3Results
