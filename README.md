# GCBMtoolkit
This app is designed to provide a simplified, user-friendly interface for running and visualizing scenarios using Canada’s Generic Carbon Budget Model (GCBM).
It wraps the complex GCBM workflows in a clean GUI, making it easier for researchers, analysts, and forest managers to:
  *	Manage input datasets (like lead-species, disturbance, and age-class TIFFs)
  *	Configure simulation parameters without editing JSON manually
  * View output layers (e.g., biomass, carbon fluxes) as interactive animations
    
It’s built using Electron, React, and Node.js, to simplify forest carbon modeling and make it accessible for everyone!

## Getting started

**Insure the application is installed in a location that doesn’t require admin privileges**
1.	Download the Toolkit Installers
  * Download GCBMtoolkit Installers:
    *	GCBM_Installer
    *	GCBM_Setup-bin1
    *	GCBM_Setup-bin2
    *	GCBM_Setup-bin3
  *	Run the GCBM_Installer
    
This will Install the Electron app.

2.	Set-up Python
* Within the app, go to the “set-up” page, and install python, or if python is already installed, set your python directory, and install the modules
  
3.	Begin the simulation setup
* Navigate to the simulation page within the app.
*	Select a tile/s and prepare your datasets
  
4.	Run a GCBM Simulation
*	Click the “Generate” button in the app after your input setup is complete.
*	The backend will execute GCBM and save results in the output folder.
  
5.	View Outputs
* Go to the Output Viewer tab.
*	Click on output layers to view them or play time-based animations.

