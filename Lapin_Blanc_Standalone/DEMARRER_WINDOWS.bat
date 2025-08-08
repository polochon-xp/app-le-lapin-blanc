@echo off
echo.
echo  ==========================================
echo     LE LAPIN BLANC - APPLICATION MOBILE
echo  ==========================================
echo.
echo  🎮 Demarrage de l'application...
echo.

REM Essayer Python d'abord
python -m http.server 8000 2>nul && (
    echo  ✅ Serveur lance avec Python
    echo  🌐 Ouvrez votre navigateur sur : http://localhost:8000
    start http://localhost:8000
    goto end
)

REM Essayer Python3 si Python ne marche pas
python3 -m http.server 8000 2>nul && (
    echo  ✅ Serveur lance avec Python3  
    echo  🌐 Ouvrez votre navigateur sur : http://localhost:8000
    start http://localhost:8000
    goto end
)

REM Si Python n'est pas installe
echo  ❌ Python n'est pas installe ou accessible.
echo.
echo  SOLUTIONS ALTERNATIVES :
echo  1. Double-cliquez sur "LANCEMENT.html"
echo  2. Ou ouvrez "index.html" directement  
echo  3. Installez Python : https://python.org
echo.
echo  🎯 LANCEMENT DIRECT :
start LANCEMENT.html

:end
echo.
echo  Appuyez sur une touche pour fermer...
pause >nul