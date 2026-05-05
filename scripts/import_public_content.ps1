param(
  [string]$SeedDir = "data/public-seeds",
  [string]$OutputDir = "data/db-import"
)

$ErrorActionPreference = "Stop"

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Normalize-SeedRecords {
  param(
    [string]$Collection,
    [array]$Records
  )

  $now = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  $normalized = @()

  foreach ($record in $Records) {
    if (-not $record.status) {
      $record | Add-Member -NotePropertyName status -NotePropertyValue 1
    }
    if (-not $record.publishedAt -and $Collection -in @("articles", "announcements")) {
      $record | Add-Member -NotePropertyName publishedAt -NotePropertyValue (Get-Date).ToString("yyyy-MM-dd")
    }
    $record | Add-Member -Force -NotePropertyName importedAt -NotePropertyValue $now
    $normalized += $record
  }

  return $normalized
}

$root = Split-Path -Parent $PSScriptRoot
$resolvedSeedDir = Join-Path $root $SeedDir
$resolvedOutputDir = Join-Path $root $OutputDir

Ensure-Directory -Path $resolvedOutputDir

$collections = @("foods", "articles", "activities", "announcements")

foreach ($collection in $collections) {
  $sourcePath = Join-Path $resolvedSeedDir "$collection.json"
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Missing seed file: $sourcePath"
  }

  $jsonText = Get-Content -LiteralPath $sourcePath -Raw -Encoding UTF8
  $records = $jsonText | ConvertFrom-Json
  if ($records -isnot [System.Collections.IEnumerable]) {
    throw "Seed file must contain an array: $sourcePath"
  }

  $normalized = Normalize-SeedRecords -Collection $collection -Records @($records)
  $outputPath = Join-Path $resolvedOutputDir "$collection.import.json"
  $normalized | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $outputPath -Encoding UTF8
  Write-Host "Prepared import file: $outputPath"
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Open WeChat DevTools cloud database import panel."
Write-Host "2. Import files from data/db-import into the matching collections."
Write-Host "3. Recompile the mini program and verify articles/activities/announcements display."
