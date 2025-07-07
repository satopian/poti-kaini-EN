<?php
// thumbnail_gd.inc.php for PetitNote (C)さとぴあ @satopian 2021 - 2025
// https://paintbbs.sakura.ne.jp/
// originalscript (C)SakaQ 2005 http://www.punyu.net/php/

$thumbnail_gd_ver=20250707;
defined('PERMISSION_FOR_DEST') or define('PERMISSION_FOR_DEST', 0606); //config.phpで未定義なら0606
class thumbnail_gd {

	public static function thumb($path,$fname,$time,$max_w,$max_h,$options=[]): ?string {
		$path=basename($path).'/';
		$fname=basename($fname);
		$time=basename($time);
		if(!ctype_digit($time)) {
			return null;
		}
		$fname=$path.$fname;
		if(!is_file($fname)){
			return null;
		}
		if(!self::gd_check()||!function_exists("ImageCreate")||!function_exists("ImageCreateFromJPEG")){
			return null;
		}
		if((isset($options['webp'])||isset($options['thumbnail_webp'])) && !function_exists("ImageWEBP")){
			return null;
		}

		$fsize = filesize($fname); // ファイルサイズを取得
		list($w,$h) = GetImageSize($fname); // 画像の幅と高さを取得
		$w_h_size_over = $max_w && $max_h && ($w > $max_w || $h > $max_h);
		$f_size_over = !isset($options['toolarge']) ? ($fsize>1024*1024) : false;
		if(!$w_h_size_over && !$f_size_over && !isset($options['webp']) && !isset($options['png2webp']) && !isset($options['png2jpeg'])){
			return null;
		}
		if(!$w_h_size_over || isset($options['png2jpeg']) || isset($options['png2webp']) || !$max_w || !$max_h){//リサイズしない
			$out_w = $w;
			$out_h = $h;
		}else{// リサイズ
			$w_ratio = $max_w / $w;
			$h_ratio = $max_h / $h;
			$ratio = min($w_ratio, $h_ratio);
			$out_w = ceil($w * $ratio);//端数の切り上げ
			$out_h = ceil($h * $ratio);
		}

		$mime_type = mime_content_type($fname);
		if(!$im_in = self::createImageResource($fname,$mime_type)){
			return null;
		};
		// 出力画像（サムネイル）のイメージを作成
		if(function_exists("ImageCreateTrueColor")){
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

		}else{
			$im_out = ImageCreate($out_w, $out_h);
		}

		// コピー＆再サンプリング＆縮小
		if(function_exists("ImageCopyResampled")){
			ImageCopyResampled($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);
		}else{
			ImageCopyResized($im_out, $im_in, 0, 0, 0, 0, $out_w, $out_h, $w, $h);//"ImageCopyResampled"が無効の時
		}

		if(isset($options['toolarge'])){
			$outfile = self::overwriteResizedImage($im_out, $fname, $mime_type);
		}else{
			$outfile = self::createThumbnailImage($im_out, $time, $options);
		}
		// 作成したイメージを破棄
		self::safeImageDestroy($im_in);
		self::safeImageDestroy($im_out);

		if(!$outfile){
			return null;
		}

		if(!chmod($outfile,PERMISSION_FOR_DEST)){
			return null;
		}

		if(is_file($outfile)){
			return $outfile;
		}
		return null;

	}
	//GD版が使えるかチェック
	private static function gd_check(): bool {
		// GDモジュールが有効化されているか
		if (!extension_loaded('gd')) {
				return false;
		}
		// GDモジュールが動作可能か
		if (!function_exists('gd_info')) {
				return false;
		}
		// JPEGのサポートを確認
		if (!(ImageTypes() & IMG_JPG)) {
				return false;
		}
		// JPEG出力関数の存在を確認
		if (!function_exists('ImageJPEG')) {
				return false;
		}
		return true;
	}

	//GDのイメージを破棄
	private static function safeImageDestroy($gdImage): void {
		if(PHP_VERSION_ID < 80000) {//PHP8.0未満の時は
			imagedestroy($gdImage);
		}
	}

	// 透明度の処理を行う必要があるかを判断
	private static function isTransparencyEnabled($options, $mime_type): bool {
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
					return null;
				}
					$im_in = @ImageCreateFromGIF($fname);
					if(!$im_in)return null;
				break;
			case "image/jpeg";
				$im_in = @ImageCreateFromJPEG($fname);//jpg
					if(!$im_in)return null;
				break;
			case "image/png";
				if(!function_exists("ImageCreateFromPNG")){//png
					return null;
				}
				$im_in = @ImageCreateFromPNG($fname);
					if(!$im_in)return null;
				break;
			case "image/webp";
				if(!function_exists("ImageCreateFromWEBP")){//webp
					return null;
				}
					$im_in = @ImageCreateFromWEBP($fname);
					if(!$im_in)return null;
				break;

			default : return null;
		}
		return $im_in;
	}

	//縮小した画像で上書き
	private static function overwriteResizedImage($im_out, $fname, $mime_type): ?string {
		$outfile=(string)$fname;
		//本体画像を縮小
		switch ($mime_type) {
			case "image/gif";
				if(function_exists("ImagePNG")){
					ImagePNG($im_out, $outfile,3);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
				return $outfile;
			case "image/jpeg";
				ImageJPEG($im_out, $outfile,98);
				return $outfile;
			case "image/png";
				if(function_exists("ImagePNG")){
					ImagePNG($im_out, $outfile,3);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
				return $outfile;
			case "image/webp";
				if(function_exists("ImageWEBP")){
					ImageWEBP($im_out, $outfile,98);
				}else{
					ImageJPEG($im_out, $outfile,98);
				}
				return $outfile;

				default : return null;

		}
	}
	//サムネイル作成
	private static function createThumbnailImage($im_out, $time, $options): ?string {

		if(isset($options['png2jpeg'])){

			$outfile=TEMP_DIR.$time.'.jpg.tmp';//一時ファイル
			ImageJPEG($im_out, $outfile,98);

		} elseif(isset($options['png2webp'])){

			if(function_exists("ImageWEBP")){
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
