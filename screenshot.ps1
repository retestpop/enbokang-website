$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$htmlFile = "E:\DeskTop\网站\website\brochure.html"
$outDir = "E:\DeskTop\网站\website"
$url = "file:///" + $htmlFile.Replace("\","/").Replace(" ","%20")

Write-Host "Chrome: $chrome"
Write-Host "URL: $url"

# Use Chrome print-to-PDF as high quality image proxy
# First, try screenshot approach with full page viewport
$args = @(
    "--headless=new",
    "--disable-gpu", 
    "--screenshot=$outDir\brochure-front-test.png",
    "--window-size=794,1123",
    "--force-device-scale-factor=4",
    $url
)

try {
    Write-Host "Launching Chrome..."
    Start-Process -FilePath $chrome -ArgumentList $args -Wait -NoNewWindow -PassThru
    Write-Host "Done. Check output file."
} catch {
    Write-Host "Error: $_"
}

# Check if file was created
if (Test-Path "$outDir\brochure-front-test.png") {
    $size = (Get-Item "$outDir\brochure-front-test.png").Length
    Write-Host "File created, size: $size bytes"
}
