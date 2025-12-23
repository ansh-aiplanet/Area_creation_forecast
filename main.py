import pandas as pd
import numpy as np

# ---------------------------------------------------------
# DEFAULT INDUSTRY PARAMETERS
# ---------------------------------------------------------
defaults = {
    "cycle_time_hours": 0.02,
    "base_oee": 0.75,
    "working_hours_year": 6000,
    "machine_size_m2": 12,
    "warehouse_capacity_units_m2": 8,
    "safety_buffer": 0.05,
    "total_plant_area": 28000
}

# ---------------------------------------------------------
# DNIN SALES DATA FY23–FY40 (Extracted from ERP sheet)
# ---------------------------------------------------------
dnin_sales = [ 150, 153, 153 ]

fys = [2023,2024,2025]
sales_df = pd.DataFrame({"FY": fys, "sales_units": dnin_sales})

# ---------------------------------------------------------
# HISTORICAL AREA DATA = ONLY FY24 & FY25
# ---------------------------------------------------------
historical_area = pd.DataFrame({
    "FY": [2024, 2025],
    "production_area":  [8655, 9339],
    "inventory_area":   [11600, 11293],
    "passage_area":     [3906, 3495],
    "vacant_area":      [862, 2304],    # not used for calibration
    "people_area":      [598, 571],
    "admin_area":       [2819, 2819],
    "customer_wh_area": [875, 875],
    "total_area":       [27579, 27517]
})

# Merge with sales
historical = historical_area.merge(sales_df, on="FY", how="left")

print("\n=== HISTORICAL DATA (FY24-FY25) ===")
print(historical)

# ---------------------------------------------------------
# FORMULAS
# ---------------------------------------------------------

def compute_baseline_production_area(sales, d):
    volume = sales * (1 + d["safety_buffer"])
    required_hours = volume * d["cycle_time_hours"]
    machines = required_hours / (d["base_oee"] * d["working_hours_year"])
    return machines * d["machine_size_m2"]

def compute_inventory_area(sales, inventory_days, d):
    avg_inv_units = sales * inventory_days
    return avg_inv_units / d["warehouse_capacity_units_m2"]

def compute_passage_area(prod, inv, ratio):
    return ratio * (prod + inv)

def compute_vacant_area(total_area, allocated):
    return max(total_area - sum(allocated), total_area * 0.08)

# ---------------------------------------------------------
# CALIBRATION FROM FY24-FY25
# ---------------------------------------------------------

# Baseline prod area for history
historical["baseline_prod_area"] = historical["sales_units"].apply(
    lambda s: compute_baseline_production_area(s, defaults)
)

# Correct productivity factor
historical["productivity_factor"] = (
    historical["production_area"] / historical["baseline_prod_area"]
)

productivity_trend = historical["productivity_factor"].mean()

# Inventory days
historical["inventory_days"] = (
    historical["inventory_area"] * defaults["warehouse_capacity_units_m2"]
) / historical["sales_units"]

inventory_days_trend = historical["inventory_days"].mean()

# Passage ratio
historical["passage_ratio"] = (
    historical["passage_area"] /
    (historical["production_area"] + historical["inventory_area"])
)

passage_ratio_trend = historical["passage_ratio"].mean()

print("\n=== CALIBRATION PARAMETERS ===")
print("Avg Productivity Factor:", productivity_trend)
print("Avg Inventory Days:", inventory_days_trend)
print("Avg Passage Ratio:", passage_ratio_trend)


future_sales = [153, 195, 185]
future_years = [2026,2027,2028]

'''
for fy, units in zip(fys, dnin_sales):
    if fy > 2025:      # only forecast FY26 onwards
        future_years.append(fy)
        future_sales.append(units)'''

forecast_output = []

for fy, sales in zip(future_years, future_sales):

    baseline_prod = compute_baseline_production_area(sales, defaults)
    prod_area = baseline_prod * productivity_trend

    inv_area = compute_inventory_area(sales, inventory_days_trend, defaults)

    passage_area = compute_passage_area(prod_area, inv_area, passage_ratio_trend)

    vacant_area = compute_vacant_area(
        defaults["total_plant_area"],
        [prod_area, inv_area, passage_area]
    )

    forecast_output.append({
        "FY": fy,
        "Sales_Forecast": sales,
        "Production_Area_m2": round(prod_area, 2),
        "Inventory_Area_m2": round(inv_area, 2),
        "Passage_Area_m2": round(passage_area, 2),
        "Vacant_Area_m2": round(vacant_area, 2)
    })

forecast_df = pd.DataFrame(forecast_output)

print("\n=== FINAL FORECAST FY26–FY40 ===")
print(forecast_df)
