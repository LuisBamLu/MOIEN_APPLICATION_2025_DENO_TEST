@echo off
setlocal enabledelayedexpansion

GOTO endValidateParam

:: Define a function to validate a parameter
:validateParam
    SET param=%~1
    IF NOT DEFINED param (
        ECHO Error: Parameter cannot be empty.
        EXIT /b 1
    )
    IF "%param:~0,2%"=="--" (
        ECHO Error: Parameter cannot start with --.
        EXIT /b 1
    )
    EXIT /b 0

:endValidateParam

:: Define valid flags
SET validFlags=--help --version --assetsPath --iconBackgroudColor --iconBackgroudColorDark --splashBackgroudColor --splashBackgroudColorDark --iosProjectPath --androidProjectPath --ios --android

:: Initialize variables
SET assetsPath=
SET iconBackgroudColor=
SET iconBackgroudColorDark=
SET splashBackgroudColor=
SET splashBackgroudColorDark=
SET iosProjectPath=
SET androidProjectPath=

SET ios="FALSE"
SET android="FALSE"

:parseArgs
    IF "%~1"=="" GOTO endParseArgs

    SET flag=%~1
    SET nextArg=%~2
    SET matchFound=0

    :findMatch
        FOR %%F IN (%validFlags%) DO (
            IF "%%F"=="%flag%" (
                SET matchFound=1
                GOTO endFindMatch
            )
        )
        IF "%matchFound%"=="0" (
            ECHO Error: Invalid flag %flag%.
            GOTO error
        )
    :endFindMatch

    IF "%flag%"=="--help" (
        ECHO Usage: generate_assets.bat [flags]
        ECHO Flags:
        ECHO   --assetsPath "<path>"                Path to the assets folder.
        ECHO   --iconBackgroudColor "<color>"       Background color for the icon.
        ECHO   --iconBackgroudColorDark "<color>"   Dark background color for the icon.
        ECHO   --splashBackgroudColor "<color>"     Background color for the splash screen.
        ECHO   --splashBackgroudColorDark "<color>" Dark background color for the splash screen.
        ECHO   --iosProjectPath "<path>"            Path to the iOS project.
        ECHO   --androidProjectPath "<path>"        Path to the Android project.
        ECHO   --ios                                Generate assets for iOS.
        ECHO   --android                            Generate assets for Android.
        EXIT /b 0
    )

    IF "%flag%"=="--version" (
        ECHO 1.0.1
        EXIT /b 0
    )

    IF "%flag%"=="--assetsPath" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET assetsPath=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --assetsPath.
            GOTO error
        )
    )

    IF "%flag%"=="--iconBackgroudColor" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET iconBackgroudColor=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --iconBackgroudColor.
            GOTO error
        )
    )

    IF "%flag%"=="--iconBackgroudColorDark" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET iconBackgroudColorDark=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --iconBackgroudColorDark.
            GOTO error
        )
    )

    IF "%flag%"=="--splashBackgroudColor" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET splashBackgroudColor=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --splashBackgroudColor.
            GOTO error
        )
    )

    IF "%flag%"=="--splashBackgroudColorDark" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET splashBackgroudColorDark=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --splashBackgroudColorDark.
            GOTO error
        )
    )

    IF "%flag%"=="--iosProjectPath" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET iosProjectPath=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --iosProjectPath.
            GOTO error
        )
    )

    IF "%flag%"=="--androidProjectPath" (
        IF DEFINED nextArg (
            CALL :validateParam "%nextArg%"
            SET androidProjectPath=!nextArg!
            SHIFT
            SHIFT
        ) ELSE (
            ECHO Error: Missing value for --androidProjectPath.
            GOTO error
        )
    )

    IF "%flag%"=="--ios" (
        SET ios="TRUE"
        SHIFT
    )

    IF "%flag%"=="--android" (
        SET android="TRUE"
        SHIFT
    )

    GOTO parseArgs

:endParseArgs

:defaultValues
    IF NOT %ios%=="TRUE" (
        SET ios="FALSE"
    )
    IF NOT %android%=="TRUE" (
        SET android="FALSE"
    )
    IF NOT DEFINED iconBackgroudColor (
        SET iconBackgroudColor=#FFFFFF
    )
    IF NOT DEFINED iconBackgroudColorDark (
        SET iconBackgroudColorDark=#111111
    )
    IF NOT DEFINED splashBackgroudColor (
        SET splashBackgroudColor=#FFFFFF
    )
    IF NOT DEFINED splashBackgroudColorDark (
        SET splashBackgroudColorDark=#111111
    )
