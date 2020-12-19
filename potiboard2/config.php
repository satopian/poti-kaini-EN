<?php
/*
  * POTI-board Kai Ni v2.20.6 lot.201212
  * by sakots >> https://poti-k.info/
  *
  * setting file of POTI-board Kai Ni
  * Japanese is left in the comments for the convenience of translation.
  *
*/
/* ---------- 最初に設定する項目 (set first) ---------- */
// 管理者パスワード
// 必ず変更してください。
// Password of Administrator. Be sure to change. 
$ADMIN_PASS = 'Adminpass';

// 最大ログ数
// 古いログから順番に消えます
// Maximum number of articles(log). Disappears in chronological order.
define('LOG_MAX', '2000');

// テーマ(テンプレート)のディレクトリ。'/'まで
// themeディレクトリに使いたいtemplateをいれて使ってください。(推奨)
// 別のディレクトリにしたい場合は設定してください。
// 例えばおまけのnee2を使いたい場合は theme_nee2/ とすることができます。初期値は theme/ です。
// Directory of theme. Needed last '/'.
define('SKIN_DIR', 'theme/');

// 設置場所のURL。phpのあるディレクトリの'/'まで
// メール通知のほか、シェアボタンなどで使用
// Installation URL. Directory of php-files, and need last '/'.
// Be used notification by email, and share button, etc.
define('ROOT_URL', 'http://www.hoge.ne.jp/oekaki/');

//掲示板のタイトル（<title>とTOP）
//Board title; <title> and page top.
define('TITLE', 'Paint BBS');

//「ホーム」へのリンク
// 自分のサイトにお絵かき掲示板がある、という慣習からのものです。
// 自分のサイトのURL（絶対パスも可）をどうぞ。
// URL to link your own site. They had own sites ago.
// Absolute path is OK.
define('HOME', '../');

// 画像アップロード機能を 使う:1 使わない:0
// 使わない:0 でも お絵かき機能は使えますし、
// 管理画面で画像アップロードできます。
// Use image upload function, do:'1', do not:'0'
// They can drawing even if setting is '0', 
// and Administrator can upload image in management mode.
define('USE_IMG_UPLOAD','1');

// 画像のないコメントのみの新規投稿を拒否する する:1 しない:0
// する:1 でも管理画面からはコメントのみの投稿ができます。
// They CANNOT post that has no image if setting '1'. be able to do, set '0'.
// if '0', Administrator can do in management mode.
define('DENY_COMMENTS_ONLY', '0');

// 画像なしのチェックボックスを使用する する:1 しない:0 
// 互換性確保のための設定項目です。
// テンプレートが対応していない時は する:1。
// テンプレートが対応していれば しない:0 で「画像なし」のチェックボックスを表示しません。
// Use to the checkbox of [no_imane], do:'1', do not:'0'
// This item is remained for compatibility.
// Templates that do not support this setting, set '1'.
// If supported, set '0' to hide the checkbox of [no_imane].
define('USE_CHECK_NO_FILE', '0');

/*----------絶対に設定が必要な項目はここまでです。ここから下は必要に応じて。----------*/
/* That's all the necessary settings. From here on as needed. */

/* ---------- SNS連携 (Link with SNS) ---------- */

// シェアボタンを表示する する:1 しない:0
// 対応テンプレートが必要
// 設置場所のURL ROOT_URL で設定したurlをもとにリンクを作成
// Show share button, do:'1', do not:'0'
define('SHARE_BUTTON', '0');

/* ---------- スパム対策 (Anti-spam posting) ---------- */

// 拒絶する文字列
// 正規表現を使うことができます
// 全角半角スペース改行を考慮する必要はありません
// スペースと改行を除去した文字列をチェックします
// Character string that cannot be posted,
// You can use Regular Expression.
// And you do not have to think about spaces and line breaks.
$badstring = array("irc.s16.xrea.com","Unsolicited ad");


// 使用できない名前
// Unusable name. You do not have to think about spaces and line breaks.
// And you can use Regular Expression too.
$badname = array("branded goods","mail order","sale");

// 正規表現を使うことができます
// 全角半角スペース改行を考慮する必要はありません
// スペースと改行を除去した文字列をチェックします

// 設定しないなら ""で。
// To do not use this, set "".
// $badname = array("");

