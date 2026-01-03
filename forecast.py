import pandas as pd
from plant_data import PLANT_DATA
# =========================================================
# CORE FORMULA FUNCTIONS (UNCHANGED)
# =========================================================

def compute_baseline_production_area(sales_units, d):
    volume = sales_units * (1 + d["safety_buffer"])
    required_hours = volume * d["cycle_time_hours"]
    machines_required = required_hours / (
        d["base_oee"] * d["working_hours_year"]
    )
    return machines_required * d["machine_size_m2"]


def compute_inventory_area(sales_units, inventory_days, d):
    """
    Calculate inventory area based on CRP logic.
    
    Formula:
    - Daily sales = Annual sales / 365
    - Average inventory units = Daily sales × Inventory days
    - Inventory area = Average inventory units / Warehouse capacity (units per m²)
    
    Simplified: Inventory area = (Sales × Inventory days) / (365 × Warehouse capacity)
    """
    daily_sales = sales_units / 365.0
    avg_inventory_units = daily_sales * inventory_days
    return avg_inventory_units / d["warehouse_capacity_units_m2"]


def compute_passage_area(production_area, inventory_area, passage_ratio):
    return passage_ratio * (production_area + inventory_area)


def compute_vacant_area(total_plant_area, allocated_areas):
    min_vacant = total_plant_area * 0.08
    calculated_vacant = total_plant_area - sum(allocated_areas)
    return max(calculated_vacant, min_vacant)


# =========================================================
# MAIN PLANT-AWARE FORECAST FUNCTION
# =========================================================

