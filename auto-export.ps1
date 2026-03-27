# Auto-export brochure to PNG using Chrome headless
$ErrorActionPreference = "Stop"

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$htmlPath = "E:\DeskTop\网站\website\brochure.html"
$outDir = "E:\DeskTop\网站\website"
$url = "file:///" + $htmlPath.Replace("\", "/")

Write-Host "Starting Chrome headless..."
Write-Host "URL: $url"

# Use Chrome headless with remote debugging
$debugPort = 9222
$userDir = "$env:TEMP\chrome_debug_$PID"

$proc = Start-Process $chromePath -ArgumentList @(
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--remote-debugging-port=$debugPort",
    "--user-data-dir=$userDir",
    $url
) -PassThru

Start-Sleep 3

if ($proc.HasExited) {
    Write-Host "Chrome exited early with code: $($proc.ExitCode)"
    exit 1
}

Write-Host "Chrome started with PID: $($proc.Id)"

try {
    # Get CDP WebSocket endpoint
    $wsEndpoint = "http://localhost:$debugPort/json"
    Write-Host "Connecting to CDP at $wsEndpoint..."
    
    $resp = Invoke-RestMethod $wsEndpoint -TimeoutSec 10
    $wsUrl = $resp[0].webSocketDebuggerUrl
    
    Write-Host "WebSocket URL: $wsUrl"
    
    # Use System.Net.WebSockets.ClientWebSocket
    Add-Type -AssemblyName System.Net.WebSockets.ClientWebSocket -ErrorAction SilentlyContinue
    
    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ct = [Threading.CancellationToken]::None
    $ws.ConnectAsync($wsUrl, $ct).Wait(10000)
    
    if ($ws.State -ne 'Open') {
        Write-Host "WebSocket failed to connect. State: $($ws.State)"
    } else {
        Write-Host "Connected! Sending commands to capture screenshots..."
        
        # Send CDP commands
        function Send-CDP {
            param($ws, $id, $method, $params = @{})
            $msg = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Compress
            $bytes = [Text.Encoding]::UTF8.GetBytes($msg + "`n")
            $ws.SendAsync([ArraySegment[byte]]$bytes, 'Text', $true, $ct).Wait()
        }
        
        function Recv-CDP {
            param($ws)
            $buf = New-Object byte[] 8192
            $end = New-Object System.ArraySegment[byte] $buf
            $result = $ws.ReceiveAsync($end, $ct).Wait(10000)
            if ($result.Count -gt 0) {
                [Text.Encoding]::UTF8.GetString($buf, 0, $result.Count)
            }
        }
        
        $msgId = 1
        
        # Capture front page
        Write-Host "Capturing front page..."
        
        # Set viewport to A4 at high DPI scale
        Send-CDP $ws ($msgId++) "Page.setDefaultViewport" @{ width = 794; height = 1123; deviceScaleFactor = 12.5 }
        Start-Sleep 1
        
        # Capture
        $result = Recv-CDP $ws
        
        Send-CDP $ws ($msgId++) "Page.captureScreenshot" @{ format = "png"; quality = 100 }
        Start-Sleep 2
        $result = Recv-CDP $ws
        
        $json = $result | ConvertFrom-Json
        if ($json.result -and $json.result.data) {
            $pngData = [Convert]::FromBase64String($json.result.data)
            [IO.File]::WriteAllBytes("$outDir\恩博康宣传彩页_正面_1200dpi.png", $pngData)
            Write-Host "Front page saved! Size: $($pngData.Length) bytes"
        }
        
        $ws.CloseAsync('NormalClosure', "", $ct).Wait()
    }
} catch {
    Write-Host "Error: $_"
} finally {
    if ($proc -and -not $proc.HasExited) {
        Stop-Process $proc.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Chrome closed."
    }
}

Write-Host "Done!"
