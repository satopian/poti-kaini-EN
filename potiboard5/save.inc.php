<?php
//save.inc.php 2023 (c)satopian MIT Licence
//https://paintbbs.sakura.ne.jp/

$save_inc_ver=20231106;
class image_save{

	private $imgfile,$usercode,$en,$count,$errtext; // プロパティとして宣言
	private $tool,$repcode,$stime,$resto,$timer,$error_type,$hide_animation,$pmax_w,$pmax_h;
	
	function __construct(){

		global $pmax_w,$pmax_h;


	defined('SECURITY_TIMER') or define('SECURITY_TIMER', 0); //config.phpで未定義なら0

	//容量違反チェックをする する:1 しない:0
	defined('SIZE_CHECK') or define('SIZE_CHECK', '1');
	//PNG画像データ投稿容量制限KB(chiは含まない)
	defined('PICTURE_MAX_KB') or define('PICTURE_MAX_KB', '10485760');//10MBまで
	defined('PSD_MAX_KB') or define('PSD_MAX_KB', '40960');//40MBまで。ただしサーバのPHPの設定によって2MB以下に制限される可能性があります。
	defined('PERMISSION_FOR_LOG') or define('PERMISSION_FOR_LOG', 0600); //config.phpで未定義なら0600
	defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606


	if(($_SERVER["REQUEST_METHOD"]) !== "POST"){
		return header( "Location: ./ ") ;
	}

	$lang = ($http_langs = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '')
	? explode( ',', $http_langs )[0] : '';
	$this->en= (stripos($lang,'ja')!==0);

	$this->imgfile = time().substr(microtime(),2,6);	//画像ファイル名
	$this->imgfile = is_file(TEMP_DIR.$this->imgfile.'.png') ? ((time()+1).substr(microtime(),2,6)) : $this->imgfile;
	
	}

	public function save_klecks(){

		$this->error_type="klecks";

		$this->tool = (string)filter_input(INPUT_POST, 'tool');
		$this->usercode = (string)filter_input(INPUT_POST, 'usercode');
		$this->repcode = (string)filter_input(INPUT_POST, 'repcode');
		$this->resto = (string)filter_input(INPUT_POST, 'resto',FILTER_VALIDATE_INT);
		$this->stime = (string)filter_input(INPUT_POST, 'stime',FILTER_VALIDATE_INT);
		$this->timer=time()-(int)$this->stime;
		$this->hide_animation = (string)filter_input(INPUT_POST, 'hide_animation');

		$this->check_async_request();
		$this->check_security();
		$this->move_uploaded_image();
		$this->move_uploaded_psd();
		$this->put_user_dat();

		die("ok");

	}
	public function save_neo(){

		$this->error_type="neo";

		$sendheader = (string)filter_input(INPUT_POST,'header');

		$sendheader = str_replace("&amp;", "&", $sendheader);
		parse_str($sendheader, $u);
		$this->tool = 'PaintBBS NEO';
		
		$this->usercode = isset($u['usercode']) ? $u['usercode'] : '';
		$this->repcode = isset($u['repcode']) ? $u['repcode'] : '';
		$this->resto = isset($u['resto']) ? $u['resto'] : '';
		$this->stime = isset($u['stime']) ? $u['stime'] : '';
		$this->count = isset($u['count']) ? $u['count'] : 0;
		$this->timer = isset($u['timer']) ? ($u['timer']/1000) : 0;
		$this->hide_animation = isset($u['hide_animation']) ? $u['hide_animation'] : '';

		$this->check_async_request();
		$this->check_security();

		if(((int)SECURITY_CLICK && !$this->repcode && $this->count) && ($this->count<(int)SECURITY_CLICK)){
			$nokori=(int)SECURITY_CLICK-$this->count;
		
			if($this->en){
				die("error\nPlease draw more. Further {$nokori} steps.");
			}else{
				die("error\n工程数が少なすぎます。あと{$nokori}工程。");
			}
		
		}

		$this->move_uploaded_image();
		$this->move_uploaded_pch();
		$this->put_user_dat();

		die("ok");
	}

