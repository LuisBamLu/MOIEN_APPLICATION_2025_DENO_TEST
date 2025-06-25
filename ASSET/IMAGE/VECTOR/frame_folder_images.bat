if not exist "FRAMED\%1" mkdir "FRAMED\%1"
for %%f in (ORIGINAL\%1\*.png) do %TOOL%\IMAGE_MAGICK\convert "%%f" -bordercolor Transparent -border 1 -strip "FRAMED\%1\%%~nf.png"
