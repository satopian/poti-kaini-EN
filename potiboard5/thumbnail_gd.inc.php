<?php
//Petit Note 2021-2024 (c)satopian MIT Licence
//https://paintbbs.sakura.ne.jp/

$thumbnail_gd_ver=20241102;
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606
class thumbnail_gd {

	public static function thumb($path,$fname,$time,$max_w,$max_h,$options=[]){
		$path=basename($path).'/';
		$fname=basename($fname);
		$time=basename($time);
		$fname=$path.$fname;
		if(!is_file($fname)){
			return;
		}
		if(!gd_check()||!function_exists("ImageCreate")||!function_exists("ImageCreateFromJPEG")){
			return;
		}
		if((isset($options['webp'])||isset($options['thumbnail_webp'])) && (!function_exists("ImageWEBP")||version_compare(PHP_VERSION, '7.0.0', '<'))){
			return;
		}

		$fsize = filesize($fname); // ファイルサイズを取得
		list($w,$h) = GetImageSize($fname); // 画像の幅と高さを取得
		$w_h_size_over=$max_w && $max_h && ($w > $max_w || $h > $max_h);
		$f_size_over=!isset($options['toolarge']) ? ($fsize>1024*1024) : false;
		if(!$w_h_size_over && !$f_size_over && !isset($options['webp']) && !isset($options['png2webp']) && !isset($options['png2jpeg'])){
			return;
		}
		if(isset($options['png2jpeg'])||isset($options['png2webp'])||!$max_w||!$max_h){//リサイズしない
			$out_w = $w;
			$out_h = $h;
		}else{// リサイズ
			$w_ratio = $max_w / $w;
			$h_ratio = $max_h / $h;
			$ratio = min($w_ratio, $h_ratio);
			$out_w = $w_h_size_over ? ceil($w * $ratio):$w;//端数の切り上げ
			$out_h = $w_h_size_over ? ceil($h * $ratio):$h;
		}

		$mime_type = mime_content_type($fname);
		if(!$im_in = self::createImageResource($fname,$mime_type)){
			return;
		};
		// 出力画像（サムネイル）のイメージを作成
		$exists_ImageCopyResampled = false;
		if(function_exists("ImageCreateTrueColor") && get_gd_ver()=="2"){
			$im_out = ImageCreateTrueColor($out_w, $out_h);

				if(self::isTransparencyEnabled($options, $mime_type)){//透明度を扱う時
						imagealphablending($im_out, false);
						imagesavealpha($im_out, true);//透明
				}else{//透明度を扱わない時
					if(function_exists("ImageColorAlLocate") && function_exists("imagefill")){
						$background = ImageColorAlLocate($im_out, 0xFF, 0xFF, 0xFF);//背景色を白に
						imagefill($im_out, 0, 0, $background);
					}
				}
				// コピー＆再サンプリング＆縮小
				if(function_exists("ImageCopyResampled")){
					ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
					$exists_ImageCopyResampled = true;//"ImageCopyResampled"が有効
				}
			}else{
				$im_out = ImageCreate($out_w, $out_h);
			}
			// コピー＆縮小
			if(!$exists_ImageCopyResampled){
				ImageCopyResized($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);//"ImageCopyResampled"が無効の時
			}
			if(isset($options['toolarge'])){
				if(!$outfile = self::overwriteResizedImage($im_out, $fname, $mime_type)){
					return;
				}
			}else{
				if(!$outfile = self::createThumbnailImage($im_out, $time, $options)){
					return;
			}
		}
		
		// 作成したイメージを破棄
		ImageDestroy($im_in);
		ImageDestroy($im_out);

		if(!chmod($outfile,PERMISSION_FOR_DEST)){
			return;
		}

		if(is_file($outfile)){
			return $outfile;
		}
		return false;

	}
	// 透明度の処理を行う必要があるかを判断
	private static function isTransparencyEnabled($options, $mime_type) {
		// 透明度を扱うオプションが設定されているか確認
		$transparencyOptionsSet = isset($options['toolarge']) || isset($options['webp']) || isset($options['thumbnail_webp']) || isset($options['png2webp']);
		
		// 対象の画像形式で透明度がサポートされているか確認
		$transparencySupportedFormats = ["image/png", "image/gif", "image/webp"];
		
		// 透明度を扱うための関数が存在するか確認
		$transparencyFunctionsAvailable = function_exists("imagealphablending") && function_exists("imagesavealpha");
		
		return $transparencyOptionsSet && in_array($mime_type, $transparencySupportedFormats) && $transparencyFunctionsAvailable;
	}
	//各画像フォーマットのリソースを作成
	private static function createImageResource($fname,$mime_type) {
		switch ($mime_type) {
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
				if(!function_exists("ImageCreateFromWEBP")||version_compare(PHP_VERSION, '7.0.0', '<')){//webp
					return;
				}
					$im_in = @ImageCreateFromWEBP($fname);
					if(!$im_in)return;
				break;

			default : return;
		}
		return $im_in;
	}

	//縮小した画像で上書き
	private static function overwriteResizedImage($im_out, $fname, $mime_type) {
		$outfile=$fname;
		//本体画像を縮小
		switch ($mime_type) {
			case "image/gif";
				if(function_exists("ImagePNG")){
					ImagePNG($im_out, $outfile,3);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
					break;
			case "image/jpeg";
				ImageJPEG($im_out, $outfile,98);
				break;
			case "image/png";
				if(function_exists("ImagePNG")){
					ImagePNG($im_out, $outfile,3);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
					break;
			case "image/webp";
				if(function_exists("ImageWEBP")&&version_compare(PHP_VERSION, '7.0.0', '>=')){
					ImageWEBP($im_out, $outfile,98);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
					break;

				default : return;
			return $outfile;
		}
	}
	//サムネイル作成
	private static function createThumbnailImage($im_out, $time, $options) {

		if(isset($options['png2jpeg'])){

			$outfile=TEMP_DIR.$time.'.jpg.tmp';//一時ファイル
			ImageJPEG($im_out, $outfile,98);

		} elseif(isset($options['png2webp'])){

			if(function_exists("ImageWEBP")&& version_compare(PHP_VERSION, '7.0.0', '>=')){
				$outfile=TEMP_DIR.$time.'.webp.tmp';//一時ファイル
				ImageWEBP($im_out, $outfile,98);
			}else{
				$outfile=TEMP_DIR.$time.'.jpg.tmp';//一時ファイル
				ImageJPEG($im_out, $outfile,98);
			}
		
		} elseif(isset($options['webp'])){

			$outfile='webp/'.$time.'t.webp';
			ImageWEBP($im_out, $outfile,90);
		
		}elseif(isset($options['thumbnail_webp'])){

			$outfile=THUMB_DIR.$time.'s.webp';
			ImageWEBP($im_out, $outfile,90);

		}else{

			$outfile=THUMB_DIR.$time.'s.jpg';
			// サムネイル画像を保存
			ImageJPEG($im_out, $outfile,90);

		}
			return $outfile;
	}
}
