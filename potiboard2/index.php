<?php
include(__DIR__.'/config.php');
if(!defined('PERMISSION_FOR_DEST')){//config.phpで未定義なら0606
	define('PERMISSION_FOR_DEST', 0606);
}
header('location: '.PHP_SELF);
	chmod('index.php',PERMISSION_FOR_DEST);
	unlink('index.php');

