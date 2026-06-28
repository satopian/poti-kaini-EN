"use strict";
//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  if (Neo.init()) {
    if (!navigator.userAgent.match("Electron")) {
      Neo.start();
    }
  }
  document.addEventListener(
    "dblclick",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    {
      passive: false,
    },
  );
});

var Neo = {};

Neo.version = "1.7.10";
// @ts-ignore
/** @type {Neo.Painter} */
Neo.painter;

Neo.fullScreen = false;
Neo.uploaded = false;
Neo.viewer = false;
/**@type  {HTMLElement|null} */
Neo.container = null;
/**@type {HTMLElement|null} */
Neo.center = null;
/**@type {HTMLElement|null} */
Neo.canvas = null;
/**@type {HTMLElement|null} */
Neo.toolsWrapper = null;
/**@type {HTMLElement|null} */
Neo.tools = null;
Neo.toolSide = false;
/**@type {HTMLElement|null} */
Neo.applet = null;
Neo.isAnimation = false;
Neo.storage = localStorage;
/**@type {HTMLElement|null} */
Neo.elementNeo = null;
Neo.elementNeo_touchMoveListenerAdded = false;
/** @returns {boolean} */
Neo.isPinchZooming = function () {
  return false;
};
Neo.updateUI = function () {};
Neo.stabilize_level = 1;
/** @type {CSSStyleSheet|null}*/
Neo.styleSheet = null;
/** @type {any} **/
Neo.rules = {};
/** @type {any} **/
Neo.config = {
  width: 300,
  height: 300,

  colors: [
    "#000000",
    "#FFFFFF",
    "#B47575",
    "#888888",
    "#FA9696",
    "#C096C0",
    "#FFB6FF",
    "#8080FF",
    "#25C7C9",
    "#E7E58D",
    "#E7962D",
    "#99CB7B",
    "#FCECE2",
    "#F9DDCF",
  ],
};
Neo.reservePen = {};
Neo.reserveEraser = {};
//@ts-ignore
/**@type {Neo.Button|null} */
Neo.submitButton = null;
//@ts-ignore
/**@type {Neo.FillButton|null} */
Neo.fillButton = null;
//@ts-ignore
/**@type {Neo.RightButton|null} */
Neo.rightButton = null;
// toolTip
//@ts-ignore
/**@type {Neo.PenTip|null} */
Neo.penTip = null;
//@ts-ignore
/**@type {Neo.Pen2Tip|null} */
Neo.pen2Tip = null;
//@ts-ignore
/**@type {Neo.EffectTip|null} */
Neo.effectTip = null;
//@ts-ignore
/**@type {Neo.Effect2Tip|null} */
Neo.effect2Tip = null;
//@ts-ignore
/**@type {Neo.EraserTip|null} */
Neo.eraserTip = null;
//@ts-ignore
/**@type {Neo.DrawTip|null} */
Neo.drawTip = null;
//@ts-ignore
/**@type {Neo.MaskTip|null} */
Neo.maskTip = null;

Neo.isApp = false;
// @ts-ignore
/**@type {Neo.ViewerBar|null} */
Neo.viewerBar = null;
// @ts-ignore
/**@type {Neo.ViewerButton|null} */
Neo.viewerPlay = null;
// @ts-ignore
/**@type {Neo.ViewerButton|null} */
Neo.viewerStop = null;
// @ts-ignore
/**@type {Neo.ViewerButton|null} */
Neo.viewerSpeed = null;
Neo.speed = 0;
/**@type {object|null} */
Neo.params = null;
/**@type {object|null} */
Neo.param = null;

Neo.SLIDERTYPE_RED = 0;
Neo.SLIDERTYPE_GREEN = 1;
Neo.SLIDERTYPE_BLUE = 2;
Neo.SLIDERTYPE_ALPHA = 3;
Neo.SLIDERTYPE_SIZE = 4;

/** @param {TouchEvent} e */
Neo.touch_move_grid_control = function (e) {};
Neo.add_touch_move_grid_control = function () {};

/**
 *  @type {any} *
 *  @note ライブコネクト
 */
(document).neo = Neo;

/**
 * 起動設定（paramの中身）を抽出する
 * @param {string} targetName - "paintbbs" | "pch"
 */
Neo.extractBootConfig = function (targetName) {
  // 1. 外部で設定されたObjectの場合
  Neo.params = Neo.params || Neo.param; //エイリアス。`Neo.params`でも、単数形の`Neo.param`でも設定できる。
  if (
    Neo.params &&
    typeof Neo.params === "object" &&
    Object.keys(Neo.params).length > 0
  ) {
    /** @type {any} */
    const params = Neo.params;
    return params[targetName] ? { ...params[targetName] } : {};
  }

  // 2. DOMの探索（指定された名前を持つ要素を最初に1つ見つける）
  // targetName が "paintbbs" なら .neo-applet-paintbbs を探す
  const applet = `applet[name="${targetName}"], applet-dummy[name="${targetName}"], .neo-applet-${targetName}`;
  /**@type {HTMLElement|null} */
  const node = document.querySelector(applet);

  if (!node) return {};

  // 3. paramタグの中身だけを抽出

  /** @type {Record<string, string>} */
  const config = {};
  const params = node.querySelectorAll("param");
  for (const param of params) {
    const key = param.getAttribute("name");
    const val = param.getAttribute("value");
    if (key) {
      config[key] = Neo.fixConfig(String(val));
    }
  }

  return config;
};

Neo.init = function () {
  //appletタグまたはそれに代わるdivタグのID
  let applets = document.querySelectorAll(
    "applet,applet-dummy,.neo-applet-paintbbs,.neo-applet-pch",
  );

  for (const applet of applets) {
    if (applet instanceof HTMLElement) {
      let name = applet.getAttribute("name");
      // name属性がない場合、クラス名から探す
      if (!name) {
        for (const className of applet.classList) {
          if (className.startsWith("neo-applet-")) {
            name = className.replace("neo-applet-", "");
            break; // 見つかったら終了
          }
        }
      }
      if (name == "paintbbs" || name == "pch") {
        Neo.applet = applet;

        if (name == "paintbbs") {
          Neo.initConfig(applet);
          Neo.createContainer(applet);
          Neo.init2();
        } else {
          Neo.viewer = true;
          Neo.initConfig(applet);

          var filename = Neo.getFilename();
          Neo.getPCH(filename, function (pch) {
            if (pch) {
              Neo.createViewer(applet);
              Neo.config.width = pch.width;
              Neo.config.height = pch.height;
              Neo.initViewer(pch);
              // Neo.initViewer()内へ移動
              // ボタンが表示される前に再生される事があるため
              // Neo.startViewer();
            }
          });
        }
        return true;
      }
    }
  }
  return false;
};
Neo.init2 = function () {
  const pageview = document.getElementById("neo-pageView");
  if (!pageview) return;
  pageview.style.width = Neo.config.applet_width + "px";
  pageview.style.height = Neo.config.applet_height + "px";

  Neo.canvas = document.getElementById("neo-canvas");
  if (!Neo.canvas) {
    console.error("initViewer: Canvas element not found");
    return;
  }
  Neo.container = document.getElementById("neo-container");
  if (!Neo.container) {
    console.error("init2: Container element not found");
    return;
  }

  Neo.toolsWrapper = document.getElementById("neo-toolsWrapper");
  Neo.tools = document.getElementById("neo-tools");
  Neo.center = document.getElementById("neo-center");
  if (
    Neo.center &&
    Neo.container &&
    Neo.container.clientWidth &&
    Neo.container.clientWidth >= 400 &&
    Neo.config.neo_disable_neo_center_min_width != "true"
  ) {
    Neo.center.style.minWidth = "397px";
  }

  Neo.painter = new Neo.Painter();
  Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);

  Neo.container.oncontextmenu = function () {
    return false;
  };

  // 動画記録
  Neo.isAnimation = Neo.config.thumbnail_type == "animation";

  // 続きから描く
  Neo.storage = localStorage; //PCの時にもlocalStorageを使用

  var filename = Neo.getFilename();
  var message =
    !filename || filename.slice(-4).toLowerCase() != ".pch"
      ? "描きかけの画像があります。復元しますか？"
      : "描きかけの画像があります。動画の読み込みを中止して復元しますか？";

  /**@type {string|null} */
  let storageTimestamp = Neo.storage.getItem("timestamp");
  const nowTimestamp = Date.now();

  if (
    Number.isInteger(Number(storageTimestamp)) &&
    nowTimestamp - Number(storageTimestamp) > 3 * 86400 * 1000
  ) {
    //3日経過した復元データは破棄
    Neo.painter.clearSession();
    storageTimestamp = null;
  }
  if (storageTimestamp && confirm(Neo.translate(message))) {
    var oe = Neo.painter;
    setTimeout(function () {
      oe.loadSession(function () {
        oe._pushUndo();
        oe._actionMgr.restore();
        //復元時にサイズが違うキャンバスで開き直した時に画像が切り取られないようにするため
        //復元処理の直後はデータが変更されていない事にする
        oe.dirty = false;
      });
    }, 1);
  } else {
    //復元しないを選択した時
    Neo.painter.clearSession();
    if (filename) {
      if (filename.slice(-4).toLowerCase() == ".pch") {
        Neo.painter.loadAnimation(filename);
      } else {
        Neo.painter.loadImage(filename);
      }
    }
  }
  window.addEventListener(
    // "pagehide",
    "beforeunload", //ブラウザを終了した時にも復元データを保存
    function (e) {
      if (!Neo.uploaded && Neo.painter.isDirty()) {
        Neo.painter.saveSession();
      } else if (Neo.uploaded) {
        //投稿完了時にクリア
        Neo.painter.clearSession();
      }
    },
    false,
  );
  /**
   * Chromeのメモリーセーバによるタブ破棄対策
   * 非アクティブになった時にタイトルタグにアスタリスクを追加
   */
  //オリジナルのタイトルタグを保持
  const originalTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    if (Neo.config.neo_visibility_change_title_rewrite === "true") {
      // ページが見えている時は元に戻す
      if (document.visibilityState === "visible") {
        document.title = originalTitle;
      }
      // ページが隠れた時はタイマーをセット
      else if (document.visibilityState === "hidden") {
        setTimeout(() => {
          if (
            document.visibilityState === "hidden" &&
            document.title === originalTitle
          ) {
            document.title = `${originalTitle} *`;
          }
        }, 3000);
      }
    }
  });
};
/**
 * 初期設定
 * @param {HTMLElement|any} applet div,applet,applet-dummy
 */
Neo.initConfig = function (applet) {
  if (applet) {
    var appletWidth = applet.dataset.width || applet.getAttribute("width");
    var appletHeight = applet.dataset.height || applet.getAttribute("height");
    if (appletWidth) Neo.config.applet_width = parseInt(appletWidth);
    if (appletHeight) Neo.config.applet_height = parseInt(appletHeight);
    let targetName;
    if (applet instanceof HTMLElement) {
      targetName = applet.getAttribute("name");
      // name属性がない場合、クラス名から探す
      if (!targetName) {
        for (const className of applet.classList) {
          if (className.startsWith("neo-applet-")) {
            targetName = className.replace("neo-applet-", "");
            break; // 見つかったら終了
          }
        }
      }
    }
    if (!targetName) {
      targetName = "paintbbs";
    }

    // 1. 設定値（paramの代わり）を抽出する
    const params = Neo.extractBootConfig(targetName);

    // 2. 抽出した設定値をループして Neo.config に反映させる
    if (params) {
      for (const key in params) {
        const value = String(params[key]);

        // 設定値を適用
        // console.log(value);
        Neo.config[key] = Neo.fixConfig(value);

        if (key === "image_width") Neo.config.width = parseInt(value);
        if (key === "image_height") Neo.config.height = parseInt(value);
      }
    }
    var emulationMode = Neo.config.neo_emulation_mode || "2.22_8x";
    Neo.config.neo_alt_translation = emulationMode.slice(-1).match(/x/i);

    if (Neo.viewer && !Neo.config.color_bar) {
      Neo.config.color_bar = "#eeeeff";
    }

    Neo.readStyles();
    Neo.applyStyle("color_bk", "#ccccff");
    Neo.applyStyle("color_bk2", "#bbbbff");
    Neo.applyStyle("color_tool_icon", "#e8dfae");
    Neo.applyStyle("color_icon", "#ccccff");
    Neo.applyStyle("color_iconselect", "#ffaaaa");
    Neo.applyStyle("color_text", "#666699");
    Neo.applyStyle("color_bar", "#6f6fae");
    Neo.applyStyle("tool_color_button", "#e8dfae");
    Neo.applyStyle("tool_color_button2", "#f8daaa");
    Neo.applyStyle("tool_color_text", "#773333");
    Neo.applyStyle("tool_color_bar", "#ddddff");
    Neo.applyStyle("tool_color_frame", "#000000");

    // viewer用
    if (Neo.viewer) {
      Neo.applyStyle("color_back", "#ccccff");
      Neo.applyStyle("color_bar_select", "#407675");
    }

    // const container = document.getElementById("neo-container");
    // Neo.config.inherit_color = Neo.getInheritColor(container);
    if (!Neo.config.color_frame) Neo.config.color_frame = Neo.config.color_text;

    if (
      Neo.config.neo_tool_side == "left" ||
      Neo.config.neo_tool_side == "true"
    ) {
      Neo.toolSide = true;
    }
  }

  Neo.config.reserves = [
    {
      size: 1,
      color: "#000000",
      alpha: 1.0,
      tool: Neo.Painter.TOOLTYPE_PEN,
      drawType: Neo.Painter.DRAWTYPE_FREEHAND,
    },
    {
      size: 5,
      color: "#FFFFFF",
      alpha: 1.0,
      tool: Neo.Painter.TOOLTYPE_ERASER,
      drawType: Neo.Painter.DRAWTYPE_FREEHAND,
    },
    {
      size: 10,
      color: "#FFFFFF",
      alpha: 1.0,
      tool: Neo.Painter.TOOLTYPE_ERASER,
      drawType: Neo.Painter.DRAWTYPE_FREEHAND,
    },
  ];

  /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
  Neo.reservePen = Neo.clone(Neo.config.reserves[0]);
  /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
  Neo.reserveEraser = Neo.clone(Neo.config.reserves[1]);
};

document.addEventListener("DOMContentLoaded", () => {
  // ピンチズーム検出
  /**@returns {boolean} */
  Neo.isPinchZooming = function () {
    if ("visualViewport" in window && window.visualViewport) {
      return window.visualViewport.scale > 1;
    } else {
      return document.documentElement.clientWidth > window.innerWidth;
    }
  };

  // グリッド部分の touchmove イベントのデフォルトの動作をキャンセル
  /** @param {TouchEvent} e */
  Neo.touch_move_grid_control = function (e) {
    if (Neo.config.neo_disable_grid_touch_move) {
      let screenwidth = Number(screen.width);
      if (screenwidth - Neo.config.applet_width > 100) {
        if (typeof e.cancelable !== "boolean" || e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  };

  Neo.elementNeo = document.getElementById("NEO");
  // グリッド部分の touchmove イベントをキャンセルする関数をイベントリスナーに追加
  Neo.add_touch_move_grid_control = function () {
    if (Neo.elementNeo && Neo.config.neo_disable_grid_touch_move) {
      // すでにリスナーが追加されていない場合のみ追加
      if (!Neo.elementNeo_touchMoveListenerAdded) {
        Neo.elementNeo?.addEventListener(
          "touchmove",
          Neo.touch_move_grid_control,
          {
            passive: false,
          },
        );
        Neo.elementNeo_touchMoveListenerAdded = true; // リスナーが追加されたことを記録
      }
    }
  };

  // グリッド部分の touchmove イベントをキャンセルする関数の追加とリムーブ
  Neo.elementNeo?.addEventListener("touchmove", function (e) {
    if (Neo.elementNeo && Neo.config.neo_disable_grid_touch_move) {
      Neo.add_touch_move_grid_control();
      if (Neo.isPinchZooming()) {
        Neo.elementNeo.removeEventListener(
          "touchmove",
          Neo.touch_move_grid_control,
        );
        Neo.elementNeo_touchMoveListenerAdded = false; // リスナーが削除されたことを記録
      }
    }
  });
  // 初期化
  Neo.add_touch_move_grid_control();
});

/**
 *
 * @param {string} value
 * @returns {string}
 * @note true|falseのときは小文字が返る
 */
Neo.fixConfig = function (value) {
  // javaでは"#12345"を色として解釈するがjavascriptでは"#012345"に変換しないとだめ
  if (value.match(/^#[0-9a-fA-F]{5}$/)) {
    value = "#0" + value.slice(1);
  }
  //true|falseの時は小文字に統一
  if (
    value.toLocaleLowerCase() === "true" ||
    value.toLocaleLowerCase() === "false"
  ) {
    return value.toLocaleLowerCase();
  }
  return value;
};

Neo.getStyleSheet = function () {
  var style = document.createElement("style");
  document.head.appendChild(style);
  return style.sheet;
};

Neo.initSkin = function () {
  Neo.styleSheet = Neo.getStyleSheet();
  var lightBorder = Neo.multColor(Neo.config.color_icon, 1.3);
  var darkBorder = Neo.multColor(Neo.config.color_icon, 0.7);
  var lightBar = Neo.multColor(Neo.config.color_bar, 1.3);
  var darkBar = Neo.multColor(Neo.config.color_bar, 0.7);
  var bgImage = Neo.painter ? Neo.backgroundImage() : "";

  Neo.addRule(
    ".NEO #neo-container",
    "background-image",
    "url(" + bgImage + ")",
  );
  Neo.addRule(".NEO .colorSlider .label", "color", Neo.config.tool_color_text);
  Neo.addRule(".NEO .sizeSlider .label", "color", Neo.config.tool_color_text);
  Neo.addRule(
    ".NEO .layerControl .label1",
    "color",
    Neo.config.tool_color_text,
  );
  Neo.addRule(
    ".NEO .layerControl .label0",
    "color",
    Neo.config.tool_color_text,
  );
  Neo.addRule(".NEO .toolTipOn .label", "color", Neo.config.tool_color_text);
  Neo.addRule(".NEO .toolTipOff .label", "color", Neo.config.tool_color_text);

  Neo.addRule(".NEO #neo-toolSet", "background-color", Neo.config.color_bk);
  Neo.addRule(".NEO #neo-tools", "color", Neo.config.tool_color_text);
  Neo.addRule(
    ".NEO .layerControl .bg",
    "border-bottom",
    "1px solid " + Neo.config.tool_color_text,
  );

  Neo.addRule(".NEO .buttonOn", "color", Neo.config.color_text);
  Neo.addRule(".NEO .buttonOff", "color", Neo.config.color_text);

  Neo.addRule(".NEO .buttonOff", "background-color", Neo.config.color_icon);
  Neo.addRule(
    ".NEO .buttonOff",
    "border-top",
    "1px solid ",
    Neo.config.color_icon,
  );
  Neo.addRule(
    ".NEO .buttonOff",
    "border-left",
    "1px solid ",
    Neo.config.color_icon,
  );
  Neo.addRule(
    ".NEO .buttonOff",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_icon +
      ", 0 0 0 2px " +
      Neo.config.color_frame,
  );

  Neo.addRule(
    ".NEO .buttonOff:hover",
    "background-color",
    Neo.config.color_icon,
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "border-top",
    "1px solid " + lightBorder,
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "border-left",
    "1px solid " + lightBorder,
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_iconselect +
      ", 0 0 0 2px " +
      Neo.config.color_frame,
  );

  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "background-color",
    darkBorder,
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "border-top",
    "1px solid " + darkBorder,
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "border-left",
    "1px solid " + darkBorder,
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_iconselect +
      ", 0 0 0 2px " +
      Neo.config.color_frame,
  );

  Neo.addRule(
    ".NEO #neo-canvas",
    "border",
    "1px solid " + Neo.config.color_frame,
  );
  Neo.addRule(
    ".NEO #neo-scrollH, .NEO #neo-scrollV",
    "background-color",
    Neo.config.color_icon,
  );
  Neo.addRule(
    ".NEO #neo-scrollH, .NEO #neo-scrollV",
    "box-shadow",
    "0 0 0 1px white" + ", 0 0 0 2px " + Neo.config.color_frame,
  );

  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "background-color",
    Neo.config.color_bar,
  );
  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "box-shadow",
    "0 0 0 1px " + Neo.config.color_icon,
  );
  Neo.addRule(
    ".NEO #neo-scrollH div:hover, .NEO #neo-scrollV div:hover",
    "box-shadow",
    "0 0 0 1px " + Neo.config.color_iconselect,
  );

  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "border-top",
    "1px solid " + lightBar,
  );
  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "border-left",
    "1px solid " + lightBar,
  );
  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "border-right",
    "1px solid " + darkBar,
  );
  Neo.addRule(
    ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
    "border-bottom",
    "1px solid " + darkBar,
  );

  Neo.addRule(
    ".NEO .toolTipOn",
    "background-color",
    Neo.multColor(Neo.config.tool_color_button, 0.7),
  );
  Neo.addRule(
    ".NEO .toolTipOff",
    "background-color",
    Neo.config.tool_color_button,
  );
  Neo.addRule(
    ".NEO .toolTipFixed",
    "background-color",
    Neo.config.tool_color_button2,
  );

  Neo.addRule(
    ".NEO .colorSlider, .NEO .sizeSlider",
    "background-color",
    Neo.config.tool_color_bar,
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "background-color",
    Neo.config.tool_color_bar,
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "background-color",
    Neo.config.tool_color_bar,
  );
  Neo.addRule(
    ".NEO .layerControl",
    "background-color",
    Neo.config.tool_color_bar,
  );

  Neo.addRule(
    ".NEO .colorTipOn, .NEO .colorTipOff",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .toolTipOn, .NEO .toolTipOff",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .toolTipFixed",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .colorSlider, .NEO .sizeSlider",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .layerControl",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame,
  );
  Neo.addRule(
    ".NEO .reserveControl .reserve",
    "border",
    "1px solid " + Neo.config.tool_color_frame,
  );

  if (navigator.language.indexOf("ja") != 0) {
    var labels = ["Fixed", "On", "Off"];
    for (var i = 0; i < labels.length; i++) {
      var selector = ".NEO .toolTip" + labels[i] + " .label";
      Neo.addRule(selector, "letter-spacing", "0px !important");
    }
  }
  Neo.setToolSide(Neo.toolSide);
};

/**
 * 動的にスタイルシートにCSSルールを追加する
 * @param {string} selector - CSSセレクタ (例: "body", ".paint-canvas")
 * @param {string} styleName - CSSプロパティ名 (例: "letter-spacing")
 * @param {string|number} value - 設定する値 (例: "0px !important")
 * @param {CSSStyleSheet|null} [sheet] - 対象のスタイルシート（省略時は Neo.styleSheet）
 */
Neo.addRule = function (selector, styleName, value, sheet = null) {
  // 1. 省略時はデフォルトの stylesheet を適用
  if (!sheet) {
    sheet = Neo.styleSheet;
  }

  if (!sheet) {
    throw new Error("Neo.addRule: Stylesheet is undefined.");
  }
  try {
    if (sheet?.insertRule) {
      sheet.insertRule(
        selector + " { " + styleName + ": " + value + "; }",
        sheet.cssRules.length,
      );
    }
  } catch (e) {
    // スタイル定義の内容による例外（無視しても動作に影響がない場合が多い）
    console.error(
      "Neo.addRule: Failed to insert rule for '" + selector + "'.",
      e,
    );
  }
};

Neo.readStyles = function () {
  Neo.rules = {};
  for (var i = 0; i < document.styleSheets.length; i++) {
    Neo.readStyle(document.styleSheets[i]);
  }
};

/**
 * スタイルシートからカラー設定を読み込んで Neo.rules に格納する
 * @param {CSSStyleSheet} sheet
 */
Neo.readStyle = function (sheet) {
  try {
    var rules = sheet.cssRules;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];

      if (rule instanceof CSSImportRule && rule.styleSheet) {
        Neo.readStyle(rule.styleSheet);
        continue;
      }

      if (rule instanceof CSSStyleRule) {
        var selector = rule.selectorText;
        if (selector) {
          // .NEOと、セレクタ名の前のドットを除去してセレクタ名を取り出す。
          selector = selector.replace(/^(.NEO\s+)?\./, "");

          var css = rule.cssText || rule.style.cssText;
          var result = css.match(/color:\s*(.*)\s*;/);

          if (result) {
            var hex = Neo.colorNameToHex(result[1]);
            if (hex) {
              Neo.rules[selector] = hex;
            }
          }
        }
      }
    }
  } catch (e) {}
};
/**
 * 指定された設定名に色を適用する
 * @param {string} name
 * @param {string} defaultColor
 */
Neo.applyStyle = function (name, defaultColor) {
  if (Neo.config[name] == undefined) {
    Neo.config[name] = Neo.rules[name] || defaultColor;
  }
};

Neo.backgroundImage = function () {
  var c1 = Neo.painter.getColor(Neo.config.color_bk) | 0xff000000;
  var c2 = Neo.painter.getColor(Neo.config.color_bk2) | 0xff000000;
  var bgCanvas = document.createElement("canvas");
  bgCanvas.width = 16;
  bgCanvas.height = 16;
  var ctx = bgCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) {
    return "";
  }
  var imageData = ctx.getImageData(0, 0, 16, 16);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var index = 0;
  for (var y = 0; y < 16; y++) {
    for (var x = 0; x < 16; x++) {
      buf32[index++] = x == 14 || y == 14 ? c2 : c1;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, 0, 0);
  return bgCanvas.toDataURL("image/png");
};
/**
 * カラーコードに倍率を掛け合わせて、明度を調整したカラーコードを返す
 * @param {string} c - 16進数のカラーコード
 * @param {number} scale - 明度の倍率
 * @returns {string} 変換後の16進数カラーコード
 */
Neo.multColor = function (c, scale) {
  const rNum = Math.round(parseInt(c.slice(1, 3), 16) * scale);
  const gNum = Math.round(parseInt(c.slice(3, 5), 16) * scale);
  const bNum = Math.round(parseInt(c.slice(5, 7), 16) * scale);
  const r = ("0" + Math.min(Math.max(rNum, 0), 255).toString(16)).slice(-2);
  const g = ("0" + Math.min(Math.max(gNum, 0), 255).toString(16)).slice(-2);
  const b = ("0" + Math.min(Math.max(bNum, 0), 255).toString(16)).slice(-2);
  return "#" + r + g + b;
};

/**
 * 色の名前やrgb表記の文字列を16進数のカラーコードに変換する
 * @param {string} name - 色の名前（"red"等）または "rgb(r,g,b)" 形式の文字列
 * @returns {string|boolean} 変換後のカラーコード（失敗時は false）
 */
Neo.colorNameToHex = function (name) {
  /** @type {Record<string, string>} */
  const colors = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };

  var rgb = name.toLowerCase().match(/rgb\((.*),(.*),(.*)\)/);
  if (rgb) {
    var r = ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
    var g = ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
    var b = ("0" + parseInt(rgb[3]).toString(16)).slice(-2);
    return "#" + r + g + b;
  }

  if (typeof colors[name.toLowerCase()] != "undefined") {
    return colors[name.toLowerCase()];
  }
  return false;
};

Neo.initComponents = function () {
  var copyright = document.getElementById("neo-copyright");
  if (copyright) copyright.innerHTML += "v" + Neo.version;

  // ドラッグしたまま画面外に移動した時
  document.addEventListener(
    "mouseup",
    function (e) {
      if (
        Neo.painter &&
        e.target instanceof Element &&
        !Neo.painter.isContainer(e.target)
      ) {
        Neo.painter.cancelTool();
      }
    },
    false,
  );

  // 投稿に失敗する可能性があるときは警告を表示する
  Neo.showWarning();

  if (Neo.styleSheet) {
    Neo.addRule("*", "user-select", "none");
    Neo.addRule("*", "-webkit-user-select", "none");
    Neo.addRule("*", "-ms-user-select", "none");
  }
};

Neo.initButtons = function () {
  const neo_undo = new Neo.Button().init("neo-undo");
  if (neo_undo) {
    neo_undo.onmouseup = function () {
      new Neo.UndoCommand(Neo.painter).execute();
    };
  }
  const neo_redo = new Neo.Button().init("neo-redo");
  if (neo_redo) {
    neo_redo.onmouseup = function () {
      new Neo.RedoCommand(Neo.painter).execute();
    };
  }
  const neo_window = new Neo.Button().init("neo-window");
  if (neo_window) {
    neo_window.onmouseup = function () {
      new Neo.WindowCommand(Neo.painter).execute();
    };
  }
  const neo_copyright = new Neo.Button().init("neo-copyright");
  if (neo_copyright) {
    neo_copyright.onmouseup = function () {
      new Neo.CopyrightCommand(Neo.painter).execute();
    };
  }
  const neo_zoomPlus = new Neo.Button().init("neo-zoomPlus");
  if (neo_zoomPlus) {
    neo_zoomPlus.onmouseup = function () {
      new Neo.ZoomPlusCommand(Neo.painter).execute();
    };
  }
  const neo_zoomMinus = new Neo.Button().init("neo-zoomMinus");
  if (neo_zoomMinus) {
    neo_zoomMinus.onmouseup = function () {
      new Neo.ZoomMinusCommand(Neo.painter).execute();
    };
  }
  Neo.submitButton = new Neo.Button().init("neo-submit");
  if (!Neo.submitButton) {
    console.error("initButtons: SubmitButton not found");
    return;
  }
  Neo.submitButton.onmouseup = function () {
    Neo.submitButton?.disable(5000);
    new Neo.SubmitCommand(Neo.painter).execute();
  };

  Neo.fillButton = new Neo.FillButton().init("neo-fill");
  Neo.rightButton = new Neo.RightButton().init("neo-right");
  if (!Neo.rightButton) {
    console.error("initButtons: RightButton not found");
    return;
  }

  if (Neo.isMobile() || Neo.config.neo_show_right_button == "true") {
    if (Neo.rightButton.element) {
      Neo.rightButton.element.style.display = "block";
    }
  }

  // toolTip
  Neo.penTip = new Neo.PenTip().init("neo-pen");
  Neo.pen2Tip = new Neo.Pen2Tip().init("neo-pen2");
  Neo.effectTip = new Neo.EffectTip().init("neo-effect");
  Neo.effect2Tip = new Neo.Effect2Tip().init("neo-effect2");
  Neo.eraserTip = new Neo.EraserTip().init("neo-eraser");
  Neo.drawTip = new Neo.DrawTip().init("neo-draw");
  Neo.maskTip = new Neo.MaskTip().init("neo-mask");

  Neo.toolButtons =
    Neo.fillButton &&
    Neo.penTip &&
    Neo.pen2Tip &&
    Neo.effectTip &&
    Neo.effect2Tip &&
    Neo.drawTip &&
    Neo.eraserTip
      ? [
          Neo.fillButton,
          Neo.penTip,
          Neo.pen2Tip,
          Neo.effectTip,
          Neo.effect2Tip,
          Neo.drawTip,
          Neo.eraserTip,
        ]
      : [];

  // colorTip
  for (var i = 1; i <= 14; i++) {
    new Neo.ColorTip().init("neo-color" + i, { index: i });
  }

  // colorSlider
  Neo.sliders[Neo.SLIDERTYPE_RED] = new Neo.ColorSlider().init(
    "neo-sliderRed",
    {
      type: Neo.SLIDERTYPE_RED,
    },
  );
  Neo.sliders[Neo.SLIDERTYPE_GREEN] = new Neo.ColorSlider().init(
    "neo-sliderGreen",
    { type: Neo.SLIDERTYPE_GREEN },
  );
  Neo.sliders[Neo.SLIDERTYPE_BLUE] = new Neo.ColorSlider().init(
    "neo-sliderBlue",
    {
      type: Neo.SLIDERTYPE_BLUE,
    },
  );
  Neo.sliders[Neo.SLIDERTYPE_ALPHA] = new Neo.ColorSlider().init(
    "neo-sliderAlpha",
    { type: Neo.SLIDERTYPE_ALPHA },
  );

  // sizeSlider
  Neo.sliders[Neo.SLIDERTYPE_SIZE] = new Neo.SizeSlider().init(
    "neo-sliderSize",
    {
      type: Neo.SLIDERTYPE_SIZE,
    },
  );

  // reserveControl
  for (var i = 1; i <= 3; i++) {
    new Neo.ReserveControl().init("neo-reserve" + i, { index: i });
  }

  new Neo.LayerControl().init("neo-layerControl");
  new Neo.ScrollBarButton().init("neo-scrollH");
  new Neo.ScrollBarButton().init("neo-scrollV");
};

/**
 * @param {boolean} [isApp]
 * @returns {void}
 */
Neo.start = function (isApp = false) {
  if (Neo.viewer) return;

  Neo.initSkin();
  Neo.initComponents();

  Neo.initButtons();

  Neo.isApp = isApp;
  if (Neo.applet) {
    var name = Neo.applet.getAttribute("name") || "paintbbs";
    Neo.applet.outerHTML = "";
    /** @type {any} */ (document)[name] = Neo;

    Neo.resizeCanvas();

    if (!Neo.container) {
      console.error("start: Container element not found");
      return;
    }

    Neo.container.style.visibility = "visible";

    if (Neo.isApp) {
      // @ts-ignore
      var ipc = require("electron").ipcRenderer;
      ipc.sendToHost("neo-status", "ok");
    } else {
      //@ts-ignore
      if (document["paintBBSCallback"]) {
        //@ts-ignore
        document["paintBBSCallback"]("start");
      }
    }
  }
};

Neo.isMobile = function () {
  if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) return true;
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true;
  return false;
};

Neo.showWarning = function () {
  const futaba = location.hostname.match(/^(?:.+\.)?2chan\.net$/i); //サブドメインありなし両方に対応
  const samplebbs = location.hostname.match(/^(?:.+\.)?neo\.websozai\.jp$/i);

  var edgeMatch = navigator.userAgent.match(/Edge\/(\d+)/i);
  var edgeVersion = 0; // 数値として初期化
  if (edgeMatch && edgeMatch.length > 1) {
    edgeVersion = parseInt(edgeMatch[1], 10);
  }
  var str = "";
  if (futaba || samplebbs) {
    if (edgeVersion && edgeVersion < 15) {
      str = Neo.translate(
        "このブラウザでは<br>投稿に失敗することがあります<br>",
      );
    }
  }

  // もし<PARAM NAME="neo_warning" VALUE="...">があれば表示する
  if (Neo.config.neo_warning) {
    str += Neo.config.neo_warning;
  }

  var warning = document.getElementById("neoWarning");
  if (!warning) {
    return;
  }
  warning.innerHTML = str;
  setTimeout(function () {
    if (!warning) {
      return;
    }
    warning.style.opacity = "0";
  }, 15000);
};

/*
   -----------------------------------------------------------------------
   UIの更新
   -----------------------------------------------------------------------
 */

Neo.updateUI = function () {
  var current = Neo.painter.tool.getToolButton();
  for (let i = 0; i < Neo.toolButtons.length; i++) {
    /** @type {any} */
    const toolTip = Neo.toolButtons[i];
    if (current) {
      if (current == toolTip) {
        toolTip.setSelected(true);
        toolTip.update();
      } else {
        toolTip.setSelected(false);
      }
    }
  }
  if (Neo.drawTip) {
    Neo.drawTip.update();
  }

  Neo.updateUIColor(true, false);
};

/**
 * @param {boolean} updateSlider
 * @param {boolean} updateColorTip
 */
Neo.updateUIColor = function (updateSlider, updateColorTip) {
  for (let i = 0; i < Neo.toolButtons.length; i++) {
    /** @type {any} */
    const toolTip = Neo.toolButtons[i];
    toolTip.update();
  }

  if (updateSlider) {
    for (let i = 0; i < Neo.sliders.length; i++) {
      /** @type {any} */
      var slider = Neo.sliders[i];
      slider.update();
    }
  }

  // パレットを変更するとき
  if (updateColorTip) {
    var colorTip = Neo.ColorTip.getCurrent();
    if (colorTip) {
      colorTip.setColor(Neo.painter.foregroundColor);
    }
  }
};

/*
   -----------------------------------------------------------------------
   リサイズ対応
   -----------------------------------------------------------------------
 */
/**
 * @returns {void}
 */
Neo.updateWindow = function () {
  const windowView = document.getElementById("neo-windowView");
  const pageView = document.getElementById("neo-pageView");
  if (!Neo.container) {
    console.error("updateWindow: Container element not found");
    return;
  }
  if (Neo.fullScreen) {
    if (!windowView) return;
    windowView.style.display = "block";
    windowView.appendChild(Neo.container);
  } else {
    if (windowView) {
      windowView.style.display = "none";
    }
    if (pageView) {
      pageView.appendChild(Neo.container);
    }
  }

  Neo.resizeCanvas();

  //ウィンドウビューに切り替わった事を通知するカスタムイベント
  document.dispatchEvent(
    new CustomEvent("neo:fullscreenchange", {
      detail: { fullscreen: Neo.fullScreen },
    }),
  );
};

Neo.resizeCanvas = function () {
  if (!Neo.container) {
    console.error("resizeCanvas: Container element not found");
    return;
  }

  var appletWidth = Neo.container.clientWidth;
  var appletHeight = Neo.container.clientHeight;

  var canvasWidth = Neo.painter.canvasWidth;
  var canvasHeight = Neo.painter.canvasHeight;

  var width0 = canvasWidth * Neo.painter.zoom;
  var height0 = canvasHeight * Neo.painter.zoom;

  var width = width0 < appletWidth - 100 ? width0 : appletWidth - 100;
  var height = height0 < appletHeight - 120 ? height0 : appletHeight - 120;

  //width, heightは偶数でないと誤差が出るため
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  if (Neo.viewer) {
    width = canvasWidth;
    height = canvasHeight;
  }

  Neo.painter.destWidth = width;
  Neo.painter.destHeight = height;

  const destCanvas = Neo.painter.destCanvas;
  destCanvas.width = width;
  destCanvas.height = height;
  const destctx = destCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!destctx) {
    console.error("resizeCanvas: Failed to get 2d context");
    return;
  }
  Neo.painter.destCanvasCtx = destctx;

  const ctx = Neo.painter.destCanvasCtx;
  if (Neo.painter.zoom < 1) {
    // 表示用アンチエイリアスを有効化
    ctx.imageSmoothingEnabled = true;
    // 品質を指定（対応ブラウザのみ有効）
    if (Neo.painter.zoom < 0.5 && "imageSmoothingQuality" in ctx) {
      destCanvas.style.imageRendering = "smooth";
      ctx.imageSmoothingQuality = "high";
    }
  } else {
    ctx.imageSmoothingEnabled = false;
    destCanvas.style.imageRendering = "pixelated";
  }

  destCanvas.style.touchAction = "none";
  destCanvas.style.pointerEvents = "auto";

  if (Neo.canvas) {
    Neo.canvas.style.touchAction = "none";
    Neo.canvas.style.pointerEvents = "auto";
    Neo.canvas.style.width = width + "px";
    Neo.canvas.style.height = height + "px";
  }

  const tools = Neo.tools ?? "";
  if (tools) {
    tools.style.touchAction = "none";
    tools.style.pointerEvents = "auto";
  }

  if (Neo.toolsWrapper) {
    const toolsWrapper = Neo.toolsWrapper;
    var top = (Neo.container.clientHeight - toolsWrapper.clientHeight) / 2;
    Neo.toolsWrapper.style.top = (top > 0 ? top : 0) + "px";

    if (top < 0) {
      var s = Neo.container.clientHeight / toolsWrapper.clientHeight;
      Neo.toolsWrapper.style.transform =
        "translate(0, " + top + "px) scale(1," + s + ")";
    } else {
      Neo.toolsWrapper.style.transform = "";
    }
  }

  Neo.painter.setZoom(Neo.painter.zoom);
  Neo.painter.updateDestCanvas(0, 0, canvasWidth, canvasHeight, false);
};

/*
   -----------------------------------------------------------------------
   投稿
   -----------------------------------------------------------------------
 */

/**
 * オブジェクトのシャローコピーを作成する
 * @param {Record<string, any>} src - コピー元のオブジェクト
 * @returns {Record<string, any>} コピーされた新しいオブジェクト
 */
Neo.clone = function (src) {
  /** @type {Record<string, any>} */
  const dst = {};
  for (const k in src) {
    dst[k] = src[k];
  }
  return dst;
};

/**
 * 渡された値（サイズ等）を、パケット通信ヘッダー用に「8文字固定」のゼロ埋め文字列に変換する
 * * @example
 * Neo.getSizeString(125); // "00000125"（8文字に固定される）
 * * @param {number|string} len - 変換したいデータサイズ（数値または文字列）
 * @returns {string} 8文字にゼロパディングされた文字列
 */
Neo.getSizeString = function (len) {
  var result = String(len);
  while (result.length < 8) {
    result = "0" + result;
  }
  return result;
};

/**
 * @param {string} url
 */
Neo.openURL = function (url) {
  if (Neo.isApp) {
    // @ts-ignore
    require("electron").shell.openExternal(url);
  } else {
    window.open(url, "_blank");
  }
};

/**
 * @param {string}  boardURL
 * @param {string}  url
 */
Neo.getAbsoluteURL = function (boardURL, url) {
  if (url && (url.indexOf("://") > 0 || url.indexOf("//") === 0)) {
    return url;
  } else {
    return boardURL + url;
  }
};

/**
 * 描画されたイラストデータ（および各種サムネイル、動画データ）をサーバーに投稿する
 * @param {string} boardURL - 掲示板のURL
 * @param {Blob} blob - 投稿するメインのイラスト画像データ (PNG等)
 * @param {Blob|null} thumbnail - 通常のサムネイル画像データ（無い場合は null）
 * @param {Blob|null} thumbnail2 - アニメーション動画（PCH）データ（無い場合は null）
 */
Neo.submit = function (boardURL, blob, thumbnail, thumbnail2) {
  let url = Neo.getAbsoluteURL(boardURL, Neo.config.url_save);
  var headerString = Neo.str_header || "";
  //@ts-ignore
  if (document["paintBBSCallback"]) {
    //@ts-ignore
    var result = document["paintBBSCallback"]("check");
    if (result == 0 || result == "false") {
      return;
    }

    //@ts-ignore
    result = document["paintBBSCallback"]("header");
    if (result && typeof result == "string") {
      headerString = result;
    }
  }
  if (!headerString) headerString = Neo.config.send_header || "";

  var imageType = Neo.config.send_header_image_type;
  if (imageType && imageType == "true") {
    headerString = "image_type=png&" + headerString;
  }

  var count = Neo.painter.securityCount;
  var timer = Date.now() - Neo.painter.securityTimer;
  if (Neo.config.send_header_count == "true") {
    headerString = "count=" + count + "&" + headerString;
  }
  if (Neo.config.send_header_timer == "true") {
    headerString = "timer=" + timer + "&" + headerString;
  }
  //   console.log("header: " + headerString);

  if (Neo.config.neo_emulate_security_error == "true") {
    var securityError = false;
    if (Neo.config.security_click) {
      if (count - parseInt(Neo.config.security_click || 0) < 0) {
        securityError = true;
      }
    }
    if (Neo.config.security_timer) {
      if (timer - parseInt(Neo.config.security_timer || 0) * 1000 < 0) {
        securityError = true;
      }
    }
    if (securityError && Neo.config.security_url) {
      if (Neo.config.security_post == "true") {
        url = Neo.config.security_url;
      } else {
        location.href = Neo.config.security_url;
        return;
      }
    }
  }

  if (thumbnail2) {
    const thumbnailSize = thumbnail2.size;
    // 動画容量を制限するオリジナルのPaintBBSのパラメータ
    // 単位KB
    if (!isNaN(Neo.config.animation_max) && Number(Neo.config.animation_max)) {
      const maxSize = Number(Neo.config.animation_max) * 1024;
      if (maxSize < thumbnailSize) {
        thumbnail2 = null;
      }
    }
  }
  /** @type {FormData | null} */
  let formData = null;
  if (Neo.config.neo_send_with_formdata == "true") {
    formData = new FormData();
    formData.append("header", headerString);
    formData.append("picture", blob, "blob");
    let thumbnail_size = 0;
    if (thumbnail) {
      formData.append("thumbnail", thumbnail, "blob");
      thumbnail_size = thumbnail.size;
    }
    if (thumbnail2) {
      // 動画容量を制限するNEO独自のパラメータ
      // 単位MB
      if (
        isNaN(Neo.config.neo_max_pch) ||
        !Number(Neo.config.neo_max_pch) ||
        Number(Neo.config.neo_max_pch) * 1024 * 1024 >
          headerString.length + blob.size + thumbnail_size + thumbnail2.size
      ) {
        formData.append("pch", thumbnail2, "blob");
      } else {
        thumbnail2 = null;
      }
    }
  }

  //console.log("submit url=" + url + " header=" + headerString);

  var header = new Blob([headerString]);
  var headerLength = this.getSizeString(header.size);
  var imgLength = this.getSizeString(blob.size);

  var array = [
    "P", // PaintBBS
    headerLength,
    header,
    imgLength,
    "\r\n",
    blob,
  ];

  if (thumbnail) {
    var thumbnailLength = this.getSizeString(thumbnail.size);
    array.push(thumbnailLength, thumbnail);
  }
  if (thumbnail2) {
    var thumbnail2Length = this.getSizeString(thumbnail2.size);
    array.push(thumbnail2Length, thumbnail2);
  }

  const futaba = location.hostname.match(/^(?:.+\.)?2chan\.net$/i); //サブドメインありなし両方に対応
  var subtype = futaba ? "octet-binary" : "octet-stream"; // 念のため
  var body = new Blob(array, { type: "application/" + subtype });

  /**
   * @param {string} path
   * @param {FormData|Blob} data
   */
  const postData = (path, data) => {
    var errorMessage = path + "\n";

    /** @type {RequestInit} */
    const requestOptions = {
      method: "post",
      body: data,
    };

    if (!futaba) {
      //ふたばの時は、'X-Requested-With'を追加しない
      requestOptions.mode = "same-origin";
      requestOptions.headers = {
        "X-Requested-With": "PaintBBS",
      };
    }

    fetch(path, requestOptions)
      .then((response) => {
        if (response.ok) {
          response.text().then((text) => {
            console.log(text);
            if (text.match(/^error\n/m)) {
              Neo.submitButton?.enable();
              return alert(text.replace(/^error\n/m, ""));
            }
            if (Neo.config.neo_validate_exact_ok_text_in_response === "true") {
              if (text !== "ok") {
                Neo.submitButton?.enable();
                return alert(
                  errorMessage +
                    Neo.translate(
                      "投稿に失敗。時間を置いて再度投稿してみてください。",
                    ),
                );
              }
            }
            var exitURL = Neo.getAbsoluteURL(boardURL, Neo.config.url_exit);
            var responseURL = text.replace(/&amp;/g, "&");

            // ふたばではresponseの文字列をそのままURLとして解釈する
            if (responseURL.match(/painttmp=/)) {
              exitURL = responseURL;
            }
            // responseが "URL:〜" の形だった場合はそのURLへ
            if (responseURL.match(/^URL:/)) {
              exitURL = responseURL.replace(/^URL:/, "");
            }
            Neo.uploaded = true;
            //画面移動の関数が定義されている時はユーザーが定義した関数で画面移動
            //@ts-ignore
            if (typeof Neo.handleExit === "function") {
              //@ts-ignore
              return Neo.handleExit();
            }
            return (location.href = exitURL);
          });
        } else {
          Neo.submitButton?.enable();
          const response_status = response.status;
          let httpErrorMessag = "";
          switch (response_status) {
            case 400:
              httpErrorMessag = "Bad Request";
              break;
            case 401:
              httpErrorMessag = "Unauthorized";
              break;
            case 403:
              httpErrorMessag = "Forbidden";
              break;
            case 404:
              httpErrorMessag = "Not Found";
              break;
            case 500:
              httpErrorMessag = "Internal Server Error";
              break;
            case 502:
              httpErrorMessag = "Bad Gateway";
              break;
            case 503:
              httpErrorMessag = "Service Unavailable";
              break;
            default:
              httpErrorMessag = "Unknown Error";
              break;
          }
          return alert(
            `${Neo.translate("HTTPステータスコード")} ${response_status} : ${httpErrorMessag}\n${errorMessage}${Neo.translate("投稿に失敗。時間を置いて再度投稿してみてください。")}`,
          );
        }
      })
      .catch((error) => {
        Neo.submitButton?.enable();
        return alert(
          errorMessage +
            Neo.translate("投稿に失敗。時間を置いて再度投稿してみてください。"),
        );
      });
  };

  if (Neo.config.neo_confirm_layer_info_notsaved && !thumbnail2) {
    const isConfirmed = window.confirm(
      Neo.translate("レイヤー情報は保存されません。\n続行してよろしいですか?"),
    );

    if (!isConfirmed) {
      Neo.submitButton?.enable();
      console.log("中止しました。");
      return; // ユーザーが続行しない場合、処理を中断
    }
  }

  // データ送信処理
  const data = Neo.config.neo_send_with_formdata === "true" ? formData : body;
  if (data) {
    postData(url, data);
  } else {
    console.error("failed to post data");
  }
};

/*
  -----------------------------------------------------------------------
    LiveConnect
  -----------------------------------------------------------------------
*/

Neo.getColors = function () {
  // console.log("getColors");
  // console.log("defaultColors==", Neo.config.colors.join("\n"));
  var array = [];
  for (var i = 0; i < 14; i++) {
    array.push(Neo.colorTips[i].color);
  }
  return array.join("\n");
  //  return Neo.config.colors.join('\n');
};

/**
 * パレット全体のカラーを一括で設定し、UIのカラーチップに反映する
 * @param {string} colors - 改行区切りの16進数カラーコードの文字列（14色分）
 */
Neo.setColors = function (colors) {
  // console.log("setColors");
  var array = colors.split("\n");
  for (var i = 0; i < 14; i++) {
    var color = array[i];
    Neo.config.colors[i] = color;
    Neo.colorTips[i].setColor(color);
  }
};

Neo.pExit = function () {
  new Neo.SubmitCommand(Neo.painter).execute();
};

Neo.str_header = "";

/*
  -----------------------------------------------------------------------
    DOMツリーの作成
  -----------------------------------------------------------------------
*/

/**
 * @param {HTMLElement} applet
 */
Neo.createContainer = function (applet) {
  var neo = document.createElement("div");
  neo.className = "NEO";
  neo.id = "NEO";

  const html =
    '<div id="neo-pageView" style="margin:auto; width:450px; height:470px;">' +
    '<div id="neo-container" style="visibility:hidden;" class="o">' +
    '<div id="neo-center" class="o">' +
    '<div id="neo-painterContainer" class="o">' +
    '<div id="neo-painterWrapper" class="o">' +
    '<div id="neo-upper" class="o">' +
    '<div id="neo-redo">[やり直し]</div> ' +
    '<div id="neo-undo">[元に戻す]</div> ' +
    '<div id="neo-fill">[塗り潰し]</div> ' +
    '<div id="neo-right" style="display:none;">[右]</div> ' +
    "</div>" +
    '<div id="neo-painter">' +
    '<div id="neo-canvas">' +
    '<div id="neo-scrollH"></div>' +
    '<div id="neo-scrollV"></div>' +
    '<div id="neo-zoomPlusWrapper">' +
    '<div id="neo-zoomPlus">+</div>' +
    "</div>" +
    '<div id="neo-zoomMinusWrapper">' +
    '<div id="neo-zoomMinus">-</div>' +
    "</div>" +
    '<div id="neoWarning"></div>' +
    "</div>" +
    "</div>" +
    '<div id="neo-lower" class="o">' +
    "</div>" +
    "</div>" +
    '<div id="neo-toolsWrapper">' +
    '<div id="neo-tools">' +
    '<div id="neo-toolSet">' +
    '<div id="neo-pen"></div>' +
    '<div id="neo-pen2"></div>' +
    '<div id="neo-effect"></div>' +
    '<div id="neo-effect2"></div>' +
    '<div id="neo-eraser"></div>' +
    '<div id="neo-draw"></div>' +
    '<div id="neo-mask"></div>' +
    '<div class="colorTips">' +
    '<div id="neo-color2"></div><div id="neo-color1"></div><br>' +
    '<div id="neo-color4"></div><div id="neo-color3"></div><br>' +
    '<div id="neo-color6"></div><div id="neo-color5"></div><br>' +
    '<div id="neo-color8"></div><div id="neo-color7"></div><br>' +
    '<div id="neo-color10"></div><div id="neo-color9"></div><br>' +
    '<div id="neo-color12"></div><div id="neo-color11"></div><br>' +
    '<div id="neo-color14"></div><div id="neo-color13"></div>' +
    "</div>" +
    '<div id="neo-sliderRed"></div>' +
    '<div id="neo-sliderGreen"></div>' +
    '<div id="neo-sliderBlue"></div>' +
    '<div id="neo-sliderAlpha"></div>' +
    '<div id="neo-sliderSize"></div>' +
    '<div class="reserveControl" style="margin-top:4px;">' +
    '<div id="neo-reserve1"></div>' +
    '<div id="neo-reserve2"></div>' +
    '<div id="neo-reserve3"></div>' +
    "</div>" +
    '<div id="neo-layerControl" style="margin-top:6px;"></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="neo-headerButtons">' +
    '<div id="neo-window">[窓]</div>' +
    "</div>" +
    '<div id="neo-footerButtons">' +
    '<div id="neo-submit">[投稿]</div> ' +
    '<div id="neo-copyright">[(C)しぃちゃん PaintBBS NEO]</div> ' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="neo-windowView" style="display: none;">' +
    "</div>";

  neo.innerHTML = html.replace(/\[(.*?)\]/g, function (match, str) {
    return Neo.translate(str);
  });

  const parent = applet.parentNode;
  if (!parent) {
    console.error("Failed to create container.");
    return;
  }

  parent.appendChild(neo);
  parent.insertBefore(neo, applet);

  //  applet.style.display = "none";

  // NEOを組み込んだURLをアプリ版で開くとDOMツリーが2重にできて格好悪いので消しておく
  setTimeout(function () {
    /** @type {NodeListOf<HTMLElement>} */
    const tmp = document.querySelectorAll(".NEO");

    if (tmp.length > 1) {
      for (var i = 1; i < tmp.length; i++) {
        tmp[i].style.display = "none";
      }
    }
  }, 0);
};

/**
 * 指定されたCanvas上の画像の形（アルファチャンネル）を維持したまま、指定した単色に置き換える
 * @param {CanvasRenderingContext2D} ctx - 対象となるCanvasの2Dコンテキスト
 * @param {string} color - 置き換えたい新しい色（カラーコードまたは数値）
 */
Neo.tintImage = function (ctx, color) {
  const c = Neo.painter.getColor(color) & 0xffffff;

  var imageData = ctx.getImageData(0, 0, 46, 18);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  for (var i = 0; i < buf32.length; i++) {
    var a = buf32[i] & 0xff000000;
    if (a) {
      buf32[i] = (buf32[i] & a) | c;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, 0, 0);
};

/**
 * HTML側からの指定に基づきツールの位置を変更する
 * @param {boolean|string} htmlConfiguredSide - HTMLタグ等で設定された外部からのサイド指定
 */
Neo.setToolSide = function (htmlConfiguredSide) {
  let side;
  if (htmlConfiguredSide === "left") {
    side = true;
  } else if (htmlConfiguredSide === "right") {
    side = false;
  } else {
    side = htmlConfiguredSide;
  }
  Neo.toolSide = !!side;

  if (!Neo.toolSide) {
    Neo.addRule(".NEO #neo-toolsWrapper", "right", "-3px");
    Neo.addRule(".NEO #neo-toolsWrapper", "left", "auto");
    Neo.addRule(".NEO #neo-painterWrapper", "padding", "0 55px 0 0 !important");
    Neo.addRule(".NEO #neo-upper", "padding-right", "75px !important");
  } else {
    Neo.addRule(".NEO #neo-toolsWrapper", "right", "auto");
    Neo.addRule(".NEO #neo-toolsWrapper", "left", "-1px");
    Neo.addRule(".NEO #neo-painterWrapper", "padding", "0 0 0 55px !important");
    Neo.addRule(".NEO #neo-upper", "padding-right", "20px !important");
  }
};

/**
 * 手ぶれ補正の強さ
 * @param {Number|string} htmlConfig
 * @note 0-5の範囲 デフォルト1
 */
Neo.setStabilizeLevel = function (htmlConfig) {
  let level = parseInt(String(htmlConfig));
  if (isNaN(level) || level < 0) {
    level = 1; //デフォルトは1
  } else if (level > 5) {
    level = 5; //最大5
  }
  Neo.stabilize_level = level;
};

/**
 * エイリアス
 * v1.6.58以前との互換性を維持するため
 * 外部から呼び出す関数名がNeo.setStabilizLevel()でも、Neo.setStabilizeLevel()でも内部的には同じ関数を実行する
 *
 */
Neo.setStabilizLevel = Neo.setStabilizeLevel;

"use strict";
//@ts-check
/** @type {Object.<string, Object.<string, string>>} */
Neo.dictionary = {
  ja: {},
  en: {
    やり直し: "Redo",
    元に戻す: "Undo",
    塗り潰し: "Paint",
    窓: "F&nbsp;",
    投稿: "Send",
    "(C)しぃちゃん PaintBBS NEO": "(C)shi-chan PaintBBS NEO",
    鉛筆: "Solid",
    水彩: "WaterC",
    ﾃｷｽﾄ: "Text",
    トーン: "Tone",
    ぼかし: "ShadeOff",
    覆い焼き: "HLight",
    焼き込み: "Dark",
    消しペン: "White",
    消し四角: "WhiteRect",
    全消し: "Clear",
    四角: "Rect",
    線四角: "LineRect",
    楕円: "Oval",
    線楕円: "LineOval",
    コピー: "Copy",
    ﾚｲﾔ結合: "lay-unif",
    角取り: "Antialias",
    左右反転: "reverseL",
    上下反転: "reverseU",
    傾け: "lie",
    通常: "Normal",
    マスク: "Mask",
    逆ﾏｽｸ: "ReMask",
    加算: "And",
    逆加算: "Div",
    手書き: "FreeLine",
    直線: "Straight",
    BZ曲線: "Bezie",
    "ページビュー？": "Page view?",
    "ウィンドウビュー？": "Window view?",
    "描きかけの画像があります。復元しますか？": "Restore session?",
    右: "Right Click",

    "PaintBBS NEOは、お絵描きしぃ掲示板 PaintBBS (©2000-2004 しぃちゃん) をhtml5化するプロジェクトです。\n\nPaintBBS NEOのホームページを表示しますか？":
      "PaintBBS NEO is an HTML5 port of Oekaki Shi-BBS PaintBBS (©2000-2004 shi-chan). Show the project page?",
    "このブラウザでは<br>投稿に失敗することがあります<br>":
      "This browser may fail to send your picture.<br>",

    "画像を投稿しますか？<br>投稿に成功後、編集を終了します。":
      "Is the picture contributed?<br>if contribution completed, you jump to the comment page.",
    "描きかけの画像があります。動画の読み込みを中止して復元しますか？":
      "Discard animation data and restore session?",
    最: "Mx",
    早: "H",
    既: "M",
    鈍: "L",
    "投稿に失敗。時間を置いて再度投稿してみてください。":
      "Please push send button again.",
    HTTPステータスコード: "HTTP status code",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
      "Layer information will not be saved.\nAre you sure you want to continue?",
  },
  enx: {
    やり直し: "Redo",
    元に戻す: "Undo",
    塗り潰し: "Fill",
    窓: "Float",
    投稿: "Send",
    "(C)しぃちゃん PaintBBS NEO": "&copy;shi-chan PaintBBS NEO",
    鉛筆: "Solid",
    水彩: "WaterCo",
    ﾃｷｽﾄ: "Text",
    トーン: "Halftone",
    ぼかし: "Blur",
    覆い焼き: "Light",
    焼き込み: "Dark",
    消しペン: "White",
    消し四角: "WhiteRe",
    全消し: "Clear",
    四角: "Rect",
    線四角: "LineRect",
    楕円: "Oval",
    線楕円: "LineOval",
    コピー: "Copy",
    ﾚｲﾔ結合: "layerUnit",
    角取り: "antiAlias",
    左右反転: "flipHorita",
    上下反転: "flipVertic",
    傾け: "rotate",
    通常: "Normal",
    マスク: "Mask",
    逆ﾏｽｸ: "ReMask",
    加算: "And",
    逆加算: "Divide",
    手書き: "Freehan",
    直線: "Line",
    BZ曲線: "Bezier",
    Layer0: "LayerBG",
    Layer1: "LayerFG",
    "ページビュー？": "Page view?",
    "ウィンドウビュー？": "Window view?",
    "描きかけの画像があります。復元しますか？": "Restore session?",
    右: "Right Click",

    "PaintBBS NEOは、お絵描きしぃ掲示板 PaintBBS (©2000-2004 しぃちゃん) をhtml5化するプロジェクトです。\n\nPaintBBS NEOのホームページを表示しますか？":
      "PaintBBS NEO is an HTML5 port of Oekaki Shi-BBS PaintBBS (©2000-2004 shi-chan). Show the project page?",
    "このブラウザでは<br>投稿に失敗することがあります<br>":
      "This browser may fail to send your picture.<br>",

    "画像を投稿しますか？<br>投稿に成功後、編集を終了します。":
      "Send this picture and end session?",
    "描きかけの画像があります。動画の読み込みを中止して復元しますか？":
      "Discard animation data and restore session?",
    最: "Mx",
    早: "H",
    既: "M",
    鈍: "L",
    "投稿に失敗。時間を置いて再度投稿してみてください。":
      "Failed to upload image. please try again.",
    HTTPステータスコード: "HTTP status code",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
      "Layer information will not be saved.\nAre you sure you want to continue?",
  },
  es: {
    やり直し: "Rehacer",
    元に戻す: "Deshacer",
    塗り潰し: "Llenar",
    窓: "Ventana",
    投稿: "Enviar",
    "(C)しぃちゃん PaintBBS NEO": "&copy;shi-chan PaintBBS NEO",
    鉛筆: "Lápiz",
    水彩: "Acuarela",
    ﾃｷｽﾄ: "Texto",
    トーン: "Tono",
    ぼかし: "Gradación",
    覆い焼き: "Sobreexp.",
    焼き込み: "Quemar",
    消しペン: "Goma",
    消し四角: "GomaRect",
    全消し: "Borrar",
    四角: "Rect",
    線四角: "LíneaRect",
    楕円: "Óvalo",
    線楕円: "LíneaÓvalo",
    コピー: "Copiar",
    ﾚｲﾔ結合: "UnirCapa",
    角取り: "Antialias",
    左右反転: "Inv.Izq/Der",
    上下反転: "Inv.Arr/Aba",
    傾け: "Inclinar",
    通常: "Normal",
    マスク: "Masc.",
    逆ﾏｽｸ: "Masc.Inv",
    加算: "Adición",
    逆加算: "Subtrac",
    手書き: "Libre",
    直線: "Línea",
    BZ曲線: "Curva",
    Layer0: "Capa0",
    Layer1: "Capa1",
    "ページビュー？": "¿Vista de página?",
    "ウィンドウビュー？": "¿Vista de ventana?",
    "描きかけの画像があります。復元しますか？": "¿Restaurar sesión anterior?",
    右: "Clic derecho",

    "PaintBBS NEOは、お絵描きしぃ掲示板 PaintBBS (©2000-2004 しぃちゃん) をhtml5化するプロジェクトです。\n\nPaintBBS NEOのホームページを表示しますか？":
      "PaintBBS NEO es una versión para HTML5 de Oekaki Shi-BBS PaintBBS (© 2000-2004 shi-chan). ¿Mostrar la página del proyecto?",
    "このブラウザでは<br>投稿に失敗することがあります<br>":
      "Este navegador podría no enviar su imagen.<br>",

    "画像を投稿しますか？<br>投稿に成功後、編集を終了します。":
      "¿Enviar esta imagen y finalizar sesión?",
    "描きかけの画像があります。動画の読み込みを中止して復元しますか？":
      "¿Desechar datos de animación y restaurar sesión?",
    最: "Mx",
    早: "H",
    既: "M",
    鈍: "L",
    "投稿に失敗。時間を置いて再度投稿してみてください。":
      "No se pudo cargar la imagen. por favor, inténtalo de nuevo.",
    HTTPステータスコード: "Código de estado HTTP",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
      "La información de las capas no se guardará.\n¿Está seguro de que desea continuar?",
  },
};

Neo.translate = (function () {
  var language =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language;

  var lang = "en";
  for (var key in Neo.dictionary) {
    if (language.indexOf(key) == 0) {
      lang = key;
      break;
    }
  }
  /** @param {string} string */
  return function (string) {
    if (Neo.config.neo_alt_translation) {
      if (lang == "en") lang = "enx";
    } else {
      if (lang != "ja") lang = "en";
    }
    return Neo.dictionary[lang][string] || string;
  };
})();

"use strict";
//@ts-check

Neo.Painter = class {
  constructor() {
    this._undoMgr = new Neo.UndoManager(50);
    /** @type {Neo.ActionManager} */
    this._actionMgr = new Neo.ActionManager();
    this.clipMouseX = 0;
    this.clipMouseY = 0;
    this.scrollBarX = 0;
    this.scrollBarY = 0;
    this.scrollWidth = 0;
    this.scrollHeight = 0;
  }
};
/** @type {HTMLElement|null} */
Neo.Painter.prototype.container = null;
/** @type {any} */
Neo.Painter.prototype.tool = null;
/** @type {HTMLElement|null} */
Neo.Painter.prototype.inputText = null;
/** @type {number[]|null} */
Neo.Painter.prototype.cursorRect = null;

//Canvas Info
/** @type {Array<HTMLCanvasElement>} */
Neo.Painter.prototype.canvas = [];
/** @type {CanvasRenderingContext2D[]} */
Neo.Painter.prototype.canvasCtx = [];
/** @type {boolean[]} */
Neo.Painter.prototype.visible = [];
Neo.Painter.prototype.current = 0;

//Temp Canvas Info
/** @type {HTMLCanvasElement}*/
Neo.Painter.prototype.tempCanvas;
/** @type {CanvasRenderingContext2D}*/
Neo.Painter.prototype.tempCanvasCtx;
Neo.Painter.prototype.tempX = 0;
Neo.Painter.prototype.tempY = 0;
/** @type {Uint32Array|null} */
Neo.Painter.prototype.temp = null;

//Destination Canvas for display
/** @type {HTMLCanvasElement}*/
Neo.Painter.prototype.destCanvas;
/** @type {CanvasRenderingContext2D}*/
Neo.Painter.prototype.destCanvasCtx;

Neo.Painter.prototype.backgroundColor = "#ffffff";
Neo.Painter.prototype.foregroundColor = "#000000";

Neo.Painter.prototype.lineWidth = 1;
Neo.Painter.prototype.alpha = 1;
Neo.Painter.prototype.zoom = 1;
Neo.Painter.prototype.zoomX = 0;
Neo.Painter.prototype.zoomY = 0;

Neo.Painter.prototype.isMouseDown = false;
Neo.Painter.prototype.isMouseDownRight = false;
Neo.Painter.prototype.isSpaceDown = false;

Neo.Painter.prototype.isBezierActive = false;
Neo.Painter.prototype.isCopyActive = false;

/** @type {any} */
Neo.Painter.prototype.prevMouseX = null;
/** @type {any} */
Neo.Painter.prototype.prevMouseY = null;

Neo.Painter.prototype.mouseX = 0;
Neo.Painter.prototype.mouseY = 0;
Neo.Painter.prototype.rawMouseX = 0;
Neo.Painter.prototype.rawMouseY = 0;

/** @type {number|null} */
Neo.Painter.prototype.stabilizedX = null;
/** @type {number|null} */
Neo.Painter.prototype.stabilizedY = null;

Neo.Painter.prototype.securityTimer = 0;
Neo.Painter.prototype.securityCount = 0;

Neo.Painter.prototype.destWidth = 0;
Neo.Painter.prototype.destHeight = 0;

Neo.Painter.prototype.canvasWidth = 0;
Neo.Painter.prototype.canvasHeight = 0;

Neo.Painter.prototype._currentWidth = 0;
Neo.Painter.prototype._currentMaskType = 0;
//Neo.Painter.prototype.slowX = 0;
//Neo.Painter.prototype.slowY = 0;
//Neo.Painter.prototype.stab = null;

Neo.Painter.prototype.isShiftDown = false;
Neo.Painter.prototype.isCtrlDown = false;
Neo.Painter.prototype.isAltDown = false;

//Neo.Painter.prototype.touchModifier = null;
Neo.Painter.prototype.virtualRight = false;
Neo.Painter.prototype.virtualShift = false;

//Neo.Painter.prototype.onUpdateCanvas;
/** @type {Array<Uint8Array>}  **/
Neo.Painter.prototype._roundData = [];
/** @type {number[][]} **/
Neo.Painter.prototype._toneData = [];
/** @type {any[]} **/
Neo.Painter.prototype.toolStack = [];

Neo.Painter.prototype.maskType = 0;
Neo.Painter.prototype.drawType = 0;
Neo.Painter.prototype.maskColor = "#000000";
/** @type {number[]} */
Neo.Painter.prototype._currentColor = [];
/** @type {number[]} */
Neo.Painter.prototype._currentMask = [];

Neo.Painter.prototype.aerr = 0;
Neo.Painter.prototype.dirty = false;
Neo.Painter.prototype.busy = false;
Neo.Painter.prototype.busySkipped = false;

Neo.Painter.prototype.touchlength = 0;
/**@type {Neo.PenTool} */
Neo.Painter.prototype.penTool;
/**@type {Neo.EraserTool} */
Neo.Painter.prototype.eraserTool;
/**@type {Neo.HandTool} */
Neo.Painter.prototype.handTool;
/**@type {Neo.FillTool} */
Neo.Painter.prototype.fillTool;
/**@type {Neo.EraseAllTool} */
Neo.Painter.prototype.eraseAllTool;
/**@type {Neo.EraseRectTool} */
Neo.Painter.prototype.eraseRectTool;

/**@type {Neo.CopyTool} */
Neo.Painter.prototype.copyTool;
/**@type {Neo.PasteTool} */
Neo.Painter.prototype.pasteTool;
/**@type {Neo.MergeTool} */
Neo.Painter.prototype.mergeTool;
/**@type {Neo.FlipHTool} */
Neo.Painter.prototype.flipHTool;
/**@type {Neo.FlipVTool} */
Neo.Painter.prototype.flipVTool;

/**@type {Neo.BrushTool} */
Neo.Painter.prototype.brushTool;
/**@type {Neo.TextTool} */
Neo.Painter.prototype.textTool;
/**@type {Neo.ToneTool} */
Neo.Painter.prototype.toneTool;
/**@type {Neo.BlurTool} */
Neo.Painter.prototype.blurTool;
/**@type {Neo.DodgeTool} */
Neo.Painter.prototype.dodgeTool;
/**@type {Neo.BurnTool} */
Neo.Painter.prototype.burnTool;
/**@type {Neo.SliderTool} */
Neo.Painter.prototype.sliderTool;
/**@type {Neo.DummyTool} */
Neo.Painter.prototype.dummyTool;

/**@type {Neo.RectTool} */
Neo.Painter.prototype.rectTool;
/**@type {Neo.RectFillTool} */
Neo.Painter.prototype.rectFillTool;
/**@type {Neo.EllipseTool} */
Neo.Painter.prototype.ellipseTool;
/**@type {Neo.EllipseFillTool} */
Neo.Painter.prototype.ellipseFillTool;
/**@type {Neo.BlurRectTool} */
Neo.Painter.prototype.blurRectTool;
/**@type {Neo.TurnTool} */
Neo.Painter.prototype.turnTool;

Neo.Painter.LINETYPE_NONE = 0;
Neo.Painter.LINETYPE_PEN = 1;
Neo.Painter.LINETYPE_ERASER = 2;
Neo.Painter.LINETYPE_BRUSH = 3;
Neo.Painter.LINETYPE_TONE = 4;
Neo.Painter.LINETYPE_DODGE = 5;
Neo.Painter.LINETYPE_BURN = 6;
Neo.Painter.LINETYPE_BLUR = 7;

Neo.Painter.MASKTYPE_NONE = 0;
Neo.Painter.MASKTYPE_NORMAL = 1;
Neo.Painter.MASKTYPE_REVERSE = 2;
Neo.Painter.MASKTYPE_ADD = 3;
Neo.Painter.MASKTYPE_SUB = 4;

Neo.Painter.DRAWTYPE_FREEHAND = 0;
Neo.Painter.DRAWTYPE_LINE = 1;
Neo.Painter.DRAWTYPE_BEZIER = 2;

Neo.Painter.ALPHATYPE_NONE = 0;
Neo.Painter.ALPHATYPE_PEN = 1;
Neo.Painter.ALPHATYPE_FILL = 2;
Neo.Painter.ALPHATYPE_BRUSH = 3;

Neo.Painter.TOOLTYPE_NONE = 0;
Neo.Painter.TOOLTYPE_PEN = 1;
Neo.Painter.TOOLTYPE_ERASER = 2;
Neo.Painter.TOOLTYPE_HAND = 3;
Neo.Painter.TOOLTYPE_SLIDER = 4;
Neo.Painter.TOOLTYPE_FILL = 5;
Neo.Painter.TOOLTYPE_MASK = 6;
Neo.Painter.TOOLTYPE_ERASEALL = 7;
Neo.Painter.TOOLTYPE_ERASERECT = 8;
Neo.Painter.TOOLTYPE_COPY = 9;
Neo.Painter.TOOLTYPE_PASTE = 10;
Neo.Painter.TOOLTYPE_MERGE = 11;
Neo.Painter.TOOLTYPE_FLIP_H = 12;
Neo.Painter.TOOLTYPE_FLIP_V = 13;

Neo.Painter.TOOLTYPE_BRUSH = 14;
Neo.Painter.TOOLTYPE_TEXT = 15;
Neo.Painter.TOOLTYPE_TONE = 16;
Neo.Painter.TOOLTYPE_BLUR = 17;
Neo.Painter.TOOLTYPE_DODGE = 18;
Neo.Painter.TOOLTYPE_BURN = 19;
Neo.Painter.TOOLTYPE_RECT = 20;
Neo.Painter.TOOLTYPE_RECTFILL = 21;
Neo.Painter.TOOLTYPE_ELLIPSE = 22;
Neo.Painter.TOOLTYPE_ELLIPSEFILL = 23;
Neo.Painter.TOOLTYPE_BLURRECT = 24;
Neo.Painter.TOOLTYPE_TURN = 25;

/**
 * ペインターの描画コンポーネントを初期化して、描画可能な状態にする。
 * @description
 * 描画エリア（Canvas）の生成、ツールセットの展開、描画データの初期化を順次行い、
 * 指定されたHTML要素内に PaintBBS NEO を構築する。
 * @param {HTMLElement} div - PaintBBSを描画する親コンテナ要素
 * @param {number|string} width - キャンバスの横幅（ピクセル）
 * @param {number|string} height - キャンバスの高さ（ピクセル）
 */
Neo.Painter.prototype.build = function (div, width, height) {
  this.container = div;
  this._initCanvas(div, width, height);
  this._initRoundData();
  this._initToneData();
  this._initInputText();
  this._initTools();

  this.setTool(this.penTool);
};

/**
 * 現在のツールを切り替え、古いツールの終了と新しいツールの初期化を行う。
 * @description
 * 1. 現在のツールがあれば状態を保存する。
 * 2. 特定のツール（テキストやペースト）の終了処理を実行する。
 * 3. ツールを入れ替え、新しいツールの初期化を行う。
 * 4. 新しいツールの状態を読み込む。
 * @param {any} tool - 新しく設定するツールインスタンス
 */
Neo.Painter.prototype.setTool = function (tool) {
  if (this.tool && this.tool.saveStates) this.tool.saveStates();

  //テキストツール以外のツールに切り替えるときは、テキストツールを終了する
  if (tool !== this.textTool) {
    this.textTool.kill();
  }
  if (this.tool && this.tool.cancelBezier) {
    this.tool.cancelBezier();
  }
  if (tool !== this.pasteTool) {
    this.pasteTool.kill();
  }
  if (this.tool && this.tool.kill) {
    this.tool.kill();
  }
  this.tool = tool;
  tool.init();
  if (this.tool && this.tool.loadStates) this.tool.loadStates();
};

/**
 * 現在のツールをスタックに退避し、新しいツールをアクティブにする。
 * @description
 * ツールの一時的な切り替えを行う。現在使用中のツールを toolStack に保存し、
 * 指定されたツールを新しいアクティブツールとして初期化する。
 * 元のツールに戻る際は popTool を使用することを想定している。
 * @param {any} tool - スタックに積んだ後にアクティブにするツールインスタンス
 */
Neo.Painter.prototype.pushTool = function (tool) {
  this.toolStack.push(this.tool);
  this.tool = tool;
  tool.init();
};

/**
 * 現在のツールを終了し、スタックから以前のツールを復元する。
 * @description
 * スタックに退避されていた以前のツールを現在のアクティブツールとして復元する。
 * 現在のツールに対しては終了処理（kill）を行い、安全に切り替える。
 */
Neo.Painter.prototype.popTool = function () {
  var tool = this.tool;
  if (tool && tool.kill) {
    tool.kill();
  }
  this.tool = this.toolStack.pop();
};

/**
 * 現在アクティブなツールを取得する。
 * @description
 * ツールがスライダー等の設定変更中である場合、スタックの最上位にある
 * 以前のツール（ペイントツール等）を優先的に返すことで、
 * 現在の操作文脈を正しく取得する。
 * @returns {any} 現在のツールインスタンス、またはnull
 */
Neo.Painter.prototype.getCurrentTool = function () {
  if (this.tool) {
    var tool = this.tool;
    // スライダー操作中はスタックから直前のツールを参照する
    if (tool && tool.type == Neo.Painter.TOOLTYPE_SLIDER) {
      var stack = this.toolStack;
      if (stack.length > 0) {
        tool = stack[stack.length - 1];
      }
    }
    return tool;
  }
  return null;
};

Neo.CurrentToolType = 1;
/**
 * ツールタイプに基づいてアクティブなツールを切り替える。
 * @description
 * ツールタイプ（ID）から対応するインスタンスを特定し、セットする。
 * @param {number|string} toolType - Neo.Painter.TOOLTYPE_xxx で定義されたツールID
 */
Neo.Painter.prototype.setToolByType = function (toolType) {
  switch (parseInt(String(toolType))) {
    case Neo.Painter.TOOLTYPE_PEN:
      this.setTool(this.penTool);
      break;
    case Neo.Painter.TOOLTYPE_ERASER:
      this.setTool(this.eraserTool);
      break;
    case Neo.Painter.TOOLTYPE_HAND:
      this.setTool(this.handTool);
      break;
    case Neo.Painter.TOOLTYPE_FILL:
      this.setTool(this.fillTool);
      break;
    case Neo.Painter.TOOLTYPE_ERASEALL:
      this.setTool(this.eraseAllTool);
      break;
    case Neo.Painter.TOOLTYPE_ERASERECT:
      this.setTool(this.eraseRectTool);
      break;

    case Neo.Painter.TOOLTYPE_COPY:
      this.setTool(this.copyTool);
      break;
    case Neo.Painter.TOOLTYPE_PASTE:
      this.setTool(this.pasteTool);
      break;
    case Neo.Painter.TOOLTYPE_MERGE:
      this.setTool(this.mergeTool);
      break;
    case Neo.Painter.TOOLTYPE_FLIP_H:
      this.setTool(this.flipHTool);
      break;
    case Neo.Painter.TOOLTYPE_FLIP_V:
      this.setTool(this.flipVTool);
      break;

    case Neo.Painter.TOOLTYPE_BRUSH:
      this.setTool(this.brushTool);
      break;
    case Neo.Painter.TOOLTYPE_TEXT:
      this.setTool(this.textTool);
      break;
    case Neo.Painter.TOOLTYPE_TONE:
      this.setTool(this.toneTool);
      break;
    case Neo.Painter.TOOLTYPE_BLUR:
      this.setTool(this.blurTool);
      break;
    case Neo.Painter.TOOLTYPE_DODGE:
      this.setTool(this.dodgeTool);
      break;
    case Neo.Painter.TOOLTYPE_BURN:
      this.setTool(this.burnTool);
      break;

    case Neo.Painter.TOOLTYPE_RECT:
      this.setTool(this.rectTool);
      break;
    case Neo.Painter.TOOLTYPE_RECTFILL:
      this.setTool(this.rectFillTool);
      break;
    case Neo.Painter.TOOLTYPE_ELLIPSE:
      this.setTool(this.ellipseTool);
      break;
    case Neo.Painter.TOOLTYPE_ELLIPSEFILL:
      this.setTool(this.ellipseFillTool);
      break;
    case Neo.Painter.TOOLTYPE_BLURRECT:
      this.setTool(this.blurRectTool);
      break;
    case Neo.Painter.TOOLTYPE_TURN:
      this.setTool(this.turnTool);
      break;

    default:
      console.log("unknown toolType " + toolType);
      break;
  }
  Neo.CurrentToolType = Number(toolType);
};

/**
 * キャンバスの初期化とイベントリスナーの登録を行う。
 * @description
 * 1. 描画用キャンバス(canvas)と表示用キャンバス(destCanvas)の生成と設定。
 * 2. willReadFrequently: true を使用した高速なコンテキスト取得。
 * 3. 現代のブラウザ環境に最適化したポインターイベントの登録。
 * 4. coalesceEvents を利用した、高速描画時のポインター追従性の向上。
 * 5. ページ離脱防止アラートのセットアップ。
 * @param {HTMLElement} div - 親コンテナ要素
 * @param {number|string} width - 内部キャンバスの幅
 * @param {number|string} height - 内部キャンバスの高さ
 */
Neo.Painter.prototype._initCanvas = function (div, width, height) {
  width = parseInt(String(width));
  height = parseInt(String(height));
  var destWidth = parseInt(String(div.clientWidth));
  var destHeight = parseInt(String(div.clientHeight));
  this.destWidth = width;
  this.destHeight = height;

  this.canvasWidth = width;
  this.canvasHeight = height;
  this.zoomX = width * 0.5;
  this.zoomY = height * 0.5;

  this.securityTimer = Date.now();
  this.securityCount = 0;

  for (var i = 0; i < 2; i++) {
    this.canvas[i] = document.createElement("canvas");
    this.canvas[i].width = width;
    this.canvas[i].height = height;

    const ctx = this.canvas[i].getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) {
      console.error("_initCanvas: Failed to get 2d context");
      return;
    }
    this.canvasCtx[i] = ctx;

    this.canvas[i].style.imageRendering = "pixelated";
    this.canvasCtx[i].imageSmoothingEnabled = false;
    this.visible[i] = true;
  }

  this.tempCanvas = document.createElement("canvas");
  this.tempCanvas.width = width;
  this.tempCanvas.height = height;
  const tempCanvasCtx = this.tempCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!tempCanvasCtx) {
    console.error("_initCanvas: Failed to get 2d context");
    return;
  }
  this.tempCanvasCtx = tempCanvasCtx;
  this.tempCanvas.style.position = "absolute";
  // this.tempCanvas.enabled = false;

  var array = this.container?.querySelectorAll("canvas");
  if (array && array.length > 0) {
    this.destCanvas = array[0];
  } else {
    this.destCanvas = document.createElement("canvas");
    this.container?.appendChild(this.destCanvas);
  }

  const destCanvasCtx = this.destCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!destCanvasCtx) {
    console.error("_initCanvas: Failed to get 2d context");
    return;
  }
  this.destCanvasCtx = destCanvasCtx;
  this.destCanvas.width = destWidth;
  this.destCanvas.height = destHeight;

  this.destCanvas.style.imageRendering = "pixelated";
  this.destCanvasCtx.imageSmoothingEnabled = false;

  const ref = this;

  if (!Neo.viewer) {
    const container = document.getElementById("neo-container");
    if (!container) return;
    container.onmouseover = function (e) {
      ref._rollOverHandler(e);
    };
    container.onmouseout = function (e) {
      ref._rollOutHandler(e);
    };
    // 先にNeo.Buttonのtouchstart()がトリガーされる
    container.addEventListener(
      "mousedown", //pointerdownに変更するとここが先にトリガーされ、線幅を保存できなくなる
      function (e) {
        ref._mouseDownHandler(e);
      },
      { passive: false, capture: false },
    );
    container.addEventListener(
      "mouseup",
      function (e) {
        ref.touchlength = 0;
        ref._mouseUpHandler(e);
      },
      { passive: false, capture: false },
    );
    container.addEventListener(
      "touchstart",
      function (e) {
        ref.touchlength = e.touches?.length;
        ref._mouseDownHandler(e);
      },
      { passive: false, capture: false },
    );
    container.addEventListener(
      "touchend",
      function (e) {
        ref.touchlength = 0;
        ref._mouseUpHandler(e);
      },
      { passive: false, capture: false },
    );
    container.addEventListener(
      "pointermove",
      function (e) {
        //フリーハンドモード?
        const freeHandMode = ref.drawType === 0;
        //ツールは鉛筆･消しゴムまたは水彩?
        const usesHighPrecisionTool = [1, 2, 14].includes(Neo.CurrentToolType);
        //ブラシサイズは16px以下?
        const smallbrush = ref.lineWidth <= 16;
        //上記条件が揃う時はポインター追従性を高くする
        if (
          ref.isMouseDown &&
          freeHandMode &&
          usesHighPrecisionTool &&
          smallbrush
        ) {
          const events = e.getCoalescedEvents?.() ?? [e];
          for (const ev of events) {
            ref._mouseMoveHandler(ev);
          }
        } else {
          ref._mouseMoveHandler(e);
        }
      },
      { passive: false, capture: false },
    );
    container.addEventListener(
      "pointercancel",
      function (e) {
        //Eventがキャンセルされた時はUp時と同じ処理を行う
        ref.touchlength = 0;
        ref.isMouseDown = false;
        ref._mouseUpHandler(e);
      },
      { capture: false },
    );

    document.onkeydown = function (e) {
      ref._keyDownHandler(e);
    };
    document.onkeyup = function (e) {
      ref._keyUpHandler(e);
    };
  }

  if (Neo.config.neo_confirm_unload == "true") {
    window.onbeforeunload = function (e) {
      if (!Neo.uploaded && ref.isDirty()) {
        e.preventDefault();
        return false;
      }
    };
  }
  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight);
};

Neo.Painter.prototype._initRoundData = function () {
  for (var r = 1; r <= 30; r++) {
    this._roundData[r] = new Uint8Array(r * r);
    var mask = this._roundData[r];
    var d = Math.floor(r / 2.0);
    var index = 0;
    for (var x = 0; x < r; x++) {
      for (var y = 0; y < r; y++) {
        var xx = x + 0.5 - r / 2.0;
        var yy = y + 0.5 - r / 2.0;
        mask[index++] = xx * xx + yy * yy <= (r * r) / 4 ? 1 : 0;
      }
    }
  }
  this._roundData[3][0] = 0;
  this._roundData[3][2] = 0;
  this._roundData[3][6] = 0;
  this._roundData[3][8] = 0;

  this._roundData[5][1] = 0;
  this._roundData[5][3] = 0;
  this._roundData[5][5] = 0;
  this._roundData[5][9] = 0;
  this._roundData[5][15] = 0;
  this._roundData[5][19] = 0;
  this._roundData[5][21] = 0;
  this._roundData[5][23] = 0;
};

Neo.Painter.prototype._initToneData = function () {
  var pattern = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  for (var i = 0; i < 16; i++) {
    this._toneData[i] = new Array(16);
    for (var j = 0; j < 16; j++) {
      this._toneData[i][j] = i >= pattern[j] ? 1 : 0;
    }
  }
};

/**
 * アルファ値に対応するトーンパターンデータを取得する。
 * @description
 * 定義済みの閾値テーブル(alphaTable)に基づき、指定されたアルファ値に最も近い
 * ハーフトーンのパターンを選択して返す。
 * @param {number} alpha - 0〜255の範囲のアルファ値（透明度）
 * @returns {Array<number>} 対応するハーフトーンパターン
 */
Neo.Painter.prototype.getToneData = function (alpha) {
  var alphaTable = [
    23, 47, 69, 92, 114, 114, 114, 138, 161, 184, 184, 207, 230, 230, 253,
  ];

  for (var i = 0; i < alphaTable.length; i++) {
    if (alpha < alphaTable[i]) {
      return this._toneData[i];
    }
  }
  return this._toneData[i];
};

/**
 * テキスト入力
 */
Neo.Painter.prototype._initInputText = function () {
  var text = document.getElementById("neo-inputText");
  if (!text) {
    text = document.createElement("div");
  }

  text.id = "neo-inputText";
  text.setAttribute("contentEditable", "true");
  text.spellcheck = false;
  text.className = "inputText";
  text.innerHTML = "";

  text.style.display = "none";
  //  text.style.userSelect = "none";
  this.container?.appendChild(text);
  this.inputText = text;

  this.updateInputText();
};

Neo.Painter.prototype._initTools = function () {
  this.penTool = new Neo.PenTool();
  this.eraserTool = new Neo.EraserTool();
  this.handTool = new Neo.HandTool();
  this.fillTool = new Neo.FillTool();
  this.eraseAllTool = new Neo.EraseAllTool();
  this.eraseRectTool = new Neo.EraseRectTool();

  this.copyTool = new Neo.CopyTool();
  this.pasteTool = new Neo.PasteTool();
  this.mergeTool = new Neo.MergeTool();
  this.flipHTool = new Neo.FlipHTool();
  this.flipVTool = new Neo.FlipVTool();

  this.brushTool = new Neo.BrushTool();
  this.textTool = new Neo.TextTool();
  this.toneTool = new Neo.ToneTool();
  this.blurTool = new Neo.BlurTool();
  this.dodgeTool = new Neo.DodgeTool();
  this.burnTool = new Neo.BurnTool();

  this.rectTool = new Neo.RectTool();
  this.rectFillTool = new Neo.RectFillTool();
  this.ellipseTool = new Neo.EllipseTool();
  this.ellipseFillTool = new Neo.EllipseFillTool();
  this.blurRectTool = new Neo.BlurRectTool();
  this.turnTool = new Neo.TurnTool();

  this.sliderTool = new Neo.SliderTool();
  this.dummyTool = new Neo.DummyTool();
};

Neo.Painter.prototype.hideInputText = function () {
  const text = this.inputText;
  if (!text) {
    console.error("inputText not found for hideInputText");
    return;
  }
  text.blur();
  text.style.display = "none";
};

Neo.Painter.prototype.updateInputText = function () {
  const text = this.inputText;
  if (!text) {
    console.error("inputText not found for updateInputText");
    return;
  }

  const d = this.lineWidth;
  const fontSize = Math.round((d * 55) / 28 + 7);
  const height = Math.round((d * 68) / 28 + 12);

  text.style.fontSize = fontSize + "px";
  text.style.lineHeight = fontSize + "px";
  text.style.height = fontSize + "px";
  text.style.marginTop = -fontSize + "px";
};

Neo.Painter.prototype.cancelCopy = function () {
  if (!this.isCopyActive) return;
  if (Neo.CurrentToolType !== Neo.Painter.TOOLTYPE_PASTE) return;
  this.popTool();
  this.setToolByType(Neo.Painter.TOOLTYPE_COPY);
  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, true);
};

/*
   -----------------------------------------------------------------------
   Mouse Event Handling
   -----------------------------------------------------------------------
 */

/**
 * @param {KeyboardEvent} e
 */
Neo.Painter.prototype._keyDownHandler = function (e) {
  this.isShiftDown = e.shiftKey;
  this.isCtrlDown = e.ctrlKey;
  this.isAltDown = e.altKey;
  var key = e.key ? e.key.toLowerCase() : null;
  if (key === " ") this.isSpaceDown = true;

  if (!this.isShiftDown && this.isCtrlDown) {
    if (!this.isAltDown) {
      if (key === "z" || key === "u") {
        this.cancelCopy();
        this.undo(); // Ctrl+Z, Ctrl+U
      }
      if (key === "y") this.redo(); // Ctrl+Y
    } else {
      if (key === "z") this.redo(); // Ctrl+Alt+Z
    }
  }
  if (!this.isShiftDown && !this.isCtrlDown && !this.isAltDown) {
    if (key == "+") new Neo.ZoomPlusCommand(this).execute(); // +
    if (key == "-") new Neo.ZoomMinusCommand(this).execute(); // -
    //鉛筆
    if (key == "b") this.setToolByType(Neo.Painter.TOOLTYPE_PEN);
    //水彩
    if (key == "w") this.setToolByType(Neo.Painter.TOOLTYPE_BRUSH);
    //消しゴム
    if (key == "e") this.setToolByType(Neo.Painter.TOOLTYPE_ERASER);
    //全消し
    if (
      document.activeElement != this.inputText &&
      key &&
      ["delete", "backspace"].includes(key)
    ) {
      this._pushUndo();
      this._actionMgr.eraseAll();
    }
  }

  if (this.tool.keyDownHandler) {
    this.tool.keyDownHandler(e);
  }

  //スペース・Shift+スペースででスクロールしないように
  // if (document.activeElement != this.inputText) e.preventDefault();
  // console.log(document.activeElement.tagName)
  //ctrlキーとの組み合わせのブラウザデフォルトのショートカットキーを無効化
  //但しctrl+v,ctrl+x,ctrl+aは使用可能
  const keys = ["+", ";", "=", "-", "s", "h", "r", "y", "z", "u", "o"];
  if ((e.ctrlKey || e.metaKey) && e.key && keys.includes(e.key.toLowerCase())) {
    e.preventDefault();
  }

  //text入力と、入力フォーム以外はすべてのキーボードイベントを無効化
  if (document.activeElement != this.inputText) {
    if (
      !(
        document.activeElement?.tagName.toLocaleUpperCase() === "INPUT" ||
        document.activeElement?.tagName.toLocaleUpperCase() === "TEXTAREA"
      )
    ) {
      e.preventDefault();
    }
  }
};
/**
 * @param {KeyboardEvent} e
 */
Neo.Painter.prototype._keyUpHandler = function (e) {
  this.isShiftDown = e.shiftKey;
  this.isCtrlDown = e.ctrlKey;
  this.isAltDown = e.altKey;
  if (e.key == " ") this.isSpaceDown = false;

  //FirefoxのメニューがAltキーで開閉しないようにする
  if (e.key && e.key.toLowerCase() === "alt") {
    e.preventDefault(); // Altキーのデフォルトの動作をキャンセル
  }

  if (this.tool.keyUpHandler) {
    this.tool.keyUpHandler(e);
  }
};

/**
 * @param {MouseEvent} e
 */
Neo.Painter.prototype._rollOverHandler = function (e) {
  if (this.tool.rollOverHandler) {
    this.tool.rollOverHandler(this);
  }
};

/**
 * @param {MouseEvent} e
 */
Neo.Painter.prototype._rollOutHandler = function (e) {
  if (this.tool.rollOutHandler) {
    this.tool.rollOutHandler(this);
  }
};
/**
 * @param {MouseEvent|TouchEvent} e
 * @returns {void}
 */
Neo.Painter.prototype._mouseDownHandler = function (e) {
  if (this.busy) {
    // loadAnimation実行中は何もしない
    if (e.target == this.destCanvas) {
      this.busySkipped = true;
    }
    return;
  }

  if (e.target == this.destCanvas) {
    //よくわからないがChromeでドラッグの時カレットが出るのを防ぐ
    //http://stackoverflow.com/questions/2745028/chrome-sets-cursor-to-text-while-dragging-why
    e.preventDefault();
  }

  if (this.touchlength > 1) return;

  if ((e instanceof MouseEvent && e.button == 2) || this.virtualRight) {
    this.isMouseDownRight = true;
  } else {
    if (!e.shiftKey && e.ctrlKey && e.altKey) {
      this.isMouseDown = true;
    } else {
      if (e.ctrlKey || e.altKey) {
        this.isMouseDownRight = true;
      } else {
        this.isMouseDown = true;
      }
    }
  }

  this._updateMousePosition(e);
  this.prevMouseX = this.mouseX;
  this.prevMouseY = this.mouseY;
  this.securityCount++;
  let autosaveCount = this.securityCount;
  if (autosaveCount % 10 === 0 && this.isDirty()) {
    this.saveSession(); //10ストロークごとに自動バックアップ
  }

  if (
    Neo.CurrentToolType === Neo.Painter.TOOLTYPE_PASTE &&
    this.isCopyActive &&
    this.isMouseDownRight
  ) {
    this.cancelCopy();
    this.isMouseDownRight = false;
    return;
  }
  if (
    this.drawType == Neo.Painter.DRAWTYPE_BEZIER &&
    this.isBezierActive &&
    this.isMouseDownRight
  ) {
    this.isMouseDownRight = false;
    if (this.tool.cancelBezier) {
      this.tool.cancelBezier();
    }
    return;
  }
  if (this.drawType != Neo.Painter.DRAWTYPE_BEZIER && this.isBezierActive) {
    if (this.tool.cancelBezier) {
      this.tool.cancelBezier();
    }
    return;
  }

  // 右クリック時のカラーピッカーのガード
  if (this.isMouseDownRight) {
    this.isMouseDownRight = false;
    if (e.target instanceof HTMLElement && !this.isWidget(e.target)) {
      this.pickColor(this.mouseX, this.mouseY);
      return;
    }
  }
  /** @typedef {HTMLElement & { "data-bar": boolean | string | number }} BarElement */

  if (!this.isUIPaused()) {
    if (
      e.target instanceof HTMLElement &&
      /** @type {BarElement} */ (e.target)["data-bar"]
    ) {
      this.pushTool(this.handTool);
      this.handTool.reverse = false;
    } else if (this.isSpaceDown && document.activeElement != this.inputText) {
      this.pushTool(this.handTool);
      this.handTool.reverse = true;
    } else if (
      e.target instanceof HTMLElement &&
      /** @type {any} */ (e.target)["data-slider"] != undefined
    ) {
      this.pushTool(this.sliderTool);
      this.sliderTool.target = e.target;
      this.sliderTool.alt = false;
    } else if (e.ctrlKey && e.altKey && !e.shiftKey) {
      this.pushTool(this.sliderTool);
      this.sliderTool.target = Neo.sliders[Neo.SLIDERTYPE_SIZE].element;
      this.sliderTool.alt = true;
    } else if (e.target instanceof HTMLElement && this.isWidget(e.target)) {
      // UI操作時のツール切り替え（dummyToolへの差し替え）
      this.isMouseDown = false;
      this.pushTool(this.dummyTool);
    }
  }

  // console.log("down -" + e.type + " - " + e.target.id + e.target.className);
  //  console.warn("down -" + e.target.id + e.target.className)
  this.tool.downHandler(this);

  //  var ref = this;
  //  document.onmouseup = function(e) {
  //      ref._mouseUpHandler(e)
  //  };
};

/**
 * @param {MouseEvent|TouchEvent} e
 */
Neo.Painter.prototype._mouseUpHandler = function (e) {
  this.isMouseDown = false;
  this.isMouseDownRight = false;
  this.tool.upHandler(this);
  //  document.onmouseup = undefined;

  if (e.target instanceof HTMLElement && e.target.id != "neo-right") {
    this.virtualRight = false;
    Neo.RightButton.clear();
  }

  this._updateMousePosition(e);

  //  if (e.changedTouches) {
  //      for (var i = 0; i < e.changedTouches.length; i++) {
  //          var touch = e.changedTouches[i];
  //          if (touch.identifier == this.touchModifier) {
  //              this.touchModifier = null;
  //          }
  //      }
  //  }
};
/**
 * @param {PointerEvent|TouchEvent} e
 * @returns
 */
Neo.Painter.prototype._mouseMoveHandler = function (e) {
  this._updateMousePosition(e);

  if (this.touchlength > 1) return;

  if (this.isMouseDown || this.isMouseDownRight) {
    this.tool.moveHandler(this);
  } else {
    if (this.tool.upMoveHandler) {
      this.tool.upMoveHandler(this);
    }
  }

  this.prevMouseX = this.mouseX;
  this.prevMouseY = this.mouseY;

  // 画面外をタップした時スクロール可能にするため
  //  console.warn("move -" + e.target.id + e.target.className)
  if (
    e.cancelable &&
    e.target instanceof HTMLElement &&
    e.target.className != "o"
  ) {
    e.preventDefault();
  }
};

/**
 * @param {MouseEvent|TouchEvent} e
 */
Neo.Painter.prototype.getPosition = function (e) {
  if (e instanceof MouseEvent && e.clientX !== undefined) {
    return { x: e.clientX, y: e.clientY, e: e.type };
  } else if (e instanceof TouchEvent) {
    var touch = e.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY, e: e.type };

    //      for (var i = 0; i < e.changedTouches.length; i++) {
    //          var touch = e.changedTouches[i];
    //          if (!this.touchModifier || this.touchModifier != touch.identifier) {
    //              return {x: touch.clientX, y: touch.clientY, e: e.type};
    //          }
    //      }
    //      console.log("getPosition error");
    //      return {x:0, y:0};
  } else {
    console.warn("Unknown event:", e.type);
    return { x: 0, y: 0, e: e.type || "unknown" };
  }
};

/**
 * 手ぶれ補正
 */
Neo.Painter.prototype._stabilizer = function () {
  const freeHandMode = this.drawType === 0;

  const toolTypes = [
    Neo.Painter.TOOLTYPE_PEN,
    Neo.Painter.TOOLTYPE_ERASER,
    Neo.Painter.TOOLTYPE_BRUSH,
    Neo.Painter.TOOLTYPE_TONE,
    Neo.Painter.TOOLTYPE_BLUR,
    Neo.Painter.TOOLTYPE_DODGE,
    Neo.Painter.TOOLTYPE_BURN,
  ];

  const isDrawTool = freeHandMode && toolTypes.includes(Neo.CurrentToolType);

  if (Neo.config.neo_disable_stabilizer == "true" || !isDrawTool) {
    return;
  }
  if (this.isMouseDown) {
    // 手ぶれ補正の強さ
    // 補正なし 0.0 最強 0.99
    const level = Math.max(0, Math.min(Neo.stabilize_level, 5));
    //手ぶれ補正のレベルを6段階に分けたテーブル
    //0で補正なし、5で最強
    // [0:無効, 1:0.55, 2:0.8, 3:0.85, 4:0.9, 5:0.96]
    const stabilityTable = [0.0, 0.55, 0.8, 0.85, 0.9, 0.96];
    const stabilityLebel = stabilityTable[level];
    //ブラシサイズが大きい時と拡大時は補正強度を下げる
    const zoomModifier = this.zoom <= 1 ? 1 : 0.88;
    const sizeModifier = this.lineWidth <= 8 ? 1 : 0.96;
    const stability = stabilityLebel * zoomModifier * sizeModifier;
    const factor = 1.0 - stability;

    if (
      typeof this.stabilizedX === "number" &&
      typeof this.stabilizedY === "number"
    ) {
      this.stabilizedX = factor * this.mouseX + stability * this.stabilizedX;
      this.stabilizedY = factor * this.mouseY + stability * this.stabilizedY;
    } else {
      // stabilizedX が未定義なら現在の位置で初期化
      this.stabilizedX = this.mouseX;
      this.stabilizedY = this.mouseY;
    }
    // 手ぶれ補正後の数値に差し替え
    this.mouseX = this.stabilizedX;
    this.mouseY = this.stabilizedY;
  } else {
    // マウスを離している時はリセット
    this.stabilizedX = null;
    this.stabilizedY = null;
  }
};
/**
 * ポインターの位置を更新する
 * @param {MouseEvent|TouchEvent} e
 */
Neo.Painter.prototype._updateMousePosition = function (e) {
  var rect = this.destCanvas.getBoundingClientRect();
  //  var x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
  //  var y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
  var pos = this.getPosition(e);

  var x = pos.x;
  var y = pos.y;

  if (this.zoom <= 0) this.zoom = 1; //なぜか0になることがあるので

  this.mouseX =
    (x - rect.left) / this.zoom +
    this.zoomX -
    (this.destCanvas.width * 0.5) / this.zoom;
  this.mouseY =
    (y - rect.top) / this.zoom +
    this.zoomY -
    (this.destCanvas.height * 0.5) / this.zoom;

  if (isNaN(this.prevMouseX)) {
    this.prevMouseX = this.mouseX;
  }
  if (isNaN(this.prevMouseY)) {
    this.prevMouseY = this.mouseY;
  }

  //手ぶれ補正
  this._stabilizer();

  /*
     this.slowX = this.slowX * 0.8 + this.mouseX * 0.2;
     this.slowY = this.slowY * 0.8 + this.mouseY * 0.2;
     var now = Date.now();
     if (this.stab) {
     var pause = this.stab[3];
     if (pause) {
     // ポーズ中
     if (now > pause) {
     this.stab = [this.slowX, this.slowY, now];
     }
     
     } else {
     // ポーズされていないとき
     var prev = this.stab[2];
     if (now - prev > 150) { // 150ms以上止まっていたらポーズをオンにする
     this.stab[3] = now + 200 // 200msペンの位置を固定

     } else {
     this.stab = [this.slowX, this.slowY, now];
     }
     }
     } else {
     this.stab = [this.slowX, this.slowY, now];
     }
   */

  this.rawMouseX = x;
  this.rawMouseY = y;
  this.clipMouseX = Math.max(Math.min(this.canvasWidth, this.mouseX), 0);
  this.clipMouseY = Math.max(Math.min(this.canvasHeight, this.mouseY), 0);
};

// Neo.Painter.prototype._beforeUnloadHandler = function (e) {
//   // quick save
// };

/*
   Neo.Painter.prototype.getStabilized = function() {
   return this.stab;
   };
 */

/*
   -------------------------------------------------------------------------
   Undo
   -------------------------------------------------------------------------
 */

Neo.Painter.prototype.undo = function () {
  var undoItem = this._undoMgr.popUndo();

  if (undoItem && undoItem.data.length > 0) {
    this._pushRedo();
    this._actionMgr.back();

    this.canvasCtx[0].putImageData(undoItem.data[0], undoItem.x, undoItem.y);
    this.canvasCtx[1].putImageData(undoItem.data[1], undoItem.x, undoItem.y);
    this.updateDestCanvas(
      undoItem.x,
      undoItem.y,
      undoItem.width,
      undoItem.height,
    );
  }
};

Neo.Painter.prototype.redo = function () {
  var undoItem = this._undoMgr.popRedo();

  if (undoItem && undoItem.data.length > 0) {
    this._actionMgr.forward();

    this._pushUndo(0, 0, this.canvasWidth, this.canvasHeight, true);
    this.canvasCtx[0].putImageData(undoItem.data[0], undoItem.x, undoItem.y);
    this.canvasCtx[1].putImageData(undoItem.data[1], undoItem.x, undoItem.y);
    this.updateDestCanvas(
      undoItem.x,
      undoItem.y,
      undoItem.width,
      undoItem.height,
    );
  }
};

//Neo.Painter.prototype.hasUndo = function() {
//    return true;
//};

/**
 * 現在のキャンバス状態をUndo履歴に保存する。
 * @description
 * 指定された範囲のキャンバスデータ（レイヤー0と1）を抽出し、
 * UndoItemとして履歴管理マネージャーにプッシュする。
 * @param {number} [x=0] - 取得開始X座標
 * @param {number} [y=0] - 取得開始Y座標
 * @param {number} [w=canvasWidth] - 取得範囲の幅
 * @param {number} [h=canvasHeight] - 取得範囲の高さ
 * @param {boolean} [holdRedo=false] - リドゥ履歴を保持するかどうか
 */
Neo.Painter.prototype._pushUndo = function (x, y, w, h, holdRedo = false) {
  x = x === undefined ? 0 : x;
  y = y === undefined ? 0 : y;
  w = w === undefined ? this.canvasWidth : w;
  h = h === undefined ? this.canvasHeight : h;
  var undoItem = new Neo.UndoItem();
  undoItem.x = 0;
  undoItem.y = 0;
  undoItem.width = w;
  undoItem.height = h;
  undoItem.data = [
    this.canvasCtx[0].getImageData(x, y, w, h),
    this.canvasCtx[1].getImageData(x, y, w, h),
  ];
  this._undoMgr.pushUndo(undoItem, holdRedo);

  if (!holdRedo) {
    this._actionMgr.step();
  }
  this.dirty = true;
};

/**
 * 現在のキャンバス状態をRedo（やり直し）履歴に保存する。
 * @description
 * Undo操作が行われた直後の、現在のキャンバス状態をスナップショットとして保存する。
 * これにより、Undoした後に再度やり直すことが可能になる。
 * @param {number} [x=0] - 取得開始X座標
 * @param {number} [y=0] - 取得開始Y座標
 * @param {number} [w=canvasWidth] - 取得範囲の幅
 * @param {number} [h=canvasHeight] - 取得範囲の高さ
 */
Neo.Painter.prototype._pushRedo = function (x, y, w, h) {
  x = x === undefined ? 0 : x;
  y = y === undefined ? 0 : y;
  w = w === undefined ? this.canvasWidth : w;
  h = h === undefined ? this.canvasHeight : h;
  var undoItem = new Neo.UndoItem();
  undoItem.x = 0;
  undoItem.y = 0;
  undoItem.width = w;
  undoItem.height = h;
  undoItem.data = [
    this.canvasCtx[0].getImageData(x, y, w, h),
    this.canvasCtx[1].getImageData(x, y, w, h),
  ];
  this._undoMgr.pushRedo(undoItem);
};

/*
   -------------------------------------------------------------------------
   Data Cache for Undo / Redo
   -------------------------------------------------------------------------
 */

/**
 * Undo/Redo履歴を管理するマネージャー。
 * @description
 * 描画操作のスナップショット（Neo.UndoItem）をスタックとして保持する。
 * 最大ステップ数（_maxStep）を設定することで、メモリの肥大化を抑制しつつ
 * ユーザーの操作履歴を安全に管理する。
 * @param {number} _maxStep - 保持する履歴の最大数
 */
Neo.UndoManager = function (_maxStep) {
  this._maxStep = _maxStep;
  /** @type {Neo.UndoItem[]} */
  this._undoItems = [];
  /** @type {Neo.UndoItem[]} */
  this._redoItems = [];
};

/**
 * 新しい操作履歴（UndoItem）を登録し、履歴を管理する。
 * @description
 * 1. 新しい状態をスタックに積む。
 * 2. 最大ステップ数を超えた場合、最も古い履歴を削除してメモリを解放する。
 * 3. 新しい操作が行われた場合、それ以降の「やり直し（Redo）」履歴をクリアし、
 * 操作の分岐点を明確にする。
 * @param {Neo.UndoItem} undoItem - 保存するキャンバスの状態データ
 * @param {boolean} holdRedo - Redo履歴を保持するかどうか
 */
Neo.UndoManager.prototype.pushUndo = function (undoItem, holdRedo) {
  this._undoItems.push(undoItem);

  if (this._undoItems.length > this._maxStep) {
    this._undoItems.shift();
  }

  if (!holdRedo == true) {
    this._redoItems = [];
  }
};

Neo.UndoManager.prototype.popUndo = function () {
  return this._undoItems.pop();
};

/**
 * やり直し（Redo）の履歴をスタックに追加する。
 * @description
 * Undo操作によってスタックから取り出された状態を Redo 履歴に保存して
 * Undoした状態からRedoできるようにする。
 * @param {Neo.UndoItem} undoItem - 保存するキャンバスの状態データ
 */
Neo.UndoManager.prototype.pushRedo = function (undoItem) {
  this._redoItems.push(undoItem);
};

Neo.UndoManager.prototype.popRedo = function () {
  return this._redoItems.pop();
};

/**
 * キャンバスの状態を保持するUndo/Redo用のクラス
 */
Neo.UndoItem = class {
  /**
   * @param {ImageData[]} [data]
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [width]
   * @param {number} [height]
   */
  constructor(data = [], x = 0, y = 0, width = 0, height = 0) {
    this.data = data;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
};

/*
   -------------------------------------------------------------------------
   Zoom Controller
   -------------------------------------------------------------------------
 */

/**
 * 表示倍率を設定し、キャンバスの表示サイズを更新する。
 * @description
 * 指定された倍率（value）に基づき、表示用キャンバス（destCanvas）のサイズを計算・更新する。
 * 表示領域の余白（100px/130px）を考慮し、描画誤差を防ぐためにサイズを偶数に補正する。
 * 最後に表示領域の更新とズーム位置の再計算を行う。
 * @param {number} value - 拡大率（例: 1.0 = 100%）
 */
Neo.Painter.prototype.setZoom = function (value) {
  this.zoom = value;

  const container = document.getElementById("neo-container");
  if (!container) return;
  var width = Math.round(this.canvasWidth * this.zoom);
  var height = Math.round(this.canvasHeight * this.zoom);

  if (width > container.clientWidth - 100) width = container.clientWidth - 100;
  if (height > container.clientHeight - 130)
    height = container.clientHeight - 130;

  // width, heightは偶数でないと誤差が出るため
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  this.destWidth = width;
  this.destHeight = height;

  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, false);
  this.setZoomPosition(this.zoomX, this.zoomY);
};

/**
 * ズーム時の表示中心座標を設定し、スクロールバー等のUIを同期する。
 * @description
 * 表示領域（destCanvas）から、キャンバス全体のどの座標を中心に見るかを計算する。
 * 画面外にはみ出さないよう座標をクランプ（制限）し、表示用キャンバスを更新する。
 * また、スクロールバーの進捗率を計算して更新を行う。
 * @param {number} x - 視点の中心X座標
 * @param {number} y - 視点の中心Y座標
 */
Neo.Painter.prototype.setZoomPosition = function (x, y) {
  var minx = (this.destCanvas.width / this.zoom) * 0.5;
  var maxx = this.canvasWidth - minx;
  var miny = (this.destCanvas.height / this.zoom) * 0.5;
  var maxy = this.canvasHeight - miny;

  x = Math.round(Math.max(Math.min(maxx, x), minx));
  y = Math.round(Math.max(Math.min(maxy, y), miny));

  this.zoomX = x;
  this.zoomY = y;
  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, false);

  this.scrollBarX = maxx == minx ? 0 : (x - minx) / (maxx - minx);
  this.scrollBarY = maxy == miny ? 0 : (y - miny) / (maxy - miny);
  this.scrollWidth = maxx - minx;
  this.scrollHeight = maxy - miny;

  if (Neo.scrollH) Neo.scrollH.update(this);
  if (Neo.scrollV) Neo.scrollV.update(this);

  this.hideInputText();
};

/*
   -------------------------------------------------------------------------
   Drawing Helper
   -------------------------------------------------------------------------
 */

/**
 * データ送信
 * @param {string} boardURL 掲示板のURL
 * @returns
 */
Neo.Painter.prototype.submit = function (boardURL) {
  if (Neo.isAnimation) {
    // neo_save_layers
    var items = this._actionMgr._items;
    if (items.length > 0 && items[items.length - 1][0] != "restore") {
      this._pushUndo();
      this._actionMgr.restore();
    }
  }

  var thumbnail = null;
  var thumbnail2 = null;

  if (Neo.config.thumbnail_type == "animation" || this.useThumbnail()) {
    thumbnail = this.getThumbnail(Neo.config.thumbnail_type || "png");
  }

  if (Neo.config.thumbnail_type2 && this.useThumbnail()) {
    thumbnail2 = this.getThumbnail(Neo.config.thumbnail_type2);
  }

  /*
     if (this.useThumbnail()) {
     thumbnail = this.getThumbnail(Neo.config.thumbnail_type || "png");
     if (Neo.config.thumbnail_type2) {
     thumbnail2 = this.getThumbnail(Neo.config.thumbnail_type2);
     }
     }*/
  const png = this.getPNG();
  if (!(png instanceof Blob)) {
    console.error("Failed to get PNG data. Submission aborted.");
    return;
  }
  Neo.submit(boardURL, png, thumbnail2, thumbnail);
};

Neo.Painter.prototype.useThumbnail = function () {
  var thumbnailWidth = this.getThumbnailWidth();
  var thumbnailHeight = this.getThumbnailHeight();
  if (thumbnailWidth && thumbnailHeight) {
    if (
      thumbnailWidth < this.canvasWidth ||
      thumbnailHeight < this.canvasHeight
    ) {
      return true;
    }
  }
  return false;
};

/**
 * DataURL形式の文字列をBlobオブジェクトに変換する。
 * @description
 * Base64形式またはURIエンコードされたDataURLから、
 * Blob（バイナリ）形式へ変換を行う。
 * ファイルアップロードやサーバー保存の直前段階で利用される。
 * @param {string} dataURL - 変換元のDataURL文字列
 * @returns {Blob} 変換後のBlobオブジェクト（type: image/png）
 */
Neo.Painter.prototype.dataURLtoBlob = function (dataURL) {
  var byteString;
  if (dataURL.split(",")[0].indexOf("base64") >= 0) {
    byteString = atob(dataURL.split(",")[1]);
  } else {
    byteString = decodeURI(dataURL.split(",")[1]);
  }

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: "image/png" });
};

/**
 * 現在のレイヤー状態を統合し、完成画像を返す。
 * @description
 * 内部で保持している複数のレイヤー（this.canvas[0], [1]）を、
 * 指定されたサイズにリサイズまたは調整して一つのキャンバスへ描画する。
 * 背景色（白）を塗りつぶした後に重ね合わせることで、合成画像を作成する。
 * @param {number|null} [imageWidth] - 出力画像の幅（省略時はキャンバス幅）
 * @param {number|null} [imageHeight] - 出力画像の高さ（省略時はキャンバス高さ）
 * @returns {HTMLCanvasElement|null} 合成された画像データを持つCanvas要素
 */
Neo.Painter.prototype.getImage = function (imageWidth, imageHeight) {
  const canvasWidth = this.canvasWidth;
  const canvasHeight = this.canvasHeight;
  const width = imageWidth ?? canvasWidth;
  const height = imageHeight ?? canvasHeight;

  var pngCanvas = document.createElement("canvas");
  pngCanvas.width = width;
  pngCanvas.height = height;
  var pngCanvasCtx = pngCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!pngCanvasCtx) {
    return null;
  }
  pngCanvasCtx.fillStyle = "#ffffff";
  pngCanvasCtx.fillRect(0, 0, width, height);

  if (this.visible[0]) {
    pngCanvasCtx.drawImage(
      this.canvas[0],
      0,
      0,
      canvasWidth,
      canvasHeight,
      0,
      0,
      width,
      height,
    );
  }
  if (this.visible[1]) {
    pngCanvasCtx.drawImage(
      this.canvas[1],
      0,
      0,
      canvasWidth,
      canvasHeight,
      0,
      0,
      width,
      height,
    );
  }
  return pngCanvas;
};

/**
 * 現在の描画内容をPNG形式のBlobとして取得する。
 * @description
 * 1. getImage() を呼び出し、レイヤーを統合した完成画像（Canvas）を取得する。
 * 2. toDataURL("image/png") を使用して、Canvasの内容をBase64文字列に変換する。
 * 3. dataURLtoBlob() を使用して、Base64文字列をサーバー通信やダウンロードに適したBlobバイナリに変換する。
 * @returns {Blob|null} PNG形式のBlobオブジェクト。失敗時はnullを返す。
 */
Neo.Painter.prototype.getPNG = function () {
  // レイヤーを統合した画像を取得
  var image = this.getImage();
  if (!image) {
    console.error("Failed to export image.");
    return null;
  }

  // CanvasをBase64エンコードされたデータURL形式に変換
  var dataURL = image.toDataURL("image/png");

  // 文字列データをバイナリ（Blob）に変換して返す
  return this.dataURLtoBlob(dataURL);
};
/**
 * 掲示板投稿や保存用のサムネイル、またはアニメーション用の描画データを取得する。
 * @description
 * - "animation" 以外: getImage() で生成した画像を指定サイズでリサイズし、Blobとして返す。
 * - "animation" 指定時: 描画手順をJSON化し、LZStringで圧縮したバイナリデータ（NEO形式）を返す。
 * @param {string} type - 出力形式（例: "png", "jpeg", "animation"）
 * @returns {Blob|null} 変換後のBlobオブジェクト、または失敗時のnull
 */
Neo.Painter.prototype.getThumbnail = function (type) {
  if (type != "animation") {
    /** @type {number|null} */
    let thumbnailWidth = this.getThumbnailWidth();
    /** @type {number|null} */
    let thumbnailHeight = this.getThumbnailHeight();
    if (thumbnailWidth || thumbnailHeight) {
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      if (thumbnailHeight && thumbnailWidth == 0) {
        thumbnailWidth = (thumbnailHeight * width) / height;
      }
      if (thumbnailWidth && thumbnailHeight == 0) {
        thumbnailHeight = (thumbnailWidth * height) / width;
      }
    } else {
      thumbnailWidth = thumbnailHeight = null;
    }

    console.log("get thumbnail", thumbnailWidth, thumbnailHeight);

    var image = this.getImage(thumbnailWidth, thumbnailHeight);
    if (!image) {
      console.error("Failed to export image.");
      return null;
    }
    var dataURL = image.toDataURL("image/" + type);
    return this.dataURLtoBlob(dataURL);
  } else {
    const jsonString = JSON.stringify(this._actionMgr._items);
    const data = LZString.compressToUint8Array(jsonString);

    var magic = "NEO ";
    var w = this.canvasWidth;
    var h = this.canvasHeight;

    return new Blob([
      magic,
      new Uint8Array([w % 0x100, Math.floor(w / 0x100)]),
      new Uint8Array([h % 0x100, Math.floor(h / 0x100)]),
      new Uint8Array(4),
      data,
    ]);
  }
};
/**
 * サムネイルの幅を取得
 * @returns {Number}}
 */

Neo.Painter.prototype.getThumbnailWidth = function () {
  var width = Neo.config.thumbnail_width;
  if (width) {
    if (width.match(/%$/)) {
      return Math.floor(this.canvasWidth * (parseInt(width) / 100.0));
    } else {
      return parseInt(width);
    }
  }
  return 0;
};

/**
 * サムネイルの高さを取得
 * @returns {Number}
 */
Neo.Painter.prototype.getThumbnailHeight = function () {
  var height = Neo.config.thumbnail_height;
  if (height) {
    if (height.match(/%$/)) {
      return Math.floor(this.canvasHeight * (parseInt(height) / 100.0));
    } else {
      return parseInt(height);
    }
  }
  return 0;
};
/**
 * 全消し
 * @description
 * 1. オプションで消去の確認を行う。
 * 2. 履歴管理のため、消去前の状態をUndoスタックに保存する。
 * 3. アクションマネージャーを通じて描画レイヤーをクリアする。
 * @param {boolean} doConfirm - 消去時に確認ダイアログを表示するかどうか
 */
Neo.Painter.prototype.clearCanvas = function (doConfirm) {
  if (!doConfirm || confirm("全消しします")) {
    //Register undo first;
    this._pushUndo();
    this._actionMgr.clearCanvas();
    /*        
       this.canvasCtx[0].clearRect(0, 0, this.canvasWidth, this.canvasHeight);
       this.canvasCtx[1].clearRect(0, 0, this.canvasWidth, this.canvasHeight);
       this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight);
     */
  }
};
/**
 * キャンバス上の矩形領域を、表示用キャンバス（destCanvas）へ転送・描画する。
 * @description
 * 1. 座標とサイズの正規化（境界チェック）。
 * 2. ズーム倍率とスクロール位置を考慮した表示用座標（zx, zy, zw, zh）の計算。
 * 3. 背景のクリア（または一部更新）。
 * 4. レイヤー（0, 1）および一時レイヤーを順番に描画（合成）。
 * @param {number} x - 元キャンバスの取得開始X
 * @param {number} y - 元キャンバスの取得開始Y
 * @param {number} width - 取得範囲の幅
 * @param {number} height - 取得範囲の高さ
 * @param {boolean} [useTemp] - 一時レイヤー（tempCanvas）を含めて描画するかどうか
 */
Neo.Painter.prototype.updateDestCanvas = function (
  x,
  y,
  width,
  height,
  useTemp = false,
) {
  // 元座標は整数化（元キャンバス側）
  x = Math.floor(x);
  y = Math.floor(y);

  var canvasWidth = this.canvasWidth;
  var canvasHeight = this.canvasHeight;
  var updateAll =
    x === 0 && y === 0 && width === canvasWidth && height === canvasHeight;
  if (x + width > canvasWidth) width = canvasWidth - x;
  if (y + height > canvasHeight) height = canvasHeight - y;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (width <= 0 || height <= 0) return;
  var ctx = this.destCanvasCtx;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 1.0;

  const zoom = this.zoom;
  // ---- 描画先座標（拡大／縮小後のキャンバス側） ----
  // scrollBarX/Y は 0～1 の比率
  this.scrollBarX = isNaN(this.scrollBarX) ? 0 : this.scrollBarX;
  this.scrollBarY = isNaN(this.scrollBarY) ? 0 : this.scrollBarY;
  const offsetX =
    this.scrollBarX * (this.canvasWidth * zoom - this.destCanvas.width);
  const offsetY =
    this.scrollBarY * (this.canvasHeight * zoom - this.destCanvas.height);

  const zx = Math.round(x * zoom - offsetX);
  const zy = Math.round(y * zoom - offsetY);

  const zx2 = Math.round((x + width) * zoom - offsetX);
  const zy2 = Math.round((y + height) * zoom - offsetY);

  const zw = zx2 - zx;
  const zh = zy2 - zy;

  // ---- 背景クリア ----
  if (updateAll) {
    ctx.fillRect(0, 0, this.destCanvas.width, this.destCanvas.height);
  } else {
    ctx.fillRect(zx, zy, zw, zh);
  }

  // ---- レイヤー描画 ----
  if (this.visible[0])
    ctx.drawImage(this.canvas[0], x, y, width, height, zx, zy, zw, zh);
  if (this.visible[1])
    ctx.drawImage(this.canvas[1], x, y, width, height, zx, zy, zw, zh);

  // ---- テンポラリレイヤー ----
  if (useTemp) {
    const tempX = Math.floor(this.tempX * zoom);
    const tempY = Math.floor(this.tempY * zoom);
    ctx.drawImage(
      this.tempCanvas,
      x,
      y,
      width,
      height,
      zx + tempX,
      zy + tempY,
      zw,
      zh,
    );
  }
  ctx.restore();
};

/**
 * ブラシで描画した時に、書き換える必要が「範囲」を計算する。
 * @description
 * 線を引いた時に、キャンバス全体を再描画すると重くなるため
 * 「線が引かれた場所」の「最小限の矩形」だけ更新する必要がある。
 * その「最小限の矩形」の座標とサイズを返す。
 * @param {number} x0 - 線の始点X
 * @param {number} y0 - 線の始点Y
 * @param {number} x1 - 線の終点X
 * @param {number} y1 - 線の終点Y
 * @param {number} r  - ブラシの太さ（半径）
 * @returns {number[]} [左上のX, 左上のY, 幅, 高さ]
 */
Neo.Painter.prototype.getBound = function (x0, y0, x1, y1, r) {
  var left = Math.floor(x0 < x1 ? x0 : x1);
  var top = Math.floor(y0 < y1 ? y0 : y1);
  var width = Math.ceil(Math.abs(x0 - x1));
  var height = Math.ceil(Math.abs(y0 - y1));
  r = Math.ceil(r + 1);

  if (!r) {
    width += 1;
    height += 1;
  } else {
    left -= r;
    top -= r;
    width += r * 2;
    height += r * 2;
  }
  return [left, top, width, height];
};

/**
 * 色を取得
 * @param {string} [color]
 */
Neo.Painter.prototype.getColor = function (color = "") {
  const c = color ? color : this.foregroundColor;
  /** @type {number} @description 0-255  */
  const r = parseInt(c.slice(1, 3), 16);
  /** @type {number} @description 0-255  */
  const g = parseInt(c.slice(3, 5), 16);
  /** @type {number} @description 0-255  */
  const b = parseInt(c.slice(5, 7), 16);
  /** @type {number} @description 0-255  */
  const a = Math.floor(this.alpha * 255);

  const value = (a << 24) | (b << 16) | (g << 8) | r;

  // 正しい順序 #RRGGBB で文字列を作成
  const hex =
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  //<input type="color">で色を取得するElementのID
  /**@type {string} */
  const colorPickerId = Neo.config.neo_color_picker_id;
  const colorPicker = document.getElementById(colorPickerId);
  if (colorPickerId) {
    if (colorPicker instanceof HTMLInputElement) {
      colorPicker.value = hex;
    }
  }
  //色が変更された事を通知するカスタムイベント
  document.dispatchEvent(
    new CustomEvent("neo:colorchange", {
      detail: { hex, r, g, b, a },
    }),
  );

  return value;
};

/**
 * 数値形式の色情報を、CSS等で利用可能な文字列（#RRGGBB）へ変換する。
 * 下位24ビットのRGB成分を抽出し、6桁の16進数文字列を生成する。
 * アルファチャンネル（透明度）は破棄される。
 * * @param {number} c - 変換対象の色数値
 * @returns {string} CSS形式のカラー文字列
 */
Neo.Painter.prototype.getColorString = function (c) {
  const rgb = ("000000" + (c & 0xffffff).toString(16)).slice(-6);
  return "#" + rgb;
};
/**
 * 色をセット
 * @param {string|number} color
 */
Neo.Painter.prototype.setColor = function (color) {
  if (typeof color != "string") color = this.getColorString(color);
  this.foregroundColor = color;

  Neo.updateUI();
};

/**
 * カラーピッカーで色をセット
 * @param {string} color - <input type="color">で取得した色
 */
Neo.setColor = function (color) {
  Neo.painter.setColor(color); //色をセット
  var colorTip = Neo.ColorTip.getCurrent();
  if (colorTip) {
    //カラーチップに色をセット
    colorTip.setColor(color);
  }
};

/**
 * ツールの種類に応じて、現在の色から描画用のアルファ値を計算する。
 * @description
 * ツール（ペン、塗りつぶし、ブラシ）ごとに異なる数学的な曲線を用いてアルファ値を変換し、
 * 描き味の調整を行う。また、非常に低いアルファ値に対しては、累積誤差を利用して
 * 点を間引くことで見た目の濃度を擬似的に表現する（ディザリングに近い処理）。
 * @param {number} type - アルファ計算のタイプ（ALPHATYPE_PEN, ALPHATYPE_FILL, ALPHATYPE_BRUSH）
 * @returns {number} 0.0〜1.0 の範囲に正規化された描画用アルファ値
 */
Neo.Painter.prototype.getAlpha = function (type) {
  var a1 = this._currentColor[3] / 255.0; //this.alpha;

  switch (type) {
    case Neo.Painter.ALPHATYPE_PEN:
      if (a1 > 0.5) {
        a1 = 1.0 / 16 + ((a1 - 0.5) * 30.0) / 16;
      } else {
        a1 = Math.sqrt(2 * a1) / 16.0;
      }
      a1 = Math.min(1, Math.max(0, a1));
      break;

    case Neo.Painter.ALPHATYPE_FILL:
      a1 = -0.00056 * a1 + 0.0042 / (1.0 - a1) - 0.0042;
      a1 = Math.min(1.0, Math.max(0, a1 * 10));
      break;

    case Neo.Painter.ALPHATYPE_BRUSH:
      a1 = -0.00056 * a1 + 0.0042 / (1.0 - a1) - 0.0042;
      a1 = Math.min(1.0, Math.max(0, a1));
      break;
  }

  // アルファが小さい時は適当に点を抜いて見た目の濃度を合わせる
  if (a1 < 1.0 / 255) {
    this.aerr += a1;
    a1 = 0;
    while (this.aerr > 1.0 / 255) {
      a1 = 1.0 / 255;
      this.aerr -= 1.0 / 255;
    }
  }
  return a1;
};

Neo.Painter.prototype.prepareDrawing = function () {
  var r = parseInt(this.foregroundColor.slice(1, 3), 16);
  var g = parseInt(this.foregroundColor.slice(3, 5), 16);
  var b = parseInt(this.foregroundColor.slice(5, 7), 16);
  var a = Math.floor(this.alpha * 255);

  var maskR = parseInt(this.maskColor.slice(1, 3), 16);
  var maskG = parseInt(this.maskColor.slice(3, 5), 16);
  var maskB = parseInt(this.maskColor.slice(5, 7), 16);

  this._currentColor = [r, g, b, a];
  this._currentMask = [maskR, maskG, maskB];
  this._currentWidth = this.lineWidth;
  this._currentMaskType = this.maskType;
};

/**
 * 指定ピクセルの色が現在のマスク条件に適合するか判定する。
 * @description
 * 現在のマスク設定（特定色のみ、特定色以外、あるいは明度差による条件）に基づき、
 * ターゲットとなるピクセル（buf8, index）を描画対象にするかどうかを判定する。
 * @param {Uint8ClampedArray} buf8 - キャンバスの画素データ（RGBA）
 * @param {number} index - 判定対象ピクセルの開始インデックス
 * @returns {boolean|undefined} 描画を許可するなら true、禁止なら false、マスク無効なら undefined
 */
Neo.Painter.prototype.isMasked = function (buf8, index) {
  var r = this._currentMask[0];
  var g = this._currentMask[1];
  var b = this._currentMask[2];

  var r1 = this._currentColor[0];
  var g1 = this._currentColor[1];
  var b1 = this._currentColor[2];

  var r0 = buf8[index + 0];
  var g0 = buf8[index + 1];
  var b0 = buf8[index + 2];
  var a0 = buf8[index + 3];

  if (a0 == 0) {
    r0 = 0xff;
    g0 = 0xff;
    b0 = 0xff;
  }

  var type = this._currentMaskType; //this.maskType;

  //TODO
  //いろいろ試したのですが半透明で描画するときの加算・逆加算を再現する方法がわかりません。
  //とりあえず単純に無視しています。
  if (type == Neo.Painter.MASKTYPE_ADD || type == Neo.Painter.MASKTYPE_SUB) {
    if (this._currentColor[3] < 250) {
      type = Neo.Painter.MASKTYPE_NONE;
    }
  }

  switch (type) {
    case Neo.Painter.MASKTYPE_NONE:
      return;

    case Neo.Painter.MASKTYPE_NORMAL:
      return r0 == r && g0 == g && b0 == b ? true : false;

    case Neo.Painter.MASKTYPE_REVERSE:
      return r0 != r || g0 != g || b0 != b ? true : false;

    case Neo.Painter.MASKTYPE_ADD:
      if (a0 > 0) {
        var sort = this.sortColor(r0, g0, b0);
        for (var i = 0; i < 3; i++) {
          var c = sort[i];
          if (buf8[index + c] < this._currentColor[c]) return true;
        }
        return false;
      } else {
        return false;
      }

    case Neo.Painter.MASKTYPE_SUB:
      if (a0 > 0) {
        var sort = this.sortColor(r0, g0, b0);
        for (var i = 0; i < 3; i++) {
          var c = sort[i];
          if (buf8[index + c] > this._currentColor[c]) return true;
        }
        return false;
      } else {
        return true;
      }
  }
};

/**
 * ツールタイプに基づいて、バッファ上の指定ピクセルに対する加工処理を振り分ける。
 * * `left`/`top` を用いてオフセット補正を行った後、選択された `type` に応じて
 * * 適切な描画メソッド（setPenPoint等）を呼び出す。
 * * @param {Uint8ClampedArray} buf8 - 操作対象の画像バッファ（RGBA）。
 * @param {number} bufWidth - バッファの横幅。
 * @param {number} x0 - 描画対象のグローバルX座標。
 * @param {number} y0 - 描画対象のグローバルY座標。
 * @param {number} left - バッファ左上のグローバルXオフセット。
 * @param {number} top - バッファ左上のグローバルYオフセット。
 * @param {number} type - 使用するツールタイプ（Neo.Painter.LINETYPE_...）。
 * @returns {void}
 */
Neo.Painter.prototype.setPoint = function (
  buf8,
  bufWidth,
  x0,
  y0,
  left,
  top,
  type,
) {
  var x = x0 - left;
  var y = y0 - top;

  switch (type) {
    case Neo.Painter.LINETYPE_PEN:
      this.setPenPoint(buf8, bufWidth, x, y);
      break;

    case Neo.Painter.LINETYPE_BRUSH:
      this.setBrushPoint(buf8, bufWidth, x, y);
      break;

    case Neo.Painter.LINETYPE_TONE:
      this.setTonePoint(buf8, bufWidth, x, y, x0, y0);
      break;

    case Neo.Painter.LINETYPE_ERASER:
      this.setEraserPoint(buf8, bufWidth, x, y);
      break;

    case Neo.Painter.LINETYPE_BLUR:
      this.setBlurPoint(buf8, bufWidth, x, y, x0, y0);
      break;

    case Neo.Painter.LINETYPE_DODGE:
      this.setDodgePoint(buf8, bufWidth, x, y);
      break;

    case Neo.Painter.LINETYPE_BURN:
      this.setBurnPoint(buf8, bufWidth, x, y);
      break;

    default:
      break;
  }
};

/**
 * 指定した座標のピクセルに対してペンの描画処理を実行する。
 * @param {Uint8ClampedArray} buf8 - 画素データ
 * @param {number} width - バッファの横幅
 * @param {number} x - 相対X座標
 * @param {number} y - 相対Y座標
 */
Neo.Painter.prototype.setPenPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  const r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var index = (y * width + x) * 4;

  var shape = this._roundData[d];
  var shapeIndex = 0;

  var r1 = this._currentColor[0];
  var g1 = this._currentColor[1];
  var b1 = this._currentColor[2];
  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_PEN);
  if (a1 == 0) return;

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        let r0 = buf8[index + 0];
        let g0 = buf8[index + 1];
        let b0 = buf8[index + 2];
        let a0 = buf8[index + 3] / 255.0;

        var a = a0 + a1 - a0 * a1;
        let r = r0,
          g = g0,
          b = b0;
        if (a > 0) {
          var a1x = Math.max(a1, 1.0 / 255);

          r = (r1 * a1x + r0 * a0 * (1 - a1x)) / a;
          g = (g1 * a1x + g0 * a0 * (1 - a1x)) / a;
          b = (b1 * a1x + b0 * a0 * (1 - a1x)) / a;

          r = r1 > r0 ? Math.ceil(r) : Math.floor(r);
          g = g1 > g0 ? Math.ceil(g) : Math.floor(g);
          b = b1 > b0 ? Math.ceil(b) : Math.floor(b);
        }

        var tmp = a * 255;
        a = Math.ceil(tmp);

        buf8[index + 0] = r;
        buf8[index + 1] = g;
        buf8[index + 2] = b;
        buf8[index + 3] = a;
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * ブラシの描画データのバッファへの書き込み。
 * * 現在のブラシ設定に基づいて、指定された座標を中心とした矩形範囲の
 * ピクセルに対してアルファブレンディングを行い、色を更新する。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - ブラシを描画する中心のX座標。
 * @param {number} y - ブラシを描画する中心のY座標。
 * @returns {void}
 */
Neo.Painter.prototype.setBrushPoint = function (buf8, width, x, y) {
  const d = this._currentWidth;
  let r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var index = (y * width + x) * 4;

  var shape = this._roundData[d];
  var shapeIndex = 0;

  var r1 = this._currentColor[0];
  var g1 = this._currentColor[1];
  var b1 = this._currentColor[2];
  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_BRUSH);
  if (a1 == 0) return;

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        let r0 = buf8[index + 0];
        let g0 = buf8[index + 1];
        let b0 = buf8[index + 2];
        let a0 = buf8[index + 3] / 255.0;

        let a = a0 + a1 - a0 * a1;
        let r = r0,
          g = g0,
          b = b0;
        if (a > 0) {
          let a1x = Math.max(a1, 1.0 / 255);

          r = (r1 * a1x + r0 * a0) / (a0 + a1x);
          g = (g1 * a1x + g0 * a0) / (a0 + a1x);
          b = (b1 * a1x + b0 * a0) / (a0 + a1x);

          r = r1 > r0 ? Math.ceil(r) : Math.floor(r);
          g = g1 > g0 ? Math.ceil(g) : Math.floor(g);
          b = b1 > b0 ? Math.ceil(b) : Math.floor(b);
        }

        var tmp = a * 255;
        a = Math.ceil(tmp);

        buf8[index + 0] = r;
        buf8[index + 1] = g;
        buf8[index + 2] = b;
        buf8[index + 3] = a;
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * ハーフトーンのデータのバッファへの書き込み。
 * * 指定された矩形範囲に対し、トーンのパターン（4x4グリッド）に基づいて
 * ピクセルを不透明（255）で上書きする。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - ブラシを描画する中心のX座標。
 * @param {number} y - ブラシを描画する中心のY座標。
 * @param {number} x0 - トーンパターンのオフセットX座標。
 * @param {number} y0 - トーンパターンのオフセットY座標。
 * @returns {void}
 */
Neo.Painter.prototype.setTonePoint = function (buf8, width, x, y, x0, y0) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);

  x -= r0;
  y -= r0;
  x0 -= r0;
  y0 -= r0;

  var shape = this._roundData[d];
  var shapeIndex = 0;
  var index = (y * width + x) * 4;

  var r = this._currentColor[0];
  var g = this._currentColor[1];
  var b = this._currentColor[2];
  var a = this._currentColor[3];

  var toneData = this.getToneData(a);

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        if (toneData[((y0 + i) % 4) + ((x0 + j) % 4) * 4]) {
          buf8[index + 0] = r;
          buf8[index + 1] = g;
          buf8[index + 2] = b;
          buf8[index + 3] = 255;
        }
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * 消しゴムツールを使用して、指定範囲のピクセルの不透明度を減少させます。
 * * ブラシ形状に基づいて現在のアルファ値分だけ対象ピクセルの不透明度（A）を削り、
 * 透過度を上げます。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - 消しゴムを適用する中心のX座標。
 * @param {number} y - 消しゴムを適用する中心のY座標。
 * @returns {void}
 */
Neo.Painter.prototype.setEraserPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var shape = this._roundData[d];
  var shapeIndex = 0;
  var index = (y * width + x) * 4;
  var a = Math.floor(this._currentColor[3]); //this.alpha * 255);

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        var k = (buf8[index + 3] / 255.0) * (1.0 - a / 255.0);

        buf8[index + 3] -= a / ((d * (255.0 - a)) / 255.0);
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * ぼかし（Blur）ツールを使用して、指定範囲のピクセルを隣接画素と合成。
 * * 周囲4方向のピクセルから色情報を取得し、重み付け合成を行うことで
 * 緩やかなグラデーション（ぼかし）を作成する。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - 処理の中心X座標。
 * @param {number} y - 処理の中心Y座標。
 * @param {number} x0 - 座標の補正用Xオフセット。
 * @param {number} y0 - 座標の補正用Yオフセット。
 * @returns {void}
 */
Neo.Painter.prototype.setBlurPoint = function (buf8, width, x, y, x0, y0) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var shape = this._roundData[d];
  var shapeIndex = 0;
  var height = buf8.length / (width * 4);

  //  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_BRUSH);
  //  var a1 = this.alpha / 12;
  var a1 = this._currentColor[3] / 255.0 / 12;
  if (a1 == 0) return;
  var blur = a1;

  var tmp = new Uint8ClampedArray(buf8.length);
  for (var i = 0; i < buf8.length; i++) {
    tmp[i] = buf8[i];
  }

  var left = x0 - x - r0;
  var top = y0 - y - r0;

  var xstart = 0,
    xend = d;
  var ystart = 0,
    yend = d;
  if (xstart > left) xstart = -left;
  if (ystart > top) ystart = -top;
  if (xend > this.canvasWidth - left) xend = this.canvasWidth - left;
  if (yend > this.canvasHeight - top) yend = this.canvasHeight - top;

  for (var j = ystart; j < yend; j++) {
    var index = (j * width + xstart) * 4;
    for (var i = xstart; i < xend; i++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        var rgba = [0, 0, 0, 0, 0];

        this.addBlur(tmp, index, 1.0 - blur * 4, rgba);
        if (i > xstart) this.addBlur(tmp, index - 4, blur, rgba);
        if (i < xend - 1) this.addBlur(tmp, index + 4, blur, rgba);
        if (j > ystart) this.addBlur(tmp, index - width * 4, blur, rgba);
        if (j < yend - 1) this.addBlur(tmp, index + width * 4, blur, rgba);

        buf8[index + 0] = Math.round(rgba[0]);
        buf8[index + 1] = Math.round(rgba[1]);
        buf8[index + 2] = Math.round(rgba[2]);
        buf8[index + 3] = Math.round((rgba[3] / rgba[4]) * 255.0);
      }
      index += 4;
    }
  }
};

/**
 * 覆い焼き（Dodge）ツールを使用して、指定範囲の画素の明度を上げる。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - 覆い焼きを適用する中心のX座標。
 * @param {number} y - 覆い焼きを適用する中心のY座標。
 * @returns {void}
 */
Neo.Painter.prototype.setDodgePoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  const r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var index = (y * width + x) * 4;

  var shape = this._roundData[d];
  var shapeIndex = 0;

  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_BRUSH);
  if (a1 == 0) return;

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        let r0 = buf8[index + 0];
        let g0 = buf8[index + 1];
        let b0 = buf8[index + 2];
        let a0 = buf8[index + 3] / 255.0;

        if (a1 != 255.0) {
          var r1 = (r0 * 255) / (255 - a1);
          var g1 = (g0 * 255) / (255 - a1);
          var b1 = (b0 * 255) / (255 - a1);
        } else {
          var r1 = 255.0;
          var g1 = 255.0;
          var b1 = 255.0;
        }

        var r = Math.ceil(r1);
        var g = Math.ceil(g1);
        var b = Math.ceil(b1);
        var a = a0;

        var tmp = a * 255;
        a = Math.ceil(tmp);

        buf8[index + 0] = r;
        buf8[index + 1] = g;
        buf8[index + 2] = b;
        buf8[index + 3] = a;
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * 焼き込み（Burn）ツールを使用して、指定範囲の画素の明度を下げる。
 * * ブラシのアルファ値に基づいて背景色を黒方向へ引き寄せ、
 * 影や深みを強調する。
 * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
 * @param {number} width - バッファの横幅（ピクセル単位）。
 * @param {number} x - 焼き込みを適用する中心のX座標。
 * @param {number} y - 焼き込みを適用する中心のY座標。
 * @returns {void}
 */
Neo.Painter.prototype.setBurnPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  const r0 = Math.floor(d / 2);
  x -= r0;
  y -= r0;

  var index = (y * width + x) * 4;

  var shape = this._roundData[d];
  var shapeIndex = 0;

  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_BRUSH);
  if (a1 == 0) return;

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
        let r0 = buf8[index + 0];
        let g0 = buf8[index + 1];
        let b0 = buf8[index + 2];
        let a0 = buf8[index + 3] / 255.0;

        if (a1 != 255.0) {
          var r1 = 255 - ((255 - r0) * 255) / (255 - a1);
          var g1 = 255 - ((255 - g0) * 255) / (255 - a1);
          var b1 = 255 - ((255 - b0) * 255) / (255 - a1);
        } else {
          var r1 = 0;
          var g1 = 0;
          var b1 = 0;
        }

        var r = Math.floor(r1);
        var g = Math.floor(g1);
        var b = Math.floor(b1);
        var a = a0;

        var tmp = a * 255;
        a = Math.ceil(tmp);

        buf8[index + 0] = r;
        buf8[index + 1] = g;
        buf8[index + 2] = b;
        buf8[index + 3] = a;
      }
      index += 4;
    }
    index += (width - d) * 4;
  }
};

/**
 * 指定した座標のピクセル値をXOR演算（排他的論理和）で反転させる。
 * 四角塗り潰しのための選択範囲の表示する時などに使用する。
 * * @param {Uint32Array} buf32 - キャンバスの画像データを保持するUint32配列 (32bit RGBA)。
 * @param {number} bufWidth - バッファの横幅（ピクセル単位）。
 * @param {number} x - 処理対象のX座標。
 * @param {number} y - 処理対象のY座標。
 * @param {number} [c=0xffffff] - XOR演算に使用するビットマスク（デフォルトは白）。
 * @returns {void}
 */
Neo.Painter.prototype.xorPixel = function (buf32, bufWidth, x, y, c) {
  var index = y * bufWidth + x;
  if (!c) c = 0xffffff;
  buf32[index] ^= c;
};

/**
 * Bz曲線
 * 3次ベジェ曲線上の指定位置（t）における座標を算出。
 * * 始点(x0, y0)から終点(x3, y3)まで、2つの制御点(x1, y1), (x2, y2)の影響を受けて
 * 滑らかに変化する曲線を補間する。
 * * @param {number} t - 曲線上での位置（0.0 から 1.0 の間で指定）。
 * @param {number} x0 - 始点のX座標。
 * @param {number} y0 - 始点のY座標。
 * @param {number} x1 - 1つ目の制御点のX座標。
 * @param {number} y1 - 1つ目の制御点のY座標。
 * @param {number} x2 - 2つ目の制御点のX座標。
 * @param {number} y2 - 2つ目の制御点のY座標。
 * @param {number} x3 - 終点のX座標。
 * @param {number} y3 - 終点のY座標。
 * @returns {Array<number>} 算出された座標 [x, y] を返す。
 */
Neo.Painter.prototype.getBezierPoint = function (
  t,
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
) {
  var a0 = (1 - t) * (1 - t) * (1 - t);
  var a1 = (1 - t) * (1 - t) * t * 3;
  var a2 = (1 - t) * t * t * 3;
  var a3 = t * t * t;

  var x = x0 * a0 + x1 * a1 + x2 * a2 + x3 * a3;
  var y = y0 * a0 + y1 * a1 + y2 * a2 + y3 * a3;
  return [x, y];
};

/**
 * Bz曲線
 * 4つの制御点から3次ベジェ曲線を計算し、描画バッファにストロークを描画する。
 * * 計算された曲線上の各点において `plot` を経由し、最終的に `setPoint` で
 * 実際のピクセル操作を行う。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {number} x0 - 始点のX座標。
 * @param {number} y0 - 始点のY座標。
 * @param {number} x1 - 1つ目の制御点のX座標。
 * @param {number} y1 - 1つ目の制御点のY座標。
 * @param {number} x2 - 2つ目の制御点のX座標。
 * @param {number} y2 - 2つ目の制御点のY座標。
 * @param {number} x3 - 終点のX座標。
 * @param {number} y3 - 終点のY座標。
 * @param {number} type - 使用するブラシやツールのタイプ。
 * @param {boolean} isReplay - リプレイ再生中かどうか。
 * @param {boolean} [isPreview=false] - プレビュー描画中かどうか（不透明度やマスクを一時解除）。
 * @returns {void}
 */
Neo.Painter.prototype.drawBezier = function (
  ctx,
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  type,
  isReplay,
  isPreview = false,
) {
  var points = [
    [x0, y0],
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
  var ref = this;
  /**
   * @callback DrawCallback
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {Uint8ClampedArray} buf8
   * @param {ImageData} imageData
   */
  this.draw(
    ctx,
    points,
    /** @type {DrawCallback} */ function (
      left,
      top,
      width,
      height,
      buf8,
      imageData,
    ) {
      var n = Math.ceil((width + height) * 2.5);
      var oType = ref._currentMaskType;
      var oAlpha = ref._currentColor[3];

      if (isPreview) {
        ref._currentMaskType = Neo.Painter.MASKTYPE_NONE;
        ref._currentColor[3] = 255;
      }

      for (var i = 0; i < n; i++) {
        var t = (i * 1.0) / n;
        var p = ref.getBezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3);

        p[0] = Math.round(p[0]);
        p[1] = Math.round(p[1]);

        ref.plot(
          p,
          /** @param {number} x @param {number} y **/
          function (x, y) {
            ref.setPoint(buf8, imageData.width, x, y, left, top, type);
          },
        );
      }
      ref._currentMaskType = oType;
      ref._currentColor[3] = oAlpha;
      ref.prevLine = null;
    },
  );
};
/** @type {any} */
Neo.Painter.prototype.prevLine = null; // 始点または終点が2度プロットされることがあるので

/**
 * ブレゼンハムのアルゴリズムを使用して、始点から終点まで直線を描画。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {number} x0 - 始点のX座標。
 * @param {number} y0 - 始点のY座標。
 * @param {number} x1 - 終点のX座標。
 * @param {number} y1 - 終点のY座標。
 * @param {number} type - 使用するブラシやツールのタイプ。
 * @returns {void}
 */
Neo.Painter.prototype.drawLine = function (ctx, x0, y0, x1, y1, type) {
  x0 = Math.floor(x0);
  y0 = Math.floor(y0);
  x1 = Math.floor(x1);
  y1 = Math.floor(y1);

  var points = [
    [x0, y0],
    [x1, y1],
  ];
  var ref = this;
  this.aerr = 0;
  /**
   * @callback DrawCallback
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {Uint8ClampedArray} buf8
   * @param {ImageData} imageData
   */
  this.draw(
    ctx,
    points,
    /** @type {DrawCallback} */ function (
      left,
      top,
      width,
      height,
      buf8,
      imageData,
    ) {
      ref.bresenham(
        points,
        /** @param {number} x @param {number} y **/ function (x, y) {
          ref.setPoint(buf8, imageData.width, x, y, left, top, type);
        },
      );
    },
  );
  this.prevLine = points;
};

/**
 * 描画範囲を最適化し、バッファを取得・加工・反映させるラッパー。
 * * 指定された点群を囲む最小矩形を算出し、ブラシ幅(r)の余白を含めて
 * ImageDataを取得・書き戻すことで描画負荷を最小限に抑える。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {Array<Array<number>>} points - 描画対象となる点の配列 [[x,y], ...]。
 * @param {Function} callback - バッファ操作を行う描画ロジック本体。
 * @returns {void}
 */
Neo.Painter.prototype.draw = function (ctx, points, callback) {
  var xs = [],
    ys = [];
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    xs.push(Math.round(point[0]));
    ys.push(Math.round(point[1]));
  }
  var xmin = Math.min.apply(null, xs);
  var xmax = Math.max.apply(null, xs);
  var ymin = Math.min.apply(null, ys);
  var ymax = Math.max.apply(null, ys);

  var r = Math.ceil(this._currentWidth / 2);
  var left = xmin - r;
  var top = ymin - r;
  var width = xmax - xmin;
  var height = ymax - ymin;

  var imageData = ctx.getImageData(left, top, width + r * 2, height + r * 2);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  callback(left, top, width, height, buf8, imageData);

  imageData.data.set(buf8);
  ctx.putImageData(imageData, left, top);
};

/**
 * ブレゼンハムのアルゴリズムを用いて、指定された始点と終点の間のピクセル座標を算出。
 * * [重要] 前回の線分(this.prevLine)と始点が一致する場合、重複描画を防ぐために
 * * コールバックをスキップする最適化ロジックを含む。
 * * @param {Array<Array<number>>} points - [[x0, y0], [x1, y1]] の形式の座標配列。
 * @param {Function} callback - 算出された座標(x, y)に対して実行する描画処理。
 * @returns {void}
 */
Neo.Painter.prototype.bresenham = function (points, callback) {
  var x0 = points[0][0];
  var y0 = points[0][1];
  var x1 = points[1][0];
  var y1 = points[1][1];

  var dx = Math.abs(x1 - x0),
    sx = x0 < x1 ? 1 : -1;
  var dy = Math.abs(y1 - y0),
    sy = y0 < y1 ? 1 : -1;
  var err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    if (
      this.prevLine == null ||
      !(
        (this.prevLine[0][0] == x0 && this.prevLine[0][1] == y0) ||
        (this.prevLine[1][0] == x0 && this.prevLine[1][1] == y0)
      )
    ) {
      callback(x0, y0);
    }

    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }
  this.prevLine = points;
};

/**
 * 指定した座標に対して描画処理（callback）を実行する。
 * * 直前の描画座標(prevLine)と比較し、同一地点であれば再描画をスキップして
 * * 重複による色の重なりを防ぎます。
 * * @param {Array<number>} point - [x, y] 形式の描画対象座標。
 * @param {Function} callback - 実際に setPoint を呼び出す描画関数。
 * @returns {void}
 */
Neo.Painter.prototype.plot = function (point, callback) {
  var x0 = point[0];
  var y0 = point[1];

  if (
    this.prevLine == null ||
    !(this.prevLine[0][0] == x0 && this.prevLine[0][1] == y0)
  ) {
    callback(x0, y0);
  }
  this.prevLine = [point, point];
};

/**
 * 直線
 * @description
 * キャンバス上の指定された単一点に対して描画処理を適用する。
 * * 内部的には始点と終点が同一の線分として `drawLine` を呼び出すことで、
 * * 線描画ロジックの重複排除やバッファ最適化の恩恵を統合的に受ける。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {number} x - 描画対象のX座標。
 * @param {number} y - 描画対象のY座標。
 * @param {number} type - 使用するブラシやツールのタイプ。
 * @returns {void}
 */
Neo.Painter.prototype.drawPoint = function (ctx, x, y, type) {
  this.drawLine(ctx, x, y, x, y, type);
};

/**
 * 指定された矩形範囲内のピクセル値をXOR演算によってビット反転（ネガ処理）する。
 * * 32bit整数のバッファを直接操作することで、高速な描画プレビューや選択範囲の反転を実現する。
 * * [注意] 処理対象が32bit配列であることを前提としているため、バッファの整合性に注意すること。
 * * @param {Uint32Array} buf32 - 操作対象となるキャンバスの画像データバッファ（32bit）。
 * * @param {number} bufWidth - バッファの横幅（ピクセル単位）。
 * * @param {number} x - 矩形の開始X座標。
 * * @param {number} y - 矩形の開始Y座標。
 * * @param {number} width - 矩形の横幅。
 * * @param {number} height - 矩形の高さ。
 * * @param {number} c - XOR演算に使用する32bitのマスク値（例: 0xffffff）。
 * @returns {void}
 */
Neo.Painter.prototype.xorRect = function (
  buf32,
  bufWidth,
  x,
  y,
  width,
  height,
  c,
) {
  var index = y * bufWidth + x;
  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      buf32[index] ^= c;
      index++;
    }
    index += width - bufWidth;
  }
};

/**
 * 指定された矩形範囲に対して、塗りつぶしまたは枠線のXOR反転描画を行う。
 * * [塗りつぶし] `xorRect` を呼び出し、範囲内全ピクセルを反転する。
 * * [枠線] 矩形の外周ラインのみを反転させ、視覚的な選択枠を表示する。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {number} x - 矩形の開始X座標。
 * @param {number} y - 矩形の開始Y座標。
 * @param {number} width - 矩形の横幅。
 * @param {number} height - 矩形の高さ。
 * @param {boolean} [isFill=false] - trueなら矩形内部を塗りつぶし、falseなら外周のみを描画する。
 * @param {number} [c=0xffffff] - XORに使用する32bitマスク値。
 * @returns {void}
 */
Neo.Painter.prototype.drawXORRect = function (
  ctx,
  x,
  y,
  width,
  height,
  isFill = false,
  c = 0xffffff,
) {
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);
  if (width == 0 || height == 0) return;

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var index = 0;
  if (!c) c = 0xffffff;

  if (isFill) {
    this.xorRect(buf32, width, 0, 0, width, height, c);
  } else {
    for (var i = 0; i < width; i++) {
      //top
      buf32[index] = buf32[index] ^= c;
      index++;
    }
    if (height > 1) {
      index = width;
      for (var i = 1; i < height; i++) {
        //left
        buf32[index] = buf32[index] ^= c;
        index += width;
      }
      if (width > 1) {
        index = width * 2 - 1;
        for (var i = 1; i < height - 1; i++) {
          //right
          buf32[index] = buf32[index] ^= c;
          index += width;
        }
        index = width * (height - 1) + 1;
        for (var i = 1; i < width; i++) {
          // bottom
          buf32[index] = buf32[index] ^= c;
          index++;
        }
      }
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * 中点楕円アルゴリズムによるXORプレビュー描画。
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - バウンディングボックスの左上X。
 * @param {number} y - バウンディングボックスの左上Y。
 * @param {number} width - 幅。
 * @param {number} height - 高さ。
 * @param {boolean} [isFill] - trueで塗りつぶし、falseで輪郭のみ。
 * @param {number} [c=0xFFFFFF] - XOR用マスク値。
 */
Neo.Painter.prototype.drawXOREllipse = function (
  ctx,
  x,
  y,
  width,
  height,
  isFill,
  c,
) {
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);
  if (width == 0 || height == 0) return;
  if (!c) c = 0xffffff;

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var a = width - 1,
    b = height - 1,
    b1 = b & 1; /* values of diameter */
  var dx = 4 * (1 - a) * b * b,
    dy = 4 * (b1 + 1) * a * a; /* error increment */
  var err = dx + dy + b1 * a * a,
    e2; /* error of 1.step */

  var x0 = x;
  var y0 = y;
  var x1 = x0 + a;
  var y1 = y0 + b;

  if (x0 > x1) {
    x0 = x1;
    x1 += a;
  }
  if (y0 > y1) y0 = y1;
  y0 += Math.floor((b + 1) / 2);
  y1 = y0 - b1; /* starting pixel */
  a *= 8 * a;
  b1 = 8 * b * b;
  var ymin = y0 - 1;

  do {
    if (isFill) {
      if (ymin < y0) {
        this.xorRect(buf32, width, x0 - x, y0 - y, x1 - x0, 1, c);
        if (y0 != y1) {
          this.xorRect(buf32, width, x0 - x, y1 - y, x1 - x0, 1, c);
        }
        ymin = y0;
      }
    } else {
      this.xorPixel(buf32, width, x1 - x, y0 - y, c);
      if (x0 != x1) {
        this.xorPixel(buf32, width, x0 - x, y0 - y, c);
      }
      if (y0 != y1) {
        this.xorPixel(buf32, width, x0 - x, y1 - y, c);
        if (x0 != x1) {
          this.xorPixel(buf32, width, x1 - x, y1 - y, c);
        }
      }
    }
    e2 = 2 * err;
    if (e2 <= dy) {
      y0++;
      y1--;
      err += dy += a;
    } /* y step */
    if (e2 >= dx || 2 * err > dy) {
      x0++;
      x1--;
      err += dx += b1;
    } /* x step */
  } while (x0 <= x1);

  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * 指定された2点間をXOR演算によって反転させ、プレビュー用の直線を描画する。
 * * ブレゼンハムのアルゴリズムを利用し、キャンバスの部分的なバッファのみを
 * * XOR操作することで、描画負荷を最小限に抑えつつ高速な視覚フィードバックを実現する。
 * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
 * @param {number} x0 - 始点のX座標。
 * @param {number} y0 - 始点のY座標。
 * @param {number} x1 - 終点のX座標。
 * @param {number} y1 - 終点のY座標。
 * @param {number} [c=0xffffff] - XOR演算に使用する32bitマスク値。
 * @returns {void}
 */
Neo.Painter.prototype.drawXORLine = function (ctx, x0, y0, x1, y1, c) {
  x0 = Math.round(x0);
  x1 = Math.round(x1);
  y0 = Math.round(y0);
  y1 = Math.round(y1);

  var width = Math.abs(x1 - x0);
  var height = Math.abs(y1 - y0);

  var left = x0 < x1 ? x0 : x1;
  var top = y0 < y1 ? y0 : y1;
  //  console.log("left:"+left+" top:"+top+" width:"+width+" height:"+height);

  var imageData = ctx.getImageData(left, top, width + 1, height + 1);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var dx = width,
    sx = x0 < x1 ? 1 : -1;
  var dy = height,
    sy = y0 < y1 ? 1 : -1;
  var err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    if (
      this.prevLine == null ||
      !(
        (this.prevLine[0] == x0 && this.prevLine[1] == y0) ||
        (this.prevLine[2] == x0 && this.prevLine[3] == y0)
      )
    ) {
      this.xorPixel(buf32, imageData.width, x0 - left, y0 - top, c);
    }

    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }

  imageData.data.set(buf8);
  ctx.putImageData(imageData, left, top);
};

/**
 * 消し四角
 * @param {number} layer - 対象レイヤーインデックス。
 * @param {number} x - 開始X。
 * @param {number} y - 開始Y。
 * @param {number} width - 幅。
 * @param {number} height - 高さ。
 */
Neo.Painter.prototype.eraseRect = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var index = 0;

  var a = 1.0 - this._currentColor[3] / 255.0; //this.alpha;
  if (a != 0) {
    a = Math.ceil(2.0 / a);
  } else {
    a = 255;
  }

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      if (!this.isMasked(buf8, index)) {
        buf8[index + 3] -= a;
      }
      index += 4;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * 左右反転
 * * @param {number} layer - 操作対象のレイヤーインデックス。
 * @param {number} x - 反転対象範囲の開始X座標。
 * @param {number} y - 反転対象範囲の開始Y座標。
 * @param {number} width - 反転対象範囲の横幅。
 * @param {number} height - 反転対象範囲の高さ。
 * @returns {void}
 */
Neo.Painter.prototype.flipH = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var half = Math.floor(width / 2);
  for (var j = 0; j < height; j++) {
    var index = j * width;
    var index2 = index + (width - 1);
    for (var i = 0; i < half; i++) {
      var value = buf32[index + i];
      buf32[index + i] = buf32[index2 - i];
      buf32[index2 - i] = value;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * 上下反転
 * * @param {number} layer - 操作対象のレイヤーインデックス。
 * @param {number} x - 反転対象範囲の開始X座標。
 * @param {number} y - 反転対象範囲の開始Y座標。
 * @param {number} width - 反転対象範囲の横幅。
 * @param {number} height - 反転対象範囲の高さ。
 * @returns {void}
 */
Neo.Painter.prototype.flipV = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var half = Math.floor(height / 2);
  for (var j = 0; j < half; j++) {
    var index = j * width;
    var index2 = (height - 1 - j) * width;
    for (var i = 0; i < width; i++) {
      var value = buf32[index + i];
      buf32[index + i] = buf32[index2 + i];
      buf32[index2 + i] = value;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * レイヤー結合
 * * @param {number} layer - 統合先となるレイヤーインデックス(0 or 1)。
 * @param {number} x - 合成範囲の開始X座標。
 * @param {number} y - 合成範囲の開始Y座標。
 * @param {number} width - 合成範囲の横幅。
 * @param {number} height - 合成範囲の高さ。
 * @returns {void}
 */
Neo.Painter.prototype.merge = function (layer, x, y, width, height) {
  // var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);
  var r = 0x00;
  var g = 0x00;
  var b = 0x00;

  var imageData = [];
  var buf32 = [];
  var buf8 = [];
  for (var i = 0; i < 2; i++) {
    imageData[i] = this.canvasCtx[i].getImageData(x, y, width, height);
    buf32[i] = new Uint32Array(imageData[i].data.buffer);
    buf8[i] = new Uint8ClampedArray(imageData[i].data.buffer);
  }

  var dst = layer;
  var src = dst == 1 ? 0 : 1;
  var size = width * height;
  var index = 0;
  for (var i = 0; i < size; i++) {
    var r0 = buf8[0][index + 0];
    var g0 = buf8[0][index + 1];
    var b0 = buf8[0][index + 2];
    var a0 = buf8[0][index + 3] / 255.0;
    var r1 = buf8[1][index + 0];
    var g1 = buf8[1][index + 1];
    var b1 = buf8[1][index + 2];
    var a1 = buf8[1][index + 3] / 255.0;

    var a = a0 + a1 - a0 * a1;
    if (a > 0) {
      r = Math.floor((r1 * a1 + r0 * a0 * (1 - a1)) / a + 0.5);
      g = Math.floor((g1 * a1 + g0 * a0 * (1 - a1)) / a + 0.5);
      b = Math.floor((b1 * a1 + b0 * a0 * (1 - a1)) / a + 0.5);
    }
    buf8[src][index + 0] = 0;
    buf8[src][index + 1] = 0;
    buf8[src][index + 2] = 0;
    buf8[src][index + 3] = 0;
    buf8[dst][index + 0] = r;
    buf8[dst][index + 1] = g;
    buf8[dst][index + 2] = b;
    buf8[dst][index + 3] = Math.floor(a * 255 + 0.5);
    index += 4;
  }

  for (var i = 0; i < 2; i++) {
    imageData[i].data.set(buf8[i]);
    this.canvasCtx[i].putImageData(imageData[i], x, y);
  }
};

/**
 * 指定された矩形範囲内のピクセルに対して近傍平均化を行い、ぼかし効果を適用する。
 * * @param {number} layer - 操作対象のレイヤーインデックス。
 * @param {number} x - ぼかし対象範囲の開始X座標。
 * @param {number} y - ぼかし対象範囲の開始Y座標。
 * @param {number} width - ぼかし対象範囲の横幅。
 * @param {number} height - ぼかし対象範囲の高さ。
 * @returns {void}
 */
Neo.Painter.prototype.blurRect = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var tmp = new Uint8ClampedArray(buf8.length);
  for (var i = 0; i < buf8.length; i++) tmp[i] = buf8[i];

  var index = 0;
  var a1 = this._currentColor[3] / 255.0 / 12; //this.alpha / 12;
  var blur = a1;

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      var rgba = [0, 0, 0, 0, 0];

      this.addBlur(tmp, index, 1.0 - blur * 4, rgba);

      if (i > 0) this.addBlur(tmp, index - 4, blur, rgba);
      if (i < width - 1) this.addBlur(tmp, index + 4, blur, rgba);
      if (j > 0) this.addBlur(tmp, index - width * 4, blur, rgba);
      if (j < height - 1) this.addBlur(tmp, index + width * 4, blur, rgba);

      var w = rgba[4];
      buf8[index + 0] = Math.round(rgba[0]);
      buf8[index + 1] = Math.round(rgba[1]);
      buf8[index + 2] = Math.round(rgba[2]);
      buf8[index + 3] = Math.ceil((rgba[3] / w) * 255.0);

      index += 4;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * ぼかし処理における画素加算とアルファブレンドを統合的に実行する。
 * * @param {Uint8ClampedArray} buffer - 操作対象の画像データバッファ。
 * @param {number} index - 加算対象のピクセルインデックス。
 * @param {number} a - 現在のサンプリングウェイト。
 * @param {Array<number>} rgba - 累積色値およびアルファ値、ウェイトを保持する配列 [r, g, b, a, weight]。
 * @returns {void}
 */
Neo.Painter.prototype.addBlur = function (buffer, index, a, rgba) {
  var r0 = rgba[0];
  var g0 = rgba[1];
  var b0 = rgba[2];
  var a0 = rgba[3];
  var r1 = buffer[index + 0];
  var g1 = buffer[index + 1];
  var b1 = buffer[index + 2];
  var a1 = (buffer[index + 3] / 255.0) * a;
  rgba[4] += a;

  var a = a0 + a1;
  if (a > 0) {
    rgba[0] = (r1 * a1 + r0 * a0) / (a0 + a1);
    rgba[1] = (g1 * a1 + g0 * a0) / (a0 + a1);
    rgba[2] = (b1 * a1 + b0 * a0) / (a0 + a1);
    rgba[3] = a;
  }
};

/**
 * スポイト
 * @description 指定された座標における、全可視レイヤーの合成色を算出する。
 * * 各レイヤーのRGBA値を順次アルファブレンドし、背景色（白）をベースにした
 * * 最終的な表示色を計算する。算出された色は現在のカラーとして設定され、
 * * 透明度に応じて自動的にツールをペンか消しゴムへ切り替える機能を持つ。
 * * 下のレイヤーの色を右クリックでスポイトできる2.22_8と
 * * 下のレイヤーに色があっても上のレイヤーが透明なら右クリックで消しゴムに切り換わるv2.04の動作をエミュレート。
 * @param {number} x - 取得対象のX座標。
 * @param {number} y - 取得対象のY座標。
 * @returns {void}
 */
Neo.Painter.prototype.pickColor = function (x, y) {
  let r = 0xff,
    g = 0xff,
    b = 0xff,
    a = 0,
    result = 0xffffff;
  x = Math.floor(x);
  y = Math.floor(y);
  if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
    for (var i = 0; i < 2; i++) {
      if (this.visible[i]) {
        const ctx = this.canvasCtx[i];
        const imageData = ctx.getImageData(x, y, 1, 1);
        const buf32 = new Uint32Array(imageData.data.buffer);
        const buf8 = new Uint8ClampedArray(imageData.data.buffer);

        a = buf8[3] / 255.0;
        r = r * (1.0 - a) + buf8[2] * a;
        g = g * (1.0 - a) + buf8[1] * a;
        b = b * (1.0 - a) + buf8[0] * a;
      }
    }
    r = Math.max(Math.min(Math.round(r), 255), 0);
    g = Math.max(Math.min(Math.round(g), 255), 0);
    b = Math.max(Math.min(Math.round(b), 255), 0);
    result = r | (g << 8) | (b << 16);
  }
  this.setColor(result);

  //レイヤー1が選択されている時に
  if (this.current > 0) {
    //透明色を右クリックでスポイトした時に消しゴム化する。
    //v2.16より古いバージョンではレイヤー1でスポイトした色が透明の時は消しゴムに切り換わる。
    if (a == 0 && (result == 0xffffff || this.getEmulationMode() < 2.16)) {
      this.setToolByType(Neo.Painter.TOOLTYPE_ERASER);
    } else {
      // v2.16以後の新しいバージョンでは
      // レイヤー0に色がある時は消しゴム化しない。
      if (Neo.eraserTip?.selected) {
        this.setToolByType(Neo.Painter.TOOLTYPE_PEN);
      }
    }
  }
};

/**
 * 指定されたキャンバス内の水平ラインを、指定色で一括塗りつぶしする。
 * * `Uint32Array` を用いて、色情報を32bit整数としてインデックスへ直接書き込むことで、
 * * ブラウザの描画APIを通さずにメモリ上で高速にライン描画を行う。
 * * [パフォーマンス] ループ内で `this.canvasWidth` を用いてインデックスを算出する。
 * * @param {Uint32Array} buf32 - 操作対象となるキャンバスの画像データバッファ（32bit）。
 * @param {number} x0 - 塗りつぶし開始X座標。
 * @param {number} x1 - 塗りつぶし終了X座標。
 * @param {number} y - 塗りつぶし対象のY座標。
 * @param {number} color - 書き込む色値（32bit）。
 * @returns {void}
 */
Neo.Painter.prototype.fillHorizontalLine = function (buf32, x0, x1, y, color) {
  var index = y * this.canvasWidth + x0;
  for (var x = x0; x <= x1; x++) {
    buf32[index++] = color;
  }
};

/**
 * スキャンライン・塗りつぶしアルゴリズムにおいて、対象線分上の座標をスタックへ追加する。
 * @param {number} x0 - 走査開始X。
 * @param {number} x1 - 走査終了X。
 * @param {number} y - 対象Y。
 * @param {number} baseColor - 置換対象の色（※現在未使用）。
 * @param {Uint32Array} buf32 - 画像データバッファ（※現在未使用）。
 * @param {Array<{x: number, y: number}>} stack - 塗りつぶし候補座標を保持するスタック。
 */
Neo.Painter.prototype.scanLine = function (x0, x1, y, baseColor, buf32, stack) {
  // var width = this.canvasWidth;
  for (var x = x0; x <= x1; x++) {
    stack.push({ x: x, y: y });
  }
};

/**
 * 塗り潰し
 * @param {number} layer - 対象レイヤーインデックス。
 * @param {number} x - クリック開始X。
 * @param {number} y - クリック開始Y。
 * @param {number} fillColor - 置換後の色（32bit整数）。
 */
Neo.Painter.prototype.doFloodFill = function (layer, x, y, fillColor) {
  x = Math.round(x);
  y = Math.round(y);
  var ctx = this.canvasCtx[layer];

  if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  const buf32 = new Uint32Array(imageData.data.buffer);
  const buf8 = new Uint8ClampedArray(imageData.data.buffer);
  const width = imageData.width;
  const stack = [{ x: x, y: y }];

  var baseColor = buf32[y * width + x];

  if ((baseColor & 0xff000000) == 0 || baseColor != fillColor) {
    while (stack.length > 0) {
      if (stack.length > 1000000) {
        break;
      }
      var point = stack.pop();
      if (!point) {
        break;
      }
      const x = point.x;
      const y = point.y;
      let x0 = x;
      let x1 = x;
      if (buf32[y * width + x] == fillColor) continue;
      if (buf32[y * width + x] != baseColor) continue;

      for (; 0 < x0; x0--) {
        if (buf32[y * width + (x0 - 1)] != baseColor) break;
      }
      for (; x1 < this.canvasWidth - 1; x1++) {
        if (buf32[y * width + (x1 + 1)] != baseColor) break;
      }
      this.fillHorizontalLine(buf32, x0, x1, y, fillColor);

      if (y + 1 < this.canvasHeight) {
        this.scanLine(x0, x1, y + 1, baseColor, buf32, stack);
      }
      if (y - 1 >= 0) {
        this.scanLine(x0, x1, y - 1, baseColor, buf32, stack);
      }
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, 0, 0);
  //  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight);
};

/**
 * コピー
 * @description 指定範囲の画像を一時バッファとプレビュー用キャンバスにコピーする。
 * @param {number} layer - 対象レイヤーインデックス。
 * @param {number} x - 開始X。
 * @param {number} y - 開始Y。
 * @param {number} width - 幅。
 * @param {number} height - 高さ。
 */
Neo.Painter.prototype.copy = function (layer, x, y, width, height) {
  this.tempX = 0;
  this.tempY = 0;
  this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

  const imageData = this.canvasCtx[layer].getImageData(x, y, width, height);
  const buf32 = new Uint32Array(imageData.data.buffer);
  // let buf8 = new Uint8ClampedArray(imageData.data.buffer);
  this.temp = new Uint32Array(buf32.length);
  for (var i = 0; i < buf32.length; i++) {
    this.temp[i] = buf32[i];
  }

  //tempCanvasに乗せる画像を作る
  const tempImageData = this.tempCanvasCtx.getImageData(x, y, width, height);
  const tempBuf32 = new Uint32Array(tempImageData.data.buffer);
  let tempBuf8 = new Uint8ClampedArray(tempImageData.data.buffer);
  for (var i = 0; i < tempBuf32.length; i++) {
    if (this.temp[i] >> 24) {
      tempBuf32[i] = this.temp[i] | 0xff000000;
    } else {
      tempBuf32[i] = 0xffffffff;
    }
  }
  tempImageData.data.set(tempBuf8);
  this.tempCanvasCtx.putImageData(tempImageData, x, y);
};

/**
 * ペースト
 * @description 指定されたレイヤーの矩形領域に、一時バッファの内容を貼り付ける。
 * * @param {number} layer - 操作対象のレイヤーインデックス。
 * @param {number} x - 貼り付け開始の基準X座標。
 * @param {number} y - 貼り付け開始の基準Y座標。
 * @param {number} width - 貼り付け対象の横幅。
 * @param {number} height - 貼り付け対象の縦幅。
 * @param {number} dx - 貼り付け位置のオフセットX。
 * @param {number} dy - 貼り付け位置のオフセットY。
 * @returns {void}
 */
Neo.Painter.prototype.paste = function (layer, x, y, width, height, dx, dy) {
  var ctx = this.canvasCtx[layer];
  //  console.log(this.tempX, this.tempY);

  var imageData = ctx.getImageData(x + dx, y + dy, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  if (this.temp) {
    for (var i = 0; i < buf32.length; i++) {
      buf32[i] = this.temp[i];
    }
    imageData.data.set(buf8);
    ctx.putImageData(imageData, x + dx, y + dy);
  }

  this.temp = null;
  this.tempX = 0;
  this.tempY = 0;
  this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

/**
 * 傾け
 * @description 領域を90度回転させる。
 * @param {number} layer - 対象レイヤー。
 * @param {number} x - 開始座標。
 * @param {number} y - 開始座標。
 * @param {number} width, height - サイズ。
 * @param {number} height - サイズ。
 * @note
 * 「バグストライプ」の再現処理を含む。
 * オリジナルのPaintBBS等の仕様に準じ、回転処理時の境界データ参照に由来するグリッジを
 * 意図的に発生させる。この挙動は Neo.config.neo_disable_turn_original_glitch
 * により無効化できる。
 */
Neo.Painter.prototype.turn = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];

  // 傾けツールのバグを再現するため一番上のラインで対象領域を埋める
  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var temp = new Uint32Array(buf32.length);

  // 設定によって「塗りつぶし関数」を切り替える
  let fillPixel;
  if (Neo.config.neo_disable_turn_original_glitch) {
    // 常に透明(0)を返す
    // オリジナルのPaintBBSのグリッジ
    // 傾けのバグストライプを再現しない
    /**@param {number} index */
    fillPixel = function (index) {
      return 0;
    };
  } else {
    // オリジナルのPaintBBSのグリッジ
    // 傾けのバグストライプを再現
    /**@param {number} index */
    fillPixel = function (index) {
      return buf32[index % width];
    };
  }

  var index = 0;
  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      temp[index] = buf32[index];
      if (index >= width) {
        buf32[index] = fillPixel(index);
      }
      index++;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);

  // 90度回転させて貼り付け
  imageData = ctx.getImageData(x, y, height, width);
  buf32 = new Uint32Array(imageData.data.buffer);
  buf8 = new Uint8ClampedArray(imageData.data.buffer);

  index = 0;
  for (var j = height - 1; j >= 0; j--) {
    for (var i = 0; i < width; i++) {
      buf32[i * height + j] = temp[index++];
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * マスク形状タイプに応じたピクセル判定関数を返却する。
 * @param {string|number} type - 描画ツールまたは塗りつぶしの形状タイプ。
 * @returns {((i: number, j: number, w: number, h: number) => boolean) | null}
 * 指定座標が描画範囲内であれば true を返す関数。該当タイプがない場合は null。
 */
Neo.Painter.prototype.getMaskFunc = function (type) {
  switch (type) {
    case Neo.Painter.TOOLTYPE_RECT:
      return this.rectMask;
    case Neo.Painter.TOOLTYPE_RECTFILL:
      return this.rectFillMask;
    case Neo.Painter.TOOLTYPE_ELLIPSE:
      return this.ellipseMask;
    case Neo.Painter.TOOLTYPE_ELLIPSEFILL:
      return this.ellipseFillMask;
  }
  return null;
};

/**
 * 塗り潰し
 * @description 塗り潰しおよび汎用描画エンジン。
 * @description 指定矩形領域に対し、typeで指定されたマスク形状に基づいて現在の色を合成・描画する。
 * @param {number} layer - 対象レイヤーインデックス。
 * @param {number} x - 描画開始X座標。
 * @param {number} y - 描画開始Y座標。
 * @param {number} width - 描画対象領域のサイズ。
 * @param {number} height - 描画対象領域のサイズ。
 * @param {string|number} type - マスク形状タイプ(例: TOOLTYPE_RECT, TOOLTYPE_RECTFILLなど)。
 */
Neo.Painter.prototype.doFill = function (layer, x, y, width, height, type) {
  const ctx = this.canvasCtx[layer];
  const maskFunc = this.getMaskFunc(type);

  const imageData = ctx.getImageData(x, y, width, height);
  // const buf32 = new Uint32Array(imageData.data.buffer);
  const buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var index = 0;

  var r1 = this._currentColor[0];
  var g1 = this._currentColor[1];
  var b1 = this._currentColor[2];
  var a1 = this.getAlpha(Neo.Painter.ALPHATYPE_FILL);

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      if (maskFunc && maskFunc.call(this, i, j, width, height)) {
        //なぜか加算逆加算は適用されない
        if (
          this._currentMaskType >= Neo.Painter.MASKTYPE_ADD ||
          !this.isMasked(buf8, index)
        ) {
          const r0 = buf8[index + 0];
          const g0 = buf8[index + 1];
          const b0 = buf8[index + 2];
          const a0 = buf8[index + 3] / 255.0;

          var a = a0 + a1 - a0 * a1;

          if (a > 0) {
            //不透明なピクセルの場合
            var a1x = a1;
            var ax = 1 + a0 * (1 - a1x);

            let r = (r1 + r0 * a0 * (1 - a1x)) / ax;
            let g = (g1 + g0 * a0 * (1 - a1x)) / ax;
            let b = (b1 + b0 * a0 * (1 - a1x)) / ax;

            r = r1 > r0 ? Math.ceil(r) : Math.floor(r);
            g = g1 > g0 ? Math.ceil(g) : Math.floor(g);
            b = b1 > b0 ? Math.ceil(b) : Math.floor(b);

            var tmp = a * 255;
            a = Math.ceil(tmp);

            buf8[index + 0] = r;
            buf8[index + 1] = g;
            buf8[index + 2] = b;
            buf8[index + 3] = a;
          }
        }
      }
      index += 4;
    }
  }
  //透明なピクセルの場合はもとのbuf8が入る
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns
 */
Neo.Painter.prototype.rectFillMask = function (x, y, width, height) {
  return true;
};
/**
 * 矩形枠線マスク関数。矩形の外周部のみ描画対象とする。
 * @param {number} x - 相対X座標
 * @param {number} y - 相対Y座標
 * @param {number} width - 矩形幅
 * @param {number} height - 矩形高さ
 * @returns {boolean} 外周の線幅内であれば true
 */
Neo.Painter.prototype.rectMask = function (x, y, width, height) {
  var d = this._currentWidth;
  //  var d = this.lineWidth;
  return x < d || x > width - 1 - d || y < d || y > height - 1 - d
    ? true
    : false;
};

/**
 * 楕円
 * @description 楕円塗り潰しマスク関数。楕円内部を全て描画対象とする。
 * @param {number} x - 相対X座標
 * @param {number} y - 相対Y座標
 * @param {number} width - 矩形幅
 * @param {number} height - 矩形高さ
 * @returns {boolean} 楕円内部の時に true
 */
Neo.Painter.prototype.ellipseFillMask = function (x, y, width, height) {
  var cx = (width - 1) / 2.0;
  var cy = (height - 1) / 2.0;
  x = (x - cx) / (cx + 1);
  y = (y - cy) / (cy + 1);

  return x * x + y * y < 1 ? true : false;
};

/**
 * 線楕円
 * @description 楕円枠線マスク関数。楕円の輪郭部分のみ描画対象とする。
 * @param {number} x - 相対X座標
 * @param {number} y - 相対Y座標
 * @param {number} width - 矩形幅
 * @param {number} height - 矩形高さ
 * @returns {boolean} 輪郭内であれば true
 */
Neo.Painter.prototype.ellipseMask = function (x, y, width, height) {
  var d = this._currentWidth;
  //  var d = this.lineWidth;
  var cx = (width - 1) / 2.0;
  var cy = (height - 1) / 2.0;

  if (cx <= d || cy <= d) return this.ellipseFillMask(x, y, width, height);

  var x2 = (x - cx) / (cx - d + 1);
  var y2 = (y - cy) / (cy - d + 1);

  x = (x - cx) / (cx + 1);
  y = (y - cy) / (cy + 1);

  if (x * x + y * y < 1) {
    if (x2 * x2 + y2 * y2 >= 1) {
      return true;
    }
  }
  return false;
};

/*
   -----------------------------------------------------------------------
 */

/**
 * キャンバス上のマウス座標を、ズーム・スクロール状態を反映した描画先座標に変換。
 * @param {number} mouseX - マウスのX座標
 * @param {number} mouseY - マウスのY座標
 * @param {boolean} isClip - キャンバス範囲外をカットするかどうか
 * @param {boolean} [isCenter=false] - 座標をピクセル中心（0.5）に合わせるかどうか
 * @returns {{x: number, y: number}} 変換後の座標オブジェクト
 */
Neo.Painter.prototype.getDestCanvasPosition = function (
  mouseX,
  mouseY,
  isClip,
  isCenter = false,
) {
  let mx = Math.floor(mouseX); //Math.round(mouseX);
  let my = Math.floor(mouseY); //Math.round(mouseY);
  if (isCenter) {
    mx += 0.499;
    my += 0.499;
  }

  // マウス座標（描画先キャンバス座標）を計算
  var x =
    (mx - this.zoomX + (this.destCanvas.width * 0.5) / this.zoom) * this.zoom;
  var y =
    (my - this.zoomY + (this.destCanvas.height * 0.5) / this.zoom) * this.zoom;

  if (isClip) {
    x = Math.max(Math.min(x, this.destCanvas.width), 0);
    y = Math.max(Math.min(y, this.destCanvas.height), 0);
  }
  return { x: x, y: y };
};

/**
 * イベント発生源が描画キャンバス周辺か、またはUI操作領域かを判定する。
 * @param {Element} element - イベントターゲットとなるDOM要素。
 * @returns {boolean} 操作対象のUI（ツール、ボタン、入力欄）の時は true。描画領域（キャンバス）または周囲の余白の時は false。
 * @note
 * イベント伝播時に、UI操作とキャンバス操作を仕分けるための境界判定。
 * #NEO配下のツールバーやボタンを「ウィジェット」としてマークし、描画イベントの伝播を遮断する。
 */
Neo.Painter.prototype.isWidget = function (element) {
  if (!element || !(element instanceof Element)) return false;

  // #NEO の外側を除外
  const root = element.closest("#NEO");
  if (!root) return false;

  //  ツール領域・ボタン類
  if (
    element.closest(
      "#neo-tools, .NEO .buttonOn, .NEO .buttonOff, .NEO .inputText",
    )
  ) {
    return true;
  }

  return false;
};

/**
 * 要素がメインの描画・操作エリア（#neo-container）内にあるかを判定する。
 * @param {Element} element - 判定対象のDOM要素
 * @returns {boolean} #neo-container配下なら true
 */
Neo.Painter.prototype.isContainer = function (element) {
  if (!element || !(element instanceof Element)) return false;
  // #NEO の外側を除外
  const root = element.closest("#NEO");
  if (!root) return false;
  if (element.closest("#neo-container")) {
    return true;
  }
  return false;
};

/**
 * 実行中のツールを強制終了し、マウスの状態をリセットする。
 * @returns {void}
 */
Neo.Painter.prototype.cancelTool = function () {
  if (this.tool) {
    this.isMouseDown = false;
    this.tool.upHandler(this);

    //      switch (this.tool.type) {
    //      case Neo.Painter.TOOLTYPE_HAND:
    //      case Neo.Painter.TOOLTYPE_SLIDER:
    //          this.isMouseDown = false;
    //          this.tool.upHandler(this);
    //      }
  }
};

/**
 * 画像ファイルを読み込み、メインレイヤー（canvasCtx[0]）に描画する。
 * @param {string} filename - 画像のパスまたはDataURL
 * @returns {void}
 */
Neo.Painter.prototype.loadImage = function (filename) {
  console.log("loadImage " + filename);
  var img = new Image();
  const ref = this;
  img.onload = function () {
    ref.canvasCtx[0].drawImage(img, 0, 0);
    ref.updateDestCanvas(0, 0, ref.canvasWidth, ref.canvasHeight);
  };
  img.src = filename;
};

/**
 * アニメーションデータ(PCH)を読み込み、再生を開始する。
 * @param {string} filename - アニメーションデータのURL
 * @returns {void}
 */
Neo.Painter.prototype.loadAnimation = function (filename) {
  console.log("loadAnimation " + filename);

  this.busy = true;
  //続きを描く画面で動画をスキップする時はbusySkippedをtrueにする
  this.busySkipped = Neo.config.neo_animation_skip == "true";

  const ref = this;
  Neo.getPCH(filename, function (pch) {
    //console.log(pch);
    ref._actionMgr._items = pch.data;
    ref._actionMgr._mark = pch.data.length;
    ref._actionMgr.play();
  });
};

/**
 * ブラウザのストレージからレイヤーデータを読み込み、キャンバスを復元する。
 * @param {Function} [callback] - 読み込み完了後に実行するコールバック関数
 * @returns {void}
 */
Neo.Painter.prototype.loadSession = function (callback) {
  const ref = this;
  if (Neo.storage) {
    const layerData0 = Neo.storage.getItem("layer0");
    const layerData1 = Neo.storage.getItem("layer1");
    if (!layerData0 || !layerData1) return;

    var img0 = new Image();
    img0.onload = function () {
      var img1 = new Image();
      img1.onload = function () {
        ref.canvasCtx[0].clearRect(0, 0, ref.canvasWidth, ref.canvasHeight);
        ref.canvasCtx[1].clearRect(0, 0, ref.canvasWidth, ref.canvasHeight);
        ref.canvasCtx[0].drawImage(img0, 0, 0);
        ref.canvasCtx[1].drawImage(img1, 0, 0);
        ref.updateDestCanvas(0, 0, ref.canvasWidth, ref.canvasHeight);

        if (callback) callback();
      };
      img1.src = layerData1;
    };
    img0.src = layerData0;
  }
};

/**
 * 現在のキャンバス状態（レイヤー0, 1）をブラウザのストレージに保存する。
 * @returns {void}
 */
Neo.Painter.prototype.saveSession = function () {
  if (Neo.storage) {
    Neo.storage.setItem("timestamp", String(Date.now()));
    Neo.storage.setItem("layer0", this.canvas[0].toDataURL("image/png"));
    Neo.storage.setItem("layer1", this.canvas[1].toDataURL("image/png"));
  }
};

/**
 * ブラウザのストレージから保存済みのセッションデータを削除する。
 * @returns {void}
 */
Neo.Painter.prototype.clearSession = function () {
  if (Neo.storage) {
    Neo.storage.removeItem("timestamp");
    Neo.storage.removeItem("layer0");
    Neo.storage.removeItem("layer1");
  }
};
/**
 * RGBの各色成分の値を比較し、小さい順にインデックス（0:R, 1:G, 2:B）を並べ替えて返す。
 * @param {number} r0 - 赤成分
 * @param {number} g0 - 緑成分
 * @param {number} b0 - 青成分
 * @returns {number[]} [最小値のインデックス, 中間値のインデックス, 最大値のインデックス]
 */
Neo.Painter.prototype.sortColor = function (r0, g0, b0) {
  var min = r0 < g0 ? (r0 < b0 ? 0 : 2) : g0 < b0 ? 1 : 2;
  var max = r0 > g0 ? (r0 > b0 ? 0 : 2) : g0 > b0 ? 1 : 2;
  var mid = min + max == 1 ? 2 : min + max == 2 ? 1 : 0;
  return [min, mid, max];
};

/**
 * 指定レイヤーにテキストを描画する。
 * 一時キャンバスでテキストを描画後、ピクセル単位で色変換・アルファ合成を行いメインへ転写する。
 * @param {number} layer - 描画対象レイヤー番号
 * @param {number} x - 描画X座標
 * @param {number} y - 描画Y座標
 * @param {number} color - RGB色コード
 * @param {number} alpha - 不透明度 (0.0~1.0)
 * @param {string} string - 描画するテキスト
 * @param {string} fontSize - フォントサイズ
 * @param {string} fontFamily - フォントファミリー
 */
Neo.Painter.prototype.doText = function (
  layer,
  x,
  y,
  color,
  alpha,
  string,
  fontSize,
  fontFamily,
) {
  //テキスト描画
  if (string.length <= 0) return;

  //描画位置がずれるので適当に調整
  var offset = parseInt(fontSize, 10);
  var ctx = this.tempCanvasCtx;
  ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  ctx.save();
  ctx.translate(x, y);
  ctx.font = fontSize + " " + fontFamily;

  ctx.fillStyle = "#000000";
  ctx.fillText(string, 0, 0);
  ctx.restore();

  // 適当に二値化
  const r = color & 0xff;
  const g = (color & 0xff00) >> 8;
  const b = (color & 0xff0000) >> 16;
  const a = Math.round(alpha * 255.0);

  const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  const buf32 = new Uint32Array(imageData.data.buffer);
  const buf8 = new Uint8ClampedArray(imageData.data.buffer);
  const length = this.canvasWidth * this.canvasHeight;
  let index = 0;
  for (var i = 0; i < length; i++) {
    if (buf8[index + 3] >= 0x60) {
      buf8[index + 0] = r;
      buf8[index + 1] = g;
      buf8[index + 2] = b;
      buf8[index + 3] = a;
    } else {
      buf8[index + 0] = 0;
      buf8[index + 1] = 0;
      buf8[index + 2] = 0;
      buf8[index + 3] = 0;
    }
    index += 4;
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, 0, 0);

  //キャンバスに貼り付け
  ctx = this.canvasCtx[layer];
  ctx.globalAlpha = 1.0;
  ctx.drawImage(
    this.tempCanvas,
    0,
    0,
    this.canvasWidth,
    this.canvasHeight,
    0,
    0,
    this.canvasWidth,
    this.canvasHeight,
  );

  this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

/**
 * Bzで操作中かどうか
 * @returns {boolean} - Bzで操作中ならtrueが返る
 */
Neo.Painter.prototype.isUIPaused = function () {
  if (this.drawType == Neo.Painter.DRAWTYPE_BEZIER) {
    if (this.tool.step && this.tool.step > 0) {
      return true;
    }
  }
  return false;
};

Neo.Painter.prototype.getEmulationMode = function () {
  return parseFloat(Neo.config.neo_emulation_mode || 2.22);
};

/*
   -------------------------------------------------------------------------
   Recorder Test
   -------------------------------------------------------------------------
 */

Neo.Painter.prototype.play = function () {
  if (this._actionMgr) {
    this._actionMgr.clearCanvas();
    this.prevLine = null;

    //console.log('[play]');

    this._actionMgr._head = 0;
    this._actionMgr._index = 0;
    this._actionMgr._mark = this._actionMgr._items.length;
    this._actionMgr._pause = false;
    this._actionMgr.play();
  }
};

Neo.Painter.prototype.onrewind = function () {
  if (this._actionMgr) {
    this._actionMgr.clearCanvas();
    this._actionMgr._head = 0;
    this._actionMgr._index = 0;
    this.prevLine = null;
  }
  if (Neo.viewerBar) Neo.viewerBar.update();
  if (!this._actionMgr._pause) {
    this._actionMgr.play();
  }
};

Neo.Painter.prototype.onmark = function () {
  if (Neo.viewerBar) Neo.viewerBar.update();
  if (!this._actionMgr._pause) {
    if (this._actionMgr._head > this._actionMgr._mark) {
      this.onrewind();
    } else {
      this.onplay();
    }
  }
};

Neo.Painter.prototype.onplay = function () {
  Neo.viewerPlay?.setSelected(true);
  Neo.viewerStop?.setSelected(false);

  this._actionMgr._pause = false;
  this._actionMgr.play();
};

Neo.Painter.prototype.onstop = function () {
  Neo.viewerPlay?.setSelected(false);
  Neo.viewerStop?.setSelected(true);
  this._actionMgr._pause = true;
};

Neo.Painter.prototype.onspeed = function () {
  var mgr = this._actionMgr;
  var mode = mgr.speedMode();
  Neo.speed = mgr._speedTable[(mode + 1) % 4];
};
/**
 * @param {number[]} item
 */
Neo.Painter.prototype.setCurrent = function (item) {
  var color = this._currentColor;
  var mask = this._currentMask;
  var width = this._currentWidth;
  var type = this._currentMaskType;

  item.push(color[0], color[1], color[2], color[3]);
  item.push(mask[0], mask[1], mask[2]);
  item.push(width);
  item.push(type);
};

/**
 * @param {number[]} item
 */
Neo.Painter.prototype.getCurrent = function (item) {
  this._currentColor = [item[2], item[3], item[4], item[5]];
  this._currentMask = [item[6], item[7], item[8]];
  this._currentWidth = item[9];
  this._currentMaskType = item[10];
};

Neo.Painter.prototype.isDirty = function () {
  return this.dirty;
};

"use strict";
//@ts-check

Neo.ToolBase = class {
  constructor() {}
};
Neo.ToolBase.prototype.isDrag = false;
Neo.ToolBase.prototype.isUpMove = false;
Neo.ToolBase.prototype.ticking = false;

Neo.ToolBase.prototype.startX = 0;
Neo.ToolBase.prototype.startY = 0;
/**@type {any} */
Neo.ToolBase.prototype.type = null;
Neo.ToolBase.prototype.step = 0;
Neo.ToolBase.prototype.reverse = false;

/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.init = function (oe) {};
Neo.ToolBase.prototype.kill = function () {};
/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.transformForZoom = function (oe) {};
Neo.ToolBase.prototype.lineType = Neo.Painter.LINETYPE_NONE;

/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.downHandler = function (oe) {
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;
};

/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.upHandler = function (oe) {};

/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.moveHandler = function (oe) {};

/** @param {Neo.Painter} oe * */
Neo.ToolBase.prototype.transformForZoom = function (oe) {
  var ctx = oe.destCanvasCtx;
  ctx.translate(oe.canvasWidth * 0.5, oe.canvasHeight * 0.5);
  ctx.scale(oe.zoom, oe.zoom);
  ctx.translate(-oe.zoomX, -oe.zoomY);
};

Neo.ToolBase.prototype.getType = function () {
  return this.type;
};

Neo.ToolBase.prototype.getToolButton = function () {
  switch (this.type) {
    case Neo.Painter.TOOLTYPE_PEN:
    case Neo.Painter.TOOLTYPE_BRUSH:
    case Neo.Painter.TOOLTYPE_TEXT:
      return Neo.penTip;

    case Neo.Painter.TOOLTYPE_TONE:
    case Neo.Painter.TOOLTYPE_BLUR:
    case Neo.Painter.TOOLTYPE_DODGE:
    case Neo.Painter.TOOLTYPE_BURN:
      return Neo.pen2Tip;

    case Neo.Painter.TOOLTYPE_RECT:
    case Neo.Painter.TOOLTYPE_RECTFILL:
    case Neo.Painter.TOOLTYPE_ELLIPSE:
    case Neo.Painter.TOOLTYPE_ELLIPSEFILL:
      return Neo.effectTip;

    case Neo.Painter.TOOLTYPE_COPY:
    case Neo.Painter.TOOLTYPE_MERGE:
    case Neo.Painter.TOOLTYPE_BLURRECT:
    case Neo.Painter.TOOLTYPE_FLIP_H:
    case Neo.Painter.TOOLTYPE_FLIP_V:
    case Neo.Painter.TOOLTYPE_TURN:
      return Neo.effect2Tip;

    case Neo.Painter.TOOLTYPE_ERASER:
    case Neo.Painter.TOOLTYPE_ERASEALL:
    case Neo.Painter.TOOLTYPE_ERASERECT:
      return Neo.eraserTip;

    case Neo.Painter.TOOLTYPE_FILL:
      return Neo.fillButton;
  }
  return null;
};

/**
 * 保管ペンから情報を取り出す
 * @returns {any}
 */
Neo.ToolBase.prototype.getReserve = function () {
  switch (this.type) {
    case Neo.Painter.TOOLTYPE_ERASER:
      return Neo.reserveEraser;

    case Neo.Painter.TOOLTYPE_PEN:
    case Neo.Painter.TOOLTYPE_BRUSH:
    case Neo.Painter.TOOLTYPE_TONE:
    case Neo.Painter.TOOLTYPE_ERASERECT:
    case Neo.Painter.TOOLTYPE_ERASEALL:
    case Neo.Painter.TOOLTYPE_COPY:
    case Neo.Painter.TOOLTYPE_MERGE:
    case Neo.Painter.TOOLTYPE_FLIP_H:
    case Neo.Painter.TOOLTYPE_FLIP_V:

    case Neo.Painter.TOOLTYPE_DODGE:
    case Neo.Painter.TOOLTYPE_BURN:
    case Neo.Painter.TOOLTYPE_BLUR:
    case Neo.Painter.TOOLTYPE_BLURRECT:

    case Neo.Painter.TOOLTYPE_TEXT:
    case Neo.Painter.TOOLTYPE_TURN:
    case Neo.Painter.TOOLTYPE_RECT:
    case Neo.Painter.TOOLTYPE_RECTFILL:
    case Neo.Painter.TOOLTYPE_ELLIPSE:
    case Neo.Painter.TOOLTYPE_ELLIPSEFILL:
      return Neo.reservePen;
  }
  return null;
};

Neo.ToolBase.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.updateUI();
  }
};

Neo.ToolBase.prototype.saveStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    reserve.size = Neo.painter.lineWidth;
  }
};

/*
  -------------------------------------------------------------------------
    DrawToolBase（描画ツールのベースクラス）
  -------------------------------------------------------------------------
*/

Neo.DrawToolBase = class extends Neo.ToolBase {
  constructor() {
    super();
    this.x0 = 0;
    this.y0 = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.x3 = 0;
    this.y3 = 0;
  }
};

Neo.DrawToolBase.prototype.isUpMove = false;
Neo.DrawToolBase.prototype.step = 0;

Neo.DrawToolBase.prototype.init = function () {
  this.step = 0;
  this.isUpMove = true;
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.downHandler = function (oe) {
  switch (oe.drawType) {
    case Neo.Painter.DRAWTYPE_FREEHAND:
      this.freeHandDownHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_LINE:
      this.lineDownHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_BEZIER:
      this.bezierDownHandler(oe);
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.upHandler = function (oe) {
  switch (oe.drawType) {
    case Neo.Painter.DRAWTYPE_FREEHAND:
      this.freeHandUpHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_LINE:
      this.lineUpHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_BEZIER:
      this.bezierUpHandler(oe);
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.moveHandler = function (oe) {
  switch (oe.drawType) {
    case Neo.Painter.DRAWTYPE_FREEHAND:
      this.freeHandMoveHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_LINE:
      this.lineMoveHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_BEZIER:
      this.bezierMoveHandler(oe);
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.upMoveHandler = function (oe) {
  switch (oe.drawType) {
    case Neo.Painter.DRAWTYPE_FREEHAND:
      this.freeHandUpMoveHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_LINE:
      this.lineUpMoveHandler(oe);
      break;
    case Neo.Painter.DRAWTYPE_BEZIER:
      this.bezierUpMoveHandler(oe);
      break;
  }
};
/**
 * @param {KeyboardEvent} e
 */
Neo.DrawToolBase.prototype.keyDownHandler = function (e) {
  switch (Neo.painter.drawType) {
    case Neo.Painter.DRAWTYPE_BEZIER:
      //Bz曲線をエスケープキーでキャンセル
      this.bezierKeyDownHandler(e);
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.rollOutHandler = function (oe) {
  if (!oe.isMouseDown && !oe.isMouseDownRight) {
    oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }
};

Neo.DrawToolBase.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 1.0;
    Neo.updateUI();
  }
};

/**
 * FreeHand (手書き)
 *  @param {Neo.Painter} oe
 * */
Neo.DrawToolBase.prototype.freeHandDownHandler = function (oe) {
  //Register undo first;
  oe._pushUndo();

  oe.prepareDrawing();
  this.isUpMove = false;
  var ctx = oe.canvasCtx[oe.current];
  if (oe.alpha >= 1 || this.lineType != Neo.Painter.LINETYPE_BRUSH) {
    var x0 = Math.floor(oe.mouseX);
    var y0 = Math.floor(oe.mouseY);
    oe._actionMgr.freeHand(x0, y0, this.lineType);
    //      oe.drawLine(ctx, x0, y0, x0, y0, this.lineType);
  }

  if (oe.cursorRect) {
    const rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }

  if (oe.alpha >= 1) {
    var r = Math.ceil(oe.lineWidth / 2);
    const rect = oe.getBound(oe.mouseX, oe.mouseY, oe.mouseX, oe.mouseY, r);
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
  }
  if (!Neo.isMobile()) {
    this.drawCursor(oe);
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.freeHandUpHandler = function (oe) {
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

  if (oe.cursorRect) {
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }
  if (oe.zoom < 1) {
    //縮小時はポインターアップで全体更新
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }
  //  this.drawCursor(oe);
  oe.prevLine = null;
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.freeHandMoveHandler = function (oe) {
  var ctx = oe.canvasCtx[oe.current];
  var x0 = Math.floor(oe.mouseX);
  var y0 = Math.floor(oe.mouseY);
  var x1 = Math.floor(oe.prevMouseX);
  var y1 = Math.floor(oe.prevMouseY);
  //  oe.drawLine(ctx, x0, y0, x1, y1, this.lineType);
  oe._actionMgr.freeHandMove(x0, y0, x1, y1, this.lineType);

  if (oe.cursorRect) {
    const rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }

  var r = Math.ceil(oe.lineWidth / 2);
  const rect = oe.getBound(
    oe.mouseX,
    oe.mouseY,
    oe.prevMouseX,
    oe.prevMouseY,
    r,
  );
  oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
  if (!Neo.isMobile()) {
    this.drawCursor(oe);
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.freeHandUpMoveHandler = function (oe) {
  this.isUpMove = true;

  if (oe.cursorRect) {
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }
  //縮小時は円カーソルを非表示 部分更新のグリッチが出るため
  if (oe.zoom < 1) {
    return;
  }
  //円カーソルを表示
  this.drawCursor(oe);
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.drawCursor = function (oe) {
  if (oe.zoom < 0.5) {
    //0.2倍時にカーソルのゴミが出るため
    return;
  }
  // if (oe.lineWidth <= 8) return;
  var mx = Math.floor(oe.mouseX);
  var my = Math.floor(oe.mouseY);

  var d = oe.lineWidth;
  d = d == 1 ? 2 : d; //1pxの時は2px相当の円カーソルを表示

  var x = (mx - oe.zoomX + (oe.destCanvas.width * 0.5) / oe.zoom) * oe.zoom;
  var y = (my - oe.zoomY + (oe.destCanvas.height * 0.5) / oe.zoom) * oe.zoom;
  var r = d * 0.5 * oe.zoom;

  if (
    !(
      x > -r &&
      y > -r &&
      x < oe.destCanvas.width + r &&
      y < oe.destCanvas.height + r
    )
  )
    return;

  var ctx = oe.destCanvasCtx;
  ctx.save();
  this.transformForZoom(oe);

  var c = this.type == Neo.Painter.TOOLTYPE_ERASER ? 0x0000ff : 0xffff7f;
  oe.drawXOREllipse(ctx, x - r, y - r, r * 2, r * 2, false, c);

  ctx.restore();
  oe.cursorRect = oe.getBound(mx, my, mx, my, Math.ceil(d / 2));
};

/**
 * Line (直線)
 *  @param {Neo.Painter} oe
 * */
Neo.DrawToolBase.prototype.lineDownHandler = function (oe) {
  this.isUpMove = false;
  this.startX = Math.floor(oe.mouseX);
  this.startY = Math.floor(oe.mouseY);
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.lineUpHandler = function (oe) {
  if (this.isUpMove == false) {
    this.isUpMove = true;

    oe._pushUndo();
    oe.prepareDrawing();
    var x0 = Math.floor(oe.mouseX);
    var y0 = Math.floor(oe.mouseY);
    oe._actionMgr.line(x0, y0, this.startX, this.startY, this.lineType);

    /*
        var ctx = oe.canvasCtx[oe.current];
        var x0 = Math.floor(oe.mouseX);
        var y0 = Math.floor(oe.mouseY);
        oe.drawLine(ctx, x0, y0, this.startX, this.startY, this.lineType);
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
        */
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.lineMoveHandler = function (oe) {
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  this.drawLineCursor(oe);
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.lineUpMoveHandler = function (oe) {};

/**
 *  @param {Neo.Painter} oe
 *  @param {number} [mx]
 *  @param {number} [my]
 * */
Neo.DrawToolBase.prototype.drawLineCursor = function (oe, mx = 0, my = 0) {
  if (!mx) mx = Math.floor(oe.mouseX);
  if (!my) my = Math.floor(oe.mouseY);
  var nx = this.startX;
  var ny = this.startY;
  var ctx = oe.destCanvasCtx;
  ctx.save();
  this.transformForZoom(oe);

  var x0 =
    (mx + 0.499 - oe.zoomX + (oe.destCanvas.width * 0.5) / oe.zoom) * oe.zoom;
  var y0 =
    (my + 0.499 - oe.zoomY + (oe.destCanvas.height * 0.5) / oe.zoom) * oe.zoom;
  var x1 =
    (nx + 0.499 - oe.zoomX + (oe.destCanvas.width * 0.5) / oe.zoom) * oe.zoom;
  var y1 =
    (ny + 0.499 - oe.zoomY + (oe.destCanvas.height * 0.5) / oe.zoom) * oe.zoom;
  oe.drawXORLine(ctx, x0, y0, x1, y1);

  ctx.restore();
};

/**
 *  Bezier (BZ曲線)
 *  @param {Neo.Painter} oe
 * */
Neo.DrawToolBase.prototype.bezierDownHandler = function (oe) {
  oe.isBezierActive = true;
  this.isUpMove = false;

  if (this.step == 0) {
    this.startX = this.x0 = Math.floor(oe.mouseX);
    this.startY = this.y0 = Math.floor(oe.mouseY);
  }
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};
Neo.DrawToolBase.prototype.cancelBezier = function () {
  var oe = Neo.painter;

  this.step = 0;
  oe.isBezierActive = false;

  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.bezierUpHandler = function (oe) {
  if (this.isUpMove == false) {
    this.isUpMove = true;
  } else return; // 枠外からベジェを開始したときdownを通らずにupが呼ばれてエラーになる

  this.step++;
  switch (this.step) {
    case 1:
      oe.prepareDrawing();
      this.x3 = Math.floor(oe.mouseX);
      this.y3 = Math.floor(oe.mouseY);
      break;

    case 2:
      this.x1 = Math.floor(oe.mouseX);
      this.y1 = Math.floor(oe.mouseY);
      break;

    case 3:
      this.x2 = Math.floor(oe.mouseX);
      this.y2 = Math.floor(oe.mouseY);

      oe._pushUndo();
      oe._actionMgr.bezier(
        this.x0,
        this.y0,
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        this.x3,
        this.y3,
        this.lineType,
      );
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

      /*oe.drawBezier(oe.canvasCtx[oe.current],
                      this.x0, this.y0, this.x1, this.y1,
                      this.x2, this.y2, this.x3, this.y3, this.lineType);
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);*/

      this.step = 0;
      oe.isBezierActive = false;
      break;

    default:
      this.step = 0;
      oe.isBezierActive = false;
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.bezierMoveHandler = function (oe) {
  switch (this.step) {
    case 0:
      if (!this.isUpMove) {
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, false);
        this.drawLineCursor(oe);
      }
      break;
    case 1:
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, false);
      this.drawBezierCursor1(oe);
      break;

    case 2:
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, false);
      this.drawBezierCursor2(oe);
      break;
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.bezierUpMoveHandler = function (oe) {
  if (this.step === 3) {
    //Bz確定時はそのままmove
    this.bezierMoveHandler(oe);
    return;
  }

  if (this.ticking) return;
  this.ticking = true;

  setTimeout(() => {
    this.bezierMoveHandler(oe);
    this.ticking = false;
  }, 10);
};
/**
 * Bz曲線をエスケープキーでキャンセル
 * @param {KeyboardEvent} e
 */
Neo.DrawToolBase.prototype.bezierKeyDownHandler = function (e) {
  if (e.key == "Escape") {
    //Escでキャンセル
    this.cancelBezier();
  }
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.drawBezierCursor1 = function (oe) {
  var ctx = oe.destCanvasCtx;

  var x = oe.mouseX; //Math.floor(oe.mouseX);
  var y = oe.mouseY; //Math.floor(oe.mouseY);
  /*
    var stab = oe.getStabilized();
    var x = Math.floor(stab[0]);
    var y = Math.floor(stab[1]);
    */
  var p = oe.getDestCanvasPosition(x, y, false, true);
  var p0 = oe.getDestCanvasPosition(this.x0, this.y0, false, true);
  var p3 = oe.getDestCanvasPosition(this.x3, this.y3, false, true);

  // handle
  oe.drawXORLine(ctx, p0.x, p0.y, p.x, p.y);
  oe.drawXOREllipse(ctx, p.x - 4, p.y - 4, 8, 8);
  oe.drawXOREllipse(ctx, p0.x - 4, p0.y - 4, 8, 8);

  // preview
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.drawBezier(
    oe.tempCanvasCtx,
    this.x0,
    this.y0,
    x,
    y,
    x,
    y,
    this.x3,
    this.y3,
    Neo.Painter.LINETYPE_PEN, //this.lineType,
    false,
    true,
  );
  ctx.save();
  ctx.translate(oe.destCanvas.width * 0.5, oe.destCanvas.height * 0.5);
  ctx.scale(oe.zoom, oe.zoom);
  ctx.translate(-oe.zoomX, -oe.zoomY);
  ctx.drawImage(
    oe.tempCanvas,
    0,
    0,
    oe.canvasWidth,
    oe.canvasHeight,
    0,
    0,
    oe.canvasWidth,
    oe.canvasHeight,
  );

  ctx.restore();
};

/** @param {Neo.Painter} oe */
Neo.DrawToolBase.prototype.drawBezierCursor2 = function (oe) {
  var ctx = oe.destCanvasCtx;

  var x = oe.mouseX; //Math.floor(oe.mouseX);
  var y = oe.mouseY; //Math.floor(oe.mouseY);
  /*
    var stab = oe.getStabilized();
    var x = Math.floor(stab[0]);
    var y = Math.floor(stab[1]);
    */
  var p = oe.getDestCanvasPosition(oe.mouseX, oe.mouseY, false, true);
  var p0 = oe.getDestCanvasPosition(this.x0, this.y0, false, true);
  var p1 = oe.getDestCanvasPosition(this.x1, this.y1, false, true);
  var p3 = oe.getDestCanvasPosition(this.x3, this.y3, false, true);

  // handle
  oe.drawXORLine(ctx, p3.x, p3.y, p.x, p.y);
  oe.drawXOREllipse(ctx, p.x - 4, p.y - 4, 8, 8);
  oe.drawXORLine(ctx, p0.x, p0.y, p1.x, p1.y);
  oe.drawXOREllipse(ctx, p1.x - 4, p1.y - 4, 8, 8);
  oe.drawXOREllipse(ctx, p0.x - 4, p0.y - 4, 8, 8);

  // preview
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.drawBezier(
    oe.tempCanvasCtx,
    this.x0,
    this.y0,
    this.x1,
    this.y1,
    x,
    y,
    this.x3,
    this.y3,
    Neo.Painter.LINETYPE_PEN, //this.lineType,
    false,
    true,
  );
  ctx.save();
  ctx.translate(oe.destCanvas.width * 0.5, oe.destCanvas.height * 0.5);
  ctx.scale(oe.zoom, oe.zoom);
  ctx.translate(-oe.zoomX, -oe.zoomY);
  ctx.drawImage(
    oe.tempCanvas,
    0,
    0,
    oe.canvasWidth,
    oe.canvasHeight,
    0,
    0,
    oe.canvasWidth,
    oe.canvasHeight,
  );
  ctx.restore();
};

/*
  -------------------------------------------------------------------------
    Pen（鉛筆）
  -------------------------------------------------------------------------
*/

Neo.PenTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};

Neo.PenTool.prototype.type = Neo.Painter.TOOLTYPE_PEN;
Neo.PenTool.prototype.lineType = Neo.Painter.LINETYPE_PEN;

Neo.PenTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 1.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Brush（水彩）
  -------------------------------------------------------------------------
*/

Neo.BrushTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};

Neo.BrushTool.prototype.type = Neo.Painter.TOOLTYPE_BRUSH;
Neo.BrushTool.prototype.lineType = Neo.Painter.LINETYPE_BRUSH;

Neo.BrushTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = this.getAlpha();
    Neo.updateUI();
  }
};

Neo.BrushTool.prototype.getAlpha = function () {
  var alpha = 241 - Math.floor(Neo.painter.lineWidth / 2) * 6;
  return alpha / 255.0;
};

/*
  -------------------------------------------------------------------------
    Tone（トーン）
  -------------------------------------------------------------------------
*/

Neo.ToneTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};
Neo.ToneTool.prototype.constructor = Neo.DrawToolBase;
Neo.ToneTool.prototype.type = Neo.Painter.TOOLTYPE_TONE;
Neo.ToneTool.prototype.lineType = Neo.Painter.LINETYPE_TONE;

Neo.ToneTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 23 / 255.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Eraser（消しペン）
  -------------------------------------------------------------------------
*/

Neo.EraserTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};

Neo.EraserTool.prototype.type = Neo.Painter.TOOLTYPE_ERASER;
Neo.EraserTool.prototype.lineType = Neo.Painter.LINETYPE_ERASER;

/*
  -------------------------------------------------------------------------
    Blur（ぼかし）
  -------------------------------------------------------------------------
*/

Neo.BlurTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};

Neo.BlurTool.prototype.type = Neo.Painter.TOOLTYPE_BLUR;
Neo.BlurTool.prototype.lineType = Neo.Painter.LINETYPE_BLUR;

Neo.BlurTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 128 / 255.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Dodge（覆い焼き）
  -------------------------------------------------------------------------
*/

Neo.DodgeTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};

Neo.DodgeTool.prototype.type = Neo.Painter.TOOLTYPE_DODGE;
Neo.DodgeTool.prototype.lineType = Neo.Painter.LINETYPE_DODGE;

Neo.DodgeTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 128 / 255.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Burn（焼き込み）
  -------------------------------------------------------------------------
*/

Neo.BurnTool = class extends Neo.DrawToolBase {
  constructor() {
    super();
  }
};
Neo.BurnTool.prototype.type = Neo.Painter.TOOLTYPE_BURN;
Neo.BurnTool.prototype.lineType = Neo.Painter.LINETYPE_BURN;

Neo.BurnTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 128 / 255.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Hand（スクロール）
  -------------------------------------------------------------------------
*/

Neo.HandTool = class extends Neo.ToolBase {
  constructor() {
    super();
    this.latestX = 0;
    this.latestY = 0;
  }
};
Neo.HandTool.prototype.type = Neo.Painter.TOOLTYPE_HAND;
Neo.HandTool.prototype.isUpMove = false;
Neo.HandTool.prototype.reverse = false;

/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.downHandler = function (oe) {
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

  this.isDrag = true;
  this.ticking = false;
  this.startX = oe.rawMouseX;
  this.startY = oe.rawMouseY;
};

/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.upHandler = function (oe) {
  this.isDrag = false;
  oe.popTool();
};

/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.moveHandler = function (oe) {
  if (!this.isDrag) return;

  this.latestX = oe.rawMouseX;
  this.latestY = oe.rawMouseY;

  if (this.ticking) return;

  this.ticking = true;

  requestAnimationFrame(() => {
    var dx = this.startX - this.latestX;
    var dy = this.startY - this.latestY;

    var ax = oe.destCanvas.width / (oe.canvasWidth * oe.zoom);
    var ay = oe.destCanvas.height / (oe.canvasHeight * oe.zoom);
    var barWidth = oe.destCanvas.width * ax;
    var barHeight = oe.destCanvas.height * ay;
    var scrollWidthInScreen = oe.destCanvas.width - barWidth - 2;
    var scrollHeightInScreen = oe.destCanvas.height - barHeight - 2;

    dx *= oe.scrollWidth / scrollWidthInScreen;
    dy *= oe.scrollHeight / scrollHeightInScreen;

    if (this.reverse) {
      dx *= -1;
      dy *= -1;
    }

    oe.setZoomPosition(oe.zoomX - dx, oe.zoomY - dy);

    this.startX = this.latestX;
    this.startY = this.latestY;

    this.ticking = false;
  });
};
/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.HandTool.prototype.rollOutHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    Slider（色やサイズのスライダを操作している時）
  -------------------------------------------------------------------------
*/

Neo.SliderTool = class extends Neo.ToolBase {
  constructor() {
    super();
    /** @type {any} */
    this.target = null;
  }
};
Neo.SliderTool.prototype.type = Neo.Painter.TOOLTYPE_SLIDER;
Neo.SliderTool.prototype.isUpMove = false;
Neo.SliderTool.prototype.alt = false;

/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.downHandler = function (oe) {
  if (!oe.isShiftDown) this.isDrag = true;

  if (!oe.isCopyActive) {
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }
  var rect = this.target.getBoundingClientRect();
  var sliderType = this.alt ? Neo.SLIDERTYPE_SIZE : this.target["data-slider"];
  Neo.sliders[sliderType].downHandler(
    oe.rawMouseX - rect.left,
    oe.rawMouseY - rect.top,
  );
};

/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.upHandler = function (oe) {
  this.isDrag = false;
  oe.popTool();

  var rect = this.target.getBoundingClientRect();
  var sliderType = this.alt ? Neo.SLIDERTYPE_SIZE : this.target["data-slider"];
  Neo.sliders[sliderType].upHandler(
    oe.rawMouseX - rect.left,
    oe.rawMouseY - rect.top,
  );
};

/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.moveHandler = function (oe) {
  if (this.isDrag) {
    var rect = this.target.getBoundingClientRect();
    var sliderType = this.alt
      ? Neo.SLIDERTYPE_SIZE
      : this.target["data-slider"];
    Neo.sliders[sliderType].moveHandler(
      oe.rawMouseX - rect.left,
      oe.rawMouseY - rect.top,
    );
  }
};

/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.SliderTool.prototype.rollOutHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    Fill（塗り潰し）
  -------------------------------------------------------------------------
*/

Neo.FillTool = class extends Neo.ToolBase {
  constructor() {
    super();
  }
};
Neo.FillTool.prototype.type = Neo.Painter.TOOLTYPE_FILL;
Neo.FillTool.prototype.isUpMove = false;

/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.downHandler = function (oe) {
  var x = Math.floor(oe.mouseX);
  var y = Math.floor(oe.mouseY);
  var layer = oe.current;
  var color = oe.getColor();

  oe._pushUndo();
  oe._actionMgr.floodFill(layer, x, y, color);
  //oe.doFloodFill(layer, x, y, color);
};

/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.upHandler = function (oe) {};

/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.moveHandler = function (oe) {};

/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.rollOutHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.FillTool.prototype.rollOverHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    EraseAll（全消し）
  -------------------------------------------------------------------------
*/

Neo.EraseAllTool = class extends Neo.ToolBase {
  constructor() {
    super();
  }
};
Neo.EraseAllTool.prototype.type = Neo.Painter.TOOLTYPE_ERASEALL;
Neo.EraseAllTool.prototype.isUpMove = false;

/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.downHandler = function (oe) {
  oe._pushUndo();
  oe._actionMgr.eraseAll();

  /*oe.prepareDrawing();
    oe.canvasCtx[oe.current].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);*/
};

/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.upHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.moveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.rollOutHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EraseAllTool.prototype.rollOverHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    EffectToolBase（エフェックトツールのベースクラス）
  -------------------------------------------------------------------------
*/

Neo.EffectToolBase = class extends Neo.ToolBase {
  constructor() {
    super();
  }
};
Neo.EffectToolBase.prototype.isUpMove = false;
Neo.EffectToolBase.prototype.isEllipse = false;
Neo.EffectToolBase.prototype.isFill = false;
Neo.EffectToolBase.prototype.endX = 0;
Neo.EffectToolBase.prototype.endY = 0;
Neo.EffectToolBase.prototype.startX = 0;
Neo.EffectToolBase.prototype.startY = 0;
Neo.EffectToolBase.prototype.ticking = false;
Neo.EffectToolBase.prototype.latestX = 0;
Neo.EffectToolBase.prototype.latestY = 0;
Neo.EffectToolBase.prototype.defaultAlpha = 0;
/**
 * @param {Neo.Painter} oe
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
Neo.EffectToolBase.prototype.doEffect = function (oe, x, y, width, height) {};

/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.downHandler = function (oe) {
  this.isUpMove = false;
  this.ticking = false;

  this.startX = this.endX = oe.clipMouseX;
  this.startY = this.endY = oe.clipMouseY;
};

/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.upHandler = function (oe) {
  if (this.isUpMove) return;
  this.isUpMove = true;

  this.startX = Math.floor(this.startX);
  this.startY = Math.floor(this.startY);
  this.endX = Math.floor(this.endX);
  this.endY = Math.floor(this.endY);

  var x = this.startX < this.endX ? this.startX : this.endX;
  var y = this.startY < this.endY ? this.startY : this.endY;
  var width = Math.abs(this.startX - this.endX) + 1;
  var height = Math.abs(this.startY - this.endY) + 1;
  var ctx = oe.canvasCtx[oe.current];

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + width > oe.canvasWidth) width = oe.canvasWidth - x;
  if (y + height > oe.canvasHeight) height = oe.canvasHeight - y;

  if (width > 0 && height > 0) {
    oe._pushUndo();
    oe.prepareDrawing();
    this.doEffect(oe, x, y, width, height);
  }

  if (Neo.CurrentToolType != Neo.Painter.TOOLTYPE_PASTE) {
    setTimeout(() => {
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    }, 10);
  }
};

/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.moveHandler = function (oe) {
  this.latestX = oe.clipMouseX;
  this.latestY = oe.clipMouseY;

  if (this.ticking) return;
  this.ticking = true;

  requestAnimationFrame(() => {
    this.endX = this.latestX;
    this.endY = this.latestY;

    //ペーストの時はカーソルを描画しない
    if (oe.tool.type != Neo.Painter.TOOLTYPE_PASTE) {
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      this.drawCursor(oe);
    }
    this.ticking = false;
  });
};
/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.rollOutHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.EffectToolBase.prototype.drawCursor = function (oe) {
  var ctx = oe.destCanvasCtx;

  ctx.save();
  this.transformForZoom(oe);

  var start = oe.getDestCanvasPosition(this.startX, this.startY, true);
  var end = oe.getDestCanvasPosition(this.endX, this.endY, true);

  var x = start.x < end.x ? start.x : end.x;
  var y = start.y < end.y ? start.y : end.y;
  var width = Math.abs(start.x - end.x) + oe.zoom;
  var height = Math.abs(start.y - end.y) + oe.zoom;

  if (this.isEllipse) {
    oe.drawXOREllipse(ctx, x, y, width, height, this.isFill);
  } else {
    oe.drawXORRect(ctx, x, y, width, height, this.isFill);
  }
  ctx.restore();
};

Neo.EffectToolBase.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = this.defaultAlpha || 1.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    EraseRect（消し四角）
  -------------------------------------------------------------------------
*/

Neo.EraseRectTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.EraseRectTool.prototype.type = Neo.Painter.TOOLTYPE_ERASERECT;

/**
 * 矩形消去ツールの実行
 * @description
 * @param {Neo.Painter} oe - PaintBBS NEOのメインインスタンス (Neo.painter)
 * @param {number} x - 開始X座標
 * @param {number} y - 開始Y座標
 * @param {number} width - 消去する幅
 * @param {number} height - 消去する高さ
 */
Neo.EraseRectTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.eraseRect(ctx, x, y, width, height);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.eraseRect2(x, y, width, height);
};

/*
  -------------------------------------------------------------------------
    FlipH（左右反転）
  -------------------------------------------------------------------------
*/

Neo.FlipHTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.FlipHTool.prototype.type = Neo.Painter.TOOLTYPE_FLIP_H;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.FlipHTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.flipH(ctx, x, y, width, height);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.flipH(x, y, width, height);
};

/*
  -------------------------------------------------------------------------
    FlipV（上下反転）
  -------------------------------------------------------------------------
*/

Neo.FlipVTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.FlipVTool.prototype.type = Neo.Painter.TOOLTYPE_FLIP_V;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.FlipVTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.flipV(ctx, x, y, width, height);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.flipV(x, y, width, height);
};

/*
  -------------------------------------------------------------------------
    DodgeRect（角取り）
  -------------------------------------------------------------------------
*/

Neo.BlurRectTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.BlurRectTool.prototype.type = Neo.Painter.TOOLTYPE_BLURRECT;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.BlurRectTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.blurRect(ctx, x, y, width, height);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.blurRect(x, y, width, height);
};

Neo.BlurRectTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 0.5;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Turn（傾け）
  -------------------------------------------------------------------------
*/

Neo.TurnTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.TurnTool.prototype.type = Neo.Painter.TOOLTYPE_TURN;

/** @param {Neo.Painter} oe */
Neo.TurnTool.prototype.doEffect = function (oe) {
  this.isUpMove = true;

  this.startX = Math.floor(this.startX);
  this.startY = Math.floor(this.startY);
  this.endX = Math.floor(this.endX);
  this.endY = Math.floor(this.endY);

  var x = this.startX < this.endX ? this.startX : this.endX;
  var y = this.startY < this.endY ? this.startY : this.endY;
  var width = Math.abs(this.startX - this.endX) + 1;
  var height = Math.abs(this.startY - this.endY) + 1;

  if (width > 0 && height > 0) {
    oe._pushUndo();
    //      oe.turn(x, y, width, height);
    //      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    oe._actionMgr.turn(x, y, width, height);
  }
  setTimeout(() => {
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }, 10);
};

/*
  -------------------------------------------------------------------------
    Merge（レイヤー結合）
  -------------------------------------------------------------------------
*/

Neo.MergeTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};

Neo.MergeTool.prototype.type = Neo.Painter.TOOLTYPE_MERGE;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.MergeTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.merge(ctx, x, y, width, height);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.merge(x, y, width, height);
};

/*
  -------------------------------------------------------------------------
    Copy（コピー）
  -------------------------------------------------------------------------
*/

Neo.CopyTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.CopyTool.prototype.type = Neo.Painter.TOOLTYPE_COPY;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.CopyTool.prototype.doEffect = function (oe, x, y, width, height) {
  oe.isCopyActive = true;
  //  oe.copy(oe.current, x, y, width, height);
  oe._actionMgr.copy(x, y, width, height);
  oe.setToolByType(Neo.Painter.TOOLTYPE_PASTE);
  oe.tool.x = x;
  oe.tool.y = y;
  oe.tool.width = width;
  oe.tool.height = height;
};

/*
  -------------------------------------------------------------------------
    Paste（ペースト）
  -------------------------------------------------------------------------
*/

Neo.PasteTool = class extends Neo.ToolBase {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.latestDX = 0;
    this.latestDY = 0;
  }
};
Neo.PasteTool.prototype.type = Neo.Painter.TOOLTYPE_PASTE;

/** @param {Neo.Painter} oe */
Neo.PasteTool.prototype.downHandler = function (oe) {
  this.ticking = false;
  oe.isCopyActive = false;
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;
  this.drawCursor(oe);
};

/** @param {Neo.Painter} oe */
Neo.PasteTool.prototype.upHandler = function (oe) {
  oe._pushUndo();

  var dx = oe.tempX;
  var dy = oe.tempY;
  //  oe.paste(oe.current, this.x, this.y, this.width, this.height, dx, dy);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.paste(this.x, this.y, this.width, this.height, dx, dy);

  oe.setToolByType(Neo.Painter.TOOLTYPE_COPY);
};

/** @param {Neo.Painter} oe */
Neo.PasteTool.prototype.moveHandler = function (oe) {
  var dx = Math.floor(oe.mouseX - this.startX);
  var dy = Math.floor(oe.mouseY - this.startY);

  this.latestDX = dx;
  this.latestDY = dy;

  if (this.ticking) return;
  this.ticking = true;

  requestAnimationFrame(() => {
    oe.tempX = this.latestDX;
    oe.tempY = this.latestDY;
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    //  this.drawCursor(oe);
    this.ticking = false;
  });
};
/**
 * コピーアンドペーストをエスケープキーでキャンセル
 * @param {KeyboardEvent} e
 */
Neo.PasteTool.prototype.keyDownHandler = function (e) {
  var oe = Neo.painter;

  if (e.key == "Escape") {
    //Escでキャンセル
    oe.cancelCopy();
  }
};

Neo.PasteTool.prototype.kill = function () {
  var oe = Neo.painter;
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};

/** @param {Neo.Painter} oe */
Neo.PasteTool.prototype.drawCursor = function (oe) {
  var ctx = oe.destCanvasCtx;

  ctx.save();
  this.transformForZoom(oe);

  var start = oe.getDestCanvasPosition(this.x, this.y, true);
  var end = oe.getDestCanvasPosition(
    this.x + this.width,
    this.y + this.height,
    true,
  );

  var x = start.x + oe.tempX * oe.zoom;
  var y = start.y + oe.tempY * oe.zoom;
  var width = Math.abs(start.x - end.x);
  var height = Math.abs(start.y - end.y);
  oe.drawXORRect(ctx, x, y, width, height);
  ctx.restore();
};

/*
  -------------------------------------------------------------------------
    Rect（線四角）
  -------------------------------------------------------------------------
*/

Neo.RectTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.RectTool.prototype.type = Neo.Painter.TOOLTYPE_RECT;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.RectTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.doFill(ctx, x, y, width, height, this.type); //oe.rectMask);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.fill(x, y, width, height, this.type);
};

/*
  -------------------------------------------------------------------------
    RectFill（四角）
  -------------------------------------------------------------------------
*/

Neo.RectFillTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.RectFillTool.prototype.type = Neo.Painter.TOOLTYPE_RECTFILL;

Neo.RectFillTool.prototype.isFill = true;
/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.RectFillTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.doFill(ctx, x, y, width, height, this.type); //oe.rectFillMask);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.fill(x, y, width, height, this.type);
};

/*
  -------------------------------------------------------------------------
    Ellipse（線楕円）
  -------------------------------------------------------------------------
*/

Neo.EllipseTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.EllipseTool.prototype.type = Neo.Painter.TOOLTYPE_ELLIPSE;
Neo.EllipseTool.prototype.isEllipse = true;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.EllipseTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.doFill(ctx, x, y, width, height, this.type); //oe.ellipseMask);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.fill(x, y, width, height, this.type);
};

/*
  -------------------------------------------------------------------------
    EllipseFill（楕円）
  -------------------------------------------------------------------------
*/

Neo.EllipseFillTool = class extends Neo.EffectToolBase {
  constructor() {
    super();
  }
};
Neo.EllipseFillTool.prototype.type = Neo.Painter.TOOLTYPE_ELLIPSEFILL;
Neo.EllipseFillTool.prototype.isEllipse = true;
Neo.EllipseFillTool.prototype.isFill = true;

/**
 * @param {Neo.Painter} oe
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 *
 */
Neo.EllipseFillTool.prototype.doEffect = function (oe, x, y, width, height) {
  //  var ctx = oe.canvasCtx[oe.current];
  //  oe.doFill(ctx, x, y, width, height, this.type); //oe.ellipseFillMask);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.fill(x, y, width, height, this.type);
};

/*
  -------------------------------------------------------------------------
    Text（テキスト）
  -------------------------------------------------------------------------
*/

Neo.TextTool = class extends Neo.ToolBase {
  constructor() {
    super();
  }
};
Neo.TextTool.prototype.type = Neo.Painter.TOOLTYPE_TEXT;
Neo.TextTool.prototype.isUpMove = false;

/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.downHandler = function (oe) {
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;

  if (Neo.painter.inputText) {
    Neo.painter.updateInputText();

    var rect = oe.container?.getBoundingClientRect();
    if (!rect) {
      console.error("Rect not found for TextTool");
      return;
    }
    var text = Neo.painter.inputText;
    var x = oe.rawMouseX - rect.left - 5;
    var y = oe.rawMouseY - rect.top - 5;

    text.style.left = x + "px";
    text.style.top = y + "px";
    text.style.display = "block";
    text.focus();
  }
};

/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.upHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.moveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.TextTool.prototype.rollOutHandler = function (oe) {};

/**
 * テキスト入力の確定処理
 * @description
 * ユーザーがテキスト入力中にEnterキーを押した際、
 * 入力された内容をキャンバスに描画し、入力UIを終了する。
 * @param {KeyboardEvent} e - キーボードイベント
 */
Neo.TextTool.prototype.keyDownHandler = function (e) {
  if (e.key == "Enter") {
    // Returnで確定
    e.preventDefault();

    const oe = Neo.painter;
    /** @type {HTMLElement|null} **/
    const text = oe.inputText;

    if (text) {
      oe._pushUndo();
      //this.drawText(oe);
      //oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      /** @type {string} **/
      const string = text.textContent || text.innerText;
      /** @type {string} **/
      const size = text.style.fontSize;
      /** @type {string} **/
      const family = text.style.fontFamily || "Arial";
      /** @type {number} **/
      const color = oe.getColor();
      /** @type {number} **/
      const alpha = oe.alpha;
      // const layer = oe.current;
      // const x = this.startX;
      // const y = this.startY;
      //oe.doText(layer, this.startX, this.startY, color, string, size, family);
      oe._actionMgr.text(
        this.startX,
        this.startY,
        color,
        alpha,
        string,
        size,
        family,
      );

      text.style.display = "none";
      text.blur();
    }
  }
};

Neo.TextTool.prototype.kill = function () {
  Neo.painter.hideInputText();
};

/*
Neo.TextTool.prototype.drawText = function(oe) {
    var text = oe.inputText;

    var string = text.textContent || text.innerText;
    var size = text.style.fontSize;
    var family = text.style.fontFamily || "Arial";
    var layer = oe.current;
    var color = oe.getColor();
    var alpha = oe.alpha;
    var x = this.startX;
    var y = this.startY;
    //oe.doText(layer, this.startX, this.startY, color, string, size, family);
    oe._actionMgr.doText(layer, this.startX, this.startY,
                         color, alpha, string, size, family);
};
*/

Neo.TextTool.prototype.loadStates = function () {
  var reserve = this.getReserve();
  if (reserve) {
    Neo.painter.lineWidth = reserve.size;
    Neo.painter.alpha = 1.0;
    Neo.updateUI();
  }
};

/*
  -------------------------------------------------------------------------
    Dummy（何もしない時）
  -------------------------------------------------------------------------
*/

Neo.DummyTool = class extends Neo.ToolBase {
  constructor() {
    super();
  }
};
Neo.DummyTool.prototype.type = Neo.Painter.TOOLTYPE_NONE;
Neo.DummyTool.prototype.isUpMove = false;

/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.downHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.upHandler = function (oe) {
  oe.popTool();
};
/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.moveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.upMoveHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.rollOverHandler = function (oe) {};
/** @param {Neo.Painter} oe */
Neo.DummyTool.prototype.rollOutHandler = function (oe) {};

"use strict";
//@ts-check
Neo.CommandBase = class {
  constructor() {
    /**@type {any} */
    this.data = null;
  }
};
Neo.CommandBase.prototype.data;
Neo.CommandBase.prototype.execute = function () {};

/*
  ---------------------------------------------------
    ZOOM
  ---------------------------------------------------
*/
/**
 * @typedef {Object} ZoomPlusData
 * @property {number} zoom - 現在のズーム値
 * @property {(newZoom: number) => void} setZoom - ズーム値を設定するメソッド
 */
Neo.ZoomPlusCommand = class extends Neo.CommandBase {
  /** @param {ZoomPlusData} data */
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.ZoomPlusCommand.prototype.execute = function () {
  if (this.data.zoom >= 1 && this.data.zoom < 12) {
    this.data.setZoom(this.data.zoom + 1);
  } else if (this.data.zoom < 1) {
    this.data.setZoom(this.data.zoom + 0.2);
  }
  Neo.resizeCanvas();
  // Neo.resizeCanvas()でupdateDestCanvas()を引数付きで呼び出しているためコメントアウト
  // Neo.painter.updateDestCanvas();
};

/**
 * @typedef {Object} ZoomMinusData
 * @property {number} zoom - 現在のズーム値
 * @property {(newZoom: number) => void} setZoom - ズーム値を設定するメソッド
 */
Neo.ZoomMinusCommand = class extends Neo.CommandBase {
  /** @param {ZoomMinusData} data */
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.ZoomMinusCommand.prototype.execute = function () {
  if (this.data.zoom >= 2) {
    this.data.setZoom(this.data.zoom - 1);
  } else if (Neo.config.neo_enable_zoom_out && this.data.zoom >= 0.4) {
    this.data.setZoom(this.data.zoom - 0.2);
  }
  Neo.resizeCanvas();
  // Neo.resizeCanvas()でupdateDestCanvas()を引数付きで呼び出しているためコメントアウト
  // Neo.painter.updateDestCanvas();
};

/*
  ---------------------------------------------------
    UNDO
  ---------------------------------------------------
*/
Neo.UndoCommand = class extends Neo.CommandBase {
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.UndoCommand.prototype.execute = function () {
  this.data.cancelCopy();
  this.data.undo();
};

Neo.RedoCommand = class extends Neo.CommandBase {
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.RedoCommand.prototype.execute = function () {
  this.data.redo();
};

Neo.WindowCommand = class extends Neo.CommandBase {
  /** @param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.WindowCommand.prototype.execute = function () {
  if (Neo.fullScreen) {
    if (confirm(Neo.translate("ページビュー？"))) {
      Neo.fullScreen = false;
      Neo.updateWindow();
    }
  } else {
    if (confirm(Neo.translate("ウィンドウビュー？"))) {
      Neo.fullScreen = true;
      Neo.updateWindow();
    }
  }
};

Neo.SubmitCommand = class extends Neo.CommandBase {
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.SubmitCommand.prototype.execute = function () {
  var board = location.href.replace(/[^/]*$/, "");
  this.data.submit(board);
};

Neo.CopyrightCommand = class extends Neo.CommandBase {
  /**@param {any} data */
  constructor(data) {
    super();
    this.data = data;
  }
};
Neo.CopyrightCommand.prototype.execute = function () {
  var url = "http://github.com/funige/neo/";
  if (
    confirm(
      Neo.translate(
        "PaintBBS NEOは、お絵かきしぃ掲示板 PaintBBS (©2000-2004 しぃちゃん) をhtml5化するプロジェクトです。\n\nPaintBBS NEOのホームページを表示しますか？",
      ) + "\n",
    )
  ) {
    Neo.openURL(url);
  }
};

"use strict";
//@ts-check
/*
  -----------------------------------------------------------------------
    Action Manager
  -----------------------------------------------------------------------
*/

Neo.ActionManager = class {
  constructor() {
    /** @type {any} */
    this._items = [];
    this._head = 0;
    this._index = 0;

    this._pause = false;
    this._mark = 0;

    this._speedTable = [-1, 0, 1, 11]; // [最, 早, 既, 鈍]

    Neo.speed = parseInt(Neo.config.speed || 0);
    this._prevSpeed = Neo.speed;
  }
};
Neo.ActionManager.prototype.isMouseDown = false;
Neo.ActionManager.prototype.speedMode = function () {
  if (Neo.speed < 0) {
    return 0;
  } else if (Neo.speed == 0) {
    return 1;
  } else if (Neo.speed <= 10) {
    return 2;
  } else {
    return 3;
  }
};

Neo.ActionManager.prototype.step = function () {
  if (!Neo.isAnimation) return;

  if (this._items.length > this._head) {
    this._items.length = this._head;
  }
  this._items.push([]);
  this._head++;
  this._index = 0;
};

Neo.ActionManager.prototype.back = function () {
  if (!Neo.isAnimation) return;

  if (this._head > 0) {
    this._head--;
  }
};

Neo.ActionManager.prototype.forward = function () {
  if (!Neo.isAnimation) return;

  if (this._head < this._items.length) {
    this._head++;
  }
};

Neo.ActionManager.prototype.push = function () {
  if (!Neo.isAnimation) return;

  var head = this._items[this._head - 1];
  for (var i = 0; i < arguments.length; i++) {
    head.push(arguments[i]);
  }
};

Neo.ActionManager.prototype.pushCurrent = function () {
  if (!Neo.isAnimation) return;

  var oe = Neo.painter;
  var head = this._items[this._head - 1];

  var color = oe._currentColor;
  var mask = oe._currentMask;
  var width = oe._currentWidth;
  var type = oe._currentMaskType;

  head.push(color[0], color[1], color[2], color[3]);
  head.push(mask[0], mask[1], mask[2]);
  head.push(width);
  head.push(type);
};

/**
 * 指定された描画アクション（履歴データ）から、ブラシ設定（色、マスク、太さ）を復元する
 * @param {Array<*>} item - 描画アクションのデータ配列
 * [2]~[5]: RGBAカラー、[6]~[8]: マスクカラー、[9]: ブラシ幅、[10]: マスクタイプ
 */
Neo.ActionManager.prototype.getCurrent = function (item) {
  var oe = Neo.painter;

  oe._currentColor = [item[2], item[3], item[4], item[5]];
  oe._currentMask = [item[6], item[7], item[8]];
  oe._currentWidth = item[9];
  oe._currentMaskType = item[10];
};

Neo.ActionManager.prototype.skip = function () {
  for (var i = 0; i < this._items.length; i++) {
    if (this._items[i][0] == "restore") {
      this._head = i;
    }
  }
};

Neo.ActionManager.prototype.play = function () {
  if (Neo.viewerBar) Neo.viewerBar.update();

  if (this._pause) {
    console.log("suspend viewer");
    return;
  }

  if (this._head >= this._items.length || this._head >= this._mark) {
    Neo.painter.dirty = false;
    Neo.painter.busy = false;

    if (Neo.painter.busySkipped) {
      Neo.painter.busySkipped = false;
      console.log("animation skipped");
    } else {
      console.log("animation finished");
    }
    return;
  }

  var item = this._items[this._head];

  if (!Neo.viewer && !Neo.painter.busySkipped) {
    Neo.painter._pushUndo(
      0,
      0,
      Neo.painter.canvasWidth,
      Neo.painter.canvasHeight,
      true,
    );
  }

  if (Neo.viewer && Neo.viewerSpeed && this._index == 0) {
    Neo.viewerSpeed.update();
    //console.log("play", item[0], this._head + 1, this._items.length);
  }

  var func;
  // restoreが存在するかどうか判定
  //古いPCHファイルにはrestoreが存在しないためアニメーションをスキップできない
  const hasRestore = this._items.some(
    (/**@type {any}**/ item) => item[0] === "restore",
  );
  if (Neo.painter.busySkipped && hasRestore) {
    // アニメーションをスキップする時はrestoreのみを関数として扱う
    func =
      item[0] && /**@type {any}**/ (this)[item[0]] && item[0] === "restore"
        ? item[0]
        : "dummy";
  } else {
    // アニメーションを再生する時は全ての関数を実行する
    func = item[0] && /**@type {any}**/ (this)[item[0]] ? item[0] : "dummy";
  }

  const ref = this;
  var wait = this._prevSpeed < 0 ? 0 : this._prevSpeed;

  /**@type {any}*/ (this)[func](item, function (/**@type {any}*/ result) {
    if (result) {
      if (
        Neo.painter.busySkipped &&
        ref._head < ref._mark - 2 &&
        ref._mark - 2 >= 0 &&
        ref._items[ref._mark - 1][0] == "restore"
      ) {
        ref._head = ref._mark - 2;
      } else {
        ref._head++;
      }
      ref._index = 0;
      ref._prevSpeed = Neo.speed;
    }

    setTimeout(function () {
      Neo.painter._actionMgr.play();
    }, wait);
  });
};
/*
-------------------------------------------------------------------------
    Action
-------------------------------------------------------------------------
*/

Neo.ActionManager.prototype.clearCanvas = function () {
  if (typeof arguments[0] != "object") {
    this.push("clearCanvas");
  }

  var oe = Neo.painter;
  oe.canvasCtx[0].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.canvasCtx[1].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 画面を指定色で塗りつぶす（バケツツール）。
 * @param {*} layer - レイヤー番号、または録画データ配列
 * @param {*} [x] - X座標、または再生用コールバック
 * @param {*} [y] - Y座標
 * @param {*} [color] - 塗りつぶし色
 */
Neo.ActionManager.prototype.floodFill = function (layer, x, y, color) {
  if (typeof layer != "object") {
    this.push("floodFill", layer, x, y, color);
  } else {
    var item = layer;
    layer = item[1];
    x = item[2];
    y = item[3];
    color = item[4];
  }

  var oe = Neo.painter;
  oe.doFloodFill(layer, x, y, color);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.eraseAll = function () {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("eraseAll", layer);
  } else {
    var item = arguments[0];
    layer = item[1];
  }

  var oe = Neo.painter;
  oe.canvasCtx[layer].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};
/**
 * 手書き線の描画アクション 等速
 * @param {number|Array<*>} x0 - 開始X座標、または一括描画するアクションデータ配列(item)
 * @param {number|null} [y0] - 開始Y座標
 * @param {number|null} [lineType] - 線の種類
 */
Neo.ActionManager.prototype.freeHand = function (x0, y0, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x0 = Number(x0);
    y0 = Number(y0);
    lineType = Number(lineType);

    this.push("freeHand", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x0, y0);

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x0, y0, lineType);
  } else if (!Neo.viewer || this._prevSpeed <= 0) {
    this.freeHandFast(arguments[0], arguments[1]);
  } else {
    var item = arguments[0];

    const layer = item[1];
    const lineType = item[11];
    this.getCurrent(item);

    var i = this._index;
    if (i == 0) {
      i = 12;
    } else {
      i += 2;
    }

    const x1 = item[i + 0];
    const y1 = item[i + 1];
    const x0 = item[i + 2];
    const y0 = item[i + 3];

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

    this._index = i;
    const result = i + 2 + 3 >= item.length;

    if (!result) {
      oe.prevLine = null;
    }

    var callback = arguments[1];
    if (callback && typeof callback == "function") {
      callback(result);
    }
  }
};

/**
 * 手書き線の描画アクション 高速
 * @param {number|Array<*>} x0 - 開始X座標、または一括描画するアクションデータ配列(item)
 * @param {number|null} [y0] - 開始Y座標
 * @param {number|null} [lineType] - 線の種類
 */
Neo.ActionManager.prototype.freeHandFast = function (x0, y0, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x0 = Number(x0);
    y0 = Number(y0);
    lineType = Number(lineType);

    this.push("freeHand", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x0, y0);

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x0, y0, lineType);
  } else {
    let x0, y0, x1, y1, lineType;

    var item = arguments[0];
    var length = item.length;

    layer = item[1];
    this.getCurrent(item);

    lineType = item[11];
    x0 = item[12];
    y0 = item[13];

    for (var i = 14; i + 1 < length; i += 2) {
      x1 = x0;
      y1 = y0;
      x0 = item[i + 0];
      y0 = item[i + 1];
      oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
    }
    oe.prevLine = null;
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
  }

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * フリーハンド
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} lineType
 */
Neo.ActionManager.prototype.freeHandMove = function (x0, y0, x1, y1, lineType) {
  if (arguments.length > 1) {
    var oe = Neo.painter;
    var layer = oe.current;
    var head = this._items[this._head - 1];
    if (head && head.length == 0) {
      this.push("freeHand", layer);
      this.pushCurrent();
      this.push(lineType, x1, y1, x0, y0);
    } else if (Neo.isAnimation) {
      head.push(x0, y0);

      // 記録漏れがないか確認
      var x = head[head.length - 4];
      var y = head[head.length - 3];
      if (
        x1 != head[head.length - 4] ||
        y1 != head[head.length - 3] ||
        lineType != head[11]
      ) {
        console.log("eror in freeHandMove?", x, y, lineType, head);
      }
    }
    oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
  } else {
    console.log("error in freeHandMove: called from recorder", head);
  }
};

/**
 * 直線描画
 * @param {number|Array<*>} x0 - 始点X座標、または描画データ配列
 * @param {number|null} [y0] - 始点Y座標、またはコールバック関数
 * @param {number|null} [x1] - 終点X座標
 * @param {number|null} [y1] - 終点Y座標
 * @param {number|null} [lineType] - 線の種類
 */
Neo.ActionManager.prototype.line = function (x0, y0, x1, y1, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;
  if (typeof arguments[0] != "object") {
    x0 = Number(x0);
    y0 = Number(y0);
    x1 = Number(x1);
    y1 = Number(y1);
    lineType = Number(lineType);

    this.push("line", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x1, y1);

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
  } else {
    //描き手順のObjectが渡された場合は、描画データを展開する
    const item = arguments[0];

    const layer = item[1];
    this.getCurrent(item);

    const lineType = item[11];
    const x0 = item[12];
    const y0 = item[13];
    let x1 = item[14];
    let y1 = item[15];
    if (x1 === null) x1 = x0;
    if (y1 === null) y1 = y0;

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * ベジェ曲線描画
 * @param {number|Array<*>} x0 - 始点X座標、または描画データ配列
 * @param {number|null} [y0] - 始点Y座標、またはコールバック関数
 * @param {number|null} [x1] - 制御点1 X座標
 * @param {number|null} [y1] - 制御点1 Y座標
 * @param {number|null} [x2] - 制御点2 X座標
 * @param {number|null} [y2] - 制御点2 Y座標
 * @param {number|null} [x3] - 終点X座標
 * @param {number|null} [y3] - 終点Y座標
 * @param {number} [lineType] - 線の種類
 */
Neo.ActionManager.prototype.bezier = function (
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  lineType,
) {
  var oe = Neo.painter;
  var layer = oe.current;
  var isReplay = true;

  if (typeof arguments[0] != "object") {
    x0 = Number(x0);
    y0 = Number(y0);
    x1 = Number(x1);
    y1 = Number(y1);
    x2 = Number(x2);
    y2 = Number(y2);
    x3 = Number(x3);
    y3 = Number(y3);
    lineType = Number(lineType);
    this.push("bezier", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x1, y1, x2, y2, x3, y3);
    isReplay = false;
    oe.drawBezier(
      oe.canvasCtx[layer],
      x0,
      y0,
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      lineType,
      isReplay,
    );
  } else {
    const item = arguments[0];
    const layer = item[1];
    this.getCurrent(item);

    const lineType = item[11];
    const x0 = item[12];
    const y0 = item[13];
    const x1 = item[14];
    const y1 = item[15];
    const x2 = item[16];
    const y2 = item[17];
    const x3 = item[18];
    const y3 = item[19];
    oe.drawBezier(
      oe.canvasCtx[layer],
      x0,
      y0,
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      lineType,
      isReplay,
    );
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 塗り潰し
 * @param {number|Array<*>} x - 始点X座標、またはアクションデータ配列
 * @param {number|null} [y] - 始点Y座標、またはコールバック関数
 * @param {number|null} [width] - 矩形の幅
 * @param {number|null} [height] - 矩形の高さ
 * @param {number|null} [type] - 塗りつぶしの種類(四角楕円など)
 */
Neo.ActionManager.prototype.fill = function (x, y, width, height, type) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);
    type = Number(type);

    this.push("fill", layer);
    this.pushCurrent();
    this.push(x, y, width, height, type);
    oe.doFill(layer, x, y, width, height, type);
  } else {
    const item = arguments[0];
    const layer = item[1];
    this.getCurrent(item);

    const x = item[11];
    const y = item[12];
    const width = item[13];
    const height = item[14];
    const type = item[15];

    oe.doFill(layer, x, y, width, height, type);
  }

  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 左右反転
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 反転する幅
 * @param {number} [height] - 反転する高さ
 */
Neo.ActionManager.prototype.flipH = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("flipH", layer, x, y, width, height);
    oe.flipH(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.flipH(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 上下反転
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 反転する幅
 * @param {number} [height] - 反転する高さ
 */
Neo.ActionManager.prototype.flipV = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("flipV", layer, x, y, width, height);
    oe.flipV(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.flipV(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * レイヤー結合
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 結合する幅
 * @param {number} [height] - 結合する高さ
 */
Neo.ActionManager.prototype.merge = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("merge", layer, x, y, width, height);
    oe.merge(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.merge(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形ぼかし
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - ぼかす範囲の幅
 * @param {number} [height] - ぼかす範囲の高さ
 */
Neo.ActionManager.prototype.blurRect = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("blurRect", layer, x, y, width, height);
    oe.blurRect(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.blurRect(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形消去
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 消去する幅
 * @param {number} [height] - 消去する高さ
 */
Neo.ActionManager.prototype.eraseRect2 = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("eraseRect2", layer);
    this.pushCurrent();
    this.push(x, y, width, height);
    oe.eraseRect(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    this.getCurrent(item);

    const x = item[11];
    const y = item[12];
    const width = item[13];
    const height = item[14];
    oe.eraseRect(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形消去
 * @deprecated 現在はeraseRect2 が使用されているため、この関数は未使用
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 消去する幅
 * @param {number} [height] - 消去する高さ
 */
Neo.ActionManager.prototype.eraseRect = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("eraseRect", layer, x, y, width, height);
    oe.eraseRect(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.eraseRect(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形コピー
 * @description 指定された範囲の画像をコピーし、oe.tool にその座標とサイズを記憶する。
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - コピーする幅
 * @param {number} [height] - コピーする高さ
 */
Neo.ActionManager.prototype.copy = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("copy", layer, x, y, width, height);
    oe.copy(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.copy(layer, x, y, width, height);
  }

  oe.tool.x = x;
  oe.tool.y = y;
  oe.tool.width = width;
  oe.tool.height = height;
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形ペースト
 * @param {number|Array<*>} x - コピー元の開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - コピー元の開始Y座標、またはコールバック関数
 * @param {number} [width] - ペーストする幅
 * @param {number} [height] - ペーストする高さ
 * @param {number} [dx] - 貼り付け先のX座標
 * @param {number} [dy] - 貼り付け先のY座標
 */
Neo.ActionManager.prototype.paste = function (x, y, width, height, dx, dy) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);
    dx = Number(dx);
    dy = Number(dy);

    this.push("paste", layer, x, y, width, height, dx, dy);
    oe.paste(layer, x, y, width, height, dx, dy);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    const dx = item[6];
    const dy = item[7];
    oe.paste(layer, x, y, width, height, dx, dy);
  }

  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * 矩形傾け
 * @description ツールバーの「傾け」ボタンに対応する、指定範囲を90度回転させる処理。
 * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
 * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
 * @param {number} [width] - 変形する範囲の幅
 * @param {number} [height] - 変形する範囲の高さ
 */
Neo.ActionManager.prototype.turn = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);

    this.push("turn", layer, x, y, width, height);
    oe.turn(layer, x, y, width, height);
  } else {
    const item = arguments[0];
    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const width = item[4];
    const height = item[5];
    oe.turn(layer, x, y, width, height);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/**
 * テキストツールによる描画処理
 * @param {Object|number} x - 描画データ配列、またはX座標
 * @param {number|function} [y] - Y座標、またはコールバック関数
 * @param {number} [color] - 色ID
 * @param {number} [alpha] - 不透明度
 * @param {string} [string] - 入力された文字列
 * @param {string} [size] - フォントサイズ 16pxのように単位まで指定する
 * @param {string} [family] - フォントファミリー
 */
Neo.ActionManager.prototype.text = function (
  x,
  y,
  color,
  alpha,
  string,
  size,
  family,
) {
  string = String(string);
  size = String(size);
  family = String(family);

  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    const numX = Number(x);
    const numY = Number(y);
    const numColor = Number(color);
    const numAlpha = Number(alpha);

    this.push(
      "text",
      layer,
      numX,
      numY,
      numColor,
      numAlpha,
      string,
      size,
      family,
    );
    oe.doText(layer, numX, numY, numColor, numAlpha, string, size, family);
  } else {
    const item = arguments[0];

    const layer = item[1];
    const x = item[2];
    const y = item[3];
    const color = item[4];
    const alpha = item[5];
    const string = item[6];
    const size = item[7];
    const family = item[8];

    oe.doText(layer, x, y, color, alpha, string, size, family);
  }
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.restore = function () {
  var oe = Neo.painter;
  var width = oe.canvasWidth;
  var height = oe.canvasHeight;

  if (typeof arguments[0] != "object") {
    this.push("restore");

    const _img0 = oe.canvas[0].toDataURL("image/png");
    const _img1 = oe.canvas[1].toDataURL("image/png");
    this.push(_img0, _img1);
  } else {
    var item = arguments[0];
    var callback = arguments[1];

    const img0 = new Image();
    const img1 = new Image();
    img0.onload = function () {
      img1.onload = function () {
        oe.canvasCtx[0].clearRect(0, 0, width, height);
        oe.canvasCtx[1].clearRect(0, 0, width, height);
        oe.canvasCtx[0].drawImage(img0, 0, 0);
        oe.canvasCtx[1].drawImage(img1, 0, 0);
        oe.updateDestCanvas(0, 0, width, height);

        if (callback && typeof callback == "function") callback(true);
      };
      img1.src = item[2];
    };
    img0.src = item[1];
  }
};

Neo.ActionManager.prototype.dummy = function () {
  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

/*
  -----------------------------------------------------------------------
    動画表示モード
  -----------------------------------------------------------------------
*/
/**@param {HTMLElement} applet */
Neo.createViewer = function (applet) {
  var neo = document.createElement("div");
  neo.className = "NEO";
  neo.id = "NEO";

  var html =
    '<div id="neo-pageView" style="margin:auto;">' +
    '<div id="neo-container" style="visibility:visible;" class="o">' +
    '<div id="neo-painter" style="background-color:white;">' +
    '<div id="neo-canvas" style="background-color:white;">' +
    "</div>" +
    "</div>" +
    '<div id="neo-viewerButtonsWrapper" style="display:block;">' +
    '<div id="neo-viewerButtons" style="display:block;">' +
    '<div id="neo-viewerPlay"></div>' +
    '<div id="neo-viewerStop"></div>' +
    '<div id="neo-viewerRewind"></div>' +
    '<div id="neo-viewerSpeed" style="padding-left:2px; margin-top: 1px;"></div>' +
    '<div id="neo-viewerPlus"></div>' +
    '<div id="neo-viewerMinus"></div>' +
    '<div id="neo-viewerBar" style="display:inline-block;">' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  neo.innerHTML = html.replace(/\[(.*?)\]/g, function (match, str) {
    return Neo.translate(str);
  });

  var parent = applet.parentNode;
  parent?.appendChild(neo);
  parent?.insertBefore(neo, applet);

  // applet.style.display = "none";

  // NEOを組み込んだURLをアプリ版で開くとDOMツリーが2重にできて格好悪いので消しておく
  setTimeout(function () {
    /** @type {NodeListOf<HTMLElement>} */
    const tmp = document.querySelectorAll(".NEO");

    if (tmp.length > 1) {
      for (var i = 1; i < tmp.length; i++) {
        tmp[i].style.display = "none";
      }
    }
  }, 0);
};

/**
 * ビューアの初期化処理
 * @description
 * アプレットのDOM構成、スタイルの適用、キャンバスの生成、
 * および操作イベントのリスナー登録を行う。
 * @param {Object} [pch] - PCHファイルデータ（あれば再生を開始する）
 * @param {Array<*>} [pch.data] - 再生用アクションデータ
 */
Neo.initViewer = function (pch) {
  const pageview = document.getElementById("neo-pageView");
  if (!pageview) return;
  var pageWidth = Neo.config.applet_width;
  var pageHeight = Neo.config.applet_height;
  pageview.style.width = pageWidth + "px";
  pageview.style.height = pageHeight + "px";

  Neo.canvas = document.getElementById("neo-canvas");
  if (!Neo.canvas) {
    console.error("initViewer: Canvas element not found");
    return;
  }
  Neo.container = document.getElementById("neo-container");
  if (!Neo.container) {
    console.error("initViewer: Container element not found");
    return;
  }
  Neo.container.style.backgroundColor = Neo.config.color_back;
  Neo.container.style.border = "0";

  var dx = (pageWidth - Neo.config.width) / 2;
  var dy = (pageHeight - Neo.config.height - 26) / 2;

  var painter = document.getElementById("neo-painter");

  const viewerWrapperOnTop =
    Neo.config.neo_viewer_buttonswrapper_top &&
    window.innerHeight < pageHeight + 100;
  if (painter) {
    painter.style.marginTop = "0";
    painter.style.position = "absolute";
    painter.style.padding = "0";
    painter.style.bottom = viewerWrapperOnTop ? "0" : dy + 26 + "px";
    painter.style.left = dx + "px";
  }

  var viewerButtonsWrapper = document.getElementById(
    "neo-viewerButtonsWrapper",
  );
  if (viewerButtonsWrapper) {
    viewerButtonsWrapper.style.width = pageWidth - 2 + "px";
    viewerButtonsWrapper.style.position = viewerWrapperOnTop ? "absolute" : "";
    viewerButtonsWrapper.style.top = viewerWrapperOnTop ? "0" : "";
  }

  var viewerBar = document.getElementById("neo-viewerBar");
  if (viewerBar) {
    viewerBar.style.position = "absolute";
    viewerBar.style.right = "2px";
    viewerBar.style.top = "1px";
    viewerBar.style.width = pageWidth - 24 * 6 - 2 + "px";
  }

  Neo.canvas.style.width = Neo.config.width + "px";
  Neo.canvas.style.height = Neo.config.height + "px";

  Neo.painter = new Neo.Painter();
  Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);

  Neo.container.oncontextmenu = function () {
    return false;
  };

  Neo.painter._actionMgr.isMouseDown = false;
  painter?.addEventListener(
    "pointerdown",
    function () {
      Neo.painter._actionMgr.isMouseDown = true;
    },
    false,
  );
  painter?.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false, capture: false },
  );

  document.addEventListener(
    "pointermove",
    function (e) {
      e.preventDefault();
      if (Neo.painter._actionMgr.isMouseDown) {
        var zoom = Neo.painter.zoom;
        var x = Neo.painter.zoomX - e.movementX / zoom;
        var y = Neo.painter.zoomY - e.movementY / zoom;
        Neo.painter.setZoomPosition(x, y);
      }
    },
    { passive: false, capture: false },
  );
  document.addEventListener(
    "pointerup",
    function () {
      Neo.painter._actionMgr.isMouseDown = false;
      if (Neo.viewerBar) {
        Neo.viewerBar.isMouseDown = false;
      }
    },
    false,
  );

  if (pch && pch.data && pch.data.length > 0) {
    //Neo.config.pch_file) {
    Neo.painter._actionMgr._items = pch.data;
    Neo.startViewer();
    setTimeout(() => {
      Neo.painter.play();
    }, 50);
  }
};
/**
 * PCHビューアの起動と環境構築
 * @description
 * 1. 古いアプレット要素の破棄とDOM移行。
 * 2. 設定値(Neo.config)に基づくCSSルールの動的生成。
 * 3. プレイヤーコントロール(ボタン類)の生成と機能バインディング。
 */
Neo.startViewer = function () {
  if (Neo.applet) {
    var name = Neo.applet.getAttribute("name") || "pch";
    if (!(/** @type {any} */ (document)[name]))
      /** @type {any} */ (document)[name] = Neo;
    if (Neo.applet.parentNode) {
      Neo.applet.parentNode.removeChild(Neo.applet);
    }
  }

  Neo.styleSheet = Neo.getStyleSheet();
  var lightBack = Neo.multColor(Neo.config.color_back, 1.3);
  var darkBack = Neo.multColor(Neo.config.color_back, 0.7);

  Neo.addRule(".NEO #neo-viewerButtons", "color", Neo.config.color_text);
  Neo.addRule(
    ".NEO #neo-viewerButtons",
    "background-color",
    Neo.config.color_back,
  );

  Neo.addRule(
    ".NEO #neo-viewerButtonsWrapper",
    "border",
    "1px solid " + Neo.config.color_frame + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons",
    "border",
    "1px solid " + Neo.config.color_back + " !important",
  );
  Neo.addRule(
    ".NEO #neo-viewerButtons",
    "border-left",
    "1px solid " + lightBack + " !important",
  );
  Neo.addRule(
    ".NEO #neo-viewerButtons",
    "border-top",
    "1px solid " + lightBack + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOff",
    "background-color",
    Neo.config.color_icon + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOff:active",
    "background-color",
    darkBack + " !important",
  );
  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOn",
    "background-color",
    darkBack + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons >div",
    "border",
    "1px solid " + Neo.config.color_frame + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOff:hover",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOff:active",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important",
  );
  Neo.addRule(
    ".NEO #neo-viewerButtons >div.buttonOn",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important",
  );

  Neo.addRule(
    ".NEO #neo-viewerBar >div",
    "background-color",
    Neo.config.color_bar,
  );
  //  Neo.addRule(".NEO #neo-viewerBar:active", "background-color", darkBack);
  Neo.addRule(
    ".NEO #neo-viewerBarMark",
    "background-color",
    Neo.config.color_text + " !important",
  );

  setTimeout(function () {
    Neo.viewerPlay = new Neo.ViewerButton().init("neo-viewerPlay");
    if (!Neo.viewerPlay) {
      console.error("startViewer: ViewerPlay not found");
      return;
    }
    Neo.viewerPlay.setSelected(true);
    Neo.viewerPlay.onmouseup = function () {
      Neo.painter.onplay();
    };
    Neo.viewerStop = new Neo.ViewerButton().init("neo-viewerStop");
    if (!Neo.viewerStop) {
      console.error("startViewer: ViewerStop not found");
      return;
    }

    Neo.viewerStop.onmouseup = function () {
      Neo.painter.onstop();
    };
    Neo.viewerSpeed = new Neo.ViewerButton().init("neo-viewerSpeed");
    if (!Neo.viewerSpeed) {
      console.error("startViewer: ViewerSpeed not found");
      return;
    }

    Neo.viewerSpeed.onmouseup = function () {
      Neo.painter.onspeed();
      this.update();
    };
    const neo_viewerRewind = new Neo.ViewerButton().init("neo-viewerRewind");
    if (neo_viewerRewind) {
      neo_viewerRewind.onmouseup = function () {
        Neo.painter.onrewind();
      };
    }
    const neo_viewerPlus = new Neo.ViewerButton().init("neo-viewerPlus");
    if (neo_viewerPlus) {
      neo_viewerPlus.onmouseup = function () {
        new Neo.ZoomPlusCommand(Neo.painter).execute();
      };
    }
    const neo_viewerMinus = new Neo.ViewerButton().init("neo-viewerMinus");
    if (neo_viewerMinus) {
      neo_viewerMinus.onmouseup = function () {
        new Neo.ZoomMinusCommand(Neo.painter).execute();
      };
    }

    var length = Neo.painter._actionMgr._items.length;
    Neo.viewerBar = new Neo.ViewerBar().init("neo-viewerBar", {
      length: length,
    });
  }, 0);
};

Neo.getFilename = function () {
  return Neo.config.pch_file || Neo.config.image_canvas;
};

/**
 * PCHファイルを非同期で取得し、デコードする。
 * @description
 * 読み込み失敗時はコンソールにエラーを出力し、処理を終了する。
 * @param {string} filename - 対象のPCHファイルパス
 * @param {function({data: any[][], width: number, height: number}):void} callback - デコードされたPCHデータを受け取るコールバック
 */
Neo.getPCH = function (filename, callback) {
  if (!filename || filename.slice(-4).toLowerCase() != ".pch") return null;

  fetch(filename)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      var pch = Neo.decodePCH(buffer);
      if (pch) {
        if (callback) callback(pch);
      } else {
        console.log("not a NEO animation");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * PCHファイルのバイナリデータをデコードし、構造化されたオブジェクトに変換する。
 * * @typedef {Object} PCHData
 * @property {number} width - キャンバスの横幅
 * @property {number} height - キャンバスの高さ
 * @property {Array<any>} data - 描画命令の配列（fixPCH適用済み）
 * * @param {ArrayBuffer} rawdata - fetchで取得した生のバイナリデータ
 * @returns {PCHData|null} デコード成功時はオブジェクト、失敗時はnullを返す
 * * @example
 */
Neo.decodePCH = function (rawdata) {
  var byteArray = new Uint8Array(rawdata);
  var data = LZString.decompressFromUint8Array(byteArray.subarray(12));
  var header = byteArray.subarray(0, 12);
  if (!data) {
    throw new Error("Failed to decompress data");
  }
  if (
    header[0] == "N".charCodeAt(0) &&
    header[1] == "E".charCodeAt(0) &&
    header[2] == "O".charCodeAt(0)
  ) {
    var width = header[4] + header[5] * 0x100;
    var height = header[6] + header[7] * 0x100;
    var items = Neo.fixPCH(JSON.parse(data));
    return {
      width: width,
      height: height,
      data: items,
    };
  } else {
    return null;
  }
};

/**
 * PCHデータの描画命令配列を修正し、不正なコマンドを解消する。
 * @description
 * 描画命令の中に 'eraseAll' が混入している時は、独立した要素として分割し再配置する。
 * @param {Array<string>} items - 復元された描画命令の配列
 * @returns {Array<string>} 修正済みの描画命令配列
 */
Neo.fixPCH = function (items) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    var index = item.indexOf("eraseAll");
    if (index > 0) {
      var tmp = item.slice(index);
      var tmp2 = item.slice(0, index);
      console.log("fix eraseAll", tmp2, tmp);

      items[i] = tmp2;
      items.splice(i, 0, tmp);
    }
  }
  return items;
};

/*
  -----------------------------------------------------------------------
    LiveConnect
  -----------------------------------------------------------------------
*/

Neo.playPCH = function () {
  Neo.painter.onplay();
};

Neo.suspendDraw = function () {
  Neo.painter.onstop();
};

/** @param {number} value */
Neo.setSpeed = function (value) {
  Neo.speed = value;
};

/**
 * レイヤー可視性
 * @param {number} layer - 対象となるレイヤーのインデックス
 * @param {number|boolean} value - 表示状態（0またはfalseで非表示、それ以外で表示）
 */
Neo.setVisit = function (layer, value) {
  Neo.painter.visible[layer] = value == 0 ? false : true;
  Neo.painter.updateDestCanvas(
    0,
    0,
    Neo.painter.canvasWidth,
    Neo.painter.canvasHeight,
  );
};

/**
 * @param {number} value
 */
Neo.setMark = function (value) {
  Neo.painter._actionMgr._mark = value;
  Neo.painter.onmark();
};

Neo.getSeek = function () {
  return Neo.painter._actionMgr._head;
};

Neo.getLineCount = function () {
  return Neo.painter._actionMgr._items.length;
};

"use strict";
//@ts-check
/**
 * @param {MouseEvent|TouchEvent} e
 */
Neo.getModifier = function (e) {
  if (e.shiftKey) {
    return "shift";
  } else if (
    (e instanceof MouseEvent && e.button == 2) ||
    e.ctrlKey ||
    e.altKey ||
    Neo.painter.virtualRight
  ) {
    return "right";
  }
  return null;
};

/*
  -------------------------------------------------------------------------
    Button
  -------------------------------------------------------------------------
*/

Neo.Button = class {
  constructor() {
    /**@type {HTMLElement|null} */
    this.element = null;
    /** @type {any} */
    this.params = null;
    this.elementID = "";
    this.selected = false;
    this.isMouseDown = false;
    /** @param {number} wait */
    this.disable = function (wait) {};
    this.enable = function () {};

    /** @type {((Button: Neo.Button) => void) | null} */
    this.onmousedown = null;
    /** @type {((Button: Neo.Button) => void) | null} */
    this.onmouseup = null;
    /** @type {((Button: Neo.Button) => void) | null} */
    this.onmouseover = null;
    /** @type {((Button: Neo.Button) => void) | null} */
    this.onmouseout = null;
  }
};
/**
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.Button|null}
 */
Neo.Button.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.selected = false;
  this.isMouseDown = false;

  var ref = this;
  if (this.element) {
    /** @param {MouseEvent} e */
    this.element.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseup = function (e) {
      ref._mouseUpHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseover = function (e) {
      ref._mouseOverHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseout = function (e) {
      ref._mouseOutHandler(e);
    };
    this.element.addEventListener(
      "touchstart",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseDownHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );
    this.element.addEventListener(
      "touchend",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseUpHandler(e);
      },
      { passive: false, capture: true },
    );

    this.element.className = "buttonOff";
  }

  /**
   * @param {number} wait
   */
  this.disable = function (wait) {
    if (this.element) {
      this.element.style.pointerEvents = "none";
      this.element.style.opacity = "0.5";
    }
    if (wait) {
      setTimeout(function () {
        ref.enable();
      }, wait);
    }
  };

  this.enable = function () {
    if (this.element) {
      this.element.style.pointerEvents = "inherit";
      this.element.style.opacity = "1.0";
    }
  };
  return this;
};
/**
 * @param {MouseEvent|TouchEvent} e
 */
Neo.Button.prototype._mouseDownHandler = function (e) {
  if (Neo.painter.isUIPaused()) return;
  this.isMouseDown = true;

  if (this.params.type == "fill" && this.selected == false) {
    for (let i = 0; i < Neo.toolButtons.length; i++) {
      /** @type {any} */
      const toolTip = Neo.toolButtons[i];
      toolTip.setSelected(this.selected ? false : true);
    }
    Neo.painter.setToolByType(Neo.Painter.TOOLTYPE_FILL);
  }

  if (this.onmousedown) this.onmousedown(this);
};
/** @param {MouseEvent|TouchEvent} e */
Neo.Button.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;

    if (this.onmouseup) this.onmouseup(this);
  }
};
/** @param {MouseEvent} e */
Neo.Button.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
/** @param {MouseEvent} e */
Neo.Button.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};
/**
 * @param {boolean} selected
 */
Neo.Button.prototype.setSelected = function (selected) {
  if (this.element) {
    if (selected) {
      this.element.className = "buttonOn";
    } else {
      this.element.className = "buttonOff";
    }
  }
  this.selected = selected;
};

Neo.Button.prototype.update = function () {};

/*
  -------------------------------------------------------------------------
    Right Button
  -------------------------------------------------------------------------
*/

Neo.RightButton = class extends Neo.Button {
  constructor() {
    super();
    /** @type {any} */
    this.params = null;
    /**@type {HTMLElement|null} */
    this.element = null;
    this.selected = false;
  }
};
/**
 * @param {string} elementID
 * @param {Object} [params]
 * @return {Neo.RightButton|null}
 */
Neo.RightButton.prototype.init = function (elementID, params = {}) {
  Neo.Button.prototype.init.call(this, elementID, params);
  this.params.type = "right";
  return this;
};

/** @param {MouseEvent|TouchEvent} e */
Neo.RightButton.prototype._mouseDownHandler = function (e) {};

/** @param {MouseEvent|TouchEvent} e */
Neo.RightButton.prototype._mouseUpHandler = function (e) {
  this.setSelected(!this.selected);
};

/** @param {MouseEvent} e */
Neo.RightButton.prototype._mouseOutHandler = function (e) {};

/**
 * @param {boolean} selected
 */
Neo.RightButton.prototype.setSelected = function (selected) {
  if (this.element) {
    if (selected) {
      this.element.className = "buttonOn";
      Neo.painter.virtualRight = true;
    } else {
      this.element.className = "buttonOff";
      Neo.painter.virtualRight = false;
    }
  }
  this.selected = selected;
};

Neo.RightButton.clear = function () {
  const right = Neo.rightButton;
  right?.setSelected(false);
};

/*
  -------------------------------------------------------------------------
    Fill Button
  -------------------------------------------------------------------------
*/

Neo.FillButton = class extends Neo.Button {
  constructor() {
    super();
  }
};

/**
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.FillButton|null}
 */
Neo.FillButton.prototype.init = function (elementID, params = {}) {
  Neo.Button.prototype.init.call(this, elementID, params);
  this.params.type = "fill";
  return this;
};

/*
  -------------------------------------------------------------------------
    ColorTip
  -------------------------------------------------------------------------
*/

Neo.ColorTip = class {
  constructor() {
    /**@type {HTMLElement|null} */
    this.element = null;
    /** @type {any} */
    this.params = null;
    this.elementID = "";
    this.selected = false;
    this.isMouseDown = false;
    this.color = "";
    /** @type {((ColorTip: Neo.ColorTip) => void) | null} */
    this.onmousedown = null;
    /** @type {((ColorTip: Neo.ColorTip) => void) | null} */
    this.onmouseup = null;
    /** @type {((ColorTip: Neo.ColorTip) => void) | null} */
    this.onmouseover = null;
    /** @type {((ColorTip: Neo.ColorTip) => void) | null} */
    this.onmouseout = null;
  }
};
/** @typedef {Neo.ColorTip} ColorTip */
/** @type {ColorTip[]} */
Neo.colorTips = [];

/**
 * @param {string} elementID
 * @param {any} [params]
 */
Neo.ColorTip.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;

  this.selected = this.elementID == "neo-color1" ? true : false;
  this.isMouseDown = false;

  var ref = this;
  if (this.element) {
    /** @param {MouseEvent} e */
    this.element.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseup = function (e) {
      ref._mouseUpHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseover = function (e) {
      ref._mouseOverHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseout = function (e) {
      ref._mouseOutHandler(e);
    };
    this.element.addEventListener(
      "touchstart",
      /** @param {TouchEvent} e */
      function (e) {
        ref._mouseDownHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );
    this.element.addEventListener(
      "touchend",
      /** @param {TouchEvent} e */
      function (e) {
        ref._mouseUpHandler(e);
      },
      true,
    );

    this.element.className = "colorTipOff";

    var index = parseInt(this.elementID.slice(9)) - 1; // "neo-color"なので9文字目
    this.element.style.left = index % 2 ? "0px" : "26px";
    this.element.style.top = Math.floor(index / 2) * 21 + "px";

    // base64 ColorTip.png
    this.element.innerHTML =
      "<img style='max-width:44px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAASCAYAAAAg9DzcAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVRIx+3OAQkAMADDsO3+Pe8qCj+0Akq6bQFqS2wTCpwE+R4IiyVYsGDBggULfirBgn8HX7BzCRwDx1QeAAAAAElFTkSuQmCC' />";
  }
  this.setColor(Neo.config.colors[params.index - 1]);

  this.setSelected(this.selected);
  Neo.colorTips.push(this);
};
/**
 * @param {MouseEvent|TouchEvent} e
 * @returns {void}
 */
Neo.ColorTip.prototype._mouseDownHandler = function (e) {
  if (Neo.painter.isUIPaused()) return;
  this.isMouseDown = true;

  for (var i = 0; i < Neo.colorTips.length; i++) {
    var colorTip = Neo.colorTips[i];
    if (this == colorTip) {
      switch (Neo.getModifier(e)) {
        case "shift":
          this.setColor(Neo.config.colors[this.params.index - 1]);
          break;
        case "right":
          this.setColor(Neo.painter.foregroundColor);
          break;
      }

      //          if (e.shiftKey) {
      //              this.setColor(Neo.config.colors[this.params.index - 1]);
      //          } else if (e.button == 2 || e.ctrlKey || e.altKey ||
      //                     Neo.painter.virtualRight) {
      //              this.setColor(Neo.painter.foregroundColor);
      //          }
    }
    colorTip.setSelected(this == colorTip) ? true : false;
  }
  Neo.painter.setColor(this.color);
  Neo.updateUIColor(true, false);

  if (this.onmousedown) this.onmousedown(this);
};
/**
 * @param {MouseEvent|TouchEvent} e
 * @returns {void}
 */
Neo.ColorTip.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseup) this.onmouseup(this);
  }
};
/** @param {MouseEvent} e */
Neo.ColorTip.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
/** @param {MouseEvent} e */
Neo.ColorTip.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};

/**
 * @param {boolean} selected
 */
Neo.ColorTip.prototype.setSelected = function (selected) {
  if (!this.element) {
    console.error("setSelected: Element not found");
    return null;
  }

  if (selected) {
    this.element.className = "colorTipOn";
  } else {
    this.element.className = "colorTipOff";
  }
  this.selected = selected;
};
/**
 * カラーチップに色をセット
 * @param {string} color
 * @returns
 */
Neo.ColorTip.prototype.setColor = function (color) {
  if (!this.element) {
    console.error("setColor: Element not found");
    return null;
  }

  this.color = color;
  this.element.style.backgroundColor = color;
};

Neo.ColorTip.getCurrent = function () {
  for (var i = 0; i < Neo.colorTips.length; i++) {
    var colorTip = Neo.colorTips[i];
    if (colorTip.selected) return colorTip;
  }
  return null;
};

/*
  -------------------------------------------------------------------------
    ToolTip
  -------------------------------------------------------------------------
*/

/** @type {object[]} */
Neo.toolButtons = [];

Neo.ToolTip = class {
  constructor() {
    /** @type {string[]} */
    this.toolStrings = [];
    /** @type {HTMLElement|null} */
    this.element = null;
    /** @type {any} */
    this.params = null;
    this.elementID = "";
    this.mode = 0;
    this.isMouseDown = false;
    /** @type {((ToolTip: Neo.ToolTip) => void) | null} */
    this.onmousedown = null;
    /** @type {((ToolTip: Neo.ToolTip) => void) | null} */
    this.onmouseup = null;
    /** @type {((ToolTip: Neo.ToolTip) => void) | null} */
    this.onmouseover = null;
    /** @type {((ToolTip: Neo.ToolTip) => void) | null} */
    this.onmouseout = null;
    this.selected = false;
    this.isTool = false;
    this.fixed = false;
  }
};

Neo.ToolTip.prototype.prevMode = -1;
/**@type {any} */
Neo.ToolTip.prototype.tools = [];
/**@type {any} */
Neo.ToolTip.prototype.toolIcons = [];
Neo.ToolTip.prototype.hasTintImage = false;

/** @type {HTMLCanvasElement|null} */
Neo.ToolTip.prototype.canvas = null;
/** @type {HTMLElement|null} */
Neo.ToolTip.prototype.label = null;

/**
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.ToolTip|null}
 */
Neo.ToolTip.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.mode = 0;

  this.isMouseDown = false;

  var ref = this;

  if (this.element) {
    this.params.type = this.element.id;
    /** @param {MouseEvent} e */
    this.element.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseup = function (e) {
      ref._mouseUpHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseover = function (e) {
      ref._mouseOverHandler(e);
    };
    /** @param {MouseEvent} e */
    this.element.onmouseout = function (e) {
      ref._mouseOutHandler(e);
    };
    this.element.addEventListener(
      "touchstart",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseDownHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );
    this.element.addEventListener(
      "touchend",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseUpHandler(e);
      },
      true,
    );
    // console.log("this.params.type", this.params.type);
    this.selected = this.params.type == "neo-pen" ? true : false;
    this.setSelected(this.selected);

    this.element.innerHTML =
      "<canvas width=46 height=18></canvas><div class='label'></div>";
    this.canvas = this.element.querySelector("canvas");
    this.label = this.element.querySelector("div");
  }
  this.update();
  return this;
};

/** @param {MouseEvent|TouchEvent} e */
Neo.ToolTip.prototype._mouseDownHandler = function (e) {
  this.isMouseDown = true;

  if (this.isTool) {
    if (this.selected == false) {
      for (let i = 0; i < Neo.toolButtons.length; i++) {
        /** @type {any} */
        const toolTip = Neo.toolButtons[i];
        toolTip.setSelected(this == toolTip ? true : false);
      }
    } else {
      var length = this.toolStrings.length;
      if (Neo.getModifier(e) == "right") {
        this.mode--;
        if (this.mode < 0) this.mode = length - 1;
      } else {
        this.mode++;
        if (this.mode >= length) this.mode = 0;
      }
    }
    Neo.painter.setToolByType(this.tools[this.mode]);
    this.update();
  }

  if (this.onmousedown) this.onmousedown(this);
};

/** @param {MouseEvent|TouchEvent} e */
Neo.ToolTip.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseup) this.onmouseup(this);
  }
};

/** @param {MouseEvent} e */
Neo.ToolTip.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
/** @param {MouseEvent} e */
Neo.ToolTip.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};
/**
 * @param {boolean} selected
 */
Neo.ToolTip.prototype.setSelected = function (selected) {
  if (!this.element) {
    console.error("setSelected: Element not found");
    return null;
  }

  if (this.fixed) {
    this.element.className = "toolTipFixed";
  } else {
    if (selected) {
      this.element.className = "toolTipOn";
    } else {
      this.element.className = "toolTipOff";
    }
  }
  this.selected = selected;
};

Neo.ToolTip.prototype.update = function () {};

/**
 * ツールチップのアイコンを描画し、必要に応じて色調補正（ティント）を施す。
 * 動作モードが変更された際には新たな画像を読み込み、
 * 変更がない場合は既存のキャンバスに対し色調のみを再適用し効率化を図る。
 *
 * @param {string|number} color - アイコンに適用すべき色彩。カラー文字列、またはNeo.painterで解釈可能な数値IDを指定する。
 */
Neo.ToolTip.prototype.draw = function (color) {
  if (this.hasTintImage) {
    const c =
      typeof color === "string" ? color : Neo.painter.getColorString(color);
    if (!this.canvas) {
      console.error("Canvas not found for ToolTip.");
      return;
    }
    /** @type {CanvasRenderingContext2D|null} */
    const ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) {
      console.error("Failed to get 2D context for ToolTip canvas.");
      return;
    }
    if (this.prevMode != this.mode) {
      this.prevMode = this.mode;

      var img = new Image();
      var ref = this;
      img.onload = function () {
        if (!ref.canvas) {
          console.error("Canvas not found for ToolTip on image load.");
          return;
        }
        ctx.clearRect(0, 0, ref.canvas.width, ref.canvas.height);
        ref.drawTintImage(ctx, img, c, 0, 0);
      };
      img.src = this.toolIcons[this.mode];
    } else {
      Neo.tintImage(ctx, c);
    }
  }
};
/**
 * 指定された座標へ画像を配置し、その上から特定の色調を合成する。
 * 画像の描画と、それに続く色調の適用という二段階の処理を担う。
 *
 * @param {CanvasRenderingContext2D} ctx - 描画先となる2Dレンダリングコンテキスト。
 * @param {HTMLImageElement} img - 描画対象のソース画像。
 * @param {string} c - 合成すべき色彩を表すカラー文字列。
 * @param {number} x - 描画始点のX座標。
 * @param {number} y - 描画始点のY座標。
 */
Neo.ToolTip.prototype.drawTintImage = function (ctx, img, c, x, y) {
  ctx.drawImage(img, x, y);
  Neo.tintImage(ctx, c);
};

Neo.ToolTip.bezier =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAT0lEQVRIx+3SQQoAIAhE0en+h7ZVEEKBZrX5b5sjKknAkRYpNslaMLPq44ZI9wwHs0vMQ/v87u0Kk8xfsaI242jbMdjPi5Y0r/zTAAAAD3UOjRf9jcO4sgAAAABJRU5ErkJggg==";
Neo.ToolTip.blur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAASUlEQVRIx+3VMQ4AIAgEQeD/f8bWWBnJYUh2SgtgK82G8/MhzVKwxOtTLgIUx6tDout4laiPIICA0Qj4bXxAy0+8LZP9yACAJwsqkggS55eiZgAAAABJRU5ErkJggg==";
Neo.ToolTip.blurrect =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAX0lEQVRIx+2XQQ4AEAwEt+I7/v+8Org6lJKt6NzLjjYE8DAKtLpYoDeCCCC7tYUd3ru2qQOzDTyndhJzB6KSAmxSgM0fAlGuzBnmlziqxB8jFJkUYJMCbAQYPxt2kF06fvYKgjPBO/IAAAAASUVORK5CYII=";
Neo.ToolTip.brush =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAQUlEQVRIx2NgGOKAEcb4z8CweRA4xpdUPSxofJ8BdP8WcjQxDaCDqQLQY4CsUBgFo2AUjIJRMApGwSgYBaNgZAIA0CoDwDbZu8oAAAAASUVORK5CYII=";
Neo.ToolTip.burn =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAPklEQVRIx+3PMRIAMAQAQbzM0/0sKZPeiDG57TQ4keH0Htx9VR+MCM1vOezl8xUsv4IAAkYjoBsB3QgAgL9tYXgF19rh9yoAAAAASUVORK5CYII=";
Neo.ToolTip.copy =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAW0lEQVRIx+2XMQoAIAwDU/E7/v95Orh2KMUSC7m5Qs6AUqAxG1gzOLirwxhgmXOjOlg1oQY8sjf2mvYNSICNBNhIgE3oH/jlzfdo34AE2EiATXsBA+5mww6S5QASDwSGMt8ouwAAAABJRU5ErkJggg==";
Neo.ToolTip.copy2 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAN0lEQVRIx+3PwQkAIBADwdPKt3MtQVCOPNz5B7JV0pNxOwRW9zng+G92n+hmQJoBaQakGSBJf9tyBgQUV/fKCAAAAABJRU5ErkJggg==";
Neo.ToolTip.ellipse =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAATklEQVRIx+2VMQ4AIAgD6/8fjbOJi1LFmt4OPQ0KIE7LNgggCBLbHkuFM9lM+Om+QwDjpksyb4tT86vlvzgEbYxefQPyv5D8HjDGGGOk6b3jJ+lYubd8AAAAAElFTkSuQmCC";
Neo.ToolTip.ellipsefill =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAVUlEQVRIx+2VURIAEAgFc/9D5waSHpV5+43ZHRMizRnRA1REARLHHq6NCFl01Nail+LeEDMgU34nYhlQQd6K+PsGKkSEZyArBPoK3Y6K/AOEEEJIayZHbhIKjkZrFwAAAABJRU5ErkJggg==";
Neo.ToolTip.eraser =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABQElEQVRIx+1WQY7CMAwcI37Cad+yXOgH4Gu8gAt9CtrDirfMHjZJbbcktVSpQnROSeMkY3vsFHhzSG3xfLpz/JVmG0mIqDkIMcc6+7Kejx6fdb0dq7w09rVFkrjejrMOunQ9vg7f/5QEIAd6E1Eo38WF8fF7n8sdALCrLerIzoFI4sI0Vtv1SYZ8CVbeF7tzF7JugIkVkxOauc6CIe8842S+XmMfsq7TN9LRTngZmTmVD4SrnzYaGYhFoxCWgajXuMjYGTuJ3dlwIBIN3U0cUVqLXCs5E7YeVsvAYJul5HWeLUhL3EpstQwooqoOTEHDOebpMn7ngkUsg3RotU8X1MkuVDrYohkIupC0YArX6T+PfX3kcbQLNV/iCKi6EB3xqXdAZ0JKthZ8B0QEl673NIEX/0I/z36Rf6ENGzZ8EP4A8Lp+9e9VWC4AAAAASUVORK5CYII=";
Neo.ToolTip.flip =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAZklEQVRIx+2XQQoAIAgE1+g7/f95degWHSyTTXDOhTsSiUBgOtCq8mD3DiOA3NxTCVgKaLA0qHiFOsHSnC8ELKQAmxRgE15APQfWv9pzLjwX+CXsjvBPKAXYpACb8AICzM2GHeSWAfVOCIiJuQ9tAAAAAElFTkSuQmCC";
Neo.ToolTip.freehand =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAdUlEQVRIx+2WUQrAMAhD3dj9r+y+VoSyLhYDynzQv1qiJlCR4hzeAhVRsiC3Jkj0c5hN7Lx7IQ9SphLE1ICdwko420purEWQuywN3pqxgcw2+WwAtU1GzoqiLZNwZBvMAIcO8y3YKUO8mkbmjPzjK9E0TUPjBoeyLAS0usjLAAAAAElFTkSuQmCC";
Neo.ToolTip.line =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAU0lEQVRIx+2UQQ4AIAjD8P+PxivRGDQC47C+oN1hIgTLQAt4qIga2c23XYAVPkm3CVhlb4ShAa/rQgMi1i0NyFg3LaBq3bAA1LpfAd7/EkIIIR2YXFYSCpWS8w8AAAAASUVORK5CYII=";
Neo.ToolTip.merge =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAW0lEQVRIx+2XQQrAQAgDx9Lv9JF9+e6h54IINlgyZ4UMOYgwmAXXmRxc3WECorJ3dAfrJtXAC7c6PPygAQuosYAaC6hJ3YHqlfyC8Q1YQI0F1IwXCHg+G3WQKhvwgwUFmFyYbwAAAABJRU5ErkJggg==";
Neo.ToolTip.pen =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAK0lEQVRIx+3OsQkAMAwDQXn/oe3WfSAEctd9I5TA32pHJ/3AoTpfAQCAGwaa5AICJLKWSQAAAABJRU5ErkJggg==";
Neo.ToolTip.rect =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAQElEQVRIx+3TMQ4AIAhD0WK8/5VxdcIYY8rw3wok7YAEr6iGKaU74BY0ro+6FKhyDHe4VxRwm6eFLn8AAADwwQIwTQgGo9ZMywAAAABJRU5ErkJggg==";
Neo.ToolTip.rectfill =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAANElEQVRIx+3PIQ4AIBADwcL//3xYBMEgLiQztmab0GvcxkqqO3ALPbbO7rBXDnRzAADgYwvqDwIMJlGb5QAAAABJRU5ErkJggg==";
Neo.ToolTip.text =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAcUlEQVRIx+2VwQ7AIAhDy7L//2V2WmIYg+ky2KEv8aCCqYQqQMgrJNpUQMXEKKDmAPHyspgSrBBvLZu3cQqZEdwhfusq0KdkVR5HlFfBvpI0mtIzeusFot7vFPqYuzZYMXUFlzc+qrIn7tf/ACGEkIwDlEQ94YZjzcgAAAAASUVORK5CYII=";
Neo.ToolTip.tone =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAO0lEQVRIx+3PIQ4AMAgEwaP//zNVVZUELiQ7CgWstFy8IaVsPhT1Lb/T+fQEAtwIcCPAjQC39QEAgJIL6DQCFhAqsRkAAAAASUVORK5CYII=";

/*
  -------------------------------------------------------------------------
    PenTip
  -------------------------------------------------------------------------
*/

Neo.PenTip = class extends Neo.ToolTip {
  constructor() {
    super();
    this.isTool = true;
    /** @type {string[]} */
    this.toolStrings = [];
  }
};
Neo.PenTip.prototype.tools = [
  Neo.Painter.TOOLTYPE_PEN,
  Neo.Painter.TOOLTYPE_BRUSH,
  Neo.Painter.TOOLTYPE_TEXT,
];

Neo.PenTip.prototype.hasTintImage = true;
Neo.PenTip.prototype.toolIcons = [
  Neo.ToolTip.pen,
  Neo.ToolTip.brush,
  Neo.ToolTip.text,
];

/**
 * 鉛筆･水彩･テキスト
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.PenTip|null}
 */
Neo.PenTip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("鉛筆"),
    Neo.translate("水彩"),
    Neo.translate("ﾃｷｽﾄ"),
  ];
  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

Neo.PenTip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  this.draw(Neo.painter.foregroundColor);
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

/*
  -------------------------------------------------------------------------
    Pen2Tip
  -------------------------------------------------------------------------
*/

Neo.Pen2Tip = class extends Neo.ToolTip {
  constructor() {
    super();
    /** @type {string[]} */
    this.toolStrings = [];
  }
};

Neo.Pen2Tip.prototype.tools = [
  Neo.Painter.TOOLTYPE_TONE,
  Neo.Painter.TOOLTYPE_BLUR,
  Neo.Painter.TOOLTYPE_DODGE,
  Neo.Painter.TOOLTYPE_BURN,
];

Neo.Pen2Tip.prototype.hasTintImage = true;
Neo.Pen2Tip.prototype.toolIcons = [
  Neo.ToolTip.tone,
  Neo.ToolTip.blur,
  Neo.ToolTip.burn,
  Neo.ToolTip.burn,
];

/**
 * トーン･ぼかし･覆い焼き･焼き込み
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.Pen2Tip|null}
 */
Neo.Pen2Tip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("トーン"),
    Neo.translate("ぼかし"),
    Neo.translate("覆い焼き"),
    Neo.translate("焼き込み"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

Neo.Pen2Tip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  switch (this.tools[this.mode]) {
    case Neo.Painter.TOOLTYPE_TONE:
      // this.drawTone(Neo.painter.foregroundColor);
      this.drawTone();
      break;

    case Neo.Painter.TOOLTYPE_DODGE:
      this.draw(0xffc0c0c0);
      break;

    case Neo.Painter.TOOLTYPE_BURN:
      this.draw(0xff404040);
      break;

    default:
      this.draw(Neo.painter.foregroundColor);
      break;
  }
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

Neo.Pen2Tip.prototype.drawTone = function () {
  if (!this.canvas) {
    console.error("Canvas not found for Pen2Tip.");
    return;
  }
  const ctx = this.canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) {
    console.error("Failed to get 2D context for Pen2Tip canvas.");
    return;
  }

  var imageData = ctx.getImageData(0, 0, 46, 18);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var c = Neo.painter.getColor() | 0xff000000;
  var a = Math.floor(Neo.painter.alpha * 255);
  var toneData = Neo.painter.getToneData(a);

  for (var j = 0; j < 18; j++) {
    for (var i = 0; i < 46; i++) {
      if (
        j >= 1 &&
        j < 12 &&
        i >= 2 &&
        i < 26 &&
        toneData[(i % 4) + (j % 4) * 4]
      ) {
        buf32[j * 46 + i] = c;
      } else {
        buf32[j * 46 + i] = 0;
      }
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, 0, 0);

  this.prevMode = this.mode;
};

/*
  -------------------------------------------------------------------------
    EraserTip
  -------------------------------------------------------------------------
*/

Neo.EraserTip = class extends Neo.ToolTip {
  constructor() {
    super();
    /** @type {string[]} */
    this.toolStrings = [];
    this.drawOnce = false;
    this.isTool = true;
    /** @type {HTMLElement|null} */
    this.label = null;
    /** @type {HTMLCanvasElement|null} */
    this.canvas = null;
  }
};

Neo.EraserTip.prototype.tools = [
  Neo.Painter.TOOLTYPE_ERASER,
  Neo.Painter.TOOLTYPE_ERASERECT,
  Neo.Painter.TOOLTYPE_ERASEALL,
];

/**
 * 消しペン･消し四角･全消し
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.EraserTip|null}
 */
Neo.EraserTip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("消しペン"),
    Neo.translate("消し四角"),
    Neo.translate("全消し"),
  ];

  this.drawOnce = false;
  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

Neo.EraserTip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  if (this.drawOnce == false) {
    this.draw();
    this.drawOnce = true;
  }
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

Neo.EraserTip.prototype.draw = function () {
  if (!this.canvas) {
    console.error("EraserTip: Canvas element not found");
    return null;
  }
  var ctx = this.canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) {
    console.error("Failed to get 2D context for EraserTip canvas.");
    return null;
  }

  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  var img = new Image();

  img.onload = function () {
    ctx?.drawImage(img, 0, 0);
  };
  img.src = Neo.ToolTip.eraser;
};

/*
  -------------------------------------------------------------------------
    EffectTip
  -------------------------------------------------------------------------
*/

Neo.EffectTip = class extends Neo.ToolTip {
  constructor() {
    super();
    /** @type {string[]} */
    this.toolStrings = [];
    /** @type {HTMLElement|null} */
    this.label = null;
    this.isTool = false;
  }
};

Neo.EffectTip.prototype.tools = [
  Neo.Painter.TOOLTYPE_RECTFILL,
  Neo.Painter.TOOLTYPE_RECT,
  Neo.Painter.TOOLTYPE_ELLIPSEFILL,
  Neo.Painter.TOOLTYPE_ELLIPSE,
];

Neo.EffectTip.prototype.hasTintImage = true;
Neo.EffectTip.prototype.toolIcons = [
  Neo.ToolTip.rectfill,
  Neo.ToolTip.rect,
  Neo.ToolTip.ellipsefill,
  Neo.ToolTip.ellipse,
];

/**
 * 四角･線四角･楕円･線楕円
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.EffectTip|null}
 */
Neo.EffectTip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("四角"),
    Neo.translate("線四角"),
    Neo.translate("楕円"),
    Neo.translate("線楕円"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

Neo.EffectTip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  this.draw(Neo.painter.foregroundColor);
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

/*
  -------------------------------------------------------------------------
    Effect2Tip
  -------------------------------------------------------------------------
*/

Neo.Effect2Tip = class extends Neo.ToolTip {
  constructor() {
    super();
    /** @type {string[]} */
    this.toolStrings = [];
    this.isTool = true;
    /** @type {HTMLImageElement|null} */
    this.img = null;
    /**@type {HTMLElement|null} */
    this.element = null;
  }
};

Neo.Effect2Tip.prototype.tools = [
  Neo.Painter.TOOLTYPE_COPY,
  Neo.Painter.TOOLTYPE_MERGE,
  Neo.Painter.TOOLTYPE_BLURRECT,
  Neo.Painter.TOOLTYPE_FLIP_H,
  Neo.Painter.TOOLTYPE_FLIP_V,
  Neo.Painter.TOOLTYPE_TURN,
];

Neo.Effect2Tip.prototype.hasTintImage = true;
Neo.Effect2Tip.prototype.toolIcons = [
  Neo.ToolTip.copy,
  Neo.ToolTip.merge,
  Neo.ToolTip.blurrect,
  Neo.ToolTip.flip,
  Neo.ToolTip.flip,
  Neo.ToolTip.flip,
];

/**
 * コピー･レイヤー結合･角取り･左右反転･上下反転･傾け
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.Effect2Tip|null}
 */
Neo.Effect2Tip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("コピー"),
    Neo.translate("ﾚｲﾔ結合"),
    Neo.translate("角取り"),
    Neo.translate("左右反転"),
    Neo.translate("上下反転"),
    Neo.translate("傾け"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);

  this.img = document.createElement("img");
  this.img.src = Neo.ToolTip.copy2;
  this.element?.appendChild(this.img);
  return this;
};

Neo.Effect2Tip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  this.draw(Neo.painter.foregroundColor);
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

/*
  -------------------------------------------------------------------------
    MaskTip
  -------------------------------------------------------------------------
*/

Neo.MaskTip = class extends Neo.ToolTip {
  constructor() {
    super();
    this.isMouseDown = false;
    /** @type {((MaskTip: Neo.MaskTip) => void) | null} */
    this.onmousedown = null;
    /** @type {HTMLCanvasElement|null} */
    this.canvas = null;
    /** @type {string[]} */
    this.toolStrings = [];
  }
};

/**
 * 通常･マスク･逆マスク･加算･逆加算
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.MaskTip|null}
 */
Neo.MaskTip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("通常"),
    Neo.translate("マスク"),
    Neo.translate("逆ﾏｽｸ"),
    Neo.translate("加算"),
    Neo.translate("逆加算"),
  ];

  this.fixed = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

/** @param {MouseEvent|TouchEvent} e */
Neo.MaskTip.prototype._mouseDownHandler = function (e) {
  this.isMouseDown = true;

  if (Neo.getModifier(e) == "right") {
    Neo.painter.maskColor = Neo.painter.foregroundColor;
  } else {
    var length = this.toolStrings.length;
    this.mode++;
    if (this.mode >= length) this.mode = 0;
    Neo.painter.maskType = this.mode;
  }
  this.update();

  if (this.onmousedown) this.onmousedown(this);
};

Neo.MaskTip.prototype.update = function () {
  this.draw(Neo.painter.maskColor);
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

/**
 * マスクチップのアイコンを描画して色調補正（ティント）を施す。
 *
 * @param {string|number} color - アイコンに適用すべき色彩。カラー文字列、またはNeo.painterで解釈可能な数値IDを指定する。
 */
Neo.MaskTip.prototype.draw = function (color) {
  const c =
    typeof color === "string" ? color : Neo.painter.getColorString(color);
  var ctx = this.canvas?.getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) {
    console.error("Failed to get 2D context for MaskTip canvas.");
    return null;
  }
  if (!this.canvas) {
    console.error("MaskTip: Canvas element not found");
    return null;
  }
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.fillStyle = c;
  ctx.fillRect(1, 1, 43, 9);
};

/*
  -------------------------------------------------------------------------
    DrawTip
  -------------------------------------------------------------------------
*/

Neo.DrawTip = class extends Neo.ToolTip {
  constructor() {
    super();
    /** @type {string[]} */
    this.toolStrings = [];
  }
};

Neo.DrawTip.prototype.hasTintImage = true;
Neo.DrawTip.prototype.toolIcons = [
  Neo.ToolTip.freehand,
  Neo.ToolTip.line,
  Neo.ToolTip.bezier,
];

/**
 * 手書き･直線･BZ曲線
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.DrawTip|null}
 */
Neo.DrawTip.prototype.init = function (elementID, params = {}) {
  this.toolStrings = [
    Neo.translate("手書き"),
    Neo.translate("直線"),
    Neo.translate("BZ曲線"),
  ];

  this.fixed = true;
  Neo.ToolTip.prototype.init.call(this, elementID, params);
  return this;
};

/** @param {MouseEvent|TouchEvent} e */
Neo.DrawTip.prototype._mouseDownHandler = function (e) {
  this.isMouseDown = true;

  var length = this.toolStrings.length;

  if (Neo.getModifier(e) == "right") {
    this.mode--;
    if (this.mode < 0) this.mode = length - 1;
  } else {
    this.mode++;
    if (this.mode >= length) this.mode = 0;
  }
  Neo.painter.drawType = this.mode;
  this.update();

  if (this.onmousedown) this.onmousedown(this);
};

Neo.DrawTip.prototype.update = function () {
  this.mode = Neo.painter.drawType;
  this.draw(Neo.painter.foregroundColor);
  if (this.label) {
    this.label.innerHTML = this.toolStrings[this.mode];
  }
};

/*
  -------------------------------------------------------------------------
    ColorSlider
  -------------------------------------------------------------------------
*/

/**@type {any} */
Neo.sliders = [];

Neo.ColorSlider = class {
  constructor() {
    this.selected = false;
    /** @type {string[]} */
    this.toolStrings = [];
    this.type = 0;
    this.prefix = "";
    this.value0 = 0;
    this.x0 = 0;
    /** @type {Element|null} */
    this.element = null;
    /** @type {string} */
    this.elementID = "";
    /** @type {any} */
    this.params = {};
    /** @type {number} */
    this.value = 0;
    this.isMouseDown = false;
    /** @type {Element|null} */
    this.slider = null;
    /** @type {Element|null} */
    this.label = null;
    /** @type {any} */
    this.hit = null;
  }
};

/**
 * カラースライダーを初期化
 * @param {string} elementID
 * @param {any} [params]
 * @returns {Neo.ColorSlider|null}
 */
Neo.ColorSlider.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.isMouseDown = false;
  this.value = 0;
  this.type = this.params.type;
  if (this.element) {
    this.element.className = "colorSlider";
    this.element.innerHTML =
      "<div class='slider'></div><div class='label'></div>";
    this.element.innerHTML += "<div class='hit'></div>";

    this.slider = this.element.querySelector(".slider");
    this.label = this.element.querySelector(".label");
    this.hit = this.element.querySelector(".hit");
    if (this.hit) {
      this.hit["data-slider"] = params.type;
    }
  }

  if (this.slider instanceof HTMLElement) {
    switch (this.type) {
      case Neo.SLIDERTYPE_RED:
        this.prefix = "R";
        this.slider.style.backgroundColor = "#fa9696";
        break;
      case Neo.SLIDERTYPE_GREEN:
        this.prefix = "G";
        this.slider.style.backgroundColor = "#82f238";
        break;
      case Neo.SLIDERTYPE_BLUE:
        this.prefix = "B";
        this.slider.style.backgroundColor = "#8080ff";
        break;
      case Neo.SLIDERTYPE_ALPHA:
        this.prefix = "A";
        this.slider.style.backgroundColor = "#aaaaaa";
        this.value = 255;
        break;
    }
  }

  this.update();
  return this;
};
/**
 * @param {number} x
 * @param {number} y
 */
Neo.ColorSlider.prototype.downHandler = function (x, y) {
  if (Neo.painter.isShiftDown) {
    this.shift(x, y);
  } else {
    this.slide(x, y);
  }
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.ColorSlider.prototype.moveHandler = function (x, y) {
  this.slide(x, y);
  //event.preventDefault();
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.ColorSlider.prototype.upHandler = function (x, y) {};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.ColorSlider.prototype.shift = function (x, y) {
  var value;
  if (x >= 0 && x < 60 && y >= 0 && y <= 15) {
    var v = Math.floor((x - 5) * 5.0);
    var min = this.type == Neo.SLIDERTYPE_ALPHA ? 1 : 0;

    value = Math.max(Math.min(v, 255), min);
    if (this.value > value || this.value == 255) {
      this.value--;
    } else {
      this.value++;
    }
    this.value = Math.max(Math.min(this.value, 255), min);
    this.value0 = this.value;
    this.x0 = x;
  }

  if (this.type == Neo.SLIDERTYPE_ALPHA) {
    Neo.painter.alpha = this.value / 255.0;
    this.update();
    Neo.updateUIColor(false, false);
  } else {
    var r = Neo.sliders[Neo.SLIDERTYPE_RED].value;
    var g = Neo.sliders[Neo.SLIDERTYPE_GREEN].value;
    var b = Neo.sliders[Neo.SLIDERTYPE_BLUE].value;

    Neo.painter.setColor((r << 16) | (g << 8) | b);
    Neo.updateUIColor(true, true);
  }
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.ColorSlider.prototype.slide = function (x, y) {
  var value;
  if (x >= 0 && x < 60 && y >= 0 && y <= 15) {
    var v = Math.floor((x - 5) * 5.0);
    value = Math.round(v / 5) * 5;

    this.value0 = value;
    this.x0 = x;
  } else {
    var d = (x - this.x0) / 3.0;
    value = this.value0 + d;
  }

  var min = this.type == Neo.SLIDERTYPE_ALPHA ? 1 : 0;
  this.value = Math.max(Math.min(value, 255), min);

  if (this.type == Neo.SLIDERTYPE_ALPHA) {
    Neo.painter.alpha = this.value / 255.0;
    this.update();
    Neo.updateUIColor(false, false);
  } else {
    var r = Neo.sliders[Neo.SLIDERTYPE_RED].value;
    var g = Neo.sliders[Neo.SLIDERTYPE_GREEN].value;
    var b = Neo.sliders[Neo.SLIDERTYPE_BLUE].value;
    var color = (r << 16) | (g << 8) | b;

    var colorTip = Neo.ColorTip.getCurrent();
    if (colorTip) {
      colorTip.setColor(Neo.painter.getColorString(color));
    }

    Neo.painter.setColor(color);
    //      Neo.updateUIColor(true, true);
  }
};

Neo.ColorSlider.prototype.update = function () {
  var color = Neo.painter.getColor();
  var alpha = Neo.painter.alpha * 255;

  switch (this.type) {
    case Neo.SLIDERTYPE_RED:
      this.value = color & 0x0000ff;
      break;
    case Neo.SLIDERTYPE_GREEN:
      this.value = (color & 0x00ff00) >> 8;
      break;
    case Neo.SLIDERTYPE_BLUE:
      this.value = (color & 0xff0000) >> 16;
      break;
    case Neo.SLIDERTYPE_ALPHA:
      this.value = alpha;
      break;
  }

  var width = (this.value * 49.0) / 255.0;
  width = Math.max(Math.min(48, width), 1);
  if (this.slider instanceof HTMLElement) {
    this.slider.style.width = width.toFixed(2) + "px";
  }
  if (this.label instanceof HTMLElement) {
    this.label.innerHTML = this.prefix + this.value.toFixed(0);
  }
};

/*
  -------------------------------------------------------------------------
    SizeSlider
  -------------------------------------------------------------------------
*/

Neo.SizeSlider = class {
  constructor() {
    this.selected = false;
    /** @type {string[]} */
    this.toolStrings = [];
    this.y0 = 0;
    this.value0 = 0;
    this.onmousedown = null;
    /**@type {any} */
    this.params = {};
  }
};

/** @type {Element|null} */
Neo.SizeSlider.prototype.element = null;
/** @type {string} */
Neo.SizeSlider.prototype.elementID = "";
/** @type {number} */
Neo.SizeSlider.prototype.value = 1;
Neo.SizeSlider.prototype.isMouseDown = false;
/** @type {Element|null} */
Neo.SizeSlider.prototype.slider = null;
/** @type {Element|null} */
Neo.SizeSlider.prototype.label = null;
/** @type {Element|null} */
Neo.SizeSlider.prototype.hit = null;

/**
 * サイズスライダーを初期化
 * @param {string} elementID - 要素のID
 * @param {any} [params] - パラメータ
 * @returns {Neo.SizeSlider|null} - 初期化されたサイズスライダーまたはnull
 */
Neo.SizeSlider.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.isMouseDown = false;
  this.value = this.value0 = 1;
  if (this.element) {
    this.element.className = "sizeSlider";
    this.element.innerHTML =
      "<div class='slider'></div><div class='label'></div>";
    this.element.innerHTML += "<div class='hit'></div>";

    this.slider = this.element.querySelector(".slider");
    this.label = this.element.querySelector(".label");
    this.hit = this.element.querySelector(".hit");
    /**@type {any}*/ (this.hit)["data-slider"] = params.type;
  }
  if (this.slider instanceof HTMLElement) {
    this.slider.style.backgroundColor = Neo.painter.foregroundColor;
  }
  this.update();
  return this;
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.SizeSlider.prototype.downHandler = function (x, y) {
  if (Neo.painter.isShiftDown) {
    this.shift(x, y);
  } else {
    this.value0 = this.value;
    this.y0 = y;
    this.slide(x, y);
  }
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.SizeSlider.prototype.moveHandler = function (x, y) {
  this.slide(x, y);
  //event.preventDefault();
};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.SizeSlider.prototype.upHandler = function (x, y) {};

/**
 * @param {number} x
 * @param {number} y
 */
Neo.SizeSlider.prototype.shift = function (x, y) {
  var value0 = Neo.painter.lineWidth;
  var value;

  if (!Neo.painter.tool.alt) {
    var v = Math.floor(((y - 4) * 30.0) / 33.0);

    value = Math.max(Math.min(v, 30), 1);
    if (value0 > value || value0 == 30) {
      value0--;
    } else {
      value0++;
    }
    this.setSize(value0);
  }
};

/**
 * スライダーのドラッグ操作によりブラシサイズを更新する。
 * @param {number} x - 相対X座標
 * @param {number} y - 相対Y座標
 */
Neo.SizeSlider.prototype.slide = function (x, y) {
  var value;
  if (!Neo.painter.tool.alt) {
    if (x >= 0 && x < 48 && y >= 0 && y < 41) {
      var v = Math.floor(((y - 4) * 30.0) / 33.0);
      value = v;

      this.value0 = value;
      this.y0 = y;
    } else {
      var d = (y - this.y0) / 7.0;
      value = this.value0 + d;
    }
  } else {
    // Ctrl+Alt+ドラッグでサイズ変更するとき
    var d = y - this.y0;
    value = this.value0 + d;
  }

  value = Math.max(Math.min(value, 30), 1);
  this.setSize(value);
};

/**
 * サイズをセット
 * @param {number} value
 */
Neo.SizeSlider.prototype.setSize = function (value) {
  value = Math.round(value);
  Neo.painter.lineWidth = Math.max(Math.min(30, value), 1);

  var tool = Neo.painter.getCurrentTool();
  if (tool) {
    if (tool.type == Neo.Painter.TOOLTYPE_BRUSH) {
      Neo.painter.alpha = tool.getAlpha();
      Neo.sliders[Neo.SLIDERTYPE_ALPHA].update();
    } else if (tool.type == Neo.Painter.TOOLTYPE_TEXT) {
      Neo.painter.updateInputText();
    }
  }
  this.update();
};

Neo.SizeSlider.prototype.update = function () {
  this.value = Neo.painter.lineWidth;

  var height = (this.value * 33.0) / 30.0;
  height = Math.max(Math.min(34, height), 1);
  if (this.slider instanceof HTMLElement) {
    this.slider.style.height = height.toFixed(2) + "px";
    if (this.label instanceof HTMLElement) {
      this.label.innerHTML = this.value + "px";
    }
    this.slider.style.backgroundColor = Neo.painter.foregroundColor;
  }
};

/*
  -------------------------------------------------------------------------
    LayerControl
  -------------------------------------------------------------------------
*/

Neo.LayerControl = class {
  constructor() {
    /** @type {((LayerControl: Neo.LayerControl) => void) | null} */
    this.onmousedown = null;
    /** @type {HTMLElement|null}*/
    this.bg = null;
    /** @type {HTMLElement|null}*/
    this.label0 = null;
    /** @type {HTMLElement|null}*/
    this.label1 = null;
    /** @type {HTMLElement|null}*/
    this.line0 = null;
    /** @type {HTMLElement|null}*/
    this.line1 = null;
  }
};
/** @type {HTMLElement|null} */
Neo.LayerControl.prototype.element = null;

/** @type {any} */
Neo.LayerControl.prototype.params = null;
Neo.LayerControl.prototype.elementID = "";
Neo.LayerControl.prototype.isMouseDown = false;

/**
 * レイヤーコントローラーを初期化
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.LayerControl|null}
 */
Neo.LayerControl.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.isMouseDown = false;

  var ref = this;

  if (this.element) {
    this.element.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    this.element.addEventListener(
      "touchstart",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseDownHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );

    this.element.className = "layerControl";

    var layerStrings = [Neo.translate("Layer0"), Neo.translate("Layer1")];

    this.element.innerHTML =
      "<div class='bg'></div><div class='label0'>" +
      layerStrings[0] +
      "</div><div class='label1'>" +
      layerStrings[1] +
      "</div><div class='line1'></div><div class='line0'></div>";

    this.bg = this.element.querySelector(".bg");
    //Layer0の文字
    this.label0 = this.element.querySelector(".label0");
    //Layer1の文字
    this.label1 = this.element.querySelector(".label1");
    //Layer0非表示の取り消し線
    this.line0 = this.element.querySelector(".line0");
    //Layer1非表示の取り消し線
    this.line1 = this.element.querySelector(".line1");
  }
  //初期化時に非表示にする
  if (this.line0) {
    this.line0.style.display = "none";
  }
  if (this.line1) {
    this.line1.style.display = "none";
  }
  if (this.label1) {
    this.label1.style.display = "none";
  }

  this.update();
  return this;
};

/** @param {MouseEvent|TouchEvent} e */
Neo.LayerControl.prototype._mouseDownHandler = function (e) {
  if (Neo.getModifier(e) == "right") {
    var visible = Neo.painter.visible[Neo.painter.current];
    Neo.painter.visible[Neo.painter.current] = visible ? false : true;
  } else {
    var current = Neo.painter.current;
    Neo.painter.current = current ? 0 : 1;
  }
  Neo.painter.updateDestCanvas(
    0,
    0,
    Neo.painter.canvasWidth,
    Neo.painter.canvasHeight,
  );
  if (Neo.painter.tool.type == Neo.Painter.TOOLTYPE_PASTE) {
    Neo.painter.tool.drawCursor(Neo.painter);
  }
  this.update();

  if (this.onmousedown) this.onmousedown(this);
};

Neo.LayerControl.prototype.update = function () {
  if (this.label0) {
    this.label0.style.display = Neo.painter.current == 0 ? "block" : "none";
  }
  if (this.label1) {
    this.label1.style.display = Neo.painter.current == 1 ? "block" : "none";
  }
  if (this.line0) {
    this.line0.style.display = Neo.painter.visible[0] ? "none" : "block";
  }
  if (this.line1) {
    this.line1.style.display = Neo.painter.visible[1] ? "none" : "block";
  }
};

/*
  -------------------------------------------------------------------------
    ReserveControl
  -------------------------------------------------------------------------
*/
/** @type {any} */
Neo.reserveControls = [];

Neo.ReserveControl = function () {};
/** @type {HTMLElement|null} */
Neo.ReserveControl.prototype.element = null;
Neo.ReserveControl.prototype.elementID = "";
/** @type {any} */
Neo.ReserveControl.prototype.params = null;
/** @type {any} */
Neo.ReserveControl.prototype.reserve = null;
Neo.ReserveControl.prototype.isMouseDown = false;

/**
 * リバースコントローラーを初期化
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.ReserveControl|null}
 */
Neo.ReserveControl.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;

  var ref = this;

  if (this.element) {
    this.element.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    this.element.addEventListener(
      "touchstart",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._mouseDownHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );

    this.element.className = "reserve";

    var index = parseInt(this.elementID.slice(11)) - 1; //neo-reserve なので11文字目
    this.element.style.top = "1px";
    this.element.style.left = index * 15 + 2 + "px";
    this.reserve = Neo.clone(Neo.config.reserves[index]);
  }
  this.update();
  //どこからも参照されていない?
  Neo.reserveControls.push(this);
  return this;
};
/**
 * 保管ペンに保存
 */
/** @param {MouseEvent|TouchEvent} e */
Neo.ReserveControl.prototype._mouseDownHandler = function (e) {
  if (Neo.getModifier(e) == "right") {
    this.save();
  } else {
    this.load();
  }
  this.update();
};

Neo.ReserveControl.prototype.load = function () {
  if (!this.reserve) {
    console.error("Reserve not found for ReserveControl load.");
    return;
  }
  Neo.painter.setToolByType(this.reserve.tool);
  Neo.painter.foregroundColor = this.reserve.color;
  Neo.painter.lineWidth = this.reserve.size;
  Neo.painter.alpha = this.reserve.alpha;

  switch (this.reserve.tool) {
    case Neo.Painter.TOOLTYPE_PEN:
    case Neo.Painter.TOOLTYPE_BRUSH:
    case Neo.Painter.TOOLTYPE_TONE:
      Neo.painter.drawType = this.reserve.drawType;
  }
  Neo.updateUI();
};

Neo.ReserveControl.prototype.save = function () {
  if (!this.reserve) {
    console.error("Reserve not found for ReserveControl save");
    return;
  }
  this.reserve.color = Neo.painter.foregroundColor;
  this.reserve.size = Neo.painter.lineWidth;
  this.reserve.drawType = Neo.painter.drawType;
  this.reserve.alpha = Neo.painter.alpha;
  this.reserve.tool = Neo.painter.tool.getType();
  if (!(this.element instanceof HTMLElement)) {
    console.error("Element not found for ReserveControl save.");
    return;
  }
  this.element.style.backgroundColor = this.reserve.color;
  this.update();
  Neo.updateUI();
};

Neo.ReserveControl.prototype.update = function () {
  if (!this.element) {
    console.error("Element not found for ReserveControl update.");
    return;
  }
  this.element.style.backgroundColor = this.reserve.color;
};

/*
  -------------------------------------------------------------------------
    ScrollBarButton
  -------------------------------------------------------------------------
*/

/** @type {Neo.ScrollBarButton|null} */
Neo.scrollH = null;
/** @type {Neo.ScrollBarButton|null} */
Neo.scrollV = null;

Neo.ScrollBarButton = function () {};
/** @type {HTMLElement|null} */
Neo.ScrollBarButton.prototype.element = null;
/** @type {string} */
Neo.ScrollBarButton.prototype.elementID = "";
/** @type {Object} */
Neo.ScrollBarButton.prototype.params = /** @type {unknown} */ (null);
/** @type {HTMLElement|null} */
Neo.ScrollBarButton.prototype.barButton = null;

/**
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.ScrollBarButton|null} 初期化成功時はインスタンス、失敗時は null
 */
Neo.ScrollBarButton.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;

  if (this.element) {
    this.element.innerHTML = "<div></div>";
    this.barButton = this.element.querySelector("div");
    /**@type {any} */
    (this.element)["data-bar"] = true;
  }
  if (this.barButton) {
    /**@type {any} */
    (this.barButton)["data-bar"] = true;
  }

  if (elementID == "neo-scrollH") Neo.scrollH = this;
  if (elementID == "neo-scrollV") Neo.scrollV = this;
  return this;
};

/**
 * @param {Neo.Painter} oe
 * @returns {void|null} 更新成功時は void、失敗時は null
 */
Neo.ScrollBarButton.prototype.update = function (oe) {
  if (this.elementID == "neo-scrollH") {
    var a = oe.destCanvas.width / (oe.canvasWidth * oe.zoom);
    var barWidth = Math.ceil(oe.destCanvas.width * a);
    var barX = oe.scrollBarX * (oe.destCanvas.width - barWidth);
    if (!this.barButton) {
      console.error("Bar button element not found for " + this.elementID);
      return null;
    }
    this.barButton.style.width = Math.ceil(barWidth) - 4 + "px";
    this.barButton.style.left = Math.floor(barX) + "px";
  } else {
    var a = oe.destCanvas.height / (oe.canvasHeight * oe.zoom);
    var barHeight = Math.ceil(oe.destCanvas.height * a);
    var barY = oe.scrollBarY * (oe.destCanvas.height - barHeight);
    if (!this.barButton) {
      console.error("Bar button element not found for " + this.elementID);
      return null;
    }
    this.barButton.style.height = Math.ceil(barHeight) - 4 + "px";
    this.barButton.style.top = Math.floor(barY) + "px";
  }
};

/*
  -------------------------------------------------------------------------
    ViewerButton
  -------------------------------------------------------------------------
*/

Neo.ViewerButton = class extends Neo.Button {
  constructor() {
    super();
    /** @type {HTMLElement|null} */
    this.element = null;
    /** @type {HTMLCanvasElement|null} */
    this.canvas = null;
  }
};

Neo.ViewerButton.speedStrings = ["最", "早", "既", "鈍"];

/**
 *
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.ViewerButton|null}
 */
Neo.ViewerButton.prototype.init = function (elementID, params = {}) {
  Neo.Button.prototype.init.call(this, elementID, params);

  if (elementID != "neo-viewerSpeed") {
    if (this.element) {
      this.element.innerHTML = "<canvas width=24 height=24></canvas>";
      this.canvas = this.element.querySelector("canvas");
    }
    if (!this.canvas) {
      console.error("Canvas element not found for " + elementID);
      return null;
    }

    /** @type {CanvasRenderingContext2D|null} */
    const ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) {
      console.error("Canvas context not found for " + elementID);
      return null;
    }

    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, 24, 24);
      ctx.drawImage(img, 0, 0);
      Neo.tintImage(ctx, Neo.config.color_text);
    }.bind(this);
    img.src = /**@type {any}*/ (Neo.ViewerButton)[
      elementID.toLowerCase().replace(/neo-viewer/, "")
    ];
  } else {
    if (this.element) {
      this.element.innerHTML =
        "<div></div><canvas width=24 height=24></canvas>";
    }
    this.update();
  }
  return this;
};

Neo.ViewerButton.prototype.update = function () {
  if (this.elementID == "neo-viewerSpeed") {
    var mode = Neo.painter._actionMgr.speedMode();
    var speedString = Neo.translate(Neo.ViewerButton.speedStrings[mode]);
    if (this.element) {
      this.element.children[0].innerHTML = "<div>" + speedString + "</div>";
    }
  }
};

Neo.ViewerButton.minus =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYMAG5H+AEDYAADOnAi81ABEKAAAAAElFTkSuQmCC";

Neo.ViewerButton.plus =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX/////HgD/HgAvnCBAAAAAAnRSTlMAAHaTzTgAAAAfSURBVAjXY2BAA0wTMAimVasaIARj2FQHCIGkBAUAAGm3CXHeKF1tAAAAAElFTkSuQmCC";

Neo.ViewerButton.play =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX/////HgD/HgAvnCBAAAAAAnRSTlMAAHaTzTgAAAAuSURBVAjXY2BAABUQoQkitBxAxAQQsQRErAQRq+CspSBiKogIAekIABKqDhAzAAuwB6SsnxQ6AAAAAElFTkSuQmCC";

Neo.ViewerButton.stop =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYIAB+x8EEBgAACjyDV75Mi9xAAAAAElFTkSuQmCC";

Neo.ViewerButton.rewind =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAACxJREFUCNdjYAADJiYGNjYGPj4GOTkGOzuGujqGf/9AJJANFAGKA2WBahgYAIE2Bb0RIYJRAAAAAElFTkSuQmCC";

/*
  -------------------------------------------------------------------------
    ViewerBar
  -------------------------------------------------------------------------
*/

// length/mark/count
// update

Neo.ViewerBar = class {
  constructor() {
    /** @type {any} */
    this.params = null;
    this.elementID = "";
    this.isMouseDown = false;
    /**@type {HTMLElement|null} */
    this.element;
    /**@type {HTMLElement} */
    this.seekElement;
    /**@type {HTMLElement} */
    this.markElement;
    /**@type {HTMLElement} */
    this.textElement;
    this.width = 0;
    this.length = 0;
    this.mark = 0;
    this.seek = 0;
  }
};
/**
 *
 * @param {string} elementID
 * @param {Object} [params]
 * @returns {Neo.ViewerBar}
 */
Neo.ViewerBar.prototype.init = function (elementID, params = {}) {
  this.element = document.getElementById(elementID);
  this.params = params || {};
  this.elementID = elementID;
  this.isMouseDown = false;
  if (this.element) {
    this.element.style.display = "inline-block";
    this.element.innerHTML =
      "<div id='neo-viewerBarLeft'></div>" +
      "<div id='neo-viewerBarMark'></div>" +
      "<div id='neo-viewerBarText'>hoge</div>";

    if (this.element.children[0] instanceof HTMLElement) {
      this.seekElement = this.element.children[0];
    }
    if (this.element.children[1] instanceof HTMLElement) {
      this.markElement = this.element.children[1];
    }
    if (this.element.children[2] instanceof HTMLElement) {
      this.textElement = this.element.children[2];
    }
  }

  this.width = this.seekElement.offsetWidth;

  this.length = this.params.length || 100;
  this.mark = this.length;
  this.seek = 0;
  if (this.element) {
    var ref = this;
    this.element.addEventListener(
      "pointerdown",
      function (e) {
        ref.isMouseDown = true;
        ref._touchHandler(e);
      },
      { passive: false, capture: true },
    );
    this.element.addEventListener(
      "pointermove",
      function (e) {
        e.preventDefault();
        if (ref.isMouseDown) {
          ref._touchHandler(e);
        }
      },
      { passive: false, capture: true },
    );
    //  this.element.onmouseup = function(e) { this.isMouseDown = false; }
    //  this.element.onmouseout = function(e) { this.isMouseDown = false; }
    this.element.addEventListener(
      "touchstart",
      /**
       * @param {TouchEvent} e
       */
      function (e) {
        ref._touchHandler(e);
        e.preventDefault();
      },
      { passive: false, capture: true },
    );
  }
  this.update();
  return this;
};

Neo.ViewerBar.prototype.update = function () {
  this.mark = Neo.painter._actionMgr._mark;
  this.seek = Neo.painter._actionMgr._head;

  var markX = (this.mark / this.length) * this.width;
  this.markElement.style.left = markX + "px";

  var seekX = (this.seek / this.length) * this.width;
  this.seekElement.style.width = seekX + "px";
  this.textElement.innerHTML = this.seek + "/" + this.length;
};
/**@param {TouchEvent|PointerEvent} e */
Neo.ViewerBar.prototype._touchHandler = function (e) {
  if (e instanceof PointerEvent) {
    if (e.offsetX === undefined) {
      return;
    }
    let x = e.offsetX / this.width;
    x = Math.max(Math.min(x, 1), 0);
    Neo.painter._actionMgr._mark = Math.round(x * this.length);
  }
  //this.update();
  //  console.log('mark=', this.mark, 'head=', Neo.painter._actionMgr._head);

  Neo.painter.onmark();
};

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.5
var LZString = (function () {
  // private property
  var f = String.fromCharCode;
  var keyStrBase64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var keyStrUriSafe =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  var baseReverseDic = {};

  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (var i = 0; i < alphabet.length; i++) {
        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return baseReverseDic[alphabet][character];
  }

  var LZString = {
    compressToBase64: function (input) {
      if (input == null) return "";
      var res = LZString._compress(input, 6, function (a) {
        return keyStrBase64.charAt(a);
      });
      switch (
        res.length % 4 // To produce valid Base64
      ) {
        default: // When could this happen ?
        case 0:
          return res;
        case 1:
          return res + "===";
        case 2:
          return res + "==";
        case 3:
          return res + "=";
      }
    },

    decompressFromBase64: function (input) {
      if (input == null) return "";
      if (input == "") return null;
      return LZString._decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrBase64, input.charAt(index));
      });
    },

    compressToUTF16: function (input) {
      if (input == null) return "";
      return (
        LZString._compress(input, 15, function (a) {
          return f(a + 32);
        }) + " "
      );
    },

    decompressFromUTF16: function (compressed) {
      if (compressed == null) return "";
      if (compressed == "") return null;
      return LZString._decompress(compressed.length, 16384, function (index) {
        return compressed.charCodeAt(index) - 32;
      });
    },

    //compress into uint8array (UCS-2 big endian format)
    compressToUint8Array: function (uncompressed) {
      var compressed = LZString.compress(uncompressed);
      var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

      for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        var current_value = compressed.charCodeAt(i);
        buf[i * 2] = current_value >>> 8;
        buf[i * 2 + 1] = current_value % 256;
      }
      return buf;
    },

    //decompress from uint8array (UCS-2 big endian format)
    decompressFromUint8Array: function (compressed) {
      if (compressed === null || compressed === undefined) {
        return LZString.decompress(compressed);
      } else {
        var buf = new Array(compressed.length / 2); // 2 bytes per character
        for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
          buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(""));
      }
    },

    //compress into a string that is already URI encoded
    compressToEncodedURIComponent: function (input) {
      if (input == null) return "";
      return LZString._compress(input, 6, function (a) {
        return keyStrUriSafe.charAt(a);
      });
    },

    //decompress from an output of compressToEncodedURIComponent
    decompressFromEncodedURIComponent: function (input) {
      if (input == null) return "";
      if (input == "") return null;
      input = input.replace(/ /g, "+");
      return LZString._decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrUriSafe, input.charAt(index));
      });
    },

    compress: function (uncompressed) {
      return LZString._compress(uncompressed, 16, function (a) {
        return f(a);
      });
    },
    _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null) return "";
      var i,
        value,
        context_dictionary = {},
        context_dictionaryToCreate = {},
        context_c = "",
        context_wc = "",
        context_w = "",
        context_enlargeIn = 2, // Compensate for the first entry which should not count
        context_dictSize = 3,
        context_numBits = 2,
        context_data = [],
        context_data_val = 0,
        context_data_position = 0,
        ii;

      for (ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (
          !Object.prototype.hasOwnProperty.call(context_dictionary, context_c)
        ) {
          context_dictionary[context_c] = context_dictSize++;
          context_dictionaryToCreate[context_c] = true;
        }

        context_wc = context_w + context_c;
        if (
          Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)
        ) {
          context_w = context_wc;
        } else {
          if (
            Object.prototype.hasOwnProperty.call(
              context_dictionaryToCreate,
              context_w,
            )
          ) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          // Add wc to the dictionary.
          context_dictionary[context_wc] = context_dictSize++;
          context_w = String(context_c);
        }
      }

      // Output the code for w.
      if (context_w !== "") {
        if (
          Object.prototype.hasOwnProperty.call(
            context_dictionaryToCreate,
            context_w,
          )
        ) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
      }

      // Mark the end of the stream
      value = 2;
      for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position == bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }

      // Flush the last char
      while (true) {
        context_data_val = context_data_val << 1;
        if (context_data_position == bitsPerChar - 1) {
          context_data.push(getCharFromInt(context_data_val));
          break;
        } else context_data_position++;
      }
      return context_data.join("");
    },

    decompress: function (compressed) {
      if (compressed == null) return "";
      if (compressed == "") return null;
      return LZString._decompress(compressed.length, 32768, function (index) {
        return compressed.charCodeAt(index);
      });
    },

    _decompress: function (length, resetValue, getNextValue) {
      var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits,
        resb,
        maxpower,
        power,
        c,
        data = { val: getNextValue(0), position: resetValue, index: 1 };

      for (i = 0; i < 3; i += 1) {
        dictionary[i] = i;
      }

      bits = 0;
      maxpower = Math.pow(2, 2);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch ((next = bits)) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 2:
          return "";
      }
      dictionary[3] = c;
      w = c;
      result.push(c);
      while (true) {
        if (data.index > length) {
          return "";
        }

        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch ((c = bits)) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 2:
            return result.join("");
        }

        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }

        if (dictionary[c]) {
          entry = dictionary[c];
        } else {
          if (c === dictSize) {
            entry = w + w.charAt(0);
          } else {
            return null;
          }
        }
        result.push(entry);

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;

        w = entry;

        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }
    },
  };
  return LZString;
})();

if (typeof define === "function" && define.amd) {
  define(function () {
    return LZString;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = LZString;
} else if (typeof angular !== "undefined" && angular != null) {
  angular.module("LZString", []).factory("LZString", function () {
    return LZString;
  });
}
