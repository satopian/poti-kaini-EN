const colorIdx = GetCookie("colorIdx");
switch (Number(colorIdx)) {
    case 1:
        document.getElementById("css1")?.removeAttribute("disabled");
        break;
    case 2:
        document.getElementById("css2")?.removeAttribute("disabled");
        break;
    case 3:
        document.getElementById("css3")?.removeAttribute("disabled");
        break;
}

function SetCss(obj) {
    if (obj instanceof HTMLSelectElement) {
        const idx = obj.selectedIndex;
        SetCookie("colorIdx", idx);
        window.location.reload();
    }
}

function GetCookie(key) {
    var tmp = document.cookie + ";";
    var tmp1 = tmp.indexOf(key, 0);
    if (tmp1 != -1) {
        tmp = tmp.substring(tmp1, tmp.length);
        var start = tmp.indexOf("=", 0) + 1;
        var end = tmp.indexOf(";", start);
        return decodeURIComponent(tmp.substring(start, end));
    }
    return "";
}

function SetCookie(key, val) {
    document.cookie =
        key + "=" + encodeURIComponent(val) + ";max-age=31536000;";
}

const select_mystyle = document.getElementById("mystyle");
if (select_mystyle instanceof HTMLSelectElement) {
    select_mystyle.selectedIndex = Number(colorIdx);
}

//shareするSNSのserver一覧を開く
var snsWindow = null; // グローバル変数としてウィンドウオブジェクトを保存する

function open_sns_server_window(event, width = 600, height = 600) {
    event.preventDefault(); // デフォルトのリンクの挙動を中断

    // 幅と高さが数値であることを確認
    // 幅と高さが正の値であることを確認
    if (isNaN(width) || width <= 350 || isNaN(height) || height <= 400) {
        width = 350; // デフォルト値
        height = 400; // デフォルト値
    }
    var url = event.currentTarget.href;
    var windowFeatures = "width=" + width + ",height=" + height; // ウィンドウのサイズを指定

    if (snsWindow && !snsWindow.closed) {
        snsWindow.focus(); // 既に開かれているウィンドウがあればフォーカスする
    } else {
        snsWindow = window.open(url, "_blank", windowFeatures); // 新しいウィンドウを開く
    }
    // ウィンドウがフォーカスを失った時の処理
    snsWindow.addEventListener("blur", function () {
        if (snsWindow.location.href === url) {
            snsWindow.close(); // URLが変更されていない場合はウィンドウを閉じる
        }
    });
}

addEventListener("DOMContentLoaded", () => {
    //URLクエリからresidを取得して指定idへページ内を移動
    const urlParams = new URLSearchParams(window.location.search);
    const resid = urlParams.get("resid");
    const document_resid = resid ? document.getElementById(resid) : null;
    if (document_resid) {
        document_resid.scrollIntoView();
    }

    document.documentElement.style.visibility = "visible";

    window.addEventListener("pageshow", function () {
        // すべてのsubmitボタンを取得
        const submitButtons = document.querySelectorAll('[type="submit"]');

        submitButtons.forEach(function (btn) {
            // ボタンを有効化
            btn.disabled = false;
        });
    });
    //JavaScriptによるCookie発行
    const paintform = document.getElementById("paint_form");
    if (paintform instanceof HTMLFormElement) {
        paintform.onsubmit = function () {
            // 二度押し防止
            const submitButton = paintform.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }
            const picwInput = paintform.elements.namedItem("picw");
            const pichInput = paintform.elements.namedItem("pich");
            const shiInput = paintform.elements.namedItem("shi");

            if (picwInput instanceof HTMLInputElement) {
                SetCookie("picwc", picwInput.value);
            }
            if (pichInput instanceof HTMLInputElement) {
                SetCookie("pichc", pichInput.value);
            }
            if (shiInput instanceof HTMLSelectElement) {
                SetCookie("appletc", shiInput.value);
            }
        };
    }
    const commentform = document.getElementById("comment_form");
    if (commentform instanceof HTMLFormElement) {
        commentform.onsubmit = function () {
            // 二度押し防止
            const submitButton = commentform.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }
            const nameInput = commentform.elements.namedItem("name");
            const urlInput = commentform.elements.namedItem("url");
            const pwdInput = commentform.elements.namedItem("pwd");

            if (nameInput instanceof HTMLInputElement) {
                SetCookie("namec", nameInput.value);
            }
            if (urlInput instanceof HTMLInputElement) {
                SetCookie("urlc", urlInput.value);
            }
            if (pwdInput instanceof HTMLInputElement) {
                SetCookie("pwdc", pwdInput.value);
            }
        };
    }
    //スマホの時はPC用のメニューを非表示
    if (navigator.maxTouchPoints && screen.width < 600) {
        const for_mobile = document.getElementById("for_mobile");
        if (for_mobile) {
            for_mobile.textContent = ".for_pc{display: none;}";
        }
    }
    //動画保存するアプリと保存しないアプリの時の表示切り替え

    const toggleHideAnimation = (usePlayback) => {
        const save_playback = document.getElementById("save_playback");
        if (save_playback) {
            save_playback.style.display = usePlayback ? "inline-block" : "none";
        }
    };
    const select_app = document.getElementById("select_app");
    // セレクトメニューの変更イベント
    if (select_app) {
        const usePlaybackApps = ["neo", "tegaki", "1", "2"];

        select_app.addEventListener("change", (e) => {
            toggleHideAnimation(usePlaybackApps.includes(e.target?.value));
        });

        // 初期値の設定を反映
        toggleHideAnimation(usePlaybackApps.includes(select_app.value));
    }
});

jQuery(function () {
    // https://cotodama.co/pagetop/
    var pagetop = $("#page_top");
    pagetop.hide();
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
            //100pxスクロールしたら表示
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });
    pagetop.on("click", function () {
        $("body,html").animate(
            {
                scrollTop: 0,
            },
            500
        ); //0.5秒かけてトップへ移動
        return false;
    });
    //Lightbox
    if (typeof lightbox !== "undefined") {
        lightbox.option({
            alwaysShowNavOnTouchDevices: true,
            disableScrolling: true,
            fadeDuration: 0,
            resizeDuration: 500,
            imageFadeDuration: 500,
            wrapAround: true,
        });
    }
});
