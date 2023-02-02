<?php
/*
  * POTI-board EVO v5.30.0 lot.221022
  * by POTI-board redevelopment team >> https://paintbbs.sakura.ne.jp/poti/
  *
  * configuration file of POTI-board EVO
  * Japanese is left in the comments for the convenience of translation.
  *
*/
/* ---------- 最初に設定する項目 (set first) ---------- */
// 管理者パスワード
// 必ず変更してください。
// Administrator password, make sure to change it.
$ADMIN_PASS = "adminpass";

// 最大ログ数
// 古いログから順番に消えます
// Maximum number of posts. Disappears in chronological order.
define("LOG_MAX", "3000");

// テーマ(テンプレート)のディレクトリ。"/"まで
//テンプレートが入っているディレクトリを指定してください。
// MONO_enを使いたい場合は mono_en/ です。初期値は mono_en/ です。
// template directory, requires "/" at the end.
define("SKIN_DIR", "mono_en/");

// 設置場所のURL。potiboard.phpのあるディレクトリの"/"まで
// メール通知のほか、シェアボタンなどで使用
// Installation URL. In the directory where potiboard.php is located, and need last "/".
// Be used notification by email, and share button, etc.
define("ROOT_URL", "https://example.com/oekaki/");

//掲示板のタイトル（<title>とTOP）
//Board title (appears in <title> and site header)
define("TITLE", "Paint BBS");

//「ホーム」へのリンク
// 自分のサイトにお絵かき掲示板がある、という慣習からのものです。
// 自分のサイトのURL（絶対パスも可）をどうぞ。
// URL to link your own site. They had own sites ago.
// Absolute path is OK.
define("HOME", "../");

// 画像アップロード機能を 使う:1 使わない:0
// 使わない:0 でも お絵かき機能は使えますし、
// 管理画面で画像アップロードできます。
// Whether to enable image uploads, "1" to enable.
// Drawing is still enabled even with this disabled.
// Administrators can still upload images in admin post mode.
define("USE_IMG_UPLOAD","1");

// 画像のないコメントのみの新規投稿を拒否する する:1 しない:0
//する:1 でも管理者はコメントのみの投稿ができます。
// If "1" is set, a new thread without an image cannot be created. To enable it, set it to "0".
// Even if it is "1", the administrator can create a new thread without an image.

define("DENY_COMMENTS_ONLY", "0");

// Use PaintBBS NEO 
// (1: Enabled, 0: Disabled)
define("USE_PAINTBBS_NEO", "1");

// Use Shi Painter 
// (1: Enabled, 0: Disabled)
define("USE_SHI_PAINTER", "1");

// Use ChickenPaint
// (1: Enabled, 0: Disabled) 
define("USE_CHICKENPAINT", "1");

//Use Klecks
// (1: Enabled, 0: Disabled) 
define("USE_KLECKS", "1");

//Allow admins to use all apps regardless of settings
// (1: Enabled, 0: Disabled) 
define('ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS', '1');

/*----------絶対に設定が必要な項目はここまでです。ここから下は必要に応じて。----------*/
/* That's all the necessary settings. From here on as needed. */

/* ------------- タイムゾーン (timezone) ------------- */

// List of Supported Timezones is here. 
// https://www.php.net/manual/en/timezones.php
define("DEFAULT_TIMEZONE","Asia/Tokyo");

/* ---------- SNS連携 (Link with SNS) ---------- */

// シェアボタンを表示する する:1 しない:0
// 対応テンプレートが必要
// 設置場所のURL ROOT_URL で設定したurlをもとにリンクを作成
// Whether to show the share button, "1" to enable.
define("SHARE_BUTTON", "0");

/* ---------- スパム対策 (Anti-spam posting) ---------- */

// 正規表現を使うことができます
// 全角半角スペース改行を考慮する必要はありません
// スペースと改行を除去した文字列をチェックします
// Even if the posted character strings contains line breaks or spaces, it will be judged as the same character string and rejected.
// This is because the strings is checked with removed spaces and line breaks .
// 設定しないなら array();
// To disable, type array();

