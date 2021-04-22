<?php
define('USE_DUMP_FOR_DEBUG','0');
//HTML出力の前に$datをdump しない:0 する:1 dumpしてexit：2 
// ini_set('error_reporting', E_ALL);

// POTI-board改二 
// バージョン :
define('POTI_VER','v2.26.7');
define('POTI_LOT','lot.210403'); 

/*
  (C)sakots >> https://poti-k.info/

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
ご質問は、<https://poti-k.info/>までどうぞ。
*/

if (($phpver = phpversion()) < "5.5.0") {
	die("PHP version 5.5.0 or higher is required for this program to work. <br>\n（Current PHP version:{$phpver}）");
}

//INPUT_POSTから変数を取得

$mode = filter_input(INPUT_POST, 'mode');
$mode = $mode ? $mode : filter_input(INPUT_GET, 'mode');
$resto = filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
$type = newstring(filter_input(INPUT_POST, 'type'));
$admin = (string)filter_input(INPUT_POST, 'admin');
$pass = newstring(filter_input(INPUT_POST, 'pass'));
$onlyimgdel = filter_input(INPUT_POST, 'onlyimgdel',FILTER_VALIDATE_BOOLEAN);

//INPUT_GETから変数を取得

$res = filter_input(INPUT_GET, 'res',FILTER_VALIDATE_INT);

//INPUT_COOKIEから変数を取得

$usercode = filter_input(INPUT_COOKIE, 'usercode');//nullならuser-codeを発行

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
defined('USE_CHECK_NO_FILE') or define('USE_CHECK_NO_FILE', '1');

//描画時間を合計表示に する:1 しない:0 
defined('TOTAL_PAINTTIME') or define('TOTAL_PAINTTIME', '1');

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
defined('MSG045') or define('MSG045', 'アニメファイルをアップロードしてください。<br>対応フォーマットはpch、spchです。');

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
	$usercode = substr(crypt(md5($userip.ID_SEED.date("Ymd", time())),'id'),-12);
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
			return redirect(PHP_SELF2, 0);
		}
		return;

	case 'usrdel':
		if (!USER_DELETES) {
			return error(MSG033);
		}
		userdel();
		updatelog();
		return redirect(PHP_SELF2, 0);
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
		return redirect(PHP_SELF2, 0);
}

exit;

//GD版が使えるかチェック
function gd_check(){
	$check = array("ImageCreate","ImageCopyResized","ImageCreateFromJPEG","ImageJPEG","ImageDestroy");

	//最低限のGD関数が使えるかチェック
	if(get_gd_ver() && (ImageTypes() & IMG_JPG)){
		foreach ( $check as $cmd ) {
			if(!function_exists($cmd)){
				return false;
			}
		}
	}else{
		return false;
	}

	return true;
}

