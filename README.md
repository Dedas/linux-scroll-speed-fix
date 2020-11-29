# Linux Scroll Speed Fix

#### Download: [Chrome web store package](https://chrome.google.com/webstore/detail/linux-scroll-speed-fix/mlboohjioameadaedfjcpemcaangkkbp)

#### Changelog version 1.6.0
- Refactored most of the code.
- CSS Scroll smoothing toggling no longer needs refresh of window.
- Minor bug fixes.

#### Changelog version 1.5.3
- Added indicator for if the extension is enabled or not
- Changed so that the default behaviour in Windows (not custom) disables the extension.
- Added tooltip for smooth scrolling.

#### Changelog version 1.5.2
- Reduced Chrome permissions needed
- Minor bug fix

#### Changelog version 1.5.1
- iFrame security workaround

#### Changelog version 1.5
- Fixed banners messing with smooth scroll disable behavior

#### Description

Fix the slow scroll speed in Linux Chrome by setting it close to the Windows value automatically when it detects Linux. When it detects Windows it will set it back. That means you don't have to disable plugins if you dual boot between systems or similar. It also allows for custom values that are saved locally to not mess with synching between different systems.

#### Important notes
iFrames used on some sites with heavy security blocks attempts to change scroll speed. They will for now use default scroll speed until a better workaround is found.

CSS smooth scroll behavior is disabled by default on sites that use it because of lagginess. To my knowledge true smooth scrolling will only be available with hardware acceleration enabled and Google said no to this on Chrome for Linux.

#### Settings

Default scroll speed values:

Linux = 1.9

Windows = 1.0 (extension is disabled by default)

MacOS = 1.0 (This needs testing!)

#### Thanks to

Based on gblazex/smoothscroll.

Fork of DemonTPx/chrome-scroll-speed.
