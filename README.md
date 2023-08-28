# POTI-board EVO EN

## Serious bugs in older versions
- POTI-board v2.26.0 and earlier all versions is vulnerable to XSS.    
Malicious JavaScript can be executed.

- POTI-board v3.09.x and earlier all versions have a serious bug.  
You may lose all log files.

- POTI-board v3.x gives a deprecated error in PHP8.1 It will not work with future versions of PHP.

Please update to v5.x or higher.

## A POTI-board that can use HTML5 versions of PaintBBS NEO , ChickenPaint , and klecks.

![PaintBBS NEO](https://user-images.githubusercontent.com/44894014/130362908-27922b42-6a4c-4c73-8ab6-a1f678014eed.png)

![ChickenPaint](https://user-images.githubusercontent.com/44894014/130363514-1ac820bf-0c6b-4cfa-ba47-62e0b40c3e74.png)


In v3.0, the HTML5 version of the high-performance paint application [ChickenPaint](https://github.com/thenickdude/chickenpaint) is available.  
The HTML5 version of [PaintBBS NEO](https://github.com/funige/neo/) is still available.


This is a project to translate [POTI-board EVO](https://github.com/satopian/poti-kaini/) into English.

[POTI-board Kai official website](https://paintbbs.sakura.ne.jp/poti/?en=on) English.

## Required php version

Required PHP version.PHP7.2 to PHP8.2

### To change the color scheme of the Default theme MONO
MONO's HTML and CSS have been significantly updated in v3.07.5.  
Therefore, if you use a CSS file older than v3.07.5, some designs will not be displayed correctly.  
For example, footers and catalogs don't look as intended.  
If you want to change only the color scheme, please use the SCSS for development.  

[css/dev/sass](https://github.com/satopian/poti-kaini-EN/tree/main/potiboard5/templates/mono_en/css/dev/sass)

It's easy to change the color scheme because the settings are separated for the color scheme and other designs.  
However, an environment that can handle SCSS is required.  
For example, the free [Visual Studio Code](https://azure.microsoft.com/en-us/products/visual-studio-code/) and its extension, [DartJS Sass Compiler and Sass Watcher](https://marketplace.visualstudio.com/items?itemName=codelios.dartsass).

## 23/08/28 v6.00.5

### Extended log file
The name of the paint tool used is now displayed.  
Addresses the year 2286 problem.  
The type of timelapse file and the presence or absence of thumbnails are now recorded in the log file. As a result, the load can be reduced because it is not necessary to check the existence of the file each time.   
  
Log files are backward compatible.  
It can also be read with an older version of POTI-board.  
Conversely, POTI-board v6.x can also read old version log files.  
Log files do not need to be converted, you can use your existing log files.  

## 23/08/13 v5.63.8
### Added option to hide [Admin mode] link. 

#### Added this option to config.php.

```
// Display a link to the [Admin mode]  Yes: 1 No: 0
define("USE_ADMIN_LINK", "1");
// No: 0 Hide link to the admin mode.
```
## 23/08/07 v5.63.7.1

- klecks/  (Update directory by overwriting)
- potiboard.php
- templates/mono_en/paint_klecks.blade.php
- templates/mono_en/mono_paint.blade.php

## 23/08/04 v5.63.6.1
### Updated Klecks and Tegaki

- klecks/  (Update directory by overwriting)
- tegaki/  (Update directory by overwriting)

## 23/08/04 v5.63.6

### Fixed bug.
- Fixed a bug that could not be displayed in IE mode of Edge.


## 23/07/27 v5.63.5
### Fixed bugs.

- potiboard.php
- search.inc.php
(Some variables were undefined.)
- templates/mono_en/mono_main.blade.php
(There was a part where the search link was still "search.php".)
- templates/mono_en/paint_tegaki.blade.php
(When used on an iPad, the screen was being magnified by double-tap zoom.)

## 23/07/13 v5.63.3

### You can now set the width and height of the window that opens when sharing on SNS in config.php.
Added a new setting item to config.php.

""

// Width and height of window to open when SNS sharing

//window width initial value 350
define("SNS_WINDOW_WIDTH","350"); 
//window height initial value 490 
define("SNS_WINDOW_HEIGHT","490");

""

When adding a server for SNS sharing, the height of the shared screen window was insufficient and scrolling was sometimes required.
Solved the problem by making it possible to set the width and height of the shared screen of the server list when sharing with SNS.
If the above setting items do not exist in config.php, the default values of 350px width and 490px height will be applied.

## Change log (timezone: Asia/Tokyo, UTC+09:00)
## [2023/07/12] v5.63.2
### Improved selection operability of SNS server to share posts

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/c96c380c-3b72-4d1d-baa1-27a74eee7dda)

Servers to share can be selected not only directly above the label string, but also by tapping the right margin of the label.
- petitnote/template/basic/set_share_server.html
Fixed HTML grammar errors.

## [2023/07/11] v5.63.1
### Replace search.php with search.inc.php
The structure of jsearch.php has been fundamentally overhauled, modified and incorporated into potiboard.php.
Search results that were previously displayed with a URL like "search.php?". The URL will be changed like "potiboard.php?mode=search&".

### Externalize and standardize CSS switching part of templates MONO

```
`templates/mono/parts/style-switcher.blade.php` contains the following parts that have been written in many templates so far.
<style>
body{
	visibility: hidden;
}
</style>
<noscript>
	<style>
		body{
			visibility: visible;
		}
	</style>
</noscript>
<link rel="stylesheet" href="{{$skindir}}css/mono_main.css?{{$ver}}">
<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css?{{$ver}}" id="css1" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css?{{$ver}}" id="css2" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css?{{$ver}}" id="css3" disabled>

```
Also set CSS `visibility: hidden;` here to hide the screen until the DOM and JavaScript have finished loading.
This prevents MONO's color settings from temporarily appearing in a different color scheme.

### Search is not case sensitive

Name searches are now case insensitive when the exact match option is selected.

## [2023/07/08] v5.62.2
### Bug fixes
Search function was not working.
This bug was introduced in v5.58.10 and fixed in v5.62.2.

### From "Tweet button" to "Twitter", "Mastodon" and "Misskey" sharing.

In addition to "Twitter", you can now share posts on short-text posting SNS such as "Mastodon" and "Misskey".

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/2e28ef1a-5d35-4837-8f6e-169807016823)
  
You can also change it to a conventional tweet button by setting it in config.php.
You can also edit the list of "Mastodon" and "Misskey" servers.

```
/* ---------- SNS share function advanced settings ---------- */

//Include Mastodon and Misskey servers in the share function
// (1: Include, 0: Do not include)
define("SWITCH_SNS","1");

// Servers displayed in the list when sharing on SNS
//Example ["display name","https://example.com (SNS server url)"], (comma is required at the end)

$servers =
[

	["Twitter","https://twitter.com"],
	["mstdn.jp","https://mstdn.jp"],
	["pawoo.net","https://pawoo.net"],
	["fedibird.com","https://fedibird.com"],
	["misskey.io","https://misskey.io"],
	["misskey.design","https://misskey.design"],
	["nijimiss.moe","https://nijimiss.moe"],
	["sushi.ski","https://sushi.ski"],

];

```
If this setting item does not exist in config.php, the above setting will be applied by default.  
If you do not need detailed settings, please use the config.php you are currently using as it is.  

## [2023/05/24] v5.61.2
### Added support for the drawing application tegaki.js.
![230621_tegaki_sukumizu_001](https://github.com/satopian/Petit_Note/assets/44894014/02a75d17-f94a-4e6b-8ec3-8e762d26713e)
### Improved "copy poster name" functionality.
It now add at the cursor position in the text field.
Previously, it was added at the end of the line.

## [2023/06/11] v5.60.0

### Fixed deprecated JavaScript syntax in paint app

- Updated PaintBBS NEO to v1.6.0.
- Updated to original modified version of ChickenPaint.

### The paint app Klecks has two layers at startup.

![Image](https://github.com/satopian/poti-kaini/assets/44894014/23eec76c-969a-458b-931a-2c3bb56e9201)


## [2023/05/20] v5.59.0
### Bug fixes
- Fixed an issue where the URL of the fixed link of the article was not set correctly when the tweet button was pressed.
- This bug was introduced in v5.58.6 and fixed in v5.59.0.

### Updating jQuery
- Updated jQuery from jQuery3.6.0 to jQuery3.7.0.
- jQuery versioning is done inside potiboard.php, so you don't have to change individual templates.
### Fixed deprecated JavaScript and jQuery syntax
- templates/mono_en/js/mono_common.js

## [2023/05/07] v5.58.9.1
- Klecks update
- Blade One update

### Changed Templates
(fixes deprecated jQuery syntax)

## [2023/05/03] v5.58.9
- klecks update

## [2023/04/25] v5.58.8
### ChickenPaint update

- Fixed an issue where the canvas aspect ratio was incorrect when ChickenPaint was launched in full screen mode on an iPad.

## [2023/04/13] v5.58.5

### ChickenPaint update
- In order to deal with the problem that the aspect ratio of the drawing area is broken when the orientation of the device is changed on the iPad, we have included a version of ChickenPaint that has been customized and built independently. (Temporary measure until the problem is resolved)
- This issue only occurs when using ChickenPaint in fullscreen mode.
- Therefore, I stopped starting in full screen mode and started in normal mode.
You can switch the display to full screen mode by selecting full screen mode from ChickenPaint's menu bar.

### Improvements

- Fix WCS dynamic palette script's deprecated JavaScript  Rewrote substr() to substring() . 
[String.prototype.substr() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr) MDN

- Added a "Post in the same thread" checkbox.
 
![230307_continue drawing_post in the same thread](https://user-images.githubusercontent.com/44894014/223247562-6184578c-3565-4f43-8a10-2feedd5e46b1.gif)
 
Added a "Post in the same thread" checkbox.
However, in the case of "image replacement", there is no choice but to post in the same thread, so this option is unnecessary.
 
Therefore, I used JavaScript to display the "Post in the same thread" checkbox only when a new post is selected.

- bad host chek 

When a user has the same host name and IP address, we made it possible to specify a few characters from the front of the IP address displayed as the host name and reject it with a prefix match.

>$badhost =["example.com","100.100.200"];

If set like this:

"example.com" will be rejected with a suffix match, and "100.100.200" will be rejected with a prefix match.

## [2023/02/11] v5.56.3

### Updated Klecks to latest version

![Image](https://user-images.githubusercontent.com/44894014/221393538-22d0a2b5-d725-4bc9-9e97-7dd7e15fdf3b.png)

- Dark theme is now selectable.
- Added French language support.
- Fixed touch gesture freezing issue on iPhone and iPad.

### Updated BladeOne to latest version
- Updated BladeOne to v4.8.
### Improvements
- Fixed that the order of the search screen was not in the latest order.
- Improved search screen code.



## [2023/02/26] v5.56.2.3
### Bug fix
### changed Templates
- templates/mono_en/paint_klecks.blade.php
Fixed an issue where illustrations that were drawn when the server status was 502 Bad Gateway disappeared.

## [2023/02/09] v5.56.2.2
- Added missing klecks help file.

## [2023/02/05] v5.56.2

### You can now configure whether or not to use the URL input field in config.php.

```
// Use URL input field (Yes: 1, No: 0)
define("USE_URL_INPUT_FIELD", "1");
//No: 0, the URL field disappears from the form input fields.
// Even if the form is faked, the URL will not be entered.

```
In addition to prohibiting the writing of URLs in the text, if you can also make it impossible to write URLs in the URL field, you can eliminate advertisement spam whose purpose is to write URLs.
URL judgment of URL writing prohibition in the text is quite strict, so even if `http://` is omitted, it should be almost impossible to write URL of advertisement spam.

### Fixed an issue where the template could not be sent due to a JavaScript error when the URL or subject fields did not exist.
It's not a bug, but I've rewritten the JavaScript so that it works fine even if the template is modified by the user.

### In PaintBBS NEO, improved so that the screen does not move up and down when manipulating the canvas area such as copy and layer combination.
If the width of the terminal is large compared to the canvas size, it will not scroll even if you grab the mesh of NEO.
This is because the screen moves up and down when copying, layer merging, and Bz curve operations.
However, you can now grab and scroll the mesh when zooming in with pinch zoom.
This is to avoid inoperability.
These are implemented with inline JavaScript in NEO's paint screen, so you'll need to update the paint screen template.

![NEO_issue_230201](https://user-images.githubusercontent.com/44894014/216770678-0e5ab56d-89fa-4f39-8d72-0c71c2b022de.gif)


## [2023/01/19] v5.55.8.5
### Bug fixes
- PaintBBS NEO data was not received at all in the environment of PHP5.6 to PHP7.x. Since it works without causing an error in PHP8.1 and PHP8.2, the discovery was delayed.
Overwrite and update `saveneo.php`.

## [2023/01/14] v5.55.8.2
### Bug fix

Fixed a bug where setting the minimum number of seconds required to draw would cause all alerts that should have been displayed as "15 sec" to be displayed as "0 seconds".
Even if this bug exists, if you set it to 60 seconds, you can post normally when it exceeds 60 seconds.
The problem was that the remaining time was not displayed accurately, and it was all "remaining 0 sec".


## [2022/01/14] v5.55.8.1
### Bug fix

- fixd saveneo.php

Fixed an issue where depending on the content of the error that occurred, it would not be displayed as an alert and the screen would transition and fail to post.

## [2022/01/13] v5.55.8

### Changed communication of PaintBBS NEO from raw data to formData to avoid false positive error by WAF.
- In order to be able to post to the conventional oekaki bulletin board, we modified NEO, which used to send raw data, and made it possible to send header, image, and timelapse animetion data with formData.
With this change, the probability that the conventional WAF will detect NEO transmission data as an attack and block it will be greatly reduced, and the probability of successful posting will be dramatically increased.
[Added an option to send data individually with formData so that WAF does not judge it as an attack. by satopian Pull Request #94 funige/neo](https://github.com/funige/neo/pull/94)
#### Important changes
- Receipt of shi-Painter data is done by `picpost.php` as before.
However, the data of PaintBBS NEO is received by newly added `saveneo.php`.
If you forget to upload this file, you will not be able to post from NEO, so be sure to update it.
Transfer it to the same directory as potiboard.php.
Please update 

- Updated Paint screen template

```
paint.blade.php

```
A parameter has been added to switch to the formData submit mode.

### Changed the config.php

Until now, it was not possible to remove PaintBBS NEO from apps that use it, but now you can choose to use or not use NEO.
If you set it to not use all, it will be a setting that does not use the drawing function.
You can also set it to use only Klecks or only ChickenPaint.
When there is only one app to use, the pull-down menu for app selection disappears and the screen becomes clean.

### Limited by drawing time

For example, if you want to reject submissions with only lines drawn in less than 1 minute,

```
// Security timer (unit: seconds). If not set, use ""
define("SECURITY_TIMER", "");

```
It was possible to specify the minimum required drawing time with , but until now, it was effective only for Shi-Painter and PaintBBS NEO.
With this update, ChickenPaint and Klecks now have this setting enabled.
In the old method, when there was a violation, it was possible to jump to another site (for example, the Metropolitan Police Department site), but instead of that method, an alert will open "Please draw for another 30 seconds.".

## [2023/01/14] v5.55.8.1
- fixd saveneo.php

Fixed an issue where depending on the content of the error that occurred, it would not be displayed as an alert and the screen would transition and fail to post.


## [2023/01/13] v5.55.8

### Changed communication of PaintBBS NEO from raw data to formData to avoid false positive error by WAF.
- In order to be able to post to the conventional oekaki bulletin board, we modified NEO, which used to send raw data, and made it possible to send header, image, and timelapse animetion data with formData.
With this change, the probability that the conventional WAF will detect NEO transmission data as an attack and block it will be greatly reduced, and the probability of successful posting will be dramatically increased.
[Added an option to send data individually with formData so that WAF does not judge it as an attack. by satopian Pull Request #94 funige/neo](https://github.com/funige/neo/pull/94)
#### Important changes
- Receipt of shi-Painter data is done by `picpost.php` as before.
However, the data of PaintBBS NEO is received by newly added `saveneo.php`.
If you forget to upload this file, you will not be able to post from NEO, so be sure to update it.
Transfer it to the same directory as potiboard.php.
Please update 

- Updated Paint screen template

```
mono_paint.blade.php

```
A parameter has been added to switch to the formData submit mode.

### Changed the config.php

Until now, it was not possible to remove PaintBBS NEO from apps that use it, but now you can choose to use or not use NEO.
If you set it to not use all, it will be a setting that does not use the drawing function.
You can also set it to use only Klecks or only ChickenPaint.
When there is only one app to use, the pull-down menu for app selection disappears and the screen becomes clean.

### Limited by drawing time

For example, if you want to reject submissions with only lines drawn in less than 1 minute,

```
// Security timer (unit: seconds). If not set, use ""
define("SECURITY_TIMER", "");

```
It was possible to specify the minimum required drawing time with , but until now, it was effective only for Shi-Painter and PaintBBS NEO.
With this update, ChickenPaint and Klecks now have this setting enabled.
In the old method, when there was a violation, it was possible to jump to another site (for example, the Metropolitan Police Department site), but instead of that method, an alert will open "Please draw for another 30 seconds.".


## [2022/12/30] v5.52.8

### It is now possible to extract the width and height from the old Java version pch file and load it into the canvas.
All apps no longer require canvas size input when uploading an app specific file and loading it into the canvas.

![221227_006](https://user-images.githubusercontent.com/44894014/210079467-e7e3d80b-cf15-4dc1-8cb2-89dfc3f52800.gif)


## [2022/12/28] v5.52.2

### Improved. PaintBBS NEO animation file upload painting made easy.
-  It has become easier and more convenient to upload and paint PaintBBS NEO and Java Shi Painter videos from the administrator screen.  
Until now, it was necessary to specify the canvas size before loading the pch animation file into the canvas.  
With v5.52, you can now automatically get the canvas size from the animation file.  
However, it is necessary to specify the canvas size when uploading the animation file of the Java version of PaintBBS.  
For HTML5 version PaintBBS NEO, you can automatically get the canvas size when uploading animation files.  

![221227_005](https://user-images.githubusercontent.com/44894014/209773098-d83a702f-dd79-49e8-9030-c2cdedee266b.gif)
↑  
This is a GIF animation created to introduce the operation when uploading files in specific formats for shi-Painter, PaintBBS NEO, Klecks, and ChickenPaint from the administrator screen.  
The canvas size is still 300x300, but the canvas is open at its original size.  
If you can download a PSD file, why not upload it? Including the meaning of the explanation for those who were wondering, I also uploaded the ChickenPaint `.chi` file and the Klecks `.psd` file (Photoshop format). I created this GIF animation for description.  

## [2022/12/24] v5.51.0
- PaintBBS NEO update v1.5.16
- Solved the problem that cookies could not be read with JavaScript when WAF (Web Application Firewall) was turned on.
If WAF is turned on, cookies are encrypted and have the httpOnly attribute.
POTI-board uses JavaScript to load cookies into static HTML files.
Therefore, with the conventional POTI-board, it was not possible to read the cookie of the form input content when the WAF was turned on.
I solved this problem by issuing a form input cookie not only in PHP programs, but also in JavaScript.
However, it is safer to use httpOnly cookies, which prevent JavaScript from reading the cookie.
There is also a drawing board that uses httpOnly cookies.
[satopian/Petit_Note_EN: Petit Note English ver.PHP script for PaintBBS,ChickenPaint, and Klecks PHP5.6-PHP8.2](https://github.com/satopian/Petit_Note_EN)
Log conversion from POTI-board is also possible.
[satopian/PetitNote_plugin: Petit Note Plugin for Drawing Board](https://github.com/satopian/PetitNote_plugin)

- Adding JavaScript to HTML files to emit cookies for form inputs increases the number of lines of inline JavaScript.
So I externalized my JavaScript.
This externalized JavaScript also includes the back to top button JavaScript and the Luminous image popup JavaScript.
We apologize for the inconvenience and the need to update templates frequently.
A directory for JavaScript has also been added, such as `templates/mono_en/js/`.
Please note that if you forget to upload this directory, things like the back button that appears when you scroll down or the JavaScript that appears on the same screen when you click on an image will not work.
Overwrite everything in the `templates/` directory if you haven't customized the templates.
Just upload all new installations.

## POTI-board EVO v5.50.11 release
## [2022/12/21] v5.50.11

### Improvements

- Changed the format of the canvas size pull-down menu formula generation loop to prevent XSS.
- Removed self-closing tag due to warnings when checked by [W3C Markup Validation Service](https://validator.w3.org/).
- Add same-origin check. Illegal posts from different origins are now rejected.
However, for browsers that do not support Orijin headers, such as Edge's IE mode, Orijin headers are not checked.
This is because if this check becomes mandatory, it will not be possible to start the shi-painter using Java.
CheerpJ, for example, cannot smoothly play Shi-Painter's drawing animation, so Java must be started.
- Protection against directory traversal attacks. Invalidate hierarchies such as `../../` in basename() when variables are entered in fopen().
- Rejection when the password is incorrect 5 times in a row.
If you enter the wrong administrator password five times in a row, you can now refuse to enter it any more.
If you want to use this function, please add the following setting items anywhere in config.php.

> /*safety*/
> 
> //Reject if admin password is wrong for her 5 times in a row
> // (1: Enabled, 0: Disabled) 
> // 1: Enabled for more security, but if the login page is locked it will take more effort to unlock it.
> 
> define("CHECK_PASSWORD_INPUT_ERROR_COUNT", "0");
> 
> // Access via ftp etc.
> // Remove the `templates/errorlog/error.log` and you should be able to login again.
> //This file contains the IP addresses of clients who entered an incorrect admin password.
> 

- Changed the method to get IP address and host name because some servers cannot get IP address with getenv().
- Use uniqid() to emit user-code repcode. It now changes in micro time units.
- Increased the replacement code length from 8 to 12 characters.

- Added original error message for WAF false positive to PaintBBS NEO.

![Screen-2022-12-21_14-34-31](https://user-images.githubusercontent.com/44894014/208915842-51352610-9abc-46b1-b4c1-8403a51bb573.png)


## [2022/11/30] v5.36.8

### update
- Updated Klecks.
- Fixed brush shortcut key behavior.
Updated BladeOne to v4.7.1.

### improvement
- Even if the timestamps used in the working files overlap, advance the post time by 1 second so that the timestamps do not overlap.
Previously, the working file could be overwritten by another file.

- An error does not occur when the post time to be compared is in the future.
In the post waiting time calculation process, even if the post time after the current time is detected, it will not be an error.
For example, if the posting time is delayed by one year due to some mistake, the next posting will not be possible until one year has passed. To avoid this, if the waiting time is a negative value, it will pass without generating an error.

- BladeOne v4.7.1. Along with that, I changed potiboard.php to automatically generate the cache directory.
The cache directory auto-generation feature has been removed from BladeOne. As an alternative function, added a cache directory auto-creation function to potiboard.php.

- Change the permission of files that need to be written in advance to 0606 (606). The log file that cannot be viewed externally is 0600 (600).

- The types of error messages have increased when posting OEKAKI images fails.

## [2022/10/29] v5.35.3

### Improvements
#### Template Common
- When you click the image file link on the management screen, it now pops up with luminous.
Previously, images were opened in separate tabs.
- Corrected [tweet] to [Tweet].
- Corrected [TOOL] to [Tool].

#### Template MONO
- Added back to top page function that is displayed when scrolling to template MONO.
- Display optimized for smartphones. If the resolution is iPad (768px) , unfloat the image. Set the image margins to 0.
As a result, the left and right margins of the image displayed on the smartphone are the same.
Previously, the margin on the right side of the screen was larger.
・The administrator can now edit the article by clicking the article number on the MONO administrator deletion screen.

### Security

- If the script content of CheerpJ Applet Runner has been tampered with by hacking, etc., it will be detected and the script will not be executed.
[Subresource Integrity](https://developer.mozilla.org/en/docs/Web/Security/Subresource_Integrity) See MDN.
If you change the version of CheerpJ, it will not work unless you change the hash value.
However, the calculated hash value is included in the latest version of potiboard.php
・If the image file received by picpost.php, which receives data from the Shi applet or PaintBBS NEO, is not  jpeg, png, etc. image, it will be judged as illegal and deleted.

### When using Shii applet and PaintBBS NEO, the behavior of rejection due to the time required for drawing or the number of steps required has been changed.

・shi-chan has developed a function to redirect the drawing screen to the police site when the drawing time is short or the number of drawing processes is small.
However, this feature was impractical and of no use.
Therefore, instead of suddenly jumping to the specified URL from the drawing screen, we changed the specification to display an alert on the drawing screen that "drawing time is too short" and "the number of steps is low".
  
![221027_002 Issue an alert when the NEO drawing time or number of processes is insufficient. ](https://user-images.githubusercontent.com/44894014/198825566-dc572087-a49a-4ec4-b79b-4d0bdaa18c04.gif)

### Compulsory thumbnail function is back
- Restored the force thumbnail feature that was in v1.3.
Using the latest `thumbnail_gd.php` turns this feature on.
If the file size exceeds 1MB, a thumbnail image in jpeg format will be output.
Assumed case. If a GIF animation image file that is small in height and width but large in file size exceeds 1 MB, a thumbnail image in JPEG format will be displayed instead of the GIF animation.
Click the image to view the original GIF animation.

### others
- Changed the initial error message to switch automatically between Japanese and English.
- Reduce load by avoiding unnecessary processing. For example, if there are no comments, you don't have to check the length of the comment or the bad words, so returning immediately reduces the load.

### update Klecks
Fixes an issue where white fills after using distortion tool show lines that follow the shape of the Liquify.
Added how-to video link to help page and added gradient shortcut keys section.

## [2022/10/03] v5.26.8

### Updated ChickenPaint to the latest version.

![ChickenPaint_Chrome106_bug](https://user-images.githubusercontent.com/44894014/193561979-a99928d2-5e4d-4265-8e20-1f42cb630599.gif)

The attached image is a GIF animation when I did a reproduction test of the problem that the color picker is not displayed.
Updated to the latest version of ChickenPaint to avoid a bug in Google Chrome 105,106 that causes this problem.

### Updated klecks to the latest version.

- Added option to use gradient tool as an eraser.
- Added vanishing point filter.

### Display images using luminous.

![luminous](https://user-images.githubusercontent.com/44894014/193562309-209f2623-0969-4726-8285-203932641057.gif)


## [2022/09/20] v5.26.3
### Update
- Updated Klecks to latest version.
Gradient tool and pattern filter added.
- Updated BladeOne to v4.6.
### Bug fixes
- Fixed a bug that an E-WARNING level PHP error occurred when specifying an article number other than the article number of the thread's parent on the reply screen.
Please update `potiboard.php`.
### Improvements
- If the password field is blank for password authentication when drawing a continuation or download authentication of pch, chi, psd, the cookie password will be used instead.
Unified to the same behavior as password authentication during edit function.  
- Fixed function `check_password()` for password checking. Password authentication will not succeed if no password is entered and the password is not present in the cookie.  
- Fixed the multilingual support of the mail notification function was insufficient.
- Increased page number spacing for template MONO.
- Fixed paint screen's clock javascript .
- Changed the unit of file size on the managed post screen from bytes to kb.

## [2022/08/16] v5.23.8
### Update
- Updated Klecks to the latest version.
Added noise filter.
  
![image](https://user-images.githubusercontent.com/44894014/184852762-85d62967-63b4-41bd-b857-eec9d9cc63d4.png)

- Updated BladeOne to v4.5.5.
- Updated jQuery to v3.6.0.
Since the existence of the file is checked, the program will not run if the included jQuery does not exist.
The  case an error message telling you that the file does not exist.

### Improvements
- Fixed clickjacking vulnerability.
It will not be possible to display in frames or iframes.
It's more secure, but I know some people want to display it in a frame.
Therefore, we added a new setting item to config.php so that you can select whether or not to display it in the frame.
If you do not need to display in the frame, you do not need to add setting items.
```
// Deny display in iframe:  (1: Deny, 0: Allow)
// We strongly recommend "Deny" to avoid security risks.
define('X_FRAME_OPTIONS_DENY', '1');

```
I think it is difficult to rewrite config.php from scratch, so if you add the above setting items anywhere, you will be able to display it in the frame.

- Improved mobile usability.
Optimized tap target size and spacing.

- Improved page loading speed
Prefetch externally loaded JavaScript such as jQuery and loadcookie.js to avoid rendering blocking.
- JavaScript execution timing to `DOMContentLoaded`.

- Fixed a fatal error if not written carefully. error() function to built-in function die().
  
- Enabled to change the jQuery version without touching the template directly.
- Added width and height of image in search screen.
- In order to speed up loading speed, loading="lazy" is not applied to the range displayed from the beginning.
- The JavaScript description of the timer under the PaintBBS startup screen was deprecated, so it has been fixed.
[After setting the content security policy, the clock on the drawing screen of POTI-board stopped working. ｜Satopian｜note](https://note.com/satopian/n/n7b757ee05975)

## [2022/07/11] v5.20.2
### Improvement
- Reduced the probability of duplicate file names when posting drawing images to 1/1000.
- Even if it is duplicated, 1 second will be added to the posting time.
- Add a process to check if there is a posted image, make sure that the drawn image is sent to the server, and then move from the drawing screen.
### Update
- Klecks has been updated. Added a grid to the editing function.
- BladeOne has been updated. A minor bug has been fixed.

[Release POTI-board EVO EN v5.20.2 released.](https://github.com/satopian/poti-kaini-EN/releases/latest)

## [2022/06/30] v5.19.1
- Since it was confirmed that it does not work with PHP7.1, the required operating environment has been changed to PHP7.2 or higher.
In the PHP7.1 environment, it will not start and will issue an error message telling you that the PHP version is low.
- The form is not displayed when there is no unposted image.  


## [2022/06/11] v5.18.25
### Bug fixes
- Fixed the issue that the layout was broken when posts omitted .

### Improvement
- ChickenPaint now launches in full screen.

More information can be found in the release.    

## [2022/05/25] v5.18.9
### Klecks update
Updated Klecks to the latest version.
### CheerpJ update to v2.3
Updated CheerpJ, which converts Java applets to JavaScript when using the painter, to v2.3.
### Bug fixes
 - Fixed a bug that the rejected character string and rejected url for anti-spam could not be processed correctly if they contained `/` (slash).
 - Fixed a minor error when calculating the number of days elapsed for deleting temporary unnecessary files.
 - Fixed the problem that the date and time when closing the reply in the specified number of days was not the parent's posting date and time but the latest reply posting date and time.

### Improvement
- Reimplemented tripcode function.


## [2022/04/28] v5.16.8

### Klecks has been updated.
- Several issues with the iPad OS have been fixed.
- Traditional Chinese has been added to the available languages.

### The template engine BladeOne has been updated.

- BladeOne has been updated to v4.5.3.

### Improvement

- If the cause of the transmission failure of klecks is a server error, the error number is displayed as an alert.
For example, if `saveklecks.php` does not exist ," Error 404 "will be displayed in the alert.

- Changed the working directory of the PNGtoJPEG process to `TEMP_DIR`.
Even if the process fails and the working files are left behind, they are now automatically deleted over time.

### Bug fixes
- When the `.pch` save directory was specified other than`'src /'`, the automatic directory creation function did not work and the required files could not be saved.
Changed to be created automatically when the directory does not exist.


## [2022/04/02] v5.16.5.1
- fix search template.
- fix main template.
Fixed a grammatical error in the HTML of the search screen.
- Corrected incorrect English notation.
- klecks updated
The number of layers that can be used has been increased from 8 to 16.  


## [2022/03/25] v5.16.5

### Improvement
### Klecks Japanese translation
![image](https://user-images.githubusercontent.com/44894014/160145766-395c519f-e90e-4397-a92e-03005648906e.png)

- Translated Klecks into Japanese.
I was able to bundle a Japanese version with POTI-board.
This new version of Klecks will automatically detect your browser's language priority and switch languages ​​for you.
You can also specify the language to use regardless of the browser language setting.
You can select English, German, or Japanese.
Chinese is only in Simplified Chinese and details are still in English.
Japanese translation resources have already been merged into the klecks repository.

### The download button for the application-specific file has been created.
![image](https://user-images.githubusercontent.com/44894014/160227733-b57a5783-d95a-4648-b484-5e065b2b7402.png)

#### App-specific format list
- `. Pch` file (PaintBBS)
- `. Chi` file (ChickenPaint)
- `. Psd` file (Klecks)

The file containing the layer information for Klecks is a `.psd` file in Photoshop format.
The downloaded `.psd` file can be opened by CSP, SAI and many other apps.
`.pch` and` .chi` can be opened with NEO and ChickenPaint, respectively.
If you attach `.pch`,` .chi`, `.psd` from the administrator posting screen and press the paint button, you can load it on the canvas and post it.

#### Transparent PNG, change the transparent part of the thumbnail of transparent GIF to white

- Fixed the problem that the transparent part of transparent PNG was black when it was converted to JPEG.
It is not a mistake that the transparent color is black, but since it often results in unintended results, when converting from transparent GIF or transparent PNG to JPEG, the transparent color is converted to white.

### Bug fixes

- Fixed the case where a minor error occurred when operating the upload format specific to the paint application used when logging in to the administrator, and the automatic deletion function of unnecessary temporary files such as pch, chi, and psd.
### BladeOne update
Updated template engine BladeOne to v4.5.

## [2022/03/12] v5.12.0
### Bug fixes
- Fixed the issues that the menu could not be operated with Apple Pencil.
Fixed that the menu operation of ChickenPaint and Klecks could not be operated with.
It was caused by Javascript added to the paint related template in v3.19.5.
I deleted the corresponding Javascript and confirmed that it works normally.
### Updated Klecks
- Updated Klecks to the latest version.
A new brush has been added. You can now do mirror painting.

## [2022/03/8] v5.10.0

### new function
- You can use the new painting app Klecks.

![image](https://user-images.githubusercontent.com/44894014/157234120-d806d24f-2f2b-4600-9d29-515a5743efd6.png)

Easy-to-understand UI, powerful brushes, and filter functions.
You can use 8 layers.
### fix
Many minor bugs have been fixed.

## [2022/02/10] v5.05.0

### URL blacklists
When the character string specified by the "String blacklists" exists in the URL, it is now rejected.
In addition, we have added a "URL blacklists" .

```
// URL blacklists
$badurl = array("example.com","www.example.com");

```

Previously, no spam word checking was done on the URL.

### Older threads don't show links to draw more. Do not allow the continuation to be drawn.

There was a function to lock the editing of articles that exceeded the specified number of days, but I was able to draw the continuation.
I created these settings because the article will be modified if the password is compromised by a third party.
Even if the article is locked, it can be deleted by the user.
In addition, the administrator can edit even after the specified number of days.

However, I think that some people may be in trouble if the lock is applied within a certain number of days.

`define ('ELAPSED_DAYS', '365');`

Threads older than 1 year will be locked in `365`,

`define ('ELAPSED_DAYS', '0');`
  
If set to `0`, it will not be locked.

- If the specified number of days has passed while drawing, it will be a new post.
Also, when the thread is deleted while drawing, it will be a new post.

## [2022/01/27] v5.01.03
### Change to BladeOne for template engine

I changed the template engine to BladeOne because I get a deprecated error from Skinny.php in PHP8.1 environment.
However, that means that the templates will be incompatible.
Templates with the extension `HTML` have been replaced with templates with the extension `blade.php`.
When you open the content, it's not much different from a traditional template. However, it may seem difficult because the extension is not HTML. 

### What has changed due to the change of the template engine
#### PHP7.4
- I was developing it to work in PHP5.6 environment, but I found that v4.2 of BladeOne only works in PHP7.4 or higher environment.
POTI-board EVO v5.x requires PHP 7.4 or higher.

#### Information for those who customize and use templates.
The thread display process has changed significantly.
Previously, there was processing for the parent of the thread, and there was separate processing for reply.

In v5.x, the loop of the array of one thread is ended at once.

It then treats the first loop as the parent of the thread.
Specifically, it looks like the following.

```
	@foreach ($ress as $res)
	 {{-- Parent article header -}}
	@if ($loop->first)
	{{-- First loop -}}
	<h2 class="article_title"><a href="{{$self}}?res={{$ress[0]['no']}}">[{{$ress[0]['no']}}]
			{{$ress[0]['sub']}}</a></h2>

	@else
	<hr>
	{{-- article header for reply -}}
	<div class="res_article_wrap">
		<div class="res_article_title">[{{$res['no']}}] {{$res['sub']}}</div>
		@endif

```

`@if ($loop->first)` is true for the first loop of the thread.
When `@if ($loop->first)` is true, it is processed as the parent of the thread.
The `<h2>` tag of the title that is displayed differently only when it is the parent of the thread is put in that place.

If you install the extension [laravel-blade](https://marketplace.visualstudio.com/items?itemName=cjhowe7.laravel-blade&ssr=false#review-details) in a free editor called VScode, the editor screen will appear. Switch to a color scheme optimized for the blade syntax.
Both the extension and the editor itself can be used free of charge.
### Files that have changed
all.
## Looking ahead for a few years
We apologize for the incompatibility of the template and the resetting of config.php, but we hope you understand it.

Also, please use the PHP script for the Oekaki bulletin board called [Petit Note](https://github.com/satopian/Petit_Note), which was newly recreated from scratch.


## [2021/12/22] v3.19.5

- Added the ability to display images of the next and previous threads in the reply view.  

![image](https://user-images.githubusercontent.com/44894014/147068447-9fda9fbe-bfbe-473a-b318-72be33f54273.png)

  
- When you continue from the Reply image with a "new post", that image becomes the Reply image.  
Previously, if you continue and draw from the image of Reply, a new thread was created.  

- After replying, the screen of each thread that replied is now displayed.
Previously, the top page was displayed regardless of where you replied to the thread.
- Changed the display method when editing / deleting in reply mode or catalog mode and completing the work.
For example, when the edit / delete work is completed on the second page of the catalog mode, the second page of the catalog mode is displayed.
Until now, the top page was displayed.
- Individual threads are now displayed when you continue drawing and the post is complete.
Until now, the top page was displayed.
If the image you want to continue is many pages away from the top page, you had to find the image from many pages.

- ChickenPaint Swipe a specific part of the screen to prevent it from moving up or down. The relevant parts are controlled by JavaScript.  
  
## [2021/12/04] v3.15.3

- Updated index.php required for new installations.  
Even if the PHP version is PHP5.3 or lower, an error message will be displayed indicating that it will not work because the PHP version is low.  
Previously it was a fatal PHP error.  

- Fixed an issue where long press the ChickenPaint's palette with the pen would open an unwanted mouse right-click menu.

- Fixed an issue where the screen would move up and down when copying and layer merging with PaintBBS NEO.  
If you select a rectangle to perform a copy and layer combination operation, the pen may protrude slightly from the canvas.  
At this time, the PaintBBS NEO's canvas may move up and down.  
Occurs when using Windows ink or Apple Pencil.  
If a screen width wider than the iPad is detected, the screen will not move even if you swipe the mesh part around the canvas of PaintBBSNEO.  
When using a smartphone, the operation is the same as before. Because if you want to pinch out the canvas and zoom in,If you cannot swipe, you cannot operate.    

Please update `mono_paint.html` to resolve these issues.

- picpost.php
Fixed false positives for languages.

- Many translations have been improved.

## [2021/11/23] v3.15.2
### Updated contents of `potiboard.php`

- Chi file deletion process after upload painting  
I added it because there was no process to delete the chi file after uploading the ChickenPaint-specific file and the chi format file and loading it on the canvas in the administrator's post.  
This fix removes it from the temporary directory 5 minutes after uploading. Prior to this fix, files that were no longer needed were deleted after a few days.  
- The HTML ALT for images has been fixed. The HTML translation of the theme has been improved.  


## [2021/11/16] v3.12.2

### `potiboard.php` updates

- Fixed the calculation method of the width and height of the thumbnail image and the width and height of the HTML image when drawing the continuation.
The setting value of connfig.php is set as the maximum value and the calculation is restarted from the beginning.
In ChickenPaint, you can change the height and width of the image by rotating it, but until now, the size of the thumbnail image became smaller each time it was rotated.
- The actual canvas size is now set in the cookie. Previously, the value entered by the user was set as is. Since there is a maximum value for the canvas size, for example, when the maximum is 800px, even if you enter 8000px, the actual canvas size that opens is 800px.
Previously, the cookie was set to 8000px even in such cases.
- An error is now returned when a file name with an invalid length is entered.
- Checks the length of the reply number and returns an error if the length is incorrect.
- Fixed the specification that the full text of the parent's comment is displayed in the description of the article displayed on the reply screen, and now omits 300 bytes or more.
- The translation has been improved.

Please update `potiboard.php`.
### `picpost.php` and `save.php` updates
- In order to mitigate unauthorized posting from external sites, the usercode set in the usercode and cookie during post processing is now checked.

Please update `picpost.php` and `save.php`.

## [2021/10/31] v3.10.1 
- Added password length check. 
- Moved the length check of each input item to the first half of the process.

Fixed a minor error that occurred when displaying the management screen.
The file needed to fix this issue is potiboard.php.
Please update `potiboard.php` by overwriting.

## [2021/10/30] v3.10.0 Fixed a serious bug

- All versions of POTI-board prior to v3.09.5 have a serious bug.  
You may lose all log files.

For those who are using POTI-board v2.  
You cannot use all the functions of v3 system just by replacing `potiboard.php`, but you can deal with this problem.  

Please update `potiboard.php` by overwriting.

### [2021/10/27] v3.09.5

- To prevent the use of weak passwords, an error message will be displayed when the password is 5 characters or less. The error message is "Password is too short. At least 6 characters."
- In order to prevent tampering with articles by third parties, the function to lock replies to threads older than the set number of days has been expanded to lock editing of old articles.
You can delete it. In addition, the administrator can edit and delete as before.

- If you used the old config.php that doesn't have the following settings, you had to check or uncheck [no_imane].  
>// Use to the checkbox of [no_imane], do:'1', do not:'0'  
define('USE_CHECK_NO_FILE', '0');  

we changed this default value from "do:'1'" to "do not:'0'".  
Previously, even if you were using a new theme HTML file, you had to check or uncheck "[no_imane]" when the version of config.php was old.  
- Changing the copyright link on the site. [https://paintbbs.sakura.ne.jp/poti/](https://paintbbs.sakura.ne.jp/poti/)


### [2021/09/28] v3.08.1.1

- Fixed a bug in POTI-board EVO v3.08.1.  
There was a problem switching the color scheme of the theme MONO because the necessary JavaScript was accidentally deleted.

### [2021/09/28] v3.08.1
#### bug fixes
- Fixed an issue where the submit button was not enabled when using the browser's "History Back" or error screen "Back" links.  


### [2021/09/28] v3.07.5
#### Minor bug fixes

 - Fixed the processing specification that determines whether to start the drawing time calculation.
 - Even if an error occurs during the posting process, you can repost the drawing image from the unposted image. Moved work file deletion to almost the end of the post process. Previously, if an error occurred in the second half of the posting process, the posted illustration would remain on the server but could not be displayed on the bulletin board.

#### Improved UI UX

 - Linkd from thread title to reply screen.

Click the thread title to open the reply screen .

 - The color scheme of the search screen is closer to that of the bulletin board.


#### Improved auto-complete for Chrome and Firefox

When editing or deleting an article, if you enter the article number and press the edit button, the password may be saved as a set with the user name as the article number.

### [2021/08/22] v3.06.8 lot.210822

- The chickenpaint icon has been updated

- Changed the color scheme of the theme MONO  
Change vivid color to pastel color.

- Fix garbled characters  
Fixed the problem that the character string posted on the Twitter screen when the Tweet button was pressed was garbled.  
Fixed garbled characters in post notification emails.  
- Administrator deletion screen  
Improved security. Strengthened XSS measures.  
Changed the number of items displayed on one page from 2000 to 1000.
- Fixed error message  
"chi" has been added to the description of supported formats because you can use "chi" files for the ability to upload files and load them onto the canvas.

2021/08/23 Due to my mistake, there was no new icon for chicken paint.  
I apologize for any inconvenience, but please overwrite and update the ChickenPaint directory.  
It has been fixed in (v3.06.8.1).  

### [2021/08/11] v3.05.3 lot.210811
- Added decoding process because Tweet and notification emails are HTML-escaped garbled characters.
- Added output variables corresponding to the title and name used for Tweet.
#### Information for theme authors
`<% def(oya/share_sub)><% echo(oya/share_sub) %><% else %><% echo(oya/sub|urlencode) %><% /def %>`    
`<% def(oya/share_name)><% echo(oya/share_name) %><% else %><% echo(oya/name|urlencode) %><% /def %>`  
If the version of the POTI board itself is low and the newly added variables are undefined, use the variables for the old Tweet.  
When a newly added variable is defined.  
Use a new variable.  

### [2021/08/06] v3.05.2.2
- ChickenPaint has been updated to fix many iOS related bugs. Bugs related to palm rejection have been resolved.  
You can now recognize your palm and Apple Pencil. Until now, unintended straight lines have occurred.  


### [2021/08/03] v3.05.2 lot.210803
- Resolved an issue where using ChickenPaint on an iPad would cause unintended double-tap zoom issues that would make drawing difficult.  
Please update the HTML for Paint screen.
- `<img loading = "lazy"> `. Added `loading =" lazy "` to the `img` tag of theme.


### [2021/07/18] v3.05.1 lot.210616
- CSRF measures using fixed tokens have been introduced. You can reject unauthorized posts from outside the site.  
If the theme HTML does not support tokens  
`define('CHECK_CSRF_TOKEN', '1');`  
To
Change to   
`define('CHECK_CSRF_TOKEN', '0');`.
If you enable this setting when the theme is not supported, you will not be able to post.
If this setting is not present in `config.php`  
`define('CHECK_CSRF_TOKEN', '0');`  
Is treated the same as.
- Moved to the method of checking HTML at the time of output.  
Administrators can no longer use HTML tags.  
HTML tags that have already been entered will be deleted.  
The output is the HTML tags removed and escaped.  
- The form on the top page and the mini-less form displayed in each thread have been abolished.  
This is because you cannot set the CSRF token in a static HTML file.  
- ChickenPaint is now available on your smartphone.  

### [2021/08/03] v3.05.2 lot.210803
- Resolved an issue where using ChickenPaint on an iPad would cause unintended double-tap zoom issues that would make drawing difficult.  
Please update the HTML for Paint screen.
- `<img loading = "lazy"> `. Added `loading =" lazy "` to the `img` tag of theme.

### [2021/06/17] v3.02.0 lot.210617
- Addressed an issue where the Chicken Paint screen would be selected.
- Prevents returning to the previous screen with Windows ink and two-finger gestures when drawing with PaintBBS NEO and shi-Painter.
- Changed CSS switching to pull-down menu method.

### [2021/06/05] v3.01.9 lot.210605
- Updated to the latest version of "ChickenPaint".  
If the browser language is other than Japanese, it will be displayed in English. If the browser language is Japanese, it will be displayed in Japanese.
- Management screen paging Page breaks in units of 2000.  
Improved paging on the main page and catalog page.  
Shifted to a method of paging in 35-page units.  

- Addressed the version of CheerpJ where the "shi-painter" does not start.  
The JavaScript url required to start CheerpJ is managed in potiboard.php.  

### [2021/05/15] v3.00.1 lot.210514
- Chicken Paint is now available.
- The name of the script has changed to POTI-board EVO.
 
### [2021/04/22] v2.26.7 lot.210403

Change the working directory of png2jpg to the real path of src. The behavior is the same as before it was made into a function.

### [2021/03/02] v2.26.6 lot.210320.0

- Corrected English translation of `config.php`.
- Fixed an issue where images were not displaying as intended in the theme.

### [2021/03/09] v2.26.5 lot.210308.0

- Fixed a mistake in v2.26.5 regarding email addresses (by satopian)

### [2021/03/07] v2.26.3 lot.210306.0

- Fix E_WARNING level error when posting a response with no destination (by satopian)
  - Fixes writing process to `img.log` not to occur in a different way from POTIv1.33b1.
- Fixed that fopen() of user deletion was not closed.
- Fixed a bug in the administrator's delete screen (by satopian)
  - Email addresses are now passed through a validation filter, and those with invalid email formats are not sent to links.
  - Fixed a bug where MD5 was not displayed.

### [2021/02/17] v2.26.2 lot.210217.0

- Fixed an E_WARNING level error (by satopian)
  - Fixed an error where the rightmost tab of the tab separator was trimmed and the tab character was also lost.
  - In `config.php`, when `$badfile` is not set, E_WARNING level error occurs, so I made sure it is defined and is an array before processing. If config.php is set up correctly, there is no problem.
- There are changes in `potiboard.php` and `picpost.php`.

### [2021/02/15] v2.26.1 lot.210215.0

- Fixed a bug that when a mail or URL in the log is not in the correct format, it is checked when outputting and not sent out as a link (by satopian)
- The form() function used to be called for the number of HTML pages when updating the HTML of an article, but now it is assigned to a variable so that it can be called only once (by satopian)
  - The difference is so slight that you can't tell.

### [2021/02/13] v2.26.0 lot.210213.0

- Fixed XSS vulnerability in v2.23.1 lot.210203 (by satopian)
  - This is quite dangerous, so please make sure to update.
- Fixed a character string that could not be set in cookies (by Satopia)

### [2021/02/13] v2.23.9 lot.210212.1

- Added support for setting error messages when uploading pch files in template_ini.php (by satopian)

### [2021/02/12] v2.23.8 lot.210212.0

- Fixed an error when the administrator password is undefined (by satopian)
- Fixed a bug that a string to restrict only in admin mode was rejected in normal writing (by satopian)
  - There is an additional message in `template_ini.php` of theme.

### [2021/02/12] theme MONO-en

- Changed the English translation of the palette buttons a little bit (by sakots)
  - overwrite `mono_paint.html` , `template_ini.php` .

### [2021/02/10] v2.23.7 lot.210210.0

- Fixed error message displayed when administrator password is undefined (by satopian)
  - There is an additional message in `template_ini.php` of theme; Reserveed MSG040.
- Fixed the problem that the string to restrict only in admin mode is rejected even when writing normally (by satopian)

### [2021/02/09] v2.23.6 lot.210209.1

- Fixed vulnerability in admin rights when config is under certain conditions (by satopian)

### [2021/02/07] v2.23.3 lot.210207.0

- Fixed cookie errors (by satopian)
  - Please overwrite and update `loadcookie.js`.

### [2021/02/06] v2.23.2 lot.210204.0

- Rewind to v2.23.2 due to operability issues found due to multiple sending of sessions.
  - You can use the theme as is.
  - v2.25.0 will be developed while looking for a way to solve the problem.

### [2021/02/05] v2.25.0 lot.210205.0

- Changed to use session and one-time token when posting and editing by administrators (by satopian)
  - The old method of authenticating by putting the admin password in the hidden field has been abandoned, and the security has been improved because the admin password is not shown in the HTML file source.
- Update the theme MONO (by sakots)
  - Discontinue use of Font Awesome and use svg files for icons.
  - Changed the image size input method from a pull-down menu to a numerical input method.
  - Support for pch upload painting in admin posts.

### [2021/02/03] v2.23.1 lot.210203.0

- Fixed not to create a link unless the correct character string is entered as an email address in the email field (by satopian)
- Fixed remained Japanese message that should have been replaced with a constant (by satopian)
- Fixed a large number of blank lines in the log file when the number of log holdings is exceeded (by satopian)
- Fixed double cookie encoding (by satopian)
- Fine-tuning the source code of `picpsot.php` and `thumbnail.php` (by sakots)
  - The function itself has not changed.

### [2021/02/02] v2.23.0 lot.210202.0

- Not to do use variables that can be obtained with filter_input() as function arguments (by satopian)
- To be a function of input check (by satopian)
- Tuning the source code (by satopian)

### [2021/01/30] v2.22.6 lot.210130.0

- Move `picpost.systemlog` settings to `picpost.php` (by satopian)
  - Please overwiter `picpost.php`. Fixed a mistake in moving the settings.
- Fine-tuning the source code (by sakots)

### [2021/01/27] v2.22.5 lot.210127.0

- Fine-tuning the source code (by satopian)

### [2021/01/26] v2.22.3 lot.210126.0

- Fixed a bug that sometimes displayed as "0 response(s) Omitted." (by satopian)
- Fixed minor error in php8 environment (by sakots)

### [2021/01/18] search.php

- Fixed a bug that caused a fatal error in PHP8 environment (by satopian)
- Fixed a bug that it cannot be processed when the log for one statement is 4096 bytes or more (by satopian)

### [2021/01/07] theme/template_ini.php

- Improved English translation

### [2021/01/05] v2.22.2 lot.210105.0

- Multilingual support of NOTICEMAIL (by satopian)
  - The settings exist in `theme/template_ini.php`.

### [2021/01/02] v2.22.1 lot.210102.0

- Avoid fatal errors in php8 when the timestamp doesn't exist in the log. (by satopian)

### [2021/01/01] picpost.php

- The permissions of `picpost.systemlog` can be set in `config.php`. (Leakage of previous work)

### [2020/12/25] LICENSE

- Revised LICENSE by sakots.
  - I misunderstood the "inheritance" of CC BY-NC-SA 3.0.

### [2020/12/24] v2.22.0 lot.201224.0

- Sort config items according to importance (by satopian)
  - The error log settings in picpost.php have been moved to potiboard.php. It is a setting item for developers.
  - You don't have to modify config.php. Sometimes we might add new settings in the config file. When that happens, these should be changed only when it's necessary. Otherwise they should work as they are.

### [2020/12/23] config.php

- About rejected character. [Click here for details](https://github.com/sakots/poti-kaini-EN/pull/10)

### [2020/12/22] v2.21.6 lot.201222.0

- Multilingual support
  - All messages output by potiboard.php can now be set in template_ini.php. (by satopian)
- Fixed a bug where constants are defined twice (by satopian)
- Enabled to set the timezone in config.php (by satopian)
- Removed wondercatstudio 'http' from copyright notice for safety. (by sakots)
  - Because someone else has taken the domain.

Replace `potiboard.php` `picpsot.php`. Add settings to `config.php` `theme/template_ini.php`.

### [2020/12/22] theme/template_ini.php

- Improved translation (by satopian)

### [2020/12/21] search

- Translated. (by satopian)
  - `search.php` and `theme/search.html`

### [2020/12/21] theme -> mono_main.html

- "-san" (by satopian)

### [2020/12/21] config.php

- Update translation of config.php (by aaroncdc)

### [2020/12/20] v2.21.2-en

- Fixed fatal error when the posting time (UNIX timestamp) was not recorded in the log file. (by satopian)
- Improve English config descriptions (by Craftplacer)

### [2020/12/20] v2.21.1-en

- Files and Directories php outputs permissions can be set in config.php

### [2020/12/20] theme, Readme_Shichan.html, readme_pch.html

- theme
  - [Picture in the middle of posting] to [temporary pictures]
- Readme_Shichan.html, readme_pch.html
  - Those files are Not allowed to change when bundling the Shi-Painter applet.
  - So I made Readme_Shichan_utf-8.html and readme_pch_utf-8.html.
  - Just changed the character code to UTF-8. (Information for developers are written in.)

### [2020/12/20] theme -> mono_paint.html

- managed to get rid of the untranslated part ( [L] and [R] )

### [2020/12/20]

- translating project started.
  - config.php, picpost.php, and security_c.html were done.
  - readme.txt, potiboard.php, and search.php is not yet.
  - theme has a problem. I couldn't translate a short word well.
