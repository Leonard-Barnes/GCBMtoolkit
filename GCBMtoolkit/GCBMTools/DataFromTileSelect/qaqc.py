import os
import time
import matplotlib.pyplot as plt
import pandas as pd
import sqlite3


def plot_figure(name, plot_dir, df):
    """ Plot a figure based on the passed dataframe. """
    plot_name = f"{name}.png"
    plot_path = os.path.join(plot_dir, plot_name)
    df.plot(x="year")
    plt.suptitle(f"Plot of {name}", wrap=True)
    plt.xlabel("Year")
    plt.xticks(rotation=90)
    plt.tight_layout(rect=[0.04, 0.02, 0.98, 0.95])
    plt.ylabel("Value")
    plt.grid(which="major")
    plt.legend()
    plt.savefig(plot_path)
    plt.close()


def save_csv(name, plot_dir, df):
    """ Save a dataframe to a csv file. """
    csv_dir = os.path.join(plot_dir, "csv")
    if not os.path.exists(csv_dir):
        os.mkdir(csv_dir)
    csv_path = os.path.join(csv_dir, f"{name}.csv")
    df.to_csv(csv_path, index=False)


def run_qaqc(data_dir, plot_dir, scenarios):
    """ Run QAQC for the available scenarios. """
    print("Started QAQC:", time.strftime("%a %H:%M:%S"))

    # Make the plot output folder if it doesn't exist
    if not os.path.exists(plot_dir):
        os.makedirs(plot_dir)

    # Build query templates
    indicator_sql   = """
                      SELECT year, SUM({indicator_type}_tc) AS val_db
                      FROM {indicator_table}
                      WHERE indicator = '{indicator_name}'
                      GROUP by year
                      """

    disturbance_sql = """
                      SELECT year, SUM({indicator_type}) AS val_db
                      FROM {indicator_table}
                      WHERE disturbance_type LIKE '%{disturbance_filter}%'
                      GROUP by year
                      """
                      
    # Create a dictionary of queries
    sqldict = {
        "AG_Biomass_C"           : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Aboveground Biomass"),
        "NBP"                    : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="NBP"),
        "Delta_Total_DOM"        : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="Delta Total DOM"),
        "Dead_Organic_Matter_C"  : """
                                   SELECT year, SUM(pool_tc) AS val_db
                                   FROM v_pool_indicators WHERE indicator in ('Soil Carbon', 'Litter', 'Deadwood') GROUP by year
                                   """,
        "Decomp_Releases"        : indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="Decomposition Releases"),
        "Delta_Total_Biomass"    : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="Delta Total Biomass"),
        "Delta_Total_Ecosystem"  : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="Delta Total Ecosystem"),
        "Disturbance_Losses"     : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="Disturbance Losses"),
        "All_Production"         : indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="All Production"),
        "NEP"                    : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="NEP"),
        "NPP"                    : indicator_sql.format(indicator_type="flux", indicator_table="v_stock_change_indicators",   indicator_name="NPP"),
        "Soil_C"                 : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Soil Carbon"),
        "Total_Biomass_C"        : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Total Biomass"),
        "Total_Biomass_Emissions": indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="Biomass Emissions"),
        "Total_DOM_Emissions"    : indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="DOM Emissions"),
        "Total_Ecosystem_C"      : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Total Ecosystem"),
        "Total_Emissions"        : indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="All Emissions"),
        "Gross_Growth"           : indicator_sql.format(indicator_type="flux", indicator_table="v_flux_indicator_aggregates", indicator_name="Gross Growth"),
        "Stem_Snags"             : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Stem Snags"),
        "Merch"                  : indicator_sql.format(indicator_type="pool", indicator_table="v_pool_indicators",           indicator_name="Merch"),
        "Clearcut_Harvest"       : """
                                   SELECT year, SUM(dist_area) AS val_db
                                   FROM v_total_disturbed_areas
                                   WHERE disturbance_type LIKE '%Base CC%' OR disturbance_type LIKE '%clearcut harvest%'
                                   GROUP by year
                                   """,
        "Salvage_Harvest"        : disturbance_sql.format(indicator_type="dist_area", indicator_table="v_total_disturbed_areas", disturbance_filter="salvage"),
        "Fire"                   : disturbance_sql.format(indicator_type="dist_area", indicator_table="v_total_disturbed_areas", disturbance_filter="fire"),
        "Insect"                 : disturbance_sql.format(indicator_type="dist_area", indicator_table="v_total_disturbed_areas", disturbance_filter="Mountain Pine Beetle"),
    }

    # Carry out the queries on the selected scenarios
    for name, query in sqldict.items():
        df_list = []
        for scenario in scenarios:
            db = os.path.join(os.getcwd(), 'processed_output', 'compiled_gcbm_output.db')
            conn = sqlite3.connect(db)
            df = pd.read_sql_query(query, conn)
            conn.close()

            if df.empty:
                del df
                df = pd.DataFrame()
                fake_years = []
                fake_values = []
                for n in range(1900, 2100):
                    fake_years.append(n)
                    fake_values.append(0)
                df['year'] = fake_years
                df[scenario] = fake_values

            df.columns = ["year", scenario]
            if min(df['year']) != 1990:
                add_years = df['year'].tolist()
                add_values = df[scenario].tolist()
                for i in range(1990, min(df['year'])):
                    add_years.append(i)
                    add_values.append(0)
                df_update = pd.DataFrame()
                df_update['year'] = add_years
                df_update[scenario] = add_values
                del df
                df = df_update.copy()

            if max(df['year']) != 2000:
                add_years = df['year'].tolist()
                add_values = df[scenario].tolist()
                for i in range(max(df['year']), 2000 + 1):
                    add_years.append(i)
                    add_values.append(0)
                df_update = pd.DataFrame()
                df_update['year'] = add_years
                df_update[scenario] = add_values
                del df
                df = df_update.copy()

            df_list.append(df)
            del df

        # Merge the dataframes
        scenario_list = []
        for df in df_list:
            scenario = df.columns[1]
            scenario_list.append(scenario)
            # Create the merged array of all disturbance types
            try:
                df_merge
            except NameError:
                var_exists = False
            else:
                var_exists = True
            if not var_exists:
                df_merge = df.copy()
            else:
                df_merge = df_merge.merge(df, on="year")

        # Plot the dataframe
        plot_figure(name, plot_dir, df_merge)
        save_csv(name, plot_dir, df_merge)

        # Create dataframe for difference plots
        if (len(scenario_list) > 1 and "Base" in scenario_list):
            df_diff = df_merge.copy()
            for i in range(1, len(scenario_list)):
                scenario = scenario_list[i]
                df_diff[f"{scenario}-Base"] = df_diff[scenario] - df_merge['Base']
                del df_diff[scenario]
            del df_diff['Base']
            name_diff = f"{name}_Diff"
            plot_figure(name_diff, plot_dir, df_diff)

            # Clean-up temporary dataframe
            try:
                del df_diff
            except UnboundLocalError:
                print("Dataframe does not exist to be deleted")

        # Clean-up temporary dataframe
        try:
            del df_merge
        except UnboundLocalError:
            print("Dataframe does not exist to be deleted")

    print("Finished QAQC:", time.strftime("%a %H:%M:%S"))
