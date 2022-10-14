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

#### Version 2.0.0
- Switch to manifest V3.

## NOTES
iFrames from other domains will use default scroll speed due to security (same-origin-policy). There is to my knowledge nothing to be done about this without some clever rewrite that is currently above my head.

CSS smooth scroll behavior is disabled by default. To my knowledge, the true smooth scrolling seen in Windows and MacOS will only be available with real hardware acceleration. Google stated that this won't be avaible in Chrome for Linux. The future will tell.

Please report bugs with description and address to the site where you encountered it.

Send bug report here:
https://github.com/BirdInFire/linux-scroll-speed-fix/issues

#### Thanks to

Based on gblazex/smoothscroll.

Was Forked of DemonTPx/chrome-scroll-speed.
and Forked again from Dedas/linux-scroll-speed-fix.
