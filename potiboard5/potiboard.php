<?php
// ini_set('error_reporting', E_ALL);

// POTI-board EVO
// バージョン :
const POTI_VER = 'v6.16.7';
const POTI_LOT = 'lot.20231201';

/*
  (C) 2018-2023 POTI改 POTI-board redevelopment team
  >> https://paintbbs.sakura.ne.jp/poti/
  *----------------------------------------------------------------------------------
  * ORIGINAL SCRIPT
  *   POTI-board v1.32
  *     (C)SakaQ >> http://www.punyu.net/php/
  *   futaba.php v0.8 lot.031015 (gazou.php v3.0 CUSTOM)
  *     (C)futaba >> http://www.2chan.net/ ((C)ToR >> http://php.loglog.jp/)
  *
  * OEKAKI APPLET :
  *   PaintBBS   (test by v2.22_8)
  *   ShiPainter (test by v1.071all)
  *   PCHViewer  (test by v1.12)
  *     (C)shi-chan >> http://hp.vector.co.jp/authors/VA016309/
  *
  * PaintBBS NEO
  *     (C)funige >> https://github.com/funige/neo/
  *
  * USE FUNCTION :
  *   BladeOne              (C) Jorge Patricio Castro Castillo   >> https://github.com/EFTEC/BladeOne
  *   DynamicPalette        (C)NoraNeko  >> WonderCatStudio
  *----------------------------------------------------------------------------------

このスクリプトは「レッツPHP!」<http://php.loglog.jp/>のgazou.phpを改造した、
「ふたば★ちゃんねる」<http://www.2chan.net/>のfutaba.phpを
さらにお絵かきもできるようにして、HTMLテンプレートでデザイン変更できるように改造した
「ぷにゅねっと」<http://www.punyu.net/php/>のPOTI-boardを、
さらにphp7で動くように改造したものです。

配布条件はレッツPHP!に準じます。改造、再配布は自由にどうぞ。

このスクリプトの改造部分に関する質問は「レッツPHP!」
「ふたば★ちゃんねる」「ぷにゅねっと」に問い合わせないでください。
ご質問は、<https://paintbbs.sakura.ne.jp/poti/>までどうぞ。
*/
$en=lang_en();
if (version_compare(PHP_VERSION, '7.2.5', '<')) {
	die($en? "Error. PHP version 7.2.5 or higher is required for this program to work. <br>\n(Current PHP version:".PHP_VERSION.")":
		"エラー。本プログラムの動作には PHPバージョン 7.2.5 以上が必要です。<br>\n(現在のPHPバージョン：".PHP_VERSION.")"
	);
}

const JQUERY ='jquery-3.7.0.min.js';
if ($err = check_file(__DIR__.'/lib/'.JQUERY)) {
	die($err);
}
// luminous
if ($err = check_file(__DIR__.'/lib/luminous/luminous.min.js')) {
	die($err);
}
if ($err = check_file(__DIR__.'/lib/luminous/luminous-basic.min.css')) {
	die($err);
}

//設定の読み込み
if ($err = check_file(__DIR__.'/config.php')) {
	die($err);
}
require(__DIR__.'/config.php');

defined('USE_CHEERPJ_OLD_VERSION') or define('USE_CHEERPJ_OLD_VERSION',"1"); 

if(USE_CHEERPJ_OLD_VERSION){//2.3
	define('CHEERPJ_URL','https://cjrtnc.leaningtech.com/2.3/loader.js');
	define('CHEERPJ_HASH','sha384-1s6C2I0gGJltmNWfLfzHgXW5Dj4JB4kQTpnS37fU6CaQR/FrYG219xbhcAFRcHKE');
}else{//cj3
	define('CHEERPJ_URL','https://cjrtnc.leaningtech.com/3_20231116_296/cj3loader.js');
	define('CHEERPJ_HASH','sha384-3n3kvrYMpzHCXBmGKdDxBRXElXGWgc79N49R1ARvHPUTbfCVHpUbfyL5Fy20BL2Z');
}
// $ cat FILENAME.js | openssl dgst -sha384 -binary | openssl base64 -A
// https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity

//BladeOne
if ($err = check_file(__DIR__.'/BladeOne/lib/BladeOne.php')) {
	die($err);
}

require_once __DIR__.'/BladeOne/lib/BladeOne.php';

Use eftec\bladeone\BladeOne;

//Template設定ファイル
if ($err = check_file(__DIR__.'/templates/'.SKIN_DIR.'template_ini.php')) {
	die($err);
}
require(__DIR__.'/templates/'.SKIN_DIR.'template_ini.php');

//サムネイルfunction
if ($err = check_file(__DIR__.'/thumbnail_gd.php')) {
	die($err);
}
require(__DIR__.'/thumbnail_gd.php');
//SNS共有Class
if ($err = check_file(__DIR__.'/sns_share.inc.php')) {
	die($err);
}
require(__DIR__.'/sns_share.inc.php');
//検索Class
if ($err = check_file(__DIR__.'/search.inc.php')) {
	die($err);
}
require(__DIR__.'/search.inc.php');
//画像保存Class
if ($err = check_file(__DIR__.'/save.inc.php')) {
	die($err);
}
require(__DIR__.'/save.inc.php');

if($save_inc_ver < 20231106){
die($en ? "Please update save.inc.php" : "save.inc.phpを更新してください。");
}
$path = __DIR__.'/'.IMG_DIR;
$temppath = __DIR__.'/'.TEMP_DIR;

//POTI_VERLOT定義
define("POTI_VERLOT", POTI_VER." ".POTI_LOT);

//ユーザー削除権限 (0:不可 1:treeのみ許可 2:treeと画像のみ許可 3:tree,log,画像全て許可)
//※treeのみを消して後に残ったlogは管理者のみ削除可能
define("USER_DELETES", "3");

//メール通知クラスのファイル名
define("NOTICEMAIL_FILE" , "noticemail.inc");

//タイムゾーン
defined("DEFAULT_TIMEZONE") or define("DEFAULT_TIMEZONE","Asia/Tokyo");
date_default_timezone_set(DEFAULT_TIMEZONE);

//ペイント画面の$pwdの暗号化
defined("CRYPT_PASS") or define("CRYPT_PASS","qRyFfhV6nyUggSb");//暗号鍵初期値
define("CRYPT_METHOD","aes-128-cbc");
define("CRYPT_IV","T3pkYxNyjN7Wz3pu");//半角英数16文字

//指定した日数を過ぎたスレッドのフォームを閉じる
defined("ELAPSED_DAYS") or define("ELAPSED_DAYS","0");

//テーマに設定が無ければ代入
defined("DEF_FONTCOLOR") or define("DEF_FONTCOLOR","");//色選択
defined("ADMIN_DELGUSU") or define("ADMIN_DELGUSU","");//管理画面の色設定
defined("ADMIN_DELKISU") or define("ADMIN_DELKISU","");//管理画面の色設定

//画像アップロード機能を 1.使う 0.使わない  
defined("USE_IMG_UPLOAD") or define("USE_IMG_UPLOAD","1");

//画像のないコメントのみの新規投稿を拒否する する:1 しない:0
defined("DENY_COMMENTS_ONLY") or define("DENY_COMMENTS_ONLY", "0");

//パレット切り替え機能を使用する する:1 しない:0
defined("USE_SELECT_PALETTES") or define("USE_SELECT_PALETTES", "0");

//編集しても投稿日時を変更しないようにする する:1 しない:0 
defined("DO_NOT_CHANGE_POSTS_TIME") or define("DO_NOT_CHANGE_POSTS_TIME", "0");

//マークダウン記法のリンクをHTMLに する:1 しない:0
defined("MD_LINK") or define("MD_LINK", "0");

//PaintBBS NEOを使う 使う:1 使わない:0 
defined("USE_PAINTBBS_NEO") or define("USE_PAINTBBS_NEO", "1");
//しぃペインターを使う 使う:1 使わない:0 
defined("USE_SHI_PAINTER") or define("USE_SHI_PAINTER", "1");
//ChickenPaintを使う 使う:1 使わない:0 
defined("USE_CHICKENPAINT") or define("USE_CHICKENPAINT", "1");
//Klecksを使う 使う:1 使わない:0
defined("USE_KLECKS") or define("USE_KLECKS", "1");
defined("PAINT_KLECKS") or define("PAINT_KLECKS", "paint_klecks");
//Klecksを使う 使う:1 使わない:0
defined("USE_TEGAKI") or define("USE_TEGAKI", "1");
defined("PAINT_TEGAKI") or define("PAINT_TEGAKI", "paint_tegaki");
defined("TGKR_VIEW") or define("TGKR_VIEW", "tgkr_view");
defined("SET_SHARE_SERVER") or define("SET_SHARE_SERVER", "set_share_server");

//レス画像から新規投稿で続きを描いた画像はレスにする する:1 しない:0
defined("RES_CONTINUE_IN_CURRENT_THREAD") or define("RES_CONTINUE_IN_CURRENT_THREAD", "1");
//レス画面に前後のスレッドの画像を表示する する:1 しない:0
defined("VIEW_OTHER_WORKS") or define("VIEW_OTHER_WORKS", "1");
//日記モードで使用する する:1 しない:0
defined("DIARY") or define("DIARY", "0");
defined("X_FRAME_OPTIONS_DENY") or define("X_FRAME_OPTIONS_DENY", "1");
//管理者パスワードを5回連続で間違えたときはロック する:1 しない:0
defined("CHECK_PASSWORD_INPUT_ERROR_COUNT") or define("CHECK_PASSWORD_INPUT_ERROR_COUNT", "0");
//管理者は設定に関わらすべてのアプリを使用できるようにする する:1 しない:0
defined("ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS") or define("ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS", "1");
//URL入力欄を使用する する:1 しない:0
defined("USE_URL_INPUT_FIELD") or define("USE_URL_INPUT_FIELD", "1");
defined("SWITCH_SNS") or define("SWITCH_SNS", "1");
defined("SNS_WINDOW_WIDTH") or define("SNS_WINDOW_WIDTH","350");
defined("SNS_WINDOW_HEIGHT") or define("SNS_WINDOW_HEIGHT","490");
defined("USE_ADMIN_LINK") or define("USE_ADMIN_LINK","1");
defined("CATALOG_PAGE_DEF") or define("CATALOG_PAGE_DEF",30);
//お絵かきできる最小の幅と高さ
defined("PMIN_W") or define("PMIN_W", "300"); //幅
defined("PMIN_H") or define("PMIN_H", "300"); //高さ
//アップロード時の幅と高さの最大サイズ これ以上は縮小
defined("MAX_W_PX") or define("MAX_W_PX", "1024"); //高さ
defined("MAX_H_PX") or define("MAX_H_PX", "1024"); //高さ

$badurl= isset($badurl) ? $badurl : [];//拒絶するurl

//パーミッション

defined("PERMISSION_FOR_DEST") or define("PERMISSION_FOR_DEST", 0606);
defined("PERMISSION_FOR_LOG") or define("PERMISSION_FOR_LOG", 0600);
defined("PERMISSION_FOR_DIR") or define("PERMISSION_FOR_DIR", 0707);

//メッセージ
//template_ini.phpで未定義の時の初期値
//このままでよければ定義不要
defined("HONORIFIC_SUFFIX") or define("HONORIFIC_SUFFIX", "さん");
defined("UPLOADED_OBJECT_NAME") or define("UPLOADED_OBJECT_NAME", "画像");
defined("UPLOAD_SUCCESSFUL") or define("UPLOAD_SUCCESSFUL", "のアップロードが成功しました");
defined("THE_SCREEN_CHANGES") or define("THE_SCREEN_CHANGES", "画面を切り替えます");
defined("MSG044") or define("MSG044", "最大ログ数が設定されていないか、数字以外の文字列が入っています。");
defined("MSG045") or define("MSG045", "アップロードペイントに対応していないファイルです。<br>対応フォーマットはpch、spch、chiです。");
defined("MSG046") or define("MSG046", "パスワードが短すぎます。最低6文字。");
defined("MSG047") or define("MSG047", "画像の幅と高さが大きすぎるため続行できません。");
defined("MSG048") or define("MSG048", "不適切なURLがあります。");
defined("MSG049") or define("MSG049", "拒絶されました。");
defined("MSG050") or define("MSG050", "Cookieが確認できません。");

$ADMIN_PASS=isset($ADMIN_PASS) ? $ADMIN_PASS : false; 
if(!$ADMIN_PASS){
	error(MSG040);
}

if(!defined('LOG_MAX')|| !LOG_MAX || !is_numeric(LOG_MAX)){
	error(MSG044);
}

if(X_FRAME_OPTIONS_DENY){
	header('X-Frame-Options: DENY');//フレーム内への表示を拒否
}

//INPUT_POSTから変数を取得

$mode = (string)filter_input(INPUT_POST, 'mode');
$mode = $mode ? $mode : (string)filter_input(INPUT_GET, 'mode');
$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
$type = (string)newstring(filter_input(INPUT_POST, 'type'));
$admin = (string)filter_input(INPUT_POST, 'admin');
$pass = (string)newstring(filter_input(INPUT_POST, 'pass'));

//INPUT_GETから変数を取得

$res = (string)filter_input(INPUT_GET, 'res',FILTER_VALIDATE_INT);

//INPUT_COOKIEから変数を取得

$usercode = (string)filter_input(INPUT_COOKIE, 'usercode');//nullならuser-codeを発行

//初期化
init();	
//テンポラリ
deltemp();

//user-codeの発行
if(!$usercode){//user-codeがなければ発行
	$userip = get_uip();
	$usercode = (string)substr(crypt(md5($userip.ID_SEED.uniqid()),'id'),-12);
	//念の為にエスケープ文字があればアルファベットに変換
	$usercode = strtr($usercode,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~\t","ABCDEFGHIJKLMNOabcdefghijklmno");
}
setcookie("usercode", $usercode, time()+(86400*365),"","",false,true);//1年間

switch($mode){
	case 'regist':
		if(DIARY && !$resto){
			if($pwd && ($pwd !== $ADMIN_PASS)){
				return error(MSG029);
			}
			$admin=$pwd;
		}
		return regist();
	case 'admin':

		if(!$pass){
			$dat['admin_in'] = true;
			return htmloutput(OTHERFILE,$dat);
		}
		check_same_origin(true);
		check_password_input_error_count();
		if($pass && ($pass !== $ADMIN_PASS)) 
		return error(MSG029);
	
		if($admin==="del") return admindel($pass);
		if($admin==="post"){
			$dat['post_mode'] = true;
			$dat['regist'] = true;
			$dat = array_merge($dat,form($res));
			$dat = array_merge($dat,form_admin_in('valid'));
			return htmloutput(OTHERFILE,$dat);
		}
		if($admin==="update"){
			updatelog();
			return redirect(h(PHP_SELF2), 0);
		}
		return;

	case 'usrdel':
		if (!USER_DELETES) {
			return error(MSG033);
		}
		userdel();
	case 'paint':
		return paintform();
	case 'piccom':
		return paintcom();
	case 'openpch':
		return openpch();
	case 'continue':
		return incontinue();
	case 'contpaint':
		//パスワードが必要なのは差し換えの時だけ
		if(CONTINUE_PASS||$type==='rep') check_cont_pass();
		return paintform();
	case 'newpost':
		$dat['post_mode'] = true;
		$dat['regist'] = true;
		$dat = array_merge($dat,form());
		return htmloutput(OTHERFILE,$dat);
	case 'edit':
		return editform();
	case 'rewrite':
		return rewrite();
	case 'picrep':
		return replace();
	case 'catalog':
		return catalog();
	case 'search':
		return processsearch::search();
	case 'download':
		return download_app_dat();
	case 'set_share_server':
		return sns_share::set_share_server();
	case 'post_share_server':
		return sns_share::post_share_server();
	case 'saveimage':
		return saveimage();
	default:
		if($res){
			return res($res);
		}
		return redirect(h(PHP_SELF2), 0);
}

exit;

//GD版が使えるかチェック
function gd_check(){
	$check = array("ImageCreate","ImageCopyResized","ImageCreateFromJPEG","ImageJPEG","ImageDestroy");

	//最低限のGD関数が使えるかチェック
	if(!(get_gd_ver() && (ImageTypes() & IMG_JPG))){
		return false;
	}
	foreach ( $check as $cmd ) {
		if(!function_exists($cmd)){
			return false;
		}
	}
	return true;
}

//gdのバージョンを調べる
function get_gd_ver(){
	if(function_exists("gd_info")){
	$gdver=gd_info();
	$phpinfo=(string)$gdver["GD Version"];
	$end=strpos($phpinfo,".");
	$phpinfo=substr($phpinfo,0,$end);
	$length = strlen($phpinfo)-1;
	$phpinfo=substr($phpinfo,$length);
	return $phpinfo;
	} 
	return false;
}

//ユーザーip
function get_uip(){
	$ip = isset($_SERVER["HTTP_CLIENT_IP"]) ? $_SERVER["HTTP_CLIENT_IP"] :'';
	$ip = $ip ? $ip : (isset($_SERVER["HTTP_INCAP_CLIENT_IP"]) ? $_SERVER["HTTP_INCAP_CLIENT_IP"] : '');
	$ip = $ip ? $ip : (isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : '');
	$ip = $ip ? $ip : (isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : '');
	if (strstr($ip, ', ')) {
		$ips = explode(', ', $ip);
		$ip = $ips[0];
	}
	return $ip;
}

//session開始
function session_sta(){
	if(!isset($_SESSION)){
		session_set_cookie_params(
			0,"","",false,true
		);
		session_start();
		header('Expires:');
		header('Cache-Control:');
		header('Pragma:');
	}
}

//csrfトークンを作成
function get_csrf_token(){
	session_sta();
	$token = hash('sha256', session_id(), false);
	$_SESSION['token']=$token;
	return $token;
}
//csrfトークンをチェック	
function check_csrf_token(){

	check_same_origin(true);
	session_sta();
	$token=(string)filter_input(INPUT_POST,'token');
	$session_token=isset($_SESSION['token']) ? $_SESSION['token'] : '';
	if(!$session_token||$token!==$session_token){
		error(MSG006);
	}
}
function check_same_origin($cookie_check=false){

	$usercode = (string)filter_input(INPUT_COOKIE, 'usercode');
	if($cookie_check && !$usercode){
		error(MSG050);
	}
	if(isset($_SERVER['HTTP_ORIGIN']) && isset($_SERVER['HTTP_HOST']) && (parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST) !== $_SERVER['HTTP_HOST'])){
		error(MSG049);
	}
}