//gdのバージョンを調べる
function get_gd_ver(){
	if(function_exists("gd_info")){
	$gdver=gd_info();
	$phpinfo=$gdver["GD Version"];
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

// ベース
function basicpart(){
	global $pallets_dat;
	$dat['title'] = TITLE;
	$dat['home']  = HOME;
	$dat['self']  = PHP_SELF;
	$dat['self2'] = PHP_SELF2;
	$dat['paint'] = USE_PAINT ? true : false;
	$dat['applet'] = APPLET ? true : false;
	$dat['usepbbs'] = APPLET!=1 ? true : false;
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
	$dat['hide_the_checkbox_for_nofile']=true;//poti本体が古い時はfalse→画像なしのチェックが出る
	if(USE_CHECK_NO_FILE){
		$dat['hide_the_checkbox_for_nofile']=false;
	}
	$dat['_san']=HONORIFIC_SUFFIX;

	return $dat;
}

// 投稿フォーム 
function form($resno="",$adminin="",$tmp=""){
	global $addinfo;
	global $fontcolors,$qualitys;
	global $ADMIN_PASS;

	$admin_valid = ($adminin === 'valid');
	$quality = filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);

	$dat['form'] = true;
	if(!USE_IMG_UPLOAD && DENY_COMMENTS_ONLY && !$resno && !$admin_valid){//コメントのみも画像アップロードも禁止
		$dat['form'] = false;//トップページのフォームを閉じる
		if(USE_PAINT==1 && !$resno && !$admin_valid){
			$dat['paint2'] = true;
		}
	}
	if(USE_PAINT){
		$dat['pdefw'] = PDEF_W;
		$dat['pdefh'] = PDEF_H;
		$dat['anime'] = USE_ANIME ? true : false;
		$dat['animechk'] = DEF_ANIME ? ' checked' : '';
		$dat['pmaxw'] = PMAX_W;
		$dat['pmaxh'] = PMAX_H;
		if(USE_PAINT==2 && !$resno && !$admin_valid){
			$dat['paint2'] = true;
			$dat['form'] = false;
		}
	}

	if($resno){
		$dat['resno'] = $resno;
		if(RES_UPLOAD) $dat['paintform'] = true;
	}else{
		$dat['paintform'] = true;
		$dat['notres'] = true;
	}

	if($admin_valid) $dat['admin'] = newstring($ADMIN_PASS);

	$dat['maxbyte'] = 2048 * 1024;//フォームのHTMLによるファイルサイズの制限 2Mまで
	$dat['usename'] = USE_NAME ? ' *' : '';
	$dat['usesub']  = USE_SUB ? ' *' : '';
	if(USE_COM||($resno&&!RES_UPLOAD)) $dat['usecom'] = ' *';
	//本文必須の設定では無い時はレスでも画像かコメントがあれば通る
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
	if(USE_FONTCOLOR){
		foreach ( $fontcolors as $fontcolor ){
			list($color,$name) = explode(",", $fontcolor);
			$dat['fctable'][] = compact('color','name');
		}
	}

	//アプレット設定
	$undo = filter_input(INPUT_POST, 'undo',FILTER_VALIDATE_INT);
	$dat['undo'] = $undo ? $undo : UNDO;
	$undo_in_mg = filter_input(INPUT_POST, 'undo_in_mg',FILTER_VALIDATE_INT);
	$dat['undo_in_mg'] = $undo_in_mg ? $undo_in_mg : UNDO_IN_MG;
	$qline='';
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
	if(!$lineindex){
		error(MSG019);
	}
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

			$res['disp_resform'] = check_elapsed_days($res); // ミニレスフォームの表示有無

			// ミニフォーム用
			$resub = USE_RESUB ? 'Re: ' . $res['sub'] : '';
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

					$imgline[] = ($rext && is_file($resimg)) ? 'img' : '0';
				}
				$resimgs = array_count_values($imgline);
				if(isset($resimgs['img'])){//未定義エラー対策
				while($resimgs['img'] > DSP_RESIMG){
					while($imgline[0]='0'){ //画像付きレスが出るまでシフト
						array_shift($imgline);
						$s++;
					}
					array_shift($imgline); //画像付きレス1つシフト
					$s++;
					$resimgs = array_count_values($imgline);
				}
				}
				if($s>1) {$skipres = $s - 1;}//再計算
			}

			// 親レス用の値
			$res['tab'] = $oya + 1; //TAB
			$logmax=(LOG_MAX>=1000) ? LOG_MAX : 1000;
			$res['limit'] = ($lineindex[$res['no']] >= $logmax * LOG_LIMIT / 100) ? true : false; // そろそろ消える。
			$res['skipres'] = $skipres ? $skipres : false;
			$res['resub'] = $resub;
			$dat['oya'][$oya] = $res;

			//レス作成
			$rres=array();
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
			if($rres){//レスがある時
				$dat['oya'][$oya]['res'] = $rres[$oya];
			}

			clearstatcache(); //キャッシュをクリア
			$oya++;
		}

		$prev = $page - PAGE_DEF;
		$next = $page + PAGE_DEF;
		// 改ページ処理
		if($prev >= 0){
			$dat['prev'] = $prev == 0 ? PHP_SELF2 : ($prev / PAGE_DEF) . PHP_EXT;
		}
		$paging = "";

		//表示しているページが20ページ以上または投稿数が少ない時はページ番号のリンクを制限しない
		$showAll = ($counttree <= PAGE_DEF * 21 || $page >= PAGE_DEF*21);

		for($i = 0; $i < ($showAll ? $counttree : PAGE_DEF * 22); $i += PAGE_DEF){
			$pn = $i ? $i / PAGE_DEF : 0; // page_number
			$paging .= ($page === $i)
				? str_replace("<PAGE>", $pn, NOW_PAGE) // 現在ページにはリンクを付けない
				: str_replace("<PURL>", ($i ? $pn.PHP_EXT : PHP_SELF2),
					str_replace("<PAGE>", $i ? ($showAll || $i !== PAGE_DEF * 21 ? $pn : "≫") : $pn, OTHER_PAGE));
		}

		//改ページ分岐ここまで

		$dat['paging'] = $paging;
		if($oya >= PAGE_DEF && $counttree > $next){
			$dat['next'] = $next/PAGE_DEF.PHP_EXT;
		}

		$dat['resform'] = RES_FORM ? true : false;

		$buf = htmloutput(SKIN_DIR.MAINFILE,$dat,true);

		$logfilename = ($page === 0) ? PHP_SELF2 : ($page / PAGE_DEF) . PHP_EXT;

		$fp = fopen($logfilename, "w");
		set_file_buffer($fp, 0);
		flock($fp, LOCK_EX); //*
		fwrite($fp, $buf);
		closeFile($fp);
		if(PHP_EXT!='.php'){chmod($logfilename,PERMISSION_FOR_DEST);}
	}

	safe_unlink(($page/PAGE_DEF+1).PHP_EXT);
}

