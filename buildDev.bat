@echo off

xcopy ..\mimurl\package.json node_modules\mimurl\ /i /y /d >nul
xcopy ..\mimurl\dist\*.* node_modules\mimurl\dist\ /s /i /y /d >nul

xcopy ..\mimbl\package.json node_modules\mimbl\ /i /y /d >nul
xcopy ..\mimbl\dist\*.* node_modules\mimbl\dist\ /s /i /y /d >nul

xcopy ..\mimcl\package.json node_modules\mimcl\ /i /y /d >nul
xcopy ..\mimcl\dist\*.* node_modules\mimcl\dist\ /s /i /y /d >nul

webpack --display-error-details