// 初期設定では「"通販"を含む名前」の投稿を拒絶します
// ここで設定したNGワードが有効になるのは「名前」だけです
// 本文に「通販で買いました」と書いて投稿する事はできます
// By default setting, Rejected that name contain "Mail order".
// Unusable name is only unusable name, They csn be used in letter body.

// 名前以外の項目も設定する場合は
// こことは別の設定項目
// 拒絶する文字列で
// Settings other than the name,
// Anti-spam posting -> Character string that cannot be posted

// AとBが両方あったら拒絶。
// Reject if there are both A and B.
$badstr_A = array("cheep","low price","copy","focus on quality","mass arrival");
$badstr_B = array("Chanel","Supreme","Balenciaga","brand");

// 正規表現を使うことができます。
// 全角半角スペース改行を考慮する必要はありません
// スペースと改行を除去した文字列をチェックします
// You can use Regular Expression.
// And you do not have to think about spaces and line breaks.

// 設定しないなら ""で。
// To do not use this, set "".
// $badstr_A = array("");
// $badstr_B = array("");

// AとBの単語が2つあったら拒絶します。
// 初期設定では「ブランド品のコピー」という投稿を拒絶します。
// 1つの単語では拒絶されないので「コピー」のみ「ブランド」のみの投稿はできます。
// For example, Rejecting only "brand copy" by default.
// Only "brand", or only "copy" in the post, it is not rejected.

// 一つの単語で拒絶する場合は
// こことは別の設定項目
// 拒絶する文字列で

// 本文に日本語がなければ拒絶
// To post if there are no Japanese characters in the text,
// set '0'. or not, set '1'.
// Original script is made by Japanese people to avoid spam from foreign countries, 
// there is such a setting. excuse me.
define('USE_JAPANESEFILTER', '0');

// 本文へのURLの書き込みを禁止する する:1 しない:0
// 管理者は設定にかかわらず許可
// To give permission writing URL in the text, set '0', if not, set '1'.
define('DENY_COMMENTS_URL', '0');

// To close the form for threads that have passed the specified number of days.
// define('ELAPSED_DAYS','0');
// 設定しないなら '0'で。フォームを閉じません。
// if set '0', the forms never close.
// define('ELAPSED_DAYS','365');
//	↑ 365日
// で1年以上経過したスレッドに返信できなくなります。
// if set '365', they can't reply the thread past 1 year.
define('ELAPSED_DAYS','365');

// 拒絶するファイルのmd5
// md5 of Reject file.
$badfile = array("dummy","dummy2");

// 拒絶するホスト
// Host to reject.
$badip = array("addr.dummy.com","addr2.dummy.com");


/* ---------- ADD:2019/08/23 ---------- */

// ペイント画面のパスワードの暗号鍵
// あまり頻繁に変えないように
// Encryption key of paint mode. Don't change too often.
define('CRYPT_PASS','fbgtK4pj9t8Auek');

// ↑ 暗号化と解読のためのパスワード。
// phpの内部で処理するので覚えておく必要はありません。
// 管理パスとは別なものです。
// 適当な英数字を入れてください。
// This is password for encryption and decryption.
// You don't need to remember it as it is processed inside php.
// It is not Password of Administrator.

/* ---------- ADD:2018/11/22 ---------- */
// urlパラメータを追加する する:1 しない:0
// ブラウザのキャッシュが表示されて投稿しても反映されない時は1。
// .htaccessでキャッシュの有効期限を過去にしている場合は設定不要。
// If the cache of the browser is displayed and not reflected even after posting, set '1'.
// Settings of .htaccess file are working well, you don't have to touch this. 

define('URL_PARAMETER', '0');

/* ---------- ADD:2005/06/02 ---------- */
// 連続・二重投稿対象セキュリティレベル
// ※連続・二重投稿チェック対象を決める条件
// 0:最低　…　チェックしない
// 1:低　　…　ホストが同じログの場合(従来の条件)
// 2:中　　…　低レベルの条件に加え、名前・メールアドレス・URL・題名のいずれかが同じ場合
// 3:高　　…　低レベルの条件に加え、名前・メールアドレス・URL・題名のいずれかが類似率を上回る場合
// 4:最高　…　無条件でチェック。最新ログ20件と連続・二重投稿チェックする事になる
// ※中・高レベルのとき、未入力項目は無視
// Consecutive post security check level
// '0':no check
// '1':the host is the same
// '2':the host is the same, and Same name, mail address, URL, or title
// '3':the host is the same, and Similar name, mail address, URL, or title
// setting of similarity rate is next.
// '4':unconditionally check from the latest 20 logs
define('POST_CHECKLEVEL', '2');

