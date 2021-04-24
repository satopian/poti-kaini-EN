<?php
//----------------------------------------------------------------------
// picpost.php lot.210217  by SakaQ >> http://www.punyu.net/php/
// & POTI改 >> https://pbbs.sakura.ne.jp/poti/
//
// しぃからPOSTされたお絵かき画像をTEMPに保存
//
// このスクリプトはPaintBBS（藍珠CGI）のPNG保存ルーチンを参考に
// PHP用に作成したものです。
//----------------------------------------------------------------------
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
// 2018/06/14 軽微なエラー修正
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

/* ---------- picpost.php用設定 ---------- */
// システムログファイル名
$syslog = isset($syslog) ? $syslog : "picpost.systemlog";
//システムログ保存件数
$syslogmax = isset($syslogmax) ? $syslogmax :'100';

defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606

//タイムゾーン config.phpで未定義ならAsia/Tokyo
defined('DEFAULT_TIMEZONE') or define('DEFAULT_TIMEZONE','Asia/Tokyo');
date_default_timezone_set(DEFAULT_TIMEZONE);

//容量違反チェックをする する:1 しない:0
define('SIZE_CHECK', '1');
//投稿容量制限 KB
define('PICPOST_MAX_KB', '3072');//3MBまで

$time = time();
$imgfile = $time.substr(microtime(),2,3);	//画像ファイル名

/* エラー発生時にSystemLOGにエラーを記録 */
function error($error){
	global $imgfile,$syslog,$syslogmax;
	$time = time();
	$youbi = array('日','月','火','水','木','金','土');
	$yd = $youbi[date("w", $time)] ;
	$now = date("y/m/d",$time)."(".(string)$yd.")".date("H:i",$time);
	if(!is_file($syslog)){//$syslogがなければ作成
		file_put_contents($syslog,"\n", LOCK_EX);
		chmod($syslog,PERMISSION_FOR_DEST);
	}
	$ep = fopen($syslog , "r+") or die($syslog."が開けません");
	flock($ep, LOCK_EX);
	rewind($ep);
	$key=0;
	while($line=fgets($ep,4096)){//ログを配列に
		if($line!==''){
		$lines[$key]=$line;
	}
	++$key;
	if($key>($syslogmax-2)){//記録上限
	break;
	}
	}
	$line=implode('',$lines);//これまでのエラー情報
	$newline=$imgfile."  ".$error." [".$now."]\n";//最新のエラー情報
	$newline.=$line;//最新とこれまでをまとめる
	rewind($ep);
	fwrite($ep,$newline);
	fflush($ep);
	flock($ep, LOCK_UN);
	fclose($ep);
}

/* ■■■■■ メイン処理 ■■■■■ */

$u_ip = getenv("HTTP_CLIENT_IP");
if(!$u_ip) $u_ip = getenv("HTTP_X_FORWARDED_FOR");
if(!$u_ip) $u_ip = getenv("REMOTE_ADDR");
$u_host = gethostbyaddr($u_ip);
$u_agent = getenv("HTTP_USER_AGENT");
$u_agent = str_replace("\t", "", $u_agent);

//raw POST データ取得
$buffer = file_get_contents('php://input');
if(!$buffer){
	error("データの取得に失敗しました。お絵かき画像は保存されません。");
	exit;
}

// 拡張ヘッダー長さを獲得
$headerLength = substr($buffer, 1, 8);
// 画像ファイルの長さを取り出す
$imgLength = substr($buffer, 1 + 8 + $headerLength, 8);
// 投稿容量制限を超えていたら保存しない
if(SIZE_CHECK && ($imgLength > PICPOST_MAX_KB * 1024)){
	error("規定容量オーバー。お絵かき画像は保存されません。");
	exit;
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
$full_imgfile = TEMP_DIR.$imgfile.$imgext;
// 同名のファイルが存在しないかチェック
if(is_file($full_imgfile)){
	error("同名の画像ファイルが存在します。上書きします。");
}
// 画像データをファイルに書き込む
$fp = fopen($full_imgfile,"wb");
if(!$fp){
	error("画像ファイルのオープンに失敗しました。お絵かき画像は保存されません。");
	exit;
}else{
	flock($fp, LOCK_EX);
	fwrite($fp, $imgdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
}
// 不正画像チェック(検出したら削除)
// if(is_file($full_imgfile)){
	$size = getimagesize($full_imgfile);
	if($size[0] > PMAX_W || $size[1] > PMAX_H){
		unlink($full_imgfile);
		error("規定サイズ違反を検出しました。画像は保存されません。");
		exit;
	}
	$chk = md5_file($full_imgfile);
	if(isset($badfile)&&is_array($badfile)){
		foreach($badfile as $value){
			if(preg_match("/^$value/",$chk)){
				unlink($full_imgfile);
				error("拒絶画像を検出しました。画像は保存されません。");
				exit;
			}
		}
	}
// }

// PCHファイルの長さを取り出す
$pchLength = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength, 8);
// ヘッダーを獲得
$h = substr($buffer, 0, 1);
// 拡張子設定

if($h=='S'){
//	if(!strstr($u_agent,'Shi-Painter/')){
//		unlink($full_imgfile);
//		error("UA error。画像は保存されません。");
//		exit;
//	}
	$ext = '.spch';
}else{
//	if(!strstr($u_agent,'PaintBBS/')){
//		unlink($full_imgfile);
//		error("UA error。画像は保存されません。");
//		exit;
//	}
	$ext = '.pch';
}

if($pchLength){
	// PCHイメージを取り出す
	$PCHdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength + 8, $pchLength);
	// 同名のファイルが存在しないかチェック
	if(is_file(TEMP_DIR.$imgfile.$ext)){
		error("同名のPCHファイルが存在します。上書きします。");
	}
	// PCHデータをファイルに書き込む
	$fp = fopen(TEMP_DIR.$imgfile.$ext,"wb");
	if(!$fp){
		error("PCHファイルのオープンに失敗しました。PCHは保存されません。");
		exit;
	}else{
		flock($fp, LOCK_EX);
		fwrite($fp, $PCHdata);
		fflush($fp);
		flock($fp, LOCK_UN);
		fclose($fp);
	}
}

/* ---------- 投稿者情報記録 ---------- */
$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
// 拡張ヘッダーを取り出す
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
	//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加
	$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto";
}
$userdata .= "\n";
if(is_file(TEMP_DIR.$imgfile.".dat")){
	error("同名の情報ファイルが存在します。上書きします。");
}
// 情報データをファイルに書き込む
$fp = fopen(TEMP_DIR.$imgfile.".dat","w");
if(!$fp){
	error("情報ファイルのオープンに失敗しました。投稿者情報は記録されません。");
	exit;
}else{
	flock($fp, LOCK_EX);
	fwrite($fp, $userdata);
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	chmod(TEMP_DIR.$imgfile.'.dat',PERMISSION_FOR_LOG);
}

die("ok");