// ベース
function basicpart(){
	global $pallets_dat,$resno;
	
	$dat['title'] = TITLE;
	$dat['encoded_title'] = urlencode(TITLE);
	$dat['home']  = HOME;
	$dat['self']  = PHP_SELF;
	$dat['encoded_self'] = urlencode(PHP_SELF);
	$dat['self2'] = h(PHP_SELF2).(URL_PARAMETER ? '?'.time():'');
	$dat['ver'] = POTI_VER;
	$dat['verlot'] = POTI_VERLOT;
	$dat['tver'] = TEMPLATE_VER;
	$dat['userdel'] = USER_DELETES;
	$dat['charset'] = 'UTF-8';
	$dat['skindir'] = 'templates/'.SKIN_DIR;
	$dat['for_new_post'] = (!USE_IMG_UPLOAD && DENY_COMMENTS_ONLY||DIARY) ? false : true;
	$dat['diary'] = DIARY ? true : false;
	$dat['switch_sns'] = SWITCH_SNS;
	$dat['sns_window_width'] = (int)SNS_WINDOW_WIDTH;
	$dat['sns_window_height'] = (int)SNS_WINDOW_HEIGHT;
	$dat['is_IE'] = isIE();
	$dat['use_admin_link'] = USE_ADMIN_LINK;
	
	//OGPイメージ シェアボタン
	$dat['rooturl'] = ROOT_URL;//設置場所url
	$dat['encoded_rooturl'] = urlencode(ROOT_URL);//設置場所url
	$dat['sharebutton'] = SHARE_BUTTON ? true : false;
	$dat['use_select_palettes']=false;
	$dat['palette_select_tags']='';
	if(USE_SELECT_PALETTES){
		$dat['use_select_palettes']=true;
		foreach($pallets_dat as $i=>$value){
			if(is_array($value)){
				list($p_name,$p_dat)=$value;
			}else{
				$p_name=$i;
			}
			$arr_palette_select_tags[$i]='<option value="'.$i.'">'.h($p_name).'</option>';
		}
		$dat['palette_select_tags']=implode("",$arr_palette_select_tags);
	}
	$dat['_san']=HONORIFIC_SUFFIX;
	$dat['jquery']=JQUERY;
	$dat['cheerpj_url']=CHEERPJ_URL;
	$dat['cheerpj_hash']=CHEERPJ_HASH;
	$dat['n']=false;//コメント行
	//言語
	$dat['en']=lang_en();
	//初期化 PHP8.1 OTHERFILE
	$keys=['resform','post_mode','paint','rewrite','admin','admin_in','admin_del','pass','regist','mes','err_mode','resno','pictmp','notmp','ptime','name','email','url','sub','com','ipcheck','tmp','thread_no','logfilename','mode_catalog','catalog_pageno'];
	foreach($keys as $key){
		$dat[$key]=false;	
	}

	return $dat;
}

// 投稿フォーム 
function form($resno="",$tmp=""){
	global $addinfo;
	global $fontcolors,$qualitys;
	global $ADMIN_PASS;

	//csrfトークンをセット
	$dat['token']= get_csrf_token();

	$quality = filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);

	$dat['form'] = $resno ? true : false;

	$arr_apps=app_to_use();
	$count_arr_apps=count($arr_apps);
	$dat['paint'] = ((USE_PAINT && !empty($count_arr_apps)) ? true : false);
	$dat['paint2'] = $dat['paint'] ? ($resno ? false : true):false;
	$dat['select_app'] =($count_arr_apps>1);//複数のペイントアプリを使う時
	$dat['app_to_use'] =(($count_arr_apps===1) ? $arr_apps[0] : false);	//ペイントアプリが1種類の時
	$dat['use_neo'] = (USE_PAINTBBS_NEO ? true : false);
	$dat['use_shi_painter'] = (USE_SHI_PAINTER ? true : false);
	$dat['use_chickenpaint'] =(USE_CHICKENPAINT ? true : false);
	$dat['use_klecks'] = (USE_KLECKS ? true : false);
	$dat['use_tegaki'] = (USE_TEGAKI ? true : false);
	$dat['pdefw'] = PDEF_W;
	$dat['pdefh'] = PDEF_H;
	$dat['maxw_px'] = MAX_W_PX;
	$dat['maxh_px'] = MAX_H_PX;
	$dat['pmaxw'] = PMAX_W;
	$dat['pmaxh'] = PMAX_H;
	$dat['pminw'] = PMIN_W;
	$dat['pminh'] = PMIN_H;
	$dat['anime'] = USE_ANIME ? true : false;
	$dat['animechk'] = DEF_ANIME ? ' checked' : '';
	$dat['resno'] = $resno ? $resno :'';
	$dat['notres'] = $resno ? false : true;
	$dat['paintform'] = (USE_PAINT && !empty($count_arr_apps)) ? ($resno ? (RES_UPLOAD ? true :false) :true):false;
	$dat['maxbyte'] = MAX_KB * 1024 * 2;//フォームのHTMLによるファイルサイズの制限 jpeG→png変換を考慮して2倍。
	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	$dat['usecom'] = (USE_COM||($resno&&!RES_UPLOAD)) ? ' *' :'';
	$dat['use_url_input'] = USE_URL_INPUT_FIELD ? true : false;

	//本文必須の設定では無い時はレスでも画像かコメントがあれば通る
	$dat['upfile'] = false;
	if(!USE_IMG_UPLOAD){//画像アップロード機能を使わない時
		$dat['upfile'] = false;
	} else{
		if((!$resno && !$tmp) || (RES_UPLOAD && !$tmp)){
			$dat['upfile'] = true;
		}
			
	}
	$dat['maxkb']   = MAX_KB;//実際にアップロードできるファイルサイズ
	$dat['maxw']    = $resno ? MAX_RESW : MAX_W;
	$dat['maxh']    = $resno ? MAX_RESH : MAX_H;
	$dat['addinfo'] = $addinfo;

	//文字色
	$dat['fctable']=[];
	if(USE_FONTCOLOR){
		foreach ( $fontcolors as $fontcolor ){
			list($color,$name) = explode(",", $fontcolor);
			$dat['fctable'][] = compact('color','name');
		}
	}

	//アプレット設定
	$dat['undo'] = UNDO;
	$dat['undo_in_mg'] = UNDO_IN_MG;

	return $dat;
}
function form_admin_in($adminin=""){
	global $ADMIN_PASS;

	if(($adminin !== 'valid')){
		return;
	}
	if(ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS){
		$dat['paint'] = true; 
		$dat['select_app'] = true;
		$dat['app_to_use'] = false;
		$dat['use_neo'] = true;
		$dat['use_shi_painter'] = true; 
		$dat['use_chickenpaint'] = true;
		$dat['use_klecks'] = true;
	}
	$dat['admin'] = h($ADMIN_PASS);
	$dat['upfile'] = true;
	return $dat;
}

// 記事表示 
function updatelog(){

	$line=get_log(LOGFILE);
	$trees=get_log(TREEFILE);

	$lineindex = get_lineindex($line); // 逆変換テーブル作成
	$fdat=form();
	$counttree = count($trees);//190619
	$totalpages = ceil($counttree / PAGE_DEF)-1;
	$url_parameter = URL_PARAMETER ? '?'.time() : '';

	for($page=0;$page<$counttree;$page+=PAGE_DEF){//PAGE_DEF単位で全件ループ

		$dat=$fdat;//form()を何度もコールしない

		$disp_threads = array_slice($trees,(int)$page,PAGE_DEF,false);

		foreach($disp_threads as $oya=>$val){//PAGE_DEF分のスレッドを表示
			$treeline = explode(",", rtrim($val));
			// レス省略
			$skipres=count($treeline) - DSP_RES-1;

			//レス作成
			$dat['oya'][$oya]=[];
			foreach($treeline as $k => $disptree){
				if(!isset($lineindex[$disptree])) continue;
				$j=$lineindex[$disptree];
				$res = create_res($line[$j], ['pch' => 1]);
				if(DSP_RES && $k!==0 && $k<=$skipres){//レス表示件数
					continue;
				}
				$res['skipres']=false;
				if($k===0){//スレッドの親の時
					$res['disp_resbutton'] = check_elapsed_days($res['time'],$res['logver']); //返信ボタン表示有無
					// 親レス用の値
					$res['skipres'] = DSP_RES ? (($skipres>0) ? $skipres : false) :false;
				}
					$dat['oya'][$oya][]=$res;
			}
			clearstatcache(); //キャッシュをクリア

		}
		$prev = $page - PAGE_DEF;
		$next = $page + PAGE_DEF;
		// 改ページ処理
		$dat['prev'] =false;
		if($prev >= 0){
			$dat['prev'] = ($prev == 0) ? h(PHP_SELF2) : ($prev / PAGE_DEF) . PHP_EXT;
		}
		$dat['next'] = false;
		if($counttree > $next){
			$dat['next'] = $next/PAGE_DEF.PHP_EXT;
		}
		$paging = "";
		for($l = 0; $l < $counttree; $l += (PAGE_DEF*30)){

			$start_page=$l;
			$end_page=$l+(PAGE_DEF*31);//現在のページよりひとつ後ろのページ
			if($page-(PAGE_DEF*30)<=$l){break;}//現在ページより1つ前のページ
		}


	for($i = $start_page; ($i < $counttree && $i <= $end_page) ; $i += PAGE_DEF){

			$pn = $i ? $i / PAGE_DEF : 0; // page_number
				if($i === $end_page){//特定のページに代入される記号 エンド
					$rep_page_no="≫";
				}elseif($i!==0&&$i == $start_page){//スタート
					$rep_page_no="≪";
				}else{//ページ番号
					$rep_page_no=$pn;
				}

				$paging .= ($page === $i)
				? str_replace("<PAGE>", $pn, NOW_PAGE) // 現在ページにはリンクを付けない
				: str_replace("<PURL>", ($i ? $pn.PHP_EXT.$url_parameter : h(PHP_SELF2.$url_parameter)),
				str_replace("<PAGE>", $rep_page_no , OTHER_PAGE));

				$dat['lastpage'] = (($end_page/PAGE_DEF) <= $totalpages) ? $totalpages.PHP_EXT.$url_parameter : "";
				$dat['firstpage'] = (0 < $start_page) ? PHP_SELF2.$url_parameter : "";
		}
		//改ページ分岐ここまで

		$dat['paging'] = $paging;
		if(!is_numeric($page)){
			error(MSG015);
		} 
		$logfilename = ($page === 0) ? h(PHP_SELF2) : ($page / PAGE_DEF) . PHP_EXT;
		if(is_file($logfilename)){
			if(PHP_EXT!='.php'){chmod($logfilename,PERMISSION_FOR_DEST);}
		}
		$dat['logfilename']= $logfilename;

		$buf = htmloutput(MAINFILE,$dat,true);
		// return htmloutput(MAINFILE,$dat,false);

		$fp = fopen($logfilename, "w");
		flock($fp, LOCK_EX); //*
		writeFile($fp, $buf);
		closeFile($fp);
		if(PHP_EXT!='.php'){chmod($logfilename,PERMISSION_FOR_DEST);}
	}

	safe_unlink(($page/PAGE_DEF+1).PHP_EXT);
}

//レス画面を表示
function res($resno = 0){

	if(!$resno){
		return redirect(h(PHP_SELF2), 0);
	}
	$trees=get_log(TREEFILE);

	$treeline=[];
	foreach($trees as $i => $value){
		//レス先検索
		if (strpos(trim($value).',' , $resno .',') === 0) {
			$treeline = explode(",", trim($value));//現在のスレッドのツリーを取得
			break;
		}
	}
	$next_tree=[];
	foreach($trees as $j => $value){
		if (($i<$j)&&($i+20)>=$j) {//現在のスレッドより後ろの20スレッドのツリーを取得
			$next_tree[]=explode(",", trim($value))[0];
		}
	}
	$prev_tree=[];
	foreach($trees as $j => $value){
		if (($i-20)<=$j && $i>$j) {//現在のスレッドより手前の20スレッドのツリーを取得
			$prev_tree[]=explode(",", trim($value))[0];
		}
	}

	if (empty($treeline)) {
		error(MSG001);
	}


	$fp=fopen(LOGFILE,"r");
	$line=create_line_from_treenumber ($fp,$treeline);
	$prev_line=create_line_from_treenumber ($fp,$prev_tree);
	$next_line=create_line_from_treenumber ($fp,$next_tree);
	closeFile($fp);

	$lineindex = get_lineindex($line); // 逆変換テーブル作成
	$prev_lineindex = get_lineindex($prev_line); // 逆変換テーブル作成
	$next_lineindex = get_lineindex($next_line); // 逆変換テーブル作成

	if(!isset($lineindex[$resno])){
		error(MSG001);
	}

	$dat = form($resno);

	//レス作成
	$dat['oya'][0] = [];
	$rresname = [];
	foreach($treeline as $j => $disptree){
		if(!isset($lineindex[$disptree])) continue;
		$k=$lineindex[$disptree];

		$res = create_res($line[$k], ['pch' => 1]);
		$res['skipres']=false;
	
		if($j===0){
			$resub = USE_RESUB ? 'Re: ' . $res['sub'] : '';
			$dat['resub'] = $resub; //レス画面用
		
			// 親レス用の値
			$res['resub'] = $resub;
			$res['descriptioncom'] = h(strip_tags(mb_strcut($res['com'],0,300))); //メタタグに使うコメントからタグを除去
			$oyaname = $res['name']; //投稿者名をコピー

			if(!check_elapsed_days($res['time'],$res['logver'])){//親の値
			$dat['form'] = false;//フォームを閉じる
			$dat['paintform'] = false;
			$dat['resname'] = false;//投稿者名をコピーを閉じる
			}

		}
		$dat['oya'][0][] = $res;

		// 投稿者名を配列にいれる
		if ($oyaname != $res['name'] && !in_array($res['name'], $rresname)) { // 重複チェックと親投稿者除外
			$rresname[] = $res['name'];
		}
	}
	
	foreach($rresname as $key => $val){
		$rep=str_replace('&quot;','”',$val);
		$rep=str_replace('&#039;','’',$rep);
		$rep=str_replace('&lt;','＜',$rep);
		$rep=str_replace('&gt;','＞',$rep);
		$rep=str_replace("&#44;",",",$rep);
		$rresname[$key]=str_replace('&amp;','＆',$rep);
	}	

	$dat['resname'] = !empty($rresname) ? implode(HONORIFIC_SUFFIX.' ',$rresname) : false; // レス投稿者一覧

	//前のスレッド、次のスレッド
	$next=(isset($next_tree[0])&&$next_tree[0]) ? $next_tree[0] :'';
	$dat['res_next']=($next && isset($next_line[$next_lineindex[$next]])) ? create_res($next_line[$next_lineindex[$next]]):[];

	$last_prev_tree = $prev_tree;
	$last_prev_tree = end($last_prev_tree);
	$prev=$last_prev_tree ? $last_prev_tree :'';

	$dat['res_prev']=($prev && isset($prev_lineindex[$prev])) ? create_res($prev_line[$prev_lineindex[$prev]]):[];
	$dat['view_other_works']=false;
	if(VIEW_OTHER_WORKS){

		$prev_res=[];
		$next_res=[];
		foreach($prev_tree as $n){
			$_res=($n && isset($prev_lineindex[$n])) ? create_res($prev_line[$prev_lineindex[$n]]):[];
			if(!empty($_res)&&$_res['imgsrc']&&$_res['no']!==$resno){
				$prev_res[]=$_res;
			}
		}
		foreach($next_tree as $n){
			$_res=($n && isset($next_lineindex[$n])) ? create_res($next_line[$next_lineindex[$n]]):[];
			if(!empty($_res)&&$_res['imgsrc']&&$_res['no']!==$resno){
				$next_res[]=$_res;
			}
		}
		if((3<=count($prev_res)) && (3<=count($next_res))){
			$prev_res = array_slice($prev_res,-3);
			$next_res = array_slice($next_res,0,3);
			$view_other_works= array_merge($prev_res,$next_res);
		
		}elseif((6>count($next_res))&&(6<=count($prev_res))){
			$view_other_works= array_slice($prev_res,-6);
		}elseif((6>count($prev_res))&&(6<=count($next_res))){
			$view_other_works= array_slice($next_res,0,6);
		}else{
			$view_other_works= array_merge($prev_res,$next_res);
			$view_other_works= array_slice($view_other_works,0,6);

		}
		$dat['view_other_works']=$view_other_works;
	}
	htmloutput(RESFILE,$dat);
}

