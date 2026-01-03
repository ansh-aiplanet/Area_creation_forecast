from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import sys
import os

# Add parent directory to path to import forecast
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from forecast import run_forecast_for_plant

router = APIRouter()

# Fixed forecast period: always 2026-2030
FORECAST_START_YEAR = 2026
FORECAST_END_YEAR = 2030


@router.post("/area-forecast")
async def area_forecast(
    plant_name: str = Query(..., description="Plant name (e.g., DNIN, DNKI, DNHA_M, DNHA_J)"),
    cycle_time_hours: Optional[float] = Query(None, description="Cycle time in hours per unit"),
    base_oee: Optional[float] = Query(None, description="Overall Equipment Effectiveness (0-1)"),
    working_hours_year: Optional[int] = Query(None, description="Working hours per year"),
    machine_size_m2: Optional[float] = Query(None, description="Machine footprint in square meters"),
    safety_buffer: Optional[float] = Query(None, description="Safety buffer ratio (e.g., 0.05 for 5%)"),
    warehouse_capacity_units_m2: Optional[float] = Query(None, description="Warehouse capacity (units per m²)"),
    total_plant_area: Optional[float] = Query(None, description="Total plant area in m²")
):
    """
    Generate area forecast based on plant name with operational parameters.
    
    All data (sales and historical area) is retrieved from plant_data.py based on the plant name.
    The forecast uses historical data (FY2024-FY2025) to calibrate parameters and forecasts
    future years from FY2026 to FY2030.
    
    Parameters:
        - plant_name: Plant name
        - cycle_time_hours: Optional cycle time in hours per unit
        - base_oee: Optional Overall Equipment Effectiveness (0-1)
        - working_hours_year: Optional working hours per year
        - machine_size_m2: Optional machine footprint in square meters
        - safety_buffer: Optional safety buffer ratio (e.g., 0.05 for 5%)
        - warehouse_capacity_units_m2: Optional warehouse capacity (units per m²)
        - total_plant_area: Optional total plant area in m²
    
    Returns:
        - plant: Plant name
        - calibration: Calibration parameters (productivity_factor, inventory_days, passage_ratio)
        - forecast: List of forecast results for FY2026-FY2030
        - historical_debug: Historical data used for calibration
        - operational_params: Operational parameters used for calculation
    """
    try:
        # Debug: Log received parameters
        print(f"[API DEBUG] Received plant_name: '{plant_name}'")
        
        # Use fixed forecast period: 2026-2030
        start_year = FORECAST_START_YEAR
        end_year = FORECAST_END_YEAR
        print(f"[API DEBUG] Using fixed period: {start_year} to {end_year}")
        
        # Build operational parameters dict if any are provided
        operational_params = None
        if any([cycle_time_hours, base_oee, working_hours_year, machine_size_m2, 
                safety_buffer, warehouse_capacity_units_m2, total_plant_area]):
            operational_params = {}
            if cycle_time_hours is not None:
                operational_params["cycle_time_hours"] = cycle_time_hours
            if base_oee is not None:
                operational_params["base_oee"] = base_oee
            if working_hours_year is not None:
                operational_params["working_hours_year"] = working_hours_year
            if machine_size_m2 is not None:
                operational_params["machine_size_m2"] = machine_size_m2
            if safety_buffer is not None:
                operational_params["safety_buffer"] = safety_buffer
            if warehouse_capacity_units_m2 is not None:
                operational_params["warehouse_capacity_units_m2"] = warehouse_capacity_units_m2
            if total_plant_area is not None:
                operational_params["total_plant_area"] = total_plant_area
        
        # Run forecast using data from plant_data.py with operational parameters
        result = run_forecast_for_plant(
            plant_name=plant_name,
            operational_params=operational_params,
            start_year=start_year,
            end_year=end_year
        )
        
        # Return JSON response
        return JSONResponse(content={
            "status": "success",
            "plant": result["plant"],
            "operational_params": result.get("operational_params", {}),
            "calibration": result["calibration"],
            "policy_params": result.get("policy_params", {}),
            "forecast": result["forecast"],
            "historical_debug": result["historical_debug"],
            "historical_areas": result.get("historical_areas", [])
        })
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
