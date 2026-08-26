# ============================================================
# JUAMPYZEL - Script de setup de base de datos (PowerShell)
# Crea la base de datos juampyzel si no existe
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JUAMPYZEL - Setup de Base de Datos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si MySQL esta disponible
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "[ERROR] MySQL no se encuentra en el PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale MySQL 8.0 desde: https://dev.mysql.com/downloads/installer/"
    Write-Host "O agregue la ruta de MySQL al PATH del sistema."
    Write-Host ""
    Read-Host "Presione Enter para salir"
    exit 1
}

Write-Host "[1/3] Verificando conexion a MySQL..." -ForegroundColor Yellow
$testConn = mysql -u root -p -e "SELECT 1" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo conectar a MySQL." -ForegroundColor Red
    Write-Host "Verifique que el servicio este ejecutandose y las credenciales sean correctas."
    Read-Host "Presione Enter para salir"
    exit 1
}
Write-Host "       Conexion exitosa." -ForegroundColor Green
Write-Host ""

Write-Host "[2/3] Verificando si la base de datos 'juampyzel' existe..." -ForegroundColor Yellow
$checkDB = mysql -u root -p -e "USE juampyzel" 2>$null
$dbExists = $LASTEXITCODE -eq 0

if ($dbExists) {
    Write-Host "       La base de datos 'juampyzel' ya existe." -ForegroundColor Yellow
    $resp = Read-Host "       Desea recrearla? (s/N)"
    if ($resp -ne "s" -and $resp -ne "S") {
        Write-Host "       Operacion cancelada." -ForegroundColor Yellow
        Read-Host "Presione Enter para salir"
        exit 0
    }
    Write-Host "       Recreando base de datos..." -ForegroundColor Yellow
}

Write-Host "[3/3] Ejecutando script de base de datos..." -ForegroundColor Yellow
Write-Host ""
$scriptPath = Join-Path $PSScriptRoot "juampyzel_database.sql"
mysql -u root -p < $scriptPath

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Error al ejecutar el script SQL." -ForegroundColor Red
    Read-Host "Presione Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Base de datos creada exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tablas creadas:" -ForegroundColor Cyan
Write-Host "  - usuario"
Write-Host "  - categoria"
Write-Host "  - producto"
Write-Host "  - sucursal"
Write-Host "  - cliente"
Write-Host "  - tienda"
Write-Host "  - inventario"
Write-Host "  - venta"
Write-Host "  - detalle_venta"
Write-Host "  - pedido"
Write-Host "  - detalle_pedido"
Write-Host ""
Write-Host "Usuarios iniciales:" -ForegroundColor Cyan
Write-Host "  - admin@juampyzel.com / admin123"
Write-Host "  - vendedor@juampyzel.com / vendedor123"
Write-Host "  - inventario@juampyzel.com / inventario123"
Write-Host ""
Read-Host "Presione Enter para salir"