//マークダウン記法のリンクをHTMLに変換
function md_link($str){
	$str= preg_replace("{\[([^\[\]\(\)]+?)\]\((https?://[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)\)}",'<a href="$2" target="_blank" rel="nofollow noopener noreferrer">$1</a>',$str);
	return $str;
}

// 自動リンク
function auto_link($str){
	if(strpos($str,'<a')===false){//マークダウン記法がなかった時
		$str= preg_replace("{(https?://[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)}",'<a href="$1" target="_blank" rel="nofollow noopener noreferrer">$1</a>',$str);
	}
	return $str;
}

// 日付
function now_date($time){
	$youbi = array('日','月','火','水','木','金','土');
	$yd = $youbi[date("w", $time)] ;
	$date = date(DATE_FORMAT, $time);
	$date = str_replace("<1>", $yd, $date); //漢字の曜日セット1
	$date = str_replace("<2>", $yd.'曜', $date); //漢字の曜日セット2
	return $date;
}

// エラー画面
function error($mes,$dest=''){
	safe_unlink($dest);
	$dat['err_mode'] = true;
	$mes=preg_replace("#<br( *)/?>#i","\n", $mes);
	$dat['mes'] = nl2br(h($mes));
		htmloutput(OTHERFILE,$dat);
	exit;
}

// 文字列の類似性
function similar_str($str1,$str2){
	similar_text($str1, $str2, $p);
	return $p;
}

// 記事書き込み
function regist(){
	global $path,$temppath,$usercode,$ADMIN_PASS;
	
	//CSRFトークンをチェック
	check_csrf_token();

	$admin = (string)filter_input(INPUT_POST, 'admin');
	$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$url = USE_URL_INPUT_FIELD ? (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL) : '';
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$fcolor = (string)filter_input(INPUT_POST, 'fcolor');
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');

	$userip = get_uip();
	//ホスト取得
	$host = $userip ? gethostbyaddr($userip) : '';
	check_badhost();
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post();

	$pictmp = (int)filter_input(INPUT_POST, 'pictmp',FILTER_VALIDATE_INT);
	$picfile = (string)basename(newstring(filter_input(INPUT_POST, 'picfile')));
	$tool="";

	// パスワード未入力の時はパスワードを生成してクッキーにセット
	$c_pass=str_replace("\t",'',(string)filter_input(INPUT_POST, 'pwd'));//エスケープ前の値をCookieにセット
	if($pwd===''){
		if($pwdc){//Cookieはnullの可能性があるので厳密な型でチェックしない
			$pwd=newstring($pwdc);
			$c_pass=$pwdc;//エスケープ前の値
		}else{
			srand();
			$pwd = substr(md5(uniqid(rand(),true)),2,15);
			$pwd = strtr($pwd,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~\t","ABCDEFGHIJKLMNOabcdefghijklmno");
			$c_pass=$pwd;
		}
	}

	if(strlen((string)$pwd) < 6) error(MSG046);

	//画像アップロード
	$upfile_name = isset($_FILES["upfile"]["name"]) ? basename($_FILES["upfile"]["name"]) : "";
	if(strlen((string)$upfile_name)>256){
		error(MSG015);
	}
	$upfile = isset($_FILES["upfile"]["tmp_name"]) ? $_FILES["upfile"]["tmp_name"] : "";

	if(isset($_FILES["upfile"]["error"])){//エラーチェック
		if(in_array($_FILES["upfile"]["error"],[1,2])){
			error(MSG034);//容量オーバー
		} 
	}
	$filesize = isset($_FILES["upfile"]['size']) ? $_FILES["upfile"]['size'] :'';
	if($filesize > MAX_KB*1024*2){//png→jpegで容量が減るかもしれないので2倍
		error(MSG034);//容量オーバー
	}

	$message="";

	//記事管理用 ユニックスタイム10桁+3桁
	$time = (string)(time().substr(microtime(),2,3));	//投稿時刻

	$testexts=['.gif','.jpg','.png','.webp'];
	foreach($testexts as $testext){
		if(is_file(IMG_DIR.$time.$testext)){
			$time=(string)(substr($time,0,-3)+1).(string)substr($time,-3);
			break;
		}
	}
	$time = is_file($temppath.$time.'.tmp') ? (string)(substr($time,0,-3)+1).(string)substr($time,-3) :$time;
	$time = basename($time);
	$ptime='';
	// お絵かき絵アップロード処理
	$pictmp2 = false;
	if($pictmp==2){
		if(!$picfile) error(MSG002);
		$upfile = $temppath.$picfile;
		$upfile_name = basename($picfile);
		$picfile=pathinfo($picfile, PATHINFO_FILENAME );//拡張子除去
		//選択された絵が投稿者の絵か再チェック
		if (!$picfile || !is_file($temppath.$picfile.".dat")) {
			return error(MSG007);
		}
		$fp = fopen($temppath.$picfile.".dat", "r");
		$userdata = fread($fp, 1024);
		fclose($fp);
		list($uip,$uhost,,,$ucode,,$starttime,$postedtime,$uresto,$tool) = explode("\t", trim($userdata)."\t\t\t");
		if(($ucode != $usercode) && (!$uip || ($uip != $userip))){
			return error(MSG007);
		}
		//描画時間を$userdataをもとに計算
		if($starttime && is_numeric($starttime) && $postedtime && is_numeric($postedtime)){
			$psec=(int)$postedtime-(int)$starttime;
			$ptime = $psec;
		}
		$uresto=(string)filter_var($uresto,FILTER_VALIDATE_INT);
		$resto = $uresto ? $uresto : $resto;//変数上書き$userdataのレス先を優先する
		$pictmp2 = true;
	}
	$dest='';
	$is_file_dest=false;
	$is_upload=false;
	if($upfile && is_file($upfile)){//アップロード
	//サポートしていないフォーマットならエラーが返る
	getImgType($upfile);
	$dest = $temppath.$time.'.tmp';
	if($pictmp2){
			copy($upfile, $dest);
		} else{//フォームからのアップロード
			if(!USE_IMG_UPLOAD && (!$admin||$admin!==$ADMIN_PASS)){//アップロード禁止で管理画面からの投稿ではない時
				error(MSG006,$upfile);
			}
			if(!preg_match('/\A(jpe?g|jfif|gif|png|webp)\z/i', pathinfo($upfile_name, PATHINFO_EXTENSION))){//もとのファイル名の拡張子
				error(MSG004,$upfile);
			}
			if(!move_uploaded_file($upfile, $dest)){
				error(MSG003,$upfile);
			}
			//Exifをチェックして画像が回転している時と位置情報が付いている時は上書き保存
			check_jpeg_exif($dest);
			$tool="Upload";
			$is_upload=true;
		}

		$is_file_dest = is_file($dest);
		if(!$is_file_dest){
			error(MSG003);
		}
		chmod($dest,PERMISSION_FOR_DEST);
	}
	//パスワードハッシュ
	$pass = $pwd ? password_hash($pwd,PASSWORD_BCRYPT,['cost' => 5]) : "*";

	$date = now_date(time());//日付取得
	if(DISP_ID){
		$date .= " ID:" . getId($userip);
	}

	//カンマをエスケープ
	$date = str_replace(",", "&#44;", $date);
	$ptime = str_replace(",", "&#44;", $ptime);

	if(!$resto&&DENY_COMMENTS_ONLY&&!$is_file_dest&&(!$admin||$admin!==$ADMIN_PASS)) error(MSG039,$dest);
	if(strlen($resto) > 10) error(MSG015,$dest);

	//フォーマット
	$formatted_post = create_formatted_text_from_post($com,$name,$email,$url,$sub,$fcolor,$dest);
	$com = $formatted_post['com'];
	$name = $formatted_post['name'];
	$email = $formatted_post['email'];
	$url = $formatted_post['url'];
	$sub = $formatted_post['sub'];
	$fcolor = $formatted_post['fcolor'];
	$sage = $formatted_post['sage'];

	if(!$com&&!$is_file_dest) error(MSG008,$dest);

	//ログ読み込み
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019,$dest);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	$lineindex=get_lineindex($line);//逆変換テーブル作成

	if($resto && !isset($lineindex[$resto])){//レス先のログが存在しない時
		if($pictmp2){//お絵かきは
			$resto = '';//新規投稿
		}else{
			error(MSG025,$dest);
		}
	}
	if($resto && isset($lineindex[$resto])){
		list(,,,,,,,,,,,,$_time,,,,,,,$_logver) = explode(",", trim($line[$lineindex[$resto]]).",,,,,,,,");
		if(!check_elapsed_days($_time,$_logver)){//フォームが閉じられていたら
			if($pictmp2){//お絵かきは
				$resto = '';//新規投稿
			}else{
				error(MSG001,$dest);
			}
		}
	}

	// 連続・二重投稿チェック
	$chkline=20;//チェックする最大行数
	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
		list($lastno,,$lname,$lemail,$lsub,$lcom,$lurl,$lhost,$lpwd,,,,$ltime,,,,,,,$logver) = explode(",", trim($value).",,,,,,,,");

		$pchk=false;
		switch(POST_CHECKLEVEL){
			case 1:	//low
				if(
				$host===$lhost
				){$pchk=true;}
				break;
			case 2:	//middle
				if(
				($host===$lhost)
				|| ($name && $name===$lname)
				|| ($email && $email===$lemail)
				|| ($url && $url===$lurl)
				|| ($sub && $sub===$lsub)
				){$pchk=true;}
				break;
			case 3:	//high
				if(
				($host===$lhost)
				|| ($name && similar_str($name,$lname) > VALUE_LIMIT)
				|| ($email && similar_str($email,$lemail) > VALUE_LIMIT)
				|| ($url && similar_str($url,$lurl) > VALUE_LIMIT)
				|| ($sub && similar_str($sub,$lsub) > VALUE_LIMIT)
				){$pchk=true;}
				break;
			case 4:	//full
				$pchk=true;
		}
		if($pchk){
		//KASIRAが入らない10桁のUNIX timeを取り出す
		$ltime=microtime2time($ltime,$logver);
		$interval=time()-(int)$ltime;
		if(RENZOKU && ($interval>=0) && ($interval < RENZOKU)){error(MSG020,$dest);}
		if(RENZOKU2 && ($interval>=0) && ($interval < RENZOKU2) && $dest){error(MSG021,$dest);}
		if($com){
				switch(D_POST_CHECKLEVEL){//190622
					case 1:	//low
						if($com === $lcom){error(MSG022,$dest);}
						break;
					case 2:	//middle
						if(similar_str($com,$lcom) > COMMENT_LIMIT_MIDDLE){error(MSG022,$dest);}
						break;
					case 3:	//high
						if(similar_str($com,$lcom) > COMMENT_LIMIT_HIGH){error(MSG022,$dest);}
						break;
					default:
						if($com === $lcom && !$dest){error(MSG022,$dest);}
				}
			}
		}
		if($i>=$chkline){break;}//チェックする最大行数
	}//ここまで

	// 移動(v1.32)
	if(!$name) $name=DEF_NAME;
	if(!$com) $com=DEF_COM;
	if(!$sub) $sub=DEF_SUB;

	$ext=$w=$h=$chk="";
	$thumbnail='';
	$pchext='';
	$src='';
	// アップロード処理
	if($dest&&$is_file_dest){//画像が無い時は処理しない

		thumb($temppath,$time,".tmp",MAX_W_PX,MAX_H_PX,['toolarge'=>1]);//実体データを縮小
		//pngをjpegに変換してみてファイル容量が小さくなっていたら元のファイルを上書き
		convert_andsave_if_smaller_png2jpg($dest,$is_upload);

		clearstatcache();
		if(filesize($dest) > MAX_KB * 1024){//ファイルサイズ再チェック
		error(MSG034,$dest);
		}
		//サポートしていないフォーマットならエラーが返る
		getImgType($dest);

		$chk = md5_file($dest);
		check_badfile($chk, $dest); // 拒絶画像チェック

		$upfile_name=newstring($upfile_name);
		$message = UPLOADED_OBJECT_NAME." $upfile_name ".UPLOAD_SUCCESSFUL;

		//重複チェック
		$chkline=200;//チェックする最大行数
		$j=1;
		if(!$pictmp2){
			foreach($line as $i => $value){ //画像重複チェック
				if(!trim($value)){
					continue;
				}
				list(,,,,,,,,,$extp,,,$timep,$chkp,) = explode(",", trim($value));
				if($extp){//拡張子があったら
				if($chkp===$chk&&is_file($path.$timep.$extp)){
				error(MSG005,$dest);
				}
				if($j>=20){break;}//画像を20枚チェックしたら
				++$j;
				}
				if($i>=$chkline){break;}//チェックする最大行数
			}
		}
		//PCHファイルアップロード
		// .pch, .spch,.chi,.psd ブランク どれかが返ってくる
		if ($pchext = check_pch_ext($temppath.$picfile,['upfile'=>true])) {
			$src = $temppath.$picfile.$pchext;
			$dst = PCH_DIR.$time.$pchext;
			if(copy($src, $dst)){
				chmod($dst,PERMISSION_FOR_DEST);
			}
		}

		list($w, $h) = getimagesize($dest);
		//サポートしていないフォーマットならエラーが返る
		$ext = getImgType($dest);
	
		rename($dest,$path.$time.$ext);
		chmod($path.$time.$ext,PERMISSION_FOR_DEST);
		// 縮小表示
		$max_w = $resto ? MAX_RESW : MAX_W;
		$max_h = $resto ? MAX_RESH : MAX_H;
		list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);

		if(USE_THUMB){
			if(thumb($path,$time,$ext,$max_w,$max_h)){
				$thumbnail="thumbnail";
			}
		}
	}
	// 最大ログ数を超過した行と画像を削除
	$logmax=(LOG_MAX>=1000) ? LOG_MAX : 1000;
	$countline = count($line);
	if($countline >= $logmax){
		for($i=$logmax-1; $i<$countline;++$i){
			if($line[$i]===""){continue;}
			list($dno,,,,,,,,,$dext,,,$dtime,) = explode(",", $line[$i]);
			delete_files($path, $dtime, $dext);
			unset($line[$i]);
			treedel($dno);
		}
	}
	list($lastno,) = explode(",", $line[0]);
	$no = $lastno + 1;
	$tool = is_paint_tool_name($tool);
	$newline = "$no,$date,$name,$email,$sub,$com,$url,$host,$pass,$ext,$w,$h,$time,$chk,$ptime,$fcolor,$pchext,$thumbnail,$tool,6,\n";
	$newline.= implode("\n", $line);


	//ツリー更新
	$find = false;
	$new_treeline = '';
	chmod(TREEFILE,PERMISSION_FOR_LOG);
	$tp=fopen(TREEFILE,"r+");
	stream_set_write_buffer($tp, 0);
	flock($tp, LOCK_EX); //*
	$buf=fread($tp,5242880);
	if(!$buf){error(MSG023);}
	$line = explode("\n", trim($buf));
	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
		list($oyano,) = explode(",", rtrim($value));
		if(!isset($lineindex[$oyano])){//親のログが存在しないときは
			unset($line[$i]);//ツリーを削除
		}
	}

	if($resto){
		foreach($line as $i => $value){
			if(!trim($value)){
				continue;
			}
			//レス先検索
			if (strpos(trim($value) . ',', $resto . ',') === 0){
				$find = TRUE;
				$line[$i] = rtrim($value).','.$no;
				$treelines=explode(",", rtrim($line[$i]));
				if(!($sage || count($treelines)>MAX_RES)){
					$new_treeline=$line[$i] . "\n";
					unset($line[$i]);
				}
				break;
			}
		}
	}
	if($pictmp2 && !$find ){//お絵かきでレス先が無い時は新規投稿
		$resto='';
	}
	if(!$resto){
		$new_treeline="$no\n";
	}
	if($resto && !$find){
		delete_files ($path, $time, $ext);
		error(MSG025);
	}
	$new_treeline.=implode("\n", $line);

	writeFile($tp, $new_treeline);
	writeFile($fp, $newline);

	closeFile($tp);
	closeFile($fp);

	updatelog();

	//ワークファイル削除
	safe_unlink($src);
	safe_unlink($upfile);
	safe_unlink($temppath.$picfile.".dat");
	
	//-- クッキー保存 --
	//パスワード
	$email = $email ? $email : ($sage ? 'sage' : '') ;
	$name=str_replace("\t",'',(string)filter_input(INPUT_POST, 'name'));//エスケープ前の値をセット
	//クッキー項目："クッキー名 クッキー値"
	$cooks = [['namec',$name],['emailc',$email],['urlc',$url],['fcolorc',$fcolor],['pwdc',$c_pass]];

	foreach ( $cooks as $cook ) {
		list($c_name,$c_cookie) = $cook;
		setcookie ($c_name, $c_cookie,time()+(SAVE_COOKIE*24*3600));
	}

	$resno = $resto ? $resto : $no;
	$resno = h($resno);
	
	//メール通知

	//template_ini.phpで未定義の時の初期値
	//このままでよければ定義不要
	defined('NOTICE_MAIL_TITLE') or define('NOTICE_MAIL_TITLE', '記事題名');
	defined('NOTICE_MAIL_IMG') or define('NOTICE_MAIL_IMG', '投稿画像');
	defined('NOTICE_MAIL_THUMBNAIL') or define('NOTICE_MAIL_THUMBNAIL', 'サムネイル画像');
	defined('NOTICE_MAIL_ANIME') or define('NOTICE_MAIL_ANIME', 'アニメファイル');
	defined('NOTICE_MAIL_URL') or define('NOTICE_MAIL_URL', '記事URL');
	defined('NOTICE_MAIL_REPLY') or define('NOTICE_MAIL_REPLY', 'へのレスがありました');
	defined('NOTICE_MAIL_NEWPOST') or define('NOTICE_MAIL_NEWPOST', '新規投稿がありました');

	if(is_file(NOTICEMAIL_FILE)	//メール通知クラスがある場合
	&& !(NOTICE_NOADMIN && $pwd && ($pwd === $ADMIN_PASS))){//管理者の投稿の場合メール出さない
		require(__DIR__.'/'.NOTICEMAIL_FILE);
		$name = h_decode($name);
		$sub = h_decode($sub);
		$com = h_decode($com); 
		$data['to'] = TO_MAIL;
		$data['name'] = $name;
		$data['email'] = $email;
		$data['option'][] = 'URL,'.$url;
		$data['option'][] = NOTICE_MAIL_TITLE.','.$sub;
		if($ext) $data['option'][] = NOTICE_MAIL_IMG.','.ROOT_URL.IMG_DIR.$time.$ext;//拡張子があったら
		if(is_file(THUMB_DIR.$time.'s.jpg')) $data['option'][] = NOTICE_MAIL_THUMBNAIL.','.ROOT_URL.THUMB_DIR.$time.'s.jpg';
		if($resto){
			$data['subject'] = '['.TITLE.'] No.'.$resno.NOTICE_MAIL_REPLY;
		}else{
			$data['subject'] = '['.TITLE.'] '.NOTICE_MAIL_NEWPOST;
		}
		$data['option'][] = NOTICE_MAIL_URL.','.ROOT_URL.PHP_SELF."?res={$resno}#{$time}";
		$data['comment'] = SEND_COM ? preg_replace("#<br( *)/?>#i","\n", $com) : '';

		noticemail::send($data);
	}
	redirect(
		PHP_SELF."?res={$resno}#{$time}"
		,
		1,
		$message,
		THE_SCREEN_CHANGES
	);
}

