<?php
define('USE_DUMP_FOR_DEBUG','0');
//HTML出力の前に$datをdump しない:0 する:1 dumpしてexit：2 
// ini_set('error_reporting', E_ALL);


// POTI-board EVO
// バージョン :
define('POTI_VER','v3.22.8');
define('POTI_LOT','lot.220112');

/*
  (C) 2018-2022 POTI改 POTI-board redevelopment team
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
  * PAINTBBS NEO
  *     (C)funige >> https://github.com/funige/neo/
  *
  * USE FUNCTION :
  *   Skinny.php            (C)Kuasuki   >> http://skinny.sx68.net/
  *   DynamicPalette        (C)NoraNeko  >> wondercatstudio
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

if (($phpver = phpversion()) < "5.5.0") {
	die("Error. PHP version 5.5.0 or higher is required for this program to work. <br>\n(Current PHP version:{$phpver})");
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

//設定の読み込み
if ($err = check_file(__DIR__.'/config.php')) {
	error($err);
}
require(__DIR__.'/config.php');

//HTMLテンプレート Skinny
if ($err = check_file(__DIR__.'/Skinny.php')) {
	error($err);
}
require_once(__DIR__.'/Skinny.php');

//Template設定ファイル
if ($err = check_file(__DIR__.'/'.SKIN_DIR.'template_ini.php')) {
	error($err);
}
require(__DIR__.'/'.SKIN_DIR.'template_ini.php');

$path = realpath("./").'/'.IMG_DIR;
$temppath = realpath("./").'/'.TEMP_DIR;

//サムネイルfunction
if ($err = check_file(__DIR__.'/thumbnail_gd.php')) {
	error($err);
}
require(__DIR__.'/thumbnail_gd.php');

//CheerpJ
define('CHEERPJ_URL', 'https://cjrtnc.leaningtech.com/2.2/loader.js');

//POTI_VERLOT定義
define('POTI_VERLOT', POTI_VER.' '.POTI_LOT);

//ユーザー削除権限 (0:不可 1:treeのみ許可 2:treeと画像のみ許可 3:tree,log,画像全て許可)
//※treeのみを消して後に残ったlogは管理者のみ削除可能
define('USER_DELETES', '3');

//メール通知クラスのファイル名
define('NOTICEMAIL_FILE' , 'noticemail.inc');

//タイムゾーン
defined('DEFAULT_TIMEZONE') or define('DEFAULT_TIMEZONE','Asia/Tokyo');
date_default_timezone_set(DEFAULT_TIMEZONE);

//ペイント画面の$pwdの暗号化
defined('CRYPT_PASS') or define('CRYPT_PASS','qRyFfhV6nyUggSb');//暗号鍵初期値
define('CRYPT_METHOD','aes-128-cbc');
define('CRYPT_IV','T3pkYxNyjN7Wz3pu');//半角英数16文字

//指定した日数を過ぎたスレッドのフォームを閉じる
defined('ELAPSED_DAYS') or define('ELAPSED_DAYS','0');

//テーマに設定が無ければ代入
defined('DEF_FONTCOLOR') or define('DEF_FONTCOLOR',null);//色選択
defined('ADMIN_DELGUSU') or define('ADMIN_DELGUSU',null);//管理画面の色設定
defined('ADMIN_DELKISU') or define('ADMIN_DELKISU',null);//管理画面の色設定

//画像アップロード機能を 1.使う 0.使わない  
defined('USE_IMG_UPLOAD') or define('USE_IMG_UPLOAD','1');

//画像のないコメントのみの新規投稿を拒否する する:1 しない:0
defined('DENY_COMMENTS_ONLY') or define('DENY_COMMENTS_ONLY', '0');

//パレット切り替え機能を使用する する:1 しない:0
defined('USE_SELECT_PALETTES') or define('USE_SELECT_PALETTES', '0');

//編集しても投稿日時を変更しないようにする する:1 しない:0 
defined('DO_NOT_CHANGE_POSTS_TIME') or define('DO_NOT_CHANGE_POSTS_TIME', '0');

//画像なしのチェックボックスを使用する する:1 しない:0 
defined('USE_CHECK_NO_FILE') or define('USE_CHECK_NO_FILE', '0');
//CSRFトークンを使って不正な投稿を拒絶する する:1 しない:0
defined('CHECK_CSRF_TOKEN') or define('CHECK_CSRF_TOKEN', '0');

//マークダウン記法のリンクをHTMLに する:1 しない:0
defined('MD_LINK') or define('MD_LINK', '0');

//描画時間を合計表示に する:1 しない:0 
defined('TOTAL_PAINTTIME') or define('TOTAL_PAINTTIME', '1');

//しぃペインターを使う 使う:1 使わない:0 
defined('USE_SHI_PAINTER') or define('USE_SHI_PAINTER', '1');
//ChickenPaintを使う 使う:1 使わない:0 
defined('USE_CHICKENPAINT') or define('USE_CHICKENPAINT', '1');
//レス画像から新規投稿で続きを描いた画像はレスにする する:1 しない:0
defined('RES_CONTINUE_IN_CURRENT_THREAD') or define('RES_CONTINUE_IN_CURRENT_THREAD', '1');
//レス画面に前後のスレッドの画像を表示する する:1 しない:0
defined('VIEW_OTHER_WORKS') or define('VIEW_OTHER_WORKS', '1');

//パーミッション

defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606);
defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600);
defined('PERMISSION_FOR_DIR') or define('PERMISSION_FOR_DIR', 0707);

//メッセージ
//template_ini.phpで未定義の時の初期値
//このままでよければ定義不要
defined('HONORIFIC_SUFFIX') or define('HONORIFIC_SUFFIX', 'さん');
defined('UPLOADED_OBJECT_NAME') or define('UPLOADED_OBJECT_NAME', '画像');
defined('UPLOAD_SUCCESSFUL') or define('UPLOAD_SUCCESSFUL', 'のアップロードが成功しました');
defined('THE_SCREEN_CHANGES') or define('THE_SCREEN_CHANGES', '画面を切り替えます');
defined('MSG044') or define('MSG044', '最大ログ数が設定されていないか、数字以外の文字列が入っています。');
defined('MSG045') or define('MSG045', 'アップロードペイントに対応していないファイルです。<br>対応フォーマットはpch、spch、chiです。');
defined('MSG046') or define('MSG046', 'パスワードが短すぎます。最低6文字。');
defined('MSG047') or define('MSG047', '画像の幅と高さが大きすぎるため続行できません。');

$ADMIN_PASS=isset($ADMIN_PASS) ? $ADMIN_PASS : false; 
if(!$ADMIN_PASS){
	error(MSG040);
}

if(!defined('LOG_MAX')|| !LOG_MAX || !is_numeric(LOG_MAX)){
	error(MSG044);
}

//初期化
init();		//←■■初期設定後は不要なので削除可■■
//テンポラリ
deltemp();

//user-codeの発行
if(!$usercode){//falseなら発行
	$userip = get_uip();
	$usercode = (string)substr(crypt(md5($userip.ID_SEED.date("Ymd", time())),'id'),-12);
	//念の為にエスケープ文字があればアルファベットに変換
	$usercode = strtr($usercode,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~","ABCDEFGHIJKLMNOabcdefghijklmn");
}
setcookie("usercode", $usercode, time()+(86400*365));//1年間

switch($mode){
	case 'regist':
		if(ADMIN_NEWPOST && !$resto){
			if($pwd && ($pwd !== $ADMIN_PASS)){
				return error(MSG029);
			}
			$admin=$pwd;
		}
		return regist();
	case 'admin':

		if(!$pass){
			$dat['admin_in'] = true;
			return htmloutput(SKIN_DIR.OTHERFILE,$dat);
		}
		if($pass && ($pass !== $ADMIN_PASS)) 
		return error(MSG029);
	
		if($admin==="del") return admindel($pass);
		if($admin==="post"){
			$dat['post_mode'] = true;
			$dat['regist'] = true;
			$dat = array_merge($dat,form($res,'valid'));
			return htmloutput(SKIN_DIR.OTHERFILE,$dat);
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
		return htmloutput(SKIN_DIR.OTHERFILE,$dat);
	case 'edit':
		return editform();
	case 'rewrite':
		return rewrite();
	case 'picrep':
		return replace();
	case 'catalog':
		return catalog();
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
	if ($ip = getenv("HTTP_CLIENT_IP")) {
		return $ip;
	} elseif ($ip = getenv("HTTP_X_FORWARDED_FOR")) {
		return $ip;
	}
	return getenv("REMOTE_ADDR");
}
//session開始
function session_sta(){
	if(!isset($_SESSION)){
		session_set_cookie_params(
			0,"","",null,true
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
	session_sta();
	$token=(string)filter_input(INPUT_POST,'token');
	$session_token=isset($_SESSION['token']) ? $_SESSION['token'] : '';
	if(!$session_token||$token!==$session_token){
		error(MSG006);
	}
}
	
// ベース
function basicpart(){
	global $pallets_dat;
	$dat['title'] = TITLE;
	$dat['home']  = HOME;
	$dat['self']  = PHP_SELF;
	$dat['self2'] = h(PHP_SELF2);
	$dat['paint'] = USE_PAINT ? true : false;
	$dat['applet'] = APPLET ? true : false;
	$dat['usepbbs'] = APPLET!=1 ? true : false;
	
	$dat['select_app'] =(USE_SHI_PAINTER||USE_CHICKENPAINT) ? true : false;//しぃペインターとChickenPaintを使うかどうか?
	$dat['app_to_use'] = $dat['select_app'] ? false : "neo";
	$dat['use_shi_painter'] = USE_SHI_PAINTER ? true : false;
	$dat['use_chickenpaint'] = USE_CHICKENPAINT ? true : false;
	$dat['ver'] = POTI_VER;
	$dat['verlot'] = POTI_VERLOT;
	$dat['tver'] = TEMPLATE_VER;
	$dat['userdel'] = USER_DELETES;
	$dat['charset'] = 'UTF-8';
	$dat['skindir'] = SKIN_DIR;
	$dat['for_new_post'] = (!USE_IMG_UPLOAD && DENY_COMMENTS_ONLY) ? false : true;
	//OGPイメージ シェアボタン
	$dat['rooturl'] = ROOT_URL;//設置場所url
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
			$arr_palette_select_tags[$i]='<option value="'.$i.'">'.$p_name.'</option>';
		}
		$dat['palette_select_tags']=implode("",$arr_palette_select_tags);
	}
	$dat['hide_the_checkbox_for_nofile'] = USE_CHECK_NO_FILE ? false : true;//poti本体が古い時はfalse→画像なしのチェックが出る
	$dat['_san']=HONORIFIC_SUFFIX;
	$dat['cheerpj_url']=CHEERPJ_URL;
	$dat['n']=false;//コメント行
	$dat['resform'] = false;//ミニフォーム廃止	

	//初期化 PHP8.1 OTHERFILE 
	$dat['post_mode']=false;
	$dat['rewrite']=false;
	$dat['admin']=false;
	$dat['admin_in']=false;
	$dat['admin_del']=false;
	$dat['pass']=false;
	$dat['regist']=false;
	$dat['mes']=false;
	$dat['err_mode']=false;
	$dat['resno']=false;
	$dat['pictmp']=false;
	$dat['notmp']=false;
	$dat['ptime']=false;
	$dat['name']=false;
	$dat['email']=false;
	$dat['url']=false;
	$dat['sub']=false;
	$dat['com']=false;
	$dat['ipcheck']=false;
	$dat['tmp']=false;

	return $dat;
}

// 投稿フォーム 
function form($resno="",$adminin="",$tmp=""){
	global $addinfo;
	global $fontcolors,$qualitys;
	global $ADMIN_PASS;

	$admin_valid = ($adminin === 'valid');
	//csrfトークンをセット
	$dat['token']= CHECK_CSRF_TOKEN ? get_csrf_token() : '';

	$quality = filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);

	$dat['form'] = $resno ? true : false;

	$dat['pdefw'] = USE_PAINT ? PDEF_W : '';
	$dat['pdefh'] = USE_PAINT ? PDEF_H : '';
	$dat['anime'] = USE_PAINT ? (USE_ANIME ? true : false) : false;
	$dat['animechk'] = USE_PAINT ? (DEF_ANIME ? ' checked' : '') :'';
	$dat['pmaxw'] = USE_PAINT ? PMAX_W : '';
	$dat['pmaxh'] = USE_PAINT ? PMAX_H : '';
	$dat['paint2'] = USE_PAINT ? ($resno ? false : true):false;

	$dat['resno'] = $resno ? $resno :'';
	$dat['notres'] = $resno ? false : true;
	
	$dat['paintform'] = USE_PAINT ? ($resno ? (RES_UPLOAD ? true :false) :true):false;
	$dat['admin'] = $admin_valid ? h($ADMIN_PASS) :'';

	$dat['maxbyte'] = 2048 * 1024;//フォームのHTMLによるファイルサイズの制限 2Mまで
	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	$dat['usecom'] = (USE_COM||($resno&&!RES_UPLOAD)) ? ' *' :'';
	//本文必須の設定では無い時はレスでも画像かコメントがあれば通る
	$dat['upfile'] = false;
	if(!USE_IMG_UPLOAD && !$admin_valid){//画像アップロード機能を使わない時
		$dat['upfile'] = false;
	} else{
		if((!$resno && !$tmp) || (RES_UPLOAD && !$tmp)) $dat['upfile'] = true;
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
	$undo = (string)filter_input(INPUT_POST, 'undo',FILTER_VALIDATE_INT);
	$dat['undo'] = $undo ? $undo : UNDO;
	$undo_in_mg = (string)filter_input(INPUT_POST, 'undo_in_mg',FILTER_VALIDATE_INT);
	$dat['undo_in_mg'] = $undo_in_mg ? $undo_in_mg : UNDO_IN_MG;
	$qline='';
	$dat['qualitys'] =[];
	foreach ( $qualitys as $q ){
		$selq = ($q == $quality) ? ' selected' : '';
		$qline .= '<option value='.$q.$selq.'>'.$q."</option>\n";
	}
	$dat['qualitys'] = $qline;

	return $dat;
}

// 記事表示 
function updatelog(){
	global $path;

	$tree = file(TREEFILE);
	$line = file(LOGFILE);
	$lineindex = get_lineindex($line); // 逆変換テーブル作成
	$fdat=form();
	$counttree = count($tree);//190619
	for($page=0;$page<$counttree;$page+=PAGE_DEF){//PAGE_DEF単位で全件ループ
		$oya = 0;	//親記事のメイン添字
		$dat=$fdat;//form()を何度もコールしない
		for($i = $page; $i < $page+PAGE_DEF; ++$i){//PAGE_DEF分のスレッドを表示
			if(!isset($tree[$i])){
				continue;
			}

			$treeline = explode(",", rtrim($tree[$i]));
			$disptree = $treeline[0];
			if(!isset($lineindex[$disptree])) continue;   //範囲外なら次の行
			$j=$lineindex[$disptree]; //該当記事を探して$jにセット

			$res = create_res($line[$j], ['pch' => 1]);

			$res['disp_resform'] = check_elapsed_days($res['time']); // ミニレスフォームの表示有無

			// レス省略
			$skipres = '';

			$s=count($treeline) - DSP_RES;
			if(ADMIN_NEWPOST&&!DSP_RES) {$skipres = $s - 1;}
			elseif($s<1 || !DSP_RES) {$s=1;}
			elseif($s>1) {$skipres = $s - 1;}
			//レス画像数調整
			if(RES_UPLOAD){
				//画像テーブル作成
				$imgline=array();
				foreach($treeline as $k => $disptree){
					if($k<$s){//レス表示件数
						continue;
					}
					if(!isset($lineindex[$disptree])) continue;
					$j=$lineindex[$disptree];
					list(,,,,,,,,,$rext,,,$rtime,,,) = explode(",", rtrim($line[$j]));
					$resimg = $path.$rtime.$rext;

					$imgline[] = ($rext && is_file($resimg)) ? 'img_exists' : 'noimage';
				}
				$resimgs = array_count_values($imgline);
				while(isset($resimgs['img_exists']) && ($resimgs['img_exists'] > DSP_RESIMG)){
					array_shift($imgline); //画像付きレス1つシフト
					$s++;
					$resimgs = array_count_values($imgline);
				}
				if($s>1) {$skipres = $s - 1;}//再計算
			}

			// 親レス用の値
			$res['tab'] = $oya + 1; //TAB
			$logmax=(LOG_MAX>=1000) ? LOG_MAX : 1000;
			$res['limit'] = ($lineindex[$res['no']] >= $logmax * LOG_LIMIT / 100) ? true : false; // そろそろ消える。
			$res['skipres'] = $skipres ? $skipres : false;
			// $res['resub'] = $resub;
			$dat['oya'][$oya] = $res;

			//レス作成
			$rres[$oya]=[];
			foreach($treeline as $k => $disptree){
				if($k<$s){//レス表示件数
					continue;
				}
				if(!isset($lineindex[$disptree])) continue;
				$j=$lineindex[$disptree];
				$res = create_res($line[$j], ['pch' => 1]);
				$rres[$oya][] = $res;
			}

			// レス記事一括格納
			$dat['oya'][$oya]['res'] = !empty($rres[$oya]) ? $rres[$oya] :[];

			clearstatcache(); //キャッシュをクリア
			$oya++;
	}
		$prev = $page - PAGE_DEF;
		$next = $page + PAGE_DEF;
		// 改ページ処理
		$dat['prev'] =false;
		if($prev >= 0){
			$dat['prev'] = ($prev == 0) ? h(PHP_SELF2) : ($prev / PAGE_DEF) . PHP_EXT;
		}
		$paging = "";
		for($l = 0; $l < $counttree; $l += (PAGE_DEF*35)){

			$start_page=$l;
			$end_page=$l+(PAGE_DEF*36);//現在のページよりひとつ後ろのページ
			if($page-(PAGE_DEF*35)<=$l){break;}//現在ページより1つ前のページ
		}

		for($i = 0; $i < $counttree; $i += PAGE_DEF){
			$pn = $i ? $i / PAGE_DEF : 0; // page_number
			if(($i>=$start_page)&&($i<=$end_page)){//ページ数を表示する範囲
				if($i === $end_page){//特定のページに代入される記号 エンド
					$rep_page_no="≫";
				}elseif($i!==0&&$i == $start_page){//スタート
					$rep_page_no="≪";
				}else{//ページ番号
					$rep_page_no=$pn;
				}

			$paging .= ($page === $i)
				? str_replace("<PAGE>", $pn, NOW_PAGE) // 現在ページにはリンクを付けない
				: str_replace("<PURL>", ($i ? $pn.PHP_EXT : h(PHP_SELF2)),
				str_replace("<PAGE>", $rep_page_no , OTHER_PAGE));

			}
		}

		//改ページ分岐ここまで

		$dat['paging'] = $paging;
		$dat['next'] = false;
		if($oya >= PAGE_DEF && $counttree > $next){
			$dat['next'] = $next/PAGE_DEF.PHP_EXT;
		}

		$logfilename = ($page === 0) ? h(PHP_SELF2) : ($page / PAGE_DEF) . PHP_EXT;
		$dat['logfilename']= $logfilename;
		
		$buf = htmloutput(SKIN_DIR.MAINFILE,$dat,true);

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

	$trees = file(TREEFILE);
	foreach($trees as $i => $value){
		//レス先検索
		if (strpos(trim($value) . ',', $resno . ',') === 0) {
			$treeline = explode(",", trim($value));
			break;
		}
	}
	if (!isset($treeline)) {
		error(MSG001);
	}

	$line = file(LOGFILE);
	$lineindex = get_lineindex($line); // 逆変換テーブル作成
	if(!isset($lineindex[$resno])){
		error(MSG001);
	}

	$_line = $line[$lineindex[$resno]];
	$res = create_res($_line, ['pch' => 1]);

	$dat = form($resno);

	// レスフォーム用
	$resub = USE_RESUB ? 'Re: ' . $res['sub'] : '';
	$dat['resub'] = $resub; //レス画面用

	// 親レス用の値
	$res['tab'] = 1; //TAB
	$logmax=(LOG_MAX>=1000) ? LOG_MAX : 1000;
	$res['limit'] = ($lineindex[$res['no']] >= $logmax * LOG_LIMIT / 100) ? true : false; // そろそろ消える。
	$res['resub'] = $resub;
	$res['descriptioncom'] = h(strip_tags(mb_strcut($res['com'],0,300))); //メタタグに使うコメントからタグを除去
	$res['skipres']=false;
	$dat['oya'][0] = $res;

	$oyaname = $res['name']; //投稿者名をコピー

	//レス作成
	$dat['oya'][0]['res'] = [];
	$rresname = [];
	array_shift($treeline); // 親レス番号を除去
	foreach($treeline as $disptree){ // 子レスだけ回す
		if(!isset($lineindex[$disptree])) continue;
		$j=$lineindex[$disptree];

		$_res = create_res($line[$j], ['pch' => 1]);
		$dat['oya'][0]['res'][] = $_res;

		// 投稿者名を配列にいれる
		if ($oyaname != $_res['name'] && !in_array($_res['name'], $rresname)) { // 重複チェックと親投稿者除外
			$rresname[] = $_res['name'];
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

	if(!check_elapsed_days($res['time'])){//親の値
		$dat['form'] = false;//フォームを閉じる
		$dat['paintform'] = false;
		$dat['resname'] = false;//投稿者名をコピーを閉じる
	}

	//前のスレッド、次のスレッド
	$n=$i+1;
	$p=$i-1;
	$next=(isset($trees[$n])&&$trees[$n]) ? explode(",",trim($trees[$n]))[0]:'';
	$dat['res_next']=$next ? create_res($line[$lineindex[$next]]):[];
	$prev=(isset($trees[$p])&&$trees[$p]) ? explode(",",trim($trees[$p]))[0]:'';
	$dat['res_prev']=$prev ? create_res($line[$lineindex[$prev]]):[];
	$dat['view_other_works']=false;
	if(VIEW_OTHER_WORKS){
		$a=[];
		for($j=($i-7);$j<($i+10);++$j){
			$p=(isset($trees[$j])&&$trees[$j]) ? explode(",",trim($trees[$j]))[0]:'';
			$b=$p?create_res($line[$lineindex[$p]]):[];
			if(!empty($b)&&$b['imgsrc']&&$b['no']!==$resno){
				$a[]=$b;
			}
		}
		$c=($i<5) ? 0 : (count($a)>9 ? 4 :0);
		$dat['view_other_works']=array_slice($a,$c,6,false);
	}
	htmloutput(SKIN_DIR.RESFILE,$dat);
}
//マークダウン記法のリンクをHTMLに変換
function md_link($str){
	$str= preg_replace("{\[([^\[\]\(\)]+?)\]\((https?://[[:alnum:]\+\$\;\?\.%,!#~*/:@&=_-]+)\)}","<a href=\"\\2\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">\\1</a>",$str);
	return $str;
}

