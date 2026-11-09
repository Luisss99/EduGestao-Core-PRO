@echo off
title Enviar Projeto para o GitHub - Luisss99/gestao-escolar-saas
color 0B
cls

echo =========================================================
echo       ENVIANDO SISTEMA PARA O GITHUB (Luisss99)
echo =========================================================
echo.

cd /d "%~dp0"

set REPO_URL=https://github.com/Luisss99/gestao-escolar-saas.git

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] O comando git nao foi localizado no PATH do sistema.
    echo.
    echo Baixe e instale o Git em: https://git-scm.com/download/win
    echo Ou abra o GitHub Desktop e selecione esta pasta:
    echo %cd%
    echo.
    pause
    exit /b
)

echo [1/4] Inicializando repositorio Git local...
call git init

echo.
echo [2/4] Adicionando todos os arquivos do projeto...
call git add .

echo.
echo [3/4] Criando commit inicial...
call git commit -m "feat: Sistema de Gestao Escolar SaaS - Versao Production Ready"

echo.
echo [4/4] Enviando para o repositorio no GitHub...
call git branch -M main
call git remote remove origin >nul 2>&1
call git remote add origin %REPO_URL%
call git push -u origin main

echo.
echo =========================================================
echo   SUCESSO! O projeto foi enviado para:
echo   https://github.com/Luisss99/gestao-escolar-saas
echo =========================================================
echo.
pause