	public function save_chickenpaint(){

		$this->error_type="chi";
		$this->tool = 'ChickenPaint';
		$this->usercode = (string)filter_input(INPUT_GET, 'usercode');
		$this->repcode = (string)filter_input(INPUT_GET, 'repcode');
		$this->resto = (string)filter_input(INPUT_GET, 'resto',FILTER_VALIDATE_INT);
		$this->stime = (string)filter_input(INPUT_GET, 'stime',FILTER_VALIDATE_INT);
		$this->timer=time()-(int)$this->stime;

		$this->check_security();
		$this->move_uploaded_image();
		$this->move_uploaded_chi();
		$this->put_user_dat();

		die("CHIBIOK\n");
	}

	private function check_async_request(){
		if(!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
			$this->error_msg($this->en ? "The post has been rejected." : "拒絶されました。");
		}
	}

	private function check_security(){

		//csrf
		if(!$this->usercode || $this->usercode !== (string)filter_input(INPUT_COOKIE, 'usercode')){
			$this->error_msg($this->en ? "User code mismatch." : "ユーザーコードが一致しません。");
		}
		if(!isset($_SERVER['HTTP_ORIGIN']) || !isset($_SERVER['HTTP_HOST'])){
			$this->error_msg($this->en ? "Your browser is not supported." : "お使いのブラウザはサポートされていません。");
		}
		if(parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST) !== $_SERVER['HTTP_HOST']){
			$this->error_msg($this->en ? "The post has been rejected." : "拒絶されました。");
		}