// 自動リンク
function auto_link($str){
	if(strpos($str,'<a')===false){//マークダウン記法がなかった時
		$str= preg_replace("{(https?://[[:alnum:]\+\$\;\?\.%,!#~*/:@&=_-]+)}","<a href=\"\\1\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">\\1</a>",$str);
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
	$dat['mes'] = $mes;
	if (defined('OTHERFILE')) {
		htmloutput(SKIN_DIR.OTHERFILE,$dat);
	} else {
		print $dat['mes'];
	}
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
	
	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG006);

	//CSRFトークンをチェック
	if(CHECK_CSRF_TOKEN){
		check_csrf_token();
	}

	$admin = (string)filter_input(INPUT_POST, 'admin');
	$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$url = (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$fcolor = (string)filter_input(INPUT_POST, 'fcolor');
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');

	$userip = get_uip();
	//ホスト取得
	$host = gethostbyaddr($userip);
	check_badip($host);
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post();

	$pictmp = filter_input(INPUT_POST, 'pictmp',FILTER_VALIDATE_INT);
	$picfile = (string)newstring(filter_input(INPUT_POST, 'picfile'));

	// パスワード未入力の時はパスワードを生成してクッキーにセット
	$c_pass=str_replace("\t",'',(string)filter_input(INPUT_POST, 'pwd'));//エスケープ前の値をCookieにセット
	if($pwd===''){
		if($pwdc){//Cookieはnullの可能性があるので厳密な型でチェックしない
			$pwd=newstring($pwdc);
			$c_pass=$pwdc;//エスケープ前の値
		}else{
			srand((double)microtime()*1000000);
			$pwd = substr(md5(uniqid(rand())),2,15);
			$pwd = strtr($pwd,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~","ABCDEFGHIJKLMNOabcdefghijklmn");
			$c_pass=$pwd;
		}
	}

	if(strlen((string)$pwd) < 6) error(MSG046);

	//画像アップロード
	$upfile_name = isset($_FILES["upfile"]["name"]) ? basename($_FILES["upfile"]["name"]) : "";
	if(strlen($upfile_name)>256){
		error(MSG015);
	}
	$upfile = isset($_FILES["upfile"]["tmp_name"]) ? $_FILES["upfile"]["tmp_name"] : "";

	if($upfile_name && isset($_FILES["upfile"]["error"])){//エラーチェック
		if(in_array($_FILES["upfile"]["error"],[1,2])){
			error(MSG034);//容量オーバー
		} 
	}

	if(USE_CHECK_NO_FILE){
		$textonly = filter_input(INPUT_POST, 'textonly',FILTER_VALIDATE_BOOLEAN);
		if($textonly){//画像なしの時
			safe_unlink($upfile);
			$upfile="";
		}
	}

	$message="";

	//記事管理用 ユニックスタイム10桁+3桁
	$time = time().substr(microtime(),2,3);

	$ptime='';
	// お絵かき絵アップロード処理
	if($pictmp==2){
		if(!$picfile) error(MSG002);
		$upfile = $temppath.$picfile;
		$upfile_name = basename($picfile);
		$picfile=pathinfo($picfile, PATHINFO_FILENAME );//拡張子除去
		$time = KASIRA.$time;
		//選択された絵が投稿者の絵か再チェック
		if (!$picfile || !is_file($temppath.$picfile.".dat")) {
			error(MSG007);
		}
		$fp = fopen($temppath.$picfile.".dat", "r");
		$userdata = fread($fp, 1024);
		fclose($fp);
		list($uip,$uhost,,,$ucode,,$starttime,$postedtime,$uresto) = explode("\t", rtrim($userdata)."\t");
		if(($ucode != $usercode) && ($uip != $userip)){error(MSG007);}
		//描画時間を$userdataをもとに計算
		if(DSP_PAINTTIME && $starttime && is_numeric($starttime)){
			$psec=(int)$postedtime-(int)$starttime;
			$ptime = TOTAL_PAINTTIME ? $psec : calcPtime($psec);
		}
		$uresto=(string)filter_var($uresto,FILTER_VALIDATE_INT);
		$resto = $uresto ? $uresto : $resto;//変数上書き$userdataのレス先を優先する
	}
	$dest='';
	$is_file_dest=false;
	if($upfile && is_file($upfile)){//アップロード
		$dest = $path.$time.'.tmp';
		if($pictmp==2){
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

	if(USE_CHECK_NO_FILE){
		if(!USE_IMG_UPLOAD && (!$admin||$admin!==$ADMIN_PASS)){
			$textonly=true;//画像なし
		}
		if(!$resto&&!$textonly&&!$is_file_dest) error(MSG007,$dest);
		if(RES_UPLOAD&&$resto&&!$textonly&&!$is_file_dest) error(MSG007,$dest);
	}
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
	$fp=fopen(LOGFILE,"r+");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019,$dest);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	$lineindex=get_lineindex($line);//逆変換テーブル作成

	if($resto && !isset($lineindex[$resto])){//レス先のログが存在しない時
		if($pictmp==2){//お絵かきは
			$resto = '';//新規投稿
		}else{
			error(MSG025,$dest);
		}
	}
	if($resto && isset($lineindex[$resto])){
		list(,,,,,,,,,,,,$_time,) = explode(",", $line[$lineindex[$resto]]);
		if(!check_elapsed_days($_time)){//フォームが閉じられていたら
			if($pictmp==2){//お絵かきは
				$resto = '';//新規投稿
			}else{
				error(MSG001,$dest);
			}
		}
	}

	// 連続・二重投稿チェック
	$chkline=20;//チェックする最大行数
	foreach($line as $i => $value){
		if($value!==""){
		list($lastno,,$lname,$lemail,$lsub,$lcom,$lurl,$lhost,$lpwd,,,,$ltime,) = explode(",", $value);
		$pchk=0;
		switch(POST_CHECKLEVEL){
			case 1:	//low
				if($host===$lhost
				){$pchk=1;}
				break;
			case 2:	//middle
				if($host===$lhost
				|| ($name===$lname)
				|| ($email===$lemail)
				|| ($url===$lurl)
				|| ($sub===$lsub)
				){$pchk=1;}
				break;
			case 3:	//high
				if($host===$lhost
				|| (similar_str($name,$lname) > VALUE_LIMIT)
				|| (similar_str($email,$lemail) > VALUE_LIMIT)
				|| (similar_str($url,$lurl) > VALUE_LIMIT)
				|| (similar_str($sub,$lsub) > VALUE_LIMIT)
				){$pchk=1;}
				break;
			case 4:	//full
				$pchk=1;
		}
			if($pchk){
			//KASIRAが入らない10桁のUNIX timeを取り出す
			if(strlen($ltime)>10){$ltime=substr($ltime,-13,-3);}
			if(RENZOKU && (time() - (int)$ltime) < RENZOKU){error(MSG020,$dest);}
			if(RENZOKU2 && (time() - (int)$ltime) < RENZOKU2 && $upfile_name){error(MSG021,$dest);}
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
							if($com === $lcom && !$upfile_name){error(MSG022,$dest);}
					}
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
	//画像フォーマット
		$fsize_dest=filesize($dest);
		if($fsize_dest > IMAGE_SIZE * 1024 || $fsize_dest > MAX_KB * 1024){//指定サイズを超えていたら
			if ($im_jpg = png2jpg($dest)) {
				if(filesize($im_jpg)<$fsize_dest){//JPEGのほうが小さい時だけ
					rename($im_jpg,$dest);//JPEGで保存
					chmod($dest,PERMISSION_FOR_DEST);
				} else{//PNGよりファイルサイズが大きくなる時は
					unlink($im_jpg);//作成したJPEG画像を削除
				}
			}
		}
		clearstatcache();
		if(filesize($dest) > MAX_KB * 1024){//ファイルサイズ再チェック
		error(MSG034,$dest);
		}
		$img_type=mime_content_type($dest);//190603

		if (!in_array($img_type, ['image/gif', 'image/jpeg', 'image/png','image/webp'])) {
			error(MSG004,$dest);
		}

		$chk = md5_file($dest);
		check_badfile($chk, $dest); // 拒絶画像チェック

		$upfile_name=newstring($upfile_name);
		$message = UPLOADED_OBJECT_NAME." $upfile_name ".UPLOAD_SUCCESSFUL."<br><br>";

		//重複チェック
		$chkline=200;//チェックする最大行数
		$j=1;
		foreach($line as $i => $value){ //画像重複チェック
			if($value!==""){
			list(,,,,,,,,,$extp,,,$timep,$chkp,) = explode(",", $value);
				if($extp){//拡張子があったら
				if($chkp===$chk&&is_file($path.$timep.$extp)){
				error(MSG005,$dest);
				}
				if($j>=20){break;}//画像を20枚チェックしたら
				++$j;
				}
			}
			if($i>=$chkline){break;}//チェックする最大行数
		}
		//chiファイルアップロード
		if(is_file($temppath.$picfile.'.chi')){
			$src = $temppath.$picfile.'.chi';
			$dst = PCH_DIR.$time.'.chi';
			if(copy($src, $dst)){
				chmod($dst,PERMISSION_FOR_DEST);
			}
		}

		//PCHファイルアップロード
		if ($pchext = check_pch_ext($temppath.$picfile)) {
			$src = $temppath.$picfile.$pchext;
			$dst = PCH_DIR.$time.$pchext;
			if(copy($src, $dst)){
				chmod($dst,PERMISSION_FOR_DEST);
			}
		}
		list($w, $h) = getimagesize($dest);
		$ext = getImgType($img_type, $dest);

		rename($dest,$path.$time.$ext);
		chmod($path.$time.$ext,PERMISSION_FOR_DEST);
		// 縮小表示
		$max_w = $resto ? MAX_RESW : MAX_W;
		$max_h = $resto ? MAX_RESH : MAX_H;
		list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);

		if(USE_THUMB){thumb($path,$time,$ext,$max_w,$max_h);}

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
	$newline = "$no,$date,$name,$email,$sub,$com,$url,$host,$pass,$ext,$w,$h,$time,$chk,$ptime,$fcolor\n";
	$newline.= implode("\n", $line);


	//ツリー更新
	$find = false;
	$new_treeline = '';
	$tp=fopen(TREEFILE,"r+");
	set_file_buffer($tp, 0);
	flock($tp, LOCK_EX); //*
	$buf=fread($tp,5242880);
	if(!$buf){error(MSG023);}
	$line = explode("\n", trim($buf));
	foreach($line as $i => $value){
		if($value!==""){
			list($oyano,) = explode(",", rtrim($value));
			if(!isset($lineindex[$oyano])){//親のログが存在しないときは
				unset($line[$i]);//ツリーを削除
			}
		}
	}

	if($resto){
		foreach($line as $i => $value){
			list($_oyano,) = explode(",", rtrim($value));
			if($_oyano==$resto){
				$find = TRUE;
				$line[$i] = rtrim($value).','.$no;
				$treelines=explode(",", rtrim($line[$i]));
				if(!$sage || (count($treelines)>MAX_RES)){
					$new_treeline=$line[$i] . "\n";
					unset($line[$i]);
				}
				break;
			}
		}
	}
	if($pictmp==2 && !$find ){//お絵かきでレス先が無い時は新規投稿
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

	//ワークファイル削除
	safe_unlink($src);
	safe_unlink($upfile);
	safe_unlink($temppath.$picfile.".dat");
	
	//-- クッキー保存 --
	//パスワード
	$email = $email ? $email : ($sage ? 'sage' : '') ;
	$name=str_replace("\t",'',(string)filter_input(INPUT_POST, 'name'));//エスケープ前の値をセット
	//クッキー項目："クッキー名 クッキー値"
	$cooks = ["namec\t".$name,"emailc\t".$email,"urlc\t".$url,"fcolorc\t".$fcolor,"pwdc\t".$c_pass];

	foreach ( $cooks as $cook ) {
		list($c_name,$c_cookie) = explode("\t",$cook);
		setcookie ($c_name, $c_cookie,time()+(SAVE_COOKIE*24*3600));
	}

	updatelog();

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
		if ($_pch_ext = check_pch_ext(__DIR__.'/'.PCH_DIR.$time)) {
			$data['option'][] = NOTICE_MAIL_ANIME.','.ROOT_URL.PCH_DIR.$time.$_pch_ext;
		}
		if($resto){
			$data['subject'] = '['.TITLE.'] No.'.$resto.NOTICE_MAIL_REPLY;
			$data['option'][] = "\n".NOTICE_MAIL_URL.','.ROOT_URL.PHP_SELF.'?res='.$resto;
		}else{
			$data['subject'] = '['.TITLE.'] '.NOTICE_MAIL_NEWPOST;
			$data['option'][] = "\n".NOTICE_MAIL_URL.','.ROOT_URL.PHP_SELF.'?res='.$no;
		}

		$data['comment'] = SEND_COM ? preg_replace("#<br( *)/?>#i","\n", $com) : '';

		noticemail::send($data);
	}
	$destination = $resto ? PHP_SELF.'?res='.h($resto) :h(PHP_SELF2);

	redirect(
		$destination . (URL_PARAMETER ? "?".time() : ''),
		1,
		$message . THE_SCREEN_CHANGES
	);
}

function h_decode($str){
	$str = str_replace("&#44;", ",", $str);
	return htmlspecialchars_decode((string)$str, ENT_QUOTES);
}

//ツリー削除
function treedel($delno){
	$fp=fopen(TREEFILE,"r+");
	set_file_buffer($fp, 0);
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG024);}
	$line = explode("\n", trim($buf));
	$find=false;
	$thread_exists=true;
	foreach($line as $i =>$value){
		$treeline = explode(",", rtrim($value));
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

	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(string)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);

	$onlyimgdel = filter_input(INPUT_POST, 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');
	
	if(!is_array($del)){
		return;
	}

	sort($del);
	reset($del);
	if($pwd===""&&$pwdc) $pwd=newstring($pwdc);
	$fp=fopen(LOGFILE,"r+");
	set_file_buffer($fp, 0);
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG027);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = false;
	$find = false;
	$thread_exists = true;
	foreach($line as $i => $value){//190701
		if($value!==""){
			list($no,,,,,,,$dhost,$pass,$ext,,,$time,,) = explode(",",$value);
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

	$onlyimgdel = filter_input(INPUT_POST, 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);
	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$del_pageno=(int)filter_input(INPUT_POST,'del_pageno',FILTER_VALIDATE_INT);
	// 削除画面
	$dat['admin_del'] = true;
	$dat['pass'] = $pass;
	$all = 0;
	$line = file(LOGFILE);
	$countlog=count($line);
	$l = 0;

	for($k = 0; $k < $countlog  ; $k += 1000){

			$dat['del_page'][$l]['no']=$k;
			$dat['del_page'][$l]['pageno']=$l;
			if($del_pageno===$l*1000){
				$dat['del_page'][$l]['notlink']=true;
			}
		++$l;
	}

	foreach($line as $j => $value){
		if(!$value){
			continue;
		}
			if(($j>=($del_pageno))&&($j<(1000+$del_pageno))){
			list($no,$date,$name,$email,$sub,$com,$url,
			$host,$pw,$ext,$w,$h,$time,$chk,) = explode(",",$value);
		$res= [
			'size' => 0,
			'no' => $no,
			'host' => $host,
			'clip' => "",
			'chk' => "",
		] ;
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
			$res['size'] = filesize($path.$time.$ext);
			$all += $res['size'];	//ファイルサイズ加算
			$res['chk']= h(substr($chk,0,10));//md5
			$res['clip'] = '<a href="'.IMG_DIR.$time.$ext.'" target="_blank" rel="noopener">'.$time.$ext.'</a><br>';
		}
		if($res['email']){
			$res['name']='<a href="mailto:'.$res['email'].'">'.$res['name'].'</a>';
		}
		$dat['del'][] = $res;
		}
	}
	$dat['all'] = h(($all - ($all % 1024)) / 1024);

	if(is_array($del)){
		sort($del);
		reset($del);
		$fp=fopen(LOGFILE,"r+");
		set_file_buffer($fp, 0);
		flock($fp, LOCK_EX);
		$buf=fread($fp,5242880);
		if(!$buf){error(MSG030);}
		$buf = charconvert($buf);
		$line = explode("\n", trim($buf));
		$find = false;
		foreach($line as $i => $value){
			if($value!==""){
				list($no,,,,,,,,,$ext,,,$time,,) = explode(",",$value);
			if(in_array($no,$del)){
				if(!$onlyimgdel){	//記事削除
					treedel($no);
					unset($line[$i]);
					$find = true;
				}
				delete_files($path, $time, $ext);
			}
			}
		}
		if($find){//ログ更新
			writeFile($fp, implode("\n", $line));
		}
		closeFile($fp);
	}

	htmloutput(SKIN_DIR.OTHERFILE,$dat);
	exit;
}

function init(){
	$err='';

	if(!is_writable(realpath("./")))error("カレントディレクトリに書けません<br>");

	if (!is_file(realpath(LOGFILE))) {
		$date = now_date(time());//日付取得
		if(DISP_ID) $date .= " ID:???";
		$time = time().substr(microtime(),2,3);
		$testmes="1,".$date.",".DEF_NAME.",,".DEF_SUB.",".DEF_COM.",,,,,,,".$time.",,,\n";
		file_put_contents(LOGFILE, $testmes);
		chmod(LOGFILE, PERMISSION_FOR_LOG);
	}
	$err .= check_file(LOGFILE,true);

	if (!is_file(realpath(TREEFILE))) {
		file_put_contents(TREEFILE, "1\n");
		chmod(TREEFILE, PERMISSION_FOR_LOG);
	}
	$err .= check_file(TREEFILE,true);

	$err .= check_dir(IMG_DIR);
	USE_THUMB && $err .= check_dir(THUMB_DIR);
	USE_PAINT && $err .= check_dir(TEMP_DIR);
	if($err)error($err);
	if(!is_file(realpath(h(PHP_SELF2))))updatelog();
}

// ファイル存在チェック
function check_file ($path,$check_writable='') {

	$msg041=defined('MSG041') ? MSG041 : "がありません"; 
	$msg042=defined('MSG042') ? MSG042 : "を読めません"; 
	$msg043=defined('MSG043') ? MSG043 : "を書けません"; 

	if (!is_file($path)) return $path . $msg041."<br>";
	if (!is_readable($path)) return $path . $msg042."<br>";
	if($check_writable){//書き込みが必要なファイルのチェック
		if (!is_writable($path)) return $path . $msg043."<br>";
	}
}
// ディレクトリ存在チェック なければ作る
function check_dir ($path) {

	$msg041=defined('MSG041') ? MSG041 : "がありません"; 
	$msg042=defined('MSG042') ? MSG042 : "を読めません"; 
	$msg043=defined('MSG043') ? MSG043 : "を書けません"; 

	if (!is_dir($path)) {
			mkdir($path, PERMISSION_FOR_DIR);
			chmod($path, PERMISSION_FOR_DIR);
	}
	if (!is_dir($path)) return $path . $msg041."<br>";
	if (!is_readable($path)) return $path . $msg042."<br>";
	if (!is_writable($path)) return $path . $msg043."<br>";
}

// お絵描き画面
function paintform(){
	global $qualitys,$usercode,$ADMIN_PASS,$pallets_dat;

	$admin = (string)filter_input(INPUT_POST, 'admin');
	$type = (string)newstring(filter_input(INPUT_POST, 'type'));
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
	if(strlen($resto)>1000){
		error(MSG015);
	}
	$mode = (string)filter_input(INPUT_POST, 'mode');
	$picw = filter_input(INPUT_POST, 'picw',FILTER_VALIDATE_INT);
	$pich = filter_input(INPUT_POST, 'pich',FILTER_VALIDATE_INT);
	$anime = filter_input(INPUT_POST, 'anime',FILTER_VALIDATE_BOOLEAN);
	$shi = filter_input(INPUT_POST, 'shi');
	$pch = (string)newstring(filter_input(INPUT_POST, 'pch'));
	$ext = (string)newstring(filter_input(INPUT_POST, 'ext'));
	$ctype = (string)newstring(filter_input(INPUT_POST, 'ctype'));
	$quality = filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);
	$no = filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$is_mobile = filter_input(INPUT_POST, 'is_mobile',FILTER_VALIDATE_BOOLEAN);

	if(strlen($pwd) > 72) error(MSG015);

	$dat['pinchin'] = false;
	$dat['pch_mode'] = false;
	$dat['continue_mode'] = false;
	$dat['imgfile'] = false;
	$dat['img_chi'] = false;
	$dat['paintbbs'] = false;
	$dat['quality'] = false;
	$dat['pro'] = false;
	$dat['normal'] = false;
	$dat['image_jpeg'] = false;
	$dat['image_size'] = false;
	$dat['undo'] = false;
	$dat['undo_in_mg'] = false;
	$dat['pchfile'] = false;
	$dat['security'] = false;
	$dat['security_click'] = false;
	$dat['security_timer'] = false;
	$dat['security_url'] = false;
	$dat['type_neo'] = false;
	$dat['speed'] = false;
	$dat['picfile'] = false;
	$dat['painttime'] = false;
	$dat['no'] = false;
	$dat['pch'] = false;
	$dat['ext'] = false;
	$dat['ctype_pch'] = false;
	$dat['newpost_nopassword'] = false;

	$dat['parameter_day']=date("Ymd");//JavaScriptのキャッシュ制御
	$useneo=filter_input(INPUT_POST, 'useneo',FILTER_VALIDATE_BOOLEAN) ? true :false;
	if($shi==='neo'){
		$useneo=true;//trueのみfalseは入らない
	}
	$dat['chickenpaint']= (!$is_mobile && $shi==='chicken') ? true :false;
	//pchファイルアップロードペイント
	if($admin&&($admin===$ADMIN_PASS)){
		
		$pchtmp= isset($_FILES['pch_upload']['tmp_name']) ? $_FILES['pch_upload']['tmp_name'] :'';
		if($pchtmp && in_array($_FILES['pch_upload']['error'],[1,2])){//容量オーバー
			error(MSG034);
		} 
		if ($pchtmp && $_FILES['pch_upload']['error'] === UPLOAD_ERR_OK){
		$pchfilename = isset($_FILES['pch_upload']['name']) ? newstring(basename($_FILES['pch_upload']['name'])) : '';

			$time = time().substr(microtime(),2,3);
			$pchext=pathinfo($pchfilename, PATHINFO_EXTENSION);
			$pchext=strtolower($pchext);//すべて小文字に
			//拡張子チェック
			if (!in_array($pchext, ['pch','spch','chi'])) {
				error(MSG045,$pchtmp);
			}
			$pchup = TEMP_DIR.'pchup-'.$time.'-tmp.'.$pchext;//アップロードされるファイル名

			if(move_uploaded_file($pchtmp, $pchup)){//アップロード成功なら続行

				$pchup=TEMP_DIR.basename($pchup);//ファイルを開くディレクトリを固定
				if(!in_array(mime_content_type($pchup),["application/octet-stream","application/gzip"])){
					error(MSG045,$pchup);
				}
				if($pchext==="pch"){
					$shi=0;
					$useneo = is_neo($pchup);
					$dat['pchfile'] = $pchup;
				} elseif($pchext==="spch"){
					$shi=$shi ? $shi : 1;
					$useneo=false;
					$dat['pchfile'] = $pchup;
				} elseif($pchext==="chi"){
					$dat['chickenpaint']=true;
					$dat['img_chi'] = $pchup;
				}
			}
		}
	}
	//pchファイルアップロードペイントここまで
	$dat['paint_mode'] = true;

	//ピンチイン
	if($picw>=700){//横幅700以上だったら
		$dat['pinchin'] = true;
	} elseif($picw>=500) {//横幅500以上だったら
		if (strpos($_SERVER['HTTP_USER_AGENT'],'iPad') === false){//iPadじゃなかったら
			$dat['pinchin'] = (strpos($_SERVER['HTTP_USER_AGENT'],'Mobile') !== false);
		}
	}
	
	$dat = array_merge($dat,form($resto));
		$dat['mode2'] = $mode;
		$dat['anime'] = $anime ? true : false;
		$dat['animeform'] = true;

	if($mode==="contpaint"){

		if(RES_CONTINUE_IN_CURRENT_THREAD && $type!=='rep'){

			$oyano='';
			$trees=file(TREEFILE);
			foreach ($trees as $tree) {
				if (strpos(',' . trim($tree) . ',',',' . $no . ',') !== false) {
					$tree_nos = explode(',', trim($tree));
					$oyano=$tree_nos[0];
					break;
				}
			}
			
			$resto= ($oyano&&((int)$oyano!==$no)) ? $oyano :'';
			//お絵かきレスの新規投稿はスレッドへの返信の新規投稿に。
			//親の番号ではない事を確認してレス先の番号をセット。
		}
		$dat['no'] = $no;
		$dat['pch'] = $pch;
		$dat['ctype'] = $ctype;
		$dat['type'] = $type;
		$dat['pwd'] = $pwd;
		$dat['ext'] = $ext;
		$dat['applet'] = true;
		list($picw,$pich)=getimagesize(IMG_DIR.$pch.$ext);//キャンバスサイズ
		if($shi==='chicken' && ($picw > PMAX_W)) error(MSG047);
		if($shi==='chicken' && ($pich > PMAX_H)) error(MSG047);	
	
		$_pch_ext = check_pch_ext(__DIR__.'/'.PCH_DIR.$pch);
		if($is_mobile && ($_pch_ext==='.spch')){
			$ctype='img';
		}
		if($ctype=='pch'&& $_pch_ext){
			$anime=true;
			if($_pch_ext==='.pch'){
				$useneo = is_neo(PCH_DIR.$pch.'.pch');
				$dat['applet'] = false;
			}elseif($_pch_ext==='.spch'){
				$dat['usepbbs'] = false;
				$useneo=false;
			}
			$dat['pchfile'] = './'.PCH_DIR.$pch.$_pch_ext;
		}

		if($ctype=='img' && is_file(IMG_DIR.$pch.$ext)){//画像または
				if(mime_content_type(IMG_DIR.$pch.$ext)==='image/webp'){
					$useneo=true;
				}
	
			$dat['animeform'] = false;
			$dat['anime'] = false;
			$dat['imgfile'] = './'.IMG_DIR.$pch.$ext;
			if(!$is_mobile && is_file('./'.PCH_DIR.$pch.'.chi')){
				$dat['img_chi'] = './'.PCH_DIR.$pch.'.chi';
			}
		}
	
		if((C_SECURITY_CLICK || C_SECURITY_TIMER) && SECURITY_URL){
			$dat['security'] = true;
			$dat['security_click'] = C_SECURITY_CLICK;
			$dat['security_timer'] = C_SECURITY_TIMER;
		}
	}else{
		if((SECURITY_CLICK || SECURITY_TIMER) && SECURITY_URL){
			$dat['security'] = true;
			$dat['security_click'] = SECURITY_CLICK;
			$dat['security_timer'] = SECURITY_TIMER;
		}
		$dat['newpaint'] = true;
	}

	if(!$useneo){
		$useneo=$is_mobile;//mobileの時はNEOしか起動しない。
	}
	if($picw < 300) $picw = 300;
	if($pich < 300) $pich = 300;
	if($picw > PMAX_W) $picw = PMAX_W;
	if($pich > PMAX_H) $pich = PMAX_H;


	if(!$useneo && $shi){
	$w = $picw + 510;//しぃぺの時の幅
	$h = $pich + 120;//しぃぺの時の高さ
	} else{
		$w = $picw + 150;//PaintBBSの時の幅
		$h = $pich + 172;//PaintBBSの時の高さ
	}
	if($h < 560){$h = 560;}//共通の最低高

	$dat['security_url'] = SECURITY_URL;

	$savetype = (string)filter_input(INPUT_POST, 'savetype'); // JPEG or PNG or AUTO or それ以外 が来ることを想定
	$dat['image_jpeg'] = in_array($savetype, ['JPEG', 'AUTO']);
	$dat['image_size'] = in_array($savetype, ['PNG', 'AUTO']) ? IMAGE_SIZE : ($savetype == 'JPEG' ? 1 : 0);
	$dat['savetypes']
		= '<option value="AUTO"' . ($savetype == 'AUTO' ? ' selected' : '') . '>AUTO</option>'
		. '<option value="PNG"' . ($savetype == 'PNG' ? ' selected' : '') . '>PNG</option>'
		. '<option value="JPEG"' . ($savetype == 'JPEG' ? ' selected' : '') . '>JPEG</option>';

	$dat['compress_level'] = COMPRESS_LEVEL;
	$dat['layer_count'] = LAYER_COUNT;
	if($shi) $dat['quality'] = $quality ? $quality : $qualitys[0];
	//NEOを使う時はPaintBBSの設定
	if(!$useneo && $shi==1){ $dat['normal'] = true; }
	elseif(!$useneo && $shi==2){ $dat['pro'] = true; }
	else{ $dat['paintbbs'] = true; }

	$initial_palette = 'Palettes[0] = "#000000\n#FFFFFF\n#B47575\n#888888\n#FA9696\n#C096C0\n#FFB6FF\n#8080FF\n#25C7C9\n#E7E58D\n#E7962D\n#99CB7B\n#FCECE2\n#F9DDCF";';
	if(USE_SELECT_PALETTES){//パレット切り替え機能を使う時
		foreach($pallets_dat as $i=>$value){
			if($i==filter_input(INPUT_POST, 'selected_palette_no',FILTER_VALIDATE_INT)){//キーと入力された数字が同じなら
				setcookie("palettec", $i, time()+(86400*SAVE_COOKIE));//Cookie保存
				if(is_array($value)){
					list($p_name,$p_dat)=$value;
					$lines=file($p_dat);
				}else{
					$lines=file($value);
				}
				break;
			}
		}
	}else{
		$lines=file(PALETTEFILE);//初期パレット
	}

	$pal=array();
	$DynP=array();
	foreach ( $lines as $i => $line ) {
		$line=charconvert(str_replace(["\r","\n","\t"],"",$line));
		list($pid,$pname,$pal[0],$pal[2],$pal[4],$pal[6],$pal[8],$pal[10],$pal[1],$pal[3],$pal[5],$pal[7],$pal[9],$pal[11],$pal[12],$pal[13]) = explode(",", $line);
		$DynP[]=h($pname);
		$p_cnt=$i+1;
		$palettes = 'Palettes['.$p_cnt.'] = "#';
		ksort($pal);
		$palettes.=implode('\n#',$pal);
		$palettes.='";';//190622
		$arr_pal[$i] = $palettes;
	}
	$dat['palettes']=$initial_palette.implode('',$arr_pal);
	$dat['palsize'] = count($DynP) + 1;
	foreach ($DynP as $p){
		$arr_dynp[] = '<option>'.$p.'</option>';
	}
	$dat['dynp']=implode('',$arr_dynp);

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

	$dat['useneo'] = $useneo; //NEOを使う
	$usercode.='&stime='.time().$resto;
	//差し換え時の認識コード追加
	if($type==='rep'){
		$time=time();
		$userip = get_uip();
		$repcode = substr(crypt(md5($no.$userip.$pwd.date("Ymd", $time)),$time),-8);
		//念の為にエスケープ文字があればアルファベットに変換
		$repcode = strtr($repcode,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~","ABCDEFGHIJKLMNOabcdefghijklmn");
		$dat['mode'] = 'picrep&no='.$no.'&pwd='.$pwd.'&repcode='.$repcode	;
		$usercode.='&repcode='.$repcode;
	}

	$dat['usercode'] = $usercode;

	//Cookie保存
	setcookie("appletc", $shi , time()+(86400*SAVE_COOKIE));//アプレット選択
	setcookie("picwc", $picw , time()+(86400*SAVE_COOKIE));//幅
	setcookie("pichc", $pich , time()+(86400*SAVE_COOKIE));//高さ

	htmloutput(SKIN_DIR.PAINTFILE,$dat);
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
		$lines = file(LOGFILE);
		foreach($lines as $line){

			if (strpos(trim($line) . ',', $resto . ',') === 0) {

				list($cno,,,,$sub,,,,,,,,,,) = explode(",", charconvert($line));
					$dat['sub'] = 'Re: '.$sub;
					break;
			}
		}
	}

	//テンポラリ画像リスト作成
	$tmplist = array();
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		if(!is_dir($file) && pathinfo($file, PATHINFO_EXTENSION)==='dat') {

			$fp = fopen(TEMP_DIR.$file, "r");
			$userdata = fread($fp, 1024);
			fclose($fp);
			list($uip,$uhost,$uagent,$imgext,$ucode,) = explode("\t", rtrim($userdata));
			$file_name = pathinfo($file, PATHINFO_FILENAME);
			if(is_file(TEMP_DIR.$file_name.$imgext)) //画像があればリストに追加
			$tmplist[] = $ucode."\t".$uip."\t".$file_name.$imgext;
		}
	}
	closedir($handle);
	$tmp = array();
	if(!empty($tmplist)){
		foreach($tmplist as $tmpimg){
			list($ucode,$uip,$ufilename) = explode("\t", $tmpimg);
			if($ucode == $usercode||$uip == $userip){
				$tmp[] = $ufilename;
			}
		}
	}

	$dat['post_mode'] = true;
	$dat['regist'] = true;
	$dat['ipcheck'] = true;//常にtrue
	if(empty($tmp)){
		$dat['notmp'] = true;
		$dat['pictmp'] = 1;
	}else{
		$dat['pictmp'] = 2;
		sort($tmp);
		reset($tmp);
		foreach($tmp as $tmpfile){
			$tmp_img['src'] = TEMP_DIR.$tmpfile;
			$tmp_img['srcname'] = $tmpfile;
			$tmp_img['date'] = date("Y/m/d H:i", filemtime($tmp_img['src']));
			$dat['tmp'][] = $tmp_img;
		}
	}

	$dat = array_merge($dat,form($resto,'',$tmp));

	htmloutput(SKIN_DIR.OTHERFILE,$dat);
}

// 動画表示
function openpch(){

	$dat['paint_mode'] = false;
	$dat['continue_mode'] = false;
	$dat['useneo'] = false;
	$dat['chickenpaint'] = false;
	$dat['pro'] = false;
	$dat['normal'] = false;

	$dat['parameter_day']=date("Ymd");

	$pch = (string)newstring(filter_input(INPUT_GET, 'pch'));
	$_pch = pathinfo($pch, PATHINFO_FILENAME); //拡張子除去

	$ext = check_pch_ext(PCH_DIR . $_pch);
	if(!$ext){
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

	$dat['datasize'] = filesize($dat['pchfile']);
	list($dat['picw'], $dat['pich']) = getimagesize(IMG_DIR.$pch);
	$dat['w'] = ($dat['picw'] < 200 ? 200 : $dat['picw']);
	$dat['h'] = ($dat['pich'] < 200 ? 200 : $dat['pich']) + 26;

	$dat['pch_mode'] = true;
	$dat['speed'] = PCH_SPEED;
	$dat['stime'] = time();
	htmloutput(SKIN_DIR.PAINTFILE,$dat);
}

// テンポラリ内のゴミ除去 
function deltemp(){
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		if(!is_dir($file)) {
			$lapse = time() - filemtime(TEMP_DIR.$file);
			if($lapse > (TEMP_LIMIT*24*3600)){
				unlink(TEMP_DIR.$file);
			}
			//pchアップロードペイントファイル削除
			if(preg_match("/\A(pchup-.*-tmp\.(s?pch|chi))\z/i",$file)) {
				$lapse = time() - filemtime(TEMP_DIR.$file);
				if($lapse > (300)){//5分
					unlink(TEMP_DIR.$file);
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

	$no = (string)filter_input(INPUT_GET, 'no',FILTER_VALIDATE_INT);
	$lines = file(LOGFILE);
	$flag = FALSE;
	$cptime='';
	foreach($lines as $line){
		//記事ナンバーのログを取得		
		if (strpos(trim($line) . ',', $no . ',') === 0) {
		list($cno,,$name,,$sub,,,,,$cext,$picw,$pich,$ctim,,$cptime,) = explode(",", rtrim($line));
		$flag = true;
		break;
		}
	}
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
	$dat['name']=h($name);
	$dat['sub']=h($sub);

	list($dat['picw'], $dat['pich']) = getimagesize($dat['picfile']);
	$dat['no'] = h($no);
	$dat['pch'] = h($ctim);
	$dat['ext'] = h($cext);
	$dat['ctype_img'] = true;
	//描画時間
	$cptime=is_numeric($cptime) ? h(calcPtime($cptime)) : h($cptime); 
	if(DSP_PAINTTIME) $dat['painttime'] = $cptime;
	$dat['applet'] = true;//従来の条件のアプリの選択メニューを出すかどうか(旧タイプ互換)
	if(is_file(PCH_DIR.$ctim.'.pch')){
		$dat['ctype_pch'] = true;
		$dat['applet'] = false;
		$dat['select_app'] = false;
		$dat['usepbbs'] = true;
		if(is_neo(PCH_DIR.$ctim.'.pch')){
			$dat['app_to_use'] = "neo";
		}else{
			$dat['app_to_use'] = "0";
		}
		
	}elseif(is_file(PCH_DIR.$ctim.'.spch')){
		$dat['ctype_pch'] = true;
		$dat['select_app'] = false;
		$dat['app_to_use'] = "1";
	}elseif(is_file(PCH_DIR.$ctim.'.chi')){
		$dat['select_app'] = false;
		$dat['app_to_use'] = 'chicken';
	}
	if(mime_content_type(IMG_DIR.$ctim.$cext)==='image/webp'){
		$dat['applet'] = false;
		$dat['use_shi_painter'] = false; 
	}
	$dat['addinfo'] = $addinfo;
	htmloutput(SKIN_DIR.PAINTFILE,$dat);
}

// コンティニュー認証
function check_cont_pass(){

	$no = (string)filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$lines = file(LOGFILE);
	foreach($lines as $line){
		if (strpos(trim($line) . ',', $no . ',') === 0) {
		list($cno,,,,,,,,$cpwd,) = explode(",", $line);
		if($cno == $no && check_password($pwd, $cpwd)){
			return true;
		}
	}
	}
	error(MSG028);
}

// 編集画面
function editform(){
	global $addinfo,$fontcolors,$ADMIN_PASS;

	//csrfトークンをセット
	$dat['token']='';
	if(CHECK_CSRF_TOKEN){
		$dat['token']=get_csrf_token();
	}
	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(string)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);

	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = (string)filter_input(INPUT_COOKIE, 'pwdc');

	if (!is_array($del)) {
		error(MSG031);
	}

	sort($del);
	reset($del);
	if($pwd===""&&$pwdc) $pwd=newstring($pwdc);
	$fp=fopen(LOGFILE,"r");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = FALSE;
	foreach($line as $value){
		if($value){
			list($no,,$name,$email,$sub,$com,$url,$ehost,$pass,,,,$time,,,$fcolor) = explode(",", rtrim($value));
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
	if((!$pwd || $pwd!==$ADMIN_PASS) && !check_elapsed_days($time)){//指定日数より古い記事の編集はエラーにする
			error(MSG028);
	}

	$dat['post_mode'] = true;
	$dat['rewrite'] = $no;
	if($pwd && ($pwd===$ADMIN_PASS)) $dat['admin'] = h($ADMIN_PASS);
	$dat['maxbyte'] = MAX_KB * 1024;
	$dat['maxkb']   = MAX_KB;
	$dat['addinfo'] = $addinfo;
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

	htmloutput(SKIN_DIR.OTHERFILE,$dat);
}

// 記事上書き
function rewrite(){
global $ADMIN_PASS;

	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG006);

	//CSRFトークンをチェック
	if(CHECK_CSRF_TOKEN){
		check_csrf_token();
	}

	$thread_no=(string)filter_input(INPUT_POST,'thread_no',FILTER_VALIDATE_INT);
	$logfilename=(string)filter_input(INPUT_POST,'logfilename');
	$mode_catalog=filter_input(INPUT_POST,'mode_catalog');
	$catalog_pageno=(string)filter_input(INPUT_POST,'catalog_pageno',FILTER_VALIDATE_INT);
	
	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$url = (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$fcolor = (string)filter_input(INPUT_POST, 'fcolor');
	$no = (string)filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = (string)newstring(filter_input(INPUT_POST, 'pwd'));
	$admin = (string)filter_input(INPUT_POST, 'admin');

	$userip = get_uip();
	//ホスト取得
	$host = gethostbyaddr($userip);
	check_badip($host);
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
	$fp=fopen(LOGFILE,"r+");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));

	// 記事上書き
	$flag = FALSE;
	foreach($line as $i => $value){
		list($eno,$edate,$ename,,$esub,$ecom,$eurl,$ehost,$epwd,$ext,$w,$h,$time,$chk,$ptime,$efcolor) = explode(",", rtrim($value));
		if($eno == $no && check_password($pwd, $epwd, $admin)){
			$date=DO_NOT_CHANGE_POSTS_TIME ? $edate : $date;
			if(!$name) $name = $ename;
			if(!$sub)  $sub  = $esub;
			if(!$com)  $com  = $ecom;
			if(!$fcolor) $fcolor = $efcolor;
			$line[$i] = "$no,$date,$name,$email,$sub,$com,$url,$host,$epwd,$ext,$w,$h,$time,$chk,$ptime,$fcolor";
			$flag = TRUE;
			break;
		}
	}
	if(!$flag){
		closeFile($fp);
		error(MSG028);
	}
	if((!$admin || $admin!==$ADMIN_PASS) && !check_elapsed_days($time)){//指定日数より古い記事の編集はエラーにする
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
	$userip = get_uip();
	//ホスト取得
	$host = gethostbyaddr($userip);
	check_badip($host);

	/*--- テンポラリ捜査 ---*/
	$find=false;
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		if(!is_dir($file) && preg_match("/\.(dat)\z/i",$file)) {
			$fp = fopen(TEMP_DIR.$file, "r");
			$userdata = fread($fp, 1024);
			fclose($fp);
			list($uip,$uhost,$uagent,$imgext,$ucode,$urepcode,$starttime,$postedtime) = explode("\t", rtrim($userdata)."\t");//区切りの"\t"を行末に
			$file_name = pathinfo($file, PATHINFO_FILENAME );//拡張子除去
			//画像があり、認識コードがhitすれば抜ける
			if($file_name && is_file(TEMP_DIR.$file_name.$imgext) && $urepcode === $repcode){$find=true;break;}
		}
	}
	closedir($handle);
	if(!$find){
	error(MSG007);
	}

	// 時間
	$time = KASIRA.time().substr(microtime(),2,3);
	$date = now_date(time());//日付取得
	$date .= UPDATE_MARK;
	//描画時間を$userdataをもとに計算
	$psec='';
	$_ptime = '';
	if($starttime && is_numeric($starttime)){
		$psec=(int)$postedtime-(int)$starttime;
		$_ptime = calcPtime($psec);
	}

	//ログ読み込み
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

	foreach($line as $i => $value){
		list($eno,$edate,$name,$email,$sub,$com,$url,$ehost,$epwd,$ext,$_w,$_h,$etim,,$ptime,$fcolor) = explode(",", rtrim($value));
	//画像差し替えに管理パスは使っていない
		if($eno == $no && check_password($pwd, $epwd)){
			$upfile = $temppath.$file_name.$imgext;
			$dest = $path.$time.'.tmp';
			copy($upfile, $dest);
			
			if(!is_file($dest)) error(MSG003);
			chmod($dest,PERMISSION_FOR_DEST);

			$fsize_dest=filesize($dest);
			if($fsize_dest > IMAGE_SIZE * 1024 || $fsize_dest > MAX_KB * 1024){//指定サイズを超えていたら
				if ($im_jpg = png2jpg($dest)) {
					if(filesize($im_jpg)<$fsize_dest){//JPEGのほうが小さい時だけ
						rename($im_jpg,$dest);//JPEGで保存
						chmod($dest,PERMISSION_FOR_DEST);
					} else{//PNGよりファイルサイズが大きくなる時は
						unlink($im_jpg);//作成したJPEG画像を削除
					}
				}
			}
		
			$img_type=mime_content_type($dest);
			if (!in_array($img_type, ['image/gif', 'image/jpeg', 'image/png','image/webp'])) {
				error(MSG004,$dest);
			}

			$chk = md5_file($dest);
			check_badfile($chk, $dest); // 拒絶画像チェック

			list($w, $h) = getimagesize($dest);
			$imgext = getImgType($img_type, $dest);
	
			chmod($dest,PERMISSION_FOR_DEST);
			rename($dest,$path.$time.$imgext);

			$message = UPLOADED_OBJECT_NAME.UPLOAD_SUCCESSFUL."<br><br>";

			$trees=file(TREEFILE);

			$oya=false;
			foreach ($trees as $tree) {
				if (strpos(trim($tree) . ',', $no . ',') === 0) {
					$oya=true;
					break;
				}
			}
			$max_w = $oya ? MAX_W : MAX_RESW ;
			$max_h = $oya ? MAX_H : MAX_RESH ;
			list($w,$h)=image_reduction_display($w,$h,$max_w,$max_h);
	
			//サムネイル作成
			if(USE_THUMB){thumb($path,$time,$imgext,$max_w,$max_h);}

			$src='';
			//chiファイルアップロード
			if(is_file($temppath.$file_name.'.chi')){
				$src = $temppath.$file_name.'.chi';
				$dst = PCH_DIR.$time.'.chi';
				if(copy($src, $dst)){
					chmod($dst,PERMISSION_FOR_DEST);
				}
			}

			//PCHファイルアップロード
			// .pch, .spch, ブランク どれかが返ってくる
			if ($pchext = check_pch_ext($temppath . $file_name)) {
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
			$line[$i] = "$no,$date,$name,$email,$sub,$com,$url,$host,$epwd,$imgext,$w,$h,$time,$chk,$ptime,$fcolor";
			$flag = true;
			//旧ファイル削除
			delete_files($path, $etim, $ext);

			break;
		}
	}
	if(!$flag){
		closeFile($fp);
		return error(MSG028);
	}

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	//ワークファイル削除
	safe_unlink($src);
	safe_unlink($upfile);
	safe_unlink($temppath.$file_name.".dat");


	updatelog();

	$oyano='';
	foreach ($trees as $i =>$tree) {
		if (strpos(',' . trim($tree) . ',',',' . $no . ',') !== false) {
			$tree_nos = explode(',', trim($tree));
			$oyano=$tree_nos[0];
			break;
		}
	}
	$thread_no = $oyano ? $oyano :'';

	$destination = $thread_no ? PHP_SELF.'?res='.h($thread_no) :  h(PHP_SELF2);
	redirect(
		$destination . (URL_PARAMETER ? "?".time() : ''),
		1,
		$message . THE_SCREEN_CHANGES
	);
}

// カタログ
function catalog(){

	$page = filter_input(INPUT_GET, 'page',FILTER_VALIDATE_INT);
	$page= $page ? $page : 0;
	$line = file(LOGFILE);
	$lineindex = get_lineindex($line); // 逆変換テーブル作成

	$tree = file(TREEFILE);
	$counttree = count($tree);
	$x = 0;
	$y = 0;
	$pagedef = CATALOG_X * CATALOG_Y;//1ページに表示する件数
	$dat = form();
	for($i = $page; $i < $page+$pagedef; ++$i){
		if(!isset($tree[$i])){
			continue;
		}
		$treeline = explode(",", rtrim($tree[$i]));
		$disptree = $treeline[0];
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
		$dat['y'][$y]['x'][$x]['noimg'] = false;//旧タイプ互換
		$dat['y'][$y]['x'][$x] = $res;
		$x++;
		if($x == CATALOG_X){$y++; $x=0;}
	}

	$prev = $page - $pagedef;
	$next = $page + $pagedef;
	// 改ページ処理
	$dat['prev'] = false;
	if($prev >= 0) $dat['prev'] = PHP_SELF.'?mode=catalog&amp;page='.$prev;
	$paging = "";

	for($l = 0; $l < $counttree; $l += ($pagedef*35)){

		$start_page=$l;
		$end_page=$l+($pagedef*36);//現在のページよりひとつ後ろのページ
		if($page-($pagedef*35)<=$l){break;}//現在ページより1つ前のページ
	}
	for($i = 0; $i < $counttree; $i += $pagedef){
		$pn = $i / $pagedef;
		
		if(($i>=$start_page)&&($i<=$end_page)){//ページ数を表示する範囲
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
		}
	}
	//改ページ分岐ここまで
	$dat['paging'] = $paging;
	$dat['next'] = false;
	if($counttree > $next){
		$dat['next'] = PHP_SELF.'?mode=catalog&amp;page='.$next;
	}
	$dat["resno"]=false;
	$dat["resto"]=false;//この変数使用しているテーマのエラー対策

	$dat['catalog_pageno']=h($page);

	htmloutput(SKIN_DIR.CATALOGFILE,$dat);
}

// 文字コード変換 
function charconvert($str){
	mb_language(LANG);
		return mb_convert_encoding($str, "UTF-8", "auto");
}

// NGワードがあれば拒絶
function Reject_if_NGword_exists_in_the_post(){
	global $badstring,$badname,$badstr_A,$badstr_B,$pwd,$ADMIN_PASS,$admin;

	$com = (string)filter_input(INPUT_POST, 'com');
	$name = (string)filter_input(INPUT_POST, 'name');
	$email = (string)filter_input(INPUT_POST, 'email');
	$sub = (string)filter_input(INPUT_POST, 'sub');
	$url = (string)filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$pwd = (string)filter_input(INPUT_POST, 'pwd');

	if(strlen($com) > MAX_COM) error(MSG011);
	if(strlen($name) > MAX_NAME) error(MSG012);
	if(strlen($email) > MAX_EMAIL) error(MSG013);
	if(strlen($sub) > MAX_SUB) error(MSG014);
	if(strlen($url) > 200) error(MSG015);
	if(strlen($pwd) > 72) error(MSG015);

	//チェックする項目から改行・スペース・タブを消す

	$chk_com  = preg_replace("/\s/u", "", $com );
	$chk_name = preg_replace("/\s/u", "", $name );
	$chk_email = preg_replace("/\s/u", "", $email );
	$chk_sub = preg_replace("/\s/u", "", $sub );

	//本文に日本語がなければ拒絶
	if (USE_JAPANESEFILTER) {
		mb_regex_encoding("UTF-8");
		if (strlen($com) > 0 && !preg_match("/[ぁ-んァ-ヶー一-龠]+/u",$chk_com)) error(MSG035);
	}

	//本文へのURLの書き込みを禁止
	if(!(($pwd&&$pwd===$ADMIN_PASS)||($admin&&($admin===$ADMIN_PASS)))){//どちらも一致しなければ
		if(DENY_COMMENTS_URL && preg_match('/:\/\/|\.co|\.ly|\.gl|\.net|\.org|\.cc|\.ru|\.su|\.ua|\.gd/i', $com)) error(MSG036);
	}

	// 使えない文字チェック
	if (is_ngword($badstring, [$chk_com, $chk_sub, $chk_name, $chk_email])) {
		error(MSG032);
	}

	// 使えない名前チェック
	if (is_ngword($badname, $chk_name)) {
		error(MSG037);
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
	global $Skinny;
	$dat += basicpart();//basicpart()で上書きしない
	//array_merge()ならbasicpart(),$datの順
	if($buf_flag){
		$buf=$Skinny->SkinnyFetchHTML($template, $dat );
		return $buf;
	}
	if(USE_DUMP_FOR_DEBUG){//Skinnyで出力する前にdump
		var_dump($dat);
		if(USE_DUMP_FOR_DEBUG==='2'){
			exit;
		}
	}
	$Skinny->SkinnyDisplay( $template, $dat );
}

function redirect ($url, $wait = 0, $message = '') {
	header("Content-type: text/html; charset=UTF-8");
	echo '<!DOCTYPE html>'
		. '<html lang="ja"><head>'
		. '<meta http-equiv="refresh" content="' . $wait . '; URL=' . $url . '">'
		. '<meta name="robots" content="noindex,nofollow">'
		. '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">'
		. '<meta charset="UTF-8"><title></title></head>'
		. '<body>' . $message . '</body></html>';
	exit;
}

function getImgType ($img_type, $dest) {

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
function check_pch_ext ($filepath) {
	if (is_file($filepath . ".pch")) {
		return ".pch";
	} elseif (is_file($filepath . ".spch")) {
		return ".spch";
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
}

/**
 * NGワードチェック
 * @param $ngwords
 * @param string|array $strs
 * @return bool
 */
function is_ngword ($ngwords, $strs) {
	if (empty($ngwords)) {
		return false;
	}
	if (!is_array($strs)) {
		$strs = [$strs];
	}
	foreach($ngwords as $i => $ngword){//拒絶する文字列
		$ngwords[$i]  = str_replace([" ", "　"], "", $ngword);
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

function png2jpg ($src) {
	global $path;
	if(mime_content_type($src)==="image/png" && gd_check() && function_exists("ImageCreateFromPNG")){//pngならJPEGに変換
		if($im_in=ImageCreateFromPNG($src)){
			$dst = $path.pathinfo($src, PATHINFO_FILENAME ).'.jpg.tmp';
			ImageJPEG($im_in,$dst,98);
			ImageDestroy($im_in);// 作成したイメージを破棄
			chmod($dst,PERMISSION_FOR_DEST);
			return $dst;
		}
	}
	return false;
}

function check_badip ($host, $dest = '') {
	global $badip;
	foreach($badip as $value){ //拒絶host
		if (preg_match("/$value\z/i",$host)) {
			error(MSG016, $dest);
		}
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
	return htmlspecialchars((string)$str,ENT_QUOTES,'utf-8',false);
}

function create_res ($line, $options = []) {
	global $path;

	list($no,$date,$name,$email,$sub,$com,$url,$host,$pwd,$ext,$w,$h,$time,$chk,$ptime,$fcolor)
		= explode(",", rtrim($line));
	$three_point_sub=(mb_strlen($sub)>12) ? '…' :'';
	$res = [
		'w' => is_numeric($w) ? $w :'',
		'h' => is_numeric($h) ? $h :'',
		'no' => (int)$no,
		'sub' => strip_tags($sub),
		'substr_sub' => mb_substr(strip_tags(($sub)),0,12).$three_point_sub,
		'url' => filter_var($url,FILTER_VALIDATE_URL),
		'email' => filter_var($email, FILTER_VALIDATE_EMAIL),
		'ext' => $ext,
		'time' => $time,
		'fontcolor' => $fcolor ? $fcolor : DEF_FONTCOLOR, //文字色
	];
	$res['imgsrc']='';
	// 画像系変数セット

	//初期化
	$res['src'] = '';
	$res['srcname'] = '';
	$res['size'] = '';
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
		$res['size'] = filesize($res['img']);
		$res['thumb'] = is_file(THUMB_DIR.$time.'s.jpg');
		$res['imgsrc'] = $res['thumb'] ? THUMB_DIR.$time.'s.jpg' : $res['src'];
		//描画時間
		$ptime=is_numeric($ptime) ? calcPtime($ptime) : $ptime; 
		$res['painttime'] = DSP_PAINTTIME ? $ptime : '';
		//動画リンク
		$pch_ext=check_pch_ext(PCH_DIR.$time);
		$res['spch']=($pch_ext==='.spch') ? true : false;
		$res['pch'] = (isset($options['pch']) && USE_ANIME && $pch_ext) ? $time.$ext : '';
		//コンティニュー
		$res['continue'] = USE_CONTINUE ? $res['no'] : '';
	}

	//日付とIDを分離
	
	list($res['id'], $res['now']) = separateDatetimeAndId($date);
	//日付と編集マークを分離
	list($res['now'], $res['updatemark']) = separateDatetimeAndUpdatemark($res['now']);
	//名前とトリップを分離
	list($res['name'], $res['trip']) = separateNameAndTrip($name);
	$res['name']=strip_tags($res['name']);
	$res['encoded_name'] = urlencode($res['name']);
	$res['share_name'] = encode_for_share($res['name']);
	$res['share_sub'] = encode_for_share($res['sub']);

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
	set_file_buffer($fp, 0);
	rewind($fp);
	fwrite($fp, $data);
}

function closeFile ($fp) {
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
}

function getId ($userip) {
	return substr(hash('sha256', $userip.ID_SEED, false),-8);
}

// 古いスレッドへの投稿を許可するかどうか
function check_elapsed_days ($time) {
	return ELAPSED_DAYS //古いスレッドのフォームを閉じる日数が設定されていたら
		? ((time() - (int)(substr($time, -13, -3))) <= ((int)ELAPSED_DAYS * 86400)) // 指定日数以内なら許可
		: true; // フォームを閉じる日数が未設定なら許可
}

//逆変換テーブル作成
function get_lineindex ($line){
	$lineindex = [];
	foreach($line as $i =>$value){
		if($value !==''){
			list($no,) = explode(",", $value);
			if(!is_numeric($no)){//記事Noが正しく読み込まれたかどうかチェック
				error(MSG019);
			};
			$lineindex[$no] = $i; // 値にkey keyに記事no
		}
	}
	return $lineindex;
}

function check_password ($pwd, $epwd, $adminPass = false) {
	global $ADMIN_PASS;
	return
		password_verify($pwd, $epwd)
		|| $epwd === substr(md5($pwd), 2, 8)
		|| ($adminPass ? ($adminPass === $ADMIN_PASS) : false); // 管理パスを許可する場合
}
function is_neo($src) {//neoのPCHかどうか調べる
	$fp = fopen("$src", "rb");
	$is_neo=(fread($fp,3)==="NEO");
	fclose($fp);
	return $is_neo;
}

