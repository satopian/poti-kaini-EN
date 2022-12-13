<?php
// thumbnail_gd.php by (C) 2018-2022 POTI改 POTI-board redevelopment team >> https://paintbbs.sakura.ne.jp/poti/ 
// originalscript 2005 (C) SakaQ  >> http://www.punyu.net/php/
//221022 1MBを超過する時はjpegのサムネイルを作成するようにした。
//220729 処理が成功した時の返り値をtrueに変更。
//220321 透明な箇所が黒くなる問題に対応。透明部分を白に変換。
//201218 webp形式対応
$thumbnail_gd_ver=20221021;
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606

function thumb($path,$time,$ext,$max_w,$max_h){
	$time=basename($time);
	$fname=basename($path).'/'.$time.basename($ext);
	if(!is_file($fname)){
		return;
	}
	if(!gd_check()||!function_exists("ImageCreate")||!function_exists("ImageCreateFromJPEG")){
		return;
	}
	$fsize = filesize($fname);    // ファイルサイズを取得
	list($w,$h) = GetImageSize($fname); // 画像の幅と高さとタイプを取得
	// リサイズ
	$w_h_size_over=($w > $max_w || $h > $max_h);
	$f_size_over=$fsize>1024*1024;
	if(!$w_h_size_over && !$f_size_over){//サイズが範囲内なら終了
		return;
	}
	$w_ratio = $max_w / $w;
	$h_ratio = $max_h / $h;
	$ratio = min($w_ratio, $h_ratio);
	$out_w = $w_h_size_over ? ceil($w * $ratio):$w;//端数の切り上げ
	$out_h = $w_h_size_over ? ceil($h * $ratio):$h;
	
	switch (mime_content_type($fname)) {
		case "image/gif";
			if(!function_exists("ImageCreateFromGIF")){//gif
				return;
			}
				$im_in = @ImageCreateFromGIF($fname);
				if(!$im_in)return;
		
		break;
		case "image/jpeg";
			$im_in = @ImageCreateFromJPEG($fname);//jpg
				if(!$im_in)return;
			break;
		case "image/png";
			if(!function_exists("ImageCreateFromPNG")){//png
				return;
			}
				$im_in = @ImageCreateFromPNG($fname);
				if(!$im_in)return;
			break;
		case "image/webp";
			if(!function_exists("ImageCreateFromWEBP")){//webp
				return;
			}
			$im_in = @ImageCreateFromWEBP($fname);
			if(!$im_in)return;
		break;

		default : return;
	}
	// 出力画像（サムネイル）のイメージを作成
	$exists_ImageCopyResampled = false;
	if(function_exists("ImageCreateTrueColor")&&get_gd_ver()=="2"){
		$im_out = ImageCreateTrueColor($out_w, $out_h);
		if(function_exists("ImageColorAlLocate") && function_exists("imagefill")){
			$background = ImageColorAlLocate($im_out, 0xFF, 0xFF, 0xFF);//背景色を白に
			imagefill($im_out, 0, 0, $background);
		}
	// コピー＆再サンプリング＆縮小
		if(function_exists("ImageCopyResampled")&&RE_SAMPLED){
			ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
			$exists_ImageCopyResampled = true;
		}
	}else{$im_out = ImageCreate($out_w, $out_h);$nottrue = 1;}
	// コピー＆縮小
	if(!$exists_ImageCopyResampled) ImageCopyResized($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
	// サムネイル画像を保存
	$outfile=THUMB_DIR.basename($time).'s.jpg';
	ImageJPEG($im_out, $outfile,THUMB_Q);
	// 作成したイメージを破棄
	ImageDestroy($im_in);
	ImageDestroy($im_out);
	if(!chmod($outfile,PERMISSION_FOR_DEST)){
		return;
	}

return is_file($outfile);

}
