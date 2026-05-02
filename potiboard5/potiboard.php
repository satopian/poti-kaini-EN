<?php
// ini_set('error_reporting', E_ALL);

// POTI-board EVO
// バージョン :
const POTI_VER = 'v6.175.0';
const POTI_LOT = 'lot.20260503';


/*
  (C) 2018-2025 POTI改 POTI-board redevelopment team
  >> https://paintbbs.sakura.ne.jp/poti/
  *----------------------------------------------------------------------------------
  * ORIGINAL SCRIPT
  *   POTI-board v1.32
  *     (C)SakaQ >> http://www.punyu.net/php/
  *   futaba.php v0.8 lot.031015 (gazou.php v3.0 CUSTOM)
  *     (C)futaba >> http://www.2chan.net/ ((C)ToR >> http://php.s3.to/)
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
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
	die($en? "Error. PHP version 7.4.0 or higher is required for this program to work. <br>\n(Current PHP version:".PHP_VERSION.")":
		"エラー。本プログラムの動作には PHPバージョン 7.4.0 以上が必要です。<br>\n(現在のPHPバージョン：".PHP_VERSION.")"
	);
}

const JQUERY = 'jquery-4.0.0.min.js';
check_file(__DIR__.'/lib/'.JQUERY);
// Lightbox
check_file(__DIR__.'/lib/lightbox/js/lightbox.min.js');
check_file(__DIR__.'/lib/lightbox/css/lightbox.min.css');
check_file(__DIR__.'/config.php');
require_once(__DIR__.'/config.php');

defined('USE_CHEERPJ_OLD_VERSION') or define('USE_CHEERPJ_OLD_VERSION',"0"); 

if(USE_CHEERPJ_OLD_VERSION){//2.3
	define('CHEERPJ_URL','https://cjrtnc.leaningtech.com/2.3/loader.js');
	define('CHEERPJ_HASH','sha384-1s6C2I0gGJltmNWfLfzHgXW5Dj4JB4kQTpnS37fU6CaQR/FrYG219xbhcAFRcHKE');
	define('CHEERPJ_PRELOAD','');
}else{//cj4.1
	define('CHEERPJ_URL','https://cjrtnc.leaningtech.com/4.2/loader.js');
	define('CHEERPJ_HASH','sha384-uKhK9NUHrSpoCfjhgnQkV7vDjOB6IhQZY1esOxD+TF1yvLbbJS/DRhX7g6ATh/wX');
	define('CHEERPJ_PRELOAD','{"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/jre/lib/rt.jar":[0,131072,9699328,11010048,11272192,11534336,11665408,12189696,12320768,12451840,15204352,15335424,15466496,15597568,15990784,16384000,16777216,16908288,17039360,17563648,17694720,17825792,18087936,18612224,18743296,18874368,19005440,19136512,19529728,19660800,20185088,20316160,20840448,21757952,21889024,26869760],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/etc/users":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/lib/security/java.policy":[0,131072],"/lt/etc/resolv.conf":[0,131072],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/etc/localtime":[],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/lib/ext/sunec.jar":[],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/ext/zipfs.jar":[],"/lt/8/jre/lib":[],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/ext/*":[],"/lt/etc/hosts":[],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/8/lib/fonts/fallback":[],"/lt/fc/ttf":[]}');
}
define('CHEERPJ_DEBUG','{ enableDebug: true }');
define('CHEERPJ_DEBUG_MODE',0);

// $ cat FILENAME.js | openssl dgst -sha384 -binary | openssl base64 -A
// https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity

//BladeOne
check_file(__DIR__.'/BladeOne/lib/BladeOne.php');
require_once(__DIR__.'/BladeOne/lib/BladeOne.php');
Use eftec\bladeone\BladeOne;

//Template設定ファイル
check_file(__DIR__.'/templates/'.SKIN_DIR.'template_ini.php');
require_once(__DIR__.'/templates/'.SKIN_DIR.'template_ini.php');

//サムネイルfunction
check_file(__DIR__.'/thumbnail_gd.inc.php');
require_once(__DIR__.'/thumbnail_gd.inc.php');
if(!isset($thumbnail_gd_ver)|| $thumbnail_gd_ver < 20260501){
	die($en ? "Please update thumbnail_gd.inc.php" : "thumbnail_gd.inc.phpを更新してください。");
}
//SNS共有Class
check_file(__DIR__.'/sns_share.inc.php');
require_once(__DIR__.'/sns_share.inc.php');
if(!isset($sns_share_inc_ver) || $sns_share_inc_ver < 20251031){
	die($en ? "Please update sns_share.inc.php" : "sns_share.inc.phpを更新してください。");
}
	//検索Class
check_file(__DIR__.'/search.inc.php');
require_once(__DIR__.'/search.inc.php');
if(!isset($search_inc_ver) || $search_inc_ver < 20260501){
	die($en ? "Please update search.inc.php" : "search.inc.phpを更新してください。");
}
//画像保存Class
check_file(__DIR__.'/save.inc.php');
require_once(__DIR__.'/save.inc.php');
if(!isset($save_inc_ver) || $save_inc_ver < 20260501){
die($en ? "Please update save.inc.php" : "save.inc.phpを更新してください。");
}
check_file(__DIR__.'/picpost.inc.php');
require_once(__DIR__.'/picpost.inc.php');
if(!isset($picpost_inc_ver) || $picpost_inc_ver < 20260501){
die($en ? "Please update picpost.inc.php" : "picpost.inc.phpを更新してください。");
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
//Tegakiを使う 使う:1 使わない:0
defined("USE_TEGAKI") or define("USE_TEGAKI", "1");
defined("PAINT_TEGAKI") or define("PAINT_TEGAKI", "paint_tegaki");
defined("TGKR_VIEW") or define("TGKR_VIEW", "tgkr_view");
//AXNOS Paintを使う 使う:1 使わない:0
defined("USE_AXNOS") or define("USE_AXNOS", "1");
defined("PAINT_AXNOS") or define("PAINT_AXNOS", "paint_axnos");
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
//続きを描く時は設定に関わらずすべてのアプリが使用できるようにする する:1 しない:0
defined("ALLOW_ALL_APPS_TO_CONTINUE_DRAWING") or define("ALLOW_ALL_APPS_TO_CONTINUE_DRAWING", "0");
//URL入力欄を使用する する:1 しない:0
defined("USE_URL_INPUT_FIELD") or define("USE_URL_INPUT_FIELD", "1");
defined("SWITCH_SNS") or define("SWITCH_SNS", "1");
defined("SNS_WINDOW_WIDTH") or define("SNS_WINDOW_WIDTH","600");
defined("SNS_WINDOW_HEIGHT") or define("SNS_WINDOW_HEIGHT","600");
defined("USE_ADMIN_LINK") or define("USE_ADMIN_LINK","1");
defined("CATALOG_PAGE_DEF") or define("CATALOG_PAGE_DEF",30);
//お絵かきできる最小の幅と高さ
defined("PMIN_W") or define("PMIN_W", "300"); //幅
defined("PMIN_H") or define("PMIN_H", "300"); //高さ
//アップロード時の幅と高さの最大サイズ これ以上は縮小
defined("MAX_W_PX") or define("MAX_W_PX", "1024"); //高さ
defined("MAX_H_PX") or define("MAX_H_PX", "1024"); //高さ
//ログファイルのファイルサイズの制限値(単位MB)
defined("MAX_LOG_FILESIZE") or define("MAX_LOG_FILESIZE", "15"); //
//JavaScriptを経由していない投稿を拒絶
defined("REJECT_WITHOUT_JAVASCRIPT") or define("REJECT_WITHOUT_JAVASCRIPT", "0");
defined("REJECT_IF_NO_REVERSE_DNS") or define("REJECT_IF_NO_REVERSE_DNS", "0");
defined("USE_BADHOST_SESSION_CACHE") or define("USE_BADHOST_SESSION_CACHE", "0");

$badurl= $badurl ?? [];//拒絶するurl

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
defined("MSG051") or define("MSG051", "連続したパスワードの誤入力を検知したためロックしています。");
defined("MSG052") or define("MSG052", "ログファイルのファイルサイズが制限値を超過したため処理を停止しました。");
defined("MSG053") or define("MSG053", "少し待ってください。");
defined("MSG054") or define("MSG054", "JavaScriptを有効にしてください。");

$ADMIN_PASS= $ADMIN_PASS ?? false;
if(!$ADMIN_PASS){
	error(MSG040);
}

if(!defined('LOG_MAX')|| !LOG_MAX || !is_numeric(LOG_MAX)){
	error(MSG044);
}

if(X_FRAME_OPTIONS_DENY){
	header("Content-Security-Policy: frame-ancestors 'none';");//フレーム内への表示を拒否
}

//POSTから変数を取得

$mode = (string)filter_input_data('POST', 'mode');
$mode = $mode ?: (string)filter_input_data('GET', 'mode');
$resto = (string)filter_input_data('POST', 'resto',FILTER_VALIDATE_INT);
$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
$type = (string)newstring(filter_input_data('POST', 'type'));
$admin = (string)filter_input_data('POST', 'admin');
$pass = (string)newstring(filter_input_data('POST', 'pass'));
//GETから変数を取得

$res = (string)filter_input_data('GET', 'res',FILTER_VALIDATE_INT);

//COOKIEから変数を取得

$usercode = (string)filter_input_data('COOKIE', 'usercode');//nullならuser-codeを発行


//初期化
init();	
//テンポラリ
deltemp();

session_sta();
$session_usercode = $_SESSION['usercode'] ?? "";
$session_usercode = (string)$session_usercode;
$usercode = $usercode ?: $session_usercode;

//user-codeの発行
if(!$usercode){//user-codeがなければ発行
	$userip = get_uip();
	$usercode = hash('sha256', $userip.random_bytes(16));
}
setcookie("usercode", $usercode, time()+(86400*365),"","",false,true);//1年間
$_SESSION['usercode']=$usercode;

switch($mode){
	case 'regist':
		if(DIARY && !$resto){
			if(!is_adminpass($pwd)){
				error(MSG029);
			}
			$admin=$pwd;
		}
		return regist();
	case 'admin':
		check_badhost(MSG049);
		if(!$pass){
			$dat['admin_in'] = true;

			//フォームの表示時刻をセット
			set_form_display_time();

			return htmloutput(OTHERFILE,$dat);
		}
		check_same_origin(true);

		//投稿間隔をチェック
		check_submission_interval();

		check_password_input_error_count();
		if(!is_adminpass($pass)){ 
			error(MSG029);
		}
	
		if($admin==="del") return admindel($pass);
		if($admin==="post"){
			$dat['post_mode'] = true;
			$dat['regist'] = true;
			$dat = array_merge($dat,form($res));
			$dat = array_merge($dat,form_admin_in('valid'));

			//フォームの表示時刻をセット
			set_form_display_time();

			return htmloutput(OTHERFILE,$dat);
		}
		if($admin==="update"){
			updatelog();
			redirect(h(PHP_SELF2));
		}
		return;

	case 'usrdel':
		if (!USER_DELETES) {
			error(MSG033);
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
		check_badhost(MSG049);
		if(!USE_IMG_UPLOAD && DENY_COMMENTS_ONLY || DIARY){
			redirect(h(PHP_SELF2));
		}
		$dat['post_mode'] = true;
		$dat['regist'] = true;
		$dat = array_merge($dat,form());

		//フォームの表示時刻をセット
		set_form_display_time();

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
	case 'picpost':
		return picpost::saveimage();
	default:
		if($res){
			return res($res);
		}
		redirect(h(PHP_SELF2));
}

exit();

//ユーザーip
function get_uip(): string {
	$ip = $_SERVER["HTTP_CLIENT_IP"] ?? '';
	$ip = $ip ?: ($_SERVER["HTTP_INCAP_CLIENT_IP"] ?? '');
	$ip = $ip ?: ($_SERVER["HTTP_X_FORWARDED_FOR"] ?? '');
	$ip = $ip ?: ($_SERVER["REMOTE_ADDR"] ?? '');
	if (strstr($ip, ', ')) {
		$ips = explode(', ', $ip);
		$ip = $ips[0];
	}
	if(filter_var($ip, FILTER_VALIDATE_IP) === false){
		return '';
	}
	return $ip;
}

//session開始
function session_sta(): void {
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
function get_csrf_token(): string {
	session_sta();
	$token = hash('sha256', session_id(), false);
	$_SESSION['token']=$token;
	return $token;
}
//csrfトークンをチェック	
function check_csrf_token(): void {

	check_same_origin(true);
	session_sta();
	$token=(string)filter_input_data('POST','token');
	$session_token= $_SESSION['token'] ?? '';
	if(!$token||!$session_token||!hash_equals($session_token,$token)){
		error(MSG006);
	}
}
function check_same_origin(bool $cookie_check=false): void {
	global $usercode,$en;
	session_sta();
	$c_usercode = (string)filter_input_data('COOKIE', 'usercode');//user-codeを取得
	$session_usercode = $_SESSION['usercode'] ?? "";
	$session_usercode = (string)$session_usercode;

	if($cookie_check){
		if(!$c_usercode){
			error(MSG050);
		}
		if(!$usercode || ($usercode!==$c_usercode)&&($usercode!==$session_usercode)){
			error($en?"User code mismatch.":"ユーザーコードが一致しません。");
		}
	}

	$sec_fetch_site = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
	$same_origin = ($sec_fetch_site === 'same-origin');

	if(!isset($_SERVER['HTTP_ORIGIN']) || !isset($_SERVER['HTTP_HOST'])){
		error($en?'Your browser is not supported. ':'お使いのブラウザはサポートされていません。');
	}
	if(!$same_origin && (parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST) !== $_SERVER['HTTP_HOST'])){
		error(MSG049);
	}
}

// ベース
function basicpart(): array {
	global $pallets_dat,$resno;
	
	$dat['title'] = TITLE;
	$dat['encoded_title'] = rawurlencode(TITLE);
	$dat['home']  = HOME;
	$dat['self']  = PHP_SELF;
	$dat['encoded_self'] = rawurlencode(PHP_SELF);
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
	$dat['is_IE'] = true;//古いテンプレートの互換性のため
	$dat['use_admin_link'] = USE_ADMIN_LINK;
	
	//OGPイメージ シェアボタン
	$dat['rooturl'] = ROOT_URL;//設置場所url
	$dat['encoded_rooturl'] = rawurlencode(ROOT_URL);//設置場所url
	$dat['sharebutton'] = SHARE_BUTTON ? true : false;
	$dat['use_select_palettes']=false;
	$dat['palette_select_tags']='';
	if(USE_SELECT_PALETTES){
	$dat['use_select_palettes']=true;
	$arr_palette_select_tags=[];
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
	$dat['cheerpj_preload']=CHEERPJ_DEBUG_MODE ? CHEERPJ_DEBUG : CHEERPJ_PRELOAD;
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
function form(?string $resno="",array $tmp=[]): array {
	global $addinfo;
	global $fontcolors,$qualitys;

	//csrfトークンをセット
	$dat['token']= get_csrf_token();

	$quality = (int)filter_input_data('POST', 'quality',FILTER_VALIDATE_INT);

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
	$dat['use_axnos'] = (USE_AXNOS ? true : false);
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
	$dat['resno'] = $resno ?:'';
	$dat['notres'] = $resno ? false : true;
	$dat['paintform'] = (USE_PAINT && !empty($count_arr_apps)) ? (!$resno || $resno && RES_UPLOAD) : false;
	$dat['maxbyte'] = MAX_KB * 1024 * 2;//フォームのHTMLによるファイルサイズの制限 jpeG→png変換を考慮して2倍。
	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	$dat['usecom'] = (USE_COM||($resno&&!RES_UPLOAD)) ? ' *' :'';
	$dat['use_url_input'] = USE_URL_INPUT_FIELD ? true : false;
	//PCHアップロードの投稿可能な最大値 単位byte
	$dat['upload_max_filesize'] = get_upload_max_filesize()*1024*1024;

	//本文必須の設定では無い時はレスでも画像かコメントがあれば通る
	$dat['upfile'] = false;

	if(!$tmp && USE_IMG_UPLOAD && (!$resno || RES_UPLOAD && $resno)){
		$dat['upfile'] = true;
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
function form_admin_in(?string $adminin): array {
	global $ADMIN_PASS;

	if(($adminin !== 'valid')){
		return [];
	}
	if(ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS){
		$dat['paint'] = true; 
		$dat['select_app'] = true;
		$dat['app_to_use'] = false;
		$dat['use_neo'] = true;
		$dat['use_tegaki'] = true;
		$dat['use_shi_painter'] = true; 
		$dat['use_chickenpaint'] = true;
		$dat['use_klecks'] = true;
	}
	$dat['admin'] = h($ADMIN_PASS);
	$dat['upfile'] = true;
	return $dat;
}

// 記事表示 
function updatelog(): void {

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
				if(DSP_RES && $k!==0 && $k<=$skipres){//レス表示件数
					continue;
				}
				$res = create_res($line[$j], ['pch' => 1]);
				unset($line[$j]);//メモリ節約のために使用済みの行は削除
				$res['skipres']=false;
				if($k===0){//スレッドの親の時
					$res['disp_resbutton'] = check_elapsed_days($res['time'],$res['logver']); //返信ボタン表示有無
					// 親レス用の値
					$res['skipres'] = DSP_RES ? (($skipres>0) ? $skipres : false) :false;
				}
					$dat['oya'][$oya][]=$res;
					$res=[];
			}
			clearstatcache(); //キャッシュをクリア
			unset($disp_threads[$oya]);
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
		$dat['logfilename'] = $logfilename;
		if(is_file($logfilename)){
			if(PHP_EXT!='.php'){chmod($logfilename,PERMISSION_FOR_DEST);}
		}
		$dat['logfilename']= $logfilename;

		$buf = htmloutput(MAINFILE,$dat,true);
		file_put_contents($logfilename,$buf,LOCK_EX);
		if(PHP_EXT!='.php'){chmod($logfilename,PERMISSION_FOR_DEST);}
	}

	safe_unlink(($page/PAGE_DEF+1).PHP_EXT);
}

//レス画面に前後のスレッドの画像一覧と次のスレッド前のスレッドのリンクを出す
function res_view_other_works(?string $resno,array $trees,int $i): array {

	if(!$resno||$resno<0){
		redirect(h(PHP_SELF2));
	}
	
	$next_tree=[];
	foreach($trees as $j => $value){
		if (($i<$j)&&($i+20)>=$j) {//現在のスレッドより後ろの20スレッドのツリーを取得
			$next_tree[]=explode(",", trim($value),2)[0];
		}
	}
	$prev_tree=[];
	foreach($trees as $j => $value){
		if (($i-20)<=$j && $i>$j) {//現在のスレッドより手前の20スレッドのツリーを取得
			$prev_tree[]=explode(",", trim($value),2)[0];
		}
	}

	$fp=fopen(LOGFILE,"r");
	$prev_line=create_line_from_treenumber ($fp,$prev_tree);
	$next_line=create_line_from_treenumber ($fp,$next_tree);
	closeFile($fp);

	$prev_lineindex = get_lineindex($prev_line); // 逆変換テーブル作成
	$next_lineindex = get_lineindex($next_line); // 逆変換テーブル作成

	//前のスレッド、次のスレッド
	$next=(isset($next_tree[0])&&$next_tree[0]) ? $next_tree[0] :'';
	$dat['res_next']=($next && isset($next_line[$next_lineindex[$next]])) ? create_res($next_line[$next_lineindex[$next]]):[];

	$last_prev_tree = end($prev_tree);
	$prev=$last_prev_tree ?:'';

	$dat['res_prev']=($prev && isset($prev_lineindex[$prev])) ? create_res($prev_line[$prev_lineindex[$prev]]):[];
	$dat['view_other_works']=[];
	if(!VIEW_OTHER_WORKS){
		return $dat;
	}

	$prev_res=[];
	$next_res=[];
	foreach($prev_tree as $key => $n){
		$_res=($n && isset($prev_lineindex[$n])) ? create_res($prev_line[$prev_lineindex[$n]]):[];
		if(!empty($_res)&&$_res['imgsrc']&&$_res['no']!==$resno){
			$prev_res[]=$_res;
		}
		unset($prev_tree[$key]);
	}
	foreach($next_tree as $key =>$n){
		$_res=($n && isset($next_lineindex[$n])) ? create_res($next_line[$next_lineindex[$n]]):[];
		if(!empty($_res)&&$_res['imgsrc']&&$_res['no']!==$resno){
			$next_res[]=$_res;
		}
		unset($next_tree[$key]);
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
	return $dat;
}

//レス画面を表示
function res(?string $resno): void {

	if(!$resno||$resno<0){
		redirect(h(PHP_SELF2));
	}
	$trees=get_log(TREEFILE);

	$treeline=[];
	$i=0;
	foreach($trees as $i => $value){
		//レス先検索
		if (strpos(trim($value).',' , $resno .',') === 0) {
			$treeline = explode(",", trim($value));//現在のスレッドのツリーを取得
			break;
		}
		unset($trees[$i]);
	}

	if (empty($treeline)) {
		error(MSG001);
	}

	//レス画面に前後のスレッドの画像一覧と次のスレッド前のスレッドのリンクを出す
	$res_view_other_works = res_view_other_works($resno,$trees,$i);
	
	$fp=fopen(LOGFILE,"r");
	$line=create_line_from_treenumber ($fp,$treeline);
	closeFile($fp);

	$lineindex = get_lineindex($line); // 逆変換テーブル作成

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
		unset($line[$k]);//メモリ節約のために使用済みの行は削除
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
		unset($line[$k]);
		unset($treeline[$j]);
	}
	unset($line);
	unset($lineindex);

	$dat['resname'] = !empty($rresname) ? implode(HONORIFIC_SUFFIX.' ',$rresname) : false; // レス投稿者一覧

	$dat = array_merge($dat,$res_view_other_works);
	//フォームの表示時刻をセット
	set_form_display_time();

	htmloutput(RESFILE,$dat);
}

//マークダウン記法のリンクをHTMLに変換
function md_link(?string $str): string {
	$rel = 'rel="nofollow noopener noreferrer"';

	// 正規表現パターンを使用してマークダウンリンクを検出
	$pattern = "{\[((?:[^\[\]\\\\]|\\\\.)+?)\]\((https?://[^\s\)]+)\)}";

	// 変換処理
	$str = preg_replace_callback($pattern, function($matches) use ($rel) {
		// エスケープされたバックスラッシュを特定の文字だけ解除
		$text = str_replace(['\\[', '\\]', '\\(', '\\)'], ['[', ']', '(', ')'], $matches[1]);
		$url = filter_var($matches[2], FILTER_VALIDATE_URL) ? $matches[2] : '';
		// 変換されたHTMLリンクを返す
		if(!$url){
				// URLが無効ならテキストだけ返す
			return $text;
		}
		// URLが有効ならHTMLリンクを返す
		return '<a href="'.$url.'" target="_blank" '.$rel.'>'.$text.'</a>';
	}, $str);

	return $str;
}

// 自動リンク
function auto_link(?string $str): string {
	if(strpos($str,'<a')===false){//マークダウン記法がなかった時
		$str= preg_replace("{(https?://[\w!\?/\+\-_~=;:\.,\*&@#\$%\(\)'\[\]]+)}",'<a href="$1" target="_blank" rel="nofollow noopener noreferrer">$1</a>',$str);
	}
	return $str;
}

// 日付
function now_date(int $time): string {
	$youbi = array('日','月','火','水','木','金','土');
	$yd = $youbi[(int)date("w", $time)] ;
	$date = date(DATE_FORMAT, $time);
	$date = str_replace("<1>", $yd, $date); //漢字の曜日セット1
	$date = str_replace("<2>", $yd.'曜', $date); //漢字の曜日セット2
	return $date;
}

// エラー画面
function error(?string $mes,?string $dest=''): void {
	safe_unlink($dest);
	$dat['err_mode'] = true;
	$mes=preg_replace("#<br( *)/?>#i","\n", $mes);
	if((bool)(isset($_SERVER['HTTP_X_REQUESTED_WITH']))){
		header('Content-type: text/plain');
		die(h("error\n{$mes}"));
	}

	$dat['mes'] = nl2br(h($mes));
		htmloutput(OTHERFILE,$dat);
	exit();
}

// 文字列の類似性
function similar_str(?string $str1,?string $str2): int {
	similar_text($str1, $str2, $p);
	return (int)$p;
}

// 記事書き込み
function regist(): void {
	global $path,$temppath,$usercode;
	
	check_log_size_limit();//ログファイルのファイルサイズをチェック
	//CSRFトークンをチェック
	check_csrf_token();
	//投稿間隔をチェック
	check_submission_interval();

	// JavaScriptを経由している投稿かチェック
	if (REJECT_WITHOUT_JAVASCRIPT && !filter_input(INPUT_POST, 'js_submit_flag', FILTER_VALIDATE_BOOLEAN)) {
		error(MSG054);
	}

	$admin = (string)filter_input_data('POST', 'admin');
	$resto = (string)filter_input_data('POST', 'resto',FILTER_VALIDATE_INT);
	$com = (string)filter_input_data('POST', 'com');
	$name = (string)filter_input_data('POST', 'name');
	$email = (string)filter_input_data('POST', 'email');
	$url = USE_URL_INPUT_FIELD ? (string)filter_input_data('POST', 'url',FILTER_VALIDATE_URL) : '';
	$sub = (string)filter_input_data('POST', 'sub');
	$fcolor = (string)filter_input_data('POST', 'fcolor');
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$pwdc = (string)filter_input_data('COOKIE', 'pwdc');

	$userip = get_uip();
	//ホスト取得
	$host = $userip ? gethostbyaddr($userip) : '';
	check_badhost();
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post();

	$pictmp = (int)filter_input_data('POST', 'pictmp',FILTER_VALIDATE_INT);
	$picfile = (string)basename(newstring(filter_input_data('POST', 'picfile')));
	$tool="";

	// パスワード未入力の時はパスワードを生成してクッキーにセット
	$c_pass=str_replace("\t",'',(string)filter_input_data('POST', 'pwd'));//エスケープ前の値をCookieにセット
	if($pwd===''){
		if($pwdc){//Cookieはnullの可能性があるので厳密な型でチェックしない
			$pwd=newstring($pwdc);
			$c_pass=$pwdc;//エスケープ前の値
		}else{
			$pwd = substr(hash('sha256', random_bytes(16)), 2, 15);
			$c_pass=$pwd;
		}
	}

	if(strlen((string)$pwd) < 6) error(MSG046);

	//画像アップロード
	$upfile_name = $_FILES["upfile"]["name"] ?? "";
	$upfile_name = basename($upfile_name);
	if(strlen((string)$upfile_name)>256){
		error(MSG015);
	}
	$upfile = $_FILES["upfile"]["tmp_name"] ?? "";

	if(isset($_FILES["upfile"]["error"])){//エラーチェック
		if(in_array($_FILES["upfile"]["error"],[1,2])){
			error(MSG034);//容量オーバー
		} 
	}
	$filesize = $_FILES["upfile"]['size'] ?? 0;
	if($filesize > MAX_KB*1024*2){//png→jpegで容量が減るかもしれないので2倍
		error(MSG034);//容量オーバー
	}

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
			error(MSG007);
		}

		$userdata=file_get_contents($temppath.$picfile.".dat");

		list($uip,$uhost,,,$ucode,,$starttime,$postedtime,$uresto,$tool) = explode("\t", trim($userdata)."\t\t\t");

		//ユーザーコードまたはipアドレスは一致しているか?
		$valid_poster_found = (($ucode && $ucode == $usercode)||($uip && $uip == $userip)||($uhost && $uhost == $host));
		if(!$valid_poster_found){
			error(MSG007);
		}
		//描画時間を$userdataをもとに計算
		if($starttime && is_numeric($starttime) && $postedtime && is_numeric($postedtime)){
			$psec=(int)$postedtime-(int)$starttime;
			$ptime = $psec;
		}
		$uresto=(string)filter_var($uresto,FILTER_VALIDATE_INT);
		$resto = $uresto ?: $resto;//変数上書き$userdataのレス先を優先する
		$pictmp2 = true;
	}
	$dest='';
	$is_file_dest=false;
	$is_upload=false;
	if($upfile && is_file($upfile)){//アップロード
	//サポートしていないフォーマットならエラーが返る
	if(!getImgType($upfile)){
		error(MSG003, $upfile);
	}
	$dest = $temppath.$time.'.tmp';
	if($pictmp2){
			copy($upfile, $dest);
		} else{//フォームからのアップロード
			if(!USE_IMG_UPLOAD && !is_adminpass($admin)){//アップロード禁止で管理画面からの投稿ではない時
				error(MSG049,$upfile);
			}
			if(!preg_match('/\A(jpe?g|jfif|gif|png|webp)\z/i', pathinfo($upfile_name, PATHINFO_EXTENSION))){//もとのファイル名の拡張子
				error(MSG004,$upfile);
			}
			if(!move_uploaded_file($upfile, $dest)){
				error(MSG003,$upfile);
			}
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

	if(!$resto&&DENY_COMMENTS_ONLY&&!$is_file_dest&& !is_adminpass($admin)) error(MSG039,$dest);
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
	file_lock($fp, LOCK_EX);
	$buf = get_buffer_from_fp($fp);
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
		$ltime = microtime2time($ltime,$logver);
		$interval= $ltime ? time()-(int)$ltime : -1;
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
	$pch_src='';
	$aco_src='';
	// アップロード処理
	if($dest&&$is_file_dest){//画像が無い時は処理しない

		//添付したアップロード画像の元のmime_type
		$upload_img_mime_type = $is_upload ? mime_content_type($dest) : "";

		if($is_upload){
			//Exifをチェックして画像が回転している時は上書き保存
			check_jpeg_exif($dest);
			thumbnail_gd::thumb($temppath,$time.".tmp",$time,MAX_W_PX,MAX_H_PX,['toolarge'=>1]);//実体データを縮小
		}
		//ファイルサイズが規定サイズを超過していたらWebPに変換
		//画像アップロード時はサイズを超過していなくてもGDのPNGで上書き
		//ここでGPSデータが消える
		
		convert2($temppath,$time,".tmp",$is_upload,$upload_img_mime_type);

		clearstatcache();
		if($is_upload && (filesize($dest) > MAX_KB * 1024)){//ファイルサイズ再チェック
		error(MSG034,$dest);
		}
		//サポートしていないフォーマットならエラーが返る
		if(!getImgType($dest)){
			error(MSG003, $dest);
		}

		$chk = substr(hash_file('sha256', $dest), 0, 32);
		check_badfile($chk, $dest); // 拒絶画像チェック

		$upfile_name=newstring($upfile_name);

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
		if($pictmp2){
			//PCHファイルアップロード
			// .pch, .spch,.chi,.psd ブランク どれかが返ってくる
			if ($pchext = check_pch_ext($temppath.$picfile,['upfile'=>true])) {
				$pch_src = $temppath.$picfile.$pchext;
				$pch_dst = PCH_DIR.$time.$pchext;
				if(copy($pch_src, $pch_dst)){
					chmod($pch_dst,PERMISSION_FOR_DEST);
				}
			}
			//litaChixのカラーセット
			$aco_src = $temppath.$picfile.".aco";
			$aco_dst = IMG_DIR.$time.".aco";
			if(is_file($aco_src)){
				if(copy($aco_src, $aco_dst)){
					chmod($aco_dst,0606);
				}
			}
		}

		list($w, $h) = getimagesize($dest);
		
		$ext = getImgType($dest);
		//サポートしていないフォーマットならエラーが返る
		if(!$ext){
			error(MSG003, $dest);
		}

	
		rename($dest,$path.$time.$ext);
		chmod($path.$time.$ext,PERMISSION_FOR_DEST);
		// 縮小表示
		$max_w = $resto ? MAX_RESW : MAX_W;
		$max_h = $resto ? MAX_RESH : MAX_H;
		list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);
		$thumbnail = make_thumbnail($time.$ext,$time,$max_w,$max_h);
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
	file_lock($tp, LOCK_EX);
	stream_set_write_buffer($tp, 0);
	$buf = get_buffer_from_fp($tp);
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
	safe_unlink($pch_src);
	safe_unlink($aco_src);
	safe_unlink($upfile);
	safe_unlink($temppath.$picfile.".dat");
	
	//-- クッキー保存 --
	//パスワード
	$email = $email ?: ($sage ? 'sage' : '') ;
	$name=str_replace("\t",'',(string)filter_input_data('POST', 'name'));//エスケープ前の値をセット
	//クッキー項目："クッキー名 クッキー値"
	$cooks = [['namec',$name],['emailc',$email],['urlc',$url],['fcolorc',$fcolor],['pwdc',$c_pass]];

	foreach ( $cooks as $cook ) {
		list($c_name,$c_cookie) = $cook;
		setcookie ($c_name, $c_cookie,time()+(SAVE_COOKIE*24*3600));
	}

	$resno = $resto ?: $no;
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
	&& !(NOTICE_NOADMIN && is_adminpass($pwd))){//管理者の投稿の場合メール出さない
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
		$data['option'][] = NOTICE_MAIL_URL.','.ROOT_URL.PHP_SELF."?res={$resno}#{$no}";
		$data['comment'] = SEND_COM ? preg_replace("#<br( *)/?>#i","\n", $com) : '';

		noticemail::send($data);
	}
	redirect(h(PHP_SELF)."?res={$resno}#{$no}");
}

function h_decode(?string $str): string {
	$str = str_replace("&#44;", ",", $str);
	return htmlspecialchars_decode((string)$str, ENT_QUOTES);
}

//ツリー削除
function treedel(?string $delno): bool {
	chmod(TREEFILE,PERMISSION_FOR_LOG);
	$fp=fopen(TREEFILE,"r+");
	file_lock($fp, LOCK_EX);
	$buf = get_buffer_from_fp($fp);
	if(!$buf){error(MSG024);}
	$line = explode("\n", trim($buf));
	$find=false;
	$thread_exists=true;
	foreach($line as $i =>$value){
		$treeline = explode(",", trim($value));
		foreach($treeline as $j => $treeno){
			if($treeno == $delno){
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
function newstring(?string $str): string {
	$str = trim((string)$str);
	$str = htmlspecialchars((string)$str,ENT_QUOTES,'utf-8');
	return str_replace(",", "&#44;", $str);//カンマをエスケープ
}

// ユーザー削除
function userdel(): void {
	global $path;

	check_badhost();
	check_same_origin();

	$thread_no=(string)filter_input_data('POST','thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input_data('POST','logfilename');
	$mode_catalog=filter_input_data('POST','mode_catalog');
	$catalog_pageno=(string)filter_input_data('POST','catalog_pageno',FILTER_VALIDATE_INT);
	$catalog_pageno= $catalog_pageno ?: 0;
	$onlyimgdel = filter_input_data('POST', 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = (array)($_POST['del'] ?? []);//$del は配列
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$pwdc = (string)filter_input_data('COOKIE', 'pwdc');
	
	if(!is_array($del)){
		error(MSG028);
	}
	$pwd = $pwd ?: newstring($pwdc);
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	file_lock($fp, LOCK_EX);
	$buf = get_buffer_from_fp($fp);
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
		if(ctype_digit($no) && in_array($no,$del) && check_password($pwd, $pass, $pwd)){
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
	redirect($destination);

}

// 管理者削除
function admindel(?string $pass): void {
	global $path;

	check_badhost();
	check_same_origin(true);

	$onlyimgdel = (bool)filter_input_data('POST', 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = (array)($_POST['del'] ?? []);//$del は配列
	$del_pageno=(int)filter_input_data('POST','del_pageno',FILTER_VALIDATE_INT);
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
		$res['now']  = preg_replace("/ ID:.*/","",$date);//ID以降除去
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
			$res['chk']= h(substr($chk,0,10));//画像のハッシュ値
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
		chmod(LOGFILE,PERMISSION_FOR_LOG);
		$fp=fopen(LOGFILE,"r+");
		file_lock($fp, LOCK_EX);
		$buf = get_buffer_from_fp($fp);
		if(!$buf){error(MSG030);}
		$buf = charconvert($buf);
		$line = explode("\n", trim($buf));
		$find = false;
		foreach($line as $i => $value){
			if(!trim($value)){
				continue;
			}
			list($no,,,,,,,,,$ext,,,$time,,) = explode(",",trim($value));
			if(ctype_digit($no) && in_array($no,$del)){
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

	htmloutput(OTHERFILE,$dat);
}

function init(): void {
	$err='';
	$en=lang_en();

	if(!is_writable(__DIR__.'/'))die($en ? "Unable to write to current directory." : "カレントディレクトリに書けません。");

	check_dir(__DIR__.'/templates/'.SKIN_DIR.'cache');

	if (!is_file(__DIR__.'/'.LOGFILE)) {
		$date = now_date(time());//日付取得
		if(DISP_ID) $date .= " ID:???";
		$time = time().substr(microtime(),2,3);
		$testmes="1,".$date.",".DEF_NAME.",,".DEF_SUB.",".DEF_COM.",,,,,,,".$time.",,,,,,,6,\n";
		file_put_contents(LOGFILE, $testmes,LOCK_EX);
		chmod(LOGFILE, PERMISSION_FOR_LOG);
	}
	check_file(__DIR__.'/'.LOGFILE,true);

	if (!is_file(__DIR__.'/'.TREEFILE)) {
		file_put_contents(TREEFILE, "1\n",LOCK_EX);
		chmod(TREEFILE, PERMISSION_FOR_LOG);
	}
	check_file(__DIR__.'/'.TREEFILE,true);

	check_dir(__DIR__.'/'.IMG_DIR);
	check_dir(__DIR__.'/'.PCH_DIR);
	check_dir(__DIR__.'/'.THUMB_DIR);
	check_dir(__DIR__.'/'.TEMP_DIR);

	if(!is_file(__DIR__.'/'.PHP_SELF2))updatelog();

}

function lang_en() : bool {//言語が日本語以外ならtrue。
	$lang = ($http_langs = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '')
	? explode( ',', $http_langs )[0] : '';
  return (stripos($lang,'ja')!==0);
}
function initial_error_message(): array {
	$en=lang_en();
	$msg['041']=$en ? ' does not exist.':'がありません。'; 
	$msg['042']=$en ? ' is not readable.':'を読めません。'; 
	$msg['043']=$en ? ' is not writable.':'に書けません。'; 
return $msg;	
}

// ファイル存在チェック
function check_file (?string $path,bool $check_writable=false): void {
	$msg=initial_error_message();
	if (!is_file($path)) die($path . $msg['041']);
	if (!is_readable($path)) die($path . $msg['042']);
	if($check_writable){//書き込みが必要なファイルのチェック
		if (!is_writable($path)) die($path . $msg['043']);
	}
}
// ディレクトリ存在チェック なければ作る
function check_dir (?string $path): void {
	$msg=initial_error_message();

	if (!is_dir($path)) {
			mkdir($path, PERMISSION_FOR_DIR);
			chmod($path, PERMISSION_FOR_DIR);
	}
	if (!is_readable($path) || !is_writable($path)){
		chmod($path, PERMISSION_FOR_DIR);
	}
	if (!is_dir($path)) die($path . $msg['041']);
	if (!is_readable($path)) die($path . $msg['042']);
	if (!is_writable($path)) die($path . $msg['043']);
}

// お絵かき画面
function paintform(): void {
	global $qualitys,$usercode,$pallets_dat;

	check_badhost();//ホストチェック
	check_log_size_limit();//ログファイルのファイルサイズをチェック
	check_same_origin();

	$admin = (string)filter_input_data('POST', 'admin');
	$type = (string)newstring(filter_input_data('POST', 'type'));
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$pwdc = (string)filter_input_data('COOKIE', 'pwdc');
	$pwd = $pwd ?: newstring($pwdc);
	$resto = (string)filter_input_data('POST', 'resto',FILTER_VALIDATE_INT);
	if(strlen($resto)>1000){
		error(MSG015);
	}
	$mode = (string)filter_input_data('POST', 'mode');
	$picw = (int)filter_input_data('POST', 'picw',FILTER_VALIDATE_INT);
	$pich = (int)filter_input_data('POST', 'pich',FILTER_VALIDATE_INT);
	$anime = (bool)filter_input_data('POST', 'anime',FILTER_VALIDATE_BOOLEAN);
	$shi = (string)filter_input_data('POST', 'shi');
	$pch = basename((string)newstring(filter_input_data('POST', 'pch')));
	$ext = basename((string)newstring(filter_input_data('POST', 'ext')));
	$ctype = (string)newstring(filter_input_data('POST', 'ctype'));
	$quality = (int)filter_input_data('POST', 'quality',FILTER_VALIDATE_INT);
	$no = (int)filter_input_data('POST', 'no',FILTER_VALIDATE_INT);

	
	if(strlen($pwd) > 72) error(MSG015);

	$picw = max($picw,PMIN_W);//最低の幅チェック
	$pich = max($pich,PMIN_H);//最低の高さチェック
	$picw = min($picw,PMAX_W);//最大の幅チェック
	$pich = min($pich,PMAX_H);//最大の高さチェック

	//Cookie保存
	setcookie("appletc", $shi , time()+(86400*SAVE_COOKIE));//アプレット選択
	setcookie("picwc", $picw , time()+(86400*SAVE_COOKIE));//幅
	setcookie("pichc", $pich , time()+(86400*SAVE_COOKIE));//高さ

	$dat['klecksusercode']=$usercode;//klecks
	$dat['resto']=$resto;//klecks
	// 初期化
	$dat['image_jpeg'] = 'false';
	$dat['image_size'] = 0;
	$dat['oekaki_id']='';
	$keys=['type_neo','pinchin','pch_mode','continue_mode','imgfile','img_chi','img_klecks','paintbbs','quality','pro','normal','undo','undo_in_mg','pchfile','security','security_click','security_timer','security_url','speed','picfile','painttime','no','pch','ext','ctype_pch','newpost_nopassword'];

	foreach($keys as $key){
		$dat[$key]=false;	
	}

	$dat['parameter_day']=date("Ymd");//JavaScriptのキャッシュ制御

	//pchファイルアップロードペイント
	$pchup_paint_mode = false;
	if(is_adminpass($admin)){
		
		$pchtmp= $_FILES['pch_upload']['tmp_name'] ?? '';
		if(isset($_FILES['pch_upload']['error']) && in_array($_FILES['pch_upload']['error'],[1,2])){//容量オーバー
			error(MSG034);
		} 
		if ($pchtmp && $_FILES['pch_upload']['error'] === UPLOAD_ERR_OK){
			$pchfilename = $_FILES['pch_upload']['name'] ?? '';
			$pchfilename = newstring(basename($pchfilename));

			$time = (string)(time().substr(microtime(),2,6));
			$pchext=pathinfo($pchfilename, PATHINFO_EXTENSION);
			$pchext=strtolower($pchext);//すべて小文字に
			//拡張子チェック
			if (!in_array($pchext, ['pch','spch','chi','psd'])) {
				error(MSG045,$pchtmp);
			}
			$pchup = TEMP_DIR.'pchup-'.$time.'-tmp.'.$pchext;//アップロードされるファイル名

			if(move_uploaded_file($pchtmp, $pchup)){//アップロード成功なら続行

				if(!in_array(mime_content_type($pchup),["application/octet-stream","application/gzip","image/vnd.adobe.photoshop"])){
					error(MSG045,$pchup);
				}
				$pchup_paint_mode = true;
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

		$cont_paint_same_thread=(bool)filter_input_data('POST', 'cont_paint_same_thread',FILTER_VALIDATE_BOOLEAN);

		
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
		$dat['oyano']=$oyano;
		if($type!=='rep'){

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

			$dat['oekaki_id']= $pch.$ext;

			$dat['anime'] = false;
			$dat['imgfile'] = './'.IMG_DIR.$pch.$ext;
			if($_pch_ext==='.chi'){
				$dat['img_chi'] = './'.PCH_DIR.$pch.'.chi';
			}
			if(is_file(IMG_DIR.$pch.'.aco')){
				$dat['img_aco'] = IMG_DIR.$pch.'.aco';
			}

			if($_pch_ext==='.psd'){
				$dat['img_klecks'] = './'.PCH_DIR.$pch.'.psd';
			}
		}
	
		$dat['newpaint'] = true;
	}

	if($shi==1||$shi==2){
	$w = $picw + 510;//しぃぺの時の幅
	$h = $pich + 120;//しぃぺの時の高さ
	} else{
		$w = $picw + 150;//PaintBBSの時の幅
		$h = $pich + 172;//PaintBBSの時の高さ
	}

	$w = max($w,450);//最低幅
	$h = max($h,560);//最低高

	$dat['compress_level'] = COMPRESS_LEVEL;
	$dat['layer_count'] = LAYER_COUNT;
	if($shi) $dat['quality'] = $quality ?: $qualitys[0];
	$selected_palette_no = (int)filter_input_data('POST', 'selected_palette_no',FILTER_VALIDATE_INT);
	//NEOを使う時はPaintBBSの設定
	$lines=[];
	if(USE_SELECT_PALETTES){//パレット切り替え機能を使う時
		foreach($pallets_dat as $i=>$value){
			if($i===$selected_palette_no){//キーと入力された数字が同じなら
				setcookie("palettec", $i, time()+(86400*SAVE_COOKIE));//Cookie保存
				if(is_array($value)){
					list($p_name,$p_dat)=$value;
					check_file(__DIR__.'/'.$p_dat);
					$lines=file($p_dat);
				}else{
					$lines=file($value);
				}
				break;
			}
		}
	}else{
		check_file(__DIR__.'/'.PALETTEFILE);
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
		$time=time();
		$userip = get_uip();
		//画像差し換え時に使用する識別情報
		//`|`で分割して、元の記事のNoとUNIXタイムを取り出せるようにしておく
		$repcode = $no.'|'.$pch.'|'.substr(hash('sha256', $userip.random_bytes(16)),0,12);
		$dat['rep']=true;
		$dat['no']=$no;
		$dat['pwd']=$pwd;
		$dat['repcode']=$repcode;
		$dat['mode'] = 'picrep&no='.$no.'&pwd='.$pwd.'&repcode='.$repcode;
		$usercode.='&repcode='.$repcode;
	}elseif($pchup_paint_mode){//PCHアップロードペイントの時は
		//描画時間･工程数による拒絶を防ぐため
		//ダミーの差し換え時の識別コードを追加
		$dat['repcode']='1';
		$usercode.='&repcode=1';
	}

	$dat['await']='await';//しぃペインターのダイナミックパレットの制御
	$dat['async']='async';//ダイナミックパレットのコードに直接　async await　と書いていないテンプレートのために残す。

	//アプリ選択 
	if($shi==1){ $dat['normal'] = true; }
	elseif($shi==2){ $dat['pro'] = true; }
	else{ $dat['paintbbs'] = true; }
	$dat['useneo'] = ($shi=='neo');//NEOを使う
	$dat['chickenpaint']= ($shi==='chicken');

	$dat['usercode'] = $usercode;

	$dat['max_pch'] = get_upload_max_filesize();
	//AXNOS Paint用
	$pmax_w = max($picw,PMAX_W); // 最大幅を元画像にあわせる
	$pmax_h = max($pich,PMAX_H); // 最大高を元画像にあわせる
	$dat['pmaxw'] = min($pmax_w,2000); // 2000px以上にはならない
	$dat['pmaxh'] = min($pmax_h,2000); // 2000px以上にはならない

	$pmin_w = min($picw,PMIN_W); // 最小幅を元画像にあわせる
	$pmin_h = min($pich,PMIN_H); // 最小高を元画像にあわせる
	$dat['pminw'] = max($pmin_w,8); // 8px以下にはならない
	$dat['pminh'] = max($pmin_h,8); // 8px以下にはならない
	
	switch($shi){
		case 'tegaki':
			htmloutput(PAINT_TEGAKI,$dat);
			exit();
		case 'axnos':
			htmloutput(PAINT_AXNOS,$dat);
			exit();
		case 'klecks':{
		$dat['TranslatedLayerName'] = getTranslatedLayerName();
			htmloutput(PAINT_KLECKS,$dat);
			exit();
		}
		default:

		if($dat['normal'] || $dat['pro']){
			$dat['tool']="Shi-Painter";
		}elseif($dat['paintbbs']){
			$dat['tool']="PaintBBS";
		}elseif($dat['chickenpaint']){
			$dat['tool']="ChickenPaint";
		}
		
		htmloutput(PAINTFILE,$dat);
	}
}
// ini_getで取得したサイズ文字列をMBに変換
function ini_get_size_mb(?string $key): float {
	if (!function_exists('ini_get')) return 0;

	$val = trim(ini_get($key));//前後の空白を削除

	if ($val === '') return 0.0;

	// もし完全に数字だけなら、「バイト単位」
	if (is_numeric($val)) {
			return (float)$val / 1024 / 1024;
	}

	$unit = strtoupper(substr($val, -1));
	$num = trim(substr($val, 0, -1));

	//（数字または小数）かチェック
	if (!is_numeric($num)) {
			return 0.0; // 数値部分が無効な場合は0.0を返す
	}

	$num = (float)$num; // 浮動小数点数に変換

	switch ($unit) {// 単位の変換
			case 'G':
					return ($num * 1024);	// GB → MB
			case 'M':
					return $num;						// MB → MB
			case 'K':
					return ($num / 1024);	// KB → MB
			case 'B':
					return ($num / 1024 / 1024);	// バイト → MB
			default:
					return ($num / 1024 / 1024); // 単位なし → バイトとして処理
	}
}
//投稿可能な最大ファイルサイズを取得 単位MB
function get_upload_max_filesize(): float {
	$upload_max = ini_get_size_mb('upload_max_filesize');
	$post_max = ini_get_size_mb('post_max_size');
	return min($upload_max, $post_max);
}

// お絵かきコメント 
function paintcom(): void {
	global $usercode;
	
	$userip = get_uip();
	$host = $userip ? gethostbyaddr($userip) : '';

	$resto = (string)filter_input_data('GET', 'resto',FILTER_VALIDATE_INT);
	$stime = (string)filter_input_data('GET', 'stime',FILTER_VALIDATE_INT);
	//描画時間
	$dat['ptime'] = ($stime && DSP_PAINTTIME) ? calcPtime(time()-$stime) :"";

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
	$handle = opendir(TEMP_DIR);
	$tmp = [];
	while ($file = readdir($handle)) {
		if(!is_dir($file) && pathinfo($file, PATHINFO_EXTENSION)==='dat') {

			$userdata=file_get_contents(TEMP_DIR.$file);
			list($uip,$uhost,$uagent,$imgext,$ucode,) = explode("\t", rtrim($userdata));
			$file_name = pathinfo($file, PATHINFO_FILENAME);
			$imgext=basename($imgext);
			if(is_file(TEMP_DIR.$file_name.$imgext)) //画像があればリストに追加
			//Javaから送信されるIPアドレスはIPv4形式になるのでホスト名でもチェック
			if(($ucode && ($ucode == $usercode))||($uip && ($uip == $userip))||($uhost && ($uhost == $host))){
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

	//フォームの表示時刻をセット
	set_form_display_time();

	htmloutput(OTHERFILE,$dat);
}

// 動画表示
function openpch(): void {

	$dat['paint_mode'] = false;
	$dat['continue_mode'] = false;
	$dat['useneo'] = false;
	$dat['chickenpaint'] = false;
	$dat['pro'] = false;
	$dat['normal'] = false;
	$dat['paintbbs'] = false;
	$dat['type_neo'] = false;

	$dat['parameter_day']=date("Ymd");

	$pch = (string)newstring(filter_input_data('GET', 'pch'));
	$_pch = pathinfo($pch, PATHINFO_FILENAME); //拡張子除去
	$no = (string)filter_input_data('GET', 'no',FILTER_VALIDATE_INT);
	$resno = (string)filter_input_data('GET', 'resno',FILTER_VALIDATE_INT);

	$dat['no'] = $no;
	$dat['oyano'] = $resno;

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
	$dat = array_merge($dat,form());

	if($ext==='.tgkr'){
		htmloutput(TGKR_VIEW,$dat);
	}else{
		htmloutput(PAINTFILE,$dat);
	}
}

// テンポラリ内のゴミ除去 
function deltemp(): void {
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		$file=basename($file);
		if(!is_dir(TEMP_DIR.$file) && is_file(TEMP_DIR.$file)){
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

	$_file=__DIR__.'/templates/errorlog/error.log';
	if(!CHECK_PASSWORD_INPUT_ERROR_COUNT){
		safe_unlink($_file);
	}
	if(is_file($_file)){
		$lapse = time() - filemtime($_file);
		if($lapse > (3*24*3600)){//3日
			safe_unlink($_file);
		}
	}
}

// コンティニュー前画面
function incontinue(): void {
	global $addinfo;

	check_badhost(MSG049);

	$dat['paint_mode'] = false;
	$dat['pch_mode'] = false;
	$dat['useneo'] = false;
	$dat['chickenpaint'] = false;

	$name='';
	$sub='';
	$cext='';
	$ctim='';
	$cptime='';

	$no = (string)filter_input_data('GET', 'no',FILTER_VALIDATE_INT);
	$resno = (string)filter_input_data('GET', 'resno',FILTER_VALIDATE_INT);
	$flag = false;
	$logver='';
	$fp=fopen(LOGFILE,"r");
	while($line = fgets($fp)){//記事ナンバーのログを取得
		if(!trim($line)){
			continue;
		}
		if (strpos(trim($line) . ',', $no . ',') === 0) {
		list($cno,,$name,,$sub,,,,,$cext,$picw,$pich,$ctim,,$cptime,,,,,$logver) = explode(",", rtrim($line).",,,,,,,,");
		$flag = true;
		break;
		}
	}
	closeFile($fp);

	if(!$flag) error(MSG001);
	
	if(!check_elapsed_days($ctim,$logver)){
		error(MSG001);
	};

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
	$dat['oyano'] = h($resno);
	$dat['pch'] = h($ctim);
	$dat['ext'] = h($cext);
	//描画時間
	$cptime=is_numeric($cptime) ? h(calcPtime($cptime)) : h($cptime); 
	$dat['painttime'] = DSP_PAINTTIME ? $cptime :"";
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

	if(ALLOW_ALL_APPS_TO_CONTINUE_DRAWING){
		$dat['use_neo'] = true;
		$dat['use_tegaki'] = true;
		$dat['use_axnos'] = true;
		$dat['use_shi_painter'] = true; 
		$dat['use_chickenpaint'] = true;
		$dat['use_klecks'] = true;
	}
	$arr_apps=app_to_use();

	$dat['select_app']= $select_app ? ($dat['select_app']||ALLOW_ALL_APPS_TO_CONTINUE_DRAWING) : false;
	$dat['app_to_use']=($dat['paint'] && !$dat['select_app'] && !$app_to_use) ? $arr_apps[0]: $app_to_use;

	if(mime_content_type(IMG_DIR.$ctim.$cext)==='image/webp'){
		$dat['use_shi_painter'] = false; 
	}
	$dat['addinfo'] = $addinfo;

	//フォームの表示時刻をセット
	set_form_display_time();

	htmloutput(PAINTFILE,$dat);
}

// コンティニュー認証
function check_cont_pass(): void {

	check_same_origin(true);
	//投稿間隔をチェック
	check_submission_interval();

	$no = (string)filter_input_data('POST', 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$pwdc = (string)filter_input_data('COOKIE', 'pwdc');
	$pwd = $pwd ?: newstring($pwdc);
	$flag = false;
	$fp=fopen(LOGFILE,"r");
	while($line = fgets($fp)){
		if(!trim($line)){
			continue;
		}
		if (strpos(trim($line) . ',', $no . ',') === 0) {
			list($cno,,,,,,,,$cpwd,,,,$ctime,,,,,,,$logver)
			= explode(",", trim($line).",,,,,,,,");
		
			if($cno == $no && check_password($pwd, $cpwd) && check_elapsed_days($ctime,$logver)){
				$flag = true;
				break;
			}
			break;
		}
	}
	closeFile($fp);
	if(!$flag) error(MSG028);
}
function download_app_dat(): void {

	//投稿間隔をチェック
	check_submission_interval();

	check_same_origin(true);

	$pwd=(string)newstring(filter_input_data('POST','pwd'));
	$pwdc = (string)newstring(filter_input_data('COOKIE', 'pwdc'));
	$no=basename((string)filter_input_data('POST','no',FILTER_VALIDATE_INT));
	$pwd = $pwd ?: $pwdc;

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
		error(MSG029);
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
function editform(): void {
	global $addinfo,$fontcolors,$ADMIN_PASS;

	check_badhost();
	check_same_origin();

	//csrfトークンをセット
	$dat['token']=get_csrf_token();
	$thread_no=(string)filter_input_data('POST','thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input_data('POST','logfilename');
	$mode_catalog=(string)filter_input_data('POST','mode_catalog');
	$catalog_pageno=(int)filter_input_data('POST','catalog_pageno',FILTER_VALIDATE_INT);
	$del = (array)($_POST['del'] ?? []);
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$pwdc = (string)newstring(filter_input_data('COOKIE', 'pwdc'));

	if (!is_array($del) && !ctype_cntrl($del[0])) {
		error(MSG031);
	}

	$pwd = $pwd ?: $pwdc;
	$fp=fopen(LOGFILE,"r");
	file_lock($fp, LOCK_EX);
	$buf = get_buffer_from_fp($fp);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = FALSE;

	$time='';
	$logver='';
	$no='';
	$name='';
	$email='';
	$sub='';
	$com='';
	$url='';
	$fcolor='';
	foreach($line as $value){
		if($value){
			if(strpos($value . ',',$del[0]. ',') === 0){
				list($no,,$name,$email,$sub,$com,$url,$ehost,$pass,,,,$time,,,$fcolor,,,,$logver) = explode(",", rtrim($value).",,,,,,,,");
				if ($no == $del[0] && check_password($pwd, $pass, $pwd)){
					$flag = TRUE;
					break;
				}
			}
		}
	}
	closeFile($fp);
	if(!$flag) {
		error(MSG028);
	}
	if(!is_adminpass($pwd) && !check_elapsed_days($time,$logver)){//指定日数より古い記事の編集はエラーにする
			error(MSG028);
	}

	$dat['time'] = h($time);

	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	$dat['usecom'] = USE_COM ? ' *' :'';
	$dat['upfile'] = false;
	
	$dat['post_mode'] = true;
	$dat['rewrite'] = $no;
	$dat['admin'] = is_adminpass($pwd) ? h($ADMIN_PASS):'';
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
function rewrite(): void {

	check_badhost();
	//CSRFトークンをチェック
	check_csrf_token();

	$thread_no=(string)filter_input_data('POST','thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input_data('POST','logfilename');
	$mode_catalog=(string)filter_input_data('POST','mode_catalog');
	$catalog_pageno=(string)filter_input_data('POST','catalog_pageno',FILTER_VALIDATE_INT);
	
	$com = (string)filter_input_data('POST', 'com');
	$name = (string)filter_input_data('POST', 'name');
	$email = (string)filter_input_data('POST', 'email');
	$url = USE_URL_INPUT_FIELD ? (string)filter_input_data('POST', 'url',FILTER_VALIDATE_URL) : '';
	$sub = (string)filter_input_data('POST', 'sub');
	$fcolor = (string)filter_input_data('POST', 'fcolor');
	$no = (string)filter_input_data('POST', 'no',FILTER_VALIDATE_INT);
	$edittime = (string)filter_input_data('POST', 'edittime',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input_data('POST', 'pwd'));
	$admin = (string)filter_input_data('POST', 'admin');

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
	file_lock($fp, LOCK_EX);
	$buf = get_buffer_from_fp($fp);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	// 記事上書き
	$flag = FALSE;
	$time='';
	$logver='';
	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
		if(strpos($value . ',', $no . ',') === 0){
			list($eno,$edate,$ename,,$esub,$ecom,$eurl,$ehost,$epwd,$ext,$w,$h,$time,$chk,$ptime,$efcolor,$pchext,$thumbnail,$tool,$logver,) = explode(",", rtrim($value).',,,,,,,');
			if((!$edittime || $edittime == $time) && $eno == $no && check_password($pwd, $epwd, $admin)){
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
	}
	if(!$flag){
		closeFile($fp);
		error(MSG028);
	}
	if(!is_adminpass($admin) && !check_elapsed_days($time,$logver)){//指定日数より古い記事の編集はエラーにする
		closeFile($fp);
		error(MSG028);
	}

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();

	$destination = $thread_no ? PHP_SELF.'?res='.h($thread_no).'#'.$no : ($logfilename ? './'.h($logfilename) : ($mode_catalog ? PHP_SELF.'?mode=catalog&page='.h($catalog_pageno) : h(PHP_SELF2)));

	redirect($destination . (URL_PARAMETER ? "?".time() : ''));
}
// 画像差し換え
function replace(?string $no="",?string $pwd="",?string $repcode="",bool $java=false): void {
	
	global $path,$temppath,$usercode,$en;

	$replace_error_msg = $en ? 
	"Image replacement failed.\nIt may be left in [Recover Images]."
	:"画像の差し換えに失敗しました。\n未投稿画像に残っている可能性があります。";

	$no = $no ?: (string)filter_input_data('POST', 'no',FILTER_VALIDATE_INT);
	$no = $no ?: (string)filter_input_data('GET', 'no',FILTER_VALIDATE_INT);
	$pwd = $pwd ?: (string)newstring(filter_input_data('POST', 'pwd'));
	$pwd = $pwd ?: (string)newstring(filter_input_data('GET', 'pwd'));
	$repcode = $repcode ?: (string)newstring(filter_input_data('POST', 'repcode'));
	$repcode = $repcode ?: (string)newstring(filter_input_data('GET', 'repcode'));
	$repno="";
	$reptime="";
	if (strpos($repcode, "|") !== false) {
	// $repcodeに、記事Noと元の記事のUNIXタイムが`|`で区分けされて含まれている時
	// 含まれていない時は、記事No、UNIXタイムによる識別を行わない
		list($repno,$reptime)=explode("|","$repcode");
	}
	$repno = $repno && is_numeric($repno) ? $repno :"";
	$reptime = $reptime && is_numeric($reptime) ? $reptime :"";
	$tool = "";
	$userip = get_uip();
	//ホスト取得
	$host = $userip ? gethostbyaddr($userip) : '';
	check_badhost();

	/*--- テンポラリ捜査 ---*/
	$find=false;
	$handle = opendir(TEMP_DIR);
	$starttime ='';
	$postedtime='';
	$file_name='';
	$imgext='';
	while ($file = readdir($handle)) {
		if(!is_dir($file) && preg_match("/\.(dat)\z/i",$file)) {
			$file=basename($file);
			$userdata=file_get_contents(TEMP_DIR.$file);
			list($uip,$uhost,$uagent,$imgext,$ucode,$urepcode,$starttime,$postedtime,$uresto,$tool) = explode("\t", rtrim($userdata)."\t\t\t");//区切りの"\t"を行末に
			$file_name = pathinfo($file, PATHINFO_FILENAME );//拡張子除去
			$imgext=basename($imgext);
			//ユーザーコードまたはipアドレスは一致しているか?
			$valid_poster_found = (($ucode && $ucode == $usercode)||($uip && $uip == $userip)||($uhost && $uhost == $host));
			//画像があり、認識コードがhitすれば抜ける
			if($file_name && is_file(TEMP_DIR.$file_name.$imgext) && $valid_poster_found && $urepcode && ($urepcode === $repcode)){
				$find=true;
				break;
			}
		}
	}
	closedir($handle);
	if(!$find){//見つからなかった時は
		if($java){
			die("error\n{$replace_error_msg}");
		}
		location_paintcom();//通常のお絵かきコメント画面へ。
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
	
	if($starttime && is_numeric($starttime) && $postedtime && is_numeric($postedtime)){
		$psec=(int)$postedtime-(int)$starttime;
		$_ptime = calcPtime($psec);
	}

	//ログ読み込み
	chmod(LOGFILE,PERMISSION_FOR_LOG);
	$fp=fopen(LOGFILE,"r+");
	file_lock($fp, LOCK_EX,['paintcom'=>true]);
	$buf = get_buffer_from_fp($fp);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	// 記事上書き
	$flag = false;
	$pwd=hex2bin($pwd);//バイナリに
	$pwd=openssl_decrypt($pwd,CRYPT_METHOD, CRYPT_PASS, true, CRYPT_IV);//復号化
	$oyano='';
	$pch_src='';
	$aco_src='';
	$upfile='';
	$etim='';
	$logver='';
	$ptime='';
	$edate='';
	$i=0;
	$name='';
	$email='';
	$sub='';
	$com='';
	$url='';
	$epwd='';
	$fcolor='';
	$ext='';
	foreach($line as $i => $value){
		if(!trim($value)){
			continue;
		}
			if(strpos($value . ',', $no . ',') === 0){
			list($eno,$edate,$name,$email,$sub,$com,$url,$ehost,$epwd,$ext,$_w,$_h,$etim,,$ptime,$fcolor,$epchext,$ethumbnail,$etool,$logver,) = explode(",", rtrim($value).',,,,,,,');
			//画像差し換えに管理パスは使っていない
			if((!$reptime || ($reptime === $etim)) &&  ($eno === $no) && check_password($pwd, $epwd)){
				$flag = true;
				break;
			}
		}
	}
	if(!$flag){
		closeFile($fp);
		if($java){
			die("error\n{$replace_error_msg}");
		}
		location_paintcom();
	}

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
		if($java){
			die("error\n{$replace_error_msg}");
		}
		location_paintcom();
	}

	$upfile = $temppath.$file_name.$imgext;
	$dest = $temppath.$time.'.tmp';
	
	//サポートしていないフォーマットならエラーが返る
	if(!getImgType($upfile)){
		error(MSG003, $upfile);
	};
	copy($upfile, $dest);
	
	if(!is_file($dest)) error(MSG003);
	chmod($dest,PERMISSION_FOR_DEST);

	//ファイルサイズが規定サイズを超過していたらWebPに変換
	convert2($temppath,$time,".tmp");

	$imgext = getImgType($dest);
	//サポートしていないフォーマットならエラーが返る
	if(!$imgext){
		error(MSG003, $dest);
	}


	$chk = substr(hash_file('sha256', $dest), 0, 32);
	check_badfile($chk, $dest); // 拒絶画像チェック

	list($w, $h) = getimagesize($dest);

	chmod($dest,PERMISSION_FOR_DEST);
	rename($dest,$path.$time.$imgext);

	$oya=($oyano===$no);
	$max_w = $oya ? MAX_W : MAX_RESW ;
	$max_h = $oya ? MAX_H : MAX_RESH ;
	list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);

	//サムネイル作成
	$thumbnail = make_thumbnail($time.$imgext,$time,$max_w,$max_h);

	//PCHファイルアップロード
	// .pch, .spch,.chi,.psd ブランク どれかが返ってくる
	if ($pchext = check_pch_ext($temppath . $file_name,['upfile'=>true])) {
		$pch_src = $temppath.$file_name.$pchext;
		$pch_dst = PCH_DIR . $time . $pchext;
		if(copy($pch_src, $pch_dst)){
			chmod($pch_dst, PERMISSION_FOR_DEST);
		}
	}
	//litaChixのカラーセット
	$aco_src = $temppath.$file_name.".aco";
	$aco_dst = IMG_DIR.$time.".aco";
	if(is_file($aco_src)){
		if(copy($aco_src, $aco_dst)){
			chmod($aco_dst,0606);
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

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();

	//旧ファイル削除
	delete_files($path, $etim, $ext);

	//ワークファイル削除
	safe_unlink($pch_src);
	safe_unlink($aco_src);
	safe_unlink($upfile);
	safe_unlink($temppath.$file_name.".dat");
	if(!$java){
		redirect(h(PHP_SELF)."?res={$oyano}&resid={$no}#{$no}");
	}
}
//非同期通信の時にpaintcom()を呼び出すためのリダイレクト
function location_paintcom(): void {
	redirect(h(PHP_SELF).'?mode=piccom');
}

// カタログ
function catalog(): void {

	$page = (int)filter_input_data('GET', 'page',FILTER_VALIDATE_INT);

	$page=$page<0 ? 0 : $page;
	
	$trees=get_log(TREEFILE);

	$counttree = count($trees);

	$disp_threads = array_slice($trees,(int)$page,CATALOG_PAGE_DEF,false);
	$treeline=[];
	foreach($disp_threads as $val){
		$treeline[]=explode(",", trim($val),2)[0];
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
		unset($line[$j]);//使用した行は消す(メモリ節約のため)
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
function charconvert(?string $str): string {
	mb_language(LANG);
		return mb_convert_encoding($str, "UTF-8", "auto");
}

// NGワードがあれば拒絶
function Reject_if_NGword_exists_in_the_post(): void {
	global $badstring,$badname,$badurl,$badstr_A,$badstr_B;

	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG049);

	$com = (string)filter_input_data('POST', 'com');
	$name = (string)filter_input_data('POST', 'name');
	$email = (string)filter_input_data('POST', 'email');
	$url = (string)filter_input_data('POST', 'url',FILTER_VALIDATE_URL);
	$sub = (string)filter_input_data('POST', 'sub');
	$pwd = (string)filter_input_data('POST', 'pwd');
	$admin = (string)filter_input_data('POST', 'admin');

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
		if ($com_len && !preg_match("/[ぁ-んァ-ヶｧ-ﾝー一-龠]+/u",$chk_com)) error(MSG035);
	}
	//本文へのURLの書き込みを禁止
	if(!(is_adminpass($pwd)||is_adminpass($admin))){//どちらも一致しなければ
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
function create_formatted_text_from_post(?string $com,?string $name,?string $email,?string $url,?string $sub,?string $fcolor,?string $dest=''): array {

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
	if(preg_match("/(.*?)(#|＃)(.*)/",$name,$regs)){
		$cap = $regs[3];
		$cap=strtr($cap,"&amp;", "&");
		$cap=strtr($cap,"&#44;", ",");
		$name = $regs[1];
		$trip = "";
		if($cap){
			$salt=substr($cap."H.",1,2);
			$salt=preg_replace("/[^\.-z]/",".",$salt);
			$salt=strtr($salt,":;<=>?@[\\]^_`","ABCDEFGabcdef");
			$trip="◆".substr(crypt($cap,$salt),-10);
			$trip = strtr($trip,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~\t","ABCDEFGHIJKLMNOabcdefghijklmno");
		}
		if(!$name) $name=DEF_NAME;
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
function htmloutput(?string $template,array $dat, bool $buf_flag=false):?string {

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
	exit();
}

function redirect (?string $url): void {

	header("Location: {$url}");
	exit();
}

function getImgType (?string $dest): string {

	if(!$dest || !is_file($dest)){
		return "";
	}

	$img_type=mime_content_type($dest);

	switch ($img_type) {
		case "image/gif" : return ".gif";
		case "image/jpeg" : return ".jpg";
		case "image/png" : return ".png";
		case "image/webp" : return ".webp";
		default : return "";
	}
	
}
//縮小表示
function image_reduction_display(int $w,int $h,int $max_w,int $max_h): array {
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
 */
function calcPtime (int $psec): string {

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
function check_pch_ext (?string $filepath,array $options = []): string {
	
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
function safe_unlink (?string $path): bool {
	clearstatcache();
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
function delete_files (?string $path,?string $filename,?string $ext): void {
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
function is_ngword (array $ngwords, $strs): bool {
	if (empty($ngwords)||empty($strs)) {
		return false;
	}
	$strs = (array)$strs;//配列に変換
	foreach($ngwords as $i => $ngword){//拒絶する文字列
		$ngwords[$i]  = str_replace([" ", "　"], "", $ngword);
		$ngwords[$i]  = str_replace("/", "&#47;", $ngwords[$i]);
	}
	foreach ($strs as $str) {
		$str = str_replace("/", "&#47;", $str);
		foreach($ngwords as $ngword){//拒絶する文字列
			if ($ngword !== '' && preg_match("/{$ngword}/ui", $str)){
				return true;
			}
			if (preg_match('/\p{M}{3,}/u', $str)) {
				return true;
			}
		}
	}
	return false;
}

//PNG形式またはWebP形式で上書き保存
function convert2(?string $path,?string $time,?string $ext,bool $is_upload_img=false,?string $upload_img_mime_type=""): void {

	$fname= basename($time.$ext);
	$upfile=$path.$fname;
	if(mime_content_type($upfile)==="image/gif"){
		return;//GIF形式の時は処理しない
	}

	clearstatcache();
	$filesize=filesize($upfile);
	//GDのPNGのサイズは少し大きくなるので制限値を1.5で割る
	$max_kb_size_over = ($filesize > (MAX_KB * 1024 / 1.5));

	//お絵かき画像は必ずPNG形式
	//ファイルサイズが小さな時はもとのPNGのまま何もしない
	if(!$is_upload_img && !$max_kb_size_over){
			 return;
	}
	$upload_img_mime_type = ($upload_img_mime_type === true) ? "image/png" : $upload_img_mime_type;

		switch($upload_img_mime_type){
		case "image/png":
			//サイズ違反チェック
			if($max_kb_size_over){
				//WebP形式で保存
				$img = thumbnail_gd::thumb($path,$fname,$time,null,null,['2webp'=>true]);
			}else{
				$img = thumbnail_gd::thumb($path,$fname,$time,null,null,['2png'=>true]);
			}
				break;
		case "image/jpeg":
				$img = thumbnail_gd::thumb($path,$fname,$time,null,null,['2jpeg'=>true]);
				break;
		default:
			//上記caseに該当しないmime_typeの時、またはお絵かき画像の時は
			//WebP形式で保存
			$img = thumbnail_gd::thumb($path,$fname,$time,null,null,['2webp'=>true]);
			break;
	}

	if(is_file($img)){
		rename($img,$upfile);//上書き保存
		chmod($upfile,PERMISSION_FOR_DEST);
	}
}

//Exifをチェックして画像が回転している時は上書き保存
function check_jpeg_exif(?string $dest): void {

	if((exif_imagetype($dest) !== IMAGETYPE_JPEG ) || !function_exists("imagecreatefromjpeg")){
		return;
	}
	//画像回転の検出
	$exif = @exif_read_data($dest);//サポートされていないタグの時に`E_NOTICE`が発生するため`@`で制御
	$orientation = $exif["Orientation"] ?? 1;

	if ($orientation === 1) {
	//画像が回転していない時
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
	//何度も保存しなおすのを回避するため、
	//指定範囲内にリサイズしておく。
	if(function_exists("ImageCreateTrueColor") && function_exists("ImageCopyResampled")){
		$im_out = ImageCreateTrueColor($out_w, $out_h);
		ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
	}
	// 画像を保存
	imagepng($im_out, $dest,3);//圧縮率3で保存
	// 画像のメモリを解放
	if(PHP_VERSION_ID < 80000) {//PHP8.0未満の時は
		imagedestroy($im_in);
		imagedestroy($im_out);
	}
}
//禁止ホストチェック
function is_badhost (): bool {
	global $badip;

	session_sta();
	$session_is_badhost = $_SESSION['is_badhost'] ?? false; //SESSIONに保存された値を取得
	if(USE_BADHOST_SESSION_CACHE && $session_is_badhost){
		return true; //セッションに禁止ホストフラグがあれば拒絶
	}

	//ホスト取得
	$userip = get_uip();
	$host = $userip ? gethostbyaddr($userip) :'';

	if($host === $userip){//ホスト名がipアドレスになる場合は

		if(REJECT_IF_NO_REVERSE_DNS){
			if(!$host || filter_var($userip, FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)){//IPv4アドレスなら
				$_SESSION['is_badhost'] = true;
				return true; //逆引きできないIPは拒絶
			}
		}
		
		foreach($badip as $value){
			if (preg_match("/\A$value/i",$host)) {//前方一致
			$_SESSION['is_badhost'] = true;
			return true;;
			}
		}
	}else{
		foreach($badip as $value){
			if (preg_match("/$value\z/i",$host)) {
			$_SESSION['is_badhost'] = true;
			return true;
			}
		}
	}
	return false; //禁止ホストではない
}

function check_badhost(?string $err_message = ""): void {
	if(is_badhost()){//禁止ホストなら
		$err_message = $err_message ?: MSG016; //エラーメッセージがなければデフォルトメッセージ
		error($err_message);
	}
}

function check_badfile (?string $chk, ?string $dest = ''): void {
	global $badfile;
	foreach($badfile as $value){
		if(preg_match("/\A$value/",$chk)){
			error(MSG049,$dest); //拒絶画像
		}
	}
}
function h(?string $str): string {//出力のエスケープ
	if($str===0 || $str==='0'){
		return '0';
	}
	if(!$str){
		return '';
	}
	return htmlspecialchars((string)$str,ENT_QUOTES,'utf-8',false);
}

function create_res (?string $line, array $options = []): array {
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
		'fontcolor' => $fcolor ?: DEF_FONTCOLOR, //文字色
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
	$res['encoded_no'] = rawurlencode($res['no']);
	$res['encoded_name'] = rawurlencode($res['name']);
	$res['share_name'] = encode_for_share($res['name']);
	$res['share_sub'] = encode_for_share($res['sub']);
	$res['encoded_t'] = encode_for_share('['.$res['no'].']'.$res['sub'].($res['name'] ? ' by '.$res['name'] : '').' - '.TITLE);
	$res['encoded_u'] = rawurlencode(ROOT_URL.PHP_SELF.'?res='.$res['no']);
	 

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
function encode_for_share(?string $str): string {
	$str = str_replace("&#44;",",", $str);
	$str = htmlspecialchars_decode((string)$str, ENT_QUOTES);
	return h(rawurlencode($str));
}

function saveimage(): void {
	
	$tool=filter_input_data('GET',"tool");

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
function separateDatetimeAndId (?string $date): array {
	if (preg_match("/(.+) ID:(.*)/", $date, $regs)){
		return [$regs[2],$regs[1]];
	}
	return ['', $date];
}

/**
 * 名前とトリップを分離
 * @param $name
 * @return array
 */
function separateNameAndTrip (?string $name): array {
	$name=strip_tags($name);//タグ除去
	if(preg_match("/(.*)(◆.*)/", $name, $regs)){
		return [$regs[1], $regs[2]];
	}
	return [$name, ''];
}

/**
 * 日付と編集マークを分離
 * @param $date
 * @return array
 */
function separateDatetimeAndUpdatemark (?string $date): array {
	if (UPDATE_MARK && strpos($date, UPDATE_MARK) !== false){
		return [str_replace(UPDATE_MARK,"",$date), UPDATE_MARK];
	}
	return [$date, ''];
}

/**
 * 一括書き込み（上書き）
 * @param resource|false $fp
 */
function writeFile ($fp, ?string $data): void {
	ftruncate($fp,0);
	rewind($fp);
	stream_set_write_buffer($fp, 0);
	fwrite($fp, $data);
}
/**
 * @param resource|false $fp
 */

function closeFile ($fp): void {
	if($fp){
		fflush($fp);
		file_lock($fp, LOCK_UN);
		fclose($fp);
	}
}

function getId (?string $userip): string {
	return substr(hash('sha256', $userip.ID_SEED, false),-8);
}

/**
 * 古いスレッドへの投稿を許可するかどうか
 * @param string|null|int $microtime  
 * @param string|null|int $logver  
 */
function check_elapsed_days ($microtime,$logver=""): bool {

	$time = microtime2time($microtime,$logver);

	return ELAPSED_DAYS && $time //古いスレッドのフォームを閉じる日数が設定されていたら
		? ((time() - $time)) <= ((int)ELAPSED_DAYS * 86400) // 指定日数以内なら許可
		: true; // フォームを閉じる日数が未設定なら許可
}
/**
 * マイクロ秒を秒に戻す
 * @param string|null|int $microtime  
 * @param string|null|int $logver  
 */
function microtime2time($microtime,$logver): int {
	$microtime=(string)$microtime;
	$time = $logver==="6" ? substr($microtime,0,-3):
	(strlen($microtime)>12 ? substr($microtime,-13,-3) : 
	$microtime); 
	return ctype_digit($time) ? (int)$time : 0;
}

//逆変換テーブル作成
function get_lineindex (array $line): array {
	$lineindex = [];
	foreach($line as $i =>$value){
		if(!trim($value)){
		continue;
		}
		list($no,) = explode(",", $value,2);
		if(!ctype_digit($no)){//記事Noが正しく読み込まれたかどうかチェック
			error(MSG019);
		};
		$lineindex[$no] = $i; // 値にkey keyに記事no
		unset($line[$i]);
	}
	return $lineindex;
}

function check_password (?string $pwd,?string  $hash,?string $adminPass = ""): bool {
	return
		($pwd && (password_verify($pwd, $hash)))
		|| is_adminpass($adminPass); // 管理パスを許可する場合
}
function is_neo(?string $src):bool {//neoのPCHかどうか調べる
	$fp = fopen("$src", "rb");
	if (!$fp) {
		return false; // ファイルが開けなかった場合は false を返す
	}
	$is_neo=(fread($fp,3)==="NEO");
	fclose($fp);
	return $is_neo;
}
//使用するペイントアプリの配列化
function app_to_use(): array {

	$arr_apps=[];
		if(USE_PAINTBBS_NEO){
			$arr_apps[]='neo';
		}
		if(USE_TEGAKI){
			$arr_apps[]='tegaki';
		}
		if(USE_AXNOS){
			$arr_apps[]='axnos';
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
function get_pch_size(?string $src): ?array {
	if(!$src){
		return null;
	}
	$fp = fopen("$src", "rb");
	$is_neo=(fread($fp,3)==="NEO");//ファイルポインタが3byte移動
	$pch_data=bin2hex(fread($fp,8));
	fclose($fp);
	if(!$pch_data){
		return null;
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
			return null;
		}
		$w0=hexdec(substr($pch_data,6,2));
		$w1=hexdec(substr($pch_data,8,2));
		$h0=hexdec(substr($pch_data,10,2));
		$h1=hexdec(substr($pch_data,12,2));
	}
	if(!is_numeric($w0)||!is_numeric($w1)||!is_numeric($h0)||!is_numeric($h1)){
		return null;
	}
	$width=(int)$w0+((int)$w1*256);
	$height=(int)$h0+((int)$h1*256);
	if(!$width||!$height){
		return null;
	}
	return[(int)$width,(int)$height];
}
//spchデータの幅と高さ
function get_spch_size(?string $src): ?array {
	if(!$src){
		return null;
	}
	if(mime_content_type($src)!=="application/octet-stream"){
		return null;
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
		return null;
	}
	if(!$width||!$height){
		return null;
	}
	return[(int)$width,(int)$height];
}
//表示用のログファイルを取得
function get_log(?string $logfile): array {
	if(!$logfile){
		error(MSG019);
	}
	$lines=[];
	$fp=fopen($logfile,"r");
	if(!$fp){
		error(MSG019);
	}
	while($line = fgets($fp)){
		if(!trim($line)){
			continue;
		}
		$lines[]=$line;
	}
	closeFile($fp);
	
	if(empty($lines)){
		error(MSG019);
	}
	return $lines;
}

/**
 * fpからバッファを取得
 * @param resource|false $fp
 */
function get_buffer_from_fp($fp): string {

	rewind($fp);//ファイルポインタを先頭に戻す

	$lines = [];
	
	// 1行ずつ読み込む
	while ($line = fgets($fp)) {
		if (!trim($line)) {
				continue; // 空行はスキップ
		}
		$lines[] = $line;
	}
	return implode("", $lines);  // 行を1つのバッファにまとめて返す
}
//ログファイルサイズが大きすぎる時はエラーにする
function check_log_size_limit(): void {
	if(filesize(LOGFILE)>(int)MAX_LOG_FILESIZE*1024*1024){//15MB
		error(MSG052);
	}
}

//パスワードを5回連続して間違えた時は拒絶
function check_password_input_error_count(): void {
	$file=__DIR__.'/templates/errorlog/error.log';
	if(!CHECK_PASSWORD_INPUT_ERROR_COUNT){
		return;
	}
	$userip = get_uip();
	check_dir(__DIR__.'/templates/errorlog/');
	$arr_err=is_file($file) ? file($file):[];
	if(count($arr_err)>=5){
		error(MSG051);
	}
if(!is_adminpass(filter_input_data('POST','pass'))){
	$errlog=$userip."\n";
	file_put_contents($file,$errlog,FILE_APPEND);
	chmod($file,0600);
	}else{
		safe_unlink($file);
	}
}

// 優先言語のリストをチェックして対応する言語があればその翻訳されたレイヤー名を返す
function getTranslatedLayerName(): string {
	$acceptedLanguages = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
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
		if (strpos($language, 'ko') === 0) {
			return "레이어";
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
function is_paint_tool_name(?string $tool): string {
	$tool = in_array($tool,["Upload","PaintBBS NEO","PaintBBS","Shi-Painter","Tegaki","Klecks","ChickenPaint","litaChit","litaChix","Axnos Paint"]) ? $tool :'';
	$tool = ($tool==="ChickenPaint"||$tool==="litaChit") ? "litaChix" : $tool;
	return (string)$tool;
}
/**
 * ツリーnoと一致する行の配列を作成
 * @param resource|false $fp
 */

function create_line_from_treenumber ($fp,array $trees): array {

	rewind($fp);
	$line=[];
	$treeSet = array_flip($trees);//配列のキーと値を反転
	while($lines = fgets($fp)){
		if(!trim($lines)){
			continue;
		}
		list($no,) = explode(",", $lines,2);
		if(isset($treeSet[$no])) {//$treesに含まれている記事番号なら定義ずみ
			$line[]=trim($lines);
		}
	}
	return $line;
}
//サムネイル作成
function make_thumbnail(?string $imgfile,?string $time,?string $max_w,?string $max_h): string {
	$thumbnail='';
	if(USE_THUMB){//スレッドの画像のサムネイルを使う時
		if(thumbnail_gd::thumb(IMG_DIR,$imgfile,$time,$max_w,$max_h)){
			$thumbnail='thumbnail';
		}
	}
	return $thumbnail;
}

//管理者パスワード?
function is_adminpass(?string $pwd):bool {
	global $ADMIN_PASS;
	if($ADMIN_PASS && $pwd && hash_equals($ADMIN_PASS,$pwd)){
		return true;
	}
	return false;

}
/**
 * flockのラッパー関数 
 * @param resource|false $fp
 */
function file_lock($fp, int $lock, array $options=[]): void {

	global $en;
	$flock=flock($fp, $lock);
	if (!$flock) {
			if($lock !== LOCK_UN){
				if(isset($options['paintcom'])){
					location_paintcom();//未投稿画像の投稿フォームへ
				}
				error($en ? 'Failed to lock the file.' : 'ファイルのロックに失敗しました。');
		}
	}
}

//filter_input のラッパー関数
function filter_input_data(?string $input, ?string $key, int $filter=FILTER_UNSAFE_RAW) {
	// $_GETまたは$_POSTからデータを取得
	$value = null;
	if ($input === 'GET') {
			$value = filter_input(INPUT_GET, $key, $filter);
	} elseif ($input === 'POST') {
			$value = filter_input(INPUT_POST, $key, $filter);
	} elseif ($input === 'COOKIE') {
			$value = filter_input(INPUT_COOKIE, $key, $filter);
	}
		return $value;
}

//フォームの表示時刻をセット
function set_form_display_time(): void {
	session_sta();
	$_SESSION['form_display_time'] = microtime(true);
}
//投稿間隔をチェック
function check_submission_interval(): void {

	// デフォルトで0.8秒の間隔を設ける
	$min_interval = 0.8; // 0.8秒待機

	session_sta();
	if (!isset($_SESSION['form_display_time'])) {
		set_form_display_time();
		if (!isset($_SESSION['form_display_time'])) {
			error(MSG049);
		}
	}
	$form_display_time = $_SESSION['form_display_time'];
	$now = microtime(true);

	if (($now - $form_display_time) < $min_interval) {
		set_form_display_time();
		error(MSG053);
	}
}
