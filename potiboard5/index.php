<?php
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
	die("Error. PHP version 7.4.0 or higher is required for this program to work. <br>\n(Current PHP version:".PHP_VERSION.")");
}
include(__DIR__.'/config.php');
if(!defined('PERMISSION_FOR_DEST')){//config.phpで未定義なら0606
	define('PERMISSION_FOR_DEST', 0606);
}
header('location: '.PHP_SELF);
	chmod('index.php',PERMISSION_FOR_DEST);
	unlink('index.php');