// 連続・二重投稿対象セキュリティレベルが 高 のときの類似率(単位％)
// Similarity rate when consecutive post security check level 3 (%)
define('VALUE_LIMIT', '80');

// 二重投稿セキュリティレベル
// ※二重投稿とみなす条件
// 0:最低　…　本文が一致し、画像なしの場合(従来の条件)
// 1:低　　…　本文が一致する場合
// 2:中　　…　本文が類似率(中)を上回る場合
// 3:高　　…　本文が類似率(高)を上回る場合
// Double post security check level
// '0':No image and same letter body
// '1':same letter body
// '2':similar letter body, middle
// '3':similar letter body, high
define('D_POST_CHECKLEVEL', '1');

// 二重投稿セキュリティレベルが 中 のときの類似率(単位％)
// Similarity rate when double post security check level 2 (%)
define('COMMENT_LIMIT_MIDDLE', '90');

// 二重投稿セキュリティレベルが 高 のときの類似率(単位％)
// Similarity rate when double post security check level 3 (%)
define('COMMENT_LIMIT_HIGH', '80');

/* ---------- ADD:2005/01/14 ---------- */
// 言語設定
// Setting of Language.
define('LANG', 'English');

/* ---------- ADD:2004/03/16 ---------- */
// 文字色選択を使用する する:1 しない:0
// 要対応テーマ
// Use font color selection, do:'1', do not:'0'
// Needed a theme for this feature
define('USE_FONTCOLOR', '0');

// レスで画像貼りを許可する する:1 しない:0
// ※お絵かきも連動
// Allow image pasting in response, ok:'1', deny:'0'.
define('RES_UPLOAD', '1');

// レス用投稿サイズ（これ以上はサイズを縮小
// Post size at response. If over this, it will be reduced.
define('MAX_RESW', '400');	//幅 (width)
define('MAX_RESH', '400');	//高さ (height)

// レス画像貼りを許可した場合の画像付きレスを表示させる件数
// 1スレで表示させるレスを画像付きレス表示数になるまで省略します
// 返信画面で全件表示されます
// (例) ※0が文字レス,iが画像レス
// 0i0ii の場合。画像付きレス表示数2だと → 0ii に省略されます
// Number of responses to be displayed at Allow image pasting in response
// All items will be displayed on the reply mode.
define('DSP_RESIMG', '2');

/* ---------- お絵かきアプレット設定(paint applet settings) ---------- */
/* ※詳しい内容はアプレットのreadme参照 */
// アンドゥの回数(デフォルト)
// Number of undos
define('UNDO', '90');

// アンドゥを幾つにまとめて保存しておくか(デフォルト)
// Number of undos to be bundled
define('UNDO_IN_MG', '45');

// PNG画像のファイルサイズが設定値より大きな時はJPEGに変換
// アップロードしたPNG画像もJPEGに変換します
// JPEGに変換した画像ともとのPNG画像を比較してファイルサイズが小さなほうを投稿します。
// 単位kb
// Value of convert to JPEG when the PNG image file size is larger than.
// Converts uploaded PNG images to JPEG.
// kB.
define('IMAGE_SIZE', '512');	

// PNGの減色率とJPEGの圧縮率
// 要対応テーマ
// PNG color reduction rate and JPEG compression rate
// Needed a theme for this feature
define('COMPRESS_LEVEL', '15');

// 初期レイヤー数［しぃペインターのみ］
// ※お絵かき中にレイヤー増やせるのであまり意味無い
// default number of layers (only Shi-Painter)
define('LAYER_COUNT', '3');

// キャンバスクオリティの選択肢［しぃペインターのみ］
// ※3以上に上げる時は UNDO÷UNDO_IN_MG が2以下になる様にしないと
// 派手にメモリを消費する為、メモリ不足に陥る可能性があります
// ※最初の値がデフォルトになります
// Canvas quality choices (only Shi-Painter)
// Do not touch if you are not sure as it may run out of memory
$qualitys = array('1','2','3','4');

