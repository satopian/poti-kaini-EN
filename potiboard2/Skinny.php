<?php
//パーミッションの値を設定できるようにした。初期値を 0777→0707 0666→0606 に。
//変更者 https://pbbs.sakura.ne.jp/poti/
/**
 *  Skinny  - One File Simple Template Engine over PHP -
 *  
 *  Skinnyは、実務レベルに耐え得る機能を持ち「シンプルであること」を
 *  コンセプトとした、１ファイルの高速テンプレートエンジンです。
 *  
 *  @Author     Junichi Sasaki (HandleName:Kuasuki) 
 *  @Copyright  Junichi Sasaki
 *  @Version    0.4.4   2019/10/17
 *  
 *  
 *  2010/01/22  0.0.1   シンプルで設置しやすい１ファイルのTEとして作成。（echo/val/print/dval/if/else/def/elsedef/each)
 *                      出力タグは出来るだけ増やしたくないので、Web製作に必要な機能をサマライズして実装する
 *  2010/01/23          Skinnyと命名。（LatexyとかSexyにしようと思ったけど、テンプレート＝スキンなので）
 *  2010/01/25  0.0.2   動作設定用のコンフィグ設定を先頭に追加。（ユーザーはここだけ触るように）
 *                      文字コードの自動変換設定と処理を追加
 *  2010/01/28  0.0.3   var/variable/even/ifeven/elseeven/calc/vcalc/external/include/plugin タグの追加
 *                      ベンチマーク設定と処理を追加
 *                      キャッシュ機能追加
 *  2010/01/29  0.0.4   external/includeタグの事前展開処理を変更。（３割程処理速度向上）
 *              0.0.4b  所々でエラーログを吐くようにした
 *  2011/02/25  0.0.4c  キャッシュとエラーログのパーミッションを 0777 に設定するようにした
 *  2011/02/26  0.0.5   echoタグにnumberオプション追加（number_format）
 *  2011/03/01  0.0.6   elseifタグ追加
 *  2011/03/08  0.0.7   コメントタグ削除、ホワイトスペース削除フィルタの追加
 *  2012/05/07  0.1.0   AutoPrependの対応。Ver0.1.0として公開
 *  2013/01/22  0.1.1   dvalタグ拡張
 *  2013/06/25  0.1.2   echoタグ拡張（rquoteの追加）
 *  2013/06/26  0.1.5   for/ifsタグ追加
 *  2013/07/05  0.1.6   forの指定回数を絶対値として取るようにした
 *  2013/07/18  0.2.0   externalタグの連続呼び出しを可能にするオプション追加（デフォルトOFF）
 *  2013/07/18  0.2.1   SkinnyDisplay/SkinnyFetchHTML/SkinnyFetchCache に第３パラメータを追加
 *  2013/07/24  0.2.2   ETERNAL_CALLBACK⇒EXTERNAL_CALLBACKに修正...
 *  2013/07/24  0.3.0   echoの配列名指定に@指定子追加（ echo(@list/users/name) とする事で $out['list']['users']['name'] を直接対象にする）
 *  2013/07/24  0.3.1   keach / kechoタグ追加
 *  2015/04/03  0.3.2   参照渡しの名残でfatalが出ていた部分を修正
 *  2016/06/20  0.3.3   テンプレートの保存ベースDIRを指定可能にした（$skConf['TEMPLATE']['BASEDIR']）
 *  2017/07/21  0.4.0   PHP7対応、externalタグの不具合修正、echoの短縮表記を追加、終了タグの共通短縮表記追加
 *  2017/07/30  0.4.1   echo修飾子の大幅追加「urld、rurld、strrev、width、substr、strcut、kana、date、week」、calcの別名varcalcを追加、pluginの別名plgを追加、予約タグ「vcopy、varcopy、replace」を指定、
 *  2019/06/26  0.4.2   replace タグを追加
 *  2019/07/17  0.4.3   orif/orifs/andif/andifs タグを追加
 *  2019/10/01  0.4.4   externalタグでnoticeが発生していた箇所の修正
 *  
 */

$skConf = array();   // Skinny設定情報格納配列

/**************************************  Skinny config  **************************************/

//パーミッション設定(項目追加者 https://pbbs.sakura.ne.jp/poti/)

define('SKINNY_PERMISSION_FOR_DIR', 0707);//初期値 0707
define('SKINNY_PERMISSION_FOR_CACHE', 0707);//初期値 0707
define('SKINNY_PERMISSION_FOR_ERRORLOG', 0606);//初期値 0606

// 文字エンコード関連
$skConf['ENCODE']['FLG']      = false;      // 自動文字エンコード変換の利用      [true]:する  false:しない
$skConf['ENCODE']['INTERNAL'] = 'UTF-8';    // PHPの文字エンコード（このファイル含む）（"ASCII/JIS/UTF-8/EUC-JP/SJIS-win"）
$skConf['ENCODE']['TEMPLATE'] = 'UTF-8';    // スキンファイルの文字エンコード         （"ASCII/JIS/UTF-8/EUC-JP/SJIS-win"）
$skConf['ENCODE']['EXTERNAL'] = 'UTF-8';    // 出力するHTMLの文字エンコード           （"ASCII/JIS/UTF-8/EUC-JP/SJIS-win"）

// テンプレート関連
$skConf['TEMPLATE']['BASEDIR']= '';         // テンプレートを保存するベースディレクトリ（特に指定がなければ空文字）
                                            // externalタグはここで指定した場所から相対で参照します

// キャッシュ関連
$skConf['CACHE']['FLG']       = true;      // スキンキャッシュの利用    [true]:する  false:しない
$skConf['CACHE']['DIR']       = './cache';  // キャッシュの生成先DIR （出来ればフルパスで。相対だとアチコチに作られるかも）
$skConf['CACHE']['ALIVETIME'] = 86400;       // キャッシュの有効時間（秒）

// 画面表示関連
$skConf['DISP']['ERRORS']     = false;       // エラーの画面出力      [true]:する   false:しない
$skConf['DISP']['BENCHMARK']  = false;      // ベンチマーク結果表示  [true]:する   false:しない

// ログ関連
$skConf['ERRORLOG']['FLG']    = false;      // エラーログを出力      [true]:する   false:しない
$skConf['ERRORLOG']['DIR']    = './logs';   // エラーログ出力先DIR

// プラグイン
$skConf['PLUGIN']['FLG']      = true;       // プラグイン機能の利用  [true]:する   false:しない
$skConf['PLUGIN']['DIR']      = './plugin'; // プラグインのPHPファイル置き場

// 出力時に余計な文字を削除するフィルタ設定
$skConf['DISP']['COM_DELETE'] = 0;          // 出力時にHTMLコメント'<!-- ～ -->' を取り除く [0]:そのまま  1:取り除く
$skConf['DISP']['TAB_DELETE'] = 1;          // 出力時にタブコード '\t' を取り除く           [0]:そのまま  1:取り除く
$skConf['DISP']['RET_DELETE'] = 1;          // 出力時に連続した改行 '\n' を取り除く         [0]:そのまま  1:複数改行を1つにまとめる  2:改行を全て取り除く

