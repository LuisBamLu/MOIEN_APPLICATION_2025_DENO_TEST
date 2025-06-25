if not exist "TRACED\%1" mkdir "TRACED\%1"
for %%f in (SCALED\%1\*.png) do (
    %TOOL%\IMAGE_MAGICK\convert.exe "%%f" -background white -flatten tmp.bmp
    %TOOL%\POTRACE\potrace.exe tmp.bmp -s -o "TRACED\%1\%%~nf.svg"
    del tmp.bmp
)
