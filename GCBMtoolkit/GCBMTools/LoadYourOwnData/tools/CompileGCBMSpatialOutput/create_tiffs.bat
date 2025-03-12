@echo off

REM *************************** USER CONFIGURATION ***************************
REM Set Python path - change this to your Python installation directory.
set GCBM_PYTHON=C:\Python310
REM **************************************************************************

REM Set GDAL library paths.
set GDAL_BIN=%GCBM_PYTHON%\lib\site-packages\osgeo
set GDAL_DATA=%GDAL_BIN%\data\gdal
set PROJ_LIB=%GDAL_BIN%\data\proj

set PYTHONPATH=%GCBM_PYTHON%\lib\site-packages;%GCBM_PYTHON%;%GDAL_BIN%
set PATH=%GCBM_PYTHON%;%GDAL_BIN%;%GDAL_DATA%;%PROJ_LIB%;%GCBM_PYTHON%\scripts;%GCBM_PYTHON%\lib\site-packages

REM Clean up output directory.
if exist ..\..\processed_output\spatial rd /s /q ..\..\processed_output\spatial
md ..\..\processed_output\spatial

"%GCBM_PYTHON%\python.exe" create_tiffs.py ..\..\gcbm_project\output ..\..\processed_output\spatial --log_path ..\..\logs
echo Done!
pause
