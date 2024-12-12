"use strict";

document.addEventListener("DOMContentLoaded", function () {
  if (Neo.init()) {
    if (!navigator.userAgent.match("Electron")) {
      Neo.start();
    }
  }
});

var Neo = function () {};

Neo.version = "1.6.10";
Neo.painter;
Neo.fullScreen = false;
Neo.uploaded = false;
Neo.viewer = false;
Neo.toolSide = false;

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

Neo.SLIDERTYPE_RED = 0;
Neo.SLIDERTYPE_GREEN = 1;
Neo.SLIDERTYPE_BLUE = 2;
Neo.SLIDERTYPE_ALPHA = 3;
Neo.SLIDERTYPE_SIZE = 4;

document.neo = Neo;

Neo.init = function () {
  var applets = document.getElementsByTagName("applet");
  if (applets.length == 0) {
    applets = document.getElementsByTagName("applet-dummy");
  }

  for (var i = 0; i < applets.length; i++) {
    var applet = applets[i];
    var name = applet.attributes.name.value;

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
        var pch = Neo.getPCH(filename, function (pch) {
          if (pch) {
            Neo.createViewer(applet);
            Neo.config.width = pch.width;
            Neo.config.height = pch.height;
            Neo.initViewer(pch);
            Neo.startViewer();
          }
        });
      }
      return true;
    }
  }
  return false;
};

Neo.init2 = function () {
  var pageview = document.getElementById("pageView");
  pageview.style.width = Neo.config.applet_width + "px";
  pageview.style.height = Neo.config.applet_height + "px";

  Neo.canvas = document.getElementById("canvas");
  Neo.container = document.getElementById("container");
  Neo.toolsWrapper = document.getElementById("toolsWrapper");

  Neo.painter = new Neo.Painter();
  Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);

  Neo.container.oncontextmenu = function () {
    return false;
  };

  // 動画記録
  Neo.animation = Neo.config.thumbnail_type == "animation";

  // 続きから描く
  Neo.storage = localStorage; //PCの時にもlocalStorageを使用

  var filename = Neo.getFilename();
  var message =
    !filename || filename.slice(-4).toLowerCase() != ".pch"
      ? "描きかけの画像があります。復元しますか？"
      : "描きかけの画像があります。動画の読み込みを中止して復元しますか？";

  let storageTimestamp = Neo.storage.getItem("timestamp");
  const nowTimestamp = new Date().getTime();

  if (
    Number.isInteger(Number(storageTimestamp)) &&
    nowTimestamp - storageTimestamp > 3 * 86400 * 1000
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
    false
  );
};

