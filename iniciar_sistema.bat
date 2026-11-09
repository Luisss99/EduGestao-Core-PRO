@echo off
title Sistema SaaS de Gestao Escolar - EduSaaS
color 0A
cls

echo =========================================================
echo       INICIANDO SISTEMA SAAS DE GESTAO ESCOLAR
echo =========================================================
echo.

:: Garantir que estamos na pasta correta
cd /d "%~dp0"

echo O banco de dados e LOCAL (SQLite) e fica salvo no arquivo dev.db.
echo.

:: 1. Gerar Cliente Prisma
echo [1/4] Gerando cliente de banco de dados Prisma...
call npx prisma generate

:: 2. Criar/Sincronizar Banco SQLite Local
echo.
echo [2/4] Sincronizando tabelas no banco de dados local (dev.db)...
call npx prisma db push --accept-data-loss

:: 3. Popular Banco com Dados Iniciais
echo.
echo [3/4] Populando banco de dados com dados de demonstracao...
call npx prisma db seed

:: 4. Abrir Navegador
echo.
echo [4/4] Abrindo navegador em http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo =========================================================
echo   Servidor Ativo! Acesse: http://localhost:3000
echo   Para fechar o sistema, feche esta janela.
echo =========================================================
echo.

:: 5. Iniciar Servidor Next.js
call npm run dev

pause