// セキュリティ関連－URLとクリック数かタイマーのどちらかが設定されていれば有効
// ※アプレットのreadmeを参照し、十分テストした上で設定して下さい
// NEOではデフォルトで無効
// Countermeasures against vandalism
// Please set after thorough testing.
// This setting have been disabled in NEO.
// セキュリティクリック数。設定しないなら''で
// Clicks for security; Not set:''
define('SECURITY_CLICK', '');
// セキュリティタイマー(単位:秒)。設定しないなら''で
// Timer for security(Seconds); Not set:''
define('SECURITY_TIMER', '');
// セキュリティにヒットした場合の飛び先
// URL to go if they violate the above
define('SECURITY_URL', './security_c.html');

// 続きを描くときのセキュリティ。利用しないなら両方''で
// 続きを描くときのセキュリティクリック数。設定しないなら''で
// Clicks for security of continue mode; Not set:''
define('C_SECURITY_CLICK', '');
// 続きを描くときのセキュリティタイマー(単位:秒)。設定しないなら''で
// Timer for security(Seconds) of continue mode; Not set:''
define('C_SECURITY_TIMER', '');

/* ---------- ADD:2004/02/03 ---------- */
// そろそろ消える表示のボーダー。最大ログ数からみたパーセンテージ
// Threshold that disappears soon. Percentage from maximum log count.
define('LOG_LIMIT', '92');

/* ---------- メール通知設定(email notification settings) ---------- */
// メール通知機能を使う使わないを設定する項目はここにはありません。
// noticemail.inc を potiboard.php と同じディレクトリにアップロードすると
// メール通知機能が自動的にオンになります。
// There is no item here to set to use the email notification function.
// If you upload noticemail.inc to the same directory as potiboard.php,
// The email notification feature will be turned on automatically.

// 管理者が投稿したものもメールで通知 しない:1 する:0
// Notify by email what the administrator posted, OFF:'1', ON'0'.
define('NOTICE_NOADMIN', '0');

// メール通知先
// Where to receive the email
define('TO_MAIL', 'root@xxx.xxx');

// メール通知に本文を付ける 付ける:1 付けない:0
// Add letter body to notification, do:'1', do not:'0'.
define('SEND_COM', '1');

/* ---------- メイン設定(main settings) ---------- */

// ログファイル名
// The names of log fils.
define('LOGFILE', 'img.log');
define('TREEFILE', 'tree.log');

// 画像保存ディレクトリ。potiboard.phpから見て
// Directory of saving images. path from potiboard.php.
define('IMG_DIR', 'src/');

// サムネイル保存ディレクトリ
// Directory of saving thumbnail.
define('THUMB_DIR', 'thumb/');

// このスクリプト名。変更することをおすすめしません。
// The name of this script. Not recommended to change.
define('PHP_SELF', 'potiboard.php');

// 入り口ファイル名
// The name of entrance file.
define('PHP_SELF2', 'index.html');

// 1ページ以降の拡張子
// File extensions of html file.
define('PHP_EXT', '.html');

// [新規投稿は管理者のみ]にする する:1 しない:0
// する(1)にした場合、管理者パス以外での新規投稿はできません
// To only admins can post new article, set '1'. if not, set '0'
// If mode '1', They may post When the password match that of the Administrator.
define('ADMIN_NEWPOST', '0');

// 投稿容量制限 KB phpの設定により2M(2048)まで
// Post capacity limit(KB). By php limit, it is allowed up to 2048.
define('MAX_KB', '1000');

// 投稿サイズ（これ以上はサイズを縮小
// The size of the image that can be posted. If over this, it will be reduced.
define('MAX_W', '600');	//幅(width)
define('MAX_H', '600');	//高さ(height)

// 名前の制限文字数。半角で
// Maximum number of characters that can be used as name
define('MAX_NAME', '100');

// メールアドレスの制限文字数。半角で
// Maximum number of characters that can be used as mail address
define('MAX_EMAIL', '100');

// 題名の制限文字数。半角で
// Maximum number of characters that can be used as subject
define('MAX_SUB', '100');

// 本文の制限文字数。半角で
// Maximum number of characters that can be used as letter body
define('MAX_COM', '1000');