// 拒絶する文字列
// Reject string
// String blacklists and regular expressions are supported.
$badstring = array("irc.s16.xrea.com","Unsolicitedad");

//拒絶するURL
// URL blacklists
$badurl = array("example.com","www.example.com");

// 使用できない名前
// Prohibited names (supports regular expressions)
$badname = array("brandedgoods","mailorder","sale");

// 初期設定では「"通販"を含む名前」の投稿を拒絶します
// ここで設定したNGワードが有効になるのは「名前」だけです
// 本文に「通販で買いました」と書いて投稿する事はできます
// By default setting, Rejected that name contain "Mail order".
// Unusable name is only unusable name, They csn be used in letter body.

// 名前以外の項目も設定する場合は
// こことは別の設定項目
// 拒絶する文字列で
// When setting other than the name, set the "Reject string".

// AとBが両方あったら拒絶。
// Reject post if both conditions A and B are met (supports regular expressions, use array(""); to disable).
$badstr_A = array("cheep","lowprice","copy","focusonquality","massarrival");
$badstr_B = array("Chanel","Supreme","Balenciaga","brand");

// AとBの単語が2つあったら拒絶します。
// 初期設定では「ブランド品のコピー」という投稿を拒絶します。
// 1つの単語では拒絶されないので「コピー」のみ「ブランド」のみの投稿はできます。
// For example, Rejecting only "brand copy" by default.
// Only "brand", or only "copy" in the post, it is not rejected.

// 一つの単語で拒絶する場合は
// こことは別の設定項目
// 拒絶する文字列で

// 本文に日本語がなければ拒絶
// Reject non-Japanese posts (used for spam).
define("USE_JAPANESEFILTER", "0");

// 本文へのURLの書き込みを禁止する する:1 しない:0
// 管理者は設定にかかわらず許可
// Reject if there is a url in the comment field.
// Administrator writes are not rejected.
// (Yes: 1, No: 0)
define("DENY_COMMENTS_URL", "0");

//URL入力欄を使用する する:1 しない:0
// Use URL input field (Yes: 1, No: 0)
define("USE_URL_INPUT_FIELD", "1");
//No: 0, the URL field disappears from the form input fields.
// Even if the form is faked, the URL will not be entered.

// Close threads after X days. 
// Setting "365" days will close threads older than 1 year.
// Set to 0 to disable.
define("ELAPSED_DAYS","365");

// 拒絶するファイルのmd5
// Reject files with following MD5 hashes.
$badfile = array("dummy","dummy2");

// 拒絶するホスト
// Block following IPs
$badip = array("addr.dummy.com","addr2.dummy.com");

/* ---------- メール通知設定(email notification settings) ---------- */
// メール通知機能を使う使わないを設定する項目はここにはありません。
// noticemail.inc を potiboard.php と同じディレクトリにアップロードすると
// メール通知機能が自動的にオンになります。
// There is no setting item here to decide whether to use the mail notification function.
// If you upload "noticemail.inc" to the same directory as potiboard.php
// The email notification function will be turned on automatically.

// 管理者が投稿したものもメールで通知 しない:1 する:0
// Notify by email what the administrator posted (OFF:"1", ON:"0").
define("NOTICE_NOADMIN", "0");

// メール通知先
// Mail address where the mail notifications will be sent.
define("TO_MAIL", "root@example.com");

// メール通知に本文を付ける 付ける:1 付けない:0
// Add a body to the mail notifications (Yes: 1, No: 0)
define("SEND_COM", "1");

/* ---------- メイン設定(main settings) ---------- */
// 名前の制限文字数。半角で
// Maximum number of characters that can be used in the "name" field.
define("MAX_NAME", "100");

// メールアドレスの制限文字数。半角で
// Maximum number of characters that can be used in the "mail address" field.
define("MAX_EMAIL", "100");

// 題名の制限文字数。半角で
// Maximum number of characters that can be used in the "subject" field.
define("MAX_SUB", "100");

// 本文の制限文字数。半角で
// Maximum number of characters that can be used in the "body" field.
define("MAX_COM", "1000");

// 1ページに表示する記事
// Number of articles to display per page
define("PAGE_DEF", "10");

