# Linux Scroll Speed Fix

#### Download: [Chrome web store package](https://chrome.google.com/webstore/detail/linux-scroll-speed-fix/mlboohjioameadaedfjcpemcaangkkbp)

#### Changelog version 1.6.4
- Reworked icon and background color
- Reworked change in 1.6.3 to no cause issues with certain sites.

#### Changelog version 1.6.3
- Forces OverflowX to be visible. Some sites hides this and this disables scrolling.

#### Changelog version 1.6.2
- Reworked protection against banners that change behaviour.

#### Changelog version 1.6.1
- Tab or tabs are now prompted to be refreshed if the plugin is disabled or enabled.
- Updated icons to match the color theme.

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
iFrames from other domains will use default scroll speed due to security (same-origin-policy). There is to my knowledge nothing to be done about this without some clever rewrite that is currently above my head.

CSS smooth scroll behavior is disabled by default. To my knowledge, the true smooth scrolling seen in Windows and MacOS will only be available with real hardware acceleration. Google stated that this won't be avaible in Chrome for Linux. The future will tell.

#### Settings

Default scroll speed values:

Linux = 1.9

Windows = 1.0 (extension is disabled by default)

MacOS = 1.0 (This needs testing!)

#### Thanks to

Based on gblazex/smoothscroll.

Fork of DemonTPx/chrome-scroll-speed.