function h_decode($str){
	$str = str_replace("&#44;", ",", $str);
	return htmlspecialchars_decode((string)$str, ENT_QUOTES);
}

//ツリー削除
function treedel($delno){
	chmod(TREEFILE,PERMISSION_FOR_LOG);
	$fp=fopen(TREEFILE,"r+");
	stream_set_write_buffer($fp, 0);
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG024);}
	$line = explode("\n", trim($buf));
	$find=false;
	$thread_exists=true;
	foreach($line as $i =>$value){
		$treeline = explode(",", trim($value));
		foreach($treeline as $j => $value){
			if($value == $delno){
				if($j===0){//スレ削除
					if(count($line) <= 1){//スレが1つしかない場合、エラー防止の為に削除不可
						closeFile($fp);
						error(MSG026);
					}else{
						unset($line[$i]);
						$thread_exists=false;
					}
				}else{//レス削除
					unset($treeline[$j]);
					$line[$i]=implode(',', $treeline);
					$line[$i]=str_replace(",,",",",$line[$i]);
					$line[$i]=preg_replace("/,\z/","",$line[$i]);
					if (!$line[$i]) {
						unset($line[$i]);
					}
				}
				$find=true;
				break 2;
			}
		}
	}
	if($find){//ツリー更新
		writeFile($fp, implode("\n", $line));
	}
	closeFile($fp);
	return $thread_exists;//スレがあればtrue
}

// HTMLの特殊文字をエスケープ
function newstring($str){
	$str = trim((string)$str);
	$str = htmlspecialchars((string)$str,ENT_QUOTES,'utf-8');
	return str_replace(",", "&#44;", $str);//カンマをエスケープ
}

// ユーザー削除
function userdel(){
	global $path;

	check_same_origin();

	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(string)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);
	$catalog_pageno= $catalog_pageno ? $catalog_pageno : 0;
	$onlyimgdel = filter_input(INPUT_POST, 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');
	
	if(!is_array($del)){
		return;
	}

	sort($del);
	reset($del);
	$pwd = $pwd ? $pwd : newstring($pwdc);
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	stream_set_write_buffer($fp, 0);
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG027);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = false;
	$find = false;
	$thread_exists = true;
	foreach($line as $i => $value){//190701
		if(!trim($value)){
			continue;
		}
		list($no,,,,,,,$dhost,$pass,$ext,,,$time,,) = explode(",",trim($value));
		if(in_array($no,$del) && check_password($pwd, $pass, $pwd)){
			if(!$onlyimgdel){	//記事削除
				$thread_exists=treedel($no);
				if(USER_DELETES > 2){
					unset($line[$i]);
					$find = true;
				}
			}
			if(USER_DELETES > 1){
				delete_files($path, $time, $ext);
			}
			$flag = true;
		}
	}
	if(!$flag){
		closeFile($fp);
		error(MSG028);
	}
	if($find){//ログ更新
		writeFile($fp, implode("\n", $line));
	}
	closeFile($fp);
	$destination = ($thread_no&&$thread_exists) ? PHP_SELF.'?res='.h($thread_no) :($logfilename ? './'.h($logfilename) : ($mode_catalog ? PHP_SELF.'?mode=catalog&page='.h($catalog_pageno) : h(PHP_SELF2)));

	updatelog();
	return redirect($destination, 0);

}