// 1ページに表示する記事
// Number of articles to display on one page
define('PAGE_DEF', '10');

// 1スレ内のレス表示件数(0で全件表示)
// レスがこの値より多いと古いレスから省略されます
// 返信画面で全件表示されます
// [新規投稿は管理者のみ]にした場合の 0 はレスを表示しません
// Number of reply displays in one thread (If '0' display all)
// If the reply is more than this value, 
// the oldest reply will be omitted. 
// All items will be displayed on the reply mode.
// If [only admins can post new article] mode is, no reply display as '0'.
define('DSP_RES', '7');

// クッキー保存日数
// Cookie storage days  
define('SAVE_COOKIE', '30');

// 連続投稿秒数
// Number of consecutive posting seconds
define('RENZOKU', '10');

// 画像連続投稿秒数
// Number of seconds for continuous posting of images
define('RENZOKU2', '20');

// 強制sageレス数( 0 ですべてsage)
// Threshold for threads not to surface ('0' applies to all )
define('MAX_RES', '20');

// IDを表示する する:1 しない:0
// To show ID, set '1', if not, set '0'.
define('DISP_ID', '0');

// ID生成の種
// Seed of ID
define('ID_SEED', 'ID_SEED');

// URLを自動リンクする する:1 しない:0
// To use automatically link URL, set '1', if not, set '0'.
define('AUTOLINK', '1');

// 名前を必須にする する:1 しない:0
// To force They have name, set '1', if not, set '0'.
define('USE_NAME', '0');
define('DEF_NAME', 'anonymous');	//未入力時の名前(default name)

// 本文を必須にする する:1 しない:0
// To force They have any letter body, set '1', if not, set '0'.
define('USE_COM', '0');
define('DEF_COM', 'no body');	//未入力時の本文(default letter body)

// 題名を必須にする する:1 しない:0
// To force They have title, set '1', if not, set '0'.
define('USE_SUB', '0');
define('DEF_SUB', 'no title');	//未入力時の題名(default title)

// レス時にスレ題名を引用する する:1 しない:0
// to quote the thread title in response, set '1', if not, set '0'.
define('USE_RESUB', '1');

// 各スレにレスフォームを表示する する:1 しない:0
// To show post form in each thread, set '1', if not, set '0'.
define('RES_FORM', '0');

// 編集しても投稿日時を変更しないようにする する:1 しない:0 
// To keep the posting date and time even if they edit articles,
// set '1', if not, set '0'.
define('DO_NOT_CHANGE_POSTS_TIME', '0');

// する:1 にすると投稿を編集しても投稿日時は変更されず最初の投稿日時のままになります。
// 編集マークも付きません。
// if set'1', you edit the post, the posting date and time will not be changed
// and will remain the same as the first posting date and time, and not marked "Edited".

// フォーム下の追加お知らせ
// (例)'<li>お知らせデース</li>
//     <li>サーバの規約でアダルト禁止</li>'
// 要対応テーマ
// Additional notice (needed a corresponding theme)
$addinfo='';

/* ---------- サムネイル設定(thumbnail settings) ---------- */

// サムネイルを作成する する:1 しない:0
// Create thumbnail, do:'1', do not:'0'.
define('USE_THUMB', '1');

// サムネイルの品質  0(品質は最低、サイズは小)～100(品質は最高、サイズは大)の範囲内
// Thumbnail quality 0~100
// The higher the number, the higher the quality, but the larger the size.
define('THUMB_Q', '92');

// GD2のImageCopyResampledでサムネイルの画質向上 させる:1 させない:0
// 自動判別なので通常は 1 でOK.不具合がある場合のみ 0 にして下さい
// Improved thumbnail image quality by ImageCopyResampled of GD.
// Usually'1', it is automatically determined.
// Only if there is a problem set '0'. 
define('RE_SAMPLED', '1');

/* ---------- お絵かき設定(paint mode settings) ---------- */

// お絵かき機能を使用する お絵かきのみ:2 する:1 しない:0
// To use only paint mode, set '2'. 
// paint mode and text mode, set '1'
// only text mode, set '0'
define('USE_PAINT', '2');

