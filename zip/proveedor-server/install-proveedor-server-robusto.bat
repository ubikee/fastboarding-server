@echo off
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: CONFIGURACIÓN
set NSSM_PATH=C:\nssm\nssm.exe
set NODE_PATH=C:\Program Files\nodejs\node.exe
set INSTALL_DIR=C:\proveedor-server
set SERVICE_NAME=ProveedorServer
set MAIN_SCRIPT=src\index.js

echo.
echo =============================
echo Instalación del servidor del proveedor
echo =============================

:: Verificar si Node.js existe
if not exist "%NODE_PATH%" (
    echo ❌ Node.js no encontrado en %NODE_PATH%
    echo Asegúrate de que Node.js esté instalado.
    pause
    exit /b 1
)

:: Verificar si NSSM existe
if not exist "%NSSM_PATH%" (
    echo ❌ NSSM no encontrado en %NSSM_PATH%
    echo Descarga NSSM desde https://nssm.cc/download y colócalo ahí.
    pause
    exit /b 1
)

:: Hacer copia si ya existe una instalación
if exist "%INSTALL_DIR%" (
    set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
    set BACKUP_DIR=%INSTALL_DIR%-backup-%TIMESTAMP%
    echo 💾 Haciendo copia de seguridad en: !BACKUP_DIR!
    xcopy /E /I /Y "%INSTALL_DIR%\*" "!BACKUP_DIR%\" >nul
)

:: Crear carpeta de instalación
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

:: Desempaquetar código
echo 🔄 Extrayendo código fuente...
powershell -Command "Expand-Archive -Path '%~dp0proveedor-server.zip' -DestinationPath '%INSTALL_DIR%' -Force"

:: Instalar dependencias
cd /d "%INSTALL_DIR%"
echo 📦 Instalando dependencias...
call npm install --omit=dev || (
    echo ❌ Error al instalar dependencias con npm.
    pause
    exit /b 1
)

:: Registrar servicio
echo 🔧 Registrando servicio con NSSM...
"%NSSM_PATH%" install %SERVICE_NAME% "%NODE_PATH%" "%INSTALL_DIR%\%MAIN_SCRIPT%" >nul
"%NSSM_PATH%" set %SERVICE_NAME% AppDirectory "%INSTALL_DIR%" >nul
"%NSSM_PATH%" set %SERVICE_NAME% Start SERVICE_AUTO_START >nul

:: Iniciar el servicio
echo 🚀 Iniciando servicio...
"%NSSM_PATH%" start %SERVICE_NAME%

echo.
echo ✅ Instalación completada con éxito.
pause
