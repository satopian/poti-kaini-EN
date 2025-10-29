//ブラウザの優先言語が日本語以外の時は英語で表示
const lang = (
    navigator.languages?.[0] ||
    navigator.language ||
    ""
).toLowerCase();
const en = lang.startsWith("ja") ? false : true;

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
    snsWindow.addEventListener("blur", () => {
        if (snsWindow.location.href === url) {
            snsWindow.close(); // URLが変更されていない場合はウィンドウを閉じる
        }
    });
}
window.addEventListener("pageshow", () => {
    // すべてのsubmitボタンを取得
    const submitButtons = document.querySelectorAll('[type="submit"]');

    submitButtons.forEach(function (btn) {
        if (btn instanceof HTMLInputElement) {
            // ボタンを有効化
            btn.disabled = false;
        }
    });
});
addEventListener("DOMContentLoaded", () => {
    //URLクエリからresidを取得して指定idへページ内を移動
    const urlParams = new URLSearchParams(window.location.search);
    const resid = urlParams.get("resid");
    const document_resid = resid ? document.getElementById(resid) : null;
    if (document_resid) {
        document_resid.scrollIntoView();
    }

    document.documentElement.style.visibility = "visible";

    //JavaScriptによるCookie発行
    const paintform = document.getElementById("paint_form");
    if (paintform instanceof HTMLFormElement) {
        paintform.onsubmit = function () {
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
            // 二度押し防止
            const submitButton = paintform.querySelector('[type="submit"]');
            if (submitButton instanceof HTMLInputElement) {
                submitButton.disabled = true;
            }
        };
    }
    const commentform = document.getElementById("comment_form");
    if (commentform instanceof HTMLFormElement) {
        commentform.onsubmit = function (e) {
            e.preventDefault(); // フォームのデフォルトの送信を防ぐ

            //自動化ツールによる自動送信を拒否する
            const languages_length0 = navigator.languages.length === 0;
            const webdriver = navigator.webdriver;
            if (webdriver || languages_length0) {
                alert(en ? "The post has been rejected." : "拒絶されました。");
                return;
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
            // JSからの送信であることを示す hidden フィールドを追加
            const hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = "js_submit_flag";
            hidden.value = "1";
            commentform.appendChild(hidden);
            const submitButton = commentform.querySelector('[type="submit"]');
            if (submitButton instanceof HTMLInputElement) {
                // 二度押し防止
                submitButton.disabled = true;
                // フォームを送信
                submitButton.form?.submit();
            }
        };
    }
    const preview = document.getElementById("attach_preview");
    const removeAttachmentBtn = document.getElementById(
        "remove_attachment_btn"
    );
    if (removeAttachmentBtn) {
        removeAttachmentBtn.style.cursor = "pointer";
    }

    const fileInput = document.querySelector(
        '#comment_form input[type="file"]'
    );

    const clear_css_preview = () => {
        if (preview instanceof HTMLImageElement) {
            preview.src = ""; // メモリ上の画像を表示
            preview.src = ""; // メモリ上の画像を表示
            preview.style.marginTop = "";
            preview.style.marginBottom = "";
            preview.style.height = ""; //高さ自動調整
            preview.style.display = "none"; //非表示
        }
        //選択解除リンクを非表示
        if (removeAttachmentBtn) {
            removeAttachmentBtn.style.display = "none";
        }
        if (fileInput instanceof HTMLInputElement) {
            fileInput.value = "";
            fileInput.style.width = "";
        }
    };
    // ファイルサイズチェック
    const setupFilePreviewAndSizeCheck = (formId) => {
        const form = document.getElementById(formId);
        if (!(form instanceof HTMLFormElement)) return;

        const maxInput = form.querySelector('input[name="MAX_FILE_SIZE"]');
        if (!(maxInput instanceof HTMLInputElement)) return;

        const maxSize = parseInt(maxInput.value, 10);

        form.addEventListener("change", (e) => {
            const target = e.target;

            if (
                target instanceof HTMLInputElement &&
                target.type === "file" &&
                target.files &&
                target.files.length > 0
            ) {
                const file = target.files?.[0];
                if (file && file.size > maxSize) {
                    alert(
                        en
                            ? "The file is too large."
                            : "ファイルサイズが大きすぎます。"
                    );
                    clear_css_preview();
                    target.value = ""; // 入力をクリア
                    return;
                }
                // paint_formの時は画像プレビュー表示しない
                if (formId === "paint_form") {
                    return;
                }
                if (fileInput instanceof HTMLInputElement) {
                    fileInput.style.width = "inherit";
                }
                //選択解除リンクを表示
                if (removeAttachmentBtn) {
                    removeAttachmentBtn.style.display = "inline-block";
                }
                //画像プレビュー表示
                const reader = new FileReader();

                reader.onload = function (e) {
                    if (reader && preview instanceof HTMLImageElement) {
                        const result = e.target && e.target.result;
                        if (typeof result === "string") {
                            const testImg = new Image();
                            testImg.src = result;
                            testImg.onload = () => {
                                preview.style.height = "fit-content"; //高さ自動調整
                                preview.src = result; // メモリ上の画像を表示
                                preview.style.marginTop = "15px";
                                preview.style.marginBottom = "8px";
                                preview.style.display = "block"; //表示
                            };
                            testImg.onerror = () => {
                                clear_css_preview();
                                alert(
                                    en
                                        ? "This file is an unsupported format."
                                        : "対応していないファイル形式です。"
                                );
                                return;
                            };
                        }
                    }
                };
                if (file instanceof Blob) {
                    reader.readAsDataURL(file);
                }
            } else {
                //ファイル添付が解除された時
                clear_css_preview();
            }
        });
    };
    setupFilePreviewAndSizeCheck("comment_form");
    setupFilePreviewAndSizeCheck("paint_form");

    removeAttachmentBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        clear_css_preview();
    });

    window.addEventListener("pageshow", () => {
        const formIds = ["comment_form", "paint_form"];
        formIds.forEach((id) => {
            const form = document.getElementById(id);
            if (form instanceof HTMLFormElement) {
                const fileInputs = form.querySelectorAll('input[type="file"]');
                fileInputs.forEach((input) => {
                    input.value = "";
                });
            }
        });
    });

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
    if (select_app instanceof HTMLSelectElement) {
        const usePlaybackApps = ["neo", "tegaki", "1", "2"];

        select_app.addEventListener("change", (e) => {
            if (!(e.target instanceof HTMLSelectElement)) return;
            toggleHideAnimation(usePlaybackApps.includes(e.target.value));
        });

        // 初期値の設定を反映
        toggleHideAnimation(usePlaybackApps.includes(select_app.value));
    }
});