// 基本設定
$skConf['SKINNY']['OPENTAG']  = '<%';       // Skinnyのオープンタグ文字列  smartyっぽく'{'と'}'とか使うとCSSやJSの中を書き換える時に困るよ!!
$skConf['SKINNY']['CLOSETAG'] = '%>';       // Skinnyのクローズタグ文字列  smartyっぽく'{'と'}'とか使うとCSSやJSの中を書き換える時に困るよ!!
$skConf['SKINNY']['MAILAT']   = ' [AT] ';   // mail修飾子利用時に、'@'を置き換える文字(列)   default: [AT] 
$skConf['SKINNY']['MAILDOT']  = ' [DOT] ';  // mail修飾子利用時に、'.'を置き換える文字(列)   default: [DOT] 

$skConf['EXTERNAL_CALLBACK'] = false;       // タグの置換を永久に行うか（externalの連続呼び出しが可能になりますが永久ループにご注意ください）


/*** 以下configは実験用 ***/

// Skinny自動実行
$skConf['SKINNY']['AUTOEXEC'] = false;      // php_value auto_prepend_file "Skinny.php" にて自動実行するか  true:する  [false]:しない
                                            // この設定をtrueにした場合、スキンファイルへのアクセスで自動でSkinnyが実行され、
                                            // _autoPrependFuncion()の結果を元にSkinnyDisplayが走ります。

/*************************************  /Skinny config  **************************************/




/**************************************  PHP setting  ****************************************/
//
//  自分の利用環境に合わせて設定してください。
//  PHPのバージョンアップに伴い書式や推奨度合いがどんどん変更されていくので、
//  Skinny内に書くよりは、.htaccessやphp.iniに記述した方が良いかも知れません。
//
ini_set( 'display_errors'  , $skConf['DISP']['ERRORS']?'1':'0' );
ini_set( 'error_reporting' , E_ALL );
ini_set( 'short_open_tag', 0 );
ini_set( 'magic_quotes_gpc', 'off' );

// 不要ならこの部分は消しても構わない
#ini_set('mbstring.internal_encoding', $skConf['ENCODE']['INTERNAL'] );
mb_internal_encoding( $skConf['ENCODE']['INTERNAL'] );
mb_regex_encoding( $skConf['ENCODE']['INTERNAL'] );

#php_value mbstring.http_input pass
#mb_http_input();  // type get only...
#php_value mbstring.http_output pass
mb_http_output("pass");

#php_value mbstring.encoding_translation 1
#php_value session.use_trans_sid 1
#php_value magic_quotes_gpc off
#php_value short_open_tag off


ini_set('mbstring.detect_order', 'auto');
ini_set('default_charset', $skConf['ENCODE']['INTERNAL']);

/**************************************  /PHP setting  ***************************************/





## ─────────────────────────────────────
##                                                                           
##             ///////  //        //                                         
##           //        //   //       //////    //////    //    //            
##          ////////  // ///    //  //    //  //    //  //    //             
##               //  //// //   //  //    //  //    //    //////              
##        ///////   //    //  //  //    //  //    //        //               
##                                                    /////                  
##        One File Simple Template Engine over PHP                           
##                                                                           
## ─────────────────────────────────────

// キャッシュ利用時にキャッシュフォルダを自動生成する
if($skConf['CACHE']['FLG'] && (!file_exists($skConf['CACHE']['DIR']) || (file_exists($skConf['CACHE']['DIR']) && !is_dir($skConf['CACHE']['DIR'])))) {
	@mkdir( $skConf['CACHE']['DIR'] , SKINNY_PERMISSION_FOR_DIR );
	@chmod( $skConf['CACHE']['DIR'] , SKINNY_PERMISSION_FOR_DIR );
}

// エラーログ利用時にログフォルダを自動生成する
if($skConf['ERRORLOG']['FLG'] && (!file_exists($skConf['ERRORLOG']['DIR']) || (file_exists($skConf['ERRORLOG']['DIR']) && !is_dir($skConf['ERRORLOG']['DIR'])))) {
	@mkdir( $skConf['ERRORLOG']['DIR'] , SKINNY_PERMISSION_FOR_DIR );
	@chmod( $skConf['ERRORLOG']['DIR'] , SKINNY_PERMISSION_FOR_DIR );
}



/*
   [簡単なコーディング規約]

      クラスメソッド名 :
        -  ユーザーにより、外部のPHPから呼ばれるもの ⇒ 'Skinny' を先頭に付ける（例：SkinnyDisplay / SkinnyFetchCache / SkinnyFetchHTML）
        -  Skinny内部の処理でのみ使用しているもの    ⇒ '_sk' を先頭に付ける
        -  Skinny内部からしか使わないがグローバル定義しているもの ⇒ '_skGlobal_' を先頭に付ける

      置換タグメソッド :
        -  '_skTags_' を先頭に付け、続いてタグ名を記述する（例：_skTags_echo）

      外部プラグイン :
        -  'skPlugin_'を先頭に付ける。（プラグインファイル、メソッド名共通）

*/


/**
 *  Skinny class
 *  
 *  @package  net.sx68.skinny
 *  @access   public
 *  @author   Kuasuki  <kuasuki@sx68.net>
 *  
 */
class Skinny {

	// 設定保持用
	var $skConf;

	// 変数保持用
	var $skLoopCount;

	// キャッシュ利用したかどうか（true:した / false:してない）※ベンチマーク表示用にしか使ってない
	var $cacheUsing = false;

	// 指定SKINファイル
	var $skinFile = null;


	function __construct() {
		clearStatCache();
		
		global $skLoopCount;						// スキン展開用配列
		$this->skLoopCount = $skLoopCount;			// 
		
		global $skConf;								// コンフィグ情報保持
		$this->skConf = $skConf;					// 
		
		$this->_skStartTime = _get_microtime();		// ベンチ用に時間を取得
	}


	/**
	 *  ベンチマーク
	 */
	private function _skBenchMarkTime( $str = '' ) {
		if ( $this->skConf['DISP']['BENCHMARK'] ) {
			$exectime = _get_microtime() - $this->_skStartTime;
			return "<br /><br />{$str} " . $exectime . ($this->cacheUsing?'(Sec:onCache)':'(Sec:newCreate)');
		}
		return '';
	}


	/**
	 *  エラーログ
	 */
	private function _skErrorLog( $str = null ) {
		if ( $this->skConf['ERRORLOG']['FLG'] && is_dir($this->skConf['ERRORLOG']['DIR']) ) {
			if ( $str != null ) {
				$error_message = date('Y-m-d H:i:s') . "\t" . $str . "\n";
				$error_logfile = $this->skConf['ERRORLOG']['DIR'] . "/errorlog_" . date('Ymd') . ".log";
				error_log( $error_message, 3, $error_logfile );
				chmod( $error_logfile, SKINNY_PERMISSION_FOR_ERRORLOG );
				return true;
			}
		}
		return false;
	}



