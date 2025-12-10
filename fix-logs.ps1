# Script para remover console.log em produção
# Substitui console por logger em todos os arquivos .jsx e .js

$files = @(
    "src\paginas\AcompanharFila.jsx",
    "src\paginas\PainelOperador.jsx",
    "src\paginas\PainelPublico.jsx",
    "src\paginas\LoginRestaurante.jsx",
    "src\paginas\LoginCliente.jsx",
    "src\paginas\EntrarNaFila.jsx",
    "src\paginas\ConfiguracoesRestaurante.jsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Verifica se já tem o import do logger
    if ($content -notmatch "import.*logger") {
        # Adiciona o import após as outras importações
        $content = $content -replace "(import.*from.*;\r?\n)(export|function|const)", "`$1import { logger } from '../utils/logger';`r`n`r`n`$2"
    }
    
    # Substitui console por logger
    $content = $content -replace "console\.(log|warn|error|info)", "logger.`$1"
    
    Set-Content $file -Value $content -NoNewline
    Write-Host "✅ Atualizado: $file"
}

Write-Host "`n🎉 Todos os arquivos foram atualizados!"