// 1スレ内のレス表示件数(0で全件表示)
// レスがこの値より多いと古いレスから省略されます
// 返信画面で全件表示されます
// [新規投稿は管理者のみ]にした場合の 0 はレスを表示しません
// How many replies will be displayed per thread (If "0" display all)
// If the number of replies is bigger than this value, 
// the oldest will be omitted. 
// All items will be displayed on the reply mode.
// If [only admins can post new articles] mode is enabled, no reply display as "0".
define("DSP_RES", "7");

// 文字色選択を使用する する:1 しない:0
// 要対応テーマ
// Use font color selection, (1: Enabled, 0: Disabled)
// Needed a theme for this feature
define("USE_FONTCOLOR", "0");


// 投稿容量制限 KB phpの設定により2M(2048)まで
// Maximum size allowed for the images in the posts (in KB).
// By php limit, it is allowed up to 2048.
define("MAX_KB", "1000");

//表示する最大サイズ（これ以上はサムネイルまたは縮小表示
// Maximum size to display (thumbnails or reduced view.
define("MAX_W", "600");	//幅(width)
define("MAX_H", "600");	//高さ(height)

// レスで画像貼りを許可する する:1 しない:0
// ※お絵かきも連動
// Allow image comments, "1" to enable.
define("RES_UPLOAD", "1");

// Maximum size to display when replying (thumbnails or reduced view.

define("MAX_RESW", "400");	//幅 (width)
define("MAX_RESH", "400");	//高さ (height)

// IDを表示する する:1 しない:0
// To show ID, (1: Enabled, 0: Disabled)
define("DISP_ID", "1");

// URLを自動リンクする する:1 しない:0
// Automatically transform URLs to links (Yes: 1, No: 0)
define("AUTOLINK", "1");
//マークダウン記法でリンクする する:1 しない:0
// Create a link using markdown syntax (Yes: 1, No: 0)
define("MD_LINK", "0");

// 名前を必須にする する:1 しない:0
// Make the post name mandatory. (Yes: 1, No: 0)
define("USE_NAME", "0");
define("DEF_NAME", "anonymous");	//未入力時の名前(default name)

// 本文を必須にする する:1 しない:0
// Make the body of the post mandatory. (Yes: 1, No: 0)
define("USE_COM", "0");
define("DEF_COM", "no body");	//未入力時の本文(default letter body)

// 題名を必須にする する:1 しない:0
// Make the title of the post mandatory. (Must have a title: 1, Must not have a title: 0)
define("USE_SUB", "0");
define("DEF_SUB", "no title");	//未入力時の題名(default title)

// レス時にスレ題名を引用する する:1 しない:0
// Quote the thread title in new responses (Yes: 1, No: 0)
define("USE_RESUB", "1");

// 編集しても投稿日時を変更しないようにする する:1 しない:0 
// To keep the posting date and time even if they edit articles,
// set "1", if not, set "0".
// する:1 にすると投稿を編集しても投稿日時は変更されず最初の投稿日時のままになります。
// 編集マークも付きません。
// if set to "1", the posting date and time will not be changed when editing a post.
// and will remain the same as the first posting date and time.
// The post will not be marked as "Edited" either.
define("DO_NOT_CHANGE_POSTS_TIME", "0");
//レス画面に前後のスレッドの画像を表示する する:1 しない:0
// Show images of next and previous threads in reply view
// (1: Enabled, 0: Disabled)
define("VIEW_OTHER_WORKS", "1");

/* ---------- お絵かき設定(paint mode settings) ---------- */

// お絵かき機能を使用する お絵かきのみ:2 する:1 しない:0
// Use the oekaki function  (1: Enabled, 0: Disabled)
define("USE_PAINT", "1"); 

// お絵描き最大サイズ（これ以上は強制でこの値
// 最小値は幅、高さともに 300 固定です
// The maximum drawing size value larger than this will be the maximum value set here.
// The minimum value is fixed at 300 for both width and height.
define("PMAX_W", "800");	//幅 (width)
define("PMAX_H", "800");	//高さ (height)

