# Script pour ajouter automatiquement "use client" aux fichiers .tsx qui utilisent des hooks React

$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx"
$modifiedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Vérifier si le fichier contient des hooks React
    $hasHooks = $content -match "useState|useEffect|useRef|useContext|useCallback|useMemo|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue"
    
    # Vérifier si le fichier n'a pas déjà "use client"
    $hasUseClient = $content -match '^"use client";'
    
    if ($hasHooks -and -not $hasUseClient) {
        Write-Host "Ajout de 'use client' à: $($file.FullName)"
        
        # Ajouter "use client"; en première ligne
        $newContent = '"use client";' + "`n`n" + $content
        
        # Écrire le nouveau contenu dans le fichier
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        
        $modifiedCount++
    }
}

Write-Host "Script terminé. $modifiedCount fichiers modifiés." 