:endDefaultValues

:checkProjectPaths
    IF NOT %ios%=="TRUE" (
        IF NOT %android%=="TRUE" (
            ECHO Error: At least one of the following flags must be provided: --ios, --android.
            GOTO error
        )
    )
    IF %android%=="TRUE" (
        IF NOT DEFINED androidProjectPath (
            ECHO Error: Missing value for --androidProjectPath.
            GOTO error
        )
    )
    IF %ios%=="TRUE" (
        IF NOT DEFINED iosProjectPath (
            ECHO Error: Missing value for --iosProjectPath.
            GOTO error
        )
    )
:endCheckProjectPaths

:deleteAssets
    IF %ios%=="TRUE" (
        IF EXIST "%iosProjectPath%\AppIcon.appiconset" (
            RMDIR /S /Q "%iosProjectPath%\AppIcon.appiconset"
        )
        IF EXIST "%iosProjectPath%\Splash.imageset" (
            RMDIR /S /Q "%iosProjectPath%\Splash.imageset"
        )
    )
    IF %android%=="TRUE" (
        IF EXIST "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background.xml" (
            DEL /Q "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background.xml"
        )
        IF EXIST "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_foreground.xml" (
            DEL /Q "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_foreground.xml"
        )
        FOR %%d IN (mipmap-anydpi-v26 mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi) DO (
            IF EXIST "%androidProjectPath%\app\src\main\res\%%d" (
                RMDIR /S /Q "%androidProjectPath%\app\src\main\res\%%d"
            )
        )
    )
:endDeleteAssets