// 管理者削除
function admindel($pass){
	global $path;

	check_same_origin(true);

	$onlyimgdel = (bool)filter_input(INPUT_POST, 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$del_pageno=(int)filter_input(INPUT_POST,'del_pageno',FILTER_VALIDATE_INT);
	// 削除画面
	$dat['admin_del'] = true;
	$dat['pass'] = $pass;
	$all = 0;
	$line=get_log(LOGFILE);
	$countlog=count($line);
	$l = 0;

	for($k = 0; $k < $countlog  ; $k += 1000){

			$dat['del_pages'][$l]['no']=$k;
			$dat['del_pages'][$l]['pageno']=$l;
			$dat['del_pages'][$l]['notlink']=false;
			if($del_pageno===$l*1000){
				$dat['del_pages'][$l]['notlink']=true;
			}
		++$l;
	}

	foreach($line as $j => $value){
			if(($j>=($del_pageno))&&($j<(1000+$del_pageno))){
			list($no,$date,$name,$email,$sub,$com,$url,
			$host,$pw,$ext,$w,$h,$time,$chk,) = explode(",",trim($value));
		$res= [
			'size' => 0,
			'size_kb' => 0,
			'no' => $no,
			'host' => $host,
			'clip' => "",
			'chk' => "",
			'src' => "",
			'srcname' => "",
		] ;
		list($name,) = separateNameAndTrip($name);
		$res['now']  = preg_replace("/( ID:.*)/","",$date);//ID以降除去
		$res['name'] = strip_tags($name);//タグ除去
		$res['sub'] = strip_tags($sub);
		if(strlen($res['name']) > 10) $res['name'] = mb_strcut($res['name'],0,9).".";
		if(strlen($res['sub']) > 10) $res['sub'] = mb_strcut($res['sub'],0,9).".";
		$res['email']=filter_var($email, FILTER_VALIDATE_EMAIL);
		$res['com'] = preg_replace("#<br( *)/?>#i"," ",$com);
		$res['com'] = strip_tags($res['com']);
		if(strlen($res['com']) > 20) $res['com'] = mb_strcut($res['com'],0,18) . ".";

		$res['bg'] = ($j % 2) ? ADMIN_DELGUSU : ADMIN_DELKISU;//背景色
		
		foreach($res as $key => $val){
			$res[$key]=h($val);
		}
		if($ext && is_file($path.$time.$ext)){
			$filesize = filesize($path.$time.$ext);
			$res['size'] = h($filesize);
			$res['size_kb'] = h(($filesize-($filesize % 1024)) / 1024);
			$all += $res['size'];	//ファイルサイズ加算
			$res['chk']= h(substr($chk,0,10));//md5
			$res['src'] = h(IMG_DIR.$time.$ext);
			$res['srcname'] = h($time.$ext);
			$res['clip'] = '<a href="'.h(IMG_DIR.$time.$ext).'" target="_blank" rel="noopener">'.h($time.$ext).'</a>';
		}
		if($res['email']){
			$res['name']='<a href="mailto:'.h($res['email']).'">'.h($res['name']).'</a>';
		}
		$dat['dels'][] = $res;
		}
	}
	$dat['all'] = h(($all - ($all % 1024)) / 1024);

	if(is_array($del)){
		sort($del);
		reset($del);
		chmod(LOGFILE,PERMISSION_FOR_LOG);
		$fp=fopen(LOGFILE,"r+");
		stream_set_write_buffer($fp, 0);
		flock($fp, LOCK_EX);
		$buf=fread($fp,5242880);
		if(!$buf){error(MSG030);}
		$buf = charconvert($buf);
		$line = explode("\n", trim($buf));
		$find = false;
		foreach($line as $i => $value){
			if(!trim($value)){
				continue;
			}
			list($no,,,,,,,,,$ext,,,$time,,) = explode(",",trim($value));
			if(in_array($no,$del)){
				if(!$onlyimgdel){	//記事削除
					treedel($no);
					unset($line[$i]);
					$find = true;
				}
				delete_files($path, $time, $ext);
			}
		}
		if($find){//ログ更新
			writeFile($fp, implode("\n", $line));
		}
		closeFile($fp);
	}

	return htmloutput(OTHERFILE,$dat);
}

function init(){
	$err='';
	$en=lang_en();

	if(!is_writable(__DIR__.'/'))die($en ? "Unable to write to current directory." : "カレントディレクトリに書けません。");
	if($err=check_dir(__DIR__.'/templates/'.SKIN_DIR.'cache')){
		die($err);
	}
	if (!is_file(__DIR__.'/'.LOGFILE)) {
		$date = now_date(time());//日付取得
		if(DISP_ID) $date .= " ID:???";
		$time = time().substr(microtime(),2,3);
		$testmes="1,".$date.",".DEF_NAME.",,".DEF_SUB.",".DEF_COM.",,,,,,,".$time.",,,,,,,6,\n";
		file_put_contents(LOGFILE, $testmes,LOCK_EX);
		chmod(LOGFILE, PERMISSION_FOR_LOG);
	}
	$err .= check_file(__DIR__.'/'.LOGFILE,true);

	if (!is_file(__DIR__.'/'.TREEFILE)) {
		file_put_contents(TREEFILE, "1\n",LOCK_EX);
		chmod(TREEFILE, PERMISSION_FOR_LOG);
	}
	$err .= check_file(__DIR__.'/'.TREEFILE,true);

	$err .= check_dir(__DIR__.'/'.IMG_DIR);
	$err .= check_dir(__DIR__.'/'.PCH_DIR);
	$err .= check_dir(__DIR__.'/'.THUMB_DIR);
	$err .= check_dir(__DIR__.'/'.TEMP_DIR);
	if($err) return error($err);
	if(!is_file(__DIR__.'/'.PHP_SELF2))updatelog();
}

function lang_en(){//言語が日本語以外ならtrue。
	$lang = ($http_langs = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '')
	? explode( ',', $http_langs )[0] : '';
  return (stripos($lang,'ja')!==0);
}
function initial_error_message(){
	$en=lang_en();
	$msg['041']=$en ? ' does not exist.':'がありません。'; 
	$msg['042']=$en ? ' is not readable.':'を読めません。'; 
	$msg['043']=$en ? ' is not writable.':'に書けません。'; 
return $msg;	
}

// ファイル存在チェック
function check_file ($path,$check_writable='') {
	$msg=initial_error_message();
	if (!is_file($path)) return $path . $msg['041']."<br>";
	if (!is_readable($path)) return $path . $msg['042']."<br>";
	if($check_writable){//書き込みが必要なファイルのチェック
		if (!is_writable($path)) return $path . $msg['043']."<br>";
	}
	return '';
}
// ディレクトリ存在チェック なければ作る
function check_dir ($path) {
	$msg=initial_error_message();

	if (!is_dir($path)) {
			mkdir($path, PERMISSION_FOR_DIR);
			chmod($path, PERMISSION_FOR_DIR);
	}
	if (!is_dir($path)) return $path . $msg['041']."<br>";
	if (!is_readable($path)) return $path . $msg['042']."<br>";
	if (!is_writable($path)) return $path . $msg['043']."<br>";
	return '';
}

// お絵かき画面
function paintform(){
	global $qualitys,$usercode,$ADMIN_PASS,$pallets_dat;

	check_same_origin();

	$admin = (string)filter_input(INPUT_POST, 'admin');
	$type = (string)newstring(filter_input(INPUT_POST, 'type'));
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');
	$pwd = $pwd ? $pwd : newstring($pwdc);
	$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
	if(strlen($resto)>1000){
		error(MSG015);
	}
	$mode = (string)filter_input(INPUT_POST, 'mode');
	$picw = (int)filter_input(INPUT_POST, 'picw',FILTER_VALIDATE_INT);
	$pich = (int)filter_input(INPUT_POST, 'pich',FILTER_VALIDATE_INT);
	$anime = (bool)filter_input(INPUT_POST, 'anime',FILTER_VALIDATE_BOOLEAN);
	$shi = (string)filter_input(INPUT_POST, 'shi');
	$pch = basename((string)newstring(filter_input(INPUT_POST, 'pch')));
	$ext = basename((string)newstring(filter_input(INPUT_POST, 'ext')));
	$ctype = (string)newstring(filter_input(INPUT_POST, 'ctype'));
	$quality = (int)filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);
	$no = (int)filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);

	
	if(strlen($pwd) > 72) error(MSG015);

	$dat['klecksusercode']=$usercode;//klecks
	$dat['resto']=$resto;//klecks
	// 初期化
	$dat['image_jpeg'] = 'false';
	$dat['image_size'] = 0;
	$keys=['type_neo','pinchin','pch_mode','continue_mode','imgfile','img_chi','img_klecks','paintbbs','quality','pro','normal','undo','undo_in_mg','pchfile','security','security_click','security_timer','security_url','speed','picfile','painttime','no','pch','ext','ctype_pch','newpost_nopassword'];

	foreach($keys as $key){
		$dat[$key]=false;	
	}

	$dat['parameter_day']=date("Ymd");//JavaScriptのキャッシュ制御
	//pchファイルアップロードペイント
	if($admin&&($admin===$ADMIN_PASS)){
		
		$pchtmp= isset($_FILES['pch_upload']['tmp_name']) ? $_FILES['pch_upload']['tmp_name'] :'';
		if(isset($_FILES['pch_upload']['error']) && in_array($_FILES['pch_upload']['error'],[1,2])){//容量オーバー
			error(MSG034);
		} 
		if ($pchtmp && $_FILES['pch_upload']['error'] === UPLOAD_ERR_OK){
			$pchfilename = isset($_FILES['pch_upload']['name']) ? newstring(basename($_FILES['pch_upload']['name'])) : '';

			$time = (string)(time().substr(microtime(),2,6));
			$pchext=pathinfo($pchfilename, PATHINFO_EXTENSION);
			$pchext=strtolower($pchext);//すべて小文字に
			//拡張子チェック
			if (!in_array($pchext, ['pch','spch','chi','psd'])) {
				error(MSG045,$pchtmp);
			}
			$pchup = TEMP_DIR.'pchup-'.$time.'-tmp.'.$pchext;//アップロードされるファイル名

			if(move_uploaded_file($pchtmp, $pchup)){//アップロード成功なら続行

				$pchup=TEMP_DIR.basename($pchup);//ファイルを開くディレクトリを固定
				if(!in_array(mime_content_type($pchup),["application/octet-stream","application/gzip","image/vnd.adobe.photoshop"])){
					error(MSG045,$pchup);
				}
				if($pchext==="pch"){
					$is_neo=is_neo($pchup);
					$shi = $is_neo ? 'neo': 0;
					if($get_pch_size=get_pch_size($pchup)){
						list($picw,$pich)=$get_pch_size;//pchの幅と高さを取得
					}
					$dat['pchfile'] = $pchup;
				} elseif($pchext==="spch"){
					if($get_spch_size=get_spch_size($pchup)){
						list($picw,$pich)=$get_spch_size;//pchの幅と高さを取得
					}
					$shi=($shi==1||$shi==2) ? $shi : 1;
					$dat['pchfile'] = $pchup;
				} elseif($pchext==="chi"){
					$shi='chicken';
					$dat['img_chi'] = $pchup;
				} elseif($pchext==="psd"){
					$shi='klecks';
					$dat['img_klecks'] = $pchup;
				}
			}
		}
	}
	//pchファイルアップロードペイントここまで
	$dat['paint_mode'] = true;
	$dat['pinchin']=false;//NEOのピンチイン廃止
	$dat = array_merge($dat,form($resto));
	$dat['anime'] = $anime ? true : false;

	$oyano='';
	if($mode==="contpaint"){

		$cont_paint_same_thread=(bool)filter_input(INPUT_POST, 'cont_paint_same_thread',FILTER_VALIDATE_BOOLEAN);

		if($type!=='rep'){

			$tp=fopen(TREEFILE,"r");
			while($tree = fgets($tp)){
				if(!trim($tree)){
					continue;
				}	
				if (strpos(',' . trim($tree) . ',',',' . $no . ',') !== false) {
					list($oyano,) = explode(',', trim($tree));
					break;
				}
			}
			closeFile($tp);
			$resto = ($cont_paint_same_thread && $oyano) ? $oyano : '';

			// $resto= ($oyano&&((int)$oyano!==$no)) ? $oyano :'';
			//お絵かきレスの新規投稿はスレッドへの返信の新規投稿に。
			//親の番号ではない事を確認してレス先の番号をセット。
		}
		if(!is_file(IMG_DIR.$pch.$ext)){
			error(MSG001);
		}
		list($picw,$pich)=getimagesize(IMG_DIR.$pch.$ext);//キャンバスサイズ
	
		$_pch_ext = check_pch_ext(__DIR__.'/'.PCH_DIR.$pch,['upfile'=>true]);

		if($ctype=='pch'&& $_pch_ext){

			if($_pch_ext==='.pch'){
				$shi = is_neo(PCH_DIR.$pch.'.pch') ? 'neo':0;
			}
			$dat['pchfile'] = './'.PCH_DIR.$pch.$_pch_ext;
		}
		if($ctype=='img' && is_file(IMG_DIR.$pch.$ext)){//画像

			$dat['anime'] = false;
			$dat['imgfile'] = './'.IMG_DIR.$pch.$ext;
			if($_pch_ext==='.chi'){
				$dat['img_chi'] = './'.PCH_DIR.$pch.'.chi';
			}
			if($_pch_ext==='.psd'){
				$dat['img_klecks'] = './'.PCH_DIR.$pch.'.psd';
			}
		}
	
		$dat['newpaint'] = true;
	}

	$picw = ($picw < PMIN_W) ? PMIN_W : $picw;//最低の幅チェック
	$pich = ($pich < PMIN_H) ? PMIN_H : $pich;//最低の高さチェック
	$picw = ($picw > PMAX_W) ? PMAX_W : $picw;//最大の幅チェック
	$pich = ($pich > PMAX_H) ? PMAX_H : $pich;//最大の高さチェック

	if($shi==1||$shi==2){
	$w = $picw + 510;//しぃぺの時の幅
	$h = $pich + 120;//しぃぺの時の高さ
	} else{
		$w = $picw + 150;//PaintBBSの時の幅
		$h = $pich + 172;//PaintBBSの時の高さ
	}

	$w = ($w < 450) ? 450 : $w;//最低幅
	$h = ($h < 560) ? 560 : $h;//最低高

	$dat['compress_level'] = COMPRESS_LEVEL;
	$dat['layer_count'] = LAYER_COUNT;
	if($shi) $dat['quality'] = $quality ? $quality : $qualitys[0];
	//NEOを使う時はPaintBBSの設定
	if(USE_SELECT_PALETTES){//パレット切り替え機能を使う時
		foreach($pallets_dat as $i=>$value){
			if($i==filter_input(INPUT_POST, 'selected_palette_no',FILTER_VALIDATE_INT)){//キーと入力された数字が同じなら
				setcookie("palettec", $i, time()+(86400*SAVE_COOKIE));//Cookie保存
				if(is_array($value)){
					list($p_name,$p_dat)=$value;
					if ($err = check_file(__DIR__.'/'.$p_dat)) {
						error($err);
					}
					$lines=file($p_dat);
				}else{
					$lines=file($value);
				}
				break;
			}
		}
	}else{
		if ($err = check_file(__DIR__.'/'.PALETTEFILE)) {
			error($err);
		}
		$lines=file(PALETTEFILE);//初期パレット
	}

	$pal=[];
	$DynP=[];
	$arr_pal=[];
	$initial_palette = 'Palettes[0] = "#000000\n#FFFFFF\n#B47575\n#888888\n#FA9696\n#C096C0\n#FFB6FF\n#8080FF\n#25C7C9\n#E7E58D\n#E7962D\n#99CB7B\n#FCECE2\n#F9DDCF";';
	foreach ( $lines as $i => $line ) {
		$line=charconvert(str_replace(["\r","\n","\t"],"",$line));
		list($pid,$pname,$pal[0],$pal[2],$pal[4],$pal[6],$pal[8],$pal[10],$pal[1],$pal[3],$pal[5],$pal[7],$pal[9],$pal[11],$pal[12],$pal[13]) = explode(",", $line);
		$DynP[]=h($pname);
		$p_cnt=$i+1;
		ksort($pal);
		$arr_pal[$i] = 'Palettes['.h($p_cnt).'] = "#'. h(implode('\n#',$pal)) . '";';
	}
	$dat['palettes']=$initial_palette.implode('',$arr_pal);
	$dat['palsize'] = count($DynP) + 1;
	$dat['dynp']=$DynP;

	$dat['w'] = $w;
	$dat['h'] = $h;
	$dat['picw'] = $picw;
	$dat['pich'] = $pich;
	$dat['stime'] = time();
	if($pwd){
		$pwd=openssl_encrypt ($pwd,CRYPT_METHOD, CRYPT_PASS, true, CRYPT_IV);//暗号化
		$pwd=bin2hex($pwd);//16進数に
	}
	$resto = ($resto) ? '&resto='.$resto : '';
	$dat['mode'] = 'piccom'.$resto;

	$usercode.='&stime='.time().$resto;
	//差し換え時の認識コード追加
	$dat['rep']=false;//klecks
	$dat['repcode']='';
	if($type==='rep'){
		$dat['rep']=true;//klecks
		$time=time();
		$userip = get_uip();
		$repcode = substr(crypt(md5($no.$userip.$pwd.uniqid()),'id'),-12);
		//念の為にエスケープ文字があればアルファベットに変換
		$repcode = strtr($repcode,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~\t","ABCDEFGHIJKLMNOabcdefghijklmno");
		$dat['repcode']=$repcode;//klecks
		$dat['mode'] = 'picrep&no='.$no.'&pwd='.$pwd.'&repcode='.$repcode;
		$usercode.='&repcode='.$repcode;
	}

	$not_support_async_await=not_support_async_await()&&($shi==1||$shi==2);
	$dat['await']=$not_support_async_await ? '' : 'await';//しぃペインターのダイナミックパレットの制御
	$dat['async']=$not_support_async_await ? '' : 'async';//awaitをSupportしていない古いブラウザの時は空白に

	//アプリ選択 
	if($shi==1){ $dat['normal'] = true; }
	elseif($shi==2){ $dat['pro'] = true; }
	else{ $dat['paintbbs'] = true; }
	$dat['useneo'] = ($shi=='neo');//NEOを使う
	$dat['chickenpaint']= ($shi==='chicken');

	$dat['usercode'] = $usercode;

	//Cookie保存
	setcookie("appletc", $shi , time()+(86400*SAVE_COOKIE));//アプレット選択
	setcookie("picwc", $picw , time()+(86400*SAVE_COOKIE));//幅
	setcookie("pichc", $pich , time()+(86400*SAVE_COOKIE));//高さ
	switch($shi){
		case 'tegaki':
			return htmloutput(PAINT_TEGAKI,$dat);
		case 'klecks':{
		$dat['TranslatedLayerName'] = getTranslatedLayerName();
			return htmloutput(PAINT_KLECKS,$dat);
		}
		default:

		if($dat['normal'] || $dat['pro']){
			$dat['tool']="Shi-Painter";
		}elseif($dat['paintbbs']){
			$dat['tool']="PaintBBS";
		}elseif($dat['chickenpaint']){
			$dat['tool']="ChickenPaint";
		}
		
		return htmloutput(PAINTFILE,$dat);
	}
}

// お絵かきコメント 
function paintcom(){
	global $usercode;
	$userip = get_uip();
	$resto = (string)filter_input(INPUT_GET, 'resto',FILTER_VALIDATE_INT);
	$stime = (string)filter_input(INPUT_GET, 'stime',FILTER_VALIDATE_INT);
	//描画時間
	if($stime && DSP_PAINTTIME){
		$dat['ptime'] = calcPtime(time()-$stime);
	}

	if(USE_RESUB && $resto) {

		$fp=fopen(LOGFILE,"r");
		while($line = fgets($fp)){
			if(!trim($line)){
				continue;
			}
			if (strpos(trim($line) . ',', $resto . ',') === 0) {

				list($cno,,,,$sub,,,,,,,,,,) = explode(",", charconvert($line));
					$dat['sub'] = 'Re: '.$sub;
					break;
			}
		}
		closeFile($fp);
	}

	//テンポラリ画像リスト作成
	$tmplist = array();
	$handle = opendir(TEMP_DIR);
	$tmp = [];
	while ($file = readdir($handle)) {
		if(!is_dir($file) && pathinfo($file, PATHINFO_EXTENSION)==='dat') {

			$userdata=file_get_contents(TEMP_DIR.$file);
			list($uip,$uhost,$uagent,$imgext,$ucode,) = explode("\t", rtrim($userdata));
			$file_name = pathinfo($file, PATHINFO_FILENAME);
			$imgext=basename($imgext);
			if(is_file(TEMP_DIR.$file_name.$imgext)) //画像があればリストに追加
			if($ucode == $usercode||($uip && ($uip == $userip))){
				$tmp[$file_name] = $file_name.$imgext;
			}
		}
	}
	closedir($handle);

	$dat['post_mode'] = true;
	$dat['regist'] = true;
	$dat['ipcheck'] = true;//常にtrue
	if(empty($tmp)){
		$dat['notmp'] = true;
		$dat['pictmp'] = 1;
	}else{
		$dat['pictmp'] = 2;
		ksort($tmp);
		foreach($tmp as $tmpfile){
			$tmp_img['src'] = TEMP_DIR.$tmpfile;
			$tmp_img['srcname'] = $tmpfile;
			$tmp_img['date'] = date("Y/m/d H:i", filemtime($tmp_img['src']));
			$dat['tmp'][] = $tmp_img;
		}
	}

	$dat = array_merge($dat,form($resto,$tmp));

	htmloutput(OTHERFILE,$dat);
}

// 動画表示
function openpch(){

	$dat['paint_mode'] = false;
	$dat['continue_mode'] = false;
	$dat['useneo'] = false;
	$dat['chickenpaint'] = false;
	$dat['pro'] = false;
	$dat['normal'] = false;
	$dat['paintbbs'] = false;
	$dat['type_neo'] = false;

	$dat['parameter_day']=date("Ymd");

	$pch = (string)newstring(filter_input(INPUT_GET, 'pch'));
	$_pch = pathinfo($pch, PATHINFO_FILENAME); //拡張子除去

	$ext = check_pch_ext(PCH_DIR . $_pch);
	if(!$ext||!is_file(IMG_DIR.$pch)){
		error(MSG001);
	}
	$dat['pchfile'] = './' . PCH_DIR . $_pch . $ext;
		if ($ext == '.spch') {
			$dat['normal'] = true;
		} elseif ($ext == '.pch') {
			$dat['paintbbs'] = true;
			//neoのpchかどうか調べる
			$dat['type_neo'] = is_neo($dat['pchfile']);
		}
	$datasize = filesize($dat['pchfile']);
	$dat['datasize'] = ($datasize-($datasize % 1024)) / 1024;
	list($dat['picw'], $dat['pich']) = getimagesize(IMG_DIR.$pch);
	$dat['w'] = ($dat['picw'] < 200 ? 200 : $dat['picw']);
	$dat['h'] = ($dat['pich'] < 200 ? 200 : $dat['pich']) + 26;

	$dat['pch_mode'] = true;
	$dat['speed'] = PCH_SPEED;
	$dat['stime'] = time();

	if($ext==='.tgkr'){
		htmloutput(TGKR_VIEW,$dat);
	}else{
		htmloutput(PAINTFILE,$dat);
	}
}

// テンポラリ内のゴミ除去 
function deltemp(){
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		$file=basename($file);
		if(!is_dir($file)) {
			//pchアップロードペイントファイル削除
			$lapse = time() - filemtime(TEMP_DIR.$file);
			if(strpos($file,'pchup-')===0) {
				if($lapse > (300)){//5分
					safe_unlink(TEMP_DIR.$file);
				}
			}else{
				if($lapse > (TEMP_LIMIT*24*3600)){
					safe_unlink(TEMP_DIR.$file);
				}
			}
		}
	}
	
	closedir($handle);
}