// お絵描きデフォルトサイズ
// paint mode default size
define("PDEF_W", "300");	//幅 (width)
define("PDEF_H", "300");	//高さ (height)

// 描画時間の表示 する:1 しない:0
// Display the drawing time (1: Enabled, 0: Disabled)
// Displays for how long you have been drawing
define("DSP_PAINTTIME", "1");

// パレットデータファイル名
// File name of palette data
define("PALETTEFILE", "palette.txt");

// パレットデータファイル切り替え機能を使用する する:1 しない:0 
// 切り替えるパレットデータファイルが用意できない場合は しない:0
// 要対応テーマ
// Use the palette data file switching function (1: Enabled, 0: Disabled)
// If the palette data file to be switched cannot be prepared, set this to "0".
// Needed a corresponding theme.
define("USE_SELECT_PALETTES", "0");


// パレットデータファイル切り替え機能を使用する する:1 の時のパレットデーターファイル名
// File name of palette data when Use the palette data file switching function:"1"
// 初期パレットpalette.txtとやこうさんパレットpalette.datを切り替えて使う時
// ↓
$pallets_dat=array(["normal","palette.txt"],["pro","palette.dat"]);
// ["パレット名","ファイル名"]でひとつ。それをコンマで区切ります。
// パレット名とファイル名は""で囲ってください。
// 設定例
// $pallets_dat=array(["パレット1","1.txt"],["パレット2","2.txt"],["パレット3","3.txt"]);
// Enclose in quotes palette name and file name.
// Setting example,
// $pallets_dat=array(["palette1","1.txt"],["palette2","2.txt"],["palette3","3.txt"]);

// 動画機能を使用する する:1 しない:0
// Enable animations (1: Enabled, 0: Disabled)
define("USE_ANIME", "1");

// 動画記録デフォルトスイッチ ON:1 OFF:0
// Use the animation function by default (1: Enabled, 0: Disabled)
define("DEF_ANIME", "1");


// 動画再生スピード 超高速:-1 高速:0 中速:10 低速:100 超低速:1000
// Speed of animation playback. Possible values are:
// super fast:"-1", fast:"0", normal:"10", slow:"100", super slow:"1000"
define("PCH_SPEED", "0");

// コンティニューを使用する する:1 しない:0
// Allow to continue drawings after leaving: (1: Enabled, 0: Disabled)
define("USE_CONTINUE", "1");

// 新規投稿でコンティニューする時にも削除キーが必要 必要:1 不要:0
// 不要:0 で新規投稿なら誰でも続きを描く事ができるようになります。
// CONTINUE PASSWORD
// If set to 1, you  will need the delete password to continue with newly posted pictures.
// (1: The deletion password will be required, 0: No password required)
// However, anyone will be able to continue with a drawing when the mode is set to "0".
define("CONTINUE_PASS", "0");

//レス画像から新規投稿で続きを描いた画像をレスとして投稿する する:1 しない:0
// When continuing from the reply image, even if it is"new post", it will be a reply to the current thread.
// (1: Enabled, 0: Disabled) 
define("RES_CONTINUE_IN_CURRENT_THREAD", "1");


/* ---------- 詳細設定(Advanced Setting) ---------- */
// このスクリプト名。変更することをおすすめしません。
// The name of the main script. Do not modify this value unless you have a good
// reason to do so.
define("PHP_SELF", "potiboard.php");
// ログファイル名
// The name of the log files.
define("LOGFILE", "img.log");
define("TREEFILE", "tree.log");

// 画像保存ディレクトリ。potiboard.phpから見て
// Image directory (directory root is where potiboard.php is loacted within)
define("IMG_DIR", "src/");
// サムネイル保存ディレクトリ
// Thumbnail directory (directory root is where potiboard.php is loacted within)
define("THUMB_DIR", "thumb/");
// テンポラリディレクトリ
// Temporary directory
define("TEMP_DIR", "tmp/");
// 動画(PCH)保存ディレクトリ
// Directory name of pch file
define("PCH_DIR", "src/");
// 入り口ファイル名
// Name of the index file.
define("PHP_SELF2", "index.html");
// 1ページ以降の拡張子
// File extensions for the static pages.
define("PHP_EXT", ".html");

