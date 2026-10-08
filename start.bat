@echo off
setlocal enabledelayedexpansion
title SiHadir - Aplikasi Presensi Murid Sekolah
cls

:: Pastikan direktori sistem Windows ada di PATH sesi ini
set "PATH=C:\Windows\System32;C:\Windows;C:\Windows\System32\WindowsPowerShell\v1.0;%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"

echo ==========================================================
echo       MEMULAI APLIKASI ABSENSI MURID (SiHadir)
echo ==========================================================
echo.

:: Deteksi lokasi file powershell.exe secara pasti
set "PS_BIN="

if exist "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" (
    set "PS_BIN=C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
) else if exist "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" (
    set "PS_BIN=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
) else if exist "%WINDIR%\System32\WindowsPowerShell\v1.0\powershell.exe" (
    set "PS_BIN=%WINDIR%\System32\WindowsPowerShell\v1.0\powershell.exe"
) else (
    set "PS_BIN=powershell.exe"
)

echo Menyiapkan server presensi lokal di http://localhost:8080 ...
echo Peramban web akan terbuka secara otomatis.
echo.
echo [INFO] Jangan tutup jendela hitam ini selama menggunakan aplikasi.
echo [INFO] Tekan CTRL + C atau silang jendela untuk mematikan server.
echo.

:: Jalankan server lokal PowerShell
"!PS_BIN!" -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"

if errorlevel 1 (
    echo.
    echo [INFO] Terjadi kendala membuka server lokal.
    echo Membuka berkas index.html langsung di peramban...
    start "" "%~dp0index.html"
)

pause
