$content = Get-Content "../sistemas_fixacao/efix_wpbakery_description.txt" -Raw -Encoding UTF8
$content = $content -replace 'style="border: 1px solid #dddddd; padding: 8px;"', ''
$content = $content -replace '\*', '×'
$content | Out-File "../sistemas_fixacao/efix_wpbakery_description.txt" -Encoding UTF8 -NoNewline
Write-Host "✅ Tabela E-FIX atualizada!"