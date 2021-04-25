<?php
/*
** Email notification class(UTF-8) lot.200712
**
** http://www.punyu.net/php/
** by SakaQ
** https://pbbs.sakura.ne.jp/poti/?en=on
** by POTI-Board redevelopment team.
**
** 2020/12/19 Translated into English.

This script is a class that adds an email notification function to PHP bulletin boards, etc.
Attachments are not supported as they are for notification purposes only.

Uploading this file to the same directory as potiboard.php will turn on the email sending feature.
Please edit config.php for detailed settings such as email address.

YOU DO NOT NEED TO EDIT THIS FILE!

-- How to use deeply --

Please require () or include () noticemail.inc at the beginning of the script you want to use this class. 
ex) include("noticemail.inc");
After that, set the data to be passed and send it with noticemail::send().

-- Description of functions --
noticemail::send(mail data[, flag of MB function use])
mail data; Put various settings in the array and set.
flag of MB function; Set to '0' if you do not want to use the MB function.

-- Setting data item -- I use $data as an example.
$data['to']
- Notification email address

$data['subject']
- The title of the notification email

$data['name']
- Name of poster

$data['email']
- The email address of the poster. Usually used for From. 

-- This is essential. Set the following as necessary --


$data['option']
- Additional post data. You can set multiple. If you do, ['option'][]="subject,content".

$data['comment']
- Body of posted data
  Set the text after returning <br> or <br /> to \n.
  ex) $data['comment'] = preg_replace("/<br(( *)|( *)/)>/i","\n", $comment);

-- Example of use --

$data['to'] = 'me@hoge.net';
$data['subject'] = 'posted something!';
$data['name'] = 'anonymous';
$data['email'] = 'hoge@hoge.com';
$data['option'][] = 'URL,http://hogehoge.com/';
$data['option'][] = 'illustration,http://hoge.net/poti/src/OB11111111.png';
$data['comment'] = 'I drew a picture!';
noticemail::send($data);

-- caution --

This cannot be used unless an MTA such as sendmail is installed and configured.
checking the data, but getting any error messages.
In the unlikely event that this script causes any damage, I will not bear full responsibility for that. Please use at your own risk.
I do not abandon the copyright, but feel free to modify or redistribute this.

*/

class noticemail{

	public static function send($data=''){
	$name = $data['name'];
	$from = $data['email'];
	$line = "---------------------------------------------------------------------\n";

	// define header
	$MailHeaders = 'Mime-Version: 1.0'."\n";
	$MailHeaders .= 'Content-Type: text/plain; charset=ISO-2022-JP'."\n";
	$MailHeaders .= 'Content-Transfer-Encoding: 7bit'."\n";

	// Create email body
	$Message = '■'.$data['subject']."\n";
	$Message .= 'Date: '.date("Y/m/d H:i:s",time())."\n";
	// user ip
	$userip = getenv("HTTP_CLIENT_IP");
	if(!$userip){
		$userip = getenv("HTTP_X_FORWARDED_FOR");
	} 
	if(!$userip){
		$userip = getenv("REMOTE_ADDR");
	} 
	$Message .= 'Host: '.gethostbyaddr($userip)."\n";
	$Message .= 'UserAgent: '.getenv("HTTP_USER_AGENT")."\n";
	$Message .= $line;
	$Message .= 'Name: '.$name."\n";
	$Message .= 'e-Mail: '.$data['email']."\n";
	$option = $data['option'];
	if(is_array($option)){
	foreach($option as $value){ list($optitle,$opvalue)=explode(",", rtrim($value)); $Message .=$optitle.': '.$opvalue." \n"; }
	}
	unset($value);
		$Message .= $line;
		if($data['comment']){
			$com = str_replace("\r\n", "\n", $data['comment']);	// 改行文字の統一
			$com = str_replace("\r", "\n", $com);
			$com = preg_replace("/^(\n)+|(\n)+$/i", "", $com);	// 連続改行を消す
			$Message .= $com;
		}
		mb_internal_encoding("UTF-8");
		// for Half-width kana
		$Message = mb_convert_kana($Message);
		$name = mb_convert_kana($name);
		$from = mb_convert_kana($from);
		// Excludes things that are clearly not email addresses
		if(preg_match("/[\x80-\xA0]/",$from)||stristr($from,'sage')||stristr($from,'http://')) $from = '';
		// Alternative if no email address
		if(!$from) $from = 'nomail@'.getenv("HTTP_HOST");
		// Attach a MIME head in Japanese
		if(preg_match("/[\x80-\xA0]/",$name)){
		$name = "=?iso-2022-jp?B?".base64_encode(mb_convert_encoding($name,"JIS","utf-8"))."?=";
		}
		// Add From to header
		$MailHeaders .= 'From: '.$name.' <'.$from.'>'."\n";
			// Attach a MIME head in Japanese at Subject
			if(preg_match("/[\x80-\xA0]/",$data['subject'])){
			$data['subject'] = "=?iso-2022-jp?B?".base64_encode(mb_convert_encoding($data['subject'],"JIS","utf-8"))."?=";
			} // send mail!
			mail($data['to'],
			$data['subject'],
			mb_convert_encoding($Message,"JIS","utf-8"), $MailHeaders);

			return true;
	}
}

