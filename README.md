# Linux Scroll Speed Fix

#### Download: [Chrome web store package](https://chrome.google.com/webstore/detail/linux-scroll-speed-fix/mlboohjioameadaedfjcpemcaangkkbp)

## DESCRIPTION
Fixes the slow scroll speed in Chrome for Linux by emulating the Windows scroll speed when the extension detects Linux. When it detects Windows it will disable itself.

The extension also allows for custom scroll speed values in both Windows and Linux. 

All settings are saved locally in the browser to not mess with syncing between different systems.

## FEATURES
- Automatic "similar-to-Windows" scroll speed in Linux.
- Custom scroll speed settings
- Settings are saved locally in the browser

## CHANGELOG

#### Version 1.7.2
- Fixed Outlook scrolling

#### Version 1.7.1
- Added Outlook 365 to exception list

#### Version 1.7.0
- Fixed Youtube fullscreen scroll problems
- Fixed images on Instagram not loading correctly when scrolling
- Disabled scrolling plugin on Outlook until fix is found

#### Version 1.6.9
- Made overflow fix compatible with fullscreen

#### Version 1.6.8
- Made overflow fix apply more reliably

#### Version 1.6.7
- Fixed overflow issue - again

#### Version 1.6.6
- Fixed overflow issue

#### Version 1.6.5
- Clarified some text
- Removed some debug stuff

#### Version 1.6.4
- Reworked icon and background color
- Reworked change in 1.6.3 to no cause issues with certain sites.

#### Version 1.6.3
- Forces OverflowX to be visible. Some sites hides this and this disables scrolling.

#### Version 1.6.2
- Reworked protection against banners that change behaviour.

#### Version 1.6.1
- Tab or tabs are now prompted to be refreshed if the plugin is disabled or enabled.
- Updated icons to match the color theme.

#### Version 1.6.0
- Refactored most of the code.
- CSS Scroll smoothing toggling no longer needs refresh of window.
- Minor bug fixes.

#### Version 1.5.3
- Added indicator for if the extension is enabled or not
- Changed so that the default behaviour in Windows (not custom) disables the extension.
- Added tooltip for smooth scrolling.

#### Version 1.5.2
- Reduced Chrome permissions needed
- Minor bug fix

#### Version 1.5.1
- iFrame security workaround

#### Version 1.5
- Fixed banners messing with smooth scroll disable behavior

## NOTES
iFrames from other domains will use default scroll speed due to security (same-origin-policy). There is to my knowledge nothing to be done about this without some clever rewrite that is currently above my head.

CSS smooth scroll behavior is disabled by default. To my knowledge, the true smooth scrolling seen in Windows and MacOS will only be available with real hardware acceleration. Google stated that this won't be avaible in Chrome for Linux. The future will tell.

Please report bugs with description and address to the site where you encountered it.

Send bug report here:
https://github.com/Dedas/linux-scroll-speed-fix/issues

#### Settings

Default scroll speed values:

Linux = 1.9

Windows = 1.0 (extension is disabled by default)

MacOS = 1.0 (This needs testing!)

#### Thanks to

Based on gblazex/smoothscroll.

Fork of DemonTPx/chrome-scroll-speed.
