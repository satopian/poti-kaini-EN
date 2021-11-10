<?php
//----------------------------------------------------------------------
// picpost.php lot.211108  by SakaQ >> http://www.punyu.net/php/
// & POTI改 >> https://paintbbs.sakura.ne.jp/poti/
//
// しぃからPOSTされたお絵かき画像をTEMPに保存
//
// このスクリプトはPaintBBS（藍珠CGI）のPNG保存ルーチンを参考に
// PHP用に作成したものです。
//----------------------------------------------------------------------
// 2021/11/08 CSRF対策にusercodeを使用。cookieが確認できない場合は画像を保存しない。
// 2021/10/31 エラー発生時は、ユーザーのキャンバスにエラー内容が表示されるためシステムログへのエラーログの保存処理を削除した。
// 2021/05/17 エラーが発生した時はお絵かき画面から移動せず、エラーの内容を表示する。
// 2021/02/17 $badfileが未定義の時は拒絶画像の処理をしない。
// 2021/01/30 picpost.systemlogの設定をpicpost.phpに移動。raw POST データ取得処理を整理。
// 2021/01/01 エラーログのパーミッションもconfig.phpで設定できるようにした。
// 2020/12/20 config.phpでパーミッションを設定できるようにした。
// 2020/12/18 php8対応。画像から続きを描くと投稿できなくなる問題を修正。
// 2020/11/16 lot.201110の投稿完了時間が記録されないバグを修正。
// 2020/11/10 レス先の記録に対応。拡張ヘッダの値の取得を可変変数から連想配列に変更。
// 2020/08/28 描画時間の記録に対応
// 2020/05/25 投稿容量制限の設定項目を追加 従来はconfigのMAX_KB
// 2020/02/25 flock()修正タイムゾーンを'Asia/Tokyo'に
// 2020/01/25 REMOTE_ADDRが取得できないサーバに対応
// 2019/12/03 軽微なエラー修正。datファイルのパーミッションを600に
// 2018/07/13 動画が記録できなくなっていたのを修正
// 2018/01/12 php7対応
// 2005/06/04 容量違反・画像サイズ違反・拒絶画像のチェックを追加
// 2005/02/14 差し換え時の認識コードrepcodeを投稿者情報に追加
// 2004/06/22 ユーザーを識別するusercodeを投稿者情報に追加
// 2003/12/22 JPEG対応
// 2003/10/03 しぃペインターに対応
// 2003/09/10 IPアドレス取得方法変更
// 2003/09/09 PCHファイルに対応.投稿者情報の記録機能追加
// 2003/09/01 PHP風(?)に整理
// 2003/08/28 perl -> php 移植  by TakeponG >> https://chomstudio.com/
// 2003/07/11 perl版初公開

//設定
include(__DIR__.'/config.php');
$lang = ($http_langs = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '')
  ? explode( ',', $http_langs )[0] : '';

if($lang==="ja"){//ブラウザの言語が日本語の時
	$errormsg_1 = "データの取得に失敗しました。時間を置いて再度投稿してみて下さい。";
	$errormsg_2 = "規定容量オーバー。お絵かき画像は保存されません。";
	$errormsg_3 = "画像ファイルの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
	$errormsg_4 = "規定サイズ違反を検出しました。お絵かき画像は保存されません。";
	$errormsg_5 = "不正な画像を検出しました。お絵かき画像は保存されません。";
	$errormsg_6 = "PCHファイルの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
	$errormsg_7 = "ユーザーデータの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
}else{//それ以外
	$errormsg_1 = "Failed to get data. Please try posting again after a while.";
	$errormsg_2 = "The size of the picture is too big. The drawing image is not saved.";
	$errormsg_3 = "Failed to create the image file. Please try posting again after a while.";
	$errormsg_4 = "The size of the picture too large.drawng image will not be saved.";
	$errormsg_5 = "There was an illegal image. The drawng image is not saved.";
	$errormsg_6 = "Failed to open PCH file. Please try posting again after a while.";
	$errormsg_7 = "Failed to create user data. Please try posting again after a while.";
}

/* ---------- picpost.php用設定 ---------- */

defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606

//容量違反チェックをする する:1 しない:0
define('SIZE_CHECK', '1');
//投稿容量制限 KB
define('PICPOST_MAX_KB', '5120');//5MBまで

$time = time();
$imgfile = $time.substr(microtime(),2,3);	//画像ファイル名

/* ■■■■■ メイン処理 ■■■■■ */

