<?php
//rss作成class for POTI-board 2022 (Ç)@satopian 
defined('MD_LINK') or define('MD_LINK',true);
defined('SKIN_DIR') or define('SKIN_DIR','');

require_once __DIR__.'/BladeOne/lib/BladeOne.php';

Use eftec\bladeone\BladeOne;

$views = __DIR__ . '/templates/'.SKIN_DIR;
$cache = $views.'cache';
$blade = new BladeOne($views,$cache,BladeOne::MODE_AUTO);

class rss{
	
	public static function create_rss($threads){
		global $blade;

		$dat['title'] = TITLE;
		$dat['encoded_title'] = urlencode(TITLE);
		$dat['home']  = HOME;
		$dat['self']  = PHP_SELF;
		$dat['encoded_self'] = urlencode(PHP_SELF);
		$dat['self2'] = h(PHP_SELF2);
		$dat['rooturl'] = ROOT_URL;//設置場所url
		$dat['skindir'] = 'templates/'.SKIN_DIR;
		$dat['encoded_rooturl'] = urlencode(ROOT_URL);//設置場所url
		$dat['ver'] = 'v0.1.0';
		$dat['updated']=gmdate("Y-m-d\TH:i:s",filemtime(TREEFILE));

		$oya = 0;	//親記事のメイン添字
		$dat['oya'][$oya]=[];
		foreach($threads as $i =>$rsslines){
			foreach($rsslines as $i =>$rssline){

			//レス作成
				$res = self::create_rss_from_line($rssline);
				// $dat['oya'][$oya]=$res;

			$dat['oya'][$oya][]=$res;

			clearstatcache(); //キャッシュをクリア

			}
			$oya++;
		}

		file_put_contents('rss.xml',$blade->run('rss',$dat),LOCK_EX);
		chmod('rss.xml',PERMISSION_FOR_DEST);


	}	
	private static function create_rss_from_line ($line, $options = []) {
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
			'ext' => $ext,
			'time' => $time,
			'updated'=> gmdate("Y-m-d\TH:i:s",substr($time,-13,-3)),
		];
	
		// 画像系変数セット
		
		//初期化
		$res['imgsrc'] = '';
		$res['painttime'] = '';
		$res['size'] = '';
		$res['enclosure']='';
		$res['imgtype']='';		
		if ($ext && is_file(IMG_DIR.$time.$ext)) { 
			$thumbnailsrc = is_file(THUMB_DIR.$time.'s.jpg');
			$imgsrc= $thumbnailsrc ? THUMB_DIR.$time.'s.jpg' : IMG_DIR.$time.$ext;
			// 画像ファイルがある場合
			$res['size'] = filesize($imgsrc);
			$res['imgsrc'] = '<img src="'.ROOT_URL.$imgsrc.'"><br>';
		$res['enclosure']=ROOT_URL.IMG_DIR.$imgsrc;
		$res['imgtype']=mime_content_type(IMG_DIR.$time.$ext);		
			
		}
	
		//名前とトリップを分離
		list($res['name'], $res['trip']) = separateNameAndTrip($name);
		$res['name']=strip_tags($res['name']);
		$res['descriptioncom'] = strip_tags(mb_strcut($com,0,300)); //メタタグに使うコメントからタグを除去
	
		$com = preg_replace("#<br( *)/?>#i","\n",$com); //<br />を改行に戻す
		$res['com']=strip_tags($com);//タグ除去
		//マークダウン記法のリンクをHTMLに変換
		if(MD_LINK){
			$res['com'] = md_link($res['com']);
		}
		// オートリンク
		if(AUTOLINK) {
			$res['com'] = auto_link($res['com']);
		}
		$res['com']=nl2br($res['com'],false);//改行を<br>へ
		foreach($res as $key => $val){
		$res[$key]=htmlentities($val,ENT_XML1, 'UTF-8', false);//エスケープ
		}
		return $res;
	}
}