//スクロールすると出てくるトップに戻るボタン
document.addEventListener("DOMContentLoaded", () => {
    const pagetop = document.getElementById("page_top");
    let scrollTimeout; // スクロールが停止したタイミングをキャッチするタイマー
    if (!pagetop) {
        return; // pagetopが存在しない場合は処理を終了
    }
    // 初期状態で非表示
    const cssOpacity = getComputedStyle(pagetop).opacity; // CSSから最大opacity取得
    // CSSで設定されているopacityの値を動的に取得（上限として使用）
    const maxOpacity = parseFloat(cssOpacity);
    pagetop.style.visibility = "hidden"; // 初期状態で非表示
    pagetop.style.opacity = "0"; // 初期opacityを0に設定

    // フェードイン/フェードアウトを管理する関数
    const fade = (el, to, duration = 500) => {
        const startOpacity = parseFloat(el.style.opacity || 0);
        let startTime = performance.now();

        const fadeStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            let opacity = startOpacity + (to - startOpacity) * progress;

            // opacityの上限をmaxOpacity（CSSで指定された値）に設定
            opacity = opacity > maxOpacity ? maxOpacity : opacity; // 上限を超えないようにする

            el.style.opacity = opacity.toFixed(2);

            if (progress < 1) {
                requestAnimationFrame(fadeStep);
            } else {
                if (to === 0) {
                    el.style.visibility = "hidden"; // 完全にフェードアウトしたら非表示
                }
            }
        };

        if (to === 1) {
            el.style.visibility = "visible"; // フェードインで表示
        }

        requestAnimationFrame(fadeStep);
    };

    // スクロール時の処理
    window.addEventListener("scroll", () => {
        // スクロール開始後に表示
        if (window.scrollY > 100 && pagetop?.style.visibility === "hidden") {
            fade(pagetop, 1, 500); // 0.5秒でフェードイン
        }

        // スクロール停止後に非表示
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY <= 100) {
                fade(pagetop, 0, 200); // 0.2秒でフェードアウト
            }
        }, 200); // 200msの遅延で非表示
    });

    // スムーススクロール
    const smoothScrollToTop = (duration = 500) => {
        // 0.5秒かけてスクロール
        const start = window.scrollY;
        const startTime = performance.now();

        const scrollStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out効果

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            } else {
                fade(pagetop, 0, 500); // スクロール完了後にフェードアウト
            }
        };

        requestAnimationFrame(scrollStep);
    };

    // トップに戻るボタンがクリックされたとき
    pagetop?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollToTop(500); // 0.5秒でスクロール
    });
});

jQuery(function () {
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