// コンティニュー前画面
function incontinue(){
	global $addinfo;

	$dat['paint_mode'] = false;
	$dat['pch_mode'] = false;
	$dat['useneo'] = false;
	$dat['chickenpaint'] = false;
	
	$name='';
	$sub='';
	$cext='';
	$ctim='';
	$cptime='';

	$no = (string)filter_input(INPUT_GET, 'no',FILTER_VALIDATE_INT);
	$flag = FALSE;
	$fp=fopen(LOGFILE,"r");
	while($line = fgets($fp)){//記事ナンバーのログを取得
		if(!trim($line)){
			continue;
		}
		if (strpos(trim($line) . ',', $no . ',') === 0) {
		list($cno,,$name,,$sub,,,,,$cext,$picw,$pich,$ctim,,$cptime,) = explode(",", rtrim($line));
		$flag = true;
		break;
		}
	}
	closeFile($fp);

	if(!$flag) error(MSG001);

	$dat['continue_mode'] = true;
	if(!$cext || !is_file(IMG_DIR.$ctim.$cext)){//画像が無い時は処理しない
		error(MSG001);
	}
	//コンティニュー時は削除キーを常に表示
	$dat['passflag'] = true;
	//新規投稿で削除キー不要の時 true
	$dat['newpost_nopassword']= CONTINUE_PASS ? false : true;
	$dat['picfile'] = IMG_DIR.h($ctim).h($cext);
	$dat['picfile_name'] = h($ctim).h($cext);
	$dat['name']=h($name);
	$dat['sub']=h($sub);

	list($dat['picw'], $dat['pich']) = getimagesize($dat['picfile']);
	$dat['no'] = h($no);
	$dat['pch'] = h($ctim);
	$dat['ext'] = h($cext);
	//描画時間
	$cptime=is_numeric($cptime) ? h(calcPtime($cptime)) : h($cptime); 
	if(DSP_PAINTTIME) $dat['painttime'] = $cptime;
	$dat['ctype_img'] = true;
	$dat['ctype_pch'] = false;
	$pch_ext=check_pch_ext(PCH_DIR.$ctim,['upfile'=>true]);
	$dat['pch_ext']=$pch_ext;
	$dat['download_app_dat'] = true;
	$select_app = false;

	switch($pch_ext){
		case '.pch':
			$dat['ctype_pch'] = true;
			if(is_neo(PCH_DIR.$ctim.'.pch')){
				$app_to_use = "neo";
			}else{
				$app_to_use = "0";
			}
			break;

		case '.spch':
			$dat['ctype_pch'] = true;
			$app_to_use = "1";
			break;

		case '.chi':
			$app_to_use = 'chicken';
			break;

		case '.psd':
			$app_to_use = 'klecks';
			break;

		default :
			$select_app = true;
			$app_to_use = false;
			$dat['download_app_dat'] = false;
			break;
	}

	$dat = array_merge($dat,form());
	$arr_apps=app_to_use();

	$dat['select_app']= $select_app ? $dat['select_app'] : false;
	$dat['app_to_use']=($dat['paint'] && !$dat['select_app'] && !$app_to_use) ? $arr_apps[0]: $app_to_use;

	if(mime_content_type(IMG_DIR.$ctim.$cext)==='image/webp'){
		$dat['use_shi_painter'] = false; 
	}
	$dat['addinfo'] = $addinfo;

	htmloutput(PAINTFILE,$dat);
}

// コンティニュー認証
function check_cont_pass(){

	check_same_origin(true);

	$no = (string)filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');
	$pwd = $pwd ? $pwd : newstring($pwdc);
	$fp=fopen(LOGFILE,"r");
	while($line = fgets($fp)){
		if (strpos(trim($line) . ',', $no . ',') === 0) {

			list($cno,,,,,,,,$cpwd,,,,$ctime,,,,,,,$logver)
			= explode(",", trim($line).",,,,,,,,");

			if($cno == $no && check_password($pwd, $cpwd)
			&& check_elapsed_days($ctime,$logver)
			){
				closeFile($fp);
				return true;
			}
		}
	}
	closeFile($fp);
	error(MSG028);
}
function download_app_dat(){

	check_same_origin(true);

	$pwd=(string)newstring(filter_input(INPUT_POST,'pwd'));
	$pwdc = (string)newstring(filter_input(INPUT_COOKIE, 'pwdc'));
	$no=basename((string)filter_input(INPUT_POST,'no',FILTER_VALIDATE_INT));
	$pwd = $pwd ? $pwd : $pwdc;

	$cpwd='';
	$cno='';
	$ctime='';
	$flag = false;
	$fp=fopen(LOGFILE,"r");
	while($line = fgets($fp)){//記事ナンバーのログを取得		

		if(!trim($line)){
			continue;
		}
		if (strpos(trim($line) . ',', $no . ',') === 0) {
		list($cno,,,,,,,,$cpwd,,,,$ctime,) = explode(",", rtrim($line));
		$flag = true;
		break;
		}
	}
	closeFile($fp);
	if(!$flag) error(MSG001);
	if(!(($no===$cno)&&check_password($pwd,$cpwd,$pwd))){
		return error(MSG029);
	}
	$ctime=basename($ctime);
	$pchext = check_pch_ext(PCH_DIR.$ctime,['upfile'=>true]);
	if(!$pchext)error(MSG001);
	$pchext = basename($pchext);
	$filepath= PCH_DIR.$ctime.$pchext;
	$mime_content_type = mime_content_type($filepath);
	header('Content-Type: '.$mime_content_type);
	header('Content-Length: '.filesize($filepath));
	header('Content-Disposition: attachment; filename="'.h(basename($filepath)).'"');

	readfile($filepath);
 
}
// 編集画面
function editform(){
	global $addinfo,$fontcolors,$ADMIN_PASS;

	check_same_origin();

	//csrfトークンをセット
	$dat['token']=get_csrf_token();
	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=(string)filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(int)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);

	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)newstring(filter_input(INPUT_COOKIE, 'pwdc'));

	if (!is_array($del)) {
		error(MSG031);
	}

	sort($del);
	reset($del);
	$pwd = $pwd ? $pwd : $pwdc;
	$fp=fopen(LOGFILE,"r");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = FALSE;
	foreach($line as $value){
		if($value){
			list($no,,$name,$email,$sub,$com,$url,$ehost,$pass,,,,$time,,,$fcolor,,,,$logver) = explode(",", rtrim($value).",,,,,,,,");
			if ($no == $del[0] && check_password($pwd, $pass, $pwd)){
				$flag = TRUE;
				break;
			}
		}
	}
	closeFile($fp);
	if(!$flag) {
		error(MSG028);
	}
	if((!$pwd || $pwd!==$ADMIN_PASS) && !check_elapsed_days($time,$logver)){//指定日数より古い記事の編集はエラーにする
			error(MSG028);
	}

	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	$dat['usecom'] = USE_COM ? ' *' :'';
	$dat['upfile'] = false;
	
	$dat['post_mode'] = true;
	$dat['rewrite'] = $no;
	$dat['admin'] =($pwd && ($pwd===$ADMIN_PASS)) ? h($ADMIN_PASS):'';
	$dat['maxbyte'] = 0;//編集画面
	$dat['maxkb']   = 0;
	$dat['addinfo'] = $addinfo;
	$dat['use_url_input'] = USE_URL_INPUT_FIELD ? true : false;

	//名前とトリップを分離
	list($name,) = separateNameAndTrip($name);
	$dat['name'] = h(strip_tags($name));
	$dat['email'] = h(filter_var($email,FILTER_VALIDATE_EMAIL));
	$dat['sub'] = h(strip_tags($sub));
	$com = preg_replace("#<br( *)/?>#i","\n",$com); // <br>または<br />を改行へ戻す
	$dat['com'] = h($com);
	$dat['url'] = h(filter_var($url,FILTER_VALIDATE_URL));
	$dat['pwd'] = h($pwd);
	$dat['thread_no'] = h($thread_no);
	$dat['logfilename'] = h($logfilename);
	$dat['mode_catalog'] = h($mode_catalog);
	$dat['catalog_pageno'] = h($catalog_pageno);

	
	//文字色
	if(USE_FONTCOLOR){
		foreach ( $fontcolors as $fontcolor ){
			list($color,$name) = explode(",", $fontcolor);
			$chk = ($color == $fcolor);
			$dat['fctable'][] = compact('color','name','chk');
		}
		if(!$fcolor) $dat['fctable'][0]['chk'] = true; //値が無い場合、先頭にチェック
	}

	htmloutput(OTHERFILE,$dat);
}

// 記事上書き
function rewrite(){
global $ADMIN_PASS;

	//CSRFトークンをチェック
	check_csrf_token();

	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=(string)filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(string)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);
	
	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$url = USE_URL_INPUT_FIELD ? (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL) : '';
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$fcolor = (string)filter_input(INPUT_POST, 'fcolor');
	$no = (string)filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$admin = (string)filter_input(INPUT_POST, 'admin');

	$userip = get_uip();
	//ホスト取得
	$host = $userip ? gethostbyaddr($userip) : '';
	check_badhost();
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post();

	// 時間
	$date = now_date(time());//日付取得
	$date .= UPDATE_MARK;
	if(DISP_ID){
		$date .= " ID:" . getId($userip);
	}
	$date = str_replace(",", "&#44;", $date);//カンマをエスケープ

	//フォーマット
	$formatted_post = create_formatted_text_from_post($com,$name,$email,$url,$sub,$fcolor,$dest='');
	$com = $formatted_post['com'];
	$name = $formatted_post['name'];
	$email = $formatted_post['email'];
	$url = $formatted_post['url'];
	$sub = $formatted_post['sub'];
	$fcolor = $formatted_post['fcolor'];
	
	//ログ読み込み
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	// 記事上書き
	$flag = FALSE;
	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
		list($eno,$edate,$ename,,$esub,$ecom,$eurl,$ehost,$epwd,$ext,$w,$h,$time,$chk,$ptime,$efcolor,$pchext,$thumbnail,$tool,$logver,) = explode(",", rtrim($value).',,,,,,,');
		if($eno == $no && check_password($pwd, $epwd, $admin)){
			$date=DO_NOT_CHANGE_POSTS_TIME ? $edate : $date;
			if(!$name) $name = $ename;
			if(!$sub)  $sub  = $esub;
			if(!$com)  $com  = $ecom;
			if(!$fcolor) $fcolor = $efcolor;
			$tool=is_paint_tool_name($tool);
			$line[$i] = "$no,$date,$name,$email,$sub,$com,$url,$host,$epwd,$ext,$w,$h,$time,$chk,$ptime,$fcolor,$pchext,$thumbnail,$tool,$logver,";
			$flag = TRUE;
			break;
		}
	}
	if(!$flag){
		closeFile($fp);
		error(MSG028);
	}
	if((!$admin || $admin!==$ADMIN_PASS) && !check_elapsed_days($time,$logver)){//指定日数より古い記事の編集はエラーにする
		closeFile($fp);
		error(MSG028);
	}

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();

	$destination = $thread_no ? PHP_SELF.'?res='.h($thread_no) : ($logfilename ? './'.h($logfilename) : ($mode_catalog ? PHP_SELF.'?mode=catalog&page='.h($catalog_pageno) : h(PHP_SELF2)));

	redirect(
		$destination . (URL_PARAMETER ? "?".time() : ''),
		1,
		THE_SCREEN_CHANGES
	);
}
// 画像差し換え
function replace(){
	global $path,$temppath;

	$no = (string)filter_input(INPUT_GET, 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input(INPUT_GET, 'pwd'));
	$repcode = (string)newstring(filter_input(INPUT_GET, 'repcode'));
	$message="";
	$tool = "";
	$userip = get_uip();
	//ホスト取得
	$host = $userip ? gethostbyaddr($userip) : '';
	check_badhost();

	/*--- テンポラリ捜査 ---*/
	$find=false;
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		if(!is_dir($file) && preg_match("/\.(dat)\z/i",$file)) {
			$file=basename($file);
			$fp = fopen(TEMP_DIR.$file, "r");
			$userdata = fread($fp, 1024);
			fclose($fp);
			list($uip,$uhost,$uagent,$imgext,$ucode,$urepcode,$starttime,$postedtime,$uresto,$tool) = explode("\t", rtrim($userdata)."\t\t\t");//区切りの"\t"を行末に
			$file_name = pathinfo($file, PATHINFO_FILENAME );//拡張子除去
			$imgext=basename($imgext);
			//画像があり、認識コードがhitすれば抜ける
			if($file_name && is_file(TEMP_DIR.$file_name.$imgext) && $urepcode === $repcode){$find=true;break;}
		}
	}
	closedir($handle);
	if(!$find){//見つからなかった時は
		return paintcom();//通常のお絵かきコメント画面へ。
	}

	// 時間
	$time = (string)(time().substr(microtime(),2,3));
	$testexts=['.gif','.jpg','.png','.webp'];
	foreach($testexts as $testext){
		if(is_file(IMG_DIR.$time.$testext)){
			$time=(string)(substr($time,0,-3)+1).(string)substr($time,-3);
			break;
		}
	}
	$time = is_file($temppath.$time.'.tmp') ? (string)(substr($time,0,-3)+1).(string)substr($time,-3) :$time;
	$time = basename($time);
	$date = now_date(time());//日付取得
	$date .= UPDATE_MARK;
	//描画時間を$userdataをもとに計算
	$psec='';
	$_ptime = '';
	$thumbnail="";

	if($starttime && is_numeric($starttime) && $postedtime && is_numeric($postedtime)){
		$psec=(int)$postedtime-(int)$starttime;
		$_ptime = calcPtime($psec);
	}

	//ログ読み込み
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	// 記事上書き
	$flag = false;
	$pwd=hex2bin($pwd);//バイナリに
	$pwd=openssl_decrypt($pwd,CRYPT_METHOD, CRYPT_PASS, true, CRYPT_IV);//復号化
	$oyano='';
	$src='';
	$upfile='';

	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
		list($eno,$edate,$name,$email,$sub,$com,$url,$ehost,$epwd,$ext,$_w,$_h,$etim,,$ptime,$fcolor,$epchext,$ethumbnail,$etool,$logver,) = explode(",", rtrim($value).',,,,,,,');
	//画像差し替えに管理パスは使っていない
		if($eno === $no && check_password($pwd, $epwd)){
			$tp=fopen(TREEFILE,"r");
			while($tree=fgets($tp)){
				if (strpos(',' . trim($tree) . ',',',' . $no . ',') !== false) {
					list($oyano,) = explode(',', trim($tree));
					break;
				}
			}
			fclose($tp);

			if(!check_elapsed_days($etim,$logver)||!$oyano){//指定日数より古い画像差し換えは新規投稿にする
				closeFile($fp);
				return paintcom();
			}

			$upfile = $temppath.$file_name.$imgext;
			$dest = $temppath.$time.'.tmp';
			
			//サポートしていないフォーマットならエラーが返る
			getImgType($upfile);
			copy($upfile, $dest);
			
			if(!is_file($dest)) error(MSG003);
			chmod($dest,PERMISSION_FOR_DEST);

			//pngをjpegに変換してみてファイル容量が小さくなっていたら元のファイルを上書き
			convert_andsave_if_smaller_png2jpg($dest);
		
			//サポートしていないフォーマットならエラーが返る
			$imgext = getImgType($dest);

			$chk = md5_file($dest);
			check_badfile($chk, $dest); // 拒絶画像チェック

			list($w, $h) = getimagesize($dest);
	
			chmod($dest,PERMISSION_FOR_DEST);
			rename($dest,$path.$time.$imgext);

			$message = UPLOADED_OBJECT_NAME.UPLOAD_SUCCESSFUL;

			$oya=($oyano===$no);
			$max_w = $oya ? MAX_W : MAX_RESW ;
			$max_h = $oya ? MAX_H : MAX_RESH ;
			list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);
	
			//サムネイル作成
			if(USE_THUMB){
				if(thumb($path,$time,$imgext,$max_w,$max_h)){
				$thumbnail="thumbnail";
				}
			}
			//PCHファイルアップロード
			// .pch, .spch,.chi,.psd ブランク どれかが返ってくる
			if ($pchext = check_pch_ext($temppath . $file_name,['upfile'=>true])) {
				$src = $temppath . $file_name . $pchext;
				$dst = PCH_DIR . $time . $pchext;
				if(copy($src, $dst)){
					chmod($dst, PERMISSION_FOR_DEST);
				}
			}
			
			//ID付加
			if(DISP_ID){
				$date .= " ID:" . getId($userip);
			}
			//描画時間追加
			if($ptime && $_ptime){
				$ptime = is_numeric($ptime) ? ($ptime+$psec) : $ptime.'+'.$_ptime;
			}
			//カンマをエスケープ
			$date = str_replace(",", "&#44;", $date);
			$ptime = $ptime ? str_replace(",", "&#44;", $ptime):'';
			$date=DO_NOT_CHANGE_POSTS_TIME ? $edate : $date;
			$tool = is_paint_tool_name($tool); 
			$line[$i] = "$no,$date,$name,$email,$sub,$com,$url,$host,$epwd,$imgext,$w,$h,$time,$chk,$ptime,$fcolor,$pchext,$thumbnail,$tool,6,";
			$flag = true;

			break;
		}
	}
	if(!$flag){
		closeFile($fp);
		return error(MSG028);
	}

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();

	//旧ファイル削除
	delete_files($path, $etim, $ext);

	//ワークファイル削除
	safe_unlink($src);
	safe_unlink($upfile);
	safe_unlink($temppath.$file_name.".dat");

	redirect(
		//$oyanoがFalseの時は新規投稿になるので分岐不要
		PHP_SELF.'?res='.h($oyano) . '#'.$time,
		1,
		$message,
		THE_SCREEN_CHANGES
	);
}

