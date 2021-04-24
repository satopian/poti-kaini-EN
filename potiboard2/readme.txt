━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  POTI-board改二
  by POTI改 >> https://pbbs.sakura.ne.jp/poti/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このスクリプトは「ぷにゅねっと」 http://www.punyu.net/php/ の
POTI-board v1.32 をphp7に対応させて改造した
POTI-board改 をさらに発展させたものです。

「Skinny.php」 http://skinny.sx68.net/ 
のおかげで、自由にデザインできるようになってます。

ちなみに、名前は
Punyu.net　Oekaki　Template　Image　の頭文字を取って「POTI」らしいです。

■ご注意

万が一、このスクリプトにより何らかの損害が発生しても、その責任を私は
負いません。自己の責任で利用して下さい。

配布条件は「レッツPHP!」に準じます。改造、再配布は自由にどうぞ。

■バージョンアップ方法　※POTI-board改二 v2.0以降が前提

・本体
config.php 以外は解凍したファイルで置き換え。
config.php に設定したい追加項目があれば $ADMIN_PASS = 'kanripass'; より下に追加する。

・テーマ
アップロードして、管理画面より「ログ更新」を行って下さい。

■設置方法

※以下、簡易説明

設定は、config.phpを書き換えて行います。
各ファイルを置いたら、設置したURLにアクセスすると初期設定が行われます。
（※2020年7月23日以前のバージョンのPOTI-boardはpotiboard.phpを手動で呼び出す必要があります）

詳細な設定をする前に、何も設定を変えない状態で動くかどうか確かめておくのが良いです。

【ディレクトリ構造】
./-- ルート
  ｜.htaccess
  ｜config.php
  ｜Skinny.php
  ｜potiboard.php
  ｜thumbnail_gd.php
  ｜loadcookie.js
  ｜index.php
  ｜picpost.php
  ｜search.php
  ｜security_c.html
  ｜palette.txt
  ｜
  ｜※NEO本体 (最新版ではない可能性はあります)
  ｜neo.js
  ｜neo.css
  ｜
  ｜※しぃちゃん
  ｜PaintBBS.jar
  ｜PCHViewer.jar
  ｜spainter_all.jar
  ｜
  ｜readme_pch.html
  ｜Readme_Shichan.html
  ｜
　＋--./theme/     ディレクトリ(テーマのディレクトリはconfigで設定できます)
    ｜.htaccess
    ｜template_ini.php
    ｜mono_catalog.html
    ｜mono_main.html
    ｜mono_other.html
    ｜mono_paint.html
    ｜jquery-3.5.1.min.js
　　＋--./css/　　 ディレクトリ(cssが入っています)
      ｜mono_dark.css
      ｜mono_deep.css
      ｜mono_main.css
      ｜mono_mayo.css

※メール通知機能を使用する場合、下記を追加
./-- 同ルート
  ｜noticemail.inc
→php7対応版を同梱いたしました


■thanks!!

【ぷにゅねっと https://www.punyu.net/ SakaQさん】
POTI改二の親です。

【sakotsさん】
POTI-boardの再開発の企画立案者であり各種テーマの作者。
この人がいなかったら、POTI-boardは消えていたかもしれません。
【さとぴあさん】
バグ修正、セキュリティ向上、スピードアップ等していただいています。大感謝。

以下SakaQさんのthanks 引用
| 
| 【ちょむ工房 https://chomstudio.com/ のTakeponG殿】
| picpost.cgi のPHP化ありがとうございます。これのおかげで開発する意欲が
| 沸きました。
| 
| 【BBS NOTE, PaintBBS(藍珠CGI) その他のお絵かき系CGI】
| いろいろ‥かなり‥パクリました。特にBBS NOTE。
| やっぱ、BBS NOTEはスゲーや。
| 
| 【菅処】
| サムネイル作成でお世話になりました。
| ここのバイナリが無ければこのスクリプトは日の目をみなかったでしょう。
| 
| 【ふたば★ちゃんねる】
| ビバ！虹裏としあきーず・・・て、ち（ry
| 
| 【レッツPHP!】
| いつも勉強になります。もうここ無しではPHP作れないって感じです。
| 
| 【BBSに書き込んでくれる方々】
| 不具合報告、貴重な意見等々・・・ホントに助かってます！
| 
引用ここまで

■著作権

POTI-boaed改二                     (c)POTI改

search.php                         (c)satopian

POTI-board v1.32                   (C)SakaQ「ぷにゅねっと」

【オリジナルスクリプト】
画像BBS v3.0                       (C)TOR「レッツPHP!」
+ futaba.php v0.8 lot.031015      (C)futaba「ふたば★ちゃんねる」

【テンプレートクラス】
Skinny.php                        (C)Kuasuki

【お絵かき側】
PaintBBS(test by v2.22_8)
しぃペインター(test by v1.071all)
PCH Viewer(test by v1.12)          (C)しぃちゃん「しぃ堂」
WCS 動的パレットコントロールセット  (C)のらネコ「WonderCatStudio」

PaintBBS NEO                      (c)funige

■変更履歴はgithub参照
