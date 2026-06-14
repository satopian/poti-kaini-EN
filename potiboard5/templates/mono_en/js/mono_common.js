"use strict";
// @ts-check

//ブラウザの優先言語が日本語以外の時は英語で表示
/**
 * @type {string}
 */
// @ts-ignore
const lang = (
    navigator.languages?.[0] ||
    navigator.language ||
    ""
).toLowerCase();
/**
 * @type {boolean}
 */
// @ts-ignore
const en = lang.startsWith("ja") ? false : true;

/**
 * @description Cookieから値を取得する
 * @param {string} key
 * @returns {string}
 */
const GetCookie = (key) => {
    var tmp = document.cookie + ";";
    var tmp1 = tmp.indexOf(key, 0);
    if (tmp1 != -1) {
        tmp = tmp.substring(tmp1, tmp.length);
        var start = tmp.indexOf("=", 0) + 1;
        var end = tmp.indexOf(";", start);
        return decodeURIComponent(tmp.substring(start, end));
    }
    return "";
};

/**
 * @description CookieからcolorIdxを取得して、対応するCSSを有効化する
 */
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

/**
 * @description 選択されたスタイルをCookieに保存する
 * @param {HTMLSelectElement} selectEl
 * @returns {void}
 */
const SetCss = (selectEl) => {
    if (selectEl instanceof HTMLSelectElement) {
        const idx = selectEl.selectedIndex;
        SetCookie("colorIdx", idx.toString());
        window.location.reload();
    }
};
/**
 * @description Cookieに値を保存する
 * @param {string} key
 * @param {string} val
 * @returns {void}
 */
const SetCookie = (key, val) => {
    document.cookie =
        key + "=" + encodeURIComponent(val) + ";max-age=31536000;";
};
/**
 * @description ページが読み込まれたときに、CookieからcolorIdxを取得して、セレクトメニューの選択状態を更新する
 * @returns {void}
 */
const select_mystyle = document.getElementById("mystyle");
if (select_mystyle instanceof HTMLSelectElement) {
    select_mystyle.selectedIndex = Number(colorIdx);
}

//shareするSNSのserver一覧を開く
var snsWindow = null; // グローバル変数としてウィンドウオブジェクトを保存する
/**
 * @description SNSのserver一覧を開く
 * @param {Event} event
 * @param {number} width
 * @param {number} height
 * @return {void}
 */
//@ts-ignore
const open_sns_server_window = (event, width = 600, height = 600) => {
    event.preventDefault(); // デフォルトのリンクの挙動を中断

    // 幅と高さが数値であることを確認
    // 幅と高さが正の値であることを確認
    if (isNaN(width) || width <= 350 || isNaN(height) || height <= 400) {
        width = 350; // デフォルト値
        height = 400; // デフォルト値
    }
    const target = event.currentTarget;

    var url = target instanceof HTMLAnchorElement ? target.href : "";
    if (!url) {
        return console.error("failed to get URL from the clicked element.");
    }
    var windowFeatures = "width=" + width + ",height=" + height; // ウィンドウのサイズを指定

    if (snsWindow && !snsWindow.closed) {
        snsWindow.focus(); // 既に開かれているウィンドウがあればフォーカスする
    } else {
        snsWindow = window.open(url, "_blank", windowFeatures); // 新しいウィンドウを開く
    }
    /**
     * @description ウィンドウがフォーカスを失った時の処理
     */
    snsWindow.addEventListener("blur", () => {
        if (snsWindow.location.href === url) {
            snsWindow.close(); // URLが変更されていない場合はウィンドウを閉じる
        }
    });
};

/**
 * @description ページが表示されたときに、すべてのsubmitボタンを有効化する
 * @returns {void}
 */
window.addEventListener("pageshow", () => {
    // すべてのsubmitボタンを取得
    const submitButtons = document.querySelectorAll('[type="submit"]');

    /**
     * @description すべてのsubmitボタンを有効化する
     * @param {HTMLInputElement} btn
     */
    submitButtons.forEach((btn) => {
        if (btn instanceof HTMLInputElement) {
            // ボタンを有効化
            btn.disabled = false;
        }
    });
});

