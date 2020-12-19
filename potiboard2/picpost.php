<?php
//----------------------------------------------------------------------
// picpost.php lot.201218  by SakaQ >> http://www.punyu.net/php/
// & sakots >> https://poti-k.info/
//
// Save the drawing image posted from Shi to TEMP
//
// This script was created for PHP
// with reference to the PNG save routine of PaintBBS (Aotama CGI).
//----------------------------------------------------------------------
// 2020/12/20 Translated into English

// settings
include(__DIR__.'/config.php');
// timezone
// List of Supported Timezones are here https://www.php.net/manual/en/timezones.php
date_default_timezone_set('Asia/Tokyo');
//Check for capacity violations, do:'1', do not:'0'.
define('SIZE_CHECK', '1');
//Post capacity limit (kB)
define('PICPOST_MAX_KB', '3072'); // Up to 3MB

$time = time();
$imgfile = $time.substr(microtime(),2,3);	//Image file name

/* Record an error in SystemLOG when an error occurs */
function error($error){
	global $imgfile,$syslog,$syslogmax;
	$time = time();
	$youbi = array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
	$yd = $youbi[date("w", $time)] ;
	$now = date("y/m/d",$time)."(".(string)$yd.")".date("H:i",$time);
	if(!is_file($syslog)){// criate $syslog if it is not here
		file_put_contents($syslog,"\n", LOCK_EX);
		chmod($syslog,0606);
	}
	$ep = fopen($syslog , "r+") or die($syslog." cannot be opend");
	flock($ep, LOCK_EX);
	rewind($ep);
	$key=0;
	while($line=fgets($ep,4096)){// log to array 
		if($line!==''){
		$lines[$key]=$line;
	}
	++$key;
	if($key>($syslogmax-2)){// Record limit
	break;
	}
	}
	$line=implode('',$lines);// Error information so far
	$newline=$imgfile."  ".$error." [".$now."]\n";// Latest error information
	$newline.=$line;// Summarize
	rewind($ep);
	fwrite($ep,$newline);
	fflush($ep);
	flock($ep, LOCK_UN);
	fclose($ep);
}

/* main */

$u_ip = getenv("HTTP_CLIENT_IP");
if(!$u_ip) $u_ip = getenv("HTTP_X_FORWARDED_FOR");
if(!$u_ip) $u_ip = getenv("REMOTE_ADDR");
$u_host = gethostbyaddr($u_ip);
$u_agent = getenv("HTTP_USER_AGENT");
$u_agent = str_replace("\t", "", $u_agent);

// get raw POST data
$buffer = file_get_contents('php://input');
if(!$buffer){
	$stdin = @fopen("php://input", "rb");
	$buffer = @fread($stdin, $_ENV['CONTENT_LENGTH']);
	@fclose($stdin);
}
if(!$buffer){
	error(" Oops! Failed to get the data. The drawing image is not saved.");
	exit;
}

// Get extended header length
$headerLength = substr($buffer, 1, 8);
// Extract the length of the image file
$imgLength = substr($buffer, 1 + 8 + $headerLength, 8);
// Do not save if the posting capacity limit is exceeded
if(SIZE_CHECK && ($imgLength > PICPOST_MAX_KB * 1024)){
	error("Capacity over. The drawing image is not saved.");
	exit;
}
// Extract image
$imgdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2, $imgLength);
// get image hedder
$imgh = substr($imgdata, 1, 5);
// Extension setting
if($imgh=="PNG\r\n"){
	$imgext = '.png';	// PNG
}else{
	$imgext = '.jpg';	// JPEG
}
$full_imgfile = TEMP_DIR.$imgfile.$imgext;
// Check the file with the same name exists
if(is_file($full_imgfile)){
	error("An image file with the same name exists. Overwrite.");
}
// Write image data to a file
$fp = fopen($full_imgfile,"wb");
if(!$fp){
	error("Failed to open the image file. The drawing image is not saved.");
	exit;
}else{
	flock($fp, LOCK_EX);
	fwrite($fp, $imgdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
}
// Illegal image check (delete when detected)
// if(is_file($full_imgfile)){
	$size = getimagesize($full_imgfile);
	if($size[0] > PMAX_W || $size[1] > PMAX_H){
		unlink($full_imgfile);
		error("A specified size violation has been detected. The image is not saved.");
		exit;
	}
	$chk = md5_file($full_imgfile);
	foreach($badfile as $value){
		if(preg_match("/^$value/",$chk)){
			unlink($full_imgfile);
			error("A rejected image was detected. The image is not saved.");
			exit;
		}
	}
// }

// Extract the length of the PCH file
$pchLength = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength, 8);
// get hedder
$h = substr($buffer, 0, 1);
// Extension setting

if($h=='S'){
//	if(!strstr($u_agent,'Shi-Painter/')){
//		unlink($full_imgfile);
//		error("UA error. The image is not saved.");
//		exit;
//	}
	$ext = '.spch';
}else{
//	if(!strstr($u_agent,'PaintBBS/')){
//		unlink($full_imgfile);
//		error("UA error. The image is not saved.");
//		exit;
//	}
	$ext = '.pch';
}

if($pchLength){
	// get PCH file
	$PCHdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength + 8, $pchLength);
	// Check the file with the same name exists
	if(is_file(TEMP_DIR.$imgfile.$ext)){
		error("A PCH file with the same name exists. Overwrite.");
	}
	// Write PCH data to a file
	$fp = fopen(TEMP_DIR.$imgfile.$ext,"wb");
	if(!$fp){
		error("Failed to open the PCH file. PCH is not saved.");
		exit;
	}else{
		flock($fp, LOCK_EX);
		fwrite($fp, $PCHdata);
		fflush($fp);
		flock($fp, LOCK_UN);
		fclose($fp);
	}
}

/* ---------- Poster information record ---------- */
$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
// Extract extension header
$sendheader = substr($buffer, 1 + 8, $headerLength);
if($sendheader){
	$sendheader = str_replace("&amp;", "&", $sendheader);
	$query_str = explode("&", $sendheader);
	foreach($query_str as $query_s){
		list($name,$value) = explode("=", $query_s);
		$u[$name] = $value;
	}
	$usercode = isset($u['usercode']) ? $u['usercode'] : '';
	$repcode = isset($u['repcode']) ? $u['repcode'] : '';
	$stime = isset($u['stime']) ? $u['stime'] : '';
	$resto = isset($u['resto']) ? $u['resto'] : '';
	// Add usercode, Replacement recognition code, drawing start time, completion time, and response destination 
	$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto";
}
$userdata .= "\n";
if(is_file(TEMP_DIR.$imgfile.".dat")){
	error("An information file with the same name exists. Overwrite.");
}
// Write information data to file
$fp = fopen(TEMP_DIR.$imgfile.".dat","w");
if(!$fp){
	error("Failed to open the information file. Poster information is not recorded.");
	exit;
}else{
	flock($fp, LOCK_EX);
	// fwrite($fp, $userdata);
	fwrite($fp, $userdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	chmod(TEMP_DIR.$imgfile.'.dat',0600);
}

die("ok");