	//===============================================================================================
	//  タグ別条件分岐
	//===============================================================================================

	/**
	 *  タグ内の余計な空白を削除
	 *  ※ この方法だとif/ifsにしか効果ないな…
	 */
	private function _sfTagValueTrims( $tags ) {
		$arr = explode( "," , $tags );
		foreach ( $arr as $val ) {
			$val = trim( $val );
		}
		return implode( "," , $arr );
	}


	/**
	 *  externalタグの中身を先に展開
	 */
	public function _sfExternalParseSkin( $str ) {
		return $this->_skTags_external( trim($str[2],' ()\'"') );
	}


	/**
	 *  タグ別のパース処理
	 */
	public function _sfParseSkin( $str, $type = null ){
		
		$str = trim( $str[1] );
		
		if ( substr( $str, 0, 1) == '/' ) {
			/* '/'で始まるタグは無条件で終了タグ（PHPの閉じ括弧）とみなす (v0.4.0以降) */
			return $this->_skTags_close();
			list( $com ) = explode( '(', $str );
			$prm = '';
		} else {
			/* タグとパラメータの分離 */
			@list( $com, $prm ) = explode( '(', $str );
		}
		
		$com = trim( strtolower( $com ) );      // チェック用に小文字で統一
		list( $prm, ) = explode( ')', $prm );   // パラメータ部取り出し
		$prm = $this->_sfTagValueTrims( $prm ); // パラメータ内の不要な空白除去
		
		// 分岐
		//   $funcname = '_skTags_'.$com;
		//   return $funcname($prm);
		//   こうすると困るタグあるので敢えてswitch分岐で。externalだけ分けるとかヤダし。
		switch ( $com ) {
			case '%':			/*  <%% (hogehoge) %%> と <% echo(hogehoge) %> この書式は同じです (v0.4.0以降) */
			case 'echo':		return $this->_skTags_echo( $prm );		break;
			
			case 'dval':		return $this->_skTags_dval( $prm );		break;
			case 'each':		return $this->_skTags_each( $prm );		break;
			case 'for':			return $this->_skTags_for( $prm );		break;
			
			case 'keach':		return $this->_skTags_keach( $prm );	break;
			case 'kecho':		return $this->_skTags_kecho( $prm );	break;
			
			case 'if':			return $this->_skTags_if( $prm );		break;
			case 'elseif':		return $this->_skTags_elseif( $prm );	break;
			
			case 'ifs':			return $this->_skTags_ifs( $prm );		break;
			case 'elseifs':		return $this->_skTags_elseifs( $prm );	break;
			
			case 'andif':		return $this->_skTags_andif( $prm );	break;
			case 'andifs':		return $this->_skTags_andifs( $prm );	break;
			
			case 'orif':		return $this->_skTags_orif( $prm );		break;
			case 'orifs':		return $this->_skTags_orifs( $prm );	break;
			
			case 'def':
			case 'ifdef':
			case 'defined':		return $this->_skTags_def( $prm );		break;
			
			case 'even':
			case 'ifeven':		return $this->_skTags_ifeven( $prm );	break;
			
			case 'var' :
			case 'variable' :	return $this->_skTags_var( $prm );		break;
			
			case 'calc':
			case 'vcalc':
			case 'varcalc':		return $this->_skTags_calc( $prm );		break;
			
			case 'replace':		return $this->_skTags_replace( $prm );	break;
			
			case 'plg':
			case 'plugin':		return $this->_skTags_plugin( $prm );	break;
			
			case 'elseeven':	//これは将来的に仕様が変わるか無くすかも
			case 'elsedef':		//これは将来的に仕様が変わるかも
			case 'else':		return $this->_skTags_else();			break;
			
			case 'external':	if ( $this->skConf['EXTERNAL_CALLBACK'] ) return $this->_skTags_external( $prm );	break;
			
			case '/each':
			case '/for':
			case '/keach':
			case '/if':
			case '/ifs':
			case '/orif':
			case '/orifs':
			case '/andif':
			case '/andifs':
			case '/def':
			case '/ifdef':
			case '/defined':
			case '/even':
			case '/ifeven':
								return $this->_skTags_close();			break;
/* reserved
			case 'vcopy':
			case 'varcopy':		return $this->_skTags_varcopy( $prm );	break;
*/
			
			default:
					// $this->_skErrorLog( "Undefined tag was used. [{$com}]" );
					return '';		// コメント扱い
			
		}
	}



	//===============================================================================================
	//  スキンタグ
	//===============================================================================================


	/**
	 *  ループカウンタ
	 */
	private function _skTags_LoopCounter( $vals ){
		if ( substr($vals[0],0,1) != "@" ) {
			$vals_loop = '';
			$variable_name = '$skOutput';
			$cnt = 0;
			$cnt_join = count($vals)-1;
			foreach ( $vals as $val ) {
				$vals_loop .= '/' . $val;
				if ( isset($this->skLoopCount["$vals_loop"]) == false ) {
					$this->skLoopCount["$vals_loop"]=0;
				}
				if ( $cnt < $cnt_join ) {
					/* SkinTag_each()の変更でココも変更 */
					$variable_name .= "[\"".$val."\"][\$skLoopCount[\"$vals_loop\"]]";
				} else {
					$variable_name .= "[\"".$val."\"]";
				}
				$cnt++;
			}
			return $variable_name;
		} else {
			$variable_name = '$skOutput';
			$vals[0] = substr( $vals[0],1);
			foreach ( $vals as $val ) {
				$variable_name .= '[\'' . $val . '\']';
			}
			return $variable_name;
		}
	}


	/**
	 *  ifタグ
	 */
	private function _skTags_if( $tag ){
		list( $variable , $comp , $str ) = explode( ',' , $tag );
		$vals = explode('/',$variable);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		$add_src = "<?php if($variable_name $comp $str) { ?>";
		return $add_src;
	}


	/**
	 *  elseifタグ
	 */
	private function _skTags_elseif( $tag ){
		list( $variable , $comp , $str ) = explode( ',' , $tag );
		$vals = explode('/',$variable);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		$add_src = "<?php }elseif($variable_name $comp $str) { ?>";
		return $add_src;
	}


	/**
	 *  ifsタグ
	 */
	function _skTags_ifs( $tag ) {
		list( $variable , $comp , $variable2 ) = explode( ',' , $tag );
		$variable_name  = $this->_skTags_LoopCounter( explode('/',$variable) );
		$variable_name2 = $this->_skTags_LoopCounter( explode('/',$variable2) );
		$add_src = "<?php if($variable_name $comp $variable_name2){ ?>";
		return $add_src;
	}


