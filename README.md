# POTI-board Kai Ni-EN

![POTI-board Kai Ni](https://raw.githubusercontent.com/wiki/sakots/poti-kaini-EN/img/paintmode.png)

This is a project to translate [POTI-board改二](https://github.com/satopian/poti-kaini/) into English.

[The official website of POTI Kai](https://pbbs.sakura.ne.jp/poti/)

## Required php version

php5.5 or upper, php7.x, or php8.0.

## I was very grateful for this

[PaintBBS NEO](https://github.com/funige/neo/)

## About the function of digital ink (windows Ink)

If you run Paint BBS NEO / Shi-Painter with Digital Ink (windows Ink) on,
It cause unintended movement; For example, if you slide the pen from left to right,
the browser will return to the previous screen.
Please turn off the digital ink (Window Ink) when using PaintBBS NEO / Painter.

![digital ink](https://user-images.githubusercontent.com/31465648/83109254-0c7ddf80-a0fc-11ea-9627-7b4afe5ae193.PNG)

It can also conflict with mouse gesture extensions.
If you feel something is wrong, try turning it off.
  
## Change log (timezone: Asia/Tokyo, UTC+09:00)

### [2021/04/22] v2.26.7lot.210403

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