$u_ip = getenv("HTTP_CLIENT_IP");
if(!$u_ip) $u_ip = getenv("HTTP_X_FORWARDED_FOR");
if(!$u_ip) $u_ip = getenv("REMOTE_ADDR");
$u_host = gethostbyaddr($u_ip);
$u_agent = getenv("HTTP_USER_AGENT");
$u_agent = str_replace("\t", "", $u_agent);

header('Content-type: text/plain');
//raw POST データ取得
$buffer = file_get_contents('php://input');
if(!$buffer){
	//データの取得に失敗しました。お絵かき画像は保存されません。
	die("error\n{$errormsg_1}");
}

// 拡張ヘッダー長さを獲得
$headerLength = substr($buffer, 1, 8);
// 画像ファイルの長さを取り出す
$imgLength = substr($buffer, 1 + 8 + $headerLength, 8);
// 投稿容量制限を超えていたら保存しない
if(SIZE_CHECK && ($imgLength > PICPOST_MAX_KB * 1024)){
	//規定容量オーバー。お絵かき画像は保存されません。
	die("error\n{$errormsg_2}");
}
// 画像イメージを取り出す
$imgdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2, $imgLength);
// 画像ヘッダーを獲得
$imgh = substr($imgdata, 1, 5);
// 拡張子設定
if($imgh=="PNG\r\n"){
	$imgext = '.png';	// PNG
}else{
	$imgext = '.jpg';	// JPEG
}
/* ---------- 投稿者情報記録 ---------- */
$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
// 拡張ヘッダーを取り出す
$sendheader = substr($buffer, 1 + 8, $headerLength);
if($sendheader){
	$sendheader = str_replace("&amp;", "&", $sendheader);
	parse_str($sendheader, $u);
	$usercode = isset($u['usercode']) ? $u['usercode'] : '';
	$resto = isset($u['resto']) ? $u['resto'] : '';
	$repcode = isset($u['repcode']) ? $u['repcode'] : '';
	$stime = isset($u['stime']) ? $u['stime'] : '';
	//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加
	$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto";
}
$userdata .= "\n";

//CSRF
if(!$usercode || $usercode !== filter_input(INPUT_COOKIE, 'usercode')){
	die("error\n{$errormsg_1}");
}

$full_imgfile = TEMP_DIR.$imgfile.$imgext;
// 画像データをファイルに書き込む
$fp = fopen($full_imgfile,"wb");
if(!$fp){
	//画像ファイルの作成に失敗しました。お絵かき画像は保存されません。
	die("error\n{$errormsg_3}");
}else{
	flock($fp, LOCK_EX);
	fwrite($fp, $imgdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
}
// 不正画像チェック(検出したら削除)
	$size = getimagesize($full_imgfile);
	if($size[0] > PMAX_W || $size[1] > PMAX_H){
		unlink($full_imgfile);
		//規定サイズ違反を検出しました。画像は保存されません。
		die("error\n{$errormsg_4}");
	}
	$chk = md5_file($full_imgfile);
	if(isset($badfile)&&is_array($badfile)){
		foreach($badfile as $value){
			if(preg_match("/^$value/",$chk)){
				unlink($full_imgfile);
				// 不正な画像を検出しました。画像は保存されません。
				die("error\n{$errormsg_5}");
			}
		}
	}

// PCHファイルの長さを取り出す
$pchLength = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength, 8);
// ヘッダーを獲得
$h = substr($buffer, 0, 1);
// 拡張子設定

if($h=='S'){
	$ext = '.spch';
}else{
	$ext = '.pch';
}

if($pchLength){
	// PCHイメージを取り出す
	$PCHdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength + 8, $pchLength);
	// PCHデータをファイルに書き込む
	$fp = fopen(TEMP_DIR.$imgfile.$ext,"wb");
	if(!$fp){
		//PCHファイルの作成に失敗しました。PCHは保存されません。
		die("error\n{$errormsg_6}");
	}else{
		flock($fp, LOCK_EX);
		fwrite($fp, $PCHdata);
		fflush($fp);
		flock($fp, LOCK_UN);
		fclose($fp);
	}
}

// 情報データをファイルに書き込む
$fp = fopen(TEMP_DIR.$imgfile.".dat","w");
if(!$fp){
	//情報ファイルの作成に失敗しました。投稿者情報は記録されません。
	die("error\n{$errormsg_7}");
}else{
	flock($fp, LOCK_EX);
	fwrite($fp, $userdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	chmod(TEMP_DIR.$imgfile.'.dat',PERMISSION_FOR_LOG);
}

die("ok");