// サムネイルを作成する する:1 しない:0
// Create thumbnail (1: Enabled, 0: Disabled).
define("USE_THUMB", "1");

// サムネイルの品質  0(品質は最低、サイズは小)～100(品質は最高、サイズは大)の範囲内
// Thumbnail quality.
// You can set this value to any numeric value from 0 to 100.
// The higher the number, the higher the quality, but the larger the size.
define("THUMB_Q", "92");
// クッキー保存日数
// Cookie expiration time (in days)  
define("SAVE_COOKIE", "30");
// 連続投稿秒数
// Number of consecutive posting seconds
define("RENZOKU", "10");
// 画像連続投稿秒数
// Number of seconds for continuous posting of images
define("RENZOKU2", "20");
// 強制sageレス数( 0 ですべてsage)
// Threshold for threads not to surface ("0" applies to all )
define("MAX_RES", "20");
// ID生成の種
// Seed of ID
define("ID_SEED", "ID_SEED");
// そろそろ消える表示のボーダー。最大ログ数からみたパーセンテージ
// Threshold that disappears soon. Percentage from maximum log count.
define("LOG_LIMIT", "92");

// [新規投稿は管理者のみ]にする する:1 しない:0
// する(1)にした場合、管理者パス以外での新規投稿はできません
// Only admins can post new articles (Yes: 1, No: 0)
// If set to "1", the administrator will require to enter their password when creating new articles.
define("DIARY", "0");

// PNG画像のファイルサイズが設定値より大きな時はJPEGに変換
// アップロードしたPNG画像もJPEGに変換します
// JPEGに変換した画像ともとのPNG画像を比較してファイルサイズが小さなほうを投稿します。
// 単位kb
// Maximum size, in KB, for PNG files.
// Files that exceed this value will be compressed as JPEG files.
define("IMAGE_SIZE", "512");	

// フォーム下の追加お知らせ
// (例)"<li>お知らせデース</li>
//     <li>サーバの規約でアダルト禁止</li>"
// 要対応テーマ
// Additional notice (needs a corresponding theme)
$addinfo="";

// 連続・二重投稿対象セキュリティレベル
// ※連続・二重投稿チェック対象を決める条件
// 0:最低　…　チェックしない
// 1:低　　…　ホストが同じログの場合(従来の条件)
// 2:中　　…　低レベルの条件に加え、名前・メールアドレス・URL・題名のいずれかが同じ場合
// 3:高　　…　低レベルの条件に加え、名前・メールアドレス・URL・題名のいずれかが類似率を上回る場合
// 4:最高　…　無条件でチェック。最新ログ20件と連続・二重投稿チェックする事になる
// ※中・高レベルのとき、未入力項目は無視
// Consecutive post security check level
// "0": Disabled
// "1": Reject if, the host is the same.
// "2": Reject if, the host, the name, the email address and the title are the same.
// "3": Reject if, the host, the name, the email address and the title are the same, depending on the similarity percentage.
// "4": Unconditionally check from the last 20 posts.
define("POST_CHECKLEVEL", "2");

// 連続・二重投稿対象セキュリティレベルが 高 のときの類似率(単位％)
// Similarity percentage for post check level 3.
define("VALUE_LIMIT", "80");

// 二重投稿セキュリティレベル
// ※二重投稿とみなす条件
// 0:最低　…　本文が一致し、画像なしの場合(従来の条件)
// 1:低　　…　本文が一致する場合
// 2:中　　…　本文が類似率(中)を上回る場合
// 3:高　　…　本文が類似率(高)を上回る場合
// Duplicate post check
// "0": No image and same post content
// "1": Duplicate post content
// "2": Similar post content (middle)
// "3": Similar post content (high)
define("D_POST_CHECKLEVEL", "1");

// 二重投稿セキュリティレベルが 中 のときの類似率(単位％)
// Similirarity percentage for duplicate post check on level 2
define("COMMENT_LIMIT_MIDDLE", "90");

// 二重投稿セキュリティレベルが 高 のときの類似率(単位％)
// Similirarity percentage for duplicate post check on level 3
define("COMMENT_LIMIT_HIGH", "80");