Neo.initConfig = function (applet) {
  if (applet) {
    var name = applet.attributes.name.value || "neo";
    var appletWidth = applet.attributes.width;
    var appletHeight = applet.attributes.height;
    if (appletWidth) Neo.config.applet_width = parseInt(appletWidth.value);
    if (appletHeight) Neo.config.applet_height = parseInt(appletHeight.value);

    var params = applet.getElementsByTagName("param");
    for (var i = 0; i < params.length; i++) {
      var p = params[i];
      Neo.config[p.name] = Neo.fixConfig(p.value);

      if (p.name == "image_width") Neo.config.width = parseInt(p.value);
      if (p.name == "image_height") Neo.config.height = parseInt(p.value);
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

    var e = document.getElementById("container");
    Neo.config.inherit_color = Neo.getInheritColor(e);
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

  Neo.reservePen = Neo.clone(Neo.config.reserves[0]);
  Neo.reserveEraser = Neo.clone(Neo.config.reserves[1]);
};

Neo.fixConfig = function (value) {
  // javaでは"#12345"を色として解釈するがjavascriptでは"#012345"に変換しないとだめ
  if (value.match(/^#[0-9a-fA-F]{5}$/)) {
    value = "#0" + value.slice(1);
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

  Neo.addRule(".NEO #container", "background-image", "url(" + bgImage + ")");
  Neo.addRule(".NEO .colorSlider .label", "color", Neo.config.tool_color_text);
  Neo.addRule(".NEO .sizeSlider .label", "color", Neo.config.tool_color_text);
  Neo.addRule(
    ".NEO .layerControl .label1",
    "color",
    Neo.config.tool_color_text
  );
  Neo.addRule(
    ".NEO .layerControl .label0",
    "color",
    Neo.config.tool_color_text
  );
  Neo.addRule(".NEO .toolTipOn .label", "color", Neo.config.tool_color_text);
  Neo.addRule(".NEO .toolTipOff .label", "color", Neo.config.tool_color_text);

  Neo.addRule(".NEO #toolSet", "background-color", Neo.config.color_bk);
  Neo.addRule(".NEO #tools", "color", Neo.config.tool_color_text);
  Neo.addRule(
    ".NEO .layerControl .bg",
    "border-bottom",
    "1px solid " + Neo.config.tool_color_text
  );

  Neo.addRule(".NEO .buttonOn", "color", Neo.config.color_text);
  Neo.addRule(".NEO .buttonOff", "color", Neo.config.color_text);

  Neo.addRule(".NEO .buttonOff", "background-color", Neo.config.color_icon);
  Neo.addRule(
    ".NEO .buttonOff",
    "border-top",
    "1px solid ",
    Neo.config.color_icon
  );
  Neo.addRule(
    ".NEO .buttonOff",
    "border-left",
    "1px solid ",
    Neo.config.color_icon
  );
  Neo.addRule(
    ".NEO .buttonOff",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_icon +
      ", 0 0 0 2px " +
      Neo.config.color_frame
  );

  Neo.addRule(
    ".NEO .buttonOff:hover",
    "background-color",
    Neo.config.color_icon
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "border-top",
    "1px solid " + lightBorder
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "border-left",
    "1px solid " + lightBorder
  );
  Neo.addRule(
    ".NEO .buttonOff:hover",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_iconselect +
      ", 0 0 0 2px " +
      Neo.config.color_frame
  );

  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "background-color",
    darkBorder
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "border-top",
    "1px solid " + darkBorder
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "border-left",
    "1px solid " + darkBorder
  );
  Neo.addRule(
    ".NEO .buttonOff:active, .NEO .buttonOn",
    "box-shadow",
    "0 0 0 1px " +
      Neo.config.color_iconselect +
      ", 0 0 0 2px " +
      Neo.config.color_frame
  );

  Neo.addRule(".NEO #canvas", "border", "1px solid " + Neo.config.color_frame);
  Neo.addRule(
    ".NEO #scrollH, .NEO #scrollV",
    "background-color",
    Neo.config.color_icon
  );
  Neo.addRule(
    ".NEO #scrollH, .NEO #scrollV",
    "box-shadow",
    "0 0 0 1px white" + ", 0 0 0 2px " + Neo.config.color_frame
  );

  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "background-color",
    Neo.config.color_bar
  );
  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "box-shadow",
    "0 0 0 1px " + Neo.config.color_icon
  );
  Neo.addRule(
    ".NEO #scrollH div:hover, .NEO #scrollV div:hover",
    "box-shadow",
    "0 0 0 1px " + Neo.config.color_iconselect
  );

  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "border-top",
    "1px solid " + lightBar
  );
  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "border-left",
    "1px solid " + lightBar
  );
  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "border-right",
    "1px solid " + darkBar
  );
  Neo.addRule(
    ".NEO #scrollH div, .NEO #scrollV div",
    "border-bottom",
    "1px solid " + darkBar
  );

  Neo.addRule(
    ".NEO .toolTipOn",
    "background-color",
    Neo.multColor(Neo.config.tool_color_button, 0.7)
  );
  Neo.addRule(
    ".NEO .toolTipOff",
    "background-color",
    Neo.config.tool_color_button
  );
  Neo.addRule(
    ".NEO .toolTipFixed",
    "background-color",
    Neo.config.tool_color_button2
  );

  Neo.addRule(
    ".NEO .colorSlider, .NEO .sizeSlider",
    "background-color",
    Neo.config.tool_color_bar
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "background-color",
    Neo.config.tool_color_bar
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "background-color",
    Neo.config.tool_color_bar
  );
  Neo.addRule(
    ".NEO .layerControl",
    "background-color",
    Neo.config.tool_color_bar
  );

  Neo.addRule(
    ".NEO .colorTipOn, .NEO .colorTipOff",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .toolTipOn, .NEO .toolTipOff",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .toolTipFixed",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .colorSlider, .NEO .sizeSlider",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .reserveControl",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .layerControl",
    "box-shadow",
    "0 0 0 1px " + Neo.config.tool_color_frame
  );
  Neo.addRule(
    ".NEO .reserveControl .reserve",
    "border",
    "1px solid " + Neo.config.tool_color_frame
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

Neo.addRule = function (selector, styleName, value, sheet) {
  if (!sheet) sheet = Neo.styleSheet;
  if (sheet.addRule) {
    sheet.addRule(selector, styleName + ":" + value, sheet.rules.length);
  } else if (sheet.insertRule) {
    var rule = selector + "{" + styleName + ":" + value + "}";
    var index = sheet.cssRules.length;
    sheet.insertRule(rule, index);
  }
};

Neo.readStyles = function () {
  Neo.rules = {};
  for (var i = 0; i < document.styleSheets.length; i++) {
    Neo.readStyle(document.styleSheets[i]);
  }
};

Neo.readStyle = function (sheet) {
  try {
    var rules = sheet.cssRules;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (rule.styleSheet) {
        Neo.readStyle(rule.styleSheet);
        continue;
      }

      var selector = rule.selectorText;
      if (selector) {
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
  } catch (e) {}
};

Neo.applyStyle = function (name, defaultColor) {
  if (Neo.config[name] == undefined) {
    Neo.config[name] = Neo.rules[name] || defaultColor;
  }
};

Neo.getInheritColor = function (e) {
  var result = "#000000";
  while (e && e.style) {
    if (e.style.color != "") {
      result = e.style.color;
      break;
    }
    if (e.attributes["text"]) {
      result = e.attributes["text"].value;
      break;
    }
    e = e.parentNode;
  }
  return result;
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

Neo.multColor = function (c, scale) {
  var r = Math.round(parseInt(c.slice(1, 3), 16) * scale);
  var g = Math.round(parseInt(c.slice(3, 5), 16) * scale);
  var b = Math.round(parseInt(c.slice(5, 7), 16) * scale);
  r = ("0" + Math.min(Math.max(r, 0), 255).toString(16)).slice(-2);
  g = ("0" + Math.min(Math.max(g, 0), 255).toString(16)).slice(-2);
  b = ("0" + Math.min(Math.max(b, 0), 255).toString(16)).slice(-2);
  return "#" + r + g + b;
};

Neo.colorNameToHex = function (name) {
  var colors = {
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
  var copyright = document.getElementById("copyright");
  if (copyright) copyright.innerHTML += "v" + Neo.version;

  // アプレットのborderの動作をエミュレート
  if (navigator.userAgent.search("FireFox") > -1) {
    var container = document.getElementById("container");
    container.addEventListener(
      "mousedown",
      function (e) {
        container.style.borderColor = Neo.config.inherit_color;
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "mousedown",
      function (e) {
        container.style.borderColor = "transparent";
      },
      false
    );
  }

  // ドラッグしたまま画面外に移動した時
  document.addEventListener(
    "mouseup",
    function (e) {
      if (Neo.painter && !Neo.painter.isContainer(e.target)) {
        Neo.painter.cancelTool(e.target);
      }
    },
    false
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
  new Neo.Button().init("undo").onmouseup = function () {
    new Neo.UndoCommand(Neo.painter).execute();
  };
  new Neo.Button().init("redo").onmouseup = function () {
    new Neo.RedoCommand(Neo.painter).execute();
  };
  new Neo.Button().init("window").onmouseup = function () {
    new Neo.WindowCommand(Neo.painter).execute();
  };
  new Neo.Button().init("copyright").onmouseup = function () {
    new Neo.CopyrightCommand(Neo.painter).execute();
  };
  new Neo.Button().init("zoomPlus").onmouseup = function () {
    new Neo.ZoomPlusCommand(Neo.painter).execute();
  };
  new Neo.Button().init("zoomMinus").onmouseup = function () {
    new Neo.ZoomMinusCommand(Neo.painter).execute();
  };
  Neo.submitButton = new Neo.Button().init("submit");
  Neo.submitButton.onmouseup = function () {
    Neo.submitButton.disable(5000);
    new Neo.SubmitCommand(Neo.painter).execute();
  };

  Neo.fillButton = new Neo.FillButton().init("fill");
  Neo.rightButton = new Neo.RightButton().init("right");

  if (Neo.isMobile() || Neo.config.neo_show_right_button == "true") {
    Neo.rightButton.element.style.display = "block";
  }

  // toolTip
  Neo.penTip = new Neo.PenTip().init("pen");
  Neo.pen2Tip = new Neo.Pen2Tip().init("pen2");
  Neo.effectTip = new Neo.EffectTip().init("effect");
  Neo.effect2Tip = new Neo.Effect2Tip().init("effect2");
  Neo.eraserTip = new Neo.EraserTip().init("eraser");
  Neo.drawTip = new Neo.DrawTip().init("draw");
  Neo.maskTip = new Neo.MaskTip().init("mask");

  Neo.toolButtons = [
    Neo.fillButton,
    Neo.penTip,
    Neo.pen2Tip,
    Neo.effectTip,
    Neo.effect2Tip,
    Neo.drawTip,
    Neo.eraserTip,
  ];

  // colorTip
  for (var i = 1; i <= 14; i++) {
    new Neo.ColorTip().init("color" + i, { index: i });
  }

  // colorSlider
  Neo.sliders[Neo.SLIDERTYPE_RED] = new Neo.ColorSlider().init("sliderRed", {
    type: Neo.SLIDERTYPE_RED,
  });
  Neo.sliders[Neo.SLIDERTYPE_GREEN] = new Neo.ColorSlider().init(
    "sliderGreen",
    { type: Neo.SLIDERTYPE_GREEN }
  );
  Neo.sliders[Neo.SLIDERTYPE_BLUE] = new Neo.ColorSlider().init("sliderBlue", {
    type: Neo.SLIDERTYPE_BLUE,
  });
  Neo.sliders[Neo.SLIDERTYPE_ALPHA] = new Neo.ColorSlider().init(
    "sliderAlpha",
    { type: Neo.SLIDERTYPE_ALPHA }
  );

  // sizeSlider
  Neo.sliders[Neo.SLIDERTYPE_SIZE] = new Neo.SizeSlider().init("sliderSize", {
    type: Neo.SLIDERTYPE_SIZE,
  });

  // reserveControl
  for (var i = 1; i <= 3; i++) {
    new Neo.ReserveControl().init("reserve" + i, { index: i });
  }

  new Neo.LayerControl().init("layerControl");
  new Neo.ScrollBarButton().init("scrollH");
  new Neo.ScrollBarButton().init("scrollV");
};

Neo.start = function (isApp) {
  if (Neo.viewer) return;

  Neo.initSkin();
  Neo.initComponents();

  Neo.initButtons();

  Neo.isApp = isApp;
  if (Neo.applet) {
    var name = Neo.applet.attributes.name.value || "paintbbs";
    Neo.applet.outerHTML = "";
    document[name] = Neo;

    Neo.resizeCanvas();
    Neo.container.style.visibility = "visible";

    if (Neo.isApp) {
      var ipc = require("electron").ipcRenderer;
      ipc.sendToHost("neo-status", "ok");
    } else {
      if (document.paintBBSCallback) {
        document.paintBBSCallback("start");
      }
    }
  }
};

Neo.isIE = function () {
  var ms = false;
  if (/MSIE 10/i.test(navigator.userAgent)) {
    ms = true; // This is internet explorer 10
  }
  if (
    /MSIE 9/i.test(navigator.userAgent) ||
    /rv:11.0/i.test(navigator.userAgent)
  ) {
    ms = true; // This is internet explorer 9 or 11
  }
  return ms;
};

Neo.isMobile = function () {
  if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) return true;
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true;
  return false;
};

Neo.showWarning = function () {
  var futaba = location.hostname.match(/2chan.net/i);
  var samplebbs = location.hostname.match(/neo.websozai.jp/i);

  var chrome = navigator.userAgent.match(/Chrome\/(\d+)/i);
  if (chrome && chrome.length > 1) chrome = chrome[1];

  var edge = navigator.userAgent.match(/Edge\/(\d+)/i);
  if (edge && edge.length > 1) edge = edge[1];

  var ms = Neo.isIE();

  var str = "";
  if (futaba || samplebbs) {
    if (ms || (edge && edge < 15)) {
      str = Neo.translate(
        "このブラウザでは<br>投稿に失敗することがあります<br>"
      );
    }
  }

  // もし<PARAM NAME="neo_warning" VALUE="...">があれば表示する
  if (Neo.config.neo_warning) {
    str += Neo.config.neo_warning;
  }

  var warning = document.getElementById("neoWarning");
  if (warning) {
    warning.innerHTML = str;
    setTimeout(function () {
      warning.style.opacity = "0";
    }, 15000);
  }
};

/*
   -----------------------------------------------------------------------
   UIの更新
   -----------------------------------------------------------------------
 */

Neo.updateUI = function () {
  var current = Neo.painter.tool.getToolButton();
  for (var i = 0; i < Neo.toolButtons.length; i++) {
    var toolTip = Neo.toolButtons[i];
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

Neo.updateUIColor = function (updateSlider, updateColorTip) {
  for (var i = 0; i < Neo.toolButtons.length; i++) {
    var toolTip = Neo.toolButtons[i];
    toolTip.update();
  }

  if (updateSlider) {
    for (var i = 0; i < Neo.sliders.length; i++) {
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

Neo.updateWindow = function () {
  if (Neo.fullScreen) {
    document.getElementById("windowView").style.display = "block";
    document.getElementById("windowView").appendChild(Neo.container);
  } else {
    document.getElementById("windowView").style.display = "none";
    document.getElementById("pageView").appendChild(Neo.container);
  }
  Neo.resizeCanvas();
};

Neo.resizeCanvas = function () {
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

  Neo.painter.destCanvas.width = width;
  Neo.painter.destCanvas.height = height;
  Neo.painter.destCanvasCtx = Neo.painter.destCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  Neo.painter.destCanvasCtx.imageSmoothingEnabled = false;
  //Neo.painter.destCanvasCtx.mozImageSmoothingEnabled = false;

  Neo.canvas.style.width = width + "px";
  Neo.canvas.style.height = height + "px";

  if (Neo.toolsWrapper) {
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
  Neo.painter.updateDestCanvas(0, 0, canvasWidth, canvasHeight);
};

/*
   -----------------------------------------------------------------------
   投稿
   -----------------------------------------------------------------------
 */

Neo.clone = function (src) {
  var dst = {};
  for (var k in src) {
    dst[k] = src[k];
  }
  return dst;
};

Neo.getSizeString = function (len) {
  var result = String(len);
  while (result.length < 8) {
    result = "0" + result;
  }
  return result;
};

Neo.openURL = function (url) {
  if (Neo.isApp) {
    require("electron").shell.openExternal(url);
  } else {
    window.open(url, "_blank");
  }
};

Neo.getAbsoluteURL = function (board, url) {
  if (url && (url.indexOf("://") > 0 || url.indexOf("//") === 0)) {
    return url;
  } else {
    return board + url;
  }
};

Neo.submit = function (board, blob, thumbnail, thumbnail2) {
  var url = Neo.getAbsoluteURL(board, Neo.config.url_save);
  var headerString = Neo.str_header || "";

  if (document.paintBBSCallback) {
    var result = document.paintBBSCallback("check");
    if (result == 0 || result == "false") {
      return;
    }

    result = document.paintBBSCallback("header");
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
  var timer = new Date() - Neo.painter.securityTimer;
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
      const maxSize = Number(Neo.config.animation_max)*1024;
      if (maxSize < thumbnailSize) {
        thumbnail2 = null;
      }
    }
  }
  if (Neo.config.neo_send_with_formdata == "true") {
    var formData = new FormData();
    formData.append("header", headerString);
    formData.append("picture", blob, blob);
    let thumbnail_size = 0;
    if (thumbnail) {
      formData.append("thumbnail", thumbnail, blob);
      thumbnail_size = thumbnail.size;
    }
    if (thumbnail2) {
    // 動画容量を制限するNEO独自のパラメータ
    // 単位MB
    if (
        !Neo.config.neo_max_pch ||
        isNaN(Neo.config.neo_max_pch) ||
        Number(Neo.config.neo_max_pch) * 1024 * 1024 >
          headerString.length + blob.size + thumbnail_size + thumbnail2.size
      ) {
        formData.append("pch", thumbnail2, blob);
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

  var futaba = location.hostname.match(/2chan.net/i);
  var subtype = futaba ? "octet-binary" : "octet-stream"; // 念のため
  var body = new Blob(array, { type: "application/" + subtype });

  const postData = (path, data) => {
    var errorMessage = path + "\n";

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
              Neo.submitButton.enable();
              return alert(text.replace(/^error\n/m, ""));
            }
            if (text !== "ok") {
              Neo.submitButton.enable();
              return alert(
                errorMessage +
                  Neo.translate(
                    "投稿に失敗。時間を置いて再度投稿してみてください。"
                  )
              );
            }
            var exitURL = Neo.getAbsoluteURL(board, Neo.config.url_exit);
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
            if (typeof Neo.handleExit === "function") {
              return Neo.handleExit();
            }
            return (location.href = exitURL);
          });
        } else {
          Neo.submitButton.enable();
          let response_status = response.status;
          if (response_status == 403) {
            return alert(
              errorMessage +
                Neo.translate(
                  "投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。"
                )
            );
          }
          if (response_status === 404) {
            return alert(
              errorMessage + Neo.translate("ファイルが見当たりません。")
            );
          }
          return alert(
            errorMessage +
              Neo.translate(
                "投稿に失敗。時間を置いて再度投稿してみてください。"
              )
          );
        }
      })
      .catch((error) => {
        Neo.submitButton.enable();
        return alert(
          errorMessage +
            Neo.translate("投稿に失敗。時間を置いて再度投稿してみてください。")
        );
      });
  };

  if (Neo.config.neo_confirm_layer_info_notsaved && !thumbnail2) {
    const isConfirmed = window.confirm(
      Neo.translate("レイヤー情報は保存されません。\n続行してよろしいですか?")
    );
  
    if (!isConfirmed) {
      Neo.submitButton.enable();
      console.log("中止しました。");
      return;  // ユーザーが続行しない場合、処理を中断
    }
  }

  // データ送信処理
  const data = Neo.config.neo_send_with_formdata === "true" ? formData : body;
  postData(url, data);
};

/*
  -----------------------------------------------------------------------
    LiveConnect
  -----------------------------------------------------------------------
*/

Neo.getColors = function () {
  console.log("getColors");
  console.log("defaultColors==", Neo.config.colors.join("\n"));
  var array = [];
  for (var i = 0; i < 14; i++) {
    array.push(Neo.colorTips[i].color);
  }
  return array.join("\n");
  //  return Neo.config.colors.join('\n');
};

Neo.setColors = function (colors) {
  console.log("setColors");
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

Neo.createContainer = function (applet) {
  var neo = document.createElement("div");
  neo.className = "NEO";
  neo.id = "NEO";

  var html =
    '<div id="pageView" style="margin:auto; width:450px; height:470px;">' +
    '<div id="container" style="visibility:hidden;" class="o">' +
    '<div id="center" class="o">' +
    '<div id="painterContainer" class="o">' +
    '<div id="painterWrapper" class="o">' +
    '<div id="upper" class="o">' +
    '<div id="redo">[やり直し]</div> ' +
    '<div id="undo">[元に戻す]</div> ' +
    '<div id="fill">[塗り潰し]</div> ' +
    '<div id="right" style="display:none;">[右]</div> ' +
    "</div>" +
    '<div id="painter">' +
    '<div id="canvas">' +
    '<div id="scrollH"></div>' +
    '<div id="scrollV"></div>' +
    '<div id="zoomPlusWrapper">' +
    '<div id="zoomPlus">+</div>' +
    "</div>" +
    '<div id="zoomMinusWrapper">' +
    '<div id="zoomMinus">-</div>' +
    "</div>" +
    '<div id="neoWarning"></div>' +
    "</div>" +
    "</div>" +
    '<div id="lower" class="o">' +
    "</div>" +
    "</div>" +
    '<div id="toolsWrapper">' +
    '<div id="tools">' +
    '<div id="toolSet">' +
    '<div id="pen"></div>' +
    '<div id="pen2"></div>' +
    '<div id="effect"></div>' +
    '<div id="effect2"></div>' +
    '<div id="eraser"></div>' +
    '<div id="draw"></div>' +
    '<div id="mask"></div>' +
    '<div class="colorTips">' +
    '<div id="color2"></div><div id="color1"></div><br>' +
    '<div id="color4"></div><div id="color3"></div><br>' +
    '<div id="color6"></div><div id="color5"></div><br>' +
    '<div id="color8"></div><div id="color7"></div><br>' +
    '<div id="color10"></div><div id="color9"></div><br>' +
    '<div id="color12"></div><div id="color11"></div><br>' +
    '<div id="color14"></div><div id="color13"></div>' +
    "</div>" +
    '<div id="sliderRed"></div>' +
    '<div id="sliderGreen"></div>' +
    '<div id="sliderBlue"></div>' +
    '<div id="sliderAlpha"></div>' +
    '<div id="sliderSize"></div>' +
    '<div class="reserveControl" style="margin-top:4px;">' +
    '<div id="reserve1"></div>' +
    '<div id="reserve2"></div>' +
    '<div id="reserve3"></div>' +
    "</div>" +
    '<div id="layerControl" style="margin-top:6px;"></div>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="headerButtons">' +
    '<div id="window">[窓]</div>' +
    "</div>" +
    '<div id="footerButtons">' +
    '<div id="submit">[投稿]</div> ' +
    '<div id="copyright">[(C)しぃちゃん PaintBBS NEO]</div> ' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div id="windowView" style="display: none;">' +
    "</div>";

  neo.innerHTML = html.replace(/\[(.*?)\]/g, function (match, str) {
    return Neo.translate(str);
  });

  var parent = applet.parentNode;
  parent.appendChild(neo);
  parent.insertBefore(neo, applet);

  //  applet.style.display = "none";

  // NEOを組み込んだURLをアプリ版で開くとDOMツリーが2重にできて格好悪いので消しておく
  setTimeout(function () {
    var tmp = document.getElementsByClassName("NEO");
    if (tmp.length > 1) {
      for (var i = 1; i < tmp.length; i++) {
        tmp[i].style.display = "none";
      }
    }
  }, 0);
};

Neo.tintImage = function (ctx, c) {
  c = Neo.painter.getColor(c) & 0xffffff;

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

Neo.setToolSide = function (side) {
  if (side === "left") side = true;
  if (side === "right") side = false;
  Neo.toolSide = !!side;

  if (!Neo.toolSide) {
    Neo.addRule(".NEO #toolsWrapper", "right", "-3px");
    Neo.addRule(".NEO #toolsWrapper", "left", "auto");
    Neo.addRule(".NEO #painterWrapper", "padding", "0 55px 0 0 !important");
    Neo.addRule(".NEO #upper", "padding-right", "75px !important");
  } else {
    Neo.addRule(".NEO #toolsWrapper", "right", "auto");
    Neo.addRule(".NEO #toolsWrapper", "left", "-1px");
    Neo.addRule(".NEO #painterWrapper", "padding", "0 0 0 55px !important");
    Neo.addRule(".NEO #upper", "padding-right", "20px !important");
  }
};

"use strict";

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
    "投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。":
      "It may be a WAF false positive.\nTry to draw a little more.",
    "ファイルが見当たりません。": "File not found",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
    "Layer information will not be saved.\nIs that okay?",
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
    "投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。":
      "It may be a WAF false positive.\nTry to draw a little more.",
    "ファイルが見当たりません。": "File not found.",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
    "Layer information will not be saved.\nIs that okay?",
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
    "投稿に失敗。\nWAFの誤検知かもしれません。\nもう少し描いてみてください。":
      "Puede ser un falso positivo de WAF.\nIntenta dibujar un poco más.",
    "ファイルが見当たりません。": "Archivo no encontrado.",
    "レイヤー情報は保存されません。\n続行してよろしいですか?":
    "La información de las capas no se guardará.\n¿Está bien?",
  },
};

Neo.translate = (function () {
  var language =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    window.navigator.browserLanguage;

  var lang = "en";
  for (var key in Neo.dictionary) {
    if (language.indexOf(key) == 0) {
      lang = key;
      break;
    }
  }

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

Neo.Painter = function () {
  this._undoMgr = new Neo.UndoManager(50);
  this._actionMgr = new Neo.ActionManager();
};

Neo.Painter.prototype.container;
Neo.Painter.prototype._undoMgr;
Neo.Painter.prototype._actionMgr;
Neo.Painter.prototype.tool;
Neo.Painter.prototype.inputText;

//Canvas Info
Neo.Painter.prototype.canvasWidth;
Neo.Painter.prototype.canvasHeight;
Neo.Painter.prototype.canvas = [];
Neo.Painter.prototype.canvasCtx = [];
Neo.Painter.prototype.visible = [];
Neo.Painter.prototype.current = 0;

//Temp Canvas Info
Neo.Painter.prototype.tempCanvas;
Neo.Painter.prototype.tempCanvasCtx;
Neo.Painter.prototype.tempX = 0;
Neo.Painter.prototype.tempY = 0;

//Destination Canvas for display
Neo.Painter.prototype.destCanvas;
Neo.Painter.prototype.destCanvasCtx;

Neo.Painter.prototype.backgroundColor = "#ffffff";
Neo.Painter.prototype.foregroundColor = "#000000";

Neo.Painter.prototype.lineWidth = 1;
Neo.Painter.prototype.alpha = 1;
Neo.Painter.prototype.zoom = 1;
Neo.Painter.prototype.zoomX = 0;
Neo.Painter.prototype.zoomY = 0;

Neo.Painter.prototype.isMouseDown;
Neo.Painter.prototype.isMouseDownRight;
Neo.Painter.prototype.prevMouseX;
Neo.Painter.prototype.prevMouseY;
Neo.Painter.prototype.mouseX;
Neo.Painter.prototype.mouseY;

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
Neo.Painter.prototype._roundData = [];
Neo.Painter.prototype._toneData = [];
Neo.Painter.prototype.toolStack = [];

Neo.Painter.prototype.maskType = 0;
Neo.Painter.prototype.drawType = 0;
Neo.Painter.prototype.maskColor = "#000000";
Neo.Painter.prototype._currentColor = [];
Neo.Painter.prototype._currentMask = [];

Neo.Painter.prototype.aerr;
Neo.Painter.prototype.dirty = false;
Neo.Painter.prototype.busy = false;
Neo.Painter.prototype.busySkipped = false;

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

Neo.Painter.prototype.build = function (div, width, height) {
  this.container = div;
  this._initCanvas(div, width, height);
  this._initRoundData();
  this._initToneData();
  this._initInputText();

  this.setTool(new Neo.PenTool());
};

Neo.Painter.prototype.setTool = function (tool) {
  if (this.tool && this.tool.saveStates) this.tool.saveStates();

  if (this.tool && this.tool.kill) {
    this.tool.kill();
  }
  this.tool = tool;
  tool.init();
  if (this.tool && this.tool.loadStates) this.tool.loadStates();
};

Neo.Painter.prototype.pushTool = function (tool) {
  this.toolStack.push(this.tool);
  this.tool = tool;
  tool.init();
};

Neo.Painter.prototype.popTool = function () {
  var tool = this.tool;
  if (tool && tool.kill) {
    tool.kill();
  }
  this.tool = this.toolStack.pop();
};

Neo.Painter.prototype.getCurrentTool = function () {
  if (this.tool) {
    var tool = this.tool;
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

Neo.Painter.prototype.setToolByType = function (toolType) {
  switch (parseInt(toolType)) {
    case Neo.Painter.TOOLTYPE_PEN:
      this.setTool(new Neo.PenTool());
      break;
    case Neo.Painter.TOOLTYPE_ERASER:
      this.setTool(new Neo.EraserTool());
      break;
    case Neo.Painter.TOOLTYPE_HAND:
      this.setTool(new Neo.HandTool());
      break;
    case Neo.Painter.TOOLTYPE_FILL:
      this.setTool(new Neo.FillTool());
      break;
    case Neo.Painter.TOOLTYPE_ERASEALL:
      this.setTool(new Neo.EraseAllTool());
      break;
    case Neo.Painter.TOOLTYPE_ERASERECT:
      this.setTool(new Neo.EraseRectTool());
      break;

    case Neo.Painter.TOOLTYPE_COPY:
      this.setTool(new Neo.CopyTool());
      break;
    case Neo.Painter.TOOLTYPE_PASTE:
      this.setTool(new Neo.PasteTool());
      break;
    case Neo.Painter.TOOLTYPE_MERGE:
      this.setTool(new Neo.MergeTool());
      break;
    case Neo.Painter.TOOLTYPE_FLIP_H:
      this.setTool(new Neo.FlipHTool());
      break;
    case Neo.Painter.TOOLTYPE_FLIP_V:
      this.setTool(new Neo.FlipVTool());
      break;

    case Neo.Painter.TOOLTYPE_BRUSH:
      this.setTool(new Neo.BrushTool());
      break;
    case Neo.Painter.TOOLTYPE_TEXT:
      this.setTool(new Neo.TextTool());
      break;
    case Neo.Painter.TOOLTYPE_TONE:
      this.setTool(new Neo.ToneTool());
      break;
    case Neo.Painter.TOOLTYPE_BLUR:
      this.setTool(new Neo.BlurTool());
      break;
    case Neo.Painter.TOOLTYPE_DODGE:
      this.setTool(new Neo.DodgeTool());
      break;
    case Neo.Painter.TOOLTYPE_BURN:
      this.setTool(new Neo.BurnTool());
      break;

    case Neo.Painter.TOOLTYPE_RECT:
      this.setTool(new Neo.RectTool());
      break;
    case Neo.Painter.TOOLTYPE_RECTFILL:
      this.setTool(new Neo.RectFillTool());
      break;
    case Neo.Painter.TOOLTYPE_ELLIPSE:
      this.setTool(new Neo.EllipseTool());
      break;
    case Neo.Painter.TOOLTYPE_ELLIPSEFILL:
      this.setTool(new Neo.EllipseFillTool());
      break;
    case Neo.Painter.TOOLTYPE_BLURRECT:
      this.setTool(new Neo.BlurRectTool());
      break;
    case Neo.Painter.TOOLTYPE_TURN:
      this.setTool(new Neo.TurnTool());
      break;

    default:
      console.log("unknown toolType " + toolType);
      break;
  }
};

Neo.Painter.prototype._initCanvas = function (div, width, height) {
  width = parseInt(width);
  height = parseInt(height);
  var destWidth = parseInt(div.clientWidth);
  var destHeight = parseInt(div.clientHeight);
  this.destWidth = width;
  this.destHeight = height;

  this.canvasWidth = width;
  this.canvasHeight = height;
  this.zoomX = width * 0.5;
  this.zoomY = height * 0.5;

  this.securityTimer = new Date() - 0;
  this.securityCount = 0;

  for (var i = 0; i < 2; i++) {
    this.canvas[i] = document.createElement("canvas");
    this.canvas[i].width = width;
    this.canvas[i].height = height;
    this.canvasCtx[i] = this.canvas[i].getContext("2d", {
      willReadFrequently: true,
    });

    this.canvas[i].style.imageRendering = "pixelated";
    this.canvasCtx[i].imageSmoothingEnabled = false;
    this.canvasCtx[i].mozImageSmoothingEnabled = false;
    this.visible[i] = true;
  }

  this.tempCanvas = document.createElement("canvas");
  this.tempCanvas.width = width;
  this.tempCanvas.height = height;
  this.tempCanvasCtx = this.tempCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  this.tempCanvas.style.position = "absolute";
  this.tempCanvas.enabled = false;

  var array = this.container.getElementsByTagName("canvas");
  if (array.length > 0) {
    this.destCanvas = array[0];
  } else {
    this.destCanvas = document.createElement("canvas");
    this.container.appendChild(this.destCanvas);
  }

  this.destCanvasCtx = this.destCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  this.destCanvas.width = destWidth;
  this.destCanvas.height = destHeight;

  this.destCanvas.style.imageRendering = "pixelated";
  this.destCanvasCtx.imageSmoothingEnabled = false;
  this.destCanvasCtx.mozImageSmoothingEnabled = false;

  var ref = this;

  if (!Neo.viewer) {
    var container = document.getElementById("container");

    container.onmousedown = function (e) {
      ref._mouseDownHandler(e);
    };
    container.onmousemove = function (e) {
      ref._mouseMoveHandler(e);
    };
    container.onmouseup = function (e) {
      ref._mouseUpHandler(e);
    };
    container.onmouseover = function (e) {
      ref._rollOverHandler(e);
    };
    container.onmouseout = function (e) {
      ref._rollOutHandler(e);
    };
    container.addEventListener(
      "touchstart",
      function (e) {
        ref._mouseDownHandler(e);
      },
      { passive: false, capture: false }
    );
    container.addEventListener(
      "touchmove",
      function (e) {
        ref._mouseMoveHandler(e);
      },
      { passive: false, capture: false }
    );
    container.addEventListener(
      "touchend",
      function (e) {
        ref._mouseUpHandler(e);
      },
      { passive: false, capture: false }
    );

    document.onkeydown = function (e) {
      ref._keyDownHandler(e);
    };
    document.onkeyup = function (e) {
      ref._keyUpHandler(e);
    };
  }

  if (Neo.config.neo_confirm_unload == "true") {
    window.onbeforeunload = function () {
      if (!Neo.uploaded && Neo.painter.isDirty()) {
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
    this._toneData[i] = new Uint8Array(16);
    for (var j = 0; j < 16; j++) {
      this._toneData[i][j] = i >= pattern[j] ? 1 : 0;
    }
  }
};

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

Neo.Painter.prototype._initInputText = function () {
  var text = document.getElementById("inputtext");
  if (!text) {
    text = document.createElement("div");
  }

  text.id = "inputext";
  text.setAttribute("contentEditable", true);
  text.spellcheck = false;
  text.className = "inputText";
  text.innerHTML = "";

  text.style.display = "none";
  //  text.style.userSelect = "none";
  Neo.painter.container.appendChild(text);
  this.inputText = text;

  this.updateInputText();
};

Neo.Painter.prototype.hideInputText = function () {
  var text = this.inputText;
  text.blur();
  text.style.display = "none";
};

Neo.Painter.prototype.updateInputText = function () {
  var text = this.inputText;
  var d = this.lineWidth;
  var fontSize = Math.round((d * 55) / 28 + 7);
  var height = Math.round((d * 68) / 28 + 12);

  text.style.fontSize = fontSize + "px";
  text.style.lineHeight = fontSize + "px";
  text.style.height = fontSize + "px";
  text.style.marginTop = -fontSize + "px";
};

/*
   -----------------------------------------------------------------------
   Mouse Event Handling
   -----------------------------------------------------------------------
 */

Neo.Painter.prototype._keyDownHandler = function (e) {
  this.isShiftDown = e.shiftKey;
  this.isCtrlDown = e.ctrlKey;
  this.isAltDown = e.altKey;
  var key = e.key.toLowerCase();
  if (key === " ") this.isSpaceDown = true;

  if (!this.isShiftDown && this.isCtrlDown) {
    if (!this.isAltDown) {
      if (key === "z" || key === "u") this.undo(); // Ctrl+Z, Ctrl+U
      if (key === "y") this.redo(); // Ctrl+Y
    } else {
      if (key === "z") this.redo(); // Ctrl+Alt+Z
    }
  }
  if (!this.isShiftDown && !this.isCtrlDown && !this.isAltDown) {
    if (key == "+") new Neo.ZoomPlusCommand(this).execute(); // +
    if (key == "-") new Neo.ZoomMinusCommand(this).execute(); // -
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
  if ((e.ctrlKey || e.metaKey) && keys.includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
  //text入力と、入力フォーム以外はすべてのキーボードイベントを無効化
  if (document.activeElement != this.inputText) {
    if (
      !(
        document.activeElement.tagName.toLocaleUpperCase() === "INPUT" ||
        document.activeElement.tagName.toLocaleUpperCase() === "TEXTAREA"
      )
    ) {
      e.preventDefault();
    }
  }
};
Neo.Painter.prototype._keyUpHandler = function (e) {
  this.isShiftDown = e.shiftKey;
  this.isCtrlDown = e.ctrlKey;
  this.isAltDown = e.altKey;
  if (e.key == " ") this.isSpaceDown = false;

  if (this.tool.keyUpHandler) {
    this.tool.keyUpHandler(oe);
  }
};

Neo.Painter.prototype._rollOverHandler = function (e) {
  if (this.tool.rollOverHandler) {
    this.tool.rollOverHandler(this);
  }
};

Neo.Painter.prototype._rollOutHandler = function (e) {
  if (this.tool.rollOutHandler) {
    this.tool.rollOutHandler(this);
  }
};

Neo.Painter.prototype._mouseDownHandler = function (e) {
  if (this.busy) {
    // loadAnimation実行中は何もしない
    if (e.target == Neo.painter.destCanvas) {
      this.busySkipped = true;
    }
    return;
  }

  if (e.target == Neo.painter.destCanvas) {
    //よくわからないがChromeでドラッグの時カレットが出るのを防ぐ
    //http://stackoverflow.com/questions/2745028/chrome-sets-cursor-to-text-while-dragging-why
    e.preventDefault();
  }

  if (e.type == "touchstart" && e.touches.length > 1) return;

  if (e.button == 2 || this.virtualRight) {
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
  if (autosaveCount % 10 === 0 && Neo.painter.isDirty()) {
    Neo.painter.saveSession(); //10ストロークごとに自動バックアップ
  }

  if (this.isMouseDownRight) {
    this.isMouseDownRight = false;
    if (!this.isWidget(e.target)) {
      this.pickColor(this.mouseX, this.mouseY);
      return;
    }
  }

  if (!this.isUIPaused()) {
    if (e.target["data-bar"]) {
      this.pushTool(new Neo.HandTool());
    } else if (this.isSpaceDown && document.activeElement != this.inputText) {
      this.pushTool(new Neo.HandTool());
      this.tool.reverse = true;
    } else if (e.target["data-slider"] != undefined) {
      this.pushTool(new Neo.SliderTool());
      this.tool.target = e.target;
    } else if (e.ctrlKey && e.altKey && !e.shiftKey) {
      this.pushTool(new Neo.SliderTool());
      this.tool.target = Neo.sliders[Neo.SLIDERTYPE_SIZE].element;
      this.tool.alt = true;
    } else if (this.isWidget(e.target)) {
      this.isMouseDown = false;
      this.pushTool(new Neo.DummyTool());
    }
  }

  //  console.warn("down -" + e.target.id + e.target.className)
  if (!(e.target.className == "o" && e.type == "touchdown")) {
    this.tool.downHandler(this);
  }

  //  var ref = this;
  //  document.onmouseup = function(e) {
  //      ref._mouseUpHandler(e)
  //  };
};

Neo.Painter.prototype._mouseUpHandler = function (e) {
  this.isMouseDown = false;
  this.isMouseDownRight = false;
  this.tool.upHandler(this);
  //  document.onmouseup = undefined;

  if (e.target.id != "right") {
    this.virtualRight = false;
    Neo.RightButton.clear();
  }

  //  if (e.changedTouches) {
  //      for (var i = 0; i < e.changedTouches.length; i++) {
  //          var touch = e.changedTouches[i];
  //          if (touch.identifier == this.touchModifier) {
  //              this.touchModifier = null;
  //          }
  //      }
  //  }
};

Neo.Painter.prototype._mouseMoveHandler = function (e) {
  this._updateMousePosition(e);

  if (e.type == "touchmove" && e.touches.length > 1) return;

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
  if (!(e.target.className == "o" && e.type == "touchmove")) {
    e.preventDefault();
  }
};

Neo.Painter.prototype.getPosition = function (e) {
  if (e.clientX !== undefined) {
    return { x: e.clientX, y: e.clientY, e: e.type };
  } else {
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
  }
};

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
    this.prevMosueY = this.mouseY;
  }

  /*
     this.slowX = this.slowX * 0.8 + this.mouseX * 0.2;
     this.slowY = this.slowY * 0.8 + this.mouseY * 0.2;
     var now = new Date().getTime();
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

Neo.Painter.prototype._beforeUnloadHandler = function (e) {
  // quick save
};

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

  if (undoItem) {
    this._pushRedo();
    this._actionMgr.back();

    this.canvasCtx[0].putImageData(undoItem.data[0], undoItem.x, undoItem.y);
    this.canvasCtx[1].putImageData(undoItem.data[1], undoItem.x, undoItem.y);
    this.updateDestCanvas(
      undoItem.x,
      undoItem.y,
      undoItem.width,
      undoItem.height
    );
  }
};

Neo.Painter.prototype.redo = function () {
  var undoItem = this._undoMgr.popRedo();

  if (undoItem) {
    this._actionMgr.forward();

    this._pushUndo(0, 0, this.canvasWidth, this.canvasHeight, true);
    this.canvasCtx[0].putImageData(undoItem.data[0], undoItem.x, undoItem.y);
    this.canvasCtx[1].putImageData(undoItem.data[1], undoItem.x, undoItem.y);
    this.updateDestCanvas(
      undoItem.x,
      undoItem.y,
      undoItem.width,
      undoItem.height
    );
  }
};

//Neo.Painter.prototype.hasUndo = function() {
//    return true;
//};

Neo.Painter.prototype._pushUndo = function (x, y, w, h, holdRedo) {
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

Neo.UndoManager = function (_maxStep) {
  this._maxStep = _maxStep;
  this._undoItems = [];
  this._redoItems = [];
};
Neo.UndoManager.prototype._maxStep;
Neo.UndoManager.prototype._redoItems;
Neo.UndoManager.prototype._undoItems;

//アクションをしてUndo情報を更新
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

Neo.UndoManager.prototype.pushRedo = function (undoItem) {
  this._redoItems.push(undoItem);
};

Neo.UndoManager.prototype.popRedo = function () {
  return this._redoItems.pop();
};

Neo.UndoItem = function () {};
Neo.UndoItem.prototype.data;
Neo.UndoItem.prototype.x;
Neo.UndoItem.prototype.y;
Neo.UndoItem.prototype.width;
Neo.UndoItem.prototype.height;

/*
   -------------------------------------------------------------------------
   Zoom Controller
   -------------------------------------------------------------------------
 */

Neo.Painter.prototype.setZoom = function (value) {
  this.zoom = value;

  var container = document.getElementById("container");
  var width = this.canvasWidth * this.zoom;
  var height = this.canvasHeight * this.zoom;
  if (width > container.clientWidth - 100) width = container.clientWidth - 100;
  if (height > container.clientHeight - 130)
    height = container.clientHeight - 130;
  this.destWidth = width;
  this.destHeight = height;

  this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, false);
  this.setZoomPosition(this.zoomX, this.zoomY);
};

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

Neo.Painter.prototype.submit = function (board) {
  if (Neo.animation) {
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

  Neo.submit(board, this.getPNG(), thumbnail2, thumbnail);
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

Neo.Painter.prototype.getImage = function (imageWidth, imageHeight) {
  var width = this.canvasWidth;
  var height = this.canvasHeight;
  imageWidth = imageWidth || width;
  imageHeight = imageHeight || height;

  var pngCanvas = document.createElement("canvas");
  pngCanvas.width = imageWidth;
  pngCanvas.height = imageHeight;
  var pngCanvasCtx = pngCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  pngCanvasCtx.fillStyle = "#ffffff";
  pngCanvasCtx.fillRect(0, 0, imageWidth, imageHeight);

  if (this.visible[0]) {
    pngCanvasCtx.drawImage(
      this.canvas[0],
      0,
      0,
      width,
      height,
      0,
      0,
      imageWidth,
      imageHeight
    );
  }
  if (this.visible[1]) {
    pngCanvasCtx.drawImage(
      this.canvas[1],
      0,
      0,
      width,
      height,
      0,
      0,
      imageWidth,
      imageHeight
    );
  }
  return pngCanvas;
};

Neo.Painter.prototype.getPNG = function () {
  var image = this.getImage();
  var dataURL = image.toDataURL("image/png");
  return this.dataURLtoBlob(dataURL);
};

Neo.Painter.prototype.getThumbnail = function (type) {
  if (type != "animation") {
    var thumbnailWidth = this.getThumbnailWidth();
    var thumbnailHeight = this.getThumbnailHeight();
    if (thumbnailWidth || thumbnailHeight) {
      var width = this.canvasWidth;
      var height = this.canvasHeight;
      if (thumbnailWidth == 0) {
        thumbnailWidth = (thumbnailHeight * width) / height;
      }
      if (thumbnailHeight == 0) {
        thumbnailHeight = (thumbnailWidth * height) / width;
      }
    } else {
      thumbnailWidth = thumbnailHeight = null;
    }

    console.log("get thumbnail", thumbnailWidth, thumbnailHeight);

    var image = this.getImage(thumbnailWidth, thumbnailHeight);
    var dataURL = image.toDataURL("image/" + type);
    return this.dataURLtoBlob(dataURL);
  } else {
    var data = JSON.stringify(this._actionMgr._items);
    data = LZString.compressToUint8Array(data);

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

Neo.Painter.prototype.updateDestCanvas = function (
  x,
  y,
  width,
  height,
  useTemp
) {
  var canvasWidth = this.canvasWidth;
  var canvasHeight = this.canvasHeight;
  var updateAll = false;
  if (x == 0 && y == 0 && width == canvasWidth && height == canvasHeight) {
    updateAll = true;
  }

  if (x + width > this.canvasWidth) width = this.canvasWidth - x;
  if (y + height > this.canvasHeight) height = this.canvasHeight - y;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (width <= 0 || height <= 0) return;

  var ctx = this.destCanvasCtx;
  ctx.save();
  ctx.fillStyle = "#ffffff";

  var fillWidth = width;
  var fillHeight = height;

  if (updateAll) {
    ctx.fillRect(0, 0, this.destCanvas.width, this.destCanvas.height);
  } else {
    //カーソルの描画ゴミが残るのをごまかすため
    if (x + width == this.canvasWidth) fillWidth = width + 1;
    if (y + height == this.canvasHeight) fillHeight = height + 1;
  }

  ctx.translate(this.destCanvas.width * 0.5, this.destCanvas.height * 0.5);
  ctx.scale(this.zoom, this.zoom);
  ctx.translate(-this.zoomX, -this.zoomY);
  ctx.globalAlpha = 1.0;
  ctx.msImageSmoothingEnabled = 0;

  if (!updateAll) {
    ctx.fillRect(x, y, fillWidth, fillHeight);
  }

  if (this.visible[0]) {
    ctx.drawImage(this.canvas[0], x, y, width, height, x, y, width, height);
  }
  if (this.visible[1]) {
    ctx.drawImage(this.canvas[1], x, y, width, height, x, y, width, height);
  }
  if (useTemp) {
    ctx.globalAlpha = 1.0; //this.alpha;
    ctx.drawImage(
      this.tempCanvas,
      x,
      y,
      width,
      height,
      x + this.tempX,
      y + this.tempY,
      width,
      height
    );
  }
  ctx.restore();
};

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

Neo.Painter.prototype.getColor = function (c) {
  if (!c) c = this.foregroundColor;
  var r = parseInt(c.slice(1, 3), 16);
  var g = parseInt(c.slice(3, 5), 16);
  var b = parseInt(c.slice(5, 7), 16);
  var a = Math.floor(this.alpha * 255);
  return (a << 24) | (b << 16) | (g << 8) | r;
};

Neo.Painter.prototype.getColorString = function (c) {
  var rgb = ("000000" + (c & 0xffffff).toString(16)).slice(-6);
  return "#" + rgb;
};

Neo.Painter.prototype.setColor = function (c) {
  if (typeof c != "string") c = this.getColorString(c);
  this.foregroundColor = c;

  Neo.updateUI();
};

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

Neo.Painter.prototype.setPoint = function (
  buf8,
  bufWidth,
  x0,
  y0,
  left,
  top,
  type
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

Neo.Painter.prototype.setPenPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
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
        var r0 = buf8[index + 0];
        var g0 = buf8[index + 1];
        var b0 = buf8[index + 2];
        var a0 = buf8[index + 3] / 255.0;

        var a = a0 + a1 - a0 * a1;
        if (a > 0) {
          var a1x = Math.max(a1, 1.0 / 255);

          var r = (r1 * a1x + r0 * a0 * (1 - a1x)) / a;
          var g = (g1 * a1x + g0 * a0 * (1 - a1x)) / a;
          var b = (b1 * a1x + b0 * a0 * (1 - a1x)) / a;

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

Neo.Painter.prototype.setBrushPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
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
        var r0 = buf8[index + 0];
        var g0 = buf8[index + 1];
        var b0 = buf8[index + 2];
        var a0 = buf8[index + 3] / 255.0;

        var a = a0 + a1 - a0 * a1;
        if (a > 0) {
          var a1x = Math.max(a1, 1.0 / 255);

          var r = (r1 * a1x + r0 * a0) / (a0 + a1x);
          var g = (g1 * a1x + g0 * a0) / (a0 + a1x);
          var b = (b1 * a1x + b0 * a0) / (a0 + a1x);

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

Neo.Painter.prototype.setDodgePoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
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
        var r0 = buf8[index + 0];
        var g0 = buf8[index + 1];
        var b0 = buf8[index + 2];
        var a0 = buf8[index + 3] / 255.0;

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

Neo.Painter.prototype.setBurnPoint = function (buf8, width, x, y) {
  var d = this._currentWidth;
  var r0 = Math.floor(d / 2);
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
        var r0 = buf8[index + 0];
        var g0 = buf8[index + 1];
        var b0 = buf8[index + 2];
        var a0 = buf8[index + 3] / 255.0;

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

//////////////////////////////////////////////////////////////////////

Neo.Painter.prototype.xorPixel = function (buf32, bufWidth, x, y, c) {
  var index = y * bufWidth + x;
  if (!c) c = 0xffffff;
  buf32[index] ^= c;
};

Neo.Painter.prototype.getBezierPoint = function (
  t,
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3
) {
  var a0 = (1 - t) * (1 - t) * (1 - t);
  var a1 = (1 - t) * (1 - t) * t * 3;
  var a2 = (1 - t) * t * t * 3;
  var a3 = t * t * t;

  var x = x0 * a0 + x1 * a1 + x2 * a2 + x3 * a3;
  var y = y0 * a0 + y1 * a1 + y2 * a2 + y3 * a3;
  return [x, y];
};

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
  isPreview
) {
  var points = [
    [x0, y0],
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
  var that = this;

  this.draw(ctx, points, function (left, top, width, height, buf8, imageData) {
    var n = Math.ceil((width + height) * 2.5);
    var oType = that._currentMaskType;
    var oAlpha = that._currentColor[3];

    if (isPreview) {
      that._currentMaskType = Neo.Painter.MASKTYPE_NONE;
      that._currentColor[3] = 255;
    }

    for (var i = 0; i < n; i++) {
      var t = (i * 1.0) / n;
      var p = that.getBezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3);

      p[0] = Math.round(p[0]);
      p[1] = Math.round(p[1]);

      that.plot(p, function (x, y) {
        that.setPoint(buf8, imageData.width, x, y, left, top, type);
      });
    }
    that._currentMaskType = oType;
    that._currentColor[3] = oAlpha;
    that.prevLine = null;
  });
};

Neo.Painter.prototype.prevLine = null; // 始点または終点が2度プロットされることがあるので
Neo.Painter.prototype.drawLine = function (ctx, x0, y0, x1, y1, type) {
  var points = [
    [x0, y0],
    [x1, y1],
  ];
  var that = this;
  this.aerr = 0;

  this.draw(ctx, points, function (left, top, width, height, buf8, imageData) {
    that.bresenham(points, function (x, y) {
      that.setPoint(buf8, imageData.width, x, y, left, top, type);
    });
  });
  this.prevLine = points;
};

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

Neo.Painter.prototype.drawPoint = function (ctx, x, y, type) {
  this.drawLine(ctx, x, y, x, y, type);
};

Neo.Painter.prototype.xorRect = function (
  buf32,
  bufWidth,
  x,
  y,
  width,
  height,
  c
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

Neo.Painter.prototype.drawXORRect = function (
  ctx,
  x,
  y,
  width,
  height,
  isFill,
  c
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

Neo.Painter.prototype.drawXOREllipse = function (
  ctx,
  x,
  y,
  width,
  height,
  isFill,
  c
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

Neo.Painter.prototype.merge = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

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
      var r = Math.floor((r1 * a1 + r0 * a0 * (1 - a1)) / a + 0.5);
      var g = Math.floor((g1 * a1 + g0 * a0 * (1 - a1)) / a + 0.5);
      var b = Math.floor((b1 * a1 + b0 * a0 * (1 - a1)) / a + 0.5);
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

Neo.Painter.prototype.pickColor = function (x, y) {
  var r = 0xff,
    g = 0xff,
    b = 0xff,
    a;

  x = Math.floor(x);
  y = Math.floor(y);
  if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
    for (var i = 0; i < 2; i++) {
      if (this.visible[i]) {
        var ctx = this.canvasCtx[i];
        var imageData = ctx.getImageData(x, y, 1, 1);
        var buf32 = new Uint32Array(imageData.data.buffer);
        var buf8 = new Uint8ClampedArray(imageData.data.buffer);

        var a = buf8[3] / 255.0;
        r = r * (1.0 - a) + buf8[2] * a;
        g = g * (1.0 - a) + buf8[1] * a;
        b = b * (1.0 - a) + buf8[0] * a;
      }
    }
    r = Math.max(Math.min(Math.round(r), 255), 0);
    g = Math.max(Math.min(Math.round(g), 255), 0);
    b = Math.max(Math.min(Math.round(b), 255), 0);
    var result = r | (g << 8) | (b << 16);
  }
  this.setColor(result);

  if (this.current > 0) {
    if (a == 0 && (result == 0xffffff || this.getEmulationMode() < 2.16)) {
      this.setToolByType(Neo.eraserTip.tools[Neo.eraserTip.mode]);
    } else {
      if (Neo.eraserTip.selected) {
        this.setToolByType(Neo.penTip.tools[Neo.penTip.mode]);
      }
    }
  }
};

Neo.Painter.prototype.fillHorizontalLine = function (buf32, x0, x1, y, color) {
  var index = y * this.canvasWidth + x0;
  for (var x = x0; x <= x1; x++) {
    buf32[index++] = color;
  }
};

Neo.Painter.prototype.scanLine = function (x0, x1, y, baseColor, buf32, stack) {
  var width = this.canvasWidth;
  for (var x = x0; x <= x1; x++) {
    stack.push({ x: x, y: y });
  }
};

Neo.Painter.prototype.doFloodFill = function (layer, x, y, fillColor) {
  x = Math.round(x);
  y = Math.round(y);
  var ctx = this.canvasCtx[layer];

  if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
    return;
  }

  var imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var width = imageData.width;
  var stack = [{ x: x, y: y }];

  var baseColor = buf32[y * width + x];

  if ((baseColor & 0xff000000) == 0 || baseColor != fillColor) {
    while (stack.length > 0) {
      if (stack.length > 1000000) {
        console.log("too much stack");
        break;
      }
      var point = stack.pop();
      var x = point.x;
      var y = point.y;
      var x0 = x;
      var x1 = x;
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

Neo.Painter.prototype.copy = function (layer, x, y, width, height) {
  this.tempX = 0;
  this.tempY = 0;
  this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

  var imageData = this.canvasCtx[layer].getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  this.temp = new Uint32Array(buf32.length);
  for (var i = 0; i < buf32.length; i++) {
    this.temp[i] = buf32[i];
  }

  //tempCanvasに乗せる画像を作る
  imageData = this.tempCanvasCtx.getImageData(x, y, width, height);
  buf32 = new Uint32Array(imageData.data.buffer);
  buf8 = new Uint8ClampedArray(imageData.data.buffer);
  for (var i = 0; i < buf32.length; i++) {
    if (this.temp[i] >> 24) {
      buf32[i] = this.temp[i] | 0xff000000;
    } else {
      buf32[i] = 0xffffffff;
    }
  }
  imageData.data.set(buf8);
  this.tempCanvasCtx.putImageData(imageData, x, y);
};

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

Neo.Painter.prototype.turn = function (layer, x, y, width, height) {
  var ctx = this.canvasCtx[layer];

  // 傾けツールのバグを再現するため一番上のラインで対象領域を埋める
  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var temp = new Uint32Array(buf32.length);

  var index = 0;
  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      temp[index] = buf32[index];
      if (index >= width) {
        buf32[index] = buf32[index % width];
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

Neo.Painter.prototype.doFill = function (layer, x, y, width, height, type) {
  var ctx = this.canvasCtx[layer];
  var maskFunc = this.getMaskFunc(type);

  var imageData = ctx.getImageData(x, y, width, height);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);

  var index = 0;

  var r1 = this._currentColor[0];
  var g1 = this._currentColor[1];
  var b1 = this._currentColor[2];
  var a1 = this.getAlpha(Neo.ALPHATYPE_FILL);

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      if (maskFunc && maskFunc.call(this, i, j, width, height)) {
        //なぜか加算逆加算は適用されない
        if (
          this._currentMaskType >= Neo.Painter.MASKTYPE_ADD ||
          !this.isMasked(buf8, index)
        ) {
          var r0 = buf8[index + 0];
          var g0 = buf8[index + 1];
          var b0 = buf8[index + 2];
          var a0 = buf8[index + 3] / 255.0;

          var a = a0 + a1 - a0 * a1;

          if (a > 0) {
            var a1x = a1;
            var ax = 1 + a0 * (1 - a1x);

            var r = (r1 + r0 * a0 * (1 - a1x)) / ax;
            var g = (g1 + g0 * a0 * (1 - a1x)) / ax;
            var b = (b1 + b0 * a0 * (1 - a1x)) / ax;

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
      }
      index += 4;
    }
  }
  imageData.data.set(buf8);
  ctx.putImageData(imageData, x, y);
};

Neo.Painter.prototype.rectFillMask = function (x, y, width, height) {
  return true;
};

Neo.Painter.prototype.rectMask = function (x, y, width, height) {
  var d = this._currentWidth;
  //  var d = this.lineWidth;
  return x < d || x > width - 1 - d || y < d || y > height - 1 - d
    ? true
    : false;
};

Neo.Painter.prototype.ellipseFillMask = function (x, y, width, height) {
  var cx = (width - 1) / 2.0;
  var cy = (height - 1) / 2.0;
  x = (x - cx) / (cx + 1);
  y = (y - cy) / (cy + 1);

  return x * x + y * y < 1 ? true : false;
};

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

Neo.Painter.prototype.getDestCanvasPosition = function (
  mx,
  my,
  isClip,
  isCenter
) {
  var mx = Math.floor(mx); //Math.round(mx);
  var my = Math.floor(my); //Math.round(my);
  if (isCenter) {
    mx += 0.499;
    my += 0.499;
  }
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

Neo.Painter.prototype.isWidget = function (element) {
  while (1) {
    if (element == null || element.id == "canvas" || element.id == "container")
      break;

    if (
      element.id == "tools" ||
      element.className == "buttonOn" ||
      element.className == "buttonOff" ||
      element.className == "inputText"
    ) {
      return true;
    }
    element = element.parentNode;
  }
  return false;
};

Neo.Painter.prototype.isContainer = function (element) {
  while (1) {
    if (element == null) break;
    if (element.id == "container") return true;
    element = element.parentNode;
  }
  return false;
};

Neo.Painter.prototype.cancelTool = function (e) {
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

Neo.Painter.prototype.loadImage = function (filename) {
  console.log("loadImage " + filename);
  var img = new Image();
  img.src = filename;
  img.onload = function () {
    var oe = Neo.painter;
    oe.canvasCtx[0].drawImage(img, 0, 0);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
  };
};

Neo.Painter.prototype.loadAnimation = function (filename) {
  console.log("loadAnimation " + filename);

  Neo.painter.busy = true;
  Neo.painter.busySkipped = false;

  Neo.getPCH(filename, function (pch) {
    //console.log(pch);
    Neo.painter._actionMgr._items = pch.data;
    Neo.painter._actionMgr._mark = pch.data.length;
    Neo.painter._actionMgr.play();
  });
};

Neo.Painter.prototype.loadSession = function (callback) {
  if (Neo.storage) {
    var img0 = new Image();
    img0.src = Neo.storage.getItem("layer0");
    img0.onload = function () {
      var img1 = new Image();
      img1.src = Neo.storage.getItem("layer1");
      img1.onload = function () {
        var oe = Neo.painter;
        oe.canvasCtx[0].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
        oe.canvasCtx[1].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
        oe.canvasCtx[0].drawImage(img0, 0, 0);
        oe.canvasCtx[1].drawImage(img1, 0, 0);
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

        if (callback) callback();
      };
    };
  }
};

Neo.Painter.prototype.saveSession = function () {
  if (Neo.storage) {
    Neo.storage.setItem("timestamp", new Date().getTime());
    Neo.storage.setItem("layer0", this.canvas[0].toDataURL("image/png"));
    Neo.storage.setItem("layer1", this.canvas[1].toDataURL("image/png"));
  }
};

Neo.Painter.prototype.clearSession = function () {
  if (Neo.storage) {
    Neo.storage.removeItem("timestamp");
    Neo.storage.removeItem("layer0");
    Neo.storage.removeItem("layer1");
  }
};

Neo.Painter.prototype.sortColor = function (r0, g0, b0) {
  var min = r0 < g0 ? (r0 < b0 ? 0 : 2) : g0 < b0 ? 1 : 2;
  var max = r0 > g0 ? (r0 > b0 ? 0 : 2) : g0 > b0 ? 1 : 2;
  var mid = min + max == 1 ? 2 : min + max == 2 ? 1 : 0;
  return [min, mid, max];
};

Neo.Painter.prototype.doText = function (
  layer,
  x,
  y,
  color,
  alpha,
  string,
  fontSize,
  fontFamily
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

  ctx.fillStyle = 0;
  ctx.fillText(string, 0, 0);
  ctx.restore();

  // 適当に二値化
  var r = color & 0xff;
  var g = (color & 0xff00) >> 8;
  var b = (color & 0xff0000) >> 16;
  var a = Math.round(alpha * 255.0);

  var imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  var buf32 = new Uint32Array(imageData.data.buffer);
  var buf8 = new Uint8ClampedArray(imageData.data.buffer);
  var length = this.canvasWidth * this.canvasHeight;
  var index = 0;
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
    this.canvasHeight
  );

  this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

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
  Neo.viewerPlay.setSelected(true);
  Neo.viewerStop.setSelected(false);

  this._actionMgr._pause = false;
  this._actionMgr.play();
};

Neo.Painter.prototype.onstop = function () {
  Neo.viewerPlay.setSelected(false);
  Neo.viewerStop.setSelected(true);
  this._actionMgr._pause = true;
};

Neo.Painter.prototype.onspeed = function () {
  var mgr = Neo.painter._actionMgr;
  var mode = mgr.speedMode();
  Neo.speed = mgr._speedTable[(mode + 1) % 4];
};

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

Neo.ToolBase = function () {};

Neo.ToolBase.prototype.startX;
Neo.ToolBase.prototype.startY;
Neo.ToolBase.prototype.init = function (oe) {};
Neo.ToolBase.prototype.kill = function (oe) {};
Neo.ToolBase.prototype.lineType = Neo.Painter.LINETYPE_NONE;

Neo.ToolBase.prototype.downHandler = function (oe) {
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;
};

Neo.ToolBase.prototype.upHandler = function (oe) {};

Neo.ToolBase.prototype.moveHandler = function (oe) {};

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
    case Neo.Painter.TOOLTYPE_FIP_H:
    case Neo.Painter.TOOLTYPE_FIP_V:

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

Neo.DrawToolBase = function () {};
Neo.DrawToolBase.prototype = new Neo.ToolBase();
Neo.DrawToolBase.prototype.isUpMove = false;
Neo.DrawToolBase.prototype.step = 0;

Neo.DrawToolBase.prototype.init = function () {
  this.step = 0;
  this.isUpMove = true;
};

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

Neo.DrawToolBase.prototype.keyDownHandler = function (e) {
  switch (Neo.painter.drawType) {
    case Neo.Painter.DRAWTYPE_BEZIER:
      this.bezierKeyDownHandler(e);
      break;
  }
};

Neo.DrawToolBase.prototype.rollOverHandler = function (oe) {};
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

/* FreeHand (手書き) */

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
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }

  if (oe.alpha >= 1) {
    var r = Math.ceil(oe.lineWidth / 2);
    var rect = oe.getBound(oe.mouseX, oe.mouseY, oe.mouseX, oe.mouseY, r);
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
  }
  if (!Neo.isMobile()) {
    this.drawCursor(oe);
  }
};

Neo.DrawToolBase.prototype.freeHandUpHandler = function (oe) {
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

  if (oe.cursorRect) {
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }

  //  oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
  //  this.drawCursor(oe);
  oe.prevLine = null;
};

Neo.DrawToolBase.prototype.freeHandMoveHandler = function (oe) {
  var ctx = oe.canvasCtx[oe.current];
  var x0 = Math.floor(oe.mouseX);
  var y0 = Math.floor(oe.mouseY);
  var x1 = Math.floor(oe.prevMouseX);
  var y1 = Math.floor(oe.prevMouseY);
  //  oe.drawLine(ctx, x0, y0, x1, y1, this.lineType);
  oe._actionMgr.freeHandMove(x0, y0, x1, y1, this.lineType);

  if (oe.cursorRect) {
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }

  var r = Math.ceil(oe.lineWidth / 2);
  var rect = oe.getBound(oe.mouseX, oe.mouseY, oe.prevMouseX, oe.prevMouseY, r);
  oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
  if (!Neo.isMobile()) {
    this.drawCursor(oe);
  }
};

Neo.DrawToolBase.prototype.freeHandUpMoveHandler = function (oe) {
  this.isUpMove = true;

  if (oe.cursorRect) {
    var rect = oe.cursorRect;
    oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
    oe.cursorRect = null;
  }
  this.drawCursor(oe);
};

Neo.DrawToolBase.prototype.drawCursor = function (oe) {
  //   if (oe.lineWidth <= 8) return;
  var mx = oe.mouseX;
  var my = oe.mouseY;
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

/* Line (直線) */

Neo.DrawToolBase.prototype.lineDownHandler = function (oe) {
  this.isUpMove = false;
  this.startX = Math.floor(oe.mouseX);
  this.startY = Math.floor(oe.mouseY);
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};

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

Neo.DrawToolBase.prototype.lineMoveHandler = function (oe) {
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  this.drawLineCursor(oe);
};

Neo.DrawToolBase.prototype.lineUpMoveHandler = function (oe) {};

Neo.DrawToolBase.prototype.drawLineCursor = function (oe, mx, my) {
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

/* Bezier (BZ曲線) */

Neo.DrawToolBase.prototype.bezierDownHandler = function (oe) {
  this.isUpMove = false;

  if (this.step == 0) {
    this.startX = this.x0 = Math.floor(oe.mouseX);
    this.startY = this.y0 = Math.floor(oe.mouseY);
  }
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};

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
        this.lineType
      );
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

      /*oe.drawBezier(oe.canvasCtx[oe.current],
                      this.x0, this.y0, this.x1, this.y1,
                      this.x2, this.y2, this.x3, this.y3, this.lineType);
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);*/

      this.step = 0;
      break;

    default:
      this.step = 0;
      break;
  }
};

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

Neo.DrawToolBase.prototype.bezierUpMoveHandler = function (oe) {
  this.bezierMoveHandler(oe);
};

Neo.DrawToolBase.prototype.bezierKeyDownHandler = function (e) {
  if (e.key == "Escape") {
    //Escでキャンセル
    this.step = 0;

    var oe = Neo.painter;
    oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }
};

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
    true
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
    oe.canvasHeight
  );

  ctx.restore();
};

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
    true
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
    oe.canvasHeight
  );
  ctx.restore();
};

/*
  -------------------------------------------------------------------------
    Pen（鉛筆）
  -------------------------------------------------------------------------
*/

Neo.PenTool = function () {};
Neo.PenTool.prototype = new Neo.DrawToolBase();
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

Neo.BrushTool = function () {};
Neo.BrushTool.prototype = new Neo.DrawToolBase();
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

Neo.ToneTool = function () {};
Neo.ToneTool.prototype = new Neo.DrawToolBase();
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

Neo.EraserTool = function () {};
Neo.EraserTool.prototype = new Neo.DrawToolBase();
Neo.EraserTool.prototype.type = Neo.Painter.TOOLTYPE_ERASER;
Neo.EraserTool.prototype.lineType = Neo.Painter.LINETYPE_ERASER;

/*
  -------------------------------------------------------------------------
    Blur（ぼかし）
  -------------------------------------------------------------------------
*/

Neo.BlurTool = function () {};
Neo.BlurTool.prototype = new Neo.DrawToolBase();
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

Neo.DodgeTool = function () {};
Neo.DodgeTool.prototype = new Neo.DrawToolBase();
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

Neo.BurnTool = function () {};
Neo.BurnTool.prototype = new Neo.DrawToolBase();
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

Neo.HandTool = function () {};
Neo.HandTool.prototype = new Neo.ToolBase();
Neo.HandTool.prototype.type = Neo.Painter.TOOLTYPE_HAND;
Neo.HandTool.prototype.isUpMove = false;
Neo.HandTool.prototype.reverse = false;

Neo.HandTool.prototype.downHandler = function (oe) {
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

  this.isDrag = true;
  this.startX = oe.rawMouseX;
  this.startY = oe.rawMouseY;
};

Neo.HandTool.prototype.upHandler = function (oe) {
  this.isDrag = false;
  oe.popTool();
};

Neo.HandTool.prototype.moveHandler = function (oe) {
  if (this.isDrag) {
    var dx = this.startX - oe.rawMouseX;
    var dy = this.startY - oe.rawMouseY;

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

    this.startX = oe.rawMouseX;
    this.startY = oe.rawMouseY;
  }
};

Neo.HandTool.prototype.upMoveHandler = function (oe) {};
Neo.HandTool.prototype.rollOverHandler = function (oe) {};
Neo.HandTool.prototype.rollOutHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    Slider（色やサイズのスライダを操作している時）
  -------------------------------------------------------------------------
*/

Neo.SliderTool = function () {};
Neo.SliderTool.prototype = new Neo.ToolBase();
Neo.SliderTool.prototype.type = Neo.Painter.TOOLTYPE_SLIDER;
Neo.SliderTool.prototype.isUpMove = false;
Neo.SliderTool.prototype.alt = false;

Neo.SliderTool.prototype.downHandler = function (oe) {
  if (!oe.isShiftDown) this.isDrag = true;

  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);

  var rect = this.target.getBoundingClientRect();
  var sliderType = this.alt ? Neo.SLIDERTYPE_SIZE : this.target["data-slider"];
  Neo.sliders[sliderType].downHandler(
    oe.rawMouseX - rect.left,
    oe.rawMouseY - rect.top
  );
};

Neo.SliderTool.prototype.upHandler = function (oe) {
  this.isDrag = false;
  oe.popTool();

  var rect = this.target.getBoundingClientRect();
  var sliderType = this.alt ? Neo.SLIDERTYPE_SIZE : this.target["data-slider"];
  Neo.sliders[sliderType].upHandler(
    oe.rawMouseX - rect.left,
    oe.rawMouseY - rect.top
  );
};

Neo.SliderTool.prototype.moveHandler = function (oe) {
  if (this.isDrag) {
    var rect = this.target.getBoundingClientRect();
    var sliderType = this.alt
      ? Neo.SLIDERTYPE_SIZE
      : this.target["data-slider"];
    Neo.sliders[sliderType].moveHandler(
      oe.rawMouseX - rect.left,
      oe.rawMouseY - rect.top
    );
  }
};

Neo.SliderTool.prototype.upMoveHandler = function (oe) {};
Neo.SliderTool.prototype.rollOverHandler = function (oe) {};
Neo.SliderTool.prototype.rollOutHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    Fill（塗り潰し）
  -------------------------------------------------------------------------
*/

Neo.FillTool = function () {};
Neo.FillTool.prototype = new Neo.ToolBase();
Neo.FillTool.prototype.type = Neo.Painter.TOOLTYPE_FILL;
Neo.FillTool.prototype.isUpMove = false;

Neo.FillTool.prototype.downHandler = function (oe) {
  var x = Math.floor(oe.mouseX);
  var y = Math.floor(oe.mouseY);
  var layer = oe.current;
  var color = oe.getColor();

  oe._pushUndo();
  oe._actionMgr.floodFill(layer, x, y, color);
  //oe.doFloodFill(layer, x, y, color);
};

Neo.FillTool.prototype.upHandler = function (oe) {};

Neo.FillTool.prototype.moveHandler = function (oe) {};

Neo.FillTool.prototype.rollOutHandler = function (oe) {};
Neo.FillTool.prototype.upMoveHandler = function (oe) {};
Neo.FillTool.prototype.rollOverHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    EraseAll（全消し）
  -------------------------------------------------------------------------
*/

Neo.EraseAllTool = function () {};
Neo.EraseAllTool.prototype = new Neo.ToolBase();
Neo.EraseAllTool.prototype.type = Neo.Painter.TOOLTYPE_ERASEALL;
Neo.EraseAllTool.prototype.isUpMove = false;

Neo.EraseAllTool.prototype.downHandler = function (oe) {
  oe._pushUndo();
  oe._actionMgr.eraseAll();

  /*oe.prepareDrawing();
    oe.canvasCtx[oe.current].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);*/
};

Neo.EraseAllTool.prototype.upHandler = function (oe) {};

Neo.EraseAllTool.prototype.moveHandler = function (oe) {};

Neo.EraseAllTool.prototype.rollOutHandler = function (oe) {};
Neo.EraseAllTool.prototype.upMoveHandler = function (oe) {};
Neo.EraseAllTool.prototype.rollOverHandler = function (oe) {};

/*
  -------------------------------------------------------------------------
    EffectToolBase（エフェックトツールのベースクラス）
  -------------------------------------------------------------------------
*/

Neo.EffectToolBase = function () {};
Neo.EffectToolBase.prototype = new Neo.ToolBase();
Neo.EffectToolBase.prototype.isUpMove = false;

Neo.EffectToolBase.prototype.downHandler = function (oe) {
  this.isUpMove = false;

  this.startX = this.endX = oe.clipMouseX;
  this.startY = this.endY = oe.clipMouseY;
};

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

  if (oe.tool.type != Neo.Painter.TOOLTYPE_PASTE) {
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  }
};

Neo.EffectToolBase.prototype.moveHandler = function (oe) {
  this.endX = oe.clipMouseX;
  this.endY = oe.clipMouseY;

  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  this.drawCursor(oe);
};

Neo.EffectToolBase.prototype.rollOutHandler = function (oe) {};
Neo.EffectToolBase.prototype.upMoveHandler = function (oe) {};
Neo.EffectToolBase.prototype.rollOverHandler = function (oe) {};

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

Neo.EraseRectTool = function () {};
Neo.EraseRectTool.prototype = new Neo.EffectToolBase();
Neo.EraseRectTool.prototype.type = Neo.Painter.TOOLTYPE_ERASERECT;

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

Neo.FlipHTool = function () {};
Neo.FlipHTool.prototype = new Neo.EffectToolBase();
Neo.FlipHTool.prototype.type = Neo.Painter.TOOLTYPE_FLIP_H;

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

Neo.FlipVTool = function () {};
Neo.FlipVTool.prototype = new Neo.EffectToolBase();
Neo.FlipVTool.prototype.type = Neo.Painter.TOOLTYPE_FLIP_V;

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

Neo.BlurRectTool = function () {};
Neo.BlurRectTool.prototype = new Neo.EffectToolBase();
Neo.BlurRectTool.prototype.type = Neo.Painter.TOOLTYPE_BLURRECT;

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

Neo.TurnTool = function () {};
Neo.TurnTool.prototype = new Neo.EffectToolBase();
Neo.TurnTool.prototype.type = Neo.Painter.TOOLTYPE_TURN;

Neo.TurnTool.prototype.upHandler = function (oe) {
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
};

/*
  -------------------------------------------------------------------------
    Merge（レイヤー結合）
  -------------------------------------------------------------------------
*/

Neo.MergeTool = function () {};
Neo.MergeTool.prototype = new Neo.EffectToolBase();
Neo.MergeTool.prototype.type = Neo.Painter.TOOLTYPE_MERGE;

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

Neo.CopyTool = function () {};
Neo.CopyTool.prototype = new Neo.EffectToolBase();
Neo.CopyTool.prototype.type = Neo.Painter.TOOLTYPE_COPY;

Neo.CopyTool.prototype.doEffect = function (oe, x, y, width, height) {
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

Neo.PasteTool = function () {};
Neo.PasteTool.prototype = new Neo.ToolBase();
Neo.PasteTool.prototype.type = Neo.Painter.TOOLTYPE_PASTE;

Neo.PasteTool.prototype.downHandler = function (oe) {
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;
  this.drawCursor(oe);
};

Neo.PasteTool.prototype.upHandler = function (oe) {
  oe._pushUndo();

  var dx = oe.tempX;
  var dy = oe.tempY;
  //  oe.paste(oe.current, this.x, this.y, this.width, this.height, dx, dy);
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  oe._actionMgr.paste(this.x, this.y, this.width, this.height, dx, dy);

  oe.setToolByType(Neo.Painter.TOOLTYPE_COPY);
};

Neo.PasteTool.prototype.moveHandler = function (oe) {
  var dx = Math.floor(oe.mouseX - this.startX);
  var dy = Math.floor(oe.mouseY - this.startY);
  oe.tempX = dx;
  oe.tempY = dy;

  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
  //  this.drawCursor(oe);
};

Neo.PasteTool.prototype.keyDownHandler = function (e) {
  if (e.key == "Escape") {
    //Escでキャンセル
    var oe = Neo.painter;
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    oe.setToolByType(Neo.Painter.TOOLTYPE_COPY);
  }
};

Neo.PasteTool.prototype.kill = function () {
  var oe = Neo.painter;
  oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
};

Neo.PasteTool.prototype.drawCursor = function (oe) {
  var ctx = oe.destCanvasCtx;

  ctx.save();
  this.transformForZoom(oe);

  var start = oe.getDestCanvasPosition(this.x, this.y, true);
  var end = oe.getDestCanvasPosition(
    this.x + this.width,
    this.y + this.height,
    true
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

Neo.RectTool = function () {};
Neo.RectTool.prototype = new Neo.EffectToolBase();
Neo.RectTool.prototype.type = Neo.Painter.TOOLTYPE_RECT;

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

Neo.RectFillTool = function () {};
Neo.RectFillTool.prototype = new Neo.EffectToolBase();
Neo.RectFillTool.prototype.type = Neo.Painter.TOOLTYPE_RECTFILL;

Neo.RectFillTool.prototype.isFill = true;
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

Neo.EllipseTool = function () {};
Neo.EllipseTool.prototype = new Neo.EffectToolBase();
Neo.EllipseTool.prototype.type = Neo.Painter.TOOLTYPE_ELLIPSE;
Neo.EllipseTool.prototype.isEllipse = true;
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

Neo.EllipseFillTool = function () {};
Neo.EllipseFillTool.prototype = new Neo.EffectToolBase();
Neo.EllipseFillTool.prototype.type = Neo.Painter.TOOLTYPE_ELLIPSEFILL;
Neo.EllipseFillTool.prototype.isEllipse = true;
Neo.EllipseFillTool.prototype.isFill = true;
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

Neo.TextTool = function () {};
Neo.TextTool.prototype = new Neo.ToolBase();
Neo.TextTool.prototype.type = Neo.Painter.TOOLTYPE_TEXT;
Neo.TextTool.prototype.isUpMove = false;

Neo.TextTool.prototype.downHandler = function (oe) {
  this.startX = oe.mouseX;
  this.startY = oe.mouseY;

  if (Neo.painter.inputText) {
    Neo.painter.updateInputText();

    var rect = oe.container.getBoundingClientRect();
    var text = Neo.painter.inputText;
    var x = oe.rawMouseX - rect.left - 5;
    var y = oe.rawMouseY - rect.top - 5;

    text.style.left = x + "px";
    text.style.top = y + "px";
    text.style.display = "block";
    text.focus();
  }
};

Neo.TextTool.prototype.upHandler = function (oe) {};

Neo.TextTool.prototype.moveHandler = function (oe) {};
Neo.TextTool.prototype.upMoveHandler = function (oe) {};
Neo.TextTool.prototype.rollOverHandler = function (oe) {};
Neo.TextTool.prototype.rollOutHandler = function (oe) {};

Neo.TextTool.prototype.keyDownHandler = function (e) {
  if (e.key == "Enter") {
    // Returnで確定
    e.preventDefault();

    var oe = Neo.painter;
    var text = oe.inputText;

    if (text) {
      oe._pushUndo();
      //this.drawText(oe);
      //oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);

      var string = text.textContent || text.innerText;
      var size = text.style.fontSize;
      var family = text.style.fontFamily || "Arial";
      var layer = oe.current;
      var color = oe.getColor();
      var alpha = oe.alpha;
      var x = this.startX;
      var y = this.startY;
      //oe.doText(layer, this.startX, this.startY, color, string, size, family);
      oe._actionMgr.text(
        this.startX,
        this.startY,
        color,
        alpha,
        string,
        size,
        family
      );

      text.style.display = "none";
      text.blur();
    }
  }
};

Neo.TextTool.prototype.kill = function (oe) {
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

Neo.DummyTool = function () {};
Neo.DummyTool.prototype = new Neo.ToolBase();
Neo.DummyTool.prototype.type = Neo.Painter.TOOLTYPE_NONE;
Neo.DummyTool.prototype.isUpMove = false;

Neo.DummyTool.prototype.downHandler = function (oe) {};

Neo.DummyTool.prototype.upHandler = function (oe) {
  oe.popTool();
};

Neo.DummyTool.prototype.moveHandler = function (oe) {};
Neo.DummyTool.prototype.upMoveHandler = function (oe) {};
Neo.DummyTool.prototype.rollOverHandler = function (oe) {};
Neo.DummyTool.prototype.rollOutHandler = function (oe) {};

"use strict";

Neo.CommandBase = function () {};
Neo.CommandBase.prototype.data;
Neo.CommandBase.prototype.execute = function () {};

/*
  ---------------------------------------------------
    ZOOM
  ---------------------------------------------------
*/
Neo.ZoomPlusCommand = function (data) {
  this.data = data;
};
Neo.ZoomPlusCommand.prototype = new Neo.CommandBase();
Neo.ZoomPlusCommand.prototype.execute = function () {
  if (this.data.zoom < 12) {
    this.data.setZoom(this.data.zoom + 1);
  }
  Neo.resizeCanvas();
  Neo.painter.updateDestCanvas();
};

Neo.ZoomMinusCommand = function (data) {
  this.data = data;
};
Neo.ZoomMinusCommand.prototype = new Neo.CommandBase();
Neo.ZoomMinusCommand.prototype.execute = function () {
  if (this.data.zoom >= 2) {
    this.data.setZoom(this.data.zoom - 1);
  }
  Neo.resizeCanvas();
  Neo.painter.updateDestCanvas();
};

/*
  ---------------------------------------------------
    UNDO
  ---------------------------------------------------
*/
Neo.UndoCommand = function (data) {
  this.data = data;
};
Neo.UndoCommand.prototype = new Neo.CommandBase();
Neo.UndoCommand.prototype.execute = function () {
  this.data.undo();
};

Neo.RedoCommand = function (data) {
  this.data = data;
};
Neo.RedoCommand.prototype = new Neo.CommandBase();
Neo.RedoCommand.prototype.execute = function () {
  this.data.redo();
};

Neo.WindowCommand = function (data) {
  this.data = data;
};
Neo.WindowCommand.prototype = new Neo.CommandBase();
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

Neo.SubmitCommand = function (data) {
  this.data = data;
};
Neo.SubmitCommand.prototype = new Neo.CommandBase();
Neo.SubmitCommand.prototype.execute = function () {
  var board = location.href.replace(/[^/]*$/, "");
  this.data.submit(board);
};

Neo.CopyrightCommand = function (data) {
  this.data = data;
};
Neo.CopyrightCommand.prototype = new Neo.CommandBase();
Neo.CopyrightCommand.prototype.execute = function () {
  var url = "http://github.com/funige/neo/";
  if (
    confirm(
      Neo.translate(
        "PaintBBS NEOは、お絵描きしぃ掲示板 PaintBBS (©2000-2004 しぃちゃん) をhtml5化するプロジェクトです。\n\nPaintBBS NEOのホームページを表示しますか？"
      ) + "\n"
    )
  ) {
    Neo.openURL(url);
  }
};

"use strict";

/*
  -----------------------------------------------------------------------
    Action Manager
  -----------------------------------------------------------------------
*/

Neo.ActionManager = function () {
  this._items = [];
  this._head = 0;
  this._index = 0;

  this._pause = false;
  this._mark = 0;

  this._speedTable = [-1, 0, 1, 11]; // [最, 早, 既, 鈍]

  Neo.speed = parseInt(Neo.config.speed || 0);
  this._prevSpeed = Neo.speed;
};

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
  if (!Neo.animation) return;

  if (this._items.length > this._head) {
    this._items.length = this._head;
  }
  this._items.push([]);
  this._head++;
  this._index = 0;
};

Neo.ActionManager.prototype.back = function () {
  if (!Neo.animation) return;

  if (this._head > 0) {
    this._head--;
  }
};

Neo.ActionManager.prototype.forward = function () {
  if (!Neo.animation) return;

  if (this._head < this._items.length) {
    this._head++;
  }
};

Neo.ActionManager.prototype.push = function () {
  if (!Neo.animation) return;

  var head = this._items[this._head - 1];
  for (var i = 0; i < arguments.length; i++) {
    head.push(arguments[i]);
  }
};

Neo.ActionManager.prototype.pushCurrent = function () {
  if (!Neo.animation) return;

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

  if (this._head < this._items.length && this._head < this._mark) {
    var item = this._items[this._head];

    if (!Neo.viewer) {
      Neo.painter._pushUndo(
        0,
        0,
        Neo.painter.canvasWidth,
        Neo.painter.canvasHeight,
        true
      );
    }

    if (Neo.viewer && Neo.viewerSpeed && this._index == 0) {
      Neo.viewerSpeed.update();
      //console.log("play", item[0], this._head + 1, this._items.length);
    }

    var func = item[0] && this[item[0]] ? item[0] : "dummy";
    var that = this;
    var wait = this._prevSpeed < 0 ? 0 : this._prevSpeed;

    this[func](item, function (result) {
      if (result) {
        if (
          Neo.painter.busySkipped &&
          that._head < that._mark - 2 &&
          that._mark - 2 >= 0 &&
          that._items[that._mark - 1][0] == "restore"
        ) {
          that._head = that._mark - 2;
        } else {
          that._head++;
        }
        that._index = 0;
        that._prevSpeed = Neo.speed;
      }

      setTimeout(function () {
        Neo.painter._actionMgr.play();
      }, wait);
    });
  } else {
    Neo.painter.dirty = false;
    Neo.painter.busy = false;

    if (Neo.painter.busySkipped) {
      Neo.painter.busySkipped = false;
      console.log("animation skipped");
    } else {
      console.log("animation finished");
    }
  }
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

Neo.ActionManager.prototype.freeHand = function (x0, y0, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("freeHand", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x0, y0);

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x0, y0, lineType);
  } else if (!Neo.viewer || this._prevSpeed <= 0) {
    this.freeHandFast(arguments[0], arguments[1]);
  } else {
    var item = arguments[0];

    layer = item[1];
    lineType = item[11];
    this.getCurrent(item);

    var i = this._index;
    if (i == 0) {
      i = 12;
    } else {
      i += 2;
    }

    var x1 = item[i + 0];
    var y1 = item[i + 1];
    x0 = item[i + 2];
    y0 = item[i + 3];

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

    this._index = i;
    var result = i + 2 + 3 >= item.length;

    if (!result) {
      oe.prevLine = null;
    }

    var callback = arguments[1];
    if (callback && typeof callback == "function") {
      callback(result);
    }
  }
};

Neo.ActionManager.prototype.freeHandFast = function (x0, y0, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("freeHand", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x0, y0);

    oe.drawLine(oe.canvasCtx[layer], x0, y0, x0, y0, lineType);
  } else {
    var item = arguments[0];
    var length = item.length;

    layer = item[1];
    this.getCurrent(item);

    lineType = item[11];
    x0 = item[12];
    y0 = item[13];
    var x1, y1;

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

Neo.ActionManager.prototype.freeHandMove = function (x0, y0, x1, y1, lineType) {
  if (arguments.length > 1) {
    var oe = Neo.painter;
    var layer = oe.current;
    var head = this._items[this._head - 1];
    if (head && head.length == 0) {
      this.push("freeHand", layer);
      this.pushCurrent();
      this.push(lineType, x1, y1, x0, y0);
    } else if (Neo.animation) {
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

Neo.ActionManager.prototype.line = function (x0, y0, x1, y1, lineType) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("line", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x1, y1);
  } else {
    var item = arguments[0];

    layer = item[1];
    this.getCurrent(item);

    lineType = item[11];
    x0 = item[12];
    y0 = item[13];
    x1 = item[14];
    y1 = item[15];
  }
  if (x1 === null) x1 = x0;
  if (y1 === null) y1 = y0;

  oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.bezier = function (
  x0,
  y0,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  lineType
) {
  var oe = Neo.painter;
  var layer = oe.current;
  var isReplay = true;

  if (typeof arguments[0] != "object") {
    this.push("bezier", layer);
    this.pushCurrent();
    this.push(lineType, x0, y0, x1, y1, x2, y2, x3, y3);
    isReplay = false;
  } else {
    var item = arguments[0];
    layer = item[1];
    this.getCurrent(item);

    lineType = item[11];
    x0 = item[12];
    y0 = item[13];
    x1 = item[14];
    y1 = item[15];
    x2 = item[16];
    y2 = item[17];
    x3 = item[18];
    y3 = item[19];
  }
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
    isReplay
  );
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.fill = function (x, y, width, height, type) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("fill", layer);
    this.pushCurrent();
    this.push(x, y, width, height, type);
  } else {
    var item = arguments[0];
    layer = item[1];
    this.getCurrent(item);

    x = item[11];
    y = item[12];
    width = item[13];
    height = item[14];
    type = item[15];
  }

  oe.doFill(layer, x, y, width, height, type);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.flipH = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("flipH", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.flipH(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.flipV = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("flipV", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.flipV(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.merge = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("merge", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.merge(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.blurRect = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("blurRect", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.blurRect(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.eraseRect2 = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("eraseRect2", layer);
    this.pushCurrent();
    this.push(x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    this.getCurrent(item);

    x = item[11];
    y = item[12];
    width = item[13];
    height = item[14];
  }
  oe.eraseRect(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.eraseRect = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("eraseRect", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.eraseRect(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.copy = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("copy", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }

  oe.copy(layer, x, y, width, height);
  oe.tool.x = x;
  oe.tool.y = y;
  oe.tool.width = width;
  oe.tool.height = height;
  //  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.paste = function (x, y, width, height, dx, dy) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("paste", layer, x, y, width, height, dx, dy);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
    dx = item[6];
    dy = item[7];
  }

  oe.paste(layer, x, y, width, height, dx, dy);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.turn = function (x, y, width, height) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("turn", layer, x, y, width, height);
  } else {
    var item = arguments[0];
    layer = item[1];
    x = item[2];
    y = item[3];
    width = item[4];
    height = item[5];
  }
  oe.turn(layer, x, y, width, height);
  oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);

  var callback = arguments[1];
  if (callback && typeof callback == "function") callback(true);
};

Neo.ActionManager.prototype.text = function (
  x,
  y,
  color,
  alpha,
  string,
  size,
  family
) {
  var oe = Neo.painter;
  var layer = oe.current;

  if (typeof arguments[0] != "object") {
    this.push("text", layer, x, y, color, alpha, string, size, family);
  } else {
    var item = arguments[0];

    layer = item[1];
    x = item[2];
    y = item[3];
    color = item[4];
    alpha = item[5];
    string = item[6];
    size = item[7];
    family = item[8];
  }
  oe.doText(layer, x, y, color, alpha, string, size, family);
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

    var img0 = oe.canvas[0].toDataURL("image/png");
    var img1 = oe.canvas[1].toDataURL("image/png");
    this.push(img0, img1);
  } else {
    var item = arguments[0];
    var callback = arguments[1];

    var img0 = new Image();
    img0.src = item[1];
    img0.onload = function () {
      var img1 = new Image();
      img1.src = item[2];
      img1.onload = function () {
        oe.canvasCtx[0].clearRect(0, 0, width, height);
        oe.canvasCtx[1].clearRect(0, 0, width, height);
        oe.canvasCtx[0].drawImage(img0, 0, 0);
        oe.canvasCtx[1].drawImage(img1, 0, 0);
        oe.updateDestCanvas(0, 0, width, height);

        if (callback && typeof callback == "function") callback(true);
      };
    };
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

Neo.createViewer = function (applet) {
  var neo = document.createElement("div");
  neo.className = "NEO";
  neo.id = "NEO";

  var html =
    '<div id="pageView" style="margin:auto;">' +
    '<div id="container" style="visibility:visible;" class="o">' +
    '<div id="painter" style="background-color:white;">' +
    '<div id="canvas" style="background-color:white;">' +
    "</div>" +
    "</div>" +
    '<div id="viewerButtonsWrapper" style="display:block;">' +
    '<div id="viewerButtons" style="display:block;">' +
    '<div id="viewerPlay"></div>' +
    '<div id="viewerStop"></div>' +
    '<div id="viewerRewind"></div>' +
    '<div id="viewerSpeed" style="padding-left:2px; margin-top: 1px;"></div>' +
    '<div id="viewerPlus"></div>' +
    '<div id="viewerMinus"></div>' +
    '<div id="viewerBar" style="display:inline-block;">' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  neo.innerHTML = html.replace(/\[(.*?)\]/g, function (match, str) {
    return Neo.translate(str);
  });

  var parent = applet.parentNode;
  parent.appendChild(neo);
  parent.insertBefore(neo, applet);

  // applet.style.display = "none";

  // NEOを組み込んだURLをアプリ版で開くとDOMツリーが2重にできて格好悪いので消しておく
  setTimeout(function () {
    var tmp = document.getElementsByClassName("NEO");
    if (tmp.length > 1) {
      for (var i = 1; i < tmp.length; i++) {
        tmp[i].style.display = "none";
      }
    }
  }, 0);
};

Neo.initViewer = function (pch) {
  var pageview = document.getElementById("pageView");
  var pageWidth = Neo.config.applet_width;
  var pageHeight = Neo.config.applet_height;
  pageview.style.width = pageWidth + "px";
  pageview.style.height = pageHeight + "px";

  Neo.canvas = document.getElementById("canvas");
  Neo.container = document.getElementById("container");
  Neo.container.style.backgroundColor = Neo.config.color_back;
  Neo.container.style.border = "0";

  var dx = (pageWidth - Neo.config.width) / 2;
  var dy = (pageHeight - Neo.config.height - 26) / 2;

  var painter = document.getElementById("painter");

  painter.style.marginTop = "0";
  painter.style.position = "absolute";
  painter.style.padding = "0";
  painter.style.bottom = dy + 26 + "px";
  painter.style.left = dx + "px";

  var viewerButtonsWrapper = document.getElementById("viewerButtonsWrapper");
  viewerButtonsWrapper.style.width = pageWidth - 2 + "px";

  var viewerBar = document.getElementById("viewerBar");
  viewerBar.style.position = "absolute";
  viewerBar.style.right = "2px";
  viewerBar.style.top = "1px";
  viewerBar.style.width = pageWidth - 24 * 6 - 2 + "px";

  Neo.canvas.style.width = Neo.config.width + "px";
  Neo.canvas.style.height = Neo.config.height + "px";

  Neo.painter = new Neo.Painter();
  Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);

  Neo.container.oncontextmenu = function () {
    return false;
  };

  painter.addEventListener(
    "mousedown",
    function () {
      Neo.painter._actionMgr.isMouseDown = true;
    },
    false
  );

  document.addEventListener(
    "mousemove",
    function (e) {
      if (Neo.painter._actionMgr.isMouseDown) {
        var zoom = Neo.painter.zoom;
        var x = Neo.painter.zoomX - e.movementX / zoom;
        var y = Neo.painter.zoomY - e.movementY / zoom;
        Neo.painter.setZoomPosition(x, y);
      }
    },
    false
  );
  document.addEventListener(
    "mouseup",
    function () {
      Neo.painter._actionMgr.isMouseDown = false;
      Neo.viewerBar.isMouseDown = false;
    },
    false
  );

  if (pch) {
    //Neo.config.pch_file) {
    Neo.painter._actionMgr._items = pch.data;
    Neo.painter.play();
  }
};

Neo.startViewer = function () {
  if (Neo.applet) {
    var name = Neo.applet.attributes.name.value || "pch";
    if (!document[name]) document[name] = Neo;
    if (Neo.applet.parentNode) {
      Neo.applet.parentNode.removeChild(Neo.applet);
    }
  }

  Neo.styleSheet = Neo.getStyleSheet();
  var lightBack = Neo.multColor(Neo.config.color_back, 1.3);
  var darkBack = Neo.multColor(Neo.config.color_back, 0.7);

  Neo.addRule(".NEO #viewerButtons", "color", Neo.config.color_text);
  Neo.addRule(".NEO #viewerButtons", "background-color", Neo.config.color_back);

  Neo.addRule(
    ".NEO #viewerButtonsWrapper",
    "border",
    "1px solid " + Neo.config.color_frame + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons",
    "border",
    "1px solid " + Neo.config.color_back + " !important"
  );
  Neo.addRule(
    ".NEO #viewerButtons",
    "border-left",
    "1px solid " + lightBack + " !important"
  );
  Neo.addRule(
    ".NEO #viewerButtons",
    "border-top",
    "1px solid " + lightBack + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOff",
    "background-color",
    Neo.config.color_icon + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOff:active",
    "background-color",
    darkBack + " !important"
  );
  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOn",
    "background-color",
    darkBack + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons >div",
    "border",
    "1px solid " + Neo.config.color_frame + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOff:hover",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important"
  );

  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOff:active",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important"
  );
  Neo.addRule(
    ".NEO #viewerButtons >div.buttonOn",
    "border",
    "1px solid" + Neo.config.color_bar_select + " !important"
  );

  Neo.addRule(".NEO #viewerBar >div", "background-color", Neo.config.color_bar);
  //  Neo.addRule(".NEO #viewerBar:active", "background-color", darkBack);
  Neo.addRule(
    ".NEO #viewerBarMark",
    "background-color",
    Neo.config.color_text + " !important"
  );

  setTimeout(function () {
    Neo.viewerPlay = new Neo.ViewerButton().init("viewerPlay");
    Neo.viewerPlay.setSelected(true);
    Neo.viewerPlay.onmouseup = function () {
      Neo.painter.onplay();
    };
    Neo.viewerStop = new Neo.ViewerButton().init("viewerStop");
    Neo.viewerStop.onmouseup = function () {
      Neo.painter.onstop();
    };
    Neo.viewerSpeed = new Neo.ViewerButton().init("viewerSpeed");
    Neo.viewerSpeed.onmouseup = function () {
      Neo.painter.onspeed();
      this.update();
    };

    new Neo.ViewerButton().init("viewerRewind").onmouseup = function () {
      Neo.painter.onrewind();
    };
    new Neo.ViewerButton().init("viewerPlus").onmouseup = function () {
      new Neo.ZoomPlusCommand(Neo.painter).execute();
    };
    new Neo.ViewerButton().init("viewerMinus").onmouseup = function () {
      new Neo.ZoomMinusCommand(Neo.painter).execute();
    };

    var length = Neo.painter._actionMgr._items.length;
    Neo.viewerBar = new Neo.ViewerBar().init("viewerBar", { length: length });
  }, 0);
};

Neo.getFilename = function () {
  return Neo.config.pch_file || Neo.config.image_canvas;
};

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

Neo.decodePCH = function (rawdata) {
  var byteArray = new Uint8Array(rawdata);
  var data = LZString.decompressFromUint8Array(byteArray.subarray(12));
  var header = byteArray.subarray(0, 12);

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

Neo.setSpeed = function (value) {
  Neo.speed = value;
};

Neo.setVisit = function (layer, value) {
  Neo.painter.visible[layer] = value == 0 ? false : true;
  Neo.painter.updateDestCanvas(
    0,
    0,
    Neo.painter.canvasWidth,
    Neo.painter.canvasHeight
  );
};

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

Neo.getModifier = function (e) {
  if (e.shiftKey) {
    return "shift";
  } else if (
    e.button == 2 ||
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

Neo.Button = function () {};
Neo.Button.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;
  this.selected = false;
  this.isMouseDown = false;

  var ref = this;
  this.element.onmousedown = function (e) {
    ref._mouseDownHandler(e);
  };
  this.element.onmouseup = function (e) {
    ref._mouseUpHandler(e);
  };
  this.element.onmouseover = function (e) {
    ref._mouseOverHandler(e);
  };
  this.element.onmouseout = function (e) {
    ref._mouseOutHandler(e);
  };
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._mouseDownHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );
  this.element.addEventListener(
    "touchend",
    function (e) {
      ref._mouseUpHandler(e);
    },
    { passive: false, capture: true }
  );

  this.element.className = !this.params.type == "fill" ? "button" : "buttonOff";

  this.disable = function (wait) {
    this.element.style.pointerEvents = "none";
    this.element.style.opacity = "0.5";
    if (wait) {
      setTimeout(function () {
        ref.enable();
      }, wait);
    }
  };

  this.enable = function () {
    this.element.style.pointerEvents = "inherit";
    this.element.style.opacity = "1.0";
  };

  return this;
};

Neo.Button.prototype._mouseDownHandler = function (e) {
  if (Neo.painter.isUIPaused()) return;
  this.isMouseDown = true;

  if (this.params.type == "fill" && this.selected == false) {
    for (var i = 0; i < Neo.toolButtons.length; i++) {
      var toolTip = Neo.toolButtons[i];
      toolTip.setSelected(this.selected ? false : true);
    }
    Neo.painter.setToolByType(Neo.Painter.TOOLTYPE_FILL);
  }

  if (this.onmousedown) this.onmousedown(this);
};
Neo.Button.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;

    if (this.onmouseup) this.onmouseup(this);
  }
};
Neo.Button.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
Neo.Button.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};

Neo.Button.prototype.setSelected = function (selected) {
  if (selected) {
    this.element.className = "buttonOn";
  } else {
    this.element.className = "buttonOff";
  }
  this.selected = selected;
};

Neo.Button.prototype.update = function () {};

/*
  -------------------------------------------------------------------------
    Right Button
  -------------------------------------------------------------------------
*/

Neo.RightButton;

Neo.RightButton = function () {};
Neo.RightButton.prototype = new Neo.Button();

Neo.RightButton.prototype.init = function (name, params) {
  Neo.Button.prototype.init.call(this, name, params);
  this.params.type = "right";
  return this;
};

Neo.RightButton.prototype._mouseDownHandler = function (e) {};

Neo.RightButton.prototype._mouseUpHandler = function (e) {
  this.setSelected(!this.selected);
};

Neo.RightButton.prototype._mouseOutHandler = function (e) {};

Neo.RightButton.prototype.setSelected = function (selected) {
  if (selected) {
    this.element.className = "buttonOn";
    Neo.painter.virtualRight = true;
  } else {
    this.element.className = "buttonOff";
    Neo.painter.virtualRight = false;
  }
  this.selected = selected;
};

Neo.RightButton.clear = function () {
  var right = Neo.rightButton;
  right.setSelected(false);
};

/*
  -------------------------------------------------------------------------
    Fill Button
  -------------------------------------------------------------------------
*/

Neo.FillButton;

Neo.FillButton = function () {};
Neo.FillButton.prototype = new Neo.Button();

Neo.FillButton.prototype.init = function (name, params) {
  Neo.Button.prototype.init.call(this, name, params);
  this.params.type = "fill";
  return this;
};

/*
  -------------------------------------------------------------------------
    ColorTip
  -------------------------------------------------------------------------
*/

Neo.colorTips = [];

Neo.ColorTip = function () {};
Neo.ColorTip.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;

  this.selected = this.name == "color1" ? true : false;
  this.isMouseDown = false;

  var ref = this;
  this.element.onmousedown = function (e) {
    ref._mouseDownHandler(e);
  };
  this.element.onmouseup = function (e) {
    ref._mouseUpHandler(e);
  };
  this.element.onmouseover = function (e) {
    ref._mouseOverHandler(e);
  };
  this.element.onmouseout = function (e) {
    ref._mouseOutHandler(e);
  };
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._mouseDownHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );
  this.element.addEventListener(
    "touchend",
    function (e) {
      ref._mouseUpHandler(e);
    },
    true
  );

  this.element.className = "colorTipOff";

  var index = parseInt(this.name.slice(5)) - 1;
  this.element.style.left = index % 2 ? "0px" : "26px";
  this.element.style.top = Math.floor(index / 2) * 21 + "px";

  // base64 ColorTip.png
  this.element.innerHTML =
    "<img style='max-width:44px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAASCAYAAAAg9DzcAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVRIx+3OAQkAMADDsO3+Pe8qCj+0Akq6bQFqS2wTCpwE+R4IiyVYsGDBggULfirBgn8HX7BzCRwDx1QeAAAAAElFTkSuQmCC' />";

  this.setColor(Neo.config.colors[params.index - 1]);

  this.setSelected(this.selected);
  Neo.colorTips.push(this);
};

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
Neo.ColorTip.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseup) this.onmouseup(this);
  }
};
Neo.ColorTip.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
Neo.ColorTip.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};

Neo.ColorTip.prototype.setSelected = function (selected) {
  if (selected) {
    this.element.className = "colorTipOn";
  } else {
    this.element.className = "colorTipOff";
  }
  this.selected = selected;
};

Neo.ColorTip.prototype.setColor = function (color) {
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

Neo.toolTips = [];
Neo.toolButtons = [];

Neo.ToolTip = function () {};

Neo.ToolTip.prototype.prevMode = -1;

Neo.ToolTip.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.params.type = this.element.id;
  this.name = name;
  this.mode = 0;

  this.isMouseDown = false;

  var ref = this;
  this.element.onmousedown = function (e) {
    ref._mouseDownHandler(e);
  };
  this.element.onmouseup = function (e) {
    ref._mouseUpHandler(e);
  };
  this.element.onmouseover = function (e) {
    ref._mouseOverHandler(e);
  };
  this.element.onmouseout = function (e) {
    ref._mouseOutHandler(e);
  };
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._mouseDownHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );
  this.element.addEventListener(
    "touchend",
    function (e) {
      ref._mouseUpHandler(e);
    },
    true
  );

  this.selected = this.params.type == "pen" ? true : false;
  this.setSelected(this.selected);

  this.element.innerHTML =
    "<canvas width=46 height=18></canvas><div class='label'></div>";
  this.canvas = this.element.getElementsByTagName("canvas")[0];
  this.label = this.element.getElementsByTagName("div")[0];

  this.update();
  return this;
};

Neo.ToolTip.prototype._mouseDownHandler = function (e) {
  this.isMouseDown = true;

  if (this.isTool) {
    if (this.selected == false) {
      for (var i = 0; i < Neo.toolButtons.length; i++) {
        var toolTip = Neo.toolButtons[i];
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

Neo.ToolTip.prototype._mouseUpHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseup) this.onmouseup(this);
  }
};

Neo.ToolTip.prototype._mouseOutHandler = function (e) {
  if (this.isMouseDown) {
    this.isMouseDown = false;
    if (this.onmouseout) this.onmouseout(this);
  }
};
Neo.ToolTip.prototype._mouseOverHandler = function (e) {
  if (this.onmouseover) this.onmouseover(this);
};

Neo.ToolTip.prototype.setSelected = function (selected) {
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

Neo.ToolTip.prototype.draw = function (c) {
  if (this.hasTintImage) {
    if (typeof c != "string") c = Neo.painter.getColorString(c);
    var ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (this.prevMode != this.mode) {
      this.prevMode = this.mode;

      var img = new Image();
      img.src = this.toolIcons[this.mode];
      img.onload = function () {
        var ref = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTintImage(ctx, img, c, 0, 0);
      }.bind(this);
    } else {
      Neo.tintImage(ctx, c);
    }
  }
};

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

Neo.penTip;

Neo.PenTip = function () {};
Neo.PenTip.prototype = new Neo.ToolTip();

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

Neo.PenTip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("鉛筆"),
    Neo.translate("水彩"),
    Neo.translate("ﾃｷｽﾄ"),
  ];
  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
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

Neo.pen2Tip;

Neo.Pen2Tip = function () {};
Neo.Pen2Tip.prototype = new Neo.ToolTip();

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

Neo.Pen2Tip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("トーン"),
    Neo.translate("ぼかし"),
    Neo.translate("覆い焼き"),
    Neo.translate("焼き込み"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
  return this;
};

Neo.Pen2Tip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  switch (this.tools[this.mode]) {
    case Neo.Painter.TOOLTYPE_TONE:
      this.drawTone(Neo.painter.foregroundColor);
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
  this.label.innerHTML = this.toolStrings[this.mode];
};

Neo.Pen2Tip.prototype.drawTone = function () {
  var ctx = this.canvas.getContext("2d", {
    willReadFrequently: true,
  });

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

Neo.eraserTip;

Neo.EraserTip = function () {};
Neo.EraserTip.prototype = new Neo.ToolTip();

Neo.EraserTip.prototype.tools = [
  Neo.Painter.TOOLTYPE_ERASER,
  Neo.Painter.TOOLTYPE_ERASERECT,
  Neo.Painter.TOOLTYPE_ERASEALL,
];

Neo.EraserTip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("消しペン"),
    Neo.translate("消し四角"),
    Neo.translate("全消し"),
  ];

  this.drawOnce = false;
  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
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
  this.label.innerHTML = this.toolStrings[this.mode];
};

Neo.EraserTip.prototype.draw = function () {
  var ctx = this.canvas.getContext("2d", {
    willReadFrequently: true,
  });
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  var img = new Image();

  img.src = Neo.ToolTip.eraser;
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
};

/*
  -------------------------------------------------------------------------
    EffectTip
  -------------------------------------------------------------------------
*/

Neo.effectTip;

Neo.EffectTip = function () {};
Neo.EffectTip.prototype = new Neo.ToolTip();

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

Neo.EffectTip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("四角"),
    Neo.translate("線四角"),
    Neo.translate("楕円"),
    Neo.translate("線楕円"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
  return this;
};

Neo.EffectTip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  this.draw(Neo.painter.foregroundColor);
  this.label.innerHTML = this.toolStrings[this.mode];
};

/*
  -------------------------------------------------------------------------
    Effect2Tip
  -------------------------------------------------------------------------
*/

Neo.effect2Tip;

Neo.Effect2Tip = function () {};
Neo.Effect2Tip.prototype = new Neo.ToolTip();

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

Neo.Effect2Tip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("コピー"),
    Neo.translate("ﾚｲﾔ結合"),
    Neo.translate("角取り"),
    Neo.translate("左右反転"),
    Neo.translate("上下反転"),
    Neo.translate("傾け"),
  ];

  this.isTool = true;
  Neo.ToolTip.prototype.init.call(this, name, params);

  this.img = document.createElement("img");
  this.img.src = Neo.ToolTip.copy2;
  this.element.appendChild(this.img);
  return this;
};

Neo.Effect2Tip.prototype.update = function () {
  for (var i = 0; i < this.tools.length; i++) {
    if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
  }

  this.draw(Neo.painter.foregroundColor);
  this.label.innerHTML = this.toolStrings[this.mode];
};

/*
  -------------------------------------------------------------------------
    MaskTip
  -------------------------------------------------------------------------
*/

Neo.maskTip;

Neo.MaskTip = function () {};
Neo.MaskTip.prototype = new Neo.ToolTip();

Neo.MaskTip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("通常"),
    Neo.translate("マスク"),
    Neo.translate("逆ﾏｽｸ"),
    Neo.translate("加算"),
    Neo.translate("逆加算"),
  ];

  this.fixed = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
  return this;
};

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
  this.label.innerHTML = this.toolStrings[this.mode];
};

Neo.MaskTip.prototype.draw = function (c) {
  if (typeof c != "string") c = Neo.painter.getColorString(c);

  var ctx = this.canvas.getContext("2d", {
    willReadFrequently: true,
  });
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.fillStyle = c;
  ctx.fillRect(1, 1, 43, 9);
};

/*
  -------------------------------------------------------------------------
    DrawTip
  -------------------------------------------------------------------------
*/

Neo.drawTip;

Neo.DrawTip = function () {};
Neo.DrawTip.prototype = new Neo.ToolTip();

Neo.DrawTip.prototype.hasTintImage = true;
Neo.DrawTip.prototype.toolIcons = [
  Neo.ToolTip.freehand,
  Neo.ToolTip.line,
  Neo.ToolTip.bezier,
];

Neo.DrawTip.prototype.init = function (name, params) {
  this.toolStrings = [
    Neo.translate("手書き"),
    Neo.translate("直線"),
    Neo.translate("BZ曲線"),
  ];

  this.fixed = true;
  Neo.ToolTip.prototype.init.call(this, name, params);
  return this;
};

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
  this.label.innerHTML = this.toolStrings[this.mode];
};

/*
  -------------------------------------------------------------------------
    ColorSlider
  -------------------------------------------------------------------------
*/

Neo.sliders = [];

Neo.ColorSlider = function () {};

Neo.ColorSlider.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;
  this.isMouseDown = false;
  this.value = 0;
  this.type = this.params.type;

  this.element.className = "colorSlider";
  this.element.innerHTML =
    "<div class='slider'></div><div class='label'></div>";
  this.element.innerHTML += "<div class='hit'></div>";

  this.slider = this.element.getElementsByClassName("slider")[0];
  this.label = this.element.getElementsByClassName("label")[0];
  this.hit = this.element.getElementsByClassName("hit")[0];
  this.hit["data-slider"] = params.type;

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

  this.update();
  return this;
};

Neo.ColorSlider.prototype.downHandler = function (x, y) {
  if (Neo.painter.isShiftDown) {
    this.shift(x, y);
  } else {
    this.slide(x, y);
  }
};

Neo.ColorSlider.prototype.moveHandler = function (x, y) {
  this.slide(x, y);
  //event.preventDefault();
};

Neo.ColorSlider.prototype.upHandler = function (x, y) {};

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

  this.slider.style.width = width.toFixed(2) + "px";
  this.label.innerHTML = this.prefix + this.value.toFixed(0);
};

/*
  -------------------------------------------------------------------------
    SizeSlider
  -------------------------------------------------------------------------
*/

Neo.SizeSlider = function () {};

Neo.SizeSlider.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;
  this.isMouseDown = false;
  this.value = this.value0 = 1;

  this.element.className = "sizeSlider";
  this.element.innerHTML =
    "<div class='slider'></div><div class='label'></div>";
  this.element.innerHTML += "<div class='hit'></div>";

  this.slider = this.element.getElementsByClassName("slider")[0];
  this.label = this.element.getElementsByClassName("label")[0];
  this.hit = this.element.getElementsByClassName("hit")[0];
  this.hit["data-slider"] = params.type;

  this.slider.style.backgroundColor = Neo.painter.foregroundColor;
  this.update();
  return this;
};

Neo.SizeSlider.prototype.downHandler = function (x, y) {
  if (Neo.painter.isShiftDown) {
    this.shift(x, y);
  } else {
    this.value0 = this.value;
    this.y0 = y;
    this.slide(x, y);
  }
};

Neo.SizeSlider.prototype.moveHandler = function (x, y) {
  this.slide(x, y);
  //event.preventDefault();
};

Neo.SizeSlider.prototype.upHandler = function (x, y) {};

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

  this.slider.style.height = height.toFixed(2) + "px";
  this.label.innerHTML = this.value + "px";
  this.slider.style.backgroundColor = Neo.painter.foregroundColor;
};

/*
  -------------------------------------------------------------------------
    LayerControl
  -------------------------------------------------------------------------
*/

Neo.LayerControl = function () {};
Neo.LayerControl.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;
  this.isMouseDown = false;

  var ref = this;

  this.element.onmousedown = function (e) {
    ref._mouseDownHandler(e);
  };
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._mouseDownHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );

  this.element.className = "layerControl";

  var layerStrings = [Neo.translate("Layer0"), Neo.translate("Layer1")];

  this.element.innerHTML =
    "<div class='bg'></div><div class='label0'>" +
    layerStrings[0] +
    "</div><div class='label1'>" +
    layerStrings[1] +
    "</div><div class='line1'></div><div class='line0'></div>";

  this.bg = this.element.getElementsByClassName("bg")[0];
  this.label0 = this.element.getElementsByClassName("label0")[0];
  this.label1 = this.element.getElementsByClassName("label1")[0];
  this.line0 = this.element.getElementsByClassName("line0")[0];
  this.line1 = this.element.getElementsByClassName("line1")[0];

  this.line0.style.display = "none";
  this.line1.style.display = "none";
  this.label1.style.display = "none";

  this.update();
  return this;
};

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
    Neo.painter.canvasHeight
  );
  if (Neo.painter.tool.type == Neo.Painter.TOOLTYPE_PASTE) {
    Neo.painter.tool.drawCursor(Neo.painter);
  }
  this.update();

  if (this.onmousedown) this.onmousedown(this);
};

Neo.LayerControl.prototype.update = function () {
  this.label0.style.display = Neo.painter.current == 0 ? "block" : "none";
  this.label1.style.display = Neo.painter.current == 1 ? "block" : "none";
  this.line0.style.display = Neo.painter.visible[0] ? "none" : "block";
  this.line1.style.display = Neo.painter.visible[1] ? "none" : "block";
};

/*
  -------------------------------------------------------------------------
    ReserveControl
  -------------------------------------------------------------------------
*/
Neo.reserveControls = [];

Neo.ReserveControl = function () {};
Neo.ReserveControl.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;

  var ref = this;

  this.element.onmousedown = function (e) {
    ref._mouseDownHandler(e);
  };
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._mouseDownHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );

  this.element.className = "reserve";

  var index = parseInt(this.name.slice(7)) - 1;
  this.element.style.top = "1px";
  this.element.style.left = index * 15 + 2 + "px";

  this.reserve = Neo.clone(Neo.config.reserves[index]);
  this.update();

  Neo.reserveControls.push(this);
  return this;
};

Neo.ReserveControl.prototype._mouseDownHandler = function (e) {
  if (Neo.getModifier(e) == "right") {
    this.save();
  } else {
    this.load();
  }
  this.update();
};

Neo.ReserveControl.prototype.load = function () {
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
  this.reserve.color = Neo.painter.foregroundColor;
  this.reserve.size = Neo.painter.lineWidth;
  this.reserve.drawType = Neo.painter.drawType;
  this.reserve.alpha = Neo.painter.alpha;
  this.reserve.tool = Neo.painter.tool.getType();
  this.element.style.backgroundColor = this.reserve.color;
  this.update();
  Neo.updateUI();
};

Neo.ReserveControl.prototype.update = function () {
  this.element.style.backgroundColor = this.reserve.color;
};

/*
  -------------------------------------------------------------------------
    ScrollBarButton
  -------------------------------------------------------------------------
*/

Neo.scrollH;
Neo.scrollV;

Neo.ScrollBarButton = function () {};
Neo.ScrollBarButton.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;

  this.element.innerHTML = "<div></div>";
  this.barButton = this.element.getElementsByTagName("div")[0];
  this.element["data-bar"] = true;
  this.barButton["data-bar"] = true;

  if (name == "scrollH") Neo.scrollH = this;
  if (name == "scrollV") Neo.scrollV = this;
  return this;
};