// カタログ
function catalog(){

	$page = (int)filter_input(INPUT_GET, 'page',FILTER_VALIDATE_INT);

	$trees=get_log(TREEFILE);

	$counttree = count($trees);

	$disp_threads = array_slice($trees,(int)$page,CATALOG_PAGE_DEF,false);
	$treeline=[];
	foreach($disp_threads as $val){
		$treeline[]=explode(",", trim($val))[0];
	}
	$fp=fopen(LOGFILE,"r");
	$line = create_line_from_treenumber ($fp,$treeline);
	closeFile($fp);
	$lineindex = get_lineindex($line); // 逆変換テーブル作成

	$dat = form();

	foreach($treeline as $oya=>$disptree){

		if(!isset($lineindex[$disptree])) continue; //範囲外なら次の行
		$j=$lineindex[$disptree]; //該当記事を探して$jにセット

		$res = create_res($line[$j]);
		// カタログ専用ロジック
		if ($res['img_file_exists']) {
			if($res['w'] && $res['h']){
				if($res['w'] > CATALOG_W){
					$res['h'] = ceil($res['h'] * (CATALOG_W / $res['w']));//端数の切り上げ
					$res['w'] = CATALOG_W; //画像幅を揃える
				}
			}else{//ログに幅と高さが記録されていない時
				$res['w'] = CATALOG_W;
				$res['h'] = '';
			}
		}
		
		$res['txt'] = !$res['img_file_exists']; // 画像が無い時
		$res['rescount'] = count($treeline) - 1;
		// 記事格納
		$dat['oya'][$oya][] = $res;
	}

	$prev = $page - CATALOG_PAGE_DEF;
	$next = $page + CATALOG_PAGE_DEF;
	// 改ページ処理
	$dat['prev'] = false;
	if($prev >= 0){
		$dat['prev'] = PHP_SELF.'?mode=catalog&amp;page='.$prev;
	}
	$dat['next'] = false;
	if($next<$counttree){
		$dat['next'] = PHP_SELF.'?mode=catalog&amp;page='.$next;
	}
		
	$paging = "";

	$totalpages = ceil($counttree / CATALOG_PAGE_DEF)-1;
	for($l = 0; $l < $counttree; $l += (CATALOG_PAGE_DEF*30)){

		$start_page=$l;
		$end_page=$l+(CATALOG_PAGE_DEF*31);//現在のページよりひとつ後ろのページ
		if($page-(CATALOG_PAGE_DEF*30)<=$l){break;}//現在ページより1つ前のページ
	}
	for($i = $start_page; ($i < $counttree && $i <= $end_page) ; $i += CATALOG_PAGE_DEF){
	
		$pn = $i / CATALOG_PAGE_DEF;
		
		if($i === $end_page){//特定のページに代入される記号 エンド
			$rep_page_no="≫";
		}elseif($i!==0 && $i == $start_page){//スタート
			$rep_page_no="≪";
		}else{//ページ番号
			$rep_page_no=$pn;
		}
		$paging .= ($page === $i)
		? str_replace("<PAGE>", $pn, NOW_PAGE)
		: str_replace("<PURL>", PHP_SELF."?mode=catalog&amp;page=".$i,
		str_replace("<PAGE>", $rep_page_no , OTHER_PAGE));
		$dat['lastpage'] = (($end_page/CATALOG_PAGE_DEF) <= $totalpages) ? "?mode=catalog&amp;page=".$totalpages*CATALOG_PAGE_DEF : "";
		$dat['firstpage'] = (0 < $start_page) ? PHP_SELF."?mode=catalog&page=0" : "";
	}
	//改ページ分岐ここまで
	$dat['paging'] = $paging;
	$dat["resno"]=false;
	$dat["resto"]=false;//この変数使用しているテーマのエラー対策

	$dat['catalog_pageno']=h($page);
	$dat['mode_catalog']=true;

	htmloutput(CATALOGFILE,$dat);
}

// 文字コード変換 
function charconvert($str){
	mb_language(LANG);
		return mb_convert_encoding($str, "UTF-8", "auto");
}

// NGワードがあれば拒絶
function Reject_if_NGword_exists_in_the_post(){
	global $badstring,$badname,$badurl,$badstr_A,$badstr_B,$pwd,$ADMIN_PASS,$admin;

	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG006);

	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$url = (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$pwd = (string)filter_input(INPUT_POST, 'pwd');

	$com_len=strlen((string)$com);
	$name_len=strlen((string)$name);
	$email_len=strlen((string)$email);
	$sub_len=strlen((string)$sub);
	$url_len=strlen((string)$url);
	$pwd_len=strlen((string)$pwd);

	if($com_len && ($com_len > MAX_COM)) error(MSG011);
	if($name_len && ($name_len > MAX_NAME)) error(MSG012);
	if($email_len && ($email_len > MAX_EMAIL)) error(MSG013);
	if($sub_len && ($sub_len > MAX_SUB)) error(MSG014);
	if($url_len && ($url_len > 200)) error(MSG015);
	if($pwd_len && ($pwd_len > 72)) error(MSG015);

	//チェックする項目から改行・スペース・タブを消す

	$chk_com  = $com_len ? preg_replace("/\s/u", "", $com ) : '';
	$chk_name = $name_len ? preg_replace("/\s/u", "", $name ) : '';
	$chk_email = $email_len ? preg_replace("/\s/u", "", $email ) : '';
	$chk_url = $url_len ? preg_replace("/\s/u", "", $url ) : '';
	$chk_sub = $sub_len ? preg_replace("/\s/u", "", $sub ) : '';

	//本文に日本語がなければ拒絶
	if (USE_JAPANESEFILTER) {
		mb_regex_encoding("UTF-8");
		if ($com_len && !preg_match("/[ぁ-んァ-ヶー一-龠]+/u",$chk_com)) error(MSG035);
	}

	//本文へのURLの書き込みを禁止
	if(!(($pwd&&$pwd===$ADMIN_PASS)||($admin&&($admin===$ADMIN_PASS)))){//どちらも一致しなければ
		if(DENY_COMMENTS_URL && preg_match('/:\/\/|\.co|\.ly|\.gl|\.net|\.org|\.cc|\.ru|\.su|\.ua|\.gd/i', $com)) error(MSG036);
	}

	// 使えない文字チェック
	if (is_ngword($badstring, [$chk_com, $chk_name,$chk_email,$chk_sub,$chk_url])) {
		error(MSG032);
	}

	// 使えない名前チェック
	if (is_ngword($badname, $chk_name)) {
		error(MSG037);
	}
	// 使えないurlチェック
	if (is_ngword($badurl, $chk_url)) {
		error(MSG048);
	}

	//指定文字列が2つあると拒絶
	$bstr_A_find = is_ngword($badstr_A, [$chk_com, $chk_sub, $chk_name, $chk_email]);
	$bstr_B_find = is_ngword($badstr_B, [$chk_com, $chk_sub, $chk_name, $chk_email]);
	if($bstr_A_find && $bstr_B_find){
		error(MSG032);
	}

}

//POSTされた入力をチェックしてログファイルに格納する書式にフォーマット
function create_formatted_text_from_post($com,$name,$email,$url,$sub,$fcolor,$dest=''){

	//入力チェック
	if(!$com||preg_match("/\A\s*\z/u",$com)) $com="";
	if(!$name||preg_match("/\A\s*\z/u",$name)) $name="";
	if(!$sub||preg_match("/\A\s*\z/u",$sub))   $sub="";
	if(!$url||!filter_var($url,FILTER_VALIDATE_URL)||!preg_match('{\Ahttps?://}', $url)) $url="";
		$name = str_replace("◆", "◇", $name);
	$sage=(stripos($email,'sage')!==false);//メールをバリデートする前にsage判定
	$email = filter_var($email, FILTER_VALIDATE_EMAIL);
	if(USE_NAME&&!$name) error(MSG009,$dest);
	if(USE_COM&&!$com) error(MSG008,$dest);
	if(USE_SUB&&!$sub) error(MSG010,$dest);

	// 改行コード
	$com = str_replace(["\r\n","\r"], "\n", $com);
	$com = preg_replace("/(\s*\n){4,}/u","\n",$com); //不要改行カット
	$com = newstring($com);	//コメントのエスケープ
	$com = nl2br($com);	//改行文字の前に HTMLの改行タグ
	$url = str_replace(",", "", $url);

	//トリップ(名前の後ろの#と文字列をもとに生成)
	if(preg_match("/(#|＃)(.*)/",$name,$regs)){
		$cap = $regs[2];
		$cap=strtr($cap,"&amp;", "&");
		$cap=strtr($cap,"&#44;", ",");
		$name=preg_replace("/(#|＃)(.*)/","",$name);
		$salt=substr($cap."H.",1,2);
		$salt=preg_replace("/[^\.-z]/",".",$salt);
		$salt=strtr($salt,":;<=>?@[\\]^_`","ABCDEFGabcdef");
		$trip="◆".substr(crypt($cap,$salt),-10);
		$trip = strtr($trip,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~\t","ABCDEFGHIJKLMNOabcdefghijklmno");
		$name.=$trip;
	}

	$formatted_post = [//コメント以外のエスケープと配列への格納
		'com' => $com,
		'name' => newstring($name),
		'email' => newstring($email),
		'sage' => newstring($sage),
		'url' => newstring($url),
		'sub' => newstring($sub),
		'fcolor' => newstring($fcolor),
	];
	foreach($formatted_post as $key => $val){
		$formatted_post[$key]=str_replace(["\r\n","\n","\r","\t"],"",$val);//改行コード一括除去
	}
	
	return $formatted_post;
}

// HTML出力
function htmloutput($template,$dat,$buf_flag=''){

	$views = __DIR__ . '/templates/'.SKIN_DIR;
	$cache = $views.'cache';
	$blade = new BladeOne($views,$cache,BladeOne::MODE_AUTO);

	$dat += basicpart();//basicpart()で上書きしない
	//array_merge()ならbasicpart(),$datの順
	if($buf_flag){
		$buf=$blade->run($template,$dat);
		return $buf;
	}
	echo $blade->run($template,$dat);

}

function redirect ($url, $wait = 0, $message1 = '',$message2 = '') {
	header("Content-type: text/html; charset=UTF-8");
	echo '<!DOCTYPE html>'
		. '<html lang="ja"><head>'
		. '<meta http-equiv="refresh" content="' . (int)h($wait) . '; URL=' . h($url) . '">'
		. '<meta name="robots" content="noindex,nofollow">'
		. '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">'
		. '<meta charset="UTF-8"><title></title></head>'
		. '<body>' . h($message1).($message1 ? '<br><br>':'').h($message2). '</body></html>';
	exit;
}

function getImgType ($dest) {

	$img_type=mime_content_type($dest);

	switch ($img_type) {
		case "image/gif" : return ".gif";
		case "image/jpeg" : return ".jpg";
		case "image/png" : return ".png";
		case "image/webp" : return ".webp";
		default : return error(MSG004, $dest);
	}
	
}
//縮小表示
function image_reduction_display($w,$h,$max_w,$max_h){
	$reduced_size=[];
	if($w > $max_w || $h > $max_h){
		$key_w = $max_w / $w;
		$key_h = $max_h / $h;
		($key_w < $key_h) ? ($keys = $key_w) : ($keys = $key_h);
		$w=ceil($w * $keys);
		$h=ceil($h * $keys);
	}
	$reduced_size = [$w,$h];
	return $reduced_size;
}


/**
 * 描画時間を計算
 * @param $starttime
 * @return string
 */
function calcPtime ($psec) {

	$D = floor($psec / 86400);
	$H = floor($psec % 86400 / 3600);
	$M = floor($psec % 3600 / 60);
	$S = $psec % 60;

	return
		($D ? $D . PTIME_D : '')
		. ($H ? $H . PTIME_H : '')
		. ($M ? $M . PTIME_M : '')
		. ($S ? $S . PTIME_S : '');
}

/**
 * pchかspchか、それともファイルが存在しないかチェック
 * @param $filepath
 * @return string
 */
function check_pch_ext ($filepath,$options = []) {
	
	$exts=[".pch",".spch",".tgkr",".chi",".psd"];

	foreach($exts as $i => $ext){

		if (is_file($filepath . $ext)) {
			if(!in_array(mime_content_type($filepath . $ext),["application/octet-stream","application/gzip","image/vnd.adobe.photoshop"])){
				return '';
			}
			return $ext;
		}
		if(!isset($options['upfile']) && $i === 2){
			return '';
		}
	}
	return '';
}

/**
 * ファイルがあれば削除
 * @param $path
 * @return bool
 */
function safe_unlink ($path) {
	if ($path && is_file($path)) {
		chmod($path,PERMISSION_FOR_DEST);
		return unlink($path);
	}
	return false;
}

/**
 * 一連の画像ファイルを削除（元画像、サムネ、動画）
 * @param $path
 * @param $filename
 * @param $ext
 */
function delete_files ($path, $filename, $ext) {
	safe_unlink($path.$filename.$ext);
	safe_unlink(THUMB_DIR.$filename.'s.jpg');
	safe_unlink(PCH_DIR.$filename.'.pch');
	safe_unlink(PCH_DIR.$filename.'.spch');
	safe_unlink(PCH_DIR.$filename.'.chi');
	safe_unlink(PCH_DIR.$filename.'.psd');
	safe_unlink(PCH_DIR.$filename.'.tgkr');
}

/**
 * NGワードチェック
 * @param $ngwords
 * @param string|array $strs
 * @return bool
 */
function is_ngword ($ngwords, $strs) {
	if (empty($ngwords)||empty($strs)) {
		return false;
	}
	if (!is_array($strs)) {
		$strs = [$strs];
	}
	foreach($ngwords as $i => $ngword){//拒絶する文字列
		$ngwords[$i]  = str_replace([" ", "　"], "", $ngword);
		$ngwords[$i]  = str_replace("/", "\/", $ngwords[$i]);
	}
	foreach ($strs as $str) {
		foreach($ngwords as $ngword){//拒絶する文字列
			if ($ngword !== '' && preg_match("/{$ngword}/ui", $str)){
				return true;
			}
		}
	}
	return false;
}

//png2jpg
function png2jpg ($src) {
	global $temppath;
	if(mime_content_type($src)!=="image/png" || !gd_check() ||!function_exists("ImageCreateFromPNG")){
		return;
	}
	//pngならJPEGに変換
	if($im_in=ImageCreateFromPNG($src)){
		if(function_exists("ImageCreateTrueColor") && function_exists("ImageColorAlLocate") &&
		function_exists("imagefill") && function_exists("ImageCopyResampled")){
			list($out_w, $out_h)=getimagesize($src);
			$im_out = ImageCreateTrueColor($out_w, $out_h);
			$background = ImageColorAlLocate($im_out, 0xFF, 0xFF, 0xFF);//背景色を白に
			imagefill($im_out, 0, 0, $background);
			ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $out_w, $out_h);
		}else{
			$im_out=$im_in;
		}
		$dst = $temppath.pathinfo($src, PATHINFO_FILENAME ).'.jpg.tmp';
		ImageJPEG($im_out,$dst,98);
		ImageDestroy($im_in);// 作成したイメージを破棄
		ImageDestroy($im_out);// 作成したイメージを破棄
		chmod($dst,PERMISSION_FOR_DEST);
		if(is_file($dst)){
			return $dst;
		}
	}
	return;
}

//pngをjpegに変換してみてファイル容量が小さくなっていたら元のファイルを上書き
function convert_andsave_if_smaller_png2jpg($dest,$is_upload=false){
	clearstatcache();
	$fsize_dest=filesize($dest);
	if(($is_upload && ($fsize_dest > (IMAGE_SIZE * 1024))) || ($fsize_dest > (MAX_KB * 1024))){//指定サイズを超えていたら

		if ($im_jpg = png2jpg($dest)) {
			if(filesize($im_jpg)<$fsize_dest){//JPEGのほうが小さい時だけ
				rename($im_jpg,$dest);//JPEGで保存
				chmod($dest,PERMISSION_FOR_DEST);
			} else{//PNGよりファイルサイズが大きくなる時は
				unlink($im_jpg);//作成したJPEG画像を削除
			}
		}
	}
}
//Exifをチェックして画像が回転している時と位置情報が付いている時は上書き保存
function check_jpeg_exif($dest){

	if((exif_imagetype($dest) !== IMAGETYPE_JPEG ) || !function_exists("imagecreatefromjpeg")){
		return;
	}
	//画像回転の検出
	$exif = exif_read_data($dest);
	$orientation = isset($exif["Orientation"]) ? $exif["Orientation"] : 1;
	//位置情報はあるか?
	$gpsdata_exists =(isset($exif['GPSLatitude']) && isset($exif['GPSLongitude'])); 

	if ($orientation === 1 && !$gpsdata_exists) {
	//画像が回転していない、位置情報も存在しない時
		return;
	}

	list($w,$h) = getimagesize($dest);

	$im_in = imagecreatefromjpeg($dest);
	if(!$im_in){
		return;
	}
	switch ($orientation) {
		case 3:
			$im_in = imagerotate($im_in, 180, 0);
			break;
		case 6:
			$im_in = imagerotate($im_in, -90, 0);
			break;
		case 8:
			$im_in = imagerotate($im_in, 90, 0);
			break;
		default:
			break;
	}
	if(!$im_in){
		return;
	}
	if ($orientation === 6 || $orientation === 8) {
		// 90度または270度回転の場合、幅と高さを入れ替える
		list($w, $h) = [$h, $w];
	}
	$w_ratio = MAX_W_PX / $w;
	$h_ratio = MAX_H_PX / $h;
	$ratio = min($w_ratio, $h_ratio);
	$out_w = ceil($w * $ratio);//端数の切り上げ
	$out_h = ceil($h * $ratio);
	$im_out = $im_in;//縮小しない時
	//JPEG形式で何度も保存しなおすのを回避するため、
	//指定範囲内にリサイズしておく。
	if(function_exists("ImageCreateTrueColor") && function_exists("ImageCopyResampled")){
		$im_out = ImageCreateTrueColor($out_w, $out_h);
		ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
	}
	// 画像を保存
	imagejpeg($im_out, $dest,98);
	// 画像のメモリを解放
	imagedestroy($im_in);
	imagedestroy($im_out);

	if(!is_file($dest)){
		error(MSG003,$dest);
	}
}