	/**
	 *  elseifsタグ
	 */
	function _skTags_elseifs( $tag ) {
		list( $variable , $comp , $variable2 ) = explode( ',' , $tag );
		$variable_name = $this->_skTags_LoopCounter( explode('/',$variable) );
		$variable_name2 = $this->_skTags_LoopCounter( explode('/',$variable2) );
		$add_src = "<?php }elseif($variable_name $comp $variable_name2){ ?>";
		return $add_src;
	}


	/**
	 *  orifタグ
	 */
	function _skTags_orif( $tag ) {
		$src_c = '';
		$src_a = array();
		$ope   = " OR ";
		
		$val_split = explode( '|', $tag );
		foreach ( $val_split as $t ) {
			list( $variable, $comp, $str ) = explode( ',' , trim($t) );
			$variable_name = $this->_skTags_LoopCounter( explode('/',$variable) );
			$src_c  .= "if(isset($variable_name)===false){ $variable_name=null; }\n";
			$src_a[] = "($variable_name $comp $str)";
		}
		$src  = "<?php\n" . $src_c . "?>\n";
		$src .= "<?php if("  . implode($ope,$src_a) . "){ ?>\n";
		return $src;
	}



	/**
	 *  andifタグ
	 */
	function _skTags_andif( $tag ) {
		$src_c = '';
		$src_a = array();
		$ope   = " AND ";
		
		$val_split = explode( '|', $tag );
		foreach ( $val_split as $t ) {
			list( $variable, $comp, $str ) = explode( ',' , trim($t) );
			$variable_name = $this->_skTags_LoopCounter( explode('/',$variable) );
			$src_c  .= "if(isset($variable_name)===false){ $variable_name=null; }\n";
			$src_a[] = "($variable_name $comp $str)";
		}
		$src  = "<?php\n" . $src_c . "?>\n";
		$src .= "<?php if("  . implode($ope,$src_a) . "){ ?>\n";
		return $src;
	}


	/**
	 *  orifsタグ
	 */
	function _skTags_orifs( $tag ) {
		$src_c = '';
		$src_a = array();
		$ope   = " OR ";
		
		$val_split = explode( '|', $tag );
		foreach ( $val_split as $t ) {
			list( $variable, $comp, $variable2 ) = explode( ',' , trim($t) );
			$variable_name = $this->_skTags_LoopCounter( explode('/',$variable)  );
			$variable_name2= $this->_skTags_LoopCounter( explode('/',$variable2) );
			$src_c  .= "if(isset($variable_name) ===false){ $variable_name =null; }\n";
			$src_c  .= "if(isset($variable_name2)===false){ $variable_name2=null; }\n";
			$src_a[] = "($variable_name $comp $variable_name2)";
		}
		$src  = "<?php\n" . $src_c . "?>\n";
		$src .= "<?php if("  . implode($ope,$src_a) . "){ ?>\n";
		return $src;
	}



	/**
	 *  andifsタグ
	 */
	function _skTags_andifs( $tag ) {
		$src_c = '';
		$src_a = array();
		$ope   = " AND ";
		
		$val_split = explode( '|', $tag );
		foreach ( $val_split as $t ) {
			list( $variable, $comp, $variable2 ) = explode( ',' , trim($t) );
			$variable_name = $this->_skTags_LoopCounter( explode('/',$variable)  );
			$variable_name2= $this->_skTags_LoopCounter( explode('/',$variable2) );
			$src_c  .= "if(isset($variable_name) ===false){ $variable_name =null; }\n";
			$src_c  .= "if(isset($variable_name2)===false){ $variable_name2=null; }\n";
			$src_a[] = "($variable_name $comp $variable_name2)";
		}
		$src  = "<?php\n" . $src_c . "?>\n";
		$src .= "<?php if("  . implode($ope,$src_a) . "){ ?>\n";
		return $src;
	}


	/**
	 *  varの中の文字列を置換する
	 */
	function _skTags_replace( $tag ) {
		list($newvar, $pattern, $replaced, $variable ) = explode( ',' , $tag );
		
		$newvar   = trim($newvar);
		$variable = trim($variable);
		$pattern  = trim($pattern);
		$replaced = trim($replaced);
		
		// ここに置換後を戻す
		$newvar_name = $this->_skTags_LoopCounter( explode('/',$newvar) );
		// パターン
		if ( $pattern == trim($pattern,"'\"") ) {
			$pattern_name = $this->_skTags_LoopCounter( explode('/',$pattern) );
		}else{
			$pattern_name = $pattern;
		}
		// 置換後
		if ( $replaced == trim($replaced,"'\"") ) {
			$replaced_name = $this->_skTags_LoopCounter( explode('/',$replaced) );
		}else{
			$replaced_name = $replaced;
		}
		// 置換元
		if ( $variable == trim($variable,"'\"") ) {
			$variable_name = $this->_skTags_LoopCounter( explode('/',$variable) );
		}else{
			$variable_name = $variable;
		}
		
		$src = "<?php $newvar_name = str_replace( $pattern_name, $replaced_name, $variable_name ); ?>";
		return $src;
	}


	/**
	 *  elseタグ
	 */
	private function _skTags_else() {
		return "<?php }else{ ?>";
	}


	/**
	 *  closeタグ
	 */
	private function _skTags_close() {
		return "<?php } ?>";
	}


	/**
	 *  exitタグ（使うか？ exitが必要になるテンプレートを書くなって話ですよ）
	 */
	private function _skTags_exit() {
		return '<?php exit; ?>';
	}


	/**
	 *  ifevenタグ：指定の変数値が指定値で割り切れるか判定する
	 *  ex) ifeven(var,4) ⇒ varが4で割り切れる場合に /ifeven までを実行
	 */
	private function _skTags_ifeven( $tag ) {
		list( $tags, $num ) = explode( ',' , $tag );
		$vals = explode( '/' , $tags );
		$variable_name = $this->_skTags_LoopCounter( $vals );
		return "<?php if ($variable_name % $num === 0 ) { ?>";
	}


	/**
	 *  defタグ：指定変数が定義（または true / 配列1以上）か判定する
	 *  ex) def(argument) ⇒ argumentが true / 1文字以上 / array_count1以上の場合に /def までを実行
	 */
	private function _skTags_def( $tag ){
		$vals = explode('/',$tag);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		$src ="<?php\n";
		$src.="  if( !isset($variable_name) ){ $variable_name=null;}\n";
		$src.="  if( (!is_array($variable_name) and strlen($variable_name)!==0) or (is_array($variable_name) and count($variable_name)!==0) ) {\n";
		$src.="?>";
		return $src;
	}


