import os
import sqlite3

from qaqc import run_qaqc

data_dir = "..\processed_output"  # Adjust to your data directory
current_dir = os.getcwd()
plot_dir = os.path.join(current_dir, 'processed_output', 'qaqc_plots')
#plot_dir = r"C:\Users\lbarnes\GCBM\RealWorldData\processed_output\qaqc_plots"

# Define scenario names (these should match your database names <scenario>.db)
scenarios = ["compiled_gcbm_output"]

# Run QAQC
run_qaqc(data_dir, plot_dir, scenarios)
