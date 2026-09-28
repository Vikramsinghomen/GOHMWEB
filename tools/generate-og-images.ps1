# Generates branded 1200x630 Open Graph images for every HTML page in GOHMWEB-Repo.
# Brand palette pulled from css/styles.css :root variables.
# Usage: pwsh -File tools/generate-og-images.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$RepoRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'GOHMWEB-Repo'
$AssetDir = Join-Path $RepoRoot 'assets'
$OutDir   = Join-Path $AssetDir 'og'
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

# --- Brand colours (keep in sync with css/styles.css :root) ---
$Turquoise      = [System.Drawing.Color]::FromArgb(255, 20, 184, 166)   # --turquoise
$TurquoiseLight = [System.Drawing.Color]::FromArgb(255, 94, 234, 212)   # --turquoise-light
$TurquoiseSoft  = [System.Drawing.Color]::FromArgb(255, 204, 251, 241)  # --turquoise-soft
$Black          = [System.Drawing.Color]::FromArgb(255, 17, 17, 17)     # --black
$White          = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)  # --white

# --- Fonts: prefer the site webfonts if installed, else metric-safe fallbacks ---
function Get-FontFamily {
    param([string[]]$Preferred, [string]$Fallback)
    $installed = [System.Drawing.FontFamily]::Families.Name
    foreach ($p in $Preferred) { if ($installed -contains $p) { return $p } }
    return $Fallback
}
$SerifFamily = Get-FontFamily -Preferred @('Playfair Display') -Fallback 'Georgia'
$SansFamily  = Get-FontFamily -Preferred @('Inter') -Fallback 'Segoe UI'

# OG images must be 1200x630 (1.91:1) for Facebook/X/LinkedIn/WhatsApp previews
$W = 1200; $H = 630

# PAGE_DATA_MARKER

# Page slug -> eyebrow (small kicker), headline, subline, icon glyph
$Pages = @(
    @{ File='index';            Eyebrow='GREATOHM APP';   Head="World's First Omni App"; Sub='for all Occult Sciences';      Icon='ॐ' },
    @{ File='astrology';        Eyebrow='VEDIC ASTROLOGY'; Head='Astrology & Horoscope';  Sub='Kundli, Dasha & Predictions';  Icon='☉' },
    @{ File='kundli';           Eyebrow='VEDIC ASTROLOGY'; Head='Kundli & Birth Chart';   Sub='Free Janam Kundli Online';     Icon='☉' },
    @{ File='kundli-matching';  Eyebrow='MATCH MAKING';    Head='Kundli Matching';        Sub='36-Guna Compatibility';        Icon='♡' },
    @{ File='nakshatra';        Eyebrow='VEDIC ASTROLOGY'; Head='Nakshatra Finder';       Sub='Find Your Birth Star';         Icon='✦' },
    @{ File='sade-sati';        Eyebrow='VEDIC ASTROLOGY'; Head='Sade Sati Check';        Sub='Saturn Transit & Remedies';    Icon='♄' },
    @{ File='manglik-dosha';    Eyebrow='VEDIC DOSHAS';    Head='Manglik Dosha Check';    Sub='Mangal & Kaal Sarp Dosha';     Icon='♂' },
    @{ File='lal-kitab';        Eyebrow='REMEDIES';        Head='Lal Kitab Remedies';     Sub='Practical Zodiac Upay';        Icon='✧' },
    @{ File='shubh-mahurat';     Eyebrow='VEDIC CALENDAR';  Head='Shubh Mahurat';          Sub='Auspicious Date & Time';       Icon='🕉' },
    @{ File='numerology';       Eyebrow='NUMEROLOGY';      Head='Numerology Calculator';  Sub='Life Path, Destiny & Name';    Icon='7' },
    @{ File='lo-shu-grid';      Eyebrow='NUMEROLOGY';      Head='Lo Shu Grid';            Sub='Chinese Magic Square';         Icon='#' },
    @{ File='vastu';            Eyebrow='VASTU SHASTRA';   Head='Vastu for Home & Office';Sub='Tips, Doshas & AI Scan';      Icon='⌂' },
    @{ File='vastu-remedies';   Eyebrow='VASTU SHASTRA';   Head='Vastu Remedies';         Sub='Balance the Energy of Space';  Icon='✧' },
    @{ File='tarot';            Eyebrow='TAROT & ORACLE';  Head='Tarot Card Reading';     Sub='Daily Pulls & Spreads';        Icon='✦' },
    @{ File='palmistry';        Eyebrow='PALMISTRY';       Head='Palm Reading';           Sub='AI Palm & Line Meanings';      Icon='✋' },
    @{ File='services';         Eyebrow='OUR SERVICES';    Head='All Services';           Sub='11 Sciences, One App';         Icon='✦' },
    @{ File='about';            Eyebrow='ABOUT US';        Head='Our Story & Mission';    Sub='GREATOHM (OPC) Private Limited'; Icon='◈' },
    @{ File='join';             Eyebrow='CAREERS';         Head='Join GreatOhm';          Sub='Jobs & Expert Registration';   Icon='✦' },
    @{ File='privacy';          Eyebrow='LEGAL';           Head='Privacy Policy';         Sub='DPDP Act 2023 Compliant';      Icon='◆' },
    @{ File='terms';            Eyebrow='LEGAL';           Head='Terms & Conditions';     Sub='App, Club & Subscriptions';    Icon='◆' },
    @{ File='delete-account';   Eyebrow='LEGAL';           Head='Delete Your Account';    Sub='Self-Service Data Erasure';    Icon='◆' }
)