	/**
	 *  eachタグ：DBレコード形式の２次元配列をレコード単位でループする
	 *  ex) each(list) ⇒ list0～nn までを繰り返す。 echo(list/xxxx) でカラム単位にアクセス可能となる
	 */
	private function _skTags_each( $tag ) {
		
		$vals = explode('/',$tag);
		$vals_loop = '';
		$variable_name = '$skOutput';
		
		$cnt = 0;
		$cnt_join = count($vals) - 1;
		foreach ($vals as $val) {
			$vals_loop.='/'.$val;
			if( isset($this->skLoopCount["$vals_loop"])===false ){
				$this->skLoopCount["$vals_loop"]=0;
			}
			
			if($cnt < $cnt_join ) {
				$variable_name.="['".$val."'][\$skLoopCount['$vals_loop']]";
			} else {
				$variable_name.="['".$val."']";
			}
			$cnt++;
		}
		
		$chk_value = '$skLoopCount["'.$vals_loop.'"]';
		$src = "<?php if( !isset(".$chk_value.") ){ ".$chk_value."=0; } \n";
		$src.= " if(!isset($variable_name)){ $variable_name=array(); } \n";
		$src.= " for(\$skLoopCount[\"$vals_loop\"]=0; \$skLoopCount[\"$vals_loop\"] < count($variable_name); \$skLoopCount[\"$vals_loop\"]++){ ?>";
		return $src;
	}


	/**
	 *  keachタグ：foreach( $argument as $k => $v ) と同等のループを行う
	 *  ex) <% keach(list) %>
	 *          キーは「<% kecho(KEY) %>」
	 *          内容は「<% kecho(VAL) %>」
	 *                「<% kecho(VAL|strip|nl2br) %>」のようにecho修飾子も同様に使えます
	 *      <% /keach %>
	 */
	private function _skTags_keach( $tag ) {
		$vals = explode( '/', $tag );
		
		$val_list = '';
		$variable_name = '$skOutput';
		$valiable_k_name = '$skOutput[\'KEY\']';
		$valiable_v_name = '$skOutput[\'VAL\']';
		foreach ( $vals as $val ) {
			$val_list .= '/' . $val;
			$variable_name .= '[\'' . $val . '\']';
		}
		$src  = '<?php $MAIN_SKIN_EACH=array(); ?>';
		$src .= '<?php foreach('.$variable_name.' as '.$valiable_k_name.'=>'.$valiable_v_name.' ){ ?>';
		return $src;
	}


	/**
	 *  kechoタグ：foreach( $argument as $k => $v ) ループの key か value を出力する
	 *  ex) <% keach(list) %>
	 *          キーは「<% kecho(KEY) %>」
	 *          内容は「<% kecho(VAL) %>」
	 *                「<% kecho(VAL|strip|nl2br) %>」のようにecho修飾子も同様に使えます
	 *      <% /keach %>
	 */
	private function _skTags_kecho( $tag ) {
		$valiable_k_name = '$skOutput[\'KEY\']';
		$valiable_v_name = '$skOutput[\'VAL\']';
		
		if ( strpos( $tag, '|' ) ) {
			$par = explode( '|', $tag );
			$command = strtolower( $par[0] );
			$vals = explode( '/', trim(array_shift($par)) );
			if ( $command == 'key' ) {
				$variable_name = $valiable_k_name;
			} else {
				$variable_name = $valiable_v_name;
			}
			foreach ( $par as $mod ) {
				$variable_name = $this->modifier_escape_over_smarty( $variable_name, trim($mod) );
			}
			return "<?php echo $variable_name; ?>";
		} else {
			if ( strtolower($tag) == 'key' ) {
				return '<?php echo ' . $valiable_k_name . ';?>';
			} else {
				return '<?php echo ' . $valiable_v_name . ';?>';
			}
		}
		
	}


	/**
	 *  forタグ
	 */
	function _skTags_for( $tag ) {
		$vals = explode('/',$tag);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		$var = '$_'.md5($variable_name);
		$src = "<?php if(isset($variable_name)===false) $variable_name=0; ?>";
		$src.= "<?php for($var=0; $var < abs(intval($variable_name)); $var++ ) { ?>";
		return $src;
	}


	/**
	 *  skin tags echo : modifier designate tag
	 *       modifiers : nl2br escape strip lower upper
	 *  @access  Private
	 *  @param   String   $tag   skin tag
	 *  @return  String   sorce  code
	 */
	private function _skTags_echo( $tag ) {
		$ret = '';
		if ( strpos( $tag, '|' ) ) {
			$par = explode( '|', $tag );
			$vals = explode( '/', trim(array_shift($par)) );
			$variable_name = $this->_skTags_LoopCounter( $vals );
			foreach ( $par as $mod ) {
				$variable_name = $this->modifier_escape_over_smarty( $variable_name, trim($mod) );
			}
		} else {
			$vals = explode( '/', $tag );
			$variable_name = $this->_skTags_LoopCounter( $vals );
		}
		return "<?php echo $variable_name; ?>";
	}