function check_badhost () {
	global $badip;
	$userip = get_uip();
	$host = $userip ? gethostbyaddr($userip) :'';

	if($host === $userip){//ホスト名がipアドレスになる場合は
		foreach($badip as $value){
			if (preg_match("/\A$value/i",$host)) {//前方一致
			return error(MSG016);
			}
		}
		return false;
	}else{
		foreach($badip as $value){
			if (preg_match("/$value\z/i",$host)) {
			return error(MSG016);
			}
		}
		return false;
	}
}

function check_badfile ($chk, $dest = '') {
	global $badfile;
	foreach($badfile as $value){
		if(preg_match("/\A$value/",$chk)){
			error(MSG005,$dest); //拒絶画像
		}
	}
}
function h($str){//出力のエスケープ
	if($str===0 || $str==='0'){
		return '0';
	}
	if(!$str){
		return '';
	}
	return htmlspecialchars((string)$str,ENT_QUOTES,'utf-8',false);
}

function create_res ($line, $options = []) {
	global $path;

	list($no,$date,$name,$email,$sub,$com,$url,$host,$pwd,$ext,$w,$h,$time,$chk,$ptime,$fcolor,$pchext,$thumbnail,$tool,$logver)
	= explode(",", rtrim($line).',,,,,,,');//追加のカンマfutaba.phpのログ読み込み時のエラー回避
	$three_point_sub=(mb_strlen($sub)>12) ? '…' :'';
	$res = [
		'w' => ($w && is_numeric($w)) ? $w :'',
		'h' => ($h && is_numeric($h)) ? $h :'',
		'no' => (int)$no,
		'sub' => strip_tags($sub),
		'substr_sub' => mb_substr(strip_tags(($sub)),0,12).$three_point_sub,
		'url' => $url ? filter_var($url,FILTER_VALIDATE_URL):'',
		'email' => $email ? filter_var($email, FILTER_VALIDATE_EMAIL) : '',
		'ext' => $ext,
		'time' => $time,
		'fontcolor' => $fcolor ? $fcolor : DEF_FONTCOLOR, //文字色
		'not_deleted' => !(!$name && !$email && !$url && !$com && !$ext),//｢この記事はありません｣で使用
		'logver' => $logver,
	];
	$res['imgsrc']='';
	// 画像系変数セット
	//初期化
	$res['tool'] = '';
	$res['src'] = '';
	$res['srcname'] = '';
	$res['size'] = '';
	$res['size_kb'] = '';
	$res['thumb'] = '';
	$res['imgsrc'] = '';
	$res['painttime'] = '';
	$res['spch']='';
	$res['pch'] = '';
	$res['continue'] ='';

	$res['img'] = $path.$time.$ext; // 画像ファイル名
	if ($res['img_file_exists'] = ($ext && is_file($res['img']))) { // 画像ファイルがある場合
		$res['src'] = IMG_DIR.$time.$ext;
		$res['srcname'] = $time.$ext;
		$filesize = filesize($res['img']);
		$res['size'] = $filesize;
		$res['size_kb'] = ($filesize-($filesize % 1024)) / 1024;
		$res['thumb'] = ($logver === "6") ? ($thumbnail==="thumbnail") : is_file(THUMB_DIR.$time.'s.jpg');
		$res['imgsrc'] = $res['thumb'] ? THUMB_DIR.$time.'s.jpg' : $res['src'];
		$tool=($tool==="shi-Painter") ? "Shi-Painter" : $tool; 
		$res['tool'] = is_paint_tool_name($tool);
		//描画時間
		$ptime=is_numeric($ptime) ? calcPtime($ptime) : $ptime; 
		$res['painttime'] = DSP_PAINTTIME ? $ptime : '';
		//動画リンク
		if($logver === "6"){
			$pch_ext= $pchext && in_array($pchext, ['.pch','.spch','.tgkr']) ? $pchext :'';
		}else{
			$pch_ext= isset($options['pch']) ? check_pch_ext(PCH_DIR.$time) : '';
		}
		$res['spch']=($pch_ext==='.spch');
		$res['pch'] = (USE_ANIME && $pch_ext) ? $time.$ext : '';
		
		//コンティニュー
		$res['continue'] = USE_CONTINUE ? (check_elapsed_days($time,$logver) ? $res['no'] : '') :'';
	}

	//日付とIDを分離
	
	list($res['id'], $res['now']) = separateDatetimeAndId($date);
	//日付と編集マークを分離
	list($res['now'], $res['updatemark']) = separateDatetimeAndUpdatemark($res['now']);
	//名前とトリップを分離
	list($res['name'], $res['trip']) = separateNameAndTrip($name);
	$res['name']=strip_tags($res['name']);
	$res['encoded_no'] = urlencode($res['no']);
	$res['encoded_name'] = urlencode($res['name']);
	$res['share_name'] = encode_for_share($res['name']);
	$res['share_sub'] = encode_for_share($res['sub']);
	$res['encoded_t'] = encode_for_share('['.$no.']'.$res['sub'].($res['name'] ? ' by '.$res['name'] : '').' - '.TITLE);
	$res['encoded_u'] = urlencode(ROOT_URL.PHP_SELF.'?res='.$res['no']);
	 

	$com = preg_replace("#<br( *)/?>#i","\n",$com); //<br />を改行に戻す
	$res['com']=strip_tags($com);//タグ除去
	foreach($res as $key => $val){
		$res[$key]=h($val);//エスケープ
	}
	//マークダウン記法のリンクをHTMLに変換
	if(MD_LINK){
		$res['com'] = md_link($res['com']);
	}
	// オートリンク
	if(AUTOLINK) {
		$res['com'] = auto_link($res['com']);
	}
	$res['com']=nl2br($res['com'],false);//改行を<br>へ
	$res['com'] = preg_replace("/(^|>)((&gt;|＞)[^<]*)/i", "\\1".RE_START."\\2".RE_END, $res['com']); // '>'色設定
	return $res;
}
//Tweet
function encode_for_share($str){
	$str = str_replace("&#44;",",", $str);
	$str = htmlspecialchars_decode((string)$str, ENT_QUOTES);
	return h(urlencode($str));
}

function saveimage(){
	
	$tool=filter_input(INPUT_GET,"tool");

	$image_save = new image_save;

	header('Content-type: text/plain');

	switch($tool){
		case "neo":
			$image_save->save_neo();
			break;
		case "chi":
			$image_save->save_chickenpaint();
			break;
		case "klecks":
			$image_save->save_klecks();
			break;
		case "tegaki":
			$image_save->save_klecks();
			break;
	}

}


/**
 * 日付とIDを分離
 * @param $date
 * @return array
 */
function separateDatetimeAndId ($date) {
	if (preg_match("/( ID:)(.*)/", $date, $regs)){
		return [$regs[2], preg_replace("/( ID:.*)/","",$date)];
	}
	return ['', $date];
}

/**
 * 名前とトリップを分離
 * @param $name
 * @return array
 */
function separateNameAndTrip ($name) {
	$name=strip_tags($name);//タグ除去
	if(preg_match("/(◆.*)/", $name, $regs)){
		return [preg_replace("/(◆.*)/","",$name), $regs[1]];
	}
	return [$name, ''];
}

/**
 * 日付と編集マークを分離
 * @param $date
 * @return array
 */
function separateDatetimeAndUpdatemark ($date) {
	if (UPDATE_MARK && strpos($date, UPDATE_MARK) !== false){
		return [str_replace(UPDATE_MARK,"",$date), UPDATE_MARK];
	}
	return [$date, ''];
}

// 一括書き込み（上書き）
function writeFile ($fp, $data) {
	ftruncate($fp,0);
	rewind($fp);
	stream_set_write_buffer($fp, 0);
	fwrite($fp, $data);
}

function closeFile ($fp) {
	if($fp){
		fflush($fp);
		flock($fp, LOCK_UN);
		fclose($fp);
	}
}

function getId ($userip) {
	return substr(hash('sha256', $userip.ID_SEED, false),-8);
}

// 古いスレッドへの投稿を許可するかどうか
function check_elapsed_days ($microtime,$logver=false) {

	$time = microtime2time($microtime,$logver);

	return ELAPSED_DAYS //古いスレッドのフォームを閉じる日数が設定されていたら
		? ((time() - $time)) <= ((int)ELAPSED_DAYS * 86400) // 指定日数以内なら許可
		: true; // フォームを閉じる日数が未設定なら許可
}
//マイクロ秒を秒に戻す
function microtime2time($microtime,$logver){

	return $logver==="6" ? (int)substr($microtime,0,-3) :
	(int)(strlen($microtime)>12 ? substr($microtime,-13,-3) : (int)$microtime);
}

//逆変換テーブル作成
function get_lineindex ($line){
	$lineindex = [];
	foreach($line as $i =>$value){
		if(!trim($value)){
		continue;
		}
		list($no,) = explode(",", $value);
		if(!is_numeric($no)){//記事Noが正しく読み込まれたかどうかチェック
			error(MSG019);
		};
		$lineindex[$no] = $i; // 値にkey keyに記事no
	}
	return $lineindex;
}

function check_password ($pwd, $hash, $adminPass = false) {
	global $ADMIN_PASS;
	return
		($pwd && (password_verify($pwd, $hash)))
		|| ($pwd && ($hash === substr(md5($pwd), 2, 8)))
		|| ($adminPass && $ADMIN_PASS && ($adminPass === $ADMIN_PASS)); // 管理パスを許可する場合
}
function is_neo($src) {//neoのPCHかどうか調べる
	$fp = fopen("$src", "rb");
	$is_neo=(fread($fp,3)==="NEO");
	fclose($fp);
	return $is_neo;
}
//使用するペイントアプリの配列化
function app_to_use(){

	$arr_apps=[];
		if(USE_PAINTBBS_NEO){
			$arr_apps[]='neo';
		}
		if(USE_TEGAKI){
			$arr_apps[]='tegaki';
		}
		if(USE_SHI_PAINTER){
			$arr_apps[]='1';
		}
		if(USE_CHICKENPAINT){
			$arr_apps[]='chicken';
		}
		if(USE_KLECKS){
			 $arr_apps[]='klecks';
		}
		return $arr_apps;
	}

//pchデータの幅と高さ
get_pch_size($pch);
function get_pch_size($src) {
	if(!$src){
		return;
	}
	$fp = fopen("$src", "rb");
	$is_neo=(fread($fp,3)==="NEO");//ファイルポインタが3byte移動
	$pch_data=bin2hex(fread($fp,8));
	fclose($fp);
	if(!$pch_data){
		return;
	}
	$width=null;
	$height=null;
	if($is_neo){
		$w0=hexdec(substr($pch_data,2,2));
		$w1=hexdec(substr($pch_data,4,2));
		$h0=hexdec(substr($pch_data,6,2));
		$h1=hexdec(substr($pch_data,8,2));
	}else{
		if(mime_content_type($src)!=="application/gzip"){
			return;
		}
		$w0=hexdec(substr($pch_data,6,2));
		$w1=hexdec(substr($pch_data,8,2));
		$h0=hexdec(substr($pch_data,10,2));
		$h1=hexdec(substr($pch_data,12,2));
	}
	if(!is_numeric($w0)||!is_numeric($w1)||!is_numeric($h0)||!is_numeric($h1)){
		return;
	}
	$width=(int)$w0+((int)$w1*256);
	$height=(int)$h0+((int)$h1*256);
	if(!$width||!$height){
		return;
	}
	return[(int)$width,(int)$height];
}
//spchデータの幅と高さ
function get_spch_size($src) {
	if(!$src){
		return;
	}
	if(mime_content_type($src)!=="application/octet-stream"){
		return;
	}
	$lines=[];
	$width=null;
	$height=null;
	$i=0;
	$fp=fopen($src,"rb");
		while($line = fgets($fp)){
			if(!trim($line)){
				continue;
			}
			$lines[]=trim($line);
			if($i>6){
				break;
			}
		++$i;
		}
	foreach($lines as $str){
	parse_str($str, $output);
	if(isset($output['image_width'])){
		$width=$output['image_width'];
	}
	if(isset($output['image_height'])){
		$height=$output['image_height'];
	}
	}
	if(!is_numeric($width)||!is_numeric($height)){
		return;
	}
	if(!$width||!$height){
		return;
	}
	return[(int)$width,(int)$height];
}
//表示用のログファイルを取得
function get_log($logfile) {
	if(!$logfile){
		return error(MSG019);
	}
	$lines=[];
	$fp=fopen($logfile,"r");
	while($line = fgets($fp)){
		if(!trim($line)){
			continue;
		}
		$lines[]=$line;
	}
	closeFile($fp);
	
	if(empty($lines)){
		return error(MSG019);
	}
	return $lines;
}

//パスワードを5回連続して間違えた時は拒絶
function check_password_input_error_count(){
	global $ADMIN_PASS;
	if(!CHECK_PASSWORD_INPUT_ERROR_COUNT){
		return;
	}
	$userip = get_uip();
	check_dir(__DIR__.'/templates/errorlog/');
	$arr_err=is_file(__DIR__.'/templates/errorlog/error.log') ? file(__DIR__.'/templates/errorlog/error.log'):[];
	if(count($arr_err)>=5){
		error(MSG049);
	}
if(!$ADMIN_PASS || $ADMIN_PASS!==filter_input(INPUT_POST,'pass')){
	$errlog=$userip."\n";
	file_put_contents(__DIR__.'/templates/errorlog/error.log',$errlog,FILE_APPEND);
	chmod(__DIR__.'/templates/errorlog/error.log',0600);
	}else{
		safe_unlink(__DIR__.'/templates/errorlog/error.log');
	}
}

function isIE() {
	$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
    return (bool) strpos($userAgent, 'MSIE') || (bool) strpos($userAgent, 'Trident/');
}
function not_support_async_await(){

	if(isIE()){
		return true;
	}
	$userAgent = $_SERVER['HTTP_USER_AGENT'];
	if (strpos($userAgent, 'Firefox/') !== false) {
		$matches = [];
		preg_match('/Firefox\/(\d+)/', $userAgent, $matches);
		if (isset($matches[1]) && (int)$matches[1] < 89 ) {
			return true;
		}
	}
	return false;
}

// 優先言語のリストをチェックして対応する言語があればその翻訳されたレイヤー名を返す
function getTranslatedLayerName() {
	$acceptedLanguages = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '';
	$languageList = explode(',', $acceptedLanguages);

	foreach ($languageList as $language) {
		$language = strtolower(trim($language));
		if (strpos($language, 'ja') === 0) {
			return "レイヤー";
		}
		if (strpos($language, 'en') === 0) {
			return "Layer";
		}
		if (strpos($language, 'zh-tw') === 0) {
			return "圖層";
		}
		if (strpos($language, 'zh-cn') === 0) {
			return "图层";
		}
		if (strpos($language, 'fr') === 0) {
			return "Calque";
		}
		if (strpos($language, 'de') === 0) {
			return "Ebene";
		}
	}

	return "Layer";
}
function is_paint_tool_name($tool){
	return in_array($tool,["Upload","PaintBBS NEO","PaintBBS","Shi-Painter","Tegaki","Klecks","ChickenPaint"]) ? $tool :'';
}
//ツリーnoと一致する行の配列を作成
function create_line_from_treenumber ($fp,$trees){

	rewind($fp);
	$line=[];
	$treeSet = array_flip($trees);//配列とキーを反転
	while($lines = fgets($fp)){
		if(!trim($lines)){
			continue;
		}
		list($no,) = explode(",", $lines);
		if(isset($treeSet[$no])) {//$treesに含まれている記事番号なら定義ずみ
			$line[]=trim($lines);
		}
	}
	return $line;
}
