━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  POTI-board Kai-Ni
  by POTI-board redevelopment team. >> https://paintbbs.sakura.ne.jp/poti/?en=on

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This script is a modification and support php7~ of POTI-board v1.32
from http://www.punyu.net/php

Thanks to "Skinny.php", you can freely design your own website.

the name "POTI" is an acronym for Punyu.net Oekaki Template Image.

** Cautions **

We are not responsible for any damage caused by this script.
Please use it at your own risk.

Distribution conditions are the same as for "Let's PHP!" http://php.loglog.jp/waar.php
Feel free to modify and redistribute.

** How to upgrade (POTI-board Kai-Ni v2.0 or later is assumed) **

- Main scripts
Replace all files except config.php with the unzipped files.
If there are additional items you want to set in config.php,
add them below $ADMIN_PASS = '******';.

- themes
Upload the file, and then go to the administration page and Update Log.

** Installation Method (Brief Description) **

The configuration is done by rewriting the config.php file.
Once you have placed each file,
access the URL you have set up and the initial settings will be made.
(POTI-board versions prior to July 23, 2020 will need to call potiboard.php manually.)

It is a good idea to make sure
that it works without changing any settings before doing any detailed configuration.

[directory structure]
./-- root
  | .htaccess
  | config.php
  | Skinny.php
  | potiboard.php
  | thumbnail_gd.php
  | loadcookie.js
  | index.php
  | picpost.php
  | search.php
  | security_c.html
  | palette.txt
  | 
  | * functions of NEO  (It's possible of not the latest version.)
  | neo.js
  | neo.css
  | 
  | * Shi-chan (The readme files are attached as a condition of the .jar distribution)
  | PaintBBS.jar
  | PCHViewer.jar
  | spainter_all.jar
  | 
  | readme_pch.html
  | readme_pch_utf-8.html
  | Readme_Shichan.html
  | Readme_Shichan_utf-8.html
  | 
  +--./theme/     directory (The theme directory can be set in config.php)
    | .htaccess
    | template_ini.php
    | mono_catalog.html
    | mono_main.html
    | mono_other.html
    | mono_paint.html
    | jquery-3.5.1.min.js
    +--../css/　　 (Theme css directory)
    +--../img/　　 (Theme icon and image directory)

* If you want to use the email notification function, add the following
./-- root
  | noticemail.inc

Move it to the same directory as potiboard.php


** thanks!! **

[ https://www.punyu.net/ SakaQ-san ]
Without him, there would be no POTI-board Kai-Ni today.

[ satopian-san ] 
He has been fixing bugs, improving security, 
speeding up the process, etc. I am very grateful to him. Thanks a lot.

SakaQ-san's thanks, please read the Japanese version of readme.txt.

** copyrights **

POTI-boaed Kai-Ni                  (C)POTI-board redevelopment team.

search.php                         (C)satopian

POTI-board v1.32                   (C)SakaQ "punyu-net"

[The primitive script]
gazouBBS v3.0                      (C)TOR "Let's PHP!"
+ futaba.php v0.8 lot.031015       (C)futaba "futaba channel"

[template engine]
Skinny.php                         (C)Kuasuki

[Oekaki engine]
PaintBBS (tested by v2.22_8)
Shi-Painter (tested by v1.071all)
PCH Viewer (tested by v1.12)       (C)Shi-chan "Shi-Doh"
WCS Dynamic Palette Control Set    (C)noraneko "WonderCatStudio"

PaintBBS NEO                       (C)funige

** See README.md or github for change history **
