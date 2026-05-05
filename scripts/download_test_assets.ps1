$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $PSScriptRoot
$miniRoot = Join-Path $projectRoot "code\miniprogram"
$assetsRoot = Join-Path $miniRoot "assets"
$testImageRoot = Join-Path $assetsRoot "test-images"
$iconRoot = Join-Path $assetsRoot "icons"

$directories = @(
  $testImageRoot,
  (Join-Path $testImageRoot "banners"),
  (Join-Path $testImageRoot "categories"),
  (Join-Path $testImageRoot "foods"),
  (Join-Path $testImageRoot "activities"),
  (Join-Path $testImageRoot "groupbuy"),
  (Join-Path $testImageRoot "articles"),
  $iconRoot
)

foreach ($dir in $directories) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
}

function Get-OpenverseImage {
  param(
    [Parameter(Mandatory = $true)][string]$Query,
    [int]$PageSize = 10
  )

  $uri = "https://api.openverse.org/v1/images/?q=$([uri]::EscapeDataString($Query))&page_size=$PageSize"
  $response = Invoke-RestMethod -Uri $uri -Headers @{ "User-Agent" = "Codex-Test-Assets/1.0" }
  if (-not $response.results -or $response.results.Count -eq 0) {
    throw "Openverse returned no results for query: $Query"
  }

  $allowedLicenses = @("cc0", "by", "by-sa", "pdm")

  foreach ($item in $response.results) {
    if ($item.url -and $item.foreign_landing_url -and $allowedLicenses -contains $item.license) {
      return $item
    }
  }

  throw "Openverse returned no downloadable result with allowed license for query: $Query"
}

function Save-WebFile {
  param(
    [Parameter(Mandatory = $true)][string]$Uri,
    [Parameter(Mandatory = $true)][string]$OutFile
  )

  Invoke-WebRequest -Uri $Uri -OutFile $OutFile -Headers @{ "User-Agent" = "Codex-Test-Assets/1.0" }
}

$downloadPlan = @(
  @{ group = "banners"; name = "banner-1.jpg"; query = "beef noodles" },
  @{ group = "banners"; name = "banner-2.jpg"; query = "street food market" },
  @{ group = "banners"; name = "banner-3.jpg"; query = "dumplings food" },
  @{ group = "categories"; name = "category-noodles.jpg"; query = "beef noodle soup" },
  @{ group = "categories"; name = "category-barbecue.jpg"; query = "lamb kebab" },
  @{ group = "categories"; name = "category-snacks.jpg"; query = "dumplings" },
  @{ group = "categories"; name = "category-dessert.jpg"; query = "sweet rice dessert" },
  @{ group = "categories"; name = "category-drinks.jpg"; query = "tea drink" },
  @{ group = "categories"; name = "category-breakfast.jpg"; query = "flatbread" },
  @{ group = "foods"; name = "food-beef-noodles-cover.jpg"; query = "beef noodle soup" },
  @{ group = "foods"; name = "food-beef-noodles-detail-1.jpg"; query = "braised beef noodles" },
  @{ group = "foods"; name = "food-beef-noodles-detail-2.jpg"; query = "Chinese noodles bowl" },
  @{ group = "foods"; name = "food-lamb-skewers-cover.jpg"; query = "lamb kebab" },
  @{ group = "foods"; name = "food-lamb-skewers-detail-1.jpg"; query = "grilled skewers food" },
  @{ group = "foods"; name = "food-niangpi-cover.jpg"; query = "cold noodles dish" },
  @{ group = "foods"; name = "food-jiangshui-cover.jpg"; query = "vegetable noodle soup" },
  @{ group = "foods"; name = "food-grey-bean-cover.jpg"; query = "sweet dessert soup" },
  @{ group = "foods"; name = "food-fried-pastry-cover.jpg"; query = "fried pastry" },
  @{ group = "foods"; name = "food-lamb-bread-cover.jpg"; query = "flatbread lamb" },
  @{ group = "foods"; name = "food-sweet-rice-cover.jpg"; query = "sweet rice dessert" },
  @{ group = "foods"; name = "food-tea-cover.jpg"; query = "tea beverage" },
  @{ group = "activities"; name = "activity-1.jpg"; query = "food festival" },
  @{ group = "activities"; name = "activity-2.jpg"; query = "cooking class" },
  @{ group = "activities"; name = "activity-3.jpg"; query = "night market" },
  @{ group = "groupbuy"; name = "groupbuy-1.jpg"; query = "family meal noodles" },
  @{ group = "groupbuy"; name = "groupbuy-2.jpg"; query = "dumplings platter" },
  @{ group = "groupbuy"; name = "groupbuy-3.jpg"; query = "tea beverage set" },
  @{ group = "articles"; name = "article-1.jpg"; query = "food culture museum" },
  @{ group = "articles"; name = "article-2.jpg"; query = "traditional cooking noodles" },
  @{ group = "articles"; name = "article-3.jpg"; query = "street food chef" }
)

$sourceManifest = @()

foreach ($item in $downloadPlan) {
  $targetFile = Join-Path (Join-Path $testImageRoot $item.group) $item.name
  $metadata = Get-OpenverseImage -Query $item.query
  Save-WebFile -Uri $metadata.url -OutFile $targetFile

  $sourceManifest += [pscustomobject]@{
    group = $item.group
    file = $item.name
    query = $item.query
    localPath = "/assets/test-images/$($item.group)/$($item.name)"
    title = $metadata.title
    creator = $metadata.creator
    license = $metadata.license
    sourceUrl = $metadata.foreign_landing_url
    imageUrl = $metadata.url
  }
}

$placeholder = Join-Path $iconRoot "placeholder.png"
$localAvatar = Join-Path $miniRoot "images\avatar.png"
$iconCopies = @(
  @{ source = $placeholder; target = "notice.png" },
  @{ source = $localAvatar; target = "avatar.png" },
  @{ source = $placeholder; target = "logo.png" },
  @{ source = $placeholder; target = "wechat.png" },
  @{ source = $placeholder; target = "order.png" },
  @{ source = $placeholder; target = "favor.png" },
  @{ source = $placeholder; target = "share.png" },
  @{ source = $placeholder; target = "vote.png" },
  @{ source = $placeholder; target = "setting.png" }
)

foreach ($icon in $iconCopies) {
  Copy-Item -LiteralPath $icon.source -Destination (Join-Path $iconRoot $icon.target) -Force
}

$sourceManifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $testImageRoot "DOWNLOAD_SOURCES.json")