	/**
	 *  Smartyのescapeに準拠
	 */
	private function modifier_escape_over_smarty( $string, $esc_type='html', $char_set=NULL ) {
		if ( $char_set == NULL ) { $char_set = $this->skConf['ENCODE']['INTERNAL']; }
		switch ( $esc_type ) {
			case 'upper':
			case 'toupper':
			case 'strtoupper':
				return "strtoupper($string)";
				
			case 'lower':
			case 'tolower':
			case 'strtolower':
				return "strtolower($string)";
				
			case 'strip':
			case 'strip_tags':
				return "strip_tags($string)";
				
			case 'br':
			case 'nl2br':
				return "nl2br($string)";
				
			case 'html':
			case 'htmlspecialchars':
				return "htmlspecialchars($string,ENT_QUOTES,'$char_set')";
				
			case 'htmlall':
			case 'htmlentities':
				return "htmlentities($string,ENT_QUOTES,'$char_set')";
				
			case 'url':
			case 'urlencode':
				return "rawurlencode($string)";
				
			case 'urld':
			case 'urldecode':
				return "urldecode($string)";
				
			case 'rurl':
			case 'rawurlencode':
				return "rawurlencode($string)";
				
			case 'rurld':
			case 'rawurldecode':
				return "rawurldecode($string)";
				
			case 'urlpathinfo':
				return "str_replace('%2F','/',rawurlencode($string))";
				
			case 'quotes':
				// escape unescaped single quotes
				return "preg_replace(\"%(?<!\\\\\\\\)'%\", \"\\\\'\", $string)";
				
			case 'hex':
				// escape every character into hex
				/* 実装予定無し
				$return = '';
				for ($x=0; $x < strlen($string); $x++) {
					$return .= '%' . bin2hex($string[$x]);
				}
				return $return;
				*/
				$this->_skErrorLog( "Undefined escape modifier was used. [{$esc_type}]" );
				return $string;
				
			case 'hexentity':
				/* 実装予定無し
				$return = '';
				for ($x=0; $x < strlen($string); $x++) {
					$return .= '&#x' . bin2hex($string[$x]) . ';';
				}
				return $return;
				*/
				$this->_skErrorLog( "Undefined escape modifier was used. [{$esc_type}]" );
				return $string;
				
			case 'decentity':
				/* 実装予定無し
				$return = '';
				for ($x=0; $x < strlen($string); $x++) {
					$return .= '&#' . ord($string[$x]) . ';';
				}
				return $return;
				*/
				$this->_skErrorLog( "Undefined escape modifier was used. [{$esc_type}]" );
				return $string;
				
			case 'javascript':
				// escape quotes and backslashes, newlines, etc.
				return "strtr($string, array('\\'=>'\\\\',\"'\"=>\"\\'\",'\"'=>'\\\"',\"\r\"=>'\\r',\"\n\"=>'\\n','</'=>'<\/'))";
				
			case 'mail':
				/* 使った事無いんだけど要るこれ？ｗ */
				// safe way to display e-mail address on a web page
				$at = $this->skConf['SKINNY']['MAILAT'];
				$dot= $this->skConf['SKINNY']['MAILDOT'];
				return "str_replace(array('@', '.'),array('{$at}', '{$dot}'), $string)";
				
			case 'nonstd':
				// escape non-standard chars, such as ms document quotes
				/* 実装予定無し
				$_res = '';
				for($_i = 0, $_len = strlen($string); $_i < $_len; $_i++) {
					$_ord = ord(substr($string, $_i, 1));
					// non-standard char, escape it
					if($_ord >= 126){
						$_res .= '&#' . $_ord . ';';
					}else {
					   $_res .= substr($string, $_i, 1);
					}
				}
				return $_res;
				*/
				$this->_skErrorLog( "Undefined escape modifier was used. [{$esc_type}]" );
				return $string;
				
				
			/** ここからSkinny独自のエスケープ */
				
			case 'nbsp':
			case 'space':
				return "str_replace(' ', '&nbsp;', $string)";
				
			case 'number':
			case 'number_format':
				return "number_format($string)";
				
			case 'ahref':
			case 'link':
				return 'preg_replace(\'/(https?)(:\\/\\/[-_.!~*\\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+)/\', \'<a href="\\\\1\\\\2">\\\\1\\\\2</a>\','.$string.')';
				//return 'ereg_replace("http://[^<>[:space:]]+[[:alnum:]/]",\'<a href="\\0">\\0</a>\','.$string.')';
				
			case 'rquote':
				// form input value escape
				return "str_replace('\"', '&quot;', $string)";
				
			case 'strrev':
			case 'reverse':
				return "_skGlobal_mb_strrev($string)";
				
			default:
				
				/**
				 * 半角文字を1、全角文字を2として文字数カットを行う
				 * width[s,n]   s文字目からn長で切り出す
				 */
				if ( preg_match("/^width\[([0-9]+),([0-9]+)\]$/",$esc_type,$mc) ) {
					return "strlen($string)<={$mc[1]} ? $string : mb_strimwidth($string,{$mc[1]},{$mc[2]})";
				}
				
				
				/**
				 * 文字単位で文字列カットを行う
				 * substr[s,n]   s:0以上の数値
				 */
				if ( preg_match("/^substr\[([-,0-9]+)\]$/",$esc_type,$mc) ) {
					return "mb_substr($string,{$mc[1]})";
				}
				
				
				/**
				 * バイト単位で文字列カットを行う
				 * strcut[s,n]   n:0以上の数値
				 */
				if ( preg_match("/^strcut\[([-,0-9]+)\]$/",$esc_type,$mc) ) {
					return "mb_strcut($string,{$mc[1]})";
				}
				
				
				/**
				 * 文字のカナ変換を行う
				 * kana['option']
				 * mb_convert_kana( $string , option ); と同義
				 */
				if ( preg_match("/^kana\[(.+)\]$/",$esc_type,$mc) ) {
					return "mb_convert_kana({$string},{$mc[1]})";
				}
				
				
				/**
				 * 日付形式を変換する
				 * date['format'] : date(format,$date) と同義（unixtimestamp以外に strtotimeが通るもの全てが対象）
				 * dval同等
				 */
				if ( preg_match("/^date\[(.+)\]$/",$esc_type,$mc) ) {
					return "date({$mc[1]},((is_numeric($string))?$string:strtotime($string)))";
				}
				
				
				/**
				 * 日付形式（or UNIXTIME）から日本語の曜日へ変換する
				 * week : 日～土の全角文字に変換する
				 * dval同等
				 */
				if ( preg_match("/^week$/",$esc_type,$mc) ) {
					return "_skGlobal_mb_weekjp($string)";
				}
				
				return $string;
				
		}
	}


	/**
	 *  dvalタグ：指定されたUNIXTIME値を、指定の日付パターンで出力する
	 *  ver 0.4.1～ echoタグのdate修飾子に互換機能を実装。
	 *  ex) dval(val,'Y-m-d H:i') ⇒ valの内容を'Y-m-d H:i'形式で出力
	 */
	private function _skTags_dval( $tag ){
		list($tags,$outputFormat)=explode(',',$tag);
		$outputFormat = trim( $outputFormat, '\'"' );
		$vals = explode('/',$tags);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		$src = "<?php \$_DTTM_ = (is_numeric($variable_name)==true) ? $variable_name : strtotime($variable_name);";
		return $src . " echo (\$_DTTM_ <= 0) ? '' : date('$outputFormat',\$_DTTM_); ?>";
	}


	/**
	 *  varタグ：スキン内変数宣言
	 *  ex) var(var,10) ⇒ var変数を値「10」として宣言
	 */
	private function _skTags_var( $tag ) {
		list($tags,$value) = explode( ',' , $tag );
		$vals = explode('/',$tags);
		$variable_name = $this->_skTags_LoopCounter( $vals );
		return "<?php $variable_name = $value; ?>";
	}


	/**
	 *  calcタグ：スキン内変数演算
	 *  ex) calc(var,+=,3) ⇒ varに3を足す
	 */
	private function _skTags_calc( $tag ) {
		list( $tags, $operator, $value ) = explode( ',' , $tag );
		$vals = explode( '/' , $tags );
		$variable_name = $this->_skTags_LoopCounter( $vals );
		return "<?php $variable_name $operator $value; ?>";
	}


	/**
	 *  externalタグ：別ファイルスキンの内容を展開する
	 *  ex) external('common.html') ⇒ common.html を指定場所に展開する
	 */
	function _skTags_external( $tag ) {
		if ( strpos( $tag, ',' ) === false ) {
			$tags = $tag;
			$_var = "false";
		} else {
			list( $tags, $_var) = explode( ',' , $tag );
		}
		$tags = trim($tags," \t\"'" );
		$_var = trim($_var," \t\"'" );
		@ob_end_clean();
		
# BASEDIRが設定されているかどうかは判定から外す！
#		if ( $this->skConf['TEMPLATE']['BASEDIR']!="" && strtolower(trim($_var))!="false" ) {
		if ( strtolower(trim($_var)) == "false" ) {
			$template_path = $tags;
		} else {
			$template_path = sprintf("%s/%s", rtrim($this->skConf['TEMPLATE']['BASEDIR'],'/'), ltrim($tags,'/') );
		}
		
		if ( is_file($template_path) ) {
			return file_get_contents( $template_path );
		}
		$this->_skErrorLog( "External file is not found. [{$template_path}]" );
		return "External file is not found. [{$template_path}]<br />";
	}