Neo.ScrollBarButton.prototype.update = function (oe) {
  if (this.name == "scrollH") {
    var a = oe.destCanvas.width / (oe.canvasWidth * oe.zoom);
    var barWidth = Math.ceil(oe.destCanvas.width * a);
    var barX = oe.scrollBarX * (oe.destCanvas.width - barWidth);
    this.barButton.style.width = Math.ceil(barWidth) - 4 + "px";
    this.barButton.style.left = Math.floor(barX) + "px";
  } else {
    var a = oe.destCanvas.height / (oe.canvasHeight * oe.zoom);
    var barHeight = Math.ceil(oe.destCanvas.height * a);
    var barY = oe.scrollBarY * (oe.destCanvas.height - barHeight);
    this.barButton.style.height = Math.ceil(barHeight) - 4 + "px";
    this.barButton.style.top = Math.floor(barY) + "px";
  }
};

/*
  -------------------------------------------------------------------------
    ViewerButton
  -------------------------------------------------------------------------
*/

Neo.ViewerButton = function () {};
Neo.ViewerButton.prototype = new Neo.Button();

Neo.ViewerButton.speedStrings = ["最", "早", "既", "鈍"];

Neo.ViewerButton.prototype.init = function (name, params) {
  Neo.Button.prototype.init.call(this, name, params);

  if (name != "viewerSpeed") {
    this.element.innerHTML = "<canvas width=24 height=24></canvas>";
    this.canvas = this.element.getElementsByTagName("canvas")[0];
    var ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });

    var img = new Image();
    img.src = Neo.ViewerButton[name.toLowerCase().replace(/viewer/, "")];
    img.onload = function () {
      var ref = this;
      ctx.clearRect(0, 0, 24, 24);
      ctx.drawImage(img, 0, 0);
      Neo.tintImage(ctx, Neo.config.color_text);
    }.bind(this);
  } else {
    this.element.innerHTML = "<div></div><canvas width=24 height=24></canvas>";
    this.update();
  }
  return this;
};