def run_forecast_for_plant(
    plant_name, 
    sales_df=None, 
    historical_area_df=None,
    operational_params=None,
    start_year=None,
    end_year=None
):
    """
    Run forecast for a plant.
    
    Args:
        plant_name: Name of the plant (must exist in PLANT_DATA for defaults)
        sales_df: Optional pandas DataFrame with 'FY' and 'sales_units' columns.
                  If None, uses data from PLANT_DATA.
        historical_area_df: Optional pandas DataFrame with historical area data.
                           Must have 'FY', 'production_area', 'inventory_area', 
                           'passage_area' columns. If None, uses data from PLANT_DATA.
        operational_params: Optional dict with operational parameters
        start_year: Optional start year for forecast period (inclusive)
        end_year: Optional end year for forecast period (inclusive)
    
    Returns:
        Dictionary with forecast results, calibration parameters, and plant info.
    """
    if plant_name not in PLANT_DATA:
        raise ValueError(f"Plant '{plant_name}' not found in plant_data")

    # Debug: Log which plant is being processed
    print(f"[DEBUG] Processing plant: {plant_name}")
    
    plant = PLANT_DATA[plant_name]
    
    # Debug: Log plant data info
    print(f"[DEBUG] Plant '{plant_name}' - Sales data shape: {plant['sales_df'].shape}, Historical shape: {plant['historical_area_df'].shape}")
    print(f"[DEBUG] Plant '{plant_name}' - First sales value: {plant['sales_df']['sales_units'].iloc[0] if len(plant['sales_df']) > 0 else 'N/A'}")

    # Use provided operational parameters or fall back to plant defaults
    # Create a fresh copy of defaults to avoid any reference issues
    plant_defaults = plant["defaults"].copy()  # Copy the plant defaults dict
    
    if operational_params:
        defaults = {
            "cycle_time_hours": operational_params.get("cycle_time_hours", plant_defaults.get("cycle_time_hours")),
            "base_oee": operational_params.get("base_oee", plant_defaults.get("base_oee")),
            "working_hours_year": operational_params.get("working_hours_year", 6000),
            "machine_size_m2": operational_params.get("machine_size_m2", plant_defaults.get("machine_size_m2")),
            "safety_buffer": operational_params.get("safety_buffer", 0.05),
            "warehouse_capacity_units_m2": operational_params.get("warehouse_capacity_units_m2", plant_defaults.get("warehouse_capacity_units_m2")),
            "total_plant_area": operational_params.get("total_plant_area", plant_defaults.get("total_plant_area"))
        }
    else:
        defaults = {
            **plant_defaults,  # Use copied defaults
            "working_hours_year": 6000,
            "safety_buffer": 0.05
        }

    # Use provided dataframes or fall back to plant_data
    # Make deep copies to ensure no reference issues
    if sales_df is None:
        sales_df = plant["sales_df"].copy(deep=True)
    else:
        sales_df = sales_df.copy(deep=True)
    
    if historical_area_df is None:
        historical_area_df = plant["historical_area_df"].copy(deep=True)
    else:
        historical_area_df = historical_area_df.copy(deep=True)
    

    # -----------------------------------------------------
    # 1. Merge historical data (FY24–FY25)
    # -----------------------------------------------------
    # Create a fresh copy of the merged DataFrame to avoid any reference issues
    historical = historical_area_df.merge(
        sales_df, on="FY", how="left"
    ).copy()

    if historical["sales_units"].isna().any():
        raise ValueError("Missing sales data for historical years")

    # -----------------------------------------------------
    # 2. Baseline production area
    # -----------------------------------------------------
    historical["baseline_prod_area"] = historical["sales_units"].apply(
        lambda s: compute_baseline_production_area(s, defaults)
    )

    # -----------------------------------------------------
    # 3. CALIBRATION PARAMETERS
    # -----------------------------------------------------

    # Productivity factor (KEY FIX: must be < 1 normally)
    historical["productivity_factor"] = (
        historical["production_area"] /
        historical["baseline_prod_area"]
    )

    productivity_factor = historical["productivity_factor"].mean()

    # Inventory days
    historical["inventory_days"] = (
        historical["inventory_area"] *
        defaults["warehouse_capacity_units_m2"]* 365
    ) / historical["sales_units"]

    inventory_days = historical["inventory_days"].mean()

    # Passage ratio
    historical["passage_ratio"] = (
        historical["passage_area"] /
        (historical["production_area"] + historical["inventory_area"])
    )

    passage_ratio = float(historical["passage_ratio"].mean())
    
    # Policy-based ratios from historical data
    if "people_area" in historical.columns:
        people_gathering_ratio = float((historical["people_area"] / historical["production_area"]).mean())
    else:
        people_gathering_ratio = 0.1
    
    if "admin_area" in historical.columns:
        admin_area_ratio = float((historical["admin_area"] / historical["production_area"]).mean())
    else:
        admin_area_ratio = 0.08
    
    if "external_wh_area" in historical.columns:
        external_wh_ratio = float((historical["external_wh_area"] / historical["inventory_area"]).mean())
    else:
        external_wh_ratio = 1.0
    
    # Customer WH ratio calculated from historical data (not a fixed 19% policy)
    if "customer_wh_area" in historical.columns:
        customer_wh_ratio = float((historical["customer_wh_area"] / historical["inventory_area"]).mean())
    else:
        customer_wh_ratio = 0.19  # Fallback if no historical data

    # -----------------------------------------------------
    # 4. FORECAST FUTURE YEARS (FY > 2025)
    # -----------------------------------------------------
    future_sales_df = sales_df[sales_df["FY"] > 2025].copy()
    
    # Filter by period if specified
    if start_year is not None:
        future_sales_df = future_sales_df[future_sales_df["FY"] >= start_year]
    if end_year is not None:
        future_sales_df = future_sales_df[future_sales_df["FY"] <= end_year]

    forecast_output = []

    for _, row in future_sales_df.iterrows():
        fy = int(row["FY"])
        sales = float(row["sales_units"])

        baseline_prod = compute_baseline_production_area(sales, defaults)
        prod_area = float(baseline_prod * productivity_factor)

        inv_area = float(compute_inventory_area(sales, inventory_days, defaults))

        passage_area = float(compute_passage_area(prod_area, inv_area, passage_ratio))

        # Policy-based areas
        customer_wh_area = float(inv_area * customer_wh_ratio)
        external_wh_area = float(inv_area * external_wh_ratio)
        people_gathering_area = float(prod_area * people_gathering_ratio)
        admin_area = float(prod_area * admin_area_ratio)

        allocated_areas = [
            prod_area,
            inv_area,
            passage_area,
            customer_wh_area,
            external_wh_area,
            people_gathering_area,
            admin_area
        ]

        vacant_area = float(compute_vacant_area(
            defaults["total_plant_area"],
            allocated_areas
        ))

        total_area = float(sum(allocated_areas) + vacant_area)

        forecast_output.append({
            "FY": fy,
            "sales_units": int(sales),
            "production_area_m2": int(round(prod_area)),
            "inventory_area_m2": int(round(inv_area)),
            "passage_area_m2": int(round(passage_area)),
            "people_gathering_area_m2": int(round(people_gathering_area)),
            "admin_area_m2": int(round(admin_area)),
            "external_wh_area_m2": int(round(external_wh_area)),
            "customer_wh_area_m2": int(round(customer_wh_area)),
            "vacant_area_m2": int(round(vacant_area)),
            "total_area_m2": int(round(total_area))
        })

    # Convert forecast DataFrame to list of dicts for JSON serialization
    forecast_list = forecast_output
    
    # Convert historical debug to native Python types
    historical_debug_list = []
    for _, row in historical[["FY", "sales_units", "production_area", "baseline_prod_area", "productivity_factor"]].iterrows():
        historical_debug_list.append({
            "FY": int(row["FY"]),
            "sales_units": int(row["sales_units"]),
            "production_area": float(row["production_area"]),
            "baseline_prod_area": float(row["baseline_prod_area"]),
            "productivity_factor": float(row["productivity_factor"])
        })
    
    # Convert historical areas to native Python types
    historical_areas_list = []
    for _, row in historical_area_df.iterrows():
        hist_dict = {"FY": int(row["FY"])}
        for col in historical_area_df.columns:
            if col != "FY":
                hist_dict[col] = float(row[col]) if pd.notna(row[col]) else None
        historical_areas_list.append(hist_dict)
    
    result = {
        "plant": plant_name,
        "operational_params": {k: float(v) if isinstance(v, (int, float)) else v for k, v in defaults.items()},
        "calibration": {
            "productivity_factor": float(round(productivity_factor, 3)),
            "inventory_days": float(round(inventory_days, 1)),
            "passage_ratio": float(round(passage_ratio, 3))
        },
        "policy_params": {
            "people_gathering_ratio": float(round(people_gathering_ratio, 4)),
            "admin_area_ratio": float(round(admin_area_ratio, 4)),
            "external_wh_ratio": float(round(external_wh_ratio, 4)),
            "customer_wh_ratio": float(round(customer_wh_ratio, 4)),
            "customer_wh_policy": "Calculated from historical data"
        },
        "forecast": forecast_list,
        "historical_debug": historical_debug_list,
        "historical_areas": historical_areas_list
    }
    
    # Debug: Log result summary
    print(f"[DEBUG] Returning result for plant: {result['plant']}, Forecast years: {[f['FY'] for f in result['forecast'][:3]]}")
    
    return result


# =========================================================
# QUICK LOCAL TEST
# =========================================================
if __name__ == "__main__":
    result = run_forecast_for_plant("DNKI")
    print("\n=== CALIBRATION ===")
    print(result["calibration"])

    print("\n=== FORECAST OUTPUT ===")
    for r in result["forecast"]:
        print(r)
