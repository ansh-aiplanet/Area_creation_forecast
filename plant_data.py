"""
plant_data.py

Centralized plant-wise inputs for Area Creation Forecasting
Historical Years: FY2024, FY2025
Future Years: FY2026 onwards

NOTE:
- Any borrowed / assumed industrial parameters are marked clearly.
- Replace them with real plant values when available.
"""

import pandas as pd

# =========================================================
# COMMON INDUSTRIAL DEFAULTS (TEMPORARY / REPLACE LATER)
# =========================================================
INDUSTRIAL_DEFAULTS = {
    "working_hours_year": 6000,        # 3 shifts × ~250 days
    "safety_buffer": 0.05              # 5% planning buffer
}

# =========================================================
# PLANT DATA REGISTRY
# =========================================================

PLANT_DATA = {

# =========================================================
# DNHA_M
# =========================================================
"DNHA_M": {
    "defaults": {
        "cycle_time_hours": 0.04,       # ASSUMED (replace)
        "base_oee": 0.79,
        "machine_size_m2": 80,          # ASSUMED
        "warehouse_capacity_units_m2": 6,
        "total_plant_area": 27900       # approx from SUM area
    },

    "sales_df": pd.DataFrame({
        "FY": list(range(2024, 2036)),
        "sales_units": [
            13000000, 14000000, 14400000, 15200000, 16000000,
            17000000, 21000000, 22000000, 22000000, 22000000,
            24000000, 24000000
        ]
    }),

    "historical_area_df": pd.DataFrame({
        "FY": [2024, 2025],
        "production_area": [11763, 9858],
        "vacant_area": [2425, 6770],
        "passage_area": [6526, 4999],
        "people_area": [1216, 671],
        "admin_area": [788, 681],
        "inventory_area": [3561, 3300],
        "external_wh_area": [4093, 4100],
        "customer_wh_area": [10935, 10535],
        "total_area": [27947, 23609]
    })
},

# =========================================================
# DNHA_J
# =========================================================
"DNHA_J": {
    "defaults": {
        "cycle_time_hours": 0.06,        # ASSUMED (Elfie + Thermal avg)
        "base_oee": 0.78,                # ASSUMED
        "machine_size_m2": 70,           # ASSUMED
        "warehouse_capacity_units_m2": 6,
        "total_plant_area": 15550
    },

    # Sales aggregated from Elfie + Thermal
    "sales_df": pd.DataFrame({
        "FY": list(range(2024, 2036)),
        "sales_units": [
            1000000,        # FY24
            1000000,        # FY25
            2000000,        # FY26
            2400000,        # FY27
            2600000,        # FY28
            5000000,        # FY29
            7200000,        # FY30
            8200000,        # FY31
            8000000,        # FY32
            8200000,        # FY33
            8200000,        # FY34
            8400000         # FY35
        ]
    }),

    "historical_area_df": pd.DataFrame({
        "FY": [2024, 2025],
        "production_area": [5281, 5836],
        "vacant_area": [2458, 2497],
        "passage_area": [2637, 2735],
        "people_area": [708, 814],
        "admin_area": [1999, 1510],
        "inventory_area": [3226, 2887],
        "external_wh_area": [1500, 1500],
        "customer_wh_area": [1800, 2000],
        "total_area": [15350, 15312]
    })
},

# =========================================================
# DNIN
# =========================================================
"DNIN": {
    "defaults": {
        "cycle_time_hours": 0.05,
        "base_oee": 0.79,
        "machine_size_m2": 75,           # ASSUMED
        "warehouse_capacity_units_m2": 6,
        "total_plant_area": 29090
    },

    "sales_df": pd.DataFrame({
        "FY": list(range(2024, 2036)),
        "sales_units": [
            12666667, 12666667, 12666667, 12666667,
            13366667, 14691667, 14881667, 14666667,
            14666667, 14666667, 14666667, 14666667
        ]
    }),

    "historical_area_df": pd.DataFrame({
        "FY": [2024, 2025],
        "production_area": [8655, 9339],
        "vacant_area": [862, 2304],
        "passage_area": [3906, 3495],
        "people_area": [598, 571],
        "admin_area": [2819, 2819],
        "inventory_area": [11600, 11293],
        "external_wh_area": [0, 0],
        "customer_wh_area": [875, 875],
        "total_area": [27579, 27517]
    })
},

# =========================================================
# DNKI
# =========================================================
"DNKI": {
    "defaults": {
        "cycle_time_hours": 0.2,
        "base_oee": 0.75,
        "machine_size_m2": 80,
        "warehouse_capacity_units_m2": 6,
        "total_plant_area": 32523
    },

    "sales_df": pd.DataFrame({
        "FY": list(range(2024, 2036)),
        "sales_units": [
            2273809, 1940476, 2023809, 2136905, 2251451,
            2370000, 2500000, 2650000, 2800000, 2950000, 3100000, 3250000
        ]
    }),

    "historical_area_df": pd.DataFrame({
        "FY": [2024, 2025],
        "production_area": [6416, 5991],
        "vacant_area": [860, 1691],
        "passage_area": [3013, 3013],
        "people_area": [685, 685],
        "admin_area": [716, 310],
        "inventory_area": [4604, 4604],
        "external_wh_area": [17222, 15165],
        "customer_wh_area": [1838, 2629],
        "total_area": [32656, 29769]
    })
}

}