function New-LinearBrush {
    param($rect, $from, $to, [float]$angle = 25)
    return (New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $from, $to, $angle))
}

function Draw-Text {
    param(
        [System.Drawing.Graphics]$G,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [System.Drawing.RectangleF]$Rect
    )
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = 'Near'; $sf.LineAlignment = 'Near'; $sf.Trimming = 'EllipsisWord'
    $G.DrawString($Text, $Font, $Brush, $Rect, $sf)
    $sf.Dispose()
}

$logoPath = Join-Path $AssetDir 'logo1-trim.png'
$logo = $null
if (Test-Path $logoPath) { $logo = [System.Drawing.Image]::FromFile($logoPath) }

$made = @()
foreach ($page in $Pages) {
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $G = [System.Drawing.Graphics]::FromImage($bmp)
    $G.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $G.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $G.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background: deep black -> dark teal diagonal
    $bg = New-LinearBrush -rect (New-Object System.Drawing.Rectangle(0, 0, $W, $H)) -from $Black -to ([System.Drawing.Color]::FromArgb(255, 6, 78, 74)) -angle 30
    $G.FillRectangle($bg, 0, 0, $W, $H); $bg.Dispose()

    # Soft turquoise glow, top-right
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddEllipse(760, -220, 640, 640)
    $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
    $glow.CenterColor = [System.Drawing.Color]::FromArgb(90, 20, 184, 166)
    $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 20, 184, 166))
    $G.FillPath($glow, $gp); $glow.Dispose(); $gp.Dispose()

    # Faint concentric rings, bottom-left
    $ring = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(28, 94, 234, 212)), 2
    foreach ($r in 260, 380, 500) { $G.DrawEllipse($ring, -220 - $r, 420 - $r, ($r * 2), ($r * 2)) }
    $ring.Dispose()

    # Top accent bar
    $bar = New-LinearBrush -rect (New-Object System.Drawing.Rectangle(0, 0, $W, 8)) -from $TurquoiseLight -to $Turquoise -angle 0
    $G.FillRectangle($bar, 0, 0, $W, 8); $bar.Dispose()

    # Logo on a light rounded card so the dark wordmark stays legible on the dark bg
    if ($logo) {
        $cardW = 262; $cardH = 112; $cardX = 60; $cardY = 44
        $card = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(242, 255, 255, 255))
        $cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $r = 22
        $cardPath.AddArc($cardX, $cardY, $r, $r, 180, 90)
        $cardPath.AddArc($cardX + $cardW - $r, $cardY, $r, $r, 270, 90)
        $cardPath.AddArc($cardX + $cardW - $r, $cardY + $cardH - $r, $r, $r, 0, 90)
        $cardPath.AddArc($cardX, $cardY + $cardH - $r, $r, $r, 90, 90)
        $cardPath.CloseFigure()
        $G.FillPath($card, $cardPath)
        $card.Dispose(); $cardPath.Dispose()

        $availW = $cardW - 36; $availH = $cardH - 30
        $scale = [Math]::Min($availW / $logo.Width, $availH / $logo.Height)
        $lw = [int]($logo.Width * $scale); $lh = [int]($logo.Height * $scale)
        $lx = $cardX + [int](($cardW - $lw) / 2)
        $ly = $cardY + [int](($cardH - $lh) / 2)
        $G.DrawImage($logo, $lx, $ly, $lw, $lh)
    }

    # Icon roundel, top-right
    $ib = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(38, 94, 234, 212))
    $G.FillEllipse($ib, 1000, 52, 128, 128); $ib.Dispose()
    $ir = New-Object System.Drawing.Pen $TurquoiseLight, 3
    $G.DrawEllipse($ir, 1000, 52, 128, 128); $ir.Dispose()
    $ifnt = New-Object System.Drawing.Font $SansFamily, 54, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $ib2 = New-Object System.Drawing.SolidBrush $TurquoiseSoft
    $ifmt = New-Object System.Drawing.StringFormat
    $ifmt.Alignment = 'Center'; $ifmt.LineAlignment = 'Center'
    $G.DrawString($page.Icon, $ifnt, $ib2, (New-Object System.Drawing.RectangleF(1000, 52, 128, 128)), $ifmt)
    $ifmt.Dispose(); $ib2.Dispose(); $ifnt.Dispose()

    # Eyebrow
    $efnt = New-Object System.Drawing.Font $SansFamily, 23, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $ebr  = New-Object System.Drawing.SolidBrush $TurquoiseLight
    Draw-Text -G $G -Text $page.Eyebrow.ToUpperInvariant() -Font $efnt -Brush $ebr -Rect (New-Object System.Drawing.RectangleF(72, 194, 900, 40))
    $ebr.Dispose(); $efnt.Dispose()

    # Headline, auto-shrunk to fit the 1000x190 box
    $size = 68
    $hfnt = New-Object System.Drawing.Font $SerifFamily, $size, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    while ($size -gt 38) {
        $m = $G.MeasureString($page.Head, $hfnt, 1000)
        if ($m.Width -le 1000 -and $m.Height -le 190) { break }
        $hfnt.Dispose(); $size -= 4
        $hfnt = New-Object System.Drawing.Font $SerifFamily, $size, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    }
    $hbr = New-Object System.Drawing.SolidBrush $White
    Draw-Text -G $G -Text $page.Head -Font $hfnt -Brush $hbr -Rect (New-Object System.Drawing.RectangleF(72, 242, 1000, 190))
    $hbr.Dispose(); $hfnt.Dispose()

    # Subline
    $sfnt = New-Object System.Drawing.Font $SansFamily, 33, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $sbr  = New-Object System.Drawing.SolidBrush $TurquoiseSoft
    Draw-Text -G $G -Text $page.Sub -Font $sfnt -Brush $sbr -Rect (New-Object System.Drawing.RectangleF(72, 442, 1000, 60))
    $sbr.Dispose(); $sfnt.Dispose()

    # Footer rule
    $rule = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 94, 234, 212)), 2
    $G.DrawLine($rule, 72, 522, 1128, 522); $rule.Dispose()

    # Footer domain (left) and tagline (right)
    $dfnt = New-Object System.Drawing.Font $SansFamily, 28, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $dbr  = New-Object System.Drawing.SolidBrush $White
    $G.DrawString('greatohm.com', $dfnt, $dbr, 72, 542)
    $dbr.Dispose(); $dfnt.Dispose()

    $tfnt = New-Object System.Drawing.Font $SansFamily, 23, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $tbr  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(190, 204, 251, 241))
    $tfmt = New-Object System.Drawing.StringFormat
    $tfmt.Alignment = 'Far'
    $G.DrawString('Vedic guidance, numerology, Vaastu & more', $tfnt, $tbr, (New-Object System.Drawing.RectangleF(540, 546, 588, 40)), $tfmt)
    $tfmt.Dispose(); $tbr.Dispose(); $tfnt.Dispose()

    $G.Dispose()
    $out = Join-Path $OutDir ($page.File + '-og.png')
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $made += $out
}

if ($logo) { $logo.Dispose() }
$made | ForEach-Object { Write-Output "generated: $_" }
Write-Output "total: $($made.Count) images in $OutDir"
