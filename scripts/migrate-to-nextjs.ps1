# Ce script remplace automatiquement les imports et usages de react-router-dom vers Next.js
# et nettoie les restes de Vite

param(
    [string]$SourcePath = "src"
)

Write-Host "🚀 Migration vers Next.js 14..." -ForegroundColor Green

# Fonction pour traiter un fichier
function Process-File {
    param([string]$FilePath)
    
    Write-Host "Traitement de: $FilePath" -ForegroundColor Yellow
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    
    # Remplacer les imports react-router-dom
    $content = $content -replace 'import \{ Link \} from "react-router-dom";', 'import Link from "next/link";'
    $content = $content -replace 'import \{ useNavigate \} from "react-router-dom";', 'import { useRouter } from "next/navigation";'
    $content = $content -replace 'import \{ useLocation \} from "react-router-dom";', 'import { usePathname } from "next/navigation";'
    $content = $content -replace 'import \{ useSearchParams \} from "react-router-dom";', 'import { useSearchParams } from "next/navigation";'
    $content = $content -replace 'import \{ useParams \} from "react-router-dom";', 'import { useParams } from "next/navigation";'
    
    # Remplacer les imports multiples
    $content = $content -replace 'import \{ Link, useNavigate \} from "react-router-dom";', "import Link from `"next/link`";`nimport { useRouter } from `"next/navigation`";"
    $content = $content -replace 'import \{ Link, useLocation \} from "react-router-dom";', "import Link from `"next/link`";`nimport { usePathname } from `"next/navigation`";"
    $content = $content -replace 'import \{ useLocation, Link \} from "react-router-dom";', "import { usePathname } from `"next/navigation`";`nimport Link from `"next/link`";"
    $content = $content -replace 'import \{ useNavigate, Link \} from "react-router-dom";', "import { useRouter } from `"next/navigation`";`nimport Link from `"next/link`";"
    $content = $content -replace 'import \{ useNavigate, useSearchParams \} from "react-router-dom";', "import { useRouter, useSearchParams } from `"next/navigation`";"
    $content = $content -replace 'import \{ useSearchParams, Link \} from "react-router-dom";', "import { useSearchParams } from `"next/navigation`";`nimport Link from `"next/link`";"
    
    # Remplacer NavigateFunction
    $content = $content -replace 'import \{ NavigateFunction \} from "react-router-dom";', 'import { useRouter } from "next/navigation";'
    
    # Remplacer les usages dans le code
    $content = $content -replace 'useNavigate\(\)', 'useRouter()'
    $content = $content -replace 'useLocation\(\)', 'usePathname()'
    $content = $content -replace 'useSearchParams\(\)', 'useSearchParams()'
    $content = $content -replace 'useParams\(\)', 'useParams()'
    
    # Remplacer les méthodes de navigation
    $content = $content -replace 'navigate\(', 'router.push('
    $content = $content -replace 'navigate\.push\(', 'router.push('
    $content = $content -replace 'navigate\.replace\(', 'router.replace('
    $content = $content -replace 'navigate\.back\(\)', 'router.back()'
    $content = $content -replace 'navigate\.forward\(\)', 'router.forward()'
    
    # Remplacer les props Link
    $content = $content -replace 'to="([^"]*)"', 'href="$1"'
    
    # Remplacer les variables d'environnement Vite
    $content = $content -replace 'import\.meta\.env\.VITE_', 'process.env.NEXT_PUBLIC_'
    
    # Remplacer les usages de location
    $content = $content -replace 'location\.pathname', 'pathname'
    $content = $content -replace 'location\.search', 'searchParams.toString()'
    $content = $content -replace 'location\.hash', 'window.location.hash'
    
    # Sauvegarder le fichier modifié
    Set-Content -Path $FilePath -Value $content -Encoding UTF8
    
    Write-Host "✅ Migré: $FilePath" -ForegroundColor Green
}

# Fonction pour traiter récursivement un dossier
function Process-Directory {
    param([string]$Directory)
    
    $files = Get-ChildItem -Path $Directory -Recurse -Include "*.tsx", "*.ts"
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Vérifier si le fichier contient des imports react-router-dom
        if ($content -match 'react-router-dom') {
            Process-File -FilePath $file.FullName
        }
        
        # Vérifier si le fichier contient des variables d'environnement Vite
        if ($content -match 'import\.meta\.env\.VITE_') {
            Process-File -FilePath $file.FullName
        }
    }
}

# Traiter le dossier source
Process-Directory -Directory $SourcePath

Write-Host "🎉 Migration terminée!" -ForegroundColor Green
Write-Host "N'oubliez pas de:" -ForegroundColor Yellow
Write-Host "1. Mettre à jour les variables d'environnement (VITE_ -> NEXT_PUBLIC_)" -ForegroundColor Yellow
Write-Host "2. Vérifier que tous les composants utilisent correctement les hooks Next.js" -ForegroundColor Yellow
Write-Host "3. Tester la navigation et les fonctionnalités" -ForegroundColor Yellow 