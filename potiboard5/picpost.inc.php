<?php
$picpost_inc_ver=20250707;
//----------------------------------------------------------------------
// picpost.inc.php lot.20241117 for POTI-board
// by さとぴあ & POTI-board redevelopment team >> https://paintbbs.sakura.ne.jp/poti/ 
// originalscript (c)SakaQ 2005 >> http://www.punyu.net/php/
// しぃからPOSTされたお絵かき画像をTEMPに保存
//
// このスクリプトはPaintBBS（藍珠CGI）のPNG保存ルーチンを参考に
// PHP用に作成したものです。
//----------------------------------------------------------------------
// 2024/11/18 不正画像検出はpotiboard.phpで。
// 2024/11/17 potiboard.phpでユーザーコードを再発行。
// 2024/01/28 ユーザーコードはCookieとSESSIONの比較のみに。
// 2023/12/27 ユーザーコードをSESSIONに格納して、CookieとSESSIONどちらかが一致していれば投稿可能になるようにした。
// 2023/11/17 Javaプラグインが動作する数少ないブラウザWaterfoxから投稿できなくなっていたのを修正。
// 2023/10/10 セキュリティ対策。pchデータのmime typeチェックを追加。
// 2022/12/03 same-originでは無かった時はエラーにする。
// 2022/11/23 ユーザーコード不一致の時のためのエラーメッセージを追加。
// 2022/10/22 'SECURITY_TIMER''SECURITY_CLICK'で設定された必要な描画時間と描画工程数をチェックする処理を追加。
// 2022/10/20 画像の幅、高さのサイズ違反のチェックを廃止。
// 2022/10/14 画像データのmimeタイプのチェックを追加。
// 2022/08/21 PCHデータの書き込みエラーでは停止しないようにした。
// 2022/07/03 同名のファイルが存在する時は秒数に+1して回避。ファイル名の秒数を13桁→16桁へ。
// 2022/06/27 画像とユーザーデータが存在しない時は画面を推移せずエラーのアラートを出す。
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
// 2020/02/25 タイムゾーンを'Asia/Tokyo'に
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
class picpost{
	Public static function saveimage(): void {
	if(($_SERVER["REQUEST_METHOD"]) !== "POST"){
		header( "Location: ./ ") ;
	}
	$lang = ($http_langs = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '')
	? explode( ',', $http_langs )[0] : '';
	$en= (stripos($lang,'ja')!==0) ? true : false;

	if($en){//ブラウザの言語が日本語以外の時
		$errormsg_1 = "Failed to get data. Please try posting again after a while.";
		$errormsg_2 = "The size of the picture is too big. The drawing image is not saved.";
		$errormsg_3 = "Failed to create the image file. Please try posting again after a while.";
		$errormsg_4 = "The size of the picture too large.drawng image will not be saved.";
		$errormsg_5 = "There was an illegal image. The drawng image is not saved.";
		$errormsg_6 = "Failed to open PCH file. Please try posting again after a while.";
		$errormsg_7 = "Failed to create user data. Please try posting again after a while.";
		$errormsg_8 = "User code has been reissued.\nPlease try again.";
		$errormsg_9 = "The post has been rejected.";
		$errormsg_10 = "The image appears to be corrupted.\nPlease consider saving a screenshot to preserve your work.";
	}else{//日本語
		$errormsg_1 = "データの取得に失敗しました。時間を置いて再度投稿してみて下さい。";
		$errormsg_2 = "規定容量オーバー。お絵かき画像は保存されません。";
		$errormsg_3 = "画像ファイルの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
		$errormsg_4 = "規定サイズ違反を検出しました。お絵かき画像は保存されません。";
		$errormsg_5 = "不正な画像を検出しました。お絵かき画像は保存されません。";
		$errormsg_6 = "PCHファイルの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
		$errormsg_7 = "ユーザーデータの作成に失敗しました。時間を置いて再度投稿してみて下さい。";
		$errormsg_8 = "ユーザーコードを再発行しました。\n再度投稿してみてください。";
		$errormsg_9 = "拒絶されました。";
		$errormsg_10 = "破損した画像が検出されました。\nスクリーンショットを撮り作品を保存する事を強くおすすめします。";
	}

	header('Content-type: text/plain');

	//Sec-Fetch-SiteがSafariに実装されていないので、Orijinと、hostをそれぞれ取得して比較。
	//Orijinがhostと異なっていたら投稿を拒絶。
	if(isset($_SERVER['HTTP_ORIGIN']) && isset($_SERVER['HTTP_HOST'])){//EdgeのIEモードでは$_SERVER['HTTP_ORIGIN']を取得できない
		if(parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST) !== $_SERVER['HTTP_HOST']){
			die("error\n{$errormsg_9}");
		}
	}
	/* ---------- picpost.php用設定 ---------- */
	defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
	defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606
	defined('SECURITY_TIMER') or define('SECURITY_TIMER', 0); //config.phpで未定義なら0
	defined('SECURITY_CLICK') or define('SECURITY_CLICK', 0); //config.phpで未定義なら0

	//容量違反チェックをする する:1 しない:0
	define('SIZE_CHECK', '1');
	//投稿容量制限 KB
	define('PICPOST_MAX_KB', '8192');//8MBまで

	$time = time();

	/* ■■■■■ メイン処理 ■■■■■ */

	$u_ip = get_uip();
	$u_host = $u_ip ? gethostbyaddr($u_ip) : '';
	$u_agent = $_SERVER["HTTP_USER_AGENT"];

