# Script pour ajouter automatiquement "use client" aux fichiers qui utilisent des hooks React
# mais qui n'ont pas encore la directive

param(
    [string]$SourcePath = "src"
)

Write-Host "🔍 Recherche des fichiers avec des hooks React..." -ForegroundColor Green

# Fonction pour vérifier si un fichier contient des hooks React
function Test-HasReactHooks {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    
    # Vérifier s'il contient des hooks React
    $hasHooks = $content -match 'useState|useEffect|useRef|useCallback|useMemo|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue'
    
    # Vérifier s'il a déjà "use client"
    $hasUseClient = $content -match '^"use client";'
    
    return $hasHooks -and -not $hasUseClient
}

# Fonction pour ajouter "use client" à un fichier
function Add-UseClient {
    param([string]$FilePath)
    
    Write-Host "Ajout de 'use client' à: $FilePath" -ForegroundColor Yellow
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    
    # Ajouter "use client" en première ligne
    $newContent = '"use client";' + "`n`n" + $content
    
    # Sauvegarder le fichier
    Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
    
    Write-Host "✅ Ajouté: $FilePath" -ForegroundColor Green
}

# Fonction pour traiter récursivement un dossier
function Process-Directory {
    param([string]$Directory)
    
    $files = Get-ChildItem -Path $Directory -Recurse -Include "*.tsx", "*.ts"
    
    foreach ($file in $files) {
        if (Test-HasReactHooks -FilePath $file.FullName) {
            Add-UseClient -FilePath $file.FullName
        }
    }
}

# Traiter le dossier source
Process-Directory -Directory $SourcePath

Write-Host "🎉 Script terminé!" -ForegroundColor Green
Write-Host "Tous les fichiers avec des hooks React ont maintenant la directive 'use client'" -ForegroundColor Yellow 