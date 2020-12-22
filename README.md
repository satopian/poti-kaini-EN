# POTI-board Kai Ni-EN

![POTI-board Kai Ni](https://user-images.githubusercontent.com/31465648/102697336-67ce1580-4278-11eb-9226-4c67fd989fe8.png)

This is a project to translate [POTI-board改二](https://github.com/sakots/poti-kaini/) into English.

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