	/**
	 *  pluginタグ：ユーザー作成のタグを読み込み展開する
	 *  ex) plugin('makeMD5',list/id) ⇒ makeMD5.php内の makeMD5()に list/id の値を渡す
	 */
	private function _skTags_plugin( $tag ) {
		if ( $this->skConf['PLUGIN']['FLG'] ) {
			list( $plugin_name , $vars ) = explode( ',' , $tag, 2 );
			$plugin_name = trim($plugin_name," \t\n\"'");  // 空白とクォートを削除
			
			$variables = explode( ',', $vars );
			$arguments = '';
			foreach ( $variables as $v ) {
				$arguments .= $this->_skTags_LoopCounter( explode('/',$v) ) . ",";
			}
			$arguments = trim( $arguments, "," );
			$plugin_file = sprintf("%s/%s.php", rtrim($this->skConf['PLUGIN']['DIR'],'/'), ltrim($plugin_name,'/') );
			if ( is_file($plugin_file) ) {
				$src  = "<?php include_once( '{$plugin_file}' ); ";  // 毎度include_once出すのもなんかなぁ…
				$src .= " if(function_exists(\"$plugin_name\")) { echo $plugin_name($arguments); } ?>";
				return $src;
			} else {
				$this->_skErrorLog( "Plug-in file is not found. [{$plugin_file}]" );
				return "Plug-in file is not found. [{$plugin_file}]";
			}
		}
		return '';
	}



	//===============================================================================================
	//  キャッシュ機能関係のメソッド
	//===============================================================================================


	/**
	 *  キャッシュファイル名生成
	 */
	private function _skGetCacheFileMD5( $tpl = null ) {
		if ( $tpl == null ) {
			return false;
		}
		return md5( $_SERVER['SCRIPT_NAME'] . "/" . $tpl) . ".php";
	}