addEventListener("DOMContentLoaded", () => {
    /**
     * @description URLクエリからresidを取得して指定idへページ内を移動
     */
    const urlParams = new URLSearchParams(window.location.search);
    const resid = urlParams.get("resid");
    const document_resid = resid ? document.getElementById(resid) : null;
    if (document_resid) {
        document_resid.scrollIntoView();
    }

    document.documentElement.style.visibility = "visible";

    /**
     * @description JavaScriptによるCookie発行
     */
    const paintform = document.getElementById("paint_form");
    if (paintform instanceof HTMLFormElement) {
        /**
         * @description paint_formのsubmitイベントでCookieを発行、二度押しを防止する
         */
        paintform.onsubmit = () => {
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
        /**
         * @description comment_formのsubmitイベントでCookieを発行、二度押しを防止する
         */
        commentform.onsubmit = (e) => {
            e.preventDefault(); // フォームのデフォルトの送信を防ぐ

            //自動化ツールによる自動送信を拒否する
            const languages_length0 = navigator.languages.length === 0;
            const webdriver = navigator.webdriver;
            if (webdriver || languages_length0) {
                alert(en ? "The post has been rejected." : "拒絶されました。");
                return;
            }

            /**
             * @description Cookie発行
             */
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

    /**
     * @description スマホの時はPC用のメニューを非表示
     */
    if (navigator.maxTouchPoints && screen.width < 600) {
        const for_mobile = document.getElementById("for_mobile");
        if (for_mobile) {
            for_mobile.textContent = ".for_pc{display: none;}";
        }
    }
    //動画保存するアプリと保存しないアプリの時の表示切り替え

    /**
     * 動画保存するアプリと保存しないアプリの時の表示切り替え
     * @param {boolean} usePlayback
     */
    const toggleHideAnimation = (usePlayback) => {
        const save_playback = document.getElementById("save_playback");
        if (save_playback) {
            save_playback.style.display = usePlayback ? "inline-block" : "none";
        }
    };
    const select_app = document.getElementById("select_app");
    /**
     * @description セレクトメニューの変更イベント
     */
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
/**
 * スクロールすると出てくるトップに戻るボタン
 * Petit Note (c)さとぴあ satopian 2021-2026 MIT License
 * https://paintbbs.sakura.ne.jp/
 */
//@ts-ignore
class petitNoteScrollToTop {
    constructor() {
        this.pagetop = document.getElementById("page_top");
        /**@type {number} */
        this.scrollTimeout; // スクロールが停止したタイミングをキャッチするタイマー
        if (!this.pagetop) {
            return; // pagetopが存在しない場合は処理を終了
        }
        // 初期状態で非表示
        const cssOpacity = getComputedStyle(this.pagetop).opacity; // CSSから最大opacity取得
        // CSSで設定されているopacityの値を動的に取得（上限として使用）
        const parseFloatOpacity = parseFloat(cssOpacity);
        this.maxOpacity = parseFloatOpacity;
        this.pagetop.style.visibility = "hidden"; // 初期状態で非表示
        this.pagetop.style.opacity = "0"; // 初期opacityを0に設定
        this.listener();
    }

    /**
     * フェードイン/フェードアウトを管理する関数
     * @param {HTMLElement} el
     * @param {number} to 0でフェードアウト、1でフェードイン
     * @param {number} duration フェードの持続時間（ミリ秒）
     */
    fade(el, to, duration = 500) {
        const startOpacity = parseFloat(el.style.opacity || "0");
        let startTime = performance.now();
        /**@type {FrameRequestCallback} */
        const fadeStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            let opacity = startOpacity + (to - startOpacity) * progress;

            if (typeof this.maxOpacity === "number") {
                opacity = Math.min(opacity, this.maxOpacity);
            }
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
    }

    /**
     * スムーススクロール
     * @param {number} duration
     */
    smoothScrollToTop(duration = 500) {
        // 0.5秒かけてスクロール
        const start = window.scrollY;
        const startTime = performance.now();
        /**@type {FrameRequestCallback} */
        const scrollStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out効果

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            } else {
                if (this.pagetop) {
                    this.fade(this.pagetop, 0, 500); // スクロール完了後にフェードアウト
                }
            }
        };

        requestAnimationFrame(scrollStep);
    }

    listener() {
        /**
         * スクロール時の処理
         */
        window.addEventListener("scroll", () => {
            // スクロール開始後に表示
            if (
                window.scrollY > 100 &&
                this.pagetop?.style.visibility === "hidden"
            ) {
                this.fade(this.pagetop, 1, 500); // 0.5秒でフェードイン
            }

            // スクロール停止後に非表示
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                if (window.scrollY <= 100) {
                    if (this.pagetop) {
                        this.fade(this.pagetop, 0, 200); // 0.2秒でフェードアウト
                    }
                }
            }, 200); // 200msの遅延で非表示
        });

        /**
         * トップに戻るボタンがクリックされたときの処理
         * @param {Event} e
         */
        this.pagetop?.addEventListener("click", (e) => {
            e.preventDefault();
            this.smoothScrollToTop(500); // 0.5秒でスクロール
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new petitNoteScrollToTop();
});

/**
 * 画像ファイルを添付
 * Petit Note (c)さとぴあ satopian 2021-2026 MIT License
 * https://paintbbs.sakura.ne.jp/
 */
//@ts-ignore
class petitNoteImagePreview {
    constructor() {
        this.preview = document.getElementById("attach_preview");
        //添付ファイルを削除するボタン
        this.removeAttachmentBtn = document.getElementById(
            "remove_attachment_btn",
        );
        if (this.removeAttachmentBtn) {
            this.removeAttachmentBtn.style.cursor = "pointer";
        }
        this.fileInput = document.querySelector(
            '#comment_form input[type="file"]',
        );

        this.setupFilePreviewAndSizeCheck("comment_form");
        this.setupFilePreviewAndSizeCheck("paint_form");

        this.listener();
    }
    /**
     * @description 画像プレビューをクリアする
     * @returns {void}
     */
    clear_css_preview() {
        const preview = this.preview;
        if (preview instanceof HTMLImageElement) {
            preview.src = ""; // メモリ上の画像を表示
            preview.src = ""; // メモリ上の画像を表示
            preview.style.marginTop = "";
            preview.style.marginBottom = "";
            preview.style.height = ""; //高さのリセット
            preview.style.display = "none"; //非表示
        }
        //選択解除リンクを非表示
        if (this.removeAttachmentBtn) {
            this.removeAttachmentBtn.style.display = "none";
        }
        if (this.fileInput instanceof HTMLInputElement) {
            this.fileInput.value = "";
            this.fileInput.style.width = "";
        }
    }
    /**
     * ファイルサイズチェック
     * @param {string} formId
     * @returns {void}
     */
    setupFilePreviewAndSizeCheck(formId) {
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
                            : "ファイルサイズが大きすぎます。",
                    );
                    target.value = ""; // 入力をクリア
                    this.clear_css_preview();
                    return;
                }
                // paint_formの時は画像プレビュー表示しない
                if (formId === "paint_form") {
                    return;
                }
                if (this.fileInput instanceof HTMLInputElement) {
                    this.fileInput.style.width = "inherit";
                }
                //選択解除リンクを表示
                if (this.removeAttachmentBtn) {
                    this.removeAttachmentBtn.style.display = "inline-block";
                }
                //画像プレビュー表示
                const reader = new FileReader();
                const preview = this.preview;
                reader.onload = (e) => {
                    if (reader && preview instanceof HTMLImageElement) {
                        const result = e.target && e.target.result;
                        if (typeof result === "string") {
                            const testImg = new Image();
                            testImg.src = result;
                            testImg.onload = () => {
                                preview.src = result; // メモリ上の画像を表示
                                preview.style.marginTop = "15px";
                                preview.style.marginBottom = "8px";
                                preview.style.height = "fit-content"; //高さ自動調整
                                preview.style.display = "block"; //表示
                            };
                            testImg.onerror = () => {
                                this.clear_css_preview();
                                alert(
                                    en
                                        ? "This file is an unsupported format."
                                        : "対応していないファイル形式です。",
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
                this.clear_css_preview();
            }
        });
    }
    listener() {
        this.removeAttachmentBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            this.clear_css_preview();
        });

        /**
         * @description ページが表示されたときに、comment_formとpaint_formのファイル入力をクリアする
         * @returns {void}
         */
        window.addEventListener("pageshow", () => {
            const formIds = ["comment_form", "paint_form"];
            formIds.forEach((id) => {
                const form = document.getElementById(id);
                if (form instanceof HTMLFormElement) {
                    const fileInputs =
                        form.querySelectorAll('input[type="file"]');
                    fileInputs.forEach((input) => {
                        if (input instanceof HTMLInputElement) {
                            input.value = "";
                        }
                    });
                }
            });
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new petitNoteImagePreview();
});

jQuery(function () {
    //Lightbox
    // @ts-ignore
    if (typeof lightbox !== "undefined") {
        // @ts-ignore
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
