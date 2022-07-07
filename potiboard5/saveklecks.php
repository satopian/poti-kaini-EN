<?php

//設定
include(__DIR__.'/config.php');

//容量違反チェックをする する:1 しない:0
define('SIZE_CHECK', '1');
//PNG画像データ投稿容量制限KB(chiは含まない)
define('PICTURE_MAX_KB', '5120');//5MBまで
define('PSD_MAX_KB', '10240');//10MBまで。ただしサーバのPHPの設定によって2MB以下に制限される可能性があります。
defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606

$time = time();
$imgfile = time().substr(microtime(),2,6);	//画像ファイル名
$imgfile = is_file(TEMP_DIR.$imgfile.'.png') ? ((time()+1).substr(microtime(),2,6)) : $imgfile;

header('Content-type: text/plain');

if (!isset ($_FILES["picture"]) || $_FILES['picture']['error'] != UPLOAD_ERR_OK)
 {
	die("Your picture upload failed! Please try again!");
}

$usercode = (string)filter_input(INPUT_POST, 'usercode');
//csrf
if(!$usercode || $usercode !== filter_input(INPUT_COOKIE, 'usercode')){

	die("Your picture upload failed! Please try again!");
}
$rotation = isset($_POST['rotation']) && ((int) $_POST['rotation']) > 0 ? ((int) $_POST['rotation']) : 0;

if(SIZE_CHECK && ($_FILES['picture']['size'] > (PICTURE_MAX_KB * 1024))){

	die("Your picture upload failed! Please try again!");
}

if(mime_content_type($_FILES['picture']['tmp_name'])!=='image/png'){
	die("Your picture upload failed! Please try again!");
}

$success = TRUE;
$success = move_uploaded_file($_FILES['picture']['tmp_name'], TEMP_DIR.$imgfile.'.png');

if (!$success||!is_file(TEMP_DIR.$imgfile.'.png')) {
    die("Couldn't move uploaded files");
}
if (isset ($_FILES['psd']) && ($_FILES['psd']['error'] == UPLOAD_ERR_OK)){
	if(!SIZE_CHECK || ($_FILES['psd']['size'] < (PSD_MAX_KB * 1024))){
	//PSDファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
	move_uploaded_file($_FILES['psd']['tmp_name'], TEMP_DIR.$imgfile.'.psd');
	}
}

$u_ip = getenv("HTTP_CLIENT_IP");
if(!$u_ip) $u_ip = getenv("HTTP_X_FORWARDED_FOR");
if(!$u_ip) $u_ip = getenv("REMOTE_ADDR");
$u_host = gethostbyaddr($u_ip);
$u_agent = getenv("HTTP_USER_AGENT");
$u_agent = str_replace("\t", "", $u_agent);
$imgext='.png';
/* ---------- 投稿者情報記録 ---------- */
$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
$tool = (string)filter_input(INPUT_POST, 'tool');
$repcode = (string)filter_input(INPUT_POST, 'repcode');
$stime = (string)filter_input(INPUT_POST, 'stime',FILTER_VALIDATE_INT);
$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加
$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto\t$tool";
$userdata .= "\n";
// 情報データをファイルに書き込む
$fp = fopen(TEMP_DIR.$imgfile.".dat","w");
if(!$fp){
    die("Your picture upload failed! Please try again!");
}

	flock($fp, LOCK_EX);
	fwrite($fp, $userdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	chmod(TEMP_DIR.$imgfile.'.dat',PERMISSION_FOR_LOG);
	if (!is_file(TEMP_DIR.$imgfile.'.dat')) {
		die("Your picture upload failed! Please try again!");
	}

die("ok");

