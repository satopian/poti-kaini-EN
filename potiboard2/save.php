<?php

//設定
include(__DIR__.'/config.php');

//容量違反チェックをする する:1 しない:0
define('SIZE_CHECK', '1');
//PNG画像データ投稿容量制限KB(chiは含まない)
define('PICTURE_MAX_KB', '5120');//5MBまで

defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606

$time = time();
$imgfile = $time.substr(microtime(),2,3);	//画像ファイル名


function chibi_die($message) {
	die("CHIBIERROR $message");
}

if (!isset ($_FILES["picture"]) || $_FILES['picture']['error'] != UPLOAD_ERR_OK
		|| isset($_FILES['chibifile']) && $_FILES['chibifile']['error'] != UPLOAD_ERR_OK) {
	chibi_die("Your picture upload failed! Please try again!");
}

header('Content-type: text/plain');

$rotation = isset($_POST['rotation']) && ((int) $_POST['rotation']) > 0 ? ((int) $_POST['rotation']) : 0;

$success = TRUE;

if(SIZE_CHECK && ($_FILES['picture']['size'] > (PICTURE_MAX_KB * 1024))){

    chibi_die("Your picture upload failed! Please try again!");
}

list($w,$h)=getimagesize($_FILES['picture']['tmp_name']);

if($w > PMAX_W || $h > PMAX_H){//幅と高さ
	//規定サイズ違反を検出しました。画像は保存されません。
    chibi_die("Your picture upload failed! Please try again!");
}

$success = $success && move_uploaded_file($_FILES['picture']['tmp_name'], TEMP_DIR.$imgfile.'.png');

if (isset($_FILES["chibifile"])) {
	$success = $success && move_uploaded_file($_FILES['chibifile']['tmp_name'], TEMP_DIR.$imgfile.'.chi');
}

// if (isset($_FILES['swatches'])) {
//     $success = $success && move_uploaded_file($_FILES['swatches']['tmp_name'], TEMP_DIR.$imgfile.'.aco');
// }

if (!$success) {
    chibi_die("Couldn't move uploaded files");
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
// 拡張ヘッダーを取り出す

	$usercode = (string)filter_input(INPUT_GET, 'usercode');
	$repcode = (string)filter_input(INPUT_GET, 'repcode');
	$stime = (string)filter_input(INPUT_GET, 'stime',FILTER_VALIDATE_INT);
	$resto = (string)filter_input(INPUT_GET, 'resto',FILTER_VALIDATE_INT);

	//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加
	$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto";
$userdata .= "\n";
// 情報データをファイルに書き込む
$fp = fopen(TEMP_DIR.$imgfile.".dat","w");
if(!$fp){
    chibi_die("Your picture upload failed! Please try again!");
}

	flock($fp, LOCK_EX);
	fwrite($fp, $userdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	chmod(TEMP_DIR.$imgfile.'.dat',PERMISSION_FOR_LOG);


die("CHIBIOK\n");