//レス画面を表示
function res($resno = 0){

	$tree = file(TREEFILE);
	foreach($tree as $value){
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

	$dat = form($resno);

	$res = create_res($_line, ['pch' => 1]);

	if(!check_elapsed_days($res)){//レスフォームの表示有無
		$dat['form'] = false;//フォームを閉じる
		$dat['paintform'] = false;
	}

	// レスフォーム用
	$resub = USE_RESUB ? 'Re: ' . $res['sub'] : '';
	$dat['resub'] = $resub; //レス画面用

	// 親レス用の値
	$res['tab'] = 1; //TAB
	$logmax=(LOG_MAX>=1000) ? LOG_MAX : 1000;
	$res['limit'] = ($lineindex[$res['no']] >= $logmax * LOG_LIMIT / 100) ? true : false; // そろそろ消える。
	$res['resub'] = $resub;
	$res['descriptioncom'] = strip_tags($res['com']); //メタタグに使うコメントからタグを除去

	$dat['oya'][0] = $res;

	$oyaname = $res['name']; //投稿者名をコピー

	//レス作成
	$rres = [];
	$rresname = [];
	array_shift($treeline); // 親レス番号を除去
	foreach($treeline as $disptree){ // 子レスだけ回す
		if(!isset($lineindex[$disptree])) continue;
		$j=$lineindex[$disptree];

		$res = create_res($line[$j], ['pch' => 1]);
		$rres[0][] = $res;

		// 投稿者名を配列にいれる
		if ($oyaname != $res['name'] && !in_array($res['name'], $rresname)) { // 重複チェックと親投稿者除外
			$rresname[] = $res['name'];
		}
	}

	// レス記事一括格納
	if($rres){//レスがある時
		$dat['resname'] = $rresname ? implode(HONORIFIC_SUFFIX.' ',$rresname) : false; // レス投稿者一覧
		$dat['oya'][0]['res'] = $rres[0];
	}

	htmloutput(SKIN_DIR.RESFILE,$dat);
}

// 自動リンク
function auto_link($str){
	if(!(stripos($str,"script")!==false||stripos($str,"<a")!==false)){//scriptがなければ続行
		return preg_replace("{(https?)(://[[:alnum:]\+\$\;\?\.%,!#~*/:@&=_-]+)}","<a href=\"\\1\\2\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">\\1\\2</a>",$str);
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
	global $path;
	global $temppath;
	global $usercode;
	global $admin,$ADMIN_PASS;
	
	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG006);

	$resto = filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
	$com = filter_input(INPUT_POST, 'com');
	$name = filter_input(INPUT_POST, 'name');
	$email = filter_input(INPUT_POST, 'email');
	$url = filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$sub = filter_input(INPUT_POST, 'sub');
	$fcolor = filter_input(INPUT_POST, 'fcolor');
	$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = filter_input(INPUT_COOKIE, 'pwdc');

	$userip = get_uip();
	//ホスト取得
	$host = gethostbyaddr($userip);
	check_badip($host);
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post($com,$name,$email,$url,$sub);

	$pictmp = filter_input(INPUT_POST, 'pictmp',FILTER_VALIDATE_INT);
	$picfile = newstring(filter_input(INPUT_POST, 'picfile'));

	//画像アップロード
	$upfile_name = isset($_FILES["upfile"]["name"]) ? basename($_FILES["upfile"]["name"]) : "";
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
		if($starttime && DSP_PAINTTIME){
			$psec=$postedtime-$starttime;
			$ptime = TOTAL_PAINTTIME ? $psec : calcPtime($psec);
		}
		$uresto=filter_var($uresto,FILTER_VALIDATE_INT);
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


	// パスワード未入力の時はパスワードを生成してクッキーにセット
	$c_pass=str_replace("\t",'',filter_input(INPUT_POST, 'pwd'));//エスケープ前の値をCookieにセット
	if($pwd===''){
		if($pwdc){//Cookieはnullの可能性があるので厳密な型でチェックしない
			$pwd=newstring($pwdc);
			$c_pass=$pwdc;//エスケープ前の値
		}else{
			srand((double)microtime()*1000000);
			$pwd = substr(rand(), 0, 8);
			$c_pass=$pwd;
		}
	}
	$pass = $pwd ? password_hash($pwd,PASSWORD_BCRYPT,['cost' => 5]) : "*";
	$date = now_date(time());//日付取得
	if(DISP_ID){
		$date .= " ID:" . getId($userip, time());
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
		list(,,,,,,,,,,,,$res['time'],) = explode(",", $line[$lineindex[$resto]]);
		if(!check_elapsed_days($res)){//フォームが閉じられていたら
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

		//PCHファイルアップロード
		if ($pchext = check_pch_ext($temppath.$picfile)) {
			$src = $temppath.$picfile.$pchext;
			$dst = PCH_DIR.$time.$pchext;
			if(copy($src, $dst)){
				chmod($dst,PERMISSION_FOR_DEST);
				unlink($src);
			}
		}
		list($w, $h) = getimagesize($dest);
		$ext = getImgType($img_type, $dest);

		rename($dest,$path.$time.$ext);
		chmod($path.$time.$ext,PERMISSION_FOR_DEST);
		// 縮小表示
		$max_w = $resto ? MAX_RESW : MAX_W;
		$max_h = $resto ? MAX_RESH : MAX_H;
		$reduced_size=image_reduction_display($w,$h,$max_w,$max_h);
			$w=$reduced_size['w'];
			$h=$reduced_size['h'];

		if(USE_THUMB){thumb($path,$time,$ext,$max_w,$max_h);}

		//ワークファイル削除
		safe_unlink($upfile);
		safe_unlink($temppath.$picfile.".dat");

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
		safe_unlink($path.$time.$ext);
		safe_unlink(THUMB_DIR.$time.'s.jpg');
		error(MSG025);
	}
	$new_treeline.=implode("\n", $line);

	writeFile($tp, $new_treeline);
	writeFile($fp, $newline);

	closeFile($tp);
	closeFile($fp);

	//-- クッキー保存 --
	//パスワード
	$email = $email ? $email : ($sage ? 'sage' : '') ;
	$name=str_replace("\t",'',filter_input(INPUT_POST, 'name'));//エスケープ前の値をセット
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

		$data['comment'] = SEND_COM ? preg_replace("#<br(( *)|( *)/)>#i","\n", $com) : '';

		noticemail::send($data);
	}
	redirect(
		PHP_SELF2 . (URL_PARAMETER ? "?".time() : ''),
		1,
		$message . THE_SCREEN_CHANGES
	);
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
}

// HTMLの特殊文字をエスケープ
function newstring($str){
	$str = trim($str);
	$str = htmlspecialchars($str,ENT_QUOTES,'utf-8');
	return str_replace(",", "&#44;", $str);//カンマをエスケープ
}

// ユーザー削除
function userdel(){
	global $path,$onlyimgdel;

	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = filter_input(INPUT_COOKIE, 'pwdc');
	
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
	foreach($line as $i => $value){//190701
		if($value!==""){
			list($no,,,,,,,$dhost,$pass,$ext,,,$time,,) = explode(",",$value);
			if(in_array($no,$del) && check_password($pwd, $pass, $pwd)){
				if(!$onlyimgdel){	//記事削除
					treedel($no);
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
}

// 管理者削除
function admindel($pass){
	global $path,$onlyimgdel;

	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列

	// 削除画面
	$dat['admin_del'] = true;
	$dat['pass'] = $pass;

	$all = 0;
	$line = file(LOGFILE);
	foreach($line as $j => $value){
		list($no,$date,$name,$email,$sub,$com,$url,
			 $host,$pw,$ext,$w,$h,$time,$chk,) = explode(",",$value);
		$now  = preg_replace("/( ID:.*)/","",$date);//ID以降除去
		$name = strip_tags($name);//タグ除去
		if(strlen($name) > 10) $name = mb_strcut($name,0,9).".";
		if(strlen($sub) > 10) $sub = mb_strcut($sub,0,9).".";
		$email=filter_var($email, FILTER_VALIDATE_EMAIL);
		if($email){
			$name='<a href="mailto:'.$email.'">'.$name.'</a>';
		}
		$com = preg_replace("#<br */?>#i"," ",$com);
		$com = newstring($com);
		if(strlen($com) > 20) $com = mb_strcut($com,0,18) . ".";
		$clip = "";
		$size = 0;
		if($ext && is_file($path.$time.$ext)){
		$clip = '<a href="'.IMG_DIR.$time.$ext.'" target="_blank" rel="noopener">'.$time.$ext.'</a><br>';
		$size = filesize($path.$time.$ext);
		$all += $size;	//ファイルサイズ加算
		$chk= substr($chk,0,10);//md5
		}else{
			$chk= "";
		}
		$bg = ($j % 2) ? ADMIN_DELGUSU : ADMIN_DELKISU;//背景色

		$dat['del'][$j] = compact('bg','no','now','sub','name','com','host','clip','size','chk');
	}
	$dat['all'] = ($all - ($all % 1024)) / 1024;
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
	if(!is_file(realpath(PHP_SELF2)))updatelog();
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
	global $admin,$type,$pwd;
	global $resto,$qualitys,$usercode;
	global $ADMIN_PASS,$pallets_dat;

	$mode = filter_input(INPUT_POST, 'mode');
	$picw = filter_input(INPUT_POST, 'picw',FILTER_VALIDATE_INT);
	$pich = filter_input(INPUT_POST, 'pich',FILTER_VALIDATE_INT);
	$anime = filter_input(INPUT_POST, 'anime',FILTER_VALIDATE_BOOLEAN);
	$useneo = filter_input(INPUT_POST, 'useneo',FILTER_VALIDATE_BOOLEAN);
	$shi = filter_input(INPUT_POST, 'shi',FILTER_VALIDATE_INT);
	$pch = newstring(filter_input(INPUT_POST, 'pch'));
	$ext = newstring(filter_input(INPUT_POST, 'ext'));
	$ctype = newstring(filter_input(INPUT_POST, 'ctype'));
	$quality = filter_input(INPUT_POST, 'quality',FILTER_VALIDATE_INT);
	$no = filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);

	//Cookie保存
	setcookie("appletc", $shi , time()+(86400*SAVE_COOKIE));//アプレット選択
	setcookie("picwc", $picw , time()+(86400*SAVE_COOKIE));//幅
	setcookie("pichc", $pich , time()+(86400*SAVE_COOKIE));//高さ

	//pchファイルアップロードペイント
	if($admin&&($admin===$ADMIN_PASS)){
		
		$pchfilename = isset($_FILES['pch_upload']['name']) ? newstring(basename($_FILES['pch_upload']['name'])) : '';
		
		if($pchfilename!==""){//空文字でなければ続行
			$pchtmp=$_FILES['pch_upload']['tmp_name'];
			if(in_array($_FILES['pch_upload']['error'],[1,2])){//容量オーバー
				error(MSG034);
			} 
			$time = time().substr(microtime(),2,3);
			$pchext=pathinfo($pchfilename, PATHINFO_EXTENSION);
			$pchext=strtolower($pchext);//すべて小文字に
			//拡張子チェック
			if (!in_array($pchext, ['pch', 'spch'])) {
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
					$fp = fopen("$pchup", "rb");
					$useneo=(fread($fp,3)==="NEO");
					fclose($fp);
				} elseif($pchext==="spch"){
					$shi=$shi ? $shi : 1;
					$useneo=false;
				}
				$dat['pchfile'] = $pchup;
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
	if($mode==="contpaint"){
		$dat['no'] = $no;
		$dat['pch'] = $pch;
		$dat['ctype'] = $ctype;
		$dat['type'] = $type;
		$dat['pwd'] = $pwd;
		$dat['ext'] = $ext;
		if(is_file(IMG_DIR.$pch.$ext)){
			list($picw,$pich)=getimagesize(IMG_DIR.$pch.$ext);//キャンバスサイズ
			if(mime_content_type(IMG_DIR.$pch.$ext)==='image/webp'){
				$useneo=true;
			}
		}
		$dat['applet'] = true;
		if(($ctype=='pch') && is_file(PCH_DIR.$pch.'.pch')){//動画から続き
			$fp = fopen(PCH_DIR.$pch.'.pch', "rb");
			$useneo = (fread($fp,3)==="NEO"); //先頭3byteを見る
			fclose($fp);
			$anime=true;
			$dat['applet'] = false;
		}elseif(($ctype=='pch') && is_file(PCH_DIR.$pch.'.spch')){
			$dat['usepbbs'] = false;
			$useneo=false;
			$anime=true;
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

	$savetype = filter_input(INPUT_POST, 'savetype'); // JPEG or PNG or AUTO or それ以外 が来ることを想定
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
		$DynP[]=newstring($pname);
		$p_cnt=$i+1;
		$palettes = 'Palettes['.$p_cnt.'] = "#';
		ksort($pal);
		$palettes.=implode('\n#',$pal);
		$palettes.='";';//190622
		$arr_pal[$i] = $palettes;
	}
	$dat['palettes']=$initial_palette.implode('',$arr_pal);

	$dat['w'] = $w;
	$dat['h'] = $h;
	$dat['picw'] = $picw;
	$dat['pich'] = $pich;
	$dat['stime'] = time();
	if($pwd){
	$pwd=openssl_encrypt ($pwd,CRYPT_METHOD, CRYPT_PASS, true, CRYPT_IV);//暗号化
	$pwd=bin2hex($pwd);//16進数に
	}
	$resto = ($resto) ? '&amp;resto='.$resto : '';
	$dat['mode'] = 'piccom'.$resto;
	$dat['animeform'] = true;
	$dat['anime'] = $anime ? true : false;
	if($ctype=='pch'){
		if ($_pch_ext = check_pch_ext(__DIR__.'/'.PCH_DIR.$pch)) {
			$dat['pchfile'] = './'.PCH_DIR.$pch.$_pch_ext;
		}
	}
	if($ctype=='img'){
		$dat['animeform'] = false;
		$dat['anime'] = false;
		$dat['imgfile'] = './'.PCH_DIR.$pch.$ext;
	}

	$dat['palsize'] = count($DynP) + 1;
	foreach ($DynP as $p){
		$arr_dynp[] = '<option>'.$p.'</option>';
	}
	$dat['dynp']=implode('',$arr_dynp);
	$dat['useneo'] = $useneo; //NEOを使う
	$usercode.='&amp;stime='.time().$resto;
	//差し換え時の認識コード追加
	if($type==='rep'){
		$time=time();
		$userip = get_uip();
		$repcode = substr(crypt(md5($no.$userip.$pwd.date("Ymd", $time)),$time),-8);
		//念の為にエスケープ文字があればアルファベットに変換
		$repcode = strtr($repcode,"!\"#$%&'()+,/:;<=>?@[\\]^`/{|}~","ABCDEFGHIJKLMNOabcdefghijklmn");
		$dat['mode'] = 'picrep&amp;no='.$no.'&amp;pwd='.$pwd.'&amp;repcode='.$repcode;
		$usercode.='&amp;repcode='.$repcode;
	}
	$dat['usercode'] = $usercode;
	htmloutput(SKIN_DIR.PAINTFILE,$dat);
}

// お絵かきコメント 
function paintcom(){
	global $usercode;
	$userip = get_uip();
	$resto = filter_input(INPUT_GET, 'resto',FILTER_VALIDATE_INT);
	$stime = filter_input(INPUT_GET, 'stime',FILTER_VALIDATE_INT);
	//描画時間
	if($stime && DSP_PAINTTIME){
		$dat['ptime'] = calcPtime(time()-$stime);
	}

	if(USE_RESUB && $resto) {
		$lines = file(LOGFILE);
		foreach($lines as $line){
			list($cno,,,,$sub,,,,,,,,,,) = explode(",", charconvert($line));
			if($cno == $resto){
				$dat['sub'] = 'Re: '.$sub;
				break;
			}
		}
	}

	//テンポラリ画像リスト作成
	$tmplist = array();
	$handle = opendir(TEMP_DIR);
	while ($file = readdir($handle)) {
		if(!is_dir($file) && preg_match("/\.(dat)\z/i",$file)) {
			$fp = fopen(TEMP_DIR.$file, "r");
			$userdata = fread($fp, 1024);
			fclose($fp);
			list($uip,$uhost,$uagent,$imgext,$ucode,) = explode("\t", rtrim($userdata));
			$file_name = preg_replace("/\.(dat)\z/i","",$file);
			if(is_file(TEMP_DIR.$file_name.$imgext)) //画像があればリストに追加
				$tmplist[] = $ucode."\t".$uip."\t".$file_name.$imgext;
		}
	}
	closedir($handle);
	$tmp = array();
	if(count($tmplist)!=0){
		//user-codeとipアドレスでチェック
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
	if(count($tmp)==0){
		$dat['notmp'] = true;
		$dat['pictmp'] = 1;
	}else{
		$dat['pictmp'] = 2;
		sort($tmp);
		reset($tmp);
		foreach($tmp as $tmpfile){
			$src = TEMP_DIR.$tmpfile;
			$srcname = $tmpfile;
			$date = date("Y/m/d H:i", filemtime($src));
			$dat['tmp'][] = compact('src','srcname','date');
		}
	}

	$dat = array_merge($dat,form($resto,'',$tmp));

	htmloutput(SKIN_DIR.OTHERFILE,$dat);
}

// 動画表示
function openpch(){

	$pch = newstring(filter_input(INPUT_GET, 'pch'));
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
			$fp = fopen($dat['pchfile'], "rb");
			$dat['type_neo'] = (fread($fp,3)==="NEO"); //先頭3byteを見る
			fclose($fp);
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
			if(preg_match("/\A(pchup-.*-tmp\.s?pch)\z/i",$file)) {
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

	$no = filter_input(INPUT_GET, 'no',FILTER_VALIDATE_INT);
	$lines = file(LOGFILE);
	$flag = FALSE;
	foreach($lines as $line){
		list($cno,,,,,,,,,$cext,$picw,$pich,$ctim,,$cptime,) = explode(",", rtrim($line));
		if($cno == $no){
			$flag = TRUE;
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
	if(! CONTINUE_PASS) $dat['newpost_nopassword'] = true;
	$dat['picfile'] = IMG_DIR.$ctim.$cext;
	list($dat['picw'], $dat['pich']) = getimagesize($dat['picfile']);
	$dat['no'] = $no;
	$dat['pch'] = $ctim;
	$dat['ext'] = $cext;
	$dat['ctype_img'] = true;
	//描画時間
	$cptime=is_numeric($cptime) ? calcPtime($cptime) : $cptime; 
	if(DSP_PAINTTIME) $dat['painttime'] = $cptime;
	$dat['applet'] = true;
	if(is_file(PCH_DIR.$ctim.'.pch')){
		$dat['ctype_pch'] = true;
		$dat['applet'] = false;
	}elseif(is_file(PCH_DIR.$ctim.'.spch')){
		$dat['ctype_pch'] = true;
		$dat['usepbbs'] = false;
	}
	if(mime_content_type(IMG_DIR.$ctim.$cext)==='image/webp'){
		$dat['applet'] = false;
	}
	$dat['addinfo'] = $addinfo;
	htmloutput(SKIN_DIR.PAINTFILE,$dat);
}

// コンティニュー認証
function check_cont_pass(){

	$no = filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
	$lines = file(LOGFILE);
	foreach($lines as $line){
		list($cno,,,,,,,,$cpwd,) = explode(",", $line);
		if($cno == $no && check_password($pwd, $cpwd)){
			return true;
		}
	}
	error(MSG028);
}

// 編集画面
function editform(){
	global $addinfo;
	global $fontcolors;
	global $ADMIN_PASS;

	$del = filter_input(INPUT_POST,'del',FILTER_VALIDATE_INT,FILTER_REQUIRE_ARRAY);//$del は配列
	$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
	$pwdc = filter_input(INPUT_COOKIE, 'pwdc');

	if (!is_array($del)) {
		error(MSG031);
	}

	sort($del);
	reset($del);
	if($pwd===""&&$pwdc) $pwd=newstring($pwdc);
	$fp=fopen(LOGFILE,"r");
	flock($fp, LOCK_EX);
	$buf=fread($fp,5242880);
	closeFile($fp);
	if(!$buf){error(MSG019);}
	$buf = charconvert($buf);
	$line = explode("\n", trim($buf));
	$flag = FALSE;
	foreach($line as $value){
		if($value){
			list($no,,$name,$email,$sub,$com,$url,$ehost,$pass,,,,,,,$fcolor) = explode(",", rtrim($value));
			if ($no == $del[0] && check_password($pwd, $pass, $pwd)){
				$flag = TRUE;
				break;
			}
		}
	}
	if(!$flag) {
		error(MSG028);
	}

	$dat['post_mode'] = true;
	$dat['rewrite'] = $no;
	if($pwd && ($pwd===$ADMIN_PASS)) $dat['admin'] = newstring($ADMIN_PASS);
	$dat['maxbyte'] = MAX_KB * 1024;
	$dat['maxkb']   = MAX_KB;
	$dat['addinfo'] = $addinfo;
	$dat['name'] = strip_tags($name);
	$dat['email'] = $email;
	$dat['sub'] = $sub;
	$com = preg_replace("#<br */?>#i","\n",$com); // <br>または<br />を改行へ戻す
	$dat['com'] = $com;
	$dat['url'] = $url;
	$dat['pwd'] = $pwd;

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

	if(($_SERVER["REQUEST_METHOD"]) !== "POST") error(MSG006);
	
	$com = filter_input(INPUT_POST, 'com');
	$name = filter_input(INPUT_POST, 'name');
	$email = filter_input(INPUT_POST, 'email');
	$url = filter_input(INPUT_POST, 'url',FILTER_VALIDATE_URL);
	$sub = filter_input(INPUT_POST, 'sub');
	$fcolor = filter_input(INPUT_POST, 'fcolor');
	$no = filter_input(INPUT_POST, 'no',FILTER_VALIDATE_INT);
	$pwd = newstring(filter_input(INPUT_POST, 'pwd'));
	$admin = (string)filter_input(INPUT_POST, 'admin');

	$userip = get_uip();
	//ホスト取得
	$host = gethostbyaddr($userip);
	check_badip($host);
	//NGワードがあれば拒絶
	Reject_if_NGword_exists_in_the_post($com,$name,$email,$url,$sub);

	// 時間
	$date = now_date(time());//日付取得
	$date .= UPDATE_MARK;
	if(DISP_ID){
		$date .= " ID:" . getId($userip, time());
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

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();
	redirect(
		PHP_SELF2 . (URL_PARAMETER ? "?".time() : ''),
		1,
		THE_SCREEN_CHANGES
	);
}
// 画像差し換え
function replace(){
	global $path,$temppath;
	$no = filter_input(INPUT_GET, 'no',FILTER_VALIDATE_INT);
	$pwd = newstring(filter_input(INPUT_GET, 'pwd'));
	$repcode = newstring(filter_input(INPUT_GET, 'repcode'));
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
	if($psec=$postedtime-$starttime){
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
		list($eno,$edate,$name,$email,$sub,$com,$url,$ehost,$epwd,$ext,$max_w,$max_h,$etim,,$ptime,$fcolor) = explode(",", rtrim($value));
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
	
			rename($dest,$path.$time.$imgext);
			chmod($path.$time.$imgext,PERMISSION_FOR_DEST);

			$message = UPLOADED_OBJECT_NAME.UPLOAD_SUCCESSFUL."<br><br>";

			//縮小表示 元のサイズを最大値にセット
			$reduced_size=image_reduction_display($w,$h,$max_w,$max_h);
				$w=$reduced_size['w'];
				$h=$reduced_size['h'];
	
			//サムネイル作成
			if(USE_THUMB){thumb($path,$time,$imgext,$max_w,$max_h);}

			//ワークファイル削除
			safe_unlink($upfile);
			safe_unlink($temppath.$file_name.".dat");
			//PCHファイルアップロード
			// .pch, .spch, ブランク どれかが返ってくる
			if ($pchext = check_pch_ext($temppath . $file_name)) {
				$src = $temppath . $file_name . $pchext;
				$dst = PCH_DIR . $time . $pchext;
				if(copy($src, $dst)){
					chmod($dst, PERMISSION_FOR_DEST);
					unlink($src);
				}
			}

			//旧ファイル削除
			delete_files($path, $etim, $ext);
			
			//ID付加
			if(DISP_ID){
				$date .= " ID:" . getId($userip, time());
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
			break;
		}
	}
	if(!$flag){
		closeFile($fp);
		error(MSG028);
	}

	writeFile($fp, implode("\n", $line));

	closeFile($fp);

	updatelog();
	redirect(
		PHP_SELF2 . (URL_PARAMETER ? "?".time() : ''),
		1,
		$message . THE_SCREEN_CHANGES
	);
}

// カタログ
function catalog(){

	$page = filter_input(INPUT_GET, 'page',FILTER_VALIDATE_INT);
	$page=($page===null) ? 0 : $page;
	$line = file(LOGFILE);
	$lineindex = get_lineindex($line); // 逆変換テーブル作成

	$tree = file(TREEFILE);
	$counttree = count($tree);
	$x = 0;
	$y = 0;
	$pagedef = CATALOG_X * CATALOG_Y;//1ページに表示する件数
	$dat = form();
	for($i = $page; $i < $page+$pagedef; ++$i){
		//空文字ではなく未定義になっている
		if(!isset($tree[$i])){
			$dat['y'][$y]['x'][$x]['noimg'] = true;
		}else{
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
					$res['h'] = null;
				}
			}
			
			$res['txt'] = !$res['img_file_exists']; // 画像が無い時
			$res['rescount'] = count($treeline) - 1;

			// 記事格納
			$dat['y'][$y]['x'][$x] = $res;
		}

		$x++;
		if($x == CATALOG_X){$y++; $x=0;}
	}

	$prev = $page - $pagedef;
	$next = $page + $pagedef;
	// 改ページ処理
	if($prev >= 0) $dat['prev'] = PHP_SELF.'?mode=catalog&amp;page='.$prev;
	$paging = "";

	//表示しているページが20ページ以上または投稿数が少ない時はページ番号のリンクを制限しない
	$showAll = ($counttree <= $pagedef * 21 || $page >= $pagedef * 21);

	for($i = 0; $i < ($showAll ? $counttree : $pagedef * 22) ; $i += $pagedef){
		$pn = $i / $pagedef;
		$paging .= ($page === $i)
			? str_replace("<PAGE>", $pn, NOW_PAGE)
			: str_replace("<PURL>", PHP_SELF."?mode=catalog&amp;page=".$i,
				str_replace("<PAGE>", $showAll || $i !== $pagedef * 21 ? $pn : "≫", OTHER_PAGE));
	}

	//改ページ分岐ここまで
	
	$dat['paging'] = $paging;
	if($counttree > $next){
		$dat['next'] = PHP_SELF.'?mode=catalog&amp;page='.$next;
	}

	htmloutput(SKIN_DIR.CATALOGFILE,$dat);
}

// 文字コード変換 
function charconvert($str){
	mb_language(LANG);
		return mb_convert_encoding($str, "UTF-8", "auto");
}

// NGワードがあれば拒絶
function Reject_if_NGword_exists_in_the_post($com,$name,$email,$url,$sub){
	global $badstring,$badname,$badstr_A,$badstr_B,$pwd,$ADMIN_PASS,$admin;
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
	if(!$admin || $admin!==$ADMIN_PASS){//管理者以外タグ無効
		$chk_com = htmlspecialchars($chk_com,ENT_QUOTES,'utf-8');
	}
	//管理モードで使用できるタグを制限
	if(preg_match('/<script|<\?php|<img|<a onmouseover|<iframe|<frame|<div|<table|<meta|<base|<object|<embed|<input|<body|<style/i', $chk_com)) error(MSG038);

}

//POSTされた入力をチェックしてログファイルに格納する書式にフォーマット
function create_formatted_text_from_post($com,$name,$email,$url,$sub,$fcolor,$dest=''){

	//入力チェック
	if(!$com||preg_match("/\A\s*\z/u",$com)) $com="";
	if(!$name||preg_match("/\A\s*\z/u",$name)) $name="";
	if(!$sub||preg_match("/\A\s*\z/u",$sub))   $sub="";
	if(!$url||!preg_match("#\Ahttps?://#i",$url)||preg_match("/</i",$url)) $url="";
	$name = str_replace("◆", "◇", $name);
	$sage=(stripos($email,'sage')!==false);//メールをバリデートする前にsage判定
	$email = filter_var($email, FILTER_VALIDATE_EMAIL);
	if(strlen($com) > MAX_COM) error(MSG011,$dest);
	if(strlen($name) > MAX_NAME) error(MSG012,$dest);
	if(strlen($email) > MAX_EMAIL) error(MSG013,$dest);
	if(strlen($sub) > MAX_SUB) error(MSG014,$dest);
	if(USE_NAME&&!$name) error(MSG009,$dest);
	if(USE_COM&&!$com) error(MSG008,$dest);
	if(USE_SUB&&!$sub) error(MSG010,$dest);
	
	//コメントのエスケープ
	global $ADMIN_PASS;
	$admin=(string)filter_input(INPUT_POST,'admin');
	if(!$admin || $admin!==$ADMIN_PASS){//管理者以外タグ無効
		$com = htmlspecialchars($com,ENT_QUOTES,'utf-8');
	}
	$com = str_replace(",", "&#44;", $com);

	// 改行コード
	$com = str_replace(["\r\n","\r"], "\n", $com);
	$com = preg_replace("/(\s*\n){4,}/u","\n",$com); //不要改行カット
	$com = nl2br($com);	//改行文字の前に HTMLの改行タグ
	
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
	$reduced_size=
	[
		'w' => $w,
		'h' => $h,
	];
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

function create_res ($line, $options = []) {
	global $path;

	list($no,$date,$name,$email,$sub,$com,$url,$host,$pwd,$ext,$w,$h,$time,$chk,$ptime,$fcolor)
		= explode(",", rtrim($line));
	$res = [
		'w' => $w,
		'h' => $h,
		'no' => $no,
		'sub' => $sub,
		'url' => filter_var($url,FILTER_VALIDATE_URL),
		'email' => filter_var($email, FILTER_VALIDATE_EMAIL),
		'ext' => $ext,
		'time' => $time,
		'fontcolor' => ($fcolor ? $fcolor : DEF_FONTCOLOR), //文字色
	];

	// 画像系変数セット
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
		$res['pch'] = (isset($options['pch']) && USE_ANIME && check_pch_ext(PCH_DIR.$time)) ? $time.$ext : '';
		//コンティニュー
		$res['continue'] = USE_CONTINUE ? $res['no'] : '';
	}

	//日付とIDを分離
	list($res['id'], $res['now']) = separateDatetimeAndId($date);
	//日付と編集マークを分離
	list($res['now'], $res['updatemark']) = separateDatetimeAndUpdatemark($res['now']);
	//名前とトリップを分離
	list($res['name'], $res['trip']) = separateNameAndTrip($name);

	$res['encoded_name'] = urlencode($res['name']);

	// オートリンク
	if(AUTOLINK) {
		$com = auto_link($com);
	}
	$com = preg_replace("/(^|>)((&gt;|＞)[^<]*)/i", "\\1".RE_START."\\2".RE_END, $com); // '>'色設定
	$res['com'] = preg_replace("#<br( *)/>#i","<br>",$com); //<br />を<br>へ

	return $res;
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

function getId ($userip, $time) {
	return substr(crypt(md5($userip.ID_SEED.date("Ymd", $time)),'id'),-8);
}

// 古いスレッドへの投稿を許可するかどうか
function check_elapsed_days ($res) {
	return ELAPSED_DAYS //古いスレッドのフォームを閉じる日数が設定されていたら
		? ((time() - (int)(substr($res['time'], -13, -3))) <= ( ELAPSED_DAYS * 86400)) // 指定日数以内なら許可
		: true; // フォームを閉じる日数が未設定なら許可
}

//逆変換テーブル作成
function get_lineindex ($line){
	$lineindex = [];
	foreach($line as $i =>$value){
		if($value !==''){
			list($no,) = explode(",", $value);
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