		if((bool)SECURITY_TIMER && !$this->repcode && ((int)$this->timer<(int)SECURITY_TIMER)){

			$psec=(int)SECURITY_TIMER-(int)$this->timer;
			$waiting_time=calcPtime ($psec);
			if($this->en){
				$this->error_msg("Please draw for another {$waiting_time}.");
			}else{
				$this->error_msg("描画時間が短すぎます。あと{$waiting_time}。");
			}
		}

	}

	private function put_user_dat(){

		$time=time();
		$u_ip = get_uip();
		$u_host = $u_ip ? gethostbyaddr($u_ip) : '';
		$u_agent = trim($_SERVER["HTTP_USER_AGENT"]);
		$u_agent = str_replace("\t", "", $u_agent);
		$imgext='.png';
		$this->usercode = trim($this->usercode);
		$this->repcode = trim($this->repcode);
		$this->stime = trim($this->stime);
		$this->resto = trim($this->resto);
		$this->tool = trim($this->tool);
		$this->tool= is_paint_tool_name($this->tool);
		$this->hide_animation = isset($this->hide_animation) ? $this->hide_animation : ''; 
		$this->hide_animation = trim($this->hide_animation);
		/* ---------- 投稿者情報記録 ---------- */
		$userdata = "$u_ip\t$u_host\t$u_agent\t$imgext";
		//usercode 差し換え認識コード 描画開始 完了時間 レス先 を追加
		$userdata .= "\t$this->usercode\t$this->repcode\t$this->stime\t$time\t$this->resto\t$this->tool\t$this->hide_animation";
		$userdata .= "\n";
		
		// 情報データをファイルに書き込む
		file_put_contents(TEMP_DIR.$this->imgfile.".dat",$userdata,LOCK_EX);
			
		if(!is_file(TEMP_DIR.$this->imgfile.'.dat')){
			$this->error_msg($this->en ? "Your picture upload failed!\nPlease try again!" : "投稿に失敗。\n時間を置いて再度投稿してみてください。");
		}
		chmod(TEMP_DIR.$this->imgfile.'.dat',PERMISSION_FOR_LOG);
			
	}
					
	private function move_uploaded_image(){

		if(!isset ($_FILES["picture"]) || $_FILES['picture']['error'] != UPLOAD_ERR_OK) {
			$this->error_msg($this->en ? "Your picture upload failed!\nPlease try again!" : "投稿に失敗。\n時間を置いて再度投稿してみてください。");
		}
		
		if(SIZE_CHECK && ($_FILES['picture']['size'] > (PICTURE_MAX_KB * 1024))){
			$this->error_msg($this->en ? "The size of the picture is too big. " : "ファイルサイズが大きすぎます。");
		}

		if(mime_content_type($_FILES['picture']['tmp_name'])!=='image/png'){
			$this->error_msg($this->en ? "Your picture upload failed!\nPlease try again!" : "投稿に失敗。\n時間を置いて再度投稿してみてください。");
		}

		if(function_exists("ImageCreateFromPNG")){//PNG画像が壊れていたらエラー
			$im_in = @ImageCreateFromPNG($_FILES['picture']['tmp_name']);
			if(!$im_in){
				$this->error_msg($this->en ? "The image appears to be corrupted.\nPlease consider saving a screenshot to preserve your work." : "破損した画像が検出されました。\nスクリーンショットを撮り作品を保存する事を強くおすすめします。");
			}else{
				ImageDestroy($im_in);
			}
		}

		$success = move_uploaded_file($_FILES['picture']['tmp_name'], TEMP_DIR.$this->imgfile.'.png');
		
		if(!$success||!is_file(TEMP_DIR.$this->imgfile.'.png')) {
			$this->error_msg($this->en ? "Your picture upload failed!\nPlease try again!" : "投稿に失敗。\n時間を置いて再度投稿してみてください。");
		}
		chmod(TEMP_DIR.$this->imgfile.'.png',PERMISSION_FOR_DEST);
	}

	private function move_uploaded_chi(){
		if(isset($_FILES['chibifile']) && ($_FILES['chibifile']['error'] == UPLOAD_ERR_OK)){
			if(mime_content_type($_FILES['chibifile']['tmp_name'])==="application/octet-stream"){
				if(!SIZE_CHECK || ($_FILES['chibifile']['size'] < (PSD_MAX_KB * 1024))){
					//chiファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
					move_uploaded_file($_FILES['chibifile']['tmp_name'], TEMP_DIR.$this->imgfile.'.chi');
					if(is_file(TEMP_DIR.$this->imgfile.'.chi')){
					chmod(TEMP_DIR.$this->imgfile.'.chi',PERMISSION_FOR_DEST);
					}
				}
			}
		}
	}
	private function move_uploaded_psd(){
		if(isset($_FILES['psd']) && ($_FILES['psd']['error'] == UPLOAD_ERR_OK)){
			if(mime_content_type($_FILES['psd']['tmp_name'])==="image/vnd.adobe.photoshop"){
				if(!SIZE_CHECK || ($_FILES['psd']['size'] < (PSD_MAX_KB * 1024))){
					//PSDファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
					move_uploaded_file($_FILES['psd']['tmp_name'], TEMP_DIR.$this->imgfile.'.psd');
					if(is_file(TEMP_DIR.$this->imgfile.'.psd')){
						chmod(TEMP_DIR.$this->imgfile.'.psd',PERMISSION_FOR_DEST);
					}
				}
			}
		}
		if(isset($_FILES['tgkr']) && ($_FILES['tgkr']['error'] == UPLOAD_ERR_OK)){
			if(mime_content_type($_FILES['tgkr']['tmp_name'])==="application/octet-stream"){
				if(!SIZE_CHECK || ($_FILES['tgkr']['size'] < (PSD_MAX_KB * 1024))){
					//PSDファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
					move_uploaded_file($_FILES['tgkr']['tmp_name'], TEMP_DIR.$this->imgfile.'.tgkr');
					if(is_file(TEMP_DIR.$this->imgfile.'.tgkr')){
						chmod(TEMP_DIR.$this->imgfile.'.tgkr',PERMISSION_FOR_DEST);
					}
				}
			}
		}
	}
	private function move_uploaded_pch(){
		if(isset($_FILES['pch']) && ($_FILES['pch']['error'] == UPLOAD_ERR_OK)){
			if(mime_content_type($_FILES['pch']['tmp_name'])==="application/octet-stream"){
				if(!SIZE_CHECK || ($_FILES['pch']['size'] < (PSD_MAX_KB * 1024))){
					//PSDファイルのアップロードができなかった場合はエラーメッセージはださず、画像のみ投稿する。 
					move_uploaded_file($_FILES['pch']['tmp_name'], TEMP_DIR.$this->imgfile.'.pch');
					if(is_file(TEMP_DIR.$this->imgfile.'.pch')){
						chmod(TEMP_DIR.$this->imgfile.'.pch',PERMISSION_FOR_DEST);
					}
				}
			}
		}
	}

	private function error_msg($message) {
		switch ($this->error_type){
			case "neo":
				$errtext="error\n";
			break;
			case "chi":
				$errtext="CHIBIERROR ";
			break;
			case "klecks":
				$errtext="";
			break;
			default:
			$errtext="";
		}

		header('Content-type: text/plain');
		die(h($errtext.$message));
	}
}
