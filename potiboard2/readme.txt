━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  POTI-board Kai Ni
  by sakots >> https://poti-k.info/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Installation(Not translated yet)

※以下、簡易説明
potiboard.phpにアクセスするとsrcディレクトリ、thumbディレクトリ、tmpディレクトリが作成されます。

　設定は、config.phpを書き換えて行います。
　各ファイルを置いたらpotiboard.phpをブラウザから呼出します(必要なファイ
　ルが自動設定されます)

【ディレクトリ構造】
./-- ルート
  ｜.htaccess
  ｜config.php
  ｜htmltemplate.inc
  ｜potiboard.php
  ｜thumbnail_gd.php
  ｜loadcookie.js
  ｜
  ｜※NEO本体
  ｜neo.js
  ｜neo.css
  ｜
  ＋--./src/       ディレクトリ
  ＋--./thumb/     ディレクトリ
　＋--./theme/     ディレクトリ(テーマのディレクトリはconfigで設定できます)
    ｜.htaccess
    ｜template_ini.php
    ｜mono_catalog.html
    ｜mono_main.html
    ｜mono_other.html
    ｜mono_paint.html
    ｜siihelp.php
　　＋--./css/　　 ディレクトリ(cssが入っています)
      ｜mono_main.css
      ｜mono_main.css.map
      ｜mono_main.scss
      ｜_mono_conf.scss
      ｜など


※お絵かき機能を使用する場合、下記を追加
./-- 同ルート
  ｜picpost.php
  ｜palette.txt
  ｜
  ＋--./tmp/       ディレクトリ
  ｜
＝＝＝以下のファイルはしぃちゃんのホームページ（Vector）より入手してください＝＝＝＝
  ｜             http://hp.vector.co.jp/authors/VA016309/ 
  ｜
  ｜PaintBBS.jar     バイナリ ※PaintBBSを使用する場合
  ｜spainter_all.jar バイナリ ※しぃペインターを使用する場合
  ｜PCHViewer.jar    バイナリ ※しぃペインター対応版
  ｜
＝＝＝NEOを使用する場合以下をfunigeさんのところから入手してください＝＝＝＝
  ｜            https://github.com/funige/neo/ 
  ｜
  ｜neo.js
  ｜neo.css
  ｜

※メール通知機能を使用する場合、下記を追加
./-- 同ルート
  ｜noticemail.inc
→php7対応版を同梱いたしました
