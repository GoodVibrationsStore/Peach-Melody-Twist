param(
    [switch]$Force,
    [switch]$Verbose
)

Write-Host "Enhanced Shopify Theme Setup - CLI Installation" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Function to test command availability
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host " Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host " Node.js not found. Installing via winget..." -ForegroundColor Yellow
    
    if (Test-Command "winget") {
        try {
            winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            Start-Sleep -Seconds 3
            
            if (Test-Command "node") {
                $nodeVersion = node --version
                Write-Host " Node.js installed: $nodeVersion" -ForegroundColor Green
            } else {
                Write-Host " Installation failed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
                exit 1
            }
        } catch {
            Write-Host " winget installation failed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host " npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host " npm not found" -ForegroundColor Red
    exit 1
}

# Clean npm environment
Write-Host "Preparing npm environment..." -ForegroundColor Yellow
try {
    npm cache clean --force 2>$null
    Write-Host " npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Warning "Could not clean npm cache, continuing..."
}

# Install Shopify CLI
Write-Host "Installing Shopify CLI..." -ForegroundColor Yellow

$installMethods = @(
    @{ Name = "npm global install"; Command = { npm install -g @shopify/cli@latest @shopify/theme@latest --no-audit } },
    @{ Name = "winget installation"; Command = { winget install Shopify.ShopifyCLI --accept-source-agreements --accept-package-agreements } },
    @{ Name = "npm with force"; Command = { npm install -g @shopify/cli@latest --force } }
)

$installed = $false

foreach ($method in $installMethods) {
    if ($installed) { break }
    
    Write-Host "Trying: $($method.Name)..." -ForegroundColor Cyan
    
    try {
        & $method.Command
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Start-Sleep -Seconds 2
        
        if (Test-Command "shopify") {
            $shopifyVersion = shopify version 2>$null
            if ($shopifyVersion) {
                Write-Host " Shopify CLI installed via $($method.Name)" -ForegroundColor Green
                Write-Host "  Version: $shopifyVersion" -ForegroundColor Green
                $installed = $true
            }
        }
    } catch {
        Write-Host " $($method.Name) failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if (-not $installed) {
    Write-Host "
 All installation methods failed" -ForegroundColor Red
    Write-Host "Manual options:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/Shopify/cli/releases" -ForegroundColor Cyan
    Write-Host "2. Try running PowerShell as Administrator" -ForegroundColor Cyan
    exit 1
}

# Final verification
Write-Host "
Final verification..." -ForegroundColor Yellow
try {
    $finalVersion = shopify version
    Write-Host " Shopify CLI ready: $finalVersion" -ForegroundColor Green
} catch {
    Write-Host " Verification failed. Try restarting PowerShell" -ForegroundColor Red
}

Write-Host "
 Installation Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. shopify auth login" -ForegroundColor Cyan
Write-Host "2. shopify theme dev --store=goodvibrations-store.myshopify.com" -ForegroundColor Cyan
Write-Host "3. shopify theme check" -ForegroundColor Cyan

Read-Host "
Press Enter to close"
