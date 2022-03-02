<?php

//設定
include(__DIR__.'/config.php');

//容量違反チェックをする する:1 しない:0
define('SIZE_CHECK', '1');
//PNG画像データ投稿容量制限KB(chiは含まない)
define('PICTURE_MAX_KB', '5120');//5MBまで
defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606
defined('CRYPT_METHOD') or define('CRYPT_METHOD','aes-128-cbc');
defined('CRYPT_IV') or define('CRYPT_IV','T3pkYxNyjN7Wz3pu');//半角英数16文字


$time = time();
$imgfile = $time.substr(microtime(),2,3);	//画像ファイル名

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

list($w,$h)=getimagesize($_FILES['picture']['tmp_name']);

$pwd = (string)filter_input(INPUT_POST, 'pwd');
$pwd=hex2bin($pwd);//バイナリに
$pwd=openssl_decrypt($pwd,CRYPT_METHOD, CRYPT_PASS, true, CRYPT_IV);//復号化
if($pwd!==$ADMIN_PASS){
	if($w > PMAX_W || $h > PMAX_H){//幅と高さ
		//規定サイズ違反を検出しました。画像は保存されません。
		die("Your picture upload failed! Please try again!");
	}
}

$success = TRUE;
$success = $success && move_uploaded_file($_FILES['picture']['tmp_name'], TEMP_DIR.$imgfile.'.png');

if (!$success) {
    die("Couldn't move uploaded files");
}
if (isset ($_FILES["psd"]) && ($_FILES['psd']['error'] == UPLOAD_ERR_OK)){
	//PSDファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
	move_uploaded_file($_FILES['psd']['tmp_name'], TEMP_DIR.$imgfile.'.psd');
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

die("ok");