// 言語設定
// Language 
//In case of utf-8, it is the same no matter what you set.
define("LANG", "English");

/* ---------- お絵かき詳細設定(Advanced Setting for OEKAKI) ---------- */

// テンポラリ内のファイル有効期限(日数)
// How many days until the files in the temporary folder expire.
define("TEMP_LIMIT", "3");

// 初期レイヤー数［しぃペインターのみ］
// ※お絵かき中にレイヤー増やせるのであまり意味無い
// Default amount of layers (only Shi-Painter)
define("LAYER_COUNT", "3");

// アンドゥの回数(デフォルト)
// Maximum number of undos
define("UNDO", "90");

// アンドゥを幾つにまとめて保存しておくか(デフォルト)
// Number of undos to be bundled
define("UNDO_IN_MG", "45");

// PNGの減色率とJPEGの圧縮率
// 要対応テーマ
// PNG color reduction rate and JPEG compression rate
// Needed a theme for this feature
define("COMPRESS_LEVEL", "15");

// キャンバスクオリティの選択肢［しぃペインターのみ］
// ※最初の値がデフォルトになります
// Canvas quality choices (only Shi-Painter)
// Do not touch if you are not sure, as it may run out of memory
$qualitys = array("1","2","3","4");

// セキュリティ関連－URLとクリック数かタイマーのどちらかが設定されていれば有効
// 十分テストした上で設定して下さい
// Countermeasures against vandalism
// Please set after thorough testing.

// クリック数。設定しないなら""で
// Minimum number of drawing processes required; Not set:""
define("SECURITY_CLICK", "");
// セキュリティタイマー(単位:秒)。設定しないなら""で
// Minimum required drawing time(Seconds); Not set:""
define("SECURITY_TIMER", "");

// ペイント画面のパスワードの暗号鍵
// あまり頻繁に変えないように
// Encryption key for paint mode. (don"t change it too often)
define("CRYPT_PASS","fbgtK4pj9t8Auek");

// ↑ 暗号化と解読のためのパスワード。
// phpの内部で処理するので覚えておく必要はありません。
// 管理パスとは別なものです。
// 適当な英数字を入れてください。
// This is the internal encryption password.
// This is not the administrator password.

/* ------------- トラブルシューティング(trouble shooting) ------------- */

//問題なく動作している時は変更しない。

// urlパラメータを追加する する:1 しない:0
// ブラウザのキャッシュが表示されて投稿しても反映されない時は1。
// If the cache of the browser is displayed and not reflected even after posting, set "1".
define("URL_PARAMETER", "0");

// Permission values for the files and directories created and modified by the script.
// You should only change these lines if you get permission errors in your server when
// using the board.

//Image and HTML file permissions.
define("PERMISSION_FOR_DEST", 0606);//初期値 0606
//Log file permissions (Those are used internally by the script)
define("PERMISSION_FOR_LOG", 0600);//初期値 0600
//Directory permissions to save image and other files
define("PERMISSION_FOR_DIR", 0707);//初期値 0707

// Skinny.php cache and directory permissions
// Set in Skinny.php.

// GD2のImageCopyResampledでサムネイルの画質向上 させる:1 させない:0
// 不具合がある場合のみ 0
// Improve thumbnail image quality by using the ImageCopyResampled function 
// of PHP's GD library.
// This option should be enabled ("1") in most cases.
// But if it causes problems, set this to "0" (disabled) 
define("RE_SAMPLED", "1");

// Deny display in iframe:  (1: Deny, 0: Allow)
// We strongly recommend "Deny" to avoid security risks.
define("X_FRAME_OPTIONS_DENY", "1");

/*safety*/

//Reject if admin password is wrong for her 5 times in a row
// (1: Enabled, 0: Disabled) 
// 1: Enabled for more security, but if the login page is locked it will take more effort to unlock it.

define("CHECK_PASSWORD_INPUT_ERROR_COUNT", "0");

// Access via ftp etc.
// Remove the `templates/errorlog/error.log` and you should be able to login again.
//This file contains the IP addresses of clients who entered an incorrect admin password.