	$u_agent = str_replace("\t", "", $u_agent);

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
	$is_send_java=(stripos($u_agent,"Java/")!==false);//Javaプラグインからの送信ならtrue
	$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
	
	session_sta();
	$session_usercode = isset($_SESSION['usercode']) ? $_SESSION['usercode'] : "";

	// 拡張ヘッダーから情報を取り出す
	$sendheader = substr($buffer, 1 + 8, $headerLength);
	if($sendheader){
		$sendheader = str_replace("&amp;", "&", $sendheader);
		parse_str($sendheader, $u);
		//拡張ヘッダから取得		
		$tool = isset($u['tool']) ? $u['tool'] : 'Shi-Painter';
		$tool= is_paint_tool_name($tool);
		$resto = isset($u['resto']) ? $u['resto'] : '';
		$usercode = !$is_send_java ? $session_usercode : (isset($u['usercode']) ? $u['usercode'] : '');
		$rep = isset($u['rep']) ? $u['rep'] : '';
		$no = isset($u['no']) ? $u['no'] : '';
		$pwd = isset($u['pwd']) ? $u['pwd'] : '';
		$repcode = isset($u['repcode']) ? $u['repcode'] : '';
		$stime = isset($u['stime']) ? $u['stime'] : '';
		$count = isset($u['count']) ? $u['count'] : 0;
	}
	$timer = $time - $stime;
	//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加

	$userdata .= "\t$usercode\t$repcode\t$stime\t$time\t$resto\t$tool";
	$userdata .= "\n";

	$c_usercode=(string)filter_input_data('COOKIE', 'usercode');//Waterfoxではクロスオリジン制約でCookieが取得できない
	if(!$is_send_java
	&&
	((!$c_usercode || !$session_usercode)
	|| ($c_usercode !== $session_usercode))
	){
	//user-code再発行
		die("error\n{$errormsg_8}");
	}
	if(((bool)SECURITY_TIMER && !$repcode && (bool)$timer) && ((int)$timer<(int)SECURITY_TIMER)){

		$psec=(int)SECURITY_TIMER-(int)$timer;
		$waiting_time=calcPtime ($psec);
		if($en){
			die("error\nPlease draw for another {$waiting_time}.");
		}else{
			die("error\n描画時間が短すぎます。あと{$waiting_time}。");
		}
	}
	if(((int)SECURITY_CLICK && !$repcode && $count) && ($count<(int)SECURITY_CLICK)){
		$nokori=(int)SECURITY_CLICK-$count;

		if($en){
			die("error\nPlease draw more. Further {$nokori} steps.");
		}else{
			die("error\n工程数が少なすぎます。あと{$nokori}工程。");
		}
	}
	$imgfile = time().substr(microtime(),2,6);//画像ファイル名
	$imgfile = is_file(TEMP_DIR.$imgfile.$imgext) ? ((time()+1).substr(microtime(),2,6)) : $imgfile;

	$full_imgfile = TEMP_DIR.$imgfile.$imgext;
	// 画像データをファイルに書き込む
	file_put_contents($full_imgfile,$imgdata,LOCK_EX);
	if(!is_file($full_imgfile)){
		die("error\n{$errormsg_3}");
	}
	$img_type=mime_content_type($full_imgfile);
	if(!in_array($img_type,["image/png","image/jpeg"])){
		unlink($full_imgfile);
		die("error\n{$errormsg_3}");
	}

	if(($img_type==="image/png") && function_exists("ImageCreateFromPNG")){//PNG画像が壊れていたらエラー
		$im_in = @ImageCreateFromPNG($full_imgfile);
		if(!$im_in){
			die("error\n{$errormsg_10}");
		}else{
			if(PHP_VERSION_ID < 80000) {//PHP8.0未満の時は
				ImageDestroy($im_in);
			}
		}
	}

	chmod($full_imgfile,PERMISSION_FOR_DEST);

	// PCHファイルの長さを取り出す
	$pchLength = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength, 8);
	// ヘッダーを獲得
	$h = substr($buffer, 0, 1);
	// 拡張子設定
	$pchext="";
	if($h=='P'){
		$pchext = '.pch';
	}elseif($h=='S'){
		$pchext = '.spch';
	}

	if($pchext && $pchLength){
		// PCHイメージを取り出す
		$PCHdata = substr($buffer, 1 + 8 + $headerLength + 8 + 2 + $imgLength + 8, $pchLength);
		// PCHデータをファイルに書き込む
		$pch_file=TEMP_DIR.$imgfile.$pchext;
		file_put_contents($pch_file,$PCHdata,LOCK_EX);
		if(is_file($pch_file)){
			chmod($pch_file,PERMISSION_FOR_DEST);
			$pch_type=mime_content_type($pch_file);
			if(!in_array($pch_type,["application/octet-stream","application/gzip"])){
				unlink($pch_file);
			}
		}
	}
	// 情報データをファイルに書き込む
	file_put_contents(TEMP_DIR.$imgfile.".dat",$userdata,LOCK_EX);
	if(!is_file(TEMP_DIR.$imgfile.'.dat')){
		die("error\n{$errormsg_7}");
	}
	chmod(TEMP_DIR.$imgfile.'.dat',PERMISSION_FOR_LOG);
	if($rep){
		replace($no,$pwd,$repcode,true);
	}
	die("ok");
	}
}
