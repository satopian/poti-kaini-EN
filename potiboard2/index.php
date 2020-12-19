<?php
include(__DIR__.'/config.php');
header('location: '.PHP_SELF);
	chmod('index.php',0606);
	unlink('index.php');

