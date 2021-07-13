<?php
/*
  * Template - MONO-en by sakots  >> https://pbbs.sakura.ne.jp/poti/?en=on
  *
  * Template setting file of potiboard.php(v2.21.4～)
  *
*/

//theme version
define('TEMPLATE_VER', "v1.18.7 lot.210307.0");

//General message

//Honorific title when quoting the poster name
define('HONORIFIC_SUFFIX', '-san');
//Name of uploaded image
define('UPLOADED_OBJECT_NAME', 'The image');
//Message when upload is successful
define('UPLOAD_SUCCESSFUL', 'uploaded successfully');
//Message when the screen is changeed after posting is completed
define('THE_SCREEN_CHANGES', 'The screen changes');

//Message for notification mail
define('NOTICE_MAIL_TITLE', 'Title');
define('NOTICE_MAIL_IMG', 'Picture');
define('NOTICE_MAIL_THUMBNAIL', 'Thumbnail');
define('NOTICE_MAIL_ANIME', 'Timelapse');
define('NOTICE_MAIL_URL', 'Fixed link');
define('NOTICE_MAIL_REPLY', ' Notification: There is a new reply to a post.');
define('NOTICE_MAIL_NEWPOST', ' Notification: There is a new post');

//error message
define('MSG001', "[Log is not found.]");
define('MSG002', "[You haven't selected a picture. You must upload a picture!.]");
define('MSG003', "[Failed to upload picture.]<br>[There is a possibility that the server doesn't support it.]");
define('MSG004', "[Failed to upload picture.]<br>[The image is not valid and it was excluded.]");
define('MSG005', "[Failed to upload picture.]<br>[Image already exists.]");
define('MSG006', "[Please do not do an illegal contribution.]");
define('MSG007', "[Image does not exist.]");
define('MSG008', "[Please write something.]");
define('MSG009', "[Please enter your name.]");
define('MSG010', "[Please enter a title.]");
define('MSG011', "[comment is too long.]");
define('MSG012', "[name is too long.]");
define('MSG013', "[email is too long.]");
define('MSG014', "[subject is too long.]");
define('MSG015', "[Unknown error]");
define('MSG016', "[Post was rejected.]<br>[This HOST has been banned from posting.]");
define('MSG017', "[Error ! Open-PROXY is limited.](80)");
define('MSG018', "[Error ! Open-PROXY is limited.](8080)");
define('MSG019', "[It failed in reading the log.]");
define('MSG020', "[Please wait a little bit before posting again.]");
define('MSG021', "[Please wait a little bit before posting again.]");
define('MSG022', "[Post once by this comment.]<br>[Please put another comment.]");
define('MSG023', "[It failed in the renewal of the tree.]");
define('MSG024', "[It failed in the deletion of the tree.]");
define('MSG025', "[Thread does not exist.]");
define('MSG026', "[This is the last thread, it can not be deleted.]");
define('MSG027', "[failed in deletion.(User)]");
define('MSG028', "[article is not found or password is wrong.]");
define('MSG029', "[password is wrong.]");
define('MSG030', "[failed in deletion.(Admin)]");
define('MSG031', "[Please input No.]");
define('MSG032', "[Post was rejected.]<br>[illegal character string.]");
define('MSG033', "[failed in deletion.]<br>[user doesn't have deletion authority.]");
define('MSG034', "[Failed to upload picture.]<br>[The size of the picture is too big.]");
define('MSG035', "[Comment should have at least some Japanese characters.]");
define('MSG036', "[This URL can not be used in text.]");
define('MSG037', "[This name cannot be used.]");
define('MSG038', "[This tag cannot be used.]");
define('MSG039', "[New posts with only comments are not accepted.]");
define('MSG040', "[The administrator password is not set.]"); //Remain in reserve for a while
define('MSG041', "does not exist.");
define('MSG042', "is not readable");
define('MSG043', "is not writable");
define('MSG044', "[Either the MAX LOG is not set, or it contains a non-numeric string.]");
define('MSG045', "[Please upload the drawing animation file.]<br>[Supported formats are pch and spch.]");

//Text color table 'value[,name]'
$fontcolors = array('white,White'
,'lime,Green'
,'aquamarine,Aqua'
,'royalblue,Blue'
,'pink,Pink'
,'tomato,Red'
,'orange,Orange'
,'gold,Yellow'
,'silver,Silver'
);

//Drawing time format
//ex) "1day 1hr 1min 1sec"
define('PTIME_D', 'day');
define('PTIME_H', 'hr');
define('PTIME_M', 'min');
define('PTIME_S', 'sec');

//Format when > is attached
//Since it is sandwiched between RE_START and RE_END, 
//it is recommended to set it with css considering. (do not change it here)
define('RE_START', '<span class="resma">');
define('RE_END', '</span>');

//Current page format
//The number of pages is entered in <PAGE>
define('NOW_PAGE', '<em class="thispage">[<PAGE>]</em>');

//Format of other pages
//The number of pages is entered in <PAGE>
//<PURL> is the URL
define('OTHER_PAGE', '<a href="<PURL>">[<PAGE>]</a>');


/* -------------------- */

//Main template file
define('MAINFILE', "mono_main.html");

//Reply template file
define('RESFILE', "mono_main.html");

//Other template files
define('OTHERFILE', "mono_other.html");

//Drawing template file
define('PAINTFILE', "mono_paint.html");

//Catalog template file
define('CATALOGFILE', "mono_catalog.html");

//Number of articles to display in catalog mode
// X * Y 
define('CATALOG_X', '4');
define('CATALOG_Y', '5');

//Catalog image width. This is specified by css.
define('CATALOG_W', '150');

//Mark when editing
//After editing the article, it will be added after the date.
define('UPDATE_MARK', ' *');

//Date format
//Refer to the URL below
// http://www.php.net/manual/ja/function.date.php
//define(DATE_FORMAT, 'Y/m/d(<1>) H:i');
define('DATE_FORMAT', 'Y/m/d(D) H:i');