:processAssets
    SET logoExists="FALSE"
    SET iconOnlyExists="FALSE"
    SET iconForegroundExists="FALSE"
    SET iconBackgroundExists="FALSE"
    SET splashExists="FALSE"
    SET splashDarkExists="FALSE"

    FOR %%e IN (png jpg jpeg svg) DO (
        IF EXIST "%assetsPath%\logo.%%e" (
            SET logoExists="TRUE"
        )
        IF EXIST "%assetsPath%\icon-only.%%e" (
            SET iconOnlyExists="TRUE"
        )
        IF EXIST "%assetsPath%\icon-foreground.%%e" (
            SET iconForegroundExists="TRUE"
        )
        IF EXIST "%assetsPath%\icon-background.%%e" (
            SET iconBackgroundExists="TRUE"
        )
        IF EXIST "%assetsPath%\splash.%%e" (
            SET splashExists="TRUE"
        )
        IF EXIST "%assetsPath%\splash-dark.%%e" (
            SET splashDarkExists="TRUE"
        )
    )

    IF %logoExists%=="TRUE" (
        IF %iconOnlyExists%=="TRUE" (
            ECHO Error: Both logo.png and icon-only.png cannot exist simultaneously.
            GOTO error
        )
        IF %iconForegroundExists%=="TRUE" (
            ECHO Error: Both logo.png and icon-foreground.png cannot exist simultaneously.
            GOTO error
        )
        IF %iconBackgroundExists%=="TRUE" (
            ECHO Error: Both logo.png and icon-background.png cannot exist simultaneously.
            GOTO error
        )
    ) ELSE (
        IF %iconOnlyExists%=="FALSE" (
            ECHO Error: Either logo.png or icon-only.png must exist.
            GOTO error
        )
        IF %iconForegroundExists%=="FALSE" (
            ECHO Error: icon-foreground.png must exist if logo.png does not exist.
            GOTO error
        )
        IF %iconBackgroundExists%=="FALSE" (
            ECHO Error: icon-background.png must exist if logo.png does not exist.
            GOTO error
        )
    )

    IF %ios%=="TRUE" (
        ECHO Generating iOS assets...
        IF NOT EXIST "%iosProjectPath%\AppIcon.appiconset" (
            MKDIR "%iosProjectPath%\AppIcon.appiconset"
        )
        IF NOT EXIST "%iosProjectPath%\Splash.imageset" (
            MKDIR "%iosProjectPath%\Splash.imageset"
        )
        IF %logoExists%=="TRUE" (
            REM Create iOS app icon with background color and logo
            magick "%assetsPath%\logo.png" -resize 820x820  "%assetsPath%\resize_logo.png"
            magick -size 1024x1024 xc:%iconBackgroudColor% "%iosProjectPath%\AppIcon.appiconset\icon_background.png"
            magick -size 1024x1024 xc:%iconBackgroudColorDark% "%iosProjectPath%\AppIcon.appiconset\icon_background_dark.png"
            magick composite -gravity center "%assetsPath%\resize_logo.png" "%iosProjectPath%\AppIcon.appiconset\icon_background.png" "%iosProjectPath%\AppIcon.appiconset\icon.png"
            magick composite -gravity center "%assetsPath%\resize_logo.png" "%iosProjectPath%\AppIcon.appiconset\icon_background_dark.png" "%iosProjectPath%\AppIcon.appiconset\icon_dark.png"
            REM Create iOS splash screen with background color and logo
            magick -size 2732x2732 xc:%splashBackgroudColor% "%iosProjectPath%\Splash.imageset\splash_background.png"
            magick -size 2732x2732 xc:%splashBackgroudColorDark% "%iosProjectPath%\Splash.imageset\splash_background_dark.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%iosProjectPath%\Splash.imageset\splash_background.png" "%iosProjectPath%\Splash.imageset\splash.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%iosProjectPath%\Splash.imageset\splash_background_dark.png" "%iosProjectPath%\Splash.imageset\splash_dark.png"
        ) ELSE (
            REM Create iOS app icon with icon-foreground and icon-background images
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background.png" "%iosProjectPath%\AppIcon.appiconset\AppIcon-512@2x.png"
            REM Create iOS splash screen with icon-foreground and icon-background images
            magick "%assetsPath%\icon-background.png" -resize 2732x2732 "%assetsPath%\icon-background.png"
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background.png" "%iosProjectPath%\AppIcon.appiconset\splash-2732x2732.png"
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background.png" "%iosProjectPath%\AppIcon.appiconset\splash-2732x2732-1.png"
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background.png" "%iosProjectPath%\AppIcon.appiconset\splash-2732x2732-2.png"
            magick "%assetsPath%\icon-background.png" -resize 1024x1024 "%assetsPath%\icon-background.png"
            REM TODO - Create dark splash screen
        )
    )

    ECHO Android: %android%

    IF %android%=="TRUE" (
        SET outputFile=ic_launcher_background.xml

        ECHO ^<?xml version="1.0" encoding="UTF-8"?^> > %outputFile%
        ECHO ^<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportHeight="108" android:viewportWidth="108"^> >> %outputFile%
        ECHO ^<path android:fillColor="%iconBackground%" android:pathData="M0,0h108v108h-108z" /^> >> %outputFile%
        ECHO ^</vector^> >> %outputFile%

        ECHO Generating Android assets...
        FOR %%d IN (mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi) DO (
            IF NOT EXIST "%androidProjectPath%\app\src\main\res\%%d" (
                MKDIR "%androidProjectPath%\app\src\main\res\%%d"
            )
        )
        IF %logoExists%=="TRUE" (
            REM Create Android app icon with background color and logo
            magick -size 192x192 xc:%iconBackgroudColor% "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher.png"
            magick -size 192x192 xc:%iconBackgroudColorDark% "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background_dark.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_background_dark.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_dark.png"
            REM Create Android splash screen with background color and logo
            magick -size 1920x1920 xc:%splashBackgroudColor% "%androidProjectPath%\app\src\main\res\drawable\splash_background.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%androidProjectPath%\app\src\main\res\drawable\splash_background.png" "%androidProjectPath%\app\src\main\res\drawable\splash.png"
            magick -size 1920x1920 xc:%splashBackgroudColorDark% "%androidProjectPath%\app\src\main\res\drawable\splash_background_dark.png"
            magick composite -gravity center "%assetsPath%\logo.png" "%androidProjectPath%\app\src\main\res\drawable\splash_background_dark.png" "%androidProjectPath%\app\src\main\res\drawable\splash_dark.png"
        ) ELSE (
            REM Create Android app icon with icon-foreground and icon-background
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher.png"
            magick composite -gravity center "%assetsPath%\icon-foreground.png" "%assetsPath%\icon-background-dark.png" "%androidProjectPath%\app\src\main\res\drawable\ic_launcher_dark.png"
            REM Create Android splash screen with splash and splash-dark images
            magick "%assetsPath%\splash.png" -resize 1920x1920 "%androidProjectPath%\app\src\main\res\drawable\splash.png"
            magick "%assetsPath%\splash-dark.png" -resize 1920x1920 "%androidProjectPath%\app\src\main\res\drawable\splash_dark.png"
        )
    )
:endProcessAssets
GOTO end

:error
ECHO Script failed.
GOTO end

:end
endlocal