// ============================================================================
// API Response Types
// ============================================================================

export interface HistoricalArea {
    FY: number
    production_area: number
    inventory_area: number
    passage_area: number
    people_area: number
    admin_area: number
    external_wh_area: number
    customer_wh_area: number
    vacant_area: number
    total_area: number
}

export interface ForecastArea {
    FY: number
    production_area_m2: number
    inventory_area_m2: number
    passage_area_m2: number
    people_gathering_area_m2: number
    admin_area_m2: number
    external_wh_area_m2: number
    customer_wh_area_m2: number
    vacant_area_m2: number
    total_area_m2: number
}

export interface CalibrationData {
    productivity_factor: number
    inventory_days: number
    passage_ratio: number
}

export interface OperationalParams {
    total_plant_area: number
    cycle_time_hours: number
    base_oee: number
    working_hours_year: number
    machine_size_m2: number
    safety_buffer: number
    warehouse_capacity_units_m2: number
}

export interface AreaForecastResponse {
    status: string
    plant_name: string
    forecast: ForecastArea[]
    historical_areas?: HistoricalArea[]
    calibration?: CalibrationData
    operational_params?: OperationalParams
    error?: string
}

// ============================================================================
// Form Data Types
// ============================================================================

export interface Parameters {
    cycleTime: number
    workingHours: number
    oee: number
    machineFootprint: number
    safetyBuffer: number
    inventoryDays: number
    warehouseCapacity: number
}

export interface Forecast {
    id: number
    name: string
    volume: string
    revenue: string
    change: string
    changeType: 'positive' | 'negative'
}

export interface FormData {
    forecastName: string
    plant: string
    uploadedFile: File | null
    selectedForecast: Forecast | null
    parameters: Parameters
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface LayoutProps {
    children: React.ReactNode
    currentPage: string
    onNavigate: (page: string) => void
}

export interface SidebarProps {
    currentPage: string
    onNavigate: (page: string) => void
}

export interface StepIndicatorProps {
    currentStep: number
}

export interface FileUploadProps {
    onFileSelect?: (file: File) => void
}

export interface ForecastListProps {
    onSelect?: (forecast: Forecast) => void
    selectedId?: number
}

export interface FormulaCardProps {
    title: string
    formulas: string[]
    explanation: string
}

export interface ParameterSliderProps {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    suffix?: string
    displayValue?: number | string
    info?: string
    onShowTooltip?: (e: React.MouseEvent, text: string) => void
    onHideTooltip?: () => void
}

export interface Step1ForecastProps {
    formData: FormData
    onFormChange: (formData: FormData) => void
}

export interface Step2ParametersProps {
    formData: FormData
    onFormChange: (formData: FormData) => void
}

export interface Step3ResultsProps {
    formData: FormData
    isLoading: boolean
    results: AreaForecastResponse | null
}

export interface TooltipState {
    show: boolean
    text: string
    x: number
    y: number
}

export interface DerivedCategory {
    label: string
    color: string
    description: string
}

// ============================================================================
// Chart.js Types
// ============================================================================

export interface ChartDataset {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderWidth?: number
    cutout?: string
    borderRadius?: number
}

export interface ChartData {
    labels: string[]
    datasets: ChartDataset[]
}
