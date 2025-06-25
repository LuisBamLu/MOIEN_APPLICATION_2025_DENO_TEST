if not exist "TRACED\%1" mkdir "TRACED\%1"
for %%f in (SCALED\%1\*.png) do (
    %TOOL%\IMAGE_MAGICK\convert.exe "%%f" -background white -flatten tmp.bmp
    %TOOL%\AUTOTRACE\autotrace.exe --output-file=tmp.svg --color-count=4 --output-format=svg tmp.bmp
    copy tmp.svg "TRACED\%1\%%~nf.svg"
    del tmp.svg
    del tmp.bmp
)
