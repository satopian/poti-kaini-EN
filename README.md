# POTI-board EVO EN

## Serious bugs in older versions
- POTI-board v2.26.0 and earlier all versions is vulnerable to XSS.    
Malicious JavaScript can be executed.

- POTI-board v3.09.x and earlier all versions have a serious bug.  
You may lose all log files.

Please update to v3.10.1 or higher.

## A POTI-board that can use HTML5 versions of PaintBBS NEO and Chicken Paint.

![PaintBBS NEO](https://user-images.githubusercontent.com/44894014/130362908-27922b42-6a4c-4c73-8ab6-a1f678014eed.png)

![ChickenPaint](https://user-images.githubusercontent.com/44894014/130363514-1ac820bf-0c6b-4cfa-ba47-62e0b40c3e74.png)


In v3.0, the HTML5 version of the high-performance paint application [ChickenPaint](https://github.com/thenickdude/chickenpaint) is available.  
The HTML5 version of [PaintBBS NEO](https://github.com/funige/neo/) is still available.


This is a project to translate [POTI-board EVO](https://github.com/satopian/poti-kaini/) into English.

[POTI-board Kai official website](https://paintbbs.sakura.ne.jp/poti/?en=on) English.

## Required php version

Required PHP version.PHP7.1 to PHP8.1

### To change the color scheme of the Default theme MONO
MONO's HTML and CSS have been significantly updated in v3.07.5.  
Therefore, if you use a CSS file older than v3.07.5, some designs will not be displayed correctly.  
For example, footers and catalogs don't look as intended.  
If you want to change only the color scheme, please use the SCSS for development.  

[css/dev/sass](https://github.com/satopian/poti-kaini-EN/tree/main/potiboard5/templates/mono_en/css/dev/sass)

It's easy to change the color scheme because the settings are separated for the color scheme and other designs.  
However, an environment that can handle SCSS is required.  
For example, the free [Visual Studio Code](https://azure.microsoft.com/en-us/products/visual-studio-code/) and its extension, [DartJS Sass Compiler and Sass Watcher](https://marketplace.visualstudio.com/items?itemName=codelios.dartsass).

## Change log (timezone: Asia/Tokyo, UTC+09:00)

## [2022/01/27] v5.01.03
### Change to bladeOne for template engine

I changed the template engine to BladeOne because I get a deprecated error from Skinny.php in PHP8.1 environment.
However, that means that the templates will be incompatible.
Templates with the extension `HTML` have been replaced with templates with the extension` blade.php`.
When you open the content, it's not much different from a traditional template. However, it may seem difficult because the extension is not HTML. 

### What has changed due to the change of the template engine
#### PHP7.1
- I was developing it to work in PHP5.6 environment, but I found that v4.2 of BladeOne only works in PHP7.1 or higher environment.
POTI-board EVO v5.x requires PHP 7.1 or higher.

#### Information for those who customize and use templates.
The thread display process has changed significantly.
Previously, there was processing for the parent of the thread, and there was separate processing for less.

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

More information can be found in the release.    
[Release POTI-board EVO EN v5.01.03 released.](https://github.com/satopian/poti-kaini-EN/releases/tag/v5.01.03)


## POTI-board EVO EN v3.19.5 released. 
## [2021/12/22] v3.19.5

- Added the ability to display images of the next and previous threads in the reply view.  
  
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
  
More information can be found in the release.    
[Release POTI-board EVO EN v3.19.5 released.](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.19.5)


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

More information can be found in the release.  
[Release POTI-board EVO EN v3.12.2 released.](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.12.2)

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

More information can be found in the release.  
[Release POTI-board EVO EN v3.10.1](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.10.1)

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
More information can be found in the release.  
[Release POTI-board EVO EN v3.08.1.1](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.08.1.1)

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

More information can be found in the release.  
[Release POTI-board EVO EN v3.07.5](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.07.5)

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

More information can be found in the release.  
[Release POTI-board EVO EN v3.06.8.2](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.06.8.2)

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

More information can be found in the release.  
[Release POTI-board EVO EN v3.05.2.2](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.05.2.2)

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

More information can be found in the release.  
[Release POTI-board EVO EN v3.05.1](https://github.com/satopian/poti-kaini-EN/releases/tag/v3.05.1)

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
