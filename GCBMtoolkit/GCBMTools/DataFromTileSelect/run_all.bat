@echo off

REM *************************** USER CONFIGURATION ***************************
REM Set Python path - change this to your Python installation directory.
set GCBM_PYTHON=C:\Python310
REM **************************************************************************

REM Set GDAL library paths.
set GDAL_BIN=%GCBM_PYTHON%\lib\site-packages\osgeo
set GDAL_DATA=%GDAL_BIN%\data\gdal
set PROJ_LIB=%GDAL_BIN%\data\proj

set PYTHONPATH=%GCBM_PYTHON%;%GCBM_PYTHON%\lib\site-packages
set PATH=%GCBM_PYTHON%;%GDAL_BIN%;%GDAL_DATA%;%PROJ_LIB%;%GCBM_PYTHON%\scripts;%GCBM_PYTHON%\lib\site-packages

REM Clean up log and output directories.
if exist processed_output rd /s /q processed_output
md processed_output

walltowall prepare config\walltowall_config.json .
walltowall run local . --config_path config\walltowall_config.json

REM Merge the raw spatial output and convert to GeoTIFF format.
echo Compiling spatial output...
"%GCBM_PYTHON%\python.exe" tools\compilegcbmspatialoutput\create_tiffs.py gcbm_project\output processed_output\spatial

REM Create the results database from the raw simulation output.
echo Compiling results database...
"%GCBM_PYTHON%\python.exe" tools\compilegcbmresults\compileresults.py sqlite:///gcbm_project/output/gcbm_output.db --output_db sqlite:///processed_output/compiled_gcbm_output.db