Neo.ViewerButton.prototype.update = function () {
  if (this.name == "viewerSpeed") {
    var mode = Neo.painter._actionMgr.speedMode();
    var speedString = Neo.translate(Neo.ViewerButton.speedStrings[mode]);
    this.element.children[0].innerHTML = "<div>" + speedString + "</div>";
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

Neo.ViewerBar = function () {};
Neo.ViewerBar.prototype.init = function (name, params) {
  this.element = document.getElementById(name);
  this.params = params || {};
  this.name = name;
  this.isMouseDown = false;

  this.element.style.display = "inline-block";
  this.element.innerHTML =
    "<div id='viewerBarLeft'></div>" +
    "<div id='viewerBarMark'></div>" +
    "<div id='viewerBarText'>hoge</div>";
  this.seekElement = this.element.children[0];
  this.markElement = this.element.children[1];
  this.textElement = this.element.children[2];

  this.width = this.seekElement.offsetWidth;

  this.length = this.params.length || 100;
  this.mark = this.length;
  this.seek = 0;

  var ref = this;
  this.element.onmousedown = function (e) {
    ref.isMouseDown = true;
    ref._touchHandler(e);
  };
  this.element.onmousemove = function (e) {
    if (ref.isMouseDown) {
      ref._touchHandler(e);
    }
  };
  //  this.element.onmouseup = function(e) { this.isMouseDown = false; }
  //  this.element.onmouseout = function(e) { this.isMouseDown = false; }
  this.element.addEventListener(
    "touchstart",
    function (e) {
      ref._touchHandler(e);
      e.preventDefault();
    },
    { passive: false, capture: true }
  );

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

Neo.ViewerBar.prototype._touchHandler = function (e) {
  var x = e.offsetX / this.width;
  x = Math.max(Math.min(x, 1), 0);

  Neo.painter._actionMgr._mark = Math.round(x * this.length);
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
// LZ-based compression algorithm, version 1.4.4
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
              context_w
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
            context_w
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