	/**
	 *  キャッシュの有効性チェック
	 */
	private function _skCheckCacheFile( $cache_name = null ) {
		if ( $this->skConf['CACHE']['FLG'] && file_exists($cache_name) && $this->_skCheckTTLCheck($cache_name) ) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 *  キャッシュの期間有効性チェック
	 */
	private function _skCheckTTLCheck( $cache_name = null ) {
		
		// 時間が0以下は作り直し
		if ( $this->skConf['CACHE']['ALIVETIME'] <= 0 ) {
			return false;
		}
		
		// キャッシュファイルが無い場合は作り直し
		if ( !is_file($cache_name) ) {
			return false;
		}
		
		// キャッシュファイル作成時が取得出来ない場合は作り直し
		$cftime = filemtime( $cache_name );
		if ( !$cftime ) {
			return false;
		}
		
		// オリジナルファイル作成時が取得出来ない場合は作り直し
		$oftime = filemtime( $this->skinFile );
		if ( !$oftime ) {
			return false;
		}
		
		// キャッシュファイルよりもスキンが新しければ作り直し
		if ( $cftime < $oftime ) {
			return false;
		}
		
		// キャッシュ有効時刻を過ぎていたら作り直し
		if ( time() > ($this->skConf['CACHE']['ALIVETIME'] + $cftime) ) {
			return false;
		}
		
		// 有効なキャッシュ
		return true;
	}




	//===============================================================================================
	//  スキンタグ、展開処理関係のメソッド
	//===============================================================================================


	/**
	 *  Skinnyでスキン内のタグをPHPに置換したコードを返す
	 *  ※）キャッシュ機能ONで、キャッシュがあればそれを使う
	 *  
	 *  @param tpl      string   スキンファイル
	 *  @param param    array    スキンに展開する変数（配列）
	 *  @param tplcode  string   スキン内容コード（指定された場合はtplより優先で使用）
	 */
	private function _skReplacedCode( $tpl = null, $param = null, $tplcode = null ) {
		
		$this->skinFile = $tpl;
		
		if ( is_null( $tplcode ) ) {
			if ( !is_file($tpl) ) {
				$this->_skErrorLog( "Can not open template file. [{$tpl}]" );
				return "<html><body>Can not open template file. [{$tpl}]</body></html>";
			}
			// キャッシュから取得
			$cache_name = $this->skConf['CACHE']['DIR'].'/'.$this->_skGetCacheFileMD5( $tpl );
			if ( $this->_skCheckCacheFile( $cache_name ) ) {
				$code = file_get_contents( $cache_name );
				if ( $code !== FALSE ) {
					$this->cacheUsing = true;
					return $code;
				} else {
					$this->_skErrorLog( "The cache file was not able to be read. [{$cache_name}]" );
				}
			}
			// 有効キャッシュが無ければテンプレート内容を読み込んで展開処理を行う
			$html = file_get_contents( $tpl );
		} else {
			$html = $tplcode;
		}
		
		// 外部テンプレートからさらに外部テンプレートを差し込む処理を許可するかどうか
		if ( $this->skConf['EXTERNAL_CALLBACK'] ) {
			// Skinnyタグ変換
			$code  = '<?php $skOutput = $param; ?>' . $html;
			for ( $cnt = 1; $cnt > 0; ) {
				$code = preg_replace_callback( '/'.$this->skConf['SKINNY']['OPENTAG'].'(.+?)'.$this->skConf['SKINNY']['CLOSETAG'].'/' , '_callback_parse_skin' , $code, -1, $cnt );
			}
		} else {
			// 外部スキン読み込み（external/includeタグ）展開処理
			$html = preg_replace_callback( '/'.$this->skConf['SKINNY']['OPENTAG'].'\s*(external|include)\s*(.+?)'.$this->skConf['SKINNY']['CLOSETAG'].'/' , '_callback_external_parse_skin' , $html );		// externalタグのみ先に外部ファイルを展開
			// Skinnyタグ変換
			$code  = '<?php $skOutput = $param; ?>';
			$code .= preg_replace_callback( '/'.$this->skConf['SKINNY']['OPENTAG'].'(.+?)'.$this->skConf['SKINNY']['CLOSETAG'].'/' , '_callback_parse_skin' , $html );
		}
		
		// コメント削除
		if ( $this->skConf['DISP']['COM_DELETE'] == 1 ) {
			$code = preg_replace( "/<!--.*?-->/s", '', $code );
		}
		// 不要TABや空白削除
		if ( $this->skConf['DISP']['TAB_DELETE'] == 1 ) {
			$code = preg_replace( "/\n\s+/", "\n", $code );
		}
		// ２つ以上の改行をまとめる
		if ( $this->skConf['DISP']['RET_DELETE'] == 1 ) {
			$code = preg_replace( "/\n+/", "\n", $code );
		}elseif ( $this->skConf['DISP']['RET_DELETE'] == 2 ) {
			$code = str_replace( "\n", "", $code );
		}
		
		// 文字コード変換
		if ( $this->skConf['ENCODE']['FLG'] && ($this->skConf['ENCODE']['INTERNAL'] != $this->skConf['ENCODE']['TEMPLATE']) ) {
			$code = mb_convert_encoding( $code, $this->skConf['ENCODE']['INTERNAL'], $this->skConf['ENCODE']['TEMPLATE'] );
		}
		
		// キャッシュ機能ONならキャッシュとして残す
		if ( $this->skConf['CACHE']['FLG'] ) {
			if ( file_put_contents( $cache_name, $code ) === false ) {
				$this->_skErrorLog( "The cache was not able to write in file. [{$cache_name}]" );
			} else {
				chmod( $cache_name, SKINNY_PERMISSION_FOR_CACHE );
			}
		}
		return $code;
	}


	/**
	 *  Skinnyでスキン内のタグをPHPに置換し、実行後のHTMLを表示する
	 *  
	 *  @param tpl      string   スキンファイル
	 *  @param param    array    スキンに展開する変数（配列）
	 *  @param tplcode  string   スキン内容コード（指定された場合はtplより優先で使用）
	 */
	public function SkinnyDisplay( $tpl = null, $param = null, $tplcode = null ) {
		$code = $this->_skReplacedCode( $tpl, $param, $tplcode );
		@ob_end_clean();
		@ob_start();
		eval( "?>" . $code );
		$html = ob_get_contents();
		@ob_end_clean();
		if ( $this->skConf['ENCODE']['FLG'] && ($this->skConf['ENCODE']['INTERNAL'] != $this->skConf['ENCODE']['EXTERNAL']) ) {
			$html = mb_convert_encoding( $html, $this->skConf['ENCODE']['EXTERNAL'], $this->skConf['ENCODE']['INTERNAL'] );
			# $html .= $this->skConf['ENCODE']['INTERNAL']. " -> " . $this->skConf['ENCODE']['EXTERNAL']. "<BR />";
			# header("Content-Type: text/html; charset:".$this->skConf['ENCODE']['EXTERNAL']);
		}
		
		/*
		if ( $this->skConf['SKINNY']['AUTOEXEC'] ) {
			_autoPrependFuncion();
		}
		*/
		
		echo $html . $this->_skBenchMarkTime();
	}


	/**
	 *  Skinnyでスキン内のタグをPHPに置換し、実行後のHTMLを返す
	 *  
	 *  @param tpl      string   スキンファイル
	 *  @param param    array    スキンに展開する変数（配列）
	 *  @param tplcode  string   スキン内容コード（指定された場合はtplより優先で使用）
	 */
	public function SkinnyFetchHTML( $tpl = null, $param = null, $tplcode = null ) {
		$code = $this->_skReplacedCode( $tpl, $param, $tplcode );
		@ob_end_clean();
		@ob_start();
		eval( "?>" . $code );
		$html = ob_get_contents();
		@ob_end_clean();
		if ( $this->skConf['ENCODE']['FLG'] && ($this->skConf['ENCODE']['INTERNAL'] != $this->skConf['ENCODE']['EXTERNAL']) ) {
			$html = mb_convert_encoding( $html, $this->skConf['ENCODE']['EXTERNAL'], $this->skConf['ENCODE']['INTERNAL'] );
		}
		return $html . $this->_skBenchMarkTime();
	}


	/**
	 *  Skinnyでスキン内のタグをPHPに置換したコードを返す
	 *  
	 *  @param tpl      string   スキンファイル
	 *  @param param    array    スキンに展開する変数（配列）
	 *  @param tplcode  string   スキン内容コード（指定された場合はtplより優先で使用）
	 */
	public function SkinnyFetchCache( $tpl = null, $param = null, $tplcode = null ) {
		$code  = $this->_skReplacedCode( $tpl, $param, $tplcode );
		$code .= $this->_skBenchMarkTime();
		return $code;
	}


}
/***  /End of Skinny Class  ***/





/** Execution of skinny processing **/

$skOutput = array();
$skLoopCount = array();

if ( !isset($Skinny) ) { $Skinny = new Skinny; }

// externalの事前展開処理
function _callback_external_parse_skin( $all ) {
	global $Skinny;
	$ret = $Skinny->_sfExternalParseSkin( $all );
	return $ret;
}

// 全スキンタグ展開
function _callback_parse_skin( $all ){
	global $Skinny;
	$ret = $Skinny->_sfParseSkin( $all );
	return $ret;
}

// ベンチマーク用
function _get_microtime(){
	list( $usec, $sec ) = explode( ' ',microtime() );
	return ( (float)$sec + (float)$usec );
}



/*** Auto prepend execute ***/

/**
 *  自動実行
 *  呼び出し元スクリプトのチェック
 **/
if ( $skConf['SKINNY']['AUTOEXEC'] ) {
	if ( !isset($_SERVER['PATH_TRANSLATED']) ) { $_SERVER['PATH_TRANSLATED'] = null; }
	if ( !isset($_SERVER['SCRIPT_FILENAME']) ) { $_SERVER['SCRIPT_FILENAME'] = null; }
	if ( strlen( $_SERVER['PATH_TRANSLATED'] ) !== 0 ) {
		$SKIN_FILE = $_SERVER['PATH_TRANSLATED'];
	} else {
		$SKIN_FILE = $_SERVER['SCRIPT_FILENAME'];
	}
	// 呼び出し元スクリプトが取得出来なかったら終了
	if ( strlen( $SKIN_FILE ) == 0 ) {
		echo "Can not read skin file !!";
		exit;
	}
	$Skinny->SkinnyDisplay($SKIN_FILE, _autoPrependFuncion() );
	exit;
}


// 自動実行時、SkinnyDisplay前に行いたい処理を記述
// 
function _autoPrependFuncion(){
	// require_once( "SkinnyDefine.php" );
	// return $_skDefine;
}
/*** /Auto prepend execute ***/


/* マルチバイト対応strrev */
function _skGlobal_mb_strrev( $data ) {
	global $skConf;
	$n = mb_strlen( $data, $skConf['ENCODE']['INTERNAL'] );
	if ( $n == 0 ) return $data;
	for ( $i = 0; $i < $n; $i++ ) {
		$r_array[$i] = mb_substr( $data, $i, 1, $skConf['ENCODE']['INTERNAL'] );
	}
	$r_array = array_reverse( $r_array );
	$data = NULL;
	for ( $i = 0; $i < $n; $i++ ) {
		$data .= $r_array[$i];
	}
	return $data;
}

/* 曜日を日本語文字列で返す */
function _skGlobal_mb_weekjp( $data ) {
	$weeks = array('日','月','火','水','木','金','土');
	$w = date("w",((is_numeric($data))?$data:strtotime($data)));
	return $weeks[$w];
}


