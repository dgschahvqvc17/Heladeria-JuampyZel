@echo off
REM ============================================================
REM JUAMPYZEL - Script de setup de base de datos
REM Crea la base de datos juampyzel si no existe
REM ============================================================

echo.
echo ========================================
echo   JUAMPYZEL - Setup de Base de Datos
echo ========================================
echo.

REM Verificar si MySQL esta disponible
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] MySQL no se encuentra en el PATH.
    echo.
    echo Instale MySQL 8.0 desde: https://dev.mysql.com/downloads/installer/
    echo O agregue la ruta de MySQL al PATH del sistema.
    echo.
    pause
    exit /b 1
)

echo [1/3] Verificando conexion a MySQL...
mysql -u root -p -e "SELECT 1" >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo conectar a MySQL.
    echo Verifique que el servicio este ejecutandose y las credenciales sean correctas.
    echo.
    pause
    exit /b 1
)
echo       Conexion exitosa.
echo.

echo [2/3] Verificando si la base de datos 'juampyzel' existe...
mysql -u root -p -e "USE juampyzel" >nul 2>nul
if %errorlevel% equ 0 (
    echo       La base de datos 'juampyzel' ya existe.
    echo.
    set /p resp="Desea recrearla? (s/N): "
    if /i not "%resp%"=="s" (
        echo       Operacion cancelada.
        pause
        exit /b 0
    )
    echo       Recreando base de datos...
)

echo [3/3] Ejecutando script de base de datos...
echo.
mysql -u root -p < "%~dp0juampyzel_database.sql"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Error al ejecutar el script SQL.
    echo Verifique las credenciales de MySQL.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Base de datos creada exitosamente!
echo ========================================
echo.
echo Tablas creadas:
echo   - usuario
echo   - categoria
echo   - producto
echo   - sucursal
echo   - cliente
echo   - tienda
echo   - inventario
echo   - venta
echo   - detalle_venta
echo   - pedido
echo   - detalle_pedido
echo.
echo Usuarios iniciales:
echo   - admin@juampyzel.com / admin123
echo   - vendedor@juampyzel.com / vendedor123
echo   - inventario@juampyzel.com / inventario123
echo.
pause
