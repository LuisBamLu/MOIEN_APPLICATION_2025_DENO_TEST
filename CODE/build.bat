echo on
mkdir SERVER\dist
mkdir CLIENT\dist
mkdir ADMIN\dist
cd SERVER
call build.bat
cd ..\CLIENT
call build.bat
cd ..\ADMIN
call build.bat
cd ..
pause