// 利用するアプレット PaintBBS:0 しぃペインター:1 両方:2
// Applet allowed to use, PaintBBS:'0' Shi-Painter:'1' both:'2'
define('APPLET', '2');

// お絵かき画像ファイル名の頭文字
// お絵かき投稿した画像のファイル名には、必ずこれが先頭に付きます
// Initial of drawing image file name
define('KASIRA', 'OB');

// テンポラリディレクトリ
// Temporary directory
define('TEMP_DIR', 'tmp/');

// テンポラリ内のファイル有効期限(日数)
// File expiration date in temporary directory
define('TEMP_LIMIT', '3');

// お絵描き最大サイズ（これ以上は強制でこの値
// 最小値は幅、高さともに 300 固定です
// Maximum drawing size; higher than this forced this value
define('PMAX_W', '700');	//幅 (width)
define('PMAX_H', '700');	//高さ (height)

// お絵描きデフォルトサイズ
// paint mode default size
define('PDEF_W', '300');	//幅 (width)
define('PDEF_H', '300');	//高さ (height)

// 描画時間の表示 する:1 しない:0
// Display of drawing time, do:'1', do not:'0'
define('DSP_PAINTTIME', '1');

// 描画時間を合計表示に する:1 しない:0 
// Display drawing time to total, do:'1' do not:'0'. 
define('TOTAL_PAINTTIME', '1');
// 描画時間:8分12秒+18分36秒
// のように+でつなぎたい時は 
// しない:0
// 描画時間:26分48秒のように描画時間の合計を表示する時は
// する:1
// If this setting is '0',
// that will display as "Painttime:8m22s+18m36s"
// If '1', Show total as "Painttime:26m48s"

// パレットデータファイル名
// File name of palette data
define('PALETTEFILE', 'palette.txt');

// パレットデータファイル切り替え機能を使用する する:1 しない:0 
// 切り替えるパレットデータファイルが用意できない場合は しない:0
// 要対応テーマ
// Use the palette data file switching function, do:'1', do not :'0'
// If the palette data file to be switched cannot be prepared, set '0'.
// Needed a corresponding theme.
define('USE_SELECT_PALETTES', '0');


// パレットデータファイル切り替え機能を使用する する:1 の時のパレットデーターファイル名
// File name of palette data when Use the palette data file switching function:'1'
// 初期パレットpalette.txtとやこうさんパレットpalette.datを切り替えて使う時
// ↓
$pallets_dat=array(['normal','palette.txt'],['pro','palette.dat']);
// ['パレット名','ファイル名']でひとつ。それをコンマで区切ります。
// パレット名とファイル名は''で囲ってください。
// 設定例
// $pallets_dat=array(['パレット1','1.txt'],['パレット2','2.txt'],['パレット3','3.txt']);
// Enclose in quotes palette name and file name.
// Setting example,
// $pallets_dat=array(['palette1','1.txt'],['palette2','2.txt'],['palette3','3.txt']);

// 動画機能を使用する する:1 しない:0
// Use animation, do:'1', do not:'0'
define('USE_ANIME', '1');

// 動画記録デフォルトスイッチ ON:1 OFF:0
// Use the animation function as standard, do:'1', do not:'0'
define('DEF_ANIME', '1');

// 動画(PCH)保存ディレクトリ
// Directory name of pch file
define('PCH_DIR', 'src/');

// 動画再生スピード 超高速:-1 高速:0 中速:10 低速:100 超低速:1000
// Speed of animation playback,
// super fast:'-1', fast:'0', normal:'10', slow:'100', super slow:'1000'
define('PCH_SPEED', '0');

// コンティニューを使用する する:1 しない:0
// Use continue mode, do:'1', do not:'0'
define('USE_CONTINUE', '1');

// 新規投稿でコンティニューする時にも削除キーが必要 必要:1 不要:0
// 不要:0 で新規投稿なら誰でも続きを描く事ができるようになります。
// Need the delete passwoed to continue with newly posted pictures,
// need:'1', do not need:'0'
// Anyone will be able to draw the continuation when the mode is '0'.
define('CONTINUE_PASS', '0');

/* ---------- picpost.php用設定(settings for picpost.php) ---------- */
// システムログファイル名
// File name of system log
$syslog = "picpost.systemlog";
// システムログ保存件数
// Number of system logs to be saved
$syslogmax = '100';
