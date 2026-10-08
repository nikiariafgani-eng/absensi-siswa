# SiHadir - Lightweight Zero-Dependency Local Web Server for Windows
$ErrorActionPreference = "SilentlyContinue"

# Tentukan direktori root aplikasi secara aman
$root = $PSScriptRoot
if (-not $root) {
    if ($MyInvocation.MyCommand.Definition) {
        $root = Split-Path -Parent $MyInvocation.MyCommand.Definition
    }
}
if (-not $root) {
    $root = (Get-Location).Path
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Coba bind ke port yang tersedia (8080, 8081, 8082, 3000)
$ports = @(8080, 8081, 8082, 3000)
$listener = $null
$activePort = $null

foreach ($p in $ports) {
    try {
        $temp = New-Object System.Net.HttpListener
        $temp.Prefixes.Add("http://localhost:$p/")
        $temp.Start()
        $listener = $temp
        $activePort = $p
        break
    } catch {
        if ($temp) {
            $temp.Close()
        }
    }
}

$url = "http://localhost:$activePort/"

if (-not $listener) {
    Write-Host "[INFO] Port lokal tidak tersedia, membuka index.html secara langsung..." -ForegroundColor Yellow
    $indexFile = Join-Path $root "index.html"
    Start-Process $indexFile
    exit 0
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SiHadir - Server Presensi Murid Berhasil Berjalan!" -ForegroundColor Green
Write-Host "  Alamat URL : $url" -ForegroundColor Yellow
Write-Host "  Folder Root: $root" -ForegroundColor Gray
Write-Host "  Tekan CTRL + C di jendela ini untuk mematikan server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Buka browser otomatis ke localhost
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = "index.html"
        }

        # Cegah path traversal
        $filePath = [System.IO.Path]::GetFullPath((Join-Path $root $path))
        if (-not $filePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) {
                $mime = "application/octet-stream"
            }
            $response.ContentType = $mime
            $response.StatusCode = 200

            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                # Koneksi ditutup peramban lebih awal
            }
        } else {
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }

        $response.Close()
    }
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
