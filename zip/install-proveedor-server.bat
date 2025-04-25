@echo off
SETLOCAL ENABLEEXTENSIONS

:: CONFIGURACIÓN
set NSSM_PATH=C:\nssm\nssm.exe
set NODE_PATH=C:\Program Files\nodejs\node.exe
set INSTALL_DIR=C:\proveedor-server
set SERVICE_NAME=ProveedorServer
set MAIN_SCRIPT=src\index.js

echo Instalando servidor del proveedor...

:: Crear carpeta de instalación
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

:: Desempaquetar código
echo Extrayendo archivos...
powershell -Command "Expand-Archive -Path '%~dp0proveedor-server.zip' -DestinationPath '%INSTALL_DIR%' -Force"

:: Instalar dependencias
cd /d "%INSTALL_DIR%"
call npm install --omit=dev

:: Instalar el servicio con NSSM
echo Registrando servicio con NSSM...
"%NSSM_PATH%" install %SERVICE_NAME% "%NODE_PATH%" "%INSTALL_DIR%\%MAIN_SCRIPT%"
"%NSSM_PATH%" set %SERVICE_NAME% AppDirectory "%INSTALL_DIR%"
"%NSSM_PATH%" set %SERVICE_NAME% Start SERVICE_AUTO_START

:: Iniciar el servicio
"%NSSM_PATH%" start %SERVICE_NAME%

echo Instalación completa.
pause
