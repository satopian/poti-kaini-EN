/*! PaintBBS NEO v1.8.9 | https://github.com/funige/neo */
/*! Includes this MIT-licensed library (the license below applies only to it):
 *
 *   lz-string (https://github.com/pieroxy/lz-string)
 *   Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/lz-string/libs/lz-string.js
  var require_lz_string = __commonJS({
    "node_modules/lz-string/libs/lz-string.js"(exports, module) {
      var LZString3 = (function() {
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
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
        var LZString4 = {
          compressToBase64: function(input) {
            if (input == null) return "";
            var res = LZString4._compress(input, 6, function(a) {
              return keyStrBase64.charAt(a);
            });
            switch (res.length % 4) {
              // To produce valid Base64
              default:
              // When could this happen ?
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
          decompressFromBase64: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            return LZString4._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrBase64, input.charAt(index));
            });
          },
          compressToUTF16: function(input) {
            if (input == null) return "";
            return LZString4._compress(input, 15, function(a) {
              return f(a + 32);
            }) + " ";
          },
          decompressFromUTF16: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString4._decompress(compressed.length, 16384, function(index) {
              return compressed.charCodeAt(index) - 32;
            });
          },
          //compress into uint8array (UCS-2 big endian format)
          compressToUint8Array: function(uncompressed) {
            var compressed = LZString4.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2);
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
              var current_value = compressed.charCodeAt(i);
              buf[i * 2] = current_value >>> 8;
              buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
          },
          //decompress from uint8array (UCS-2 big endian format)
          decompressFromUint8Array: function(compressed) {
            if (compressed === null || compressed === void 0) {
              return LZString4.decompress(compressed);
            } else {
              var buf = new Array(compressed.length / 2);
              for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
              }
              var result = [];
              buf.forEach(function(c) {
                result.push(f(c));
              });
              return LZString4.decompress(result.join(""));
            }
          },
          //compress into a string that is already URI encoded
          compressToEncodedURIComponent: function(input) {
            if (input == null) return "";
            return LZString4._compress(input, 6, function(a) {
              return keyStrUriSafe.charAt(a);
            });
          },
          //decompress from an output of compressToEncodedURIComponent
          decompressFromEncodedURIComponent: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            input = input.replace(/ /g, "+");
            return LZString4._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrUriSafe, input.charAt(index));
            });
          },
          compress: function(uncompressed) {
            return LZString4._compress(uncompressed, 16, function(a) {
              return f(a);
            });
          },
          _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null) return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
              context_c = uncompressed.charAt(ii);
              if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
              }
              context_wc = context_w + context_c;
              if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
              } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
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
                      context_data_val = context_data_val << 1 | value & 1;
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
                      context_data_val = context_data_val << 1 | value;
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
                      context_data_val = context_data_val << 1 | value & 1;
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
                    context_data_val = context_data_val << 1 | value & 1;
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
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
              }
            }
            if (context_w !== "") {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
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
                    context_data_val = context_data_val << 1 | value & 1;
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
                    context_data_val = context_data_val << 1 | value;
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
                    context_data_val = context_data_val << 1 | value & 1;
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
                  context_data_val = context_data_val << 1 | value & 1;
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
            value = 2;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
            while (true) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
              } else context_data_position++;
            }
            return context_data.join("");
          },
          decompress: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString4._decompress(compressed.length, 32768, function(index) {
              return compressed.charCodeAt(index);
            });
          },
          _decompress: function(length, resetValue, getNextValue) {
            var dictionary2 = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
              dictionary2[i] = i;
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
            switch (next = bits) {
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
            dictionary2[3] = c;
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
              switch (c = bits) {
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
                  dictionary2[dictSize++] = f(bits);
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
                  dictionary2[dictSize++] = f(bits);
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
              if (dictionary2[c]) {
                entry = dictionary2[c];
              } else {
                if (c === dictSize) {
                  entry = w + w.charAt(0);
                } else {
                  return null;
                }
              }
              result.push(entry);
              dictionary2[dictSize++] = w + entry.charAt(0);
              enlargeIn--;
              w = entry;
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
            }
          }
        };
        return LZString4;
      })();
      if (typeof define === "function" && define.amd) {
        define(function() {
          return LZString3;
        });
      } else if (typeof module !== "undefined" && module != null) {
        module.exports = LZString3;
      } else if (typeof angular !== "undefined" && angular != null) {
        angular.module("LZString", []).factory("LZString", function() {
          return LZString3;
        });
      }
    }
  });

  // src/neo.js
  var Neo = {};
  Neo.version = "1.8.9";
  Neo.painter;
  Neo.fullScreen = false;
  Neo.uploaded = false;
  Neo.viewer = false;
  Neo.container = null;
  Neo.center = null;
  Neo.canvas = null;
  Neo.toolsWrapper = null;
  Neo.tools = null;
  Neo.toolSide = false;
  Neo.applet = null;
  Neo.isAnimation = false;
  Neo.storage = localStorage;
  Neo.stabilize_level = 0;
  Neo.styleSheet = null;
  Neo.rules = {};
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
      "#F9DDCF"
    ]
  };
  Neo.reservePen = /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
  {};
  Neo.reserveEraser = /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
  {};
  Neo.submitButton = null;
  Neo.fillButton = null;
  Neo.rightButton = null;
  Neo.penTip = null;
  Neo.pen2Tip = null;
  Neo.effectTip = null;
  Neo.effect2Tip = null;
  Neo.eraserTip = null;
  Neo.drawTip = null;
  Neo.maskTip = null;
  Neo.isApp = false;
  Neo.viewerBar = null;
  Neo.viewerPlay = null;
  Neo.viewerStop = null;
  Neo.viewerSpeed = null;
  Neo.speed = 0;
  Neo.params = null;
  Neo.param = null;
  Neo.sizeslider = null;
  Neo.sliders = [];
  Neo.scrollH = null;
  Neo.scrollV = null;
  Neo.toolButtons = [];
  Neo.colorTips = [];
  Neo.reserveControls = [];
  Neo.CurrentToolType = 1;
  Neo.SLIDERTYPE_RED = 0;
  Neo.SLIDERTYPE_GREEN = 1;
  Neo.SLIDERTYPE_BLUE = 2;
  Neo.SLIDERTYPE_ALPHA = 3;
  Neo.SLIDERTYPE_SIZE = 4;
  Neo.resizeCanvas = function(options = {}) {
  };
  Neo.playPCH = function() {
  };
  Neo.suspendDraw = function() {
  };
  Neo.setSpeed = function(value) {
  };
  Neo.setVisit = function(layer, value) {
  };
  Neo.setMark = function(value) {
  };
  Neo.getSeek = function() {
  };
  Neo.getLineCount = function() {
  };
  Neo.setToolSide = function(htmlConfiguredSide) {
  };
  Neo.setStabilizeLevel = function(htmlConfig) {
  };
  Neo.setStabilizLevel = Neo.setStabilizeLevel;
  Neo.getColors = function() {
  };
  Neo.setColors = function(colors) {
  };
  Neo.setColor = function(color) {
  };
  Neo.pExit = function() {
  };
  Neo.str_header = "";
  Neo.openURL = function(url) {
  };
  Neo.createViewer = function(applet) {
  };
  Neo.initViewer = function(pch) {
  };
  Neo.startViewer = function() {
  };
  Neo.decodePCH = function(rawdata) {
    return null;
  };
  Neo.init = function() {
    return false;
  };
  Neo.start = function(isApp = false) {
  };
  document.neo = Neo;

  // src/dictionary.js
  var dictionary = {
    ja: {},
    en: {
      \u3084\u308A\u76F4\u3057: "Redo",
      \u5143\u306B\u623B\u3059: "Undo",
      \u5857\u308A\u6F70\u3057: "Paint",
      \u7A93: "F&nbsp;",
      \u6295\u7A3F: "Send",
      "(C)\u3057\u3043\u3061\u3083\u3093 PaintBBS NEO": "(C)shi-chan PaintBBS NEO",
      \u925B\u7B46: "Solid",
      \u6C34\u5F69: "WaterC",
      \uFF83\uFF77\uFF7D\uFF84: "Text",
      \u30C8\u30FC\u30F3: "Tone",
      \u307C\u304B\u3057: "ShadeOff",
      \u8986\u3044\u713C\u304D: "HLight",
      \u713C\u304D\u8FBC\u307F: "Dark",
      \u6D88\u3057\u30DA\u30F3: "White",
      \u6D88\u3057\u56DB\u89D2: "WhiteRect",
      \u5168\u6D88\u3057: "Clear",
      \u56DB\u89D2: "Rect",
      \u7DDA\u56DB\u89D2: "LineRect",
      \u6955\u5186: "Oval",
      \u7DDA\u6955\u5186: "LineOval",
      \u30B3\u30D4\u30FC: "Copy",
      \uFF9A\uFF72\uFF94\u7D50\u5408: "lay-unif",
      \u89D2\u53D6\u308A: "Antialias",
      \u5DE6\u53F3\u53CD\u8EE2: "reverseL",
      \u4E0A\u4E0B\u53CD\u8EE2: "reverseU",
      \u50BE\u3051: "lie",
      \u901A\u5E38: "Normal",
      \u30DE\u30B9\u30AF: "Mask",
      \u9006\uFF8F\uFF7D\uFF78: "ReMask",
      \u52A0\u7B97: "And",
      \u9006\u52A0\u7B97: "Div",
      \u624B\u66F8\u304D: "FreeLine",
      \u76F4\u7DDA: "Straight",
      BZ\u66F2\u7DDA: "Bezie",
      "\u30DA\u30FC\u30B8\u30D3\u30E5\u30FC\uFF1F": "Page view?",
      "\u30A6\u30A3\u30F3\u30C9\u30A6\u30D3\u30E5\u30FC\uFF1F": "Window view?",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "Restore session?",
      \u53F3: "Right Click",
      "PaintBBS NEO\u306F\u3001\u304A\u7D75\u63CF\u304D\u3057\u3043\u63B2\u793A\u677F PaintBBS (\xA92000-2004 \u3057\u3043\u3061\u3083\u3093) \u3092html5\u5316\u3059\u308B\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u3059\u3002\n\nPaintBBS NEO\u306E\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u3092\u8868\u793A\u3057\u307E\u3059\u304B\uFF1F": "PaintBBS NEO is an HTML5 port of Oekaki Shi-BBS PaintBBS (\xA92000-2004 shi-chan). Show the project page?",
      "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F<br>\u6295\u7A3F\u306B\u5931\u6557\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059<br>": "This browser may fail to send your picture.<br>",
      "\u753B\u50CF\u3092\u6295\u7A3F\u3057\u307E\u3059\u304B\uFF1F<br>\u6295\u7A3F\u306B\u6210\u529F\u5F8C\u3001\u7DE8\u96C6\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002": "Is the picture contributed?<br>if contribution completed, you jump to the comment page.",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u52D5\u753B\u306E\u8AAD\u307F\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u3066\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "Discard animation data and restore session?",
      \u6700: "Mx",
      \u65E9: "H",
      \u65E2: "M",
      \u920D: "L",
      "\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002": "Please push send button again.",
      HTTP\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9: "HTTP status code",
      "\u30EC\u30A4\u30E4\u30FC\u60C5\u5831\u306F\u4FDD\u5B58\u3055\u308C\u307E\u305B\u3093\u3002\n\u7D9A\u884C\u3057\u3066\u3088\u308D\u3057\u3044\u3067\u3059\u304B?": "Layer information will not be saved.\nAre you sure you want to continue?"
    },
    enx: {
      \u3084\u308A\u76F4\u3057: "Redo",
      \u5143\u306B\u623B\u3059: "Undo",
      \u5857\u308A\u6F70\u3057: "Fill",
      \u7A93: "Float",
      \u6295\u7A3F: "Send",
      "(C)\u3057\u3043\u3061\u3083\u3093 PaintBBS NEO": "&copy;shi-chan PaintBBS NEO",
      \u925B\u7B46: "Solid",
      \u6C34\u5F69: "WaterCo",
      \uFF83\uFF77\uFF7D\uFF84: "Text",
      \u30C8\u30FC\u30F3: "Halftone",
      \u307C\u304B\u3057: "Blur",
      \u8986\u3044\u713C\u304D: "Light",
      \u713C\u304D\u8FBC\u307F: "Dark",
      \u6D88\u3057\u30DA\u30F3: "White",
      \u6D88\u3057\u56DB\u89D2: "WhiteRe",
      \u5168\u6D88\u3057: "Clear",
      \u56DB\u89D2: "Rect",
      \u7DDA\u56DB\u89D2: "LineRect",
      \u6955\u5186: "Oval",
      \u7DDA\u6955\u5186: "LineOval",
      \u30B3\u30D4\u30FC: "Copy",
      \uFF9A\uFF72\uFF94\u7D50\u5408: "layerUnit",
      \u89D2\u53D6\u308A: "antiAlias",
      \u5DE6\u53F3\u53CD\u8EE2: "flipHorita",
      \u4E0A\u4E0B\u53CD\u8EE2: "flipVertic",
      \u50BE\u3051: "rotate",
      \u901A\u5E38: "Normal",
      \u30DE\u30B9\u30AF: "Mask",
      \u9006\uFF8F\uFF7D\uFF78: "ReMask",
      \u52A0\u7B97: "And",
      \u9006\u52A0\u7B97: "Divide",
      \u624B\u66F8\u304D: "Freehan",
      \u76F4\u7DDA: "Line",
      BZ\u66F2\u7DDA: "Bezier",
      Layer0: "LayerBG",
      Layer1: "LayerFG",
      "\u30DA\u30FC\u30B8\u30D3\u30E5\u30FC\uFF1F": "Page view?",
      "\u30A6\u30A3\u30F3\u30C9\u30A6\u30D3\u30E5\u30FC\uFF1F": "Window view?",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "Restore session?",
      \u53F3: "Right Click",
      "PaintBBS NEO\u306F\u3001\u304A\u7D75\u63CF\u304D\u3057\u3043\u63B2\u793A\u677F PaintBBS (\xA92000-2004 \u3057\u3043\u3061\u3083\u3093) \u3092html5\u5316\u3059\u308B\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u3059\u3002\n\nPaintBBS NEO\u306E\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u3092\u8868\u793A\u3057\u307E\u3059\u304B\uFF1F": "PaintBBS NEO is an HTML5 port of Oekaki Shi-BBS PaintBBS (\xA92000-2004 shi-chan). Show the project page?",
      "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F<br>\u6295\u7A3F\u306B\u5931\u6557\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059<br>": "This browser may fail to send your picture.<br>",
      "\u753B\u50CF\u3092\u6295\u7A3F\u3057\u307E\u3059\u304B\uFF1F<br>\u6295\u7A3F\u306B\u6210\u529F\u5F8C\u3001\u7DE8\u96C6\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002": "Send this picture and end session?",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u52D5\u753B\u306E\u8AAD\u307F\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u3066\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "Discard animation data and restore session?",
      \u6700: "Mx",
      \u65E9: "H",
      \u65E2: "M",
      \u920D: "L",
      "\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002": "Failed to upload image. please try again.",
      HTTP\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9: "HTTP status code",
      "\u30EC\u30A4\u30E4\u30FC\u60C5\u5831\u306F\u4FDD\u5B58\u3055\u308C\u307E\u305B\u3093\u3002\n\u7D9A\u884C\u3057\u3066\u3088\u308D\u3057\u3044\u3067\u3059\u304B?": "Layer information will not be saved.\nAre you sure you want to continue?"
    },
    es: {
      \u3084\u308A\u76F4\u3057: "Rehacer",
      \u5143\u306B\u623B\u3059: "Deshacer",
      \u5857\u308A\u6F70\u3057: "Llenar",
      \u7A93: "Ventana",
      \u6295\u7A3F: "Enviar",
      "(C)\u3057\u3043\u3061\u3083\u3093 PaintBBS NEO": "&copy;shi-chan PaintBBS NEO",
      \u925B\u7B46: "L\xE1piz",
      \u6C34\u5F69: "Acuarela",
      \uFF83\uFF77\uFF7D\uFF84: "Texto",
      \u30C8\u30FC\u30F3: "Tono",
      \u307C\u304B\u3057: "Gradaci\xF3n",
      \u8986\u3044\u713C\u304D: "Sobreexp.",
      \u713C\u304D\u8FBC\u307F: "Quemar",
      \u6D88\u3057\u30DA\u30F3: "Goma",
      \u6D88\u3057\u56DB\u89D2: "GomaRect",
      \u5168\u6D88\u3057: "Borrar",
      \u56DB\u89D2: "Rect",
      \u7DDA\u56DB\u89D2: "L\xEDneaRect",
      \u6955\u5186: "\xD3valo",
      \u7DDA\u6955\u5186: "L\xEDnea\xD3valo",
      \u30B3\u30D4\u30FC: "Copiar",
      \uFF9A\uFF72\uFF94\u7D50\u5408: "UnirCapa",
      \u89D2\u53D6\u308A: "Antialias",
      \u5DE6\u53F3\u53CD\u8EE2: "Inv.Izq/Der",
      \u4E0A\u4E0B\u53CD\u8EE2: "Inv.Arr/Aba",
      \u50BE\u3051: "Inclinar",
      \u901A\u5E38: "Normal",
      \u30DE\u30B9\u30AF: "Masc.",
      \u9006\uFF8F\uFF7D\uFF78: "Masc.Inv",
      \u52A0\u7B97: "Adici\xF3n",
      \u9006\u52A0\u7B97: "Subtrac",
      \u624B\u66F8\u304D: "Libre",
      \u76F4\u7DDA: "L\xEDnea",
      BZ\u66F2\u7DDA: "Curva",
      Layer0: "Capa0",
      Layer1: "Capa1",
      "\u30DA\u30FC\u30B8\u30D3\u30E5\u30FC\uFF1F": "\xBFVista de p\xE1gina?",
      "\u30A6\u30A3\u30F3\u30C9\u30A6\u30D3\u30E5\u30FC\uFF1F": "\xBFVista de ventana?",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "\xBFRestaurar sesi\xF3n anterior?",
      \u53F3: "Clic derecho",
      "PaintBBS NEO\u306F\u3001\u304A\u7D75\u63CF\u304D\u3057\u3043\u63B2\u793A\u677F PaintBBS (\xA92000-2004 \u3057\u3043\u3061\u3083\u3093) \u3092html5\u5316\u3059\u308B\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u3059\u3002\n\nPaintBBS NEO\u306E\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u3092\u8868\u793A\u3057\u307E\u3059\u304B\uFF1F": "PaintBBS NEO es una versi\xF3n para HTML5 de Oekaki Shi-BBS PaintBBS (\xA9 2000-2004 shi-chan). \xBFMostrar la p\xE1gina del proyecto?",
      "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F<br>\u6295\u7A3F\u306B\u5931\u6557\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059<br>": "Este navegador podr\xEDa no enviar su imagen.<br>",
      "\u753B\u50CF\u3092\u6295\u7A3F\u3057\u307E\u3059\u304B\uFF1F<br>\u6295\u7A3F\u306B\u6210\u529F\u5F8C\u3001\u7DE8\u96C6\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002": "\xBFEnviar esta imagen y finalizar sesi\xF3n?",
      "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u52D5\u753B\u306E\u8AAD\u307F\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u3066\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F": "\xBFDesechar datos de animaci\xF3n y restaurar sesi\xF3n?",
      \u6700: "Mx",
      \u65E9: "H",
      \u65E2: "M",
      \u920D: "L",
      "\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002": "No se pudo cargar la imagen. por favor, int\xE9ntalo de nuevo.",
      HTTP\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9: "C\xF3digo de estado HTTP",
      "\u30EC\u30A4\u30E4\u30FC\u60C5\u5831\u306F\u4FDD\u5B58\u3055\u308C\u307E\u305B\u3093\u3002\n\u7D9A\u884C\u3057\u3066\u3088\u308D\u3057\u3044\u3067\u3059\u304B?": "La informaci\xF3n de las capas no se guardar\xE1.\n\xBFEst\xE1 seguro de que desea continuar?"
    }
  };
  var translate = (function() {
    var language = window.navigator.languages && window.navigator.languages[0] || window.navigator.language;
    var lang = "en";
    for (var key in dictionary) {
      if (language.indexOf(key) == 0) {
        lang = key;
        break;
      }
    }
    return function(string) {
      if (Neo.config.neo_alt_translation) {
        if (lang == "en") lang = "enx";
      } else {
        if (lang != "ja") lang = "en";
      }
      return dictionary[lang][string] || string;
    };
  })();

  // src/actions.js
  var import_lz_string = __toESM(require_lz_string());

  // src/widgets.js
  var getModifier = function(e) {
    if (e.shiftKey) {
      return "shift";
    } else if (e instanceof MouseEvent && e.button == 2 || e.ctrlKey || e.altKey || Neo.painter.virtualRight) {
      return "right";
    }
    return null;
  };
  var Button = class {
    constructor() {
      this.element = null;
      this.params = null;
      this.elementID = "";
      this.selected = false;
      this.isMouseDown = false;
      this.disable = function(wait) {
      };
      this.enable = function() {
      };
      this.onmousedown = null;
      this.onmouseup = null;
      this.onmouseover = null;
      this.onmouseout = null;
    }
    /**
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {Button|null}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.selected = false;
      this.isMouseDown = false;
      const ref = this;
      if (this.element) {
        this.element.onmousedown = function(e) {
          ref._mouseDownHandler(e);
        };
        this.element.onmouseup = function(e) {
          ref._mouseUpHandler(e);
        };
        this.element.onmouseover = function(e) {
          ref._mouseOverHandler(e);
        };
        this.element.onmouseout = function(e) {
          ref._mouseOutHandler(e);
        };
        this.element.addEventListener(
          "touchstart",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseDownHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
        this.element.addEventListener(
          "touchend",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseUpHandler(e);
          },
          { passive: false, capture: true }
        );
        this.element.className = "buttonOff";
      }
      this.disable = function(wait) {
        if (this.element) {
          this.element.style.pointerEvents = "none";
          this.element.style.opacity = "0.5";
        }
        if (wait) {
          setTimeout(function() {
            ref.enable();
          }, wait);
        }
      };
      this.enable = function() {
        if (this.element) {
          this.element.style.pointerEvents = "inherit";
          this.element.style.opacity = "1.0";
        }
      };
      return this;
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    _mouseDownHandler(e) {
      var _a;
      if (Neo.painter.isUIPaused()) return;
      this.isMouseDown = true;
      if (((_a = this.params) == null ? void 0 : _a.type) == "fill" && this.selected == false) {
        for (let i = 0; i < Neo.toolButtons.length; i++) {
          const toolTip = (
            /** @type {ToolTip} */
            Neo.toolButtons[i]
          );
          toolTip.setSelected(this.selected ? false : true);
        }
        Neo.painter.setToolByType(Painter.TOOLTYPE_FILL);
      }
      if (this.onmousedown) this.onmousedown(this);
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseUpHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseup) this.onmouseup(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOutHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseout) this.onmouseout(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOverHandler(e) {
      if (this.onmouseover) this.onmouseover(this);
    }
    /**
     * @param {boolean} selected
     * @returns {void}
     */
    setSelected(selected) {
      if (this.element) {
        if (selected) {
          this.element.className = "buttonOn";
        } else {
          this.element.className = "buttonOff";
        }
      }
      this.selected = selected;
    }
    update() {
    }
  };
  var RightButton = class extends Button {
    constructor() {
      super();
      /** @param {MouseEvent} e */
      __publicField(this, "_mouseOutHandler", function(e) {
      });
      this.params = null;
      this.element = null;
      this.selected = false;
    }
    /**
     * @param {string} elementID
     * @param {Object} [params]
     * @return {RightButton|null}
     */
    init(elementID, params = {}) {
      super.init(elementID, params);
      if (this.params) {
        this.params.type = "right";
      }
      return this;
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseUpHandler(e) {
      this.setSelected(!this.selected);
    }
    /**
     * @param {boolean} selected
     * @returns {void}
     */
    setSelected(selected) {
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
    }
    static clear() {
      const right = Neo.rightButton;
      right == null ? void 0 : right.setSelected(false);
    }
  };
  var FillButton = class extends Button {
    constructor() {
      super();
    }
    /**
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {FillButton|null}
     */
    init(elementID, params = {}) {
      super.init(elementID, params);
      if (this.params) {
        this.params.type = "fill";
      }
      return this;
    }
  };
  Neo.colorTips = [];
  var ColorTip = class {
    constructor() {
      this.element = null;
      this.params = null;
      this.elementID = "";
      this.selected = false;
      this.isMouseDown = false;
      this.color = "";
      this.onmousedown = null;
      this.onmouseup = null;
      this.onmouseover = null;
      this.onmouseout = null;
    }
    /**
     * @param {string} elementID
     * @param {any} [params]
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.selected = this.elementID == "neo-color1" ? true : false;
      this.isMouseDown = false;
      const ref = this;
      if (this.element) {
        this.element.onmousedown = function(e) {
          ref._mouseDownHandler(e);
        };
        this.element.onmouseup = function(e) {
          ref._mouseUpHandler(e);
        };
        this.element.onmouseover = function(e) {
          ref._mouseOverHandler(e);
        };
        this.element.onmouseout = function(e) {
          ref._mouseOutHandler(e);
        };
        this.element.addEventListener(
          "touchstart",
          /** @param {TouchEvent} e */
          function(e) {
            ref._mouseDownHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
        this.element.addEventListener(
          "touchend",
          /** @param {TouchEvent} e */
          function(e) {
            ref._mouseUpHandler(e);
          },
          true
        );
        this.element.className = "colorTipOff";
        var index = parseInt(this.elementID.slice(9)) - 1;
        this.element.style.left = index % 2 ? "0px" : "26px";
        this.element.style.top = Math.floor(index / 2) * 21 + "px";
        this.element.innerHTML = "<img style='max-width:44px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAASCAYAAAAg9DzcAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVRIx+3OAQkAMADDsO3+Pe8qCj+0Akq6bQFqS2wTCpwE+R4IiyVYsGDBggULfirBgn8HX7BzCRwDx1QeAAAAAElFTkSuQmCC' />";
      }
      this.setColor(Neo.config.colors[params.index - 1]);
      this.setSelected(this.selected);
      Neo.colorTips.push(this);
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     * @returns {void}
     */
    _mouseDownHandler(e) {
      if (Neo.painter.isUIPaused()) return;
      this.isMouseDown = true;
      for (var i = 0; i < Neo.colorTips.length; i++) {
        var colorTip = Neo.colorTips[i];
        if (this == colorTip) {
          switch (getModifier(e)) {
            case "shift":
              this.setColor(Neo.config.colors[this.params.index - 1]);
              break;
            case "right":
              this.setColor(Neo.painter.foregroundColor);
              break;
          }
        }
        colorTip.setSelected(this === colorTip);
      }
      Neo.painter.setColor(this.color);
      updateUIColor(true, false);
      if (this.onmousedown) this.onmousedown(this);
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     * @returns {void}
     */
    _mouseUpHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseup) this.onmouseup(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOutHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseout) this.onmouseout(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOverHandler(e) {
      if (this.onmouseover) this.onmouseover(this);
    }
    /**
     * @param {boolean} selected
     * @returns {void|null}
     */
    setSelected(selected) {
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
    }
    /**
     * カラーチップに色をセット
     * @param {string} color
     * @returns {void|null}
     */
    setColor(color) {
      if (!this.element) {
        console.error("setColor: Element not found");
        return null;
      }
      this.color = color;
      this.element.style.backgroundColor = color;
    }
    /**
     * @returns {ColorTip|null}
     */
    static getCurrent() {
      for (const colorTip of Neo.colorTips) {
        if (colorTip.selected) return colorTip;
      }
      return null;
    }
  };
  Neo.toolButtons = [];
  var ToolTip = class {
    constructor() {
      this.toolStrings = [];
      this.element = null;
      this.params = null;
      this.elementID = "";
      this.mode = 0;
      this.isMouseDown = false;
      this.onmousedown = null;
      this.onmouseup = null;
      this.onmouseover = null;
      this.onmouseout = null;
      this.selected = false;
      this.isTool = false;
      this.fixed = false;
      this.prevMode = -1;
      this.tools = [];
      this.toolIcons = [];
      this.hasTintImage = false;
      this.canvas = null;
      this.label = null;
    }
    /**
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {ToolTip|null}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.mode = 0;
      this.isMouseDown = false;
      const ref = this;
      if (this.element) {
        this.params.type = this.element.id;
        this.element.onmousedown = function(e) {
          ref._mouseDownHandler(e);
        };
        this.element.onmouseup = function(e) {
          ref._mouseUpHandler(e);
        };
        this.element.onmouseover = function(e) {
          ref._mouseOverHandler(e);
        };
        this.element.onmouseout = function(e) {
          ref._mouseOutHandler(e);
        };
        this.element.addEventListener(
          "touchstart",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseDownHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
        this.element.addEventListener(
          "touchend",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseUpHandler(e);
          },
          true
        );
        this.selected = this.params.type == "neo-pen" ? true : false;
        this.setSelected(this.selected);
        this.element.innerHTML = "<canvas width=46 height=18></canvas><div class='label'></div>";
        this.canvas = this.element.querySelector("canvas");
        this.label = this.element.querySelector("div");
      }
      this.update();
      return this;
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
      this.isMouseDown = true;
      if (this.isTool) {
        if (this.selected == false) {
          for (let i = 0; i < Neo.toolButtons.length; i++) {
            const toolTip = (
              /** @type {ToolTip} */
              Neo.toolButtons[i]
            );
            toolTip.setSelected(this === toolTip);
          }
        } else {
          var length = this.toolStrings.length;
          if (getModifier(e) == "right") {
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
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseUpHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseup) this.onmouseup(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOutHandler(e) {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.onmouseout) this.onmouseout(this);
      }
    }
    /** @param {MouseEvent} e */
    _mouseOverHandler(e) {
      if (this.onmouseover) this.onmouseover(this);
    }
    /**
     * @param {boolean} selected
     * @returns {void|null}
     */
    setSelected(selected) {
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
    }
    update() {
    }
    /**
     * ツールチップのアイコンを描画し、必要に応じて色調補正（ティント）を施す。
     * 動作モードが変更された際には新たな画像を読み込み、
     * 変更がない場合は既存のキャンバスに対し色調のみを再適用し効率化を図る。
     *
     * @param {string|number} color - アイコンに適用すべき色彩。カラー文字列、またはNeo.painterで解釈可能な数値IDを指定する。
     */
    draw(color) {
      if (this.hasTintImage) {
        const c = typeof color === "string" ? color : Neo.painter.getColorString(color);
        if (!this.canvas) {
          console.error("Canvas not found for ToolTip.");
          return;
        }
        const ctx = this.canvas.getContext("2d", {
          willReadFrequently: true
        });
        if (!ctx) {
          console.error("Failed to get 2D context for ToolTip canvas.");
          return;
        }
        if (this.prevMode != this.mode) {
          this.prevMode = this.mode;
          var img = new Image();
          const ref = this;
          img.onload = function() {
            if (!ref.canvas) {
              console.error("Canvas not found for ToolTip on image load.");
              return;
            }
            ctx.clearRect(0, 0, ref.canvas.width, ref.canvas.height);
            ref.drawTintImage(ctx, img, c, 0, 0);
          };
          img.src = this.toolIcons[this.mode];
        } else {
          tintImage(ctx, c);
        }
      }
    }
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
    drawTintImage(ctx, img, c, x, y) {
      ctx.drawImage(img, x, y);
      tintImage(ctx, c);
    }
  };
  __publicField(ToolTip, "bezier", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAT0lEQVRIx+3SQQoAIAhE0en+h7ZVEEKBZrX5b5sjKknAkRYpNslaMLPq44ZI9wwHs0vMQ/v87u0Kk8xfsaI242jbMdjPi5Y0r/zTAAAAD3UOjRf9jcO4sgAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "blur", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAASUlEQVRIx+3VMQ4AIAgEQeD/f8bWWBnJYUh2SgtgK82G8/MhzVKwxOtTLgIUx6tDout4laiPIICA0Qj4bXxAy0+8LZP9yACAJwsqkggS55eiZgAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "blurrect", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAX0lEQVRIx+2XQQ4AEAwEt+I7/v+8Org6lJKt6NzLjjYE8DAKtLpYoDeCCCC7tYUd3ru2qQOzDTyndhJzB6KSAmxSgM0fAlGuzBnmlziqxB8jFJkUYJMCbAQYPxt2kF06fvYKgjPBO/IAAAAASUVORK5CYII=");
  __publicField(ToolTip, "brush", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAQUlEQVRIx2NgGOKAEcb4z8CweRA4xpdUPSxofJ8BdP8WcjQxDaCDqQLQY4CsUBgFo2AUjIJRMApGwSgYBaNgZAIA0CoDwDbZu8oAAAAASUVORK5CYII=");
  __publicField(ToolTip, "burn", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAPklEQVRIx+3PMRIAMAQAQbzM0/0sKZPeiDG57TQ4keH0Htx9VR+MCM1vOezl8xUsv4IAAkYjoBsB3QgAgL9tYXgF19rh9yoAAAAASUVORK5CYII=");
  __publicField(ToolTip, "copy", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAW0lEQVRIx+2XMQoAIAwDU/E7/v95Orh2KMUSC7m5Qs6AUqAxG1gzOLirwxhgmXOjOlg1oQY8sjf2mvYNSICNBNhIgE3oH/jlzfdo34AE2EiATXsBA+5mww6S5QASDwSGMt8ouwAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "copy2", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAN0lEQVRIx+3PwQkAIBADwdPKt3MtQVCOPNz5B7JV0pNxOwRW9zng+G92n+hmQJoBaQakGSBJf9tyBgQUV/fKCAAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "ellipse", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAATklEQVRIx+2VMQ4AIAgD6/8fjbOJi1LFmt4OPQ0KIE7LNgggCBLbHkuFM9lM+Om+QwDjpksyb4tT86vlvzgEbYxefQPyv5D8HjDGGGOk6b3jJ+lYubd8AAAAAElFTkSuQmCC");
  __publicField(ToolTip, "ellipsefill", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAVUlEQVRIx+2VURIAEAgFc/9D5waSHpV5+43ZHRMizRnRA1REARLHHq6NCFl01Nail+LeEDMgU34nYhlQQd6K+PsGKkSEZyArBPoK3Y6K/AOEEEJIayZHbhIKjkZrFwAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "eraser", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABQElEQVRIx+1WQY7CMAwcI37Cad+yXOgH4Gu8gAt9CtrDirfMHjZJbbcktVSpQnROSeMkY3vsFHhzSG3xfLpz/JVmG0mIqDkIMcc6+7Kejx6fdb0dq7w09rVFkrjejrMOunQ9vg7f/5QEIAd6E1Eo38WF8fF7n8sdALCrLerIzoFI4sI0Vtv1SYZ8CVbeF7tzF7JugIkVkxOauc6CIe8842S+XmMfsq7TN9LRTngZmTmVD4SrnzYaGYhFoxCWgajXuMjYGTuJ3dlwIBIN3U0cUVqLXCs5E7YeVsvAYJul5HWeLUhL3EpstQwooqoOTEHDOebpMn7ngkUsg3RotU8X1MkuVDrYohkIupC0YArX6T+PfX3kcbQLNV/iCKi6EB3xqXdAZ0JKthZ8B0QEl673NIEX/0I/z36Rf6ENGzZ8EP4A8Lp+9e9VWC4AAAAASUVORK5CYII=");
  __publicField(ToolTip, "flip", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAZklEQVRIx+2XQQoAIAgE1+g7/f95degWHSyTTXDOhTsSiUBgOtCq8mD3DiOA3NxTCVgKaLA0qHiFOsHSnC8ELKQAmxRgE15APQfWv9pzLjwX+CXsjvBPKAXYpACb8AICzM2GHeSWAfVOCIiJuQ9tAAAAAElFTkSuQmCC");
  __publicField(ToolTip, "freehand", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAdUlEQVRIx+2WUQrAMAhD3dj9r+y+VoSyLhYDynzQv1qiJlCR4hzeAhVRsiC3Jkj0c5hN7Lx7IQ9SphLE1ICdwko420purEWQuywN3pqxgcw2+WwAtU1GzoqiLZNwZBvMAIcO8y3YKUO8mkbmjPzjK9E0TUPjBoeyLAS0usjLAAAAAElFTkSuQmCC");
  __publicField(ToolTip, "line", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAU0lEQVRIx+2UQQ4AIAjD8P+PxivRGDQC47C+oN1hIgTLQAt4qIga2c23XYAVPkm3CVhlb4ShAa/rQgMi1i0NyFg3LaBq3bAA1LpfAd7/EkIIIR2YXFYSCpWS8w8AAAAASUVORK5CYII=");
  __publicField(ToolTip, "merge", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAW0lEQVRIx+2XQQrAQAgDx9Lv9JF9+e6h54IINlgyZ4UMOYgwmAXXmRxc3WECorJ3dAfrJtXAC7c6PPygAQuosYAaC6hJ3YHqlfyC8Q1YQI0F1IwXCHg+G3WQKhvwgwUFmFyYbwAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "pen", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAK0lEQVRIx+3OsQkAMAwDQXn/oe3WfSAEctd9I5TA32pHJ/3AoTpfAQCAGwaa5AICJLKWSQAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "rect", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAQElEQVRIx+3TMQ4AIAhD0WK8/5VxdcIYY8rw3wok7YAEr6iGKaU74BY0ro+6FKhyDHe4VxRwm6eFLn8AAADwwQIwTQgGo9ZMywAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "rectfill", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAANElEQVRIx+3PIQ4AIBADwcL//3xYBMEgLiQztmab0GvcxkqqO3ALPbbO7rBXDnRzAADgYwvqDwIMJlGb5QAAAABJRU5ErkJggg==");
  __publicField(ToolTip, "text", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAcUlEQVRIx+2VwQ7AIAhDy7L//2V2WmIYg+ky2KEv8aCCqYQqQMgrJNpUQMXEKKDmAPHyspgSrBBvLZu3cQqZEdwhfusq0KdkVR5HlFfBvpI0mtIzeusFot7vFPqYuzZYMXUFlzc+qrIn7tf/ACGEkIwDlEQ94YZjzcgAAAAASUVORK5CYII=");
  __publicField(ToolTip, "tone", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAATCAYAAADWOo4fAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAO0lEQVRIx+3PIQ4AMAgEwaP//zNVVZUELiQ7CgWstFy8IaVsPhT1Lb/T+fQEAtwIcCPAjQC39QEAgJIL6DQCFhAqsRkAAAAASUVORK5CYII=");
  var PenTip = class extends ToolTip {
    constructor() {
      super();
      this.isTool = true;
      this.toolStrings = [];
      this.tools = [
        Painter.TOOLTYPE_PEN,
        Painter.TOOLTYPE_BRUSH,
        Painter.TOOLTYPE_TEXT
      ];
      this.hasTintImage = true;
      this.toolIcons = [ToolTip.pen, ToolTip.brush, ToolTip.text];
      this.mode = 0;
    }
    /**
     * 鉛筆･水彩･テキスト
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {PenTip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u925B\u7B46"),
        translate("\u6C34\u5F69"),
        translate("\uFF83\uFF77\uFF7D\uFF84")
      ];
      this.isTool = true;
      super.init(elementID, params);
      return this;
    }
    update() {
      for (var i = 0; i < this.tools.length; i++) {
        if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
      }
      this.draw(Neo.painter.foregroundColor);
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
  };
  var Pen2Tip = class extends ToolTip {
    constructor() {
      super();
      this.toolStrings = [];
      this.tools = [
        Painter.TOOLTYPE_TONE,
        Painter.TOOLTYPE_BLUR,
        Painter.TOOLTYPE_DODGE,
        Painter.TOOLTYPE_BURN
      ];
      this.hasTintImage = true;
      this.toolIcons = [ToolTip.tone, ToolTip.blur, ToolTip.burn, ToolTip.burn];
      this.mode = 0;
    }
    /**
     * トーン･ぼかし･覆い焼き･焼き込み
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {Pen2Tip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u30C8\u30FC\u30F3"),
        translate("\u307C\u304B\u3057"),
        translate("\u8986\u3044\u713C\u304D"),
        translate("\u713C\u304D\u8FBC\u307F")
      ];
      this.isTool = true;
      super.init(elementID, params);
      return this;
    }
    update() {
      for (var i = 0; i < this.tools.length; i++) {
        if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
      }
      switch (this.tools[this.mode]) {
        case Painter.TOOLTYPE_TONE:
          this.drawTone();
          break;
        case Painter.TOOLTYPE_DODGE:
          this.draw(4290822336);
          break;
        case Painter.TOOLTYPE_BURN:
          this.draw(4282400832);
          break;
        default:
          this.draw(Neo.painter.foregroundColor);
          break;
      }
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
    drawTone() {
      if (!this.canvas) {
        console.error("Canvas not found for Pen2Tip.");
        return;
      }
      const ctx = this.canvas.getContext("2d", {
        willReadFrequently: true
      });
      if (!ctx) {
        console.error("Failed to get 2D context for Pen2Tip canvas.");
        return;
      }
      var imageData = ctx.getImageData(0, 0, 46, 18);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var c = Neo.painter.getColor() | 4278190080;
      var a = Math.floor(Neo.painter.alpha * 255);
      var toneData = Neo.painter.getToneData(a);
      for (var j = 0; j < 18; j++) {
        for (var i = 0; i < 46; i++) {
          if (j >= 1 && j < 12 && i >= 2 && i < 26 && toneData[i % 4 + j % 4 * 4]) {
            buf32[j * 46 + i] = c;
          } else {
            buf32[j * 46 + i] = 0;
          }
        }
      }
      imageData.data.set(buf8);
      ctx.putImageData(imageData, 0, 0);
      this.prevMode = this.mode;
    }
  };
  var EraserTip = class extends ToolTip {
    constructor() {
      super();
      this.toolStrings = [];
      this.drawOnce = false;
      this.isTool = true;
      this.label = null;
      this.canvas = null;
      this.mode = 0;
      this.tools = [
        Painter.TOOLTYPE_ERASER,
        Painter.TOOLTYPE_ERASERECT,
        Painter.TOOLTYPE_ERASEALL
      ];
    }
    /**
     * 消しペン･消し四角･全消し
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {EraserTip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u6D88\u3057\u30DA\u30F3"),
        translate("\u6D88\u3057\u56DB\u89D2"),
        translate("\u5168\u6D88\u3057")
      ];
      this.drawOnce = false;
      this.isTool = true;
      super.init(elementID, params);
      return this;
    }
    update() {
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
    }
    draw() {
      if (!this.canvas) {
        console.error("EraserTip: Canvas element not found");
        return null;
      }
      var ctx = this.canvas.getContext("2d", {
        willReadFrequently: true
      });
      if (!ctx) {
        console.error("Failed to get 2D context for EraserTip canvas.");
        return null;
      }
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var img = new Image();
      img.onload = function() {
        ctx == null ? void 0 : ctx.drawImage(img, 0, 0);
      };
      img.src = ToolTip.eraser;
    }
  };
  var EffectTip = class extends ToolTip {
    constructor() {
      super();
      this.toolStrings = [];
      this.label = null;
      this.isTool = false;
      this.mode = 0;
      this.tools = [
        Painter.TOOLTYPE_RECTFILL,
        Painter.TOOLTYPE_RECT,
        Painter.TOOLTYPE_ELLIPSEFILL,
        Painter.TOOLTYPE_ELLIPSE
      ];
      this.hasTintImage = true;
      this.toolIcons = [
        ToolTip.rectfill,
        ToolTip.rect,
        ToolTip.ellipsefill,
        ToolTip.ellipse
      ];
    }
    /**
     * 四角･線四角･楕円･線楕円
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {EffectTip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u56DB\u89D2"),
        translate("\u7DDA\u56DB\u89D2"),
        translate("\u6955\u5186"),
        translate("\u7DDA\u6955\u5186")
      ];
      this.isTool = true;
      super.init(elementID, params);
      return this;
    }
    update() {
      for (var i = 0; i < this.tools.length; i++) {
        if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
      }
      this.draw(Neo.painter.foregroundColor);
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
  };
  var Effect2Tip = class extends ToolTip {
    constructor() {
      super();
      this.toolStrings = [];
      this.isTool = true;
      this.img = null;
      this.element = null;
      this.mode = 0;
      this.tools = [
        Painter.TOOLTYPE_COPY,
        Painter.TOOLTYPE_MERGE,
        Painter.TOOLTYPE_BLURRECT,
        Painter.TOOLTYPE_FLIP_H,
        Painter.TOOLTYPE_FLIP_V,
        Painter.TOOLTYPE_TURN
      ];
      this.hasTintImage = true;
      this.toolIcons = [
        ToolTip.copy,
        ToolTip.merge,
        ToolTip.blurrect,
        ToolTip.flip,
        ToolTip.flip,
        ToolTip.flip
      ];
    }
    /**
     * コピー･レイヤー結合･角取り･左右反転･上下反転･傾け
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {Effect2Tip|null}
     */
    init(elementID, params = {}) {
      var _a;
      this.toolStrings = [
        translate("\u30B3\u30D4\u30FC"),
        translate("\uFF9A\uFF72\uFF94\u7D50\u5408"),
        translate("\u89D2\u53D6\u308A"),
        translate("\u5DE6\u53F3\u53CD\u8EE2"),
        translate("\u4E0A\u4E0B\u53CD\u8EE2"),
        translate("\u50BE\u3051")
      ];
      this.isTool = true;
      super.init(elementID, params);
      this.img = document.createElement("img");
      this.img.src = ToolTip.copy2;
      (_a = this.element) == null ? void 0 : _a.appendChild(this.img);
      return this;
    }
    update() {
      for (var i = 0; i < this.tools.length; i++) {
        if (Neo.painter.tool.type == this.tools[i]) this.mode = i;
      }
      this.draw(Neo.painter.foregroundColor);
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
  };
  var MaskTip = class extends ToolTip {
    constructor() {
      super();
      this.isMouseDown = false;
      this.onmousedown = null;
      this.canvas = null;
      this.toolStrings = [];
      this.mode = 0;
    }
    /**
     * 通常･マスク･逆マスク･加算･逆加算
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {MaskTip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u901A\u5E38"),
        translate("\u30DE\u30B9\u30AF"),
        translate("\u9006\uFF8F\uFF7D\uFF78"),
        translate("\u52A0\u7B97"),
        translate("\u9006\u52A0\u7B97")
      ];
      this.fixed = true;
      super.init(elementID, params);
      return this;
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
      this.isMouseDown = true;
      if (getModifier(e) == "right") {
        Neo.painter.maskColor = Neo.painter.foregroundColor;
      } else {
        var length = this.toolStrings.length;
        this.mode++;
        if (this.mode >= length) this.mode = 0;
        Neo.painter.maskType = this.mode;
      }
      this.update();
      if (this.onmousedown) this.onmousedown(this);
    }
    update() {
      this.draw(Neo.painter.maskColor);
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
    /**
     * マスクチップのアイコンを描画して色調補正（ティント）を施す。
     *
     * @param {string|number} color - アイコンに適用すべき色彩。カラー文字列、またはNeo.painterで解釈可能な数値IDを指定する。
     */
    draw(color) {
      var _a;
      const c = typeof color === "string" ? color : Neo.painter.getColorString(color);
      var ctx = (_a = this.canvas) == null ? void 0 : _a.getContext("2d", {
        willReadFrequently: true
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
    }
  };
  var DrawTip = class extends ToolTip {
    constructor() {
      super();
      this.toolStrings = [];
      this.hasTintImage = true;
      this.toolIcons = [ToolTip.freehand, ToolTip.line, ToolTip.bezier];
      this.mode = 0;
    }
    /**
     * 手書き･直線･BZ曲線
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {DrawTip|null}
     */
    init(elementID, params = {}) {
      this.toolStrings = [
        translate("\u624B\u66F8\u304D"),
        translate("\u76F4\u7DDA"),
        translate("BZ\u66F2\u7DDA")
      ];
      this.fixed = true;
      super.init(elementID, params);
      return this;
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
      this.isMouseDown = true;
      var length = this.toolStrings.length;
      if (getModifier(e) == "right") {
        this.mode--;
        if (this.mode < 0) this.mode = length - 1;
      } else {
        this.mode++;
        if (this.mode >= length) this.mode = 0;
      }
      Neo.painter.drawType = this.mode;
      this.update();
      if (this.onmousedown) this.onmousedown(this);
    }
    update() {
      this.mode = Neo.painter.drawType;
      this.draw(Neo.painter.foregroundColor);
      if (this.label) {
        this.label.innerHTML = this.toolStrings[this.mode];
      }
    }
  };
  Neo.sliders = [];
  var ColorSlider = class {
    constructor() {
      this.selected = false;
      this.toolStrings = [];
      this.type = 0;
      this.prefix = "";
      this.value0 = 0;
      this.x0 = 0;
      this.element = null;
      this.elementID = "";
      this.params = {};
      this.value = 0;
      this.isMouseDown = false;
      this.slider = null;
      this.label = null;
      this.hit = null;
    }
    /**
     * カラースライダーを初期化
     * @param {string} elementID
     * @param {any} [params]
     * @returns {ColorSlider}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.isMouseDown = false;
      this.value = 0;
      this.type = this.params.type;
      if (this.element) {
        this.element.className = "colorSlider";
        this.element.innerHTML = "<div class='slider'></div><div class='label'></div>";
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
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    downHandler(x, y) {
      if (Neo.painter.isShiftDown) {
        this.shift(x, y);
      } else {
        this.slide(x, y);
      }
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    moveHandler(x, y) {
      this.slide(x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    upHandler(x, y) {
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    shift(x, y) {
      var value;
      if (x >= 0 && x < 60 && y >= 0 && y <= 15) {
        var v = Math.floor((x - 5) * 5);
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
        Neo.painter.alpha = this.value / 255;
        this.update();
        updateUIColor(false, false);
      } else {
        const r = Neo.sliders[Neo.SLIDERTYPE_RED].value;
        const g = Neo.sliders[Neo.SLIDERTYPE_GREEN].value;
        const b = Neo.sliders[Neo.SLIDERTYPE_BLUE].value;
        Neo.painter.setColor(r << 16 | g << 8 | b);
        updateUIColor(true, true);
      }
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    slide(x, y) {
      var value;
      if (x >= 0 && x < 60 && y >= 0 && y <= 15) {
        var v = Math.floor((x - 5) * 5);
        value = Math.round(v / 5) * 5;
        this.value0 = value;
        this.x0 = x;
      } else {
        var d = (x - this.x0) / 3;
        value = this.value0 + d;
      }
      var min = this.type == Neo.SLIDERTYPE_ALPHA ? 1 : 0;
      this.value = Math.max(Math.min(value, 255), min);
      if (this.type == Neo.SLIDERTYPE_ALPHA) {
        Neo.painter.alpha = this.value / 255;
        this.update();
        updateUIColor(false, false);
      } else {
        var r = Neo.sliders[Neo.SLIDERTYPE_RED].value;
        var g = Neo.sliders[Neo.SLIDERTYPE_GREEN].value;
        var b = Neo.sliders[Neo.SLIDERTYPE_BLUE].value;
        var color = r << 16 | g << 8 | b;
        var colorTip = (
          /** @type {ColorTip|null} **/
          ColorTip.getCurrent()
        );
        if (colorTip) {
          colorTip.setColor(Neo.painter.getColorString(color));
        }
        Neo.painter.setColor(color);
      }
    }
    update() {
      var color = Neo.painter.getColor();
      var alpha = Neo.painter.alpha * 255;
      switch (this.type) {
        case Neo.SLIDERTYPE_RED:
          this.value = color & 255;
          break;
        case Neo.SLIDERTYPE_GREEN:
          this.value = (color & 65280) >> 8;
          break;
        case Neo.SLIDERTYPE_BLUE:
          this.value = (color & 16711680) >> 16;
          break;
        case Neo.SLIDERTYPE_ALPHA:
          this.value = alpha;
          break;
      }
      var width = this.value * 49 / 255;
      width = Math.max(Math.min(48, width), 1);
      if (this.slider instanceof HTMLElement) {
        this.slider.style.width = width.toFixed(2) + "px";
      }
      if (this.label instanceof HTMLElement) {
        this.label.innerHTML = this.prefix + this.value.toFixed(0);
      }
    }
  };
  var SizeSlider = class {
    constructor() {
      this.selected = false;
      this.toolStrings = [];
      this.y0 = 0;
      this.value0 = 0;
      this.onmousedown = null;
      this.params = {};
      this.element = null;
      this.elementID = "";
      this.value = 1;
      this.isMouseDown = false;
      this.slider = null;
      this.label = null;
      this.hit = null;
    }
    /**
     * サイズスライダーを初期化
     * @param {string} elementID - 要素のID
     * @param {any} [params] - パラメータ
     * @returns {SizeSlider} - 初期化されたサイズスライダー
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.isMouseDown = false;
      this.value = this.value0 = 1;
      if (this.element) {
        this.element.className = "sizeSlider";
        this.element.innerHTML = "<div class='slider'></div><div class='label'></div>";
        this.element.innerHTML += "<div class='hit'></div>";
        this.slider = this.element.querySelector(".slider");
        this.label = this.element.querySelector(".label");
        this.hit = this.element.querySelector(".hit");
        this.hit["data-slider"] = params.type;
      }
      if (this.slider instanceof HTMLElement) {
        this.slider.style.backgroundColor = Neo.painter.foregroundColor;
      }
      this.update();
      return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    downHandler(x, y) {
      if (Neo.painter.isShiftDown) {
        this.shift(x, y);
      } else {
        this.value0 = this.value;
        this.y0 = y;
        this.slide(x, y);
      }
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    moveHandler(x, y) {
      this.slide(x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    upHandler(x, y) {
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    shift(x, y) {
      var _a;
      var value0 = Neo.painter.lineWidth;
      var value;
      if (!((_a = Neo.painter.sliderTool) == null ? void 0 : _a.isAlt)) {
        var v = Math.floor((y - 4) * 30 / 33);
        value = Math.max(Math.min(v, 30), 1);
        if (value0 > value || value0 == 30) {
          value0--;
        } else {
          value0++;
        }
        this.setSize(value0);
      }
    }
    /**
     * スライダーのドラッグ操作によりブラシサイズを更新する。
     * yはサイズ値の算出に、xはポインタがスライダー領域内にあるかの
     * 当たり判定にのみ使用する。
     * @param {number} x - 相対X座標(スライダー領域内判定用)
     * @param {number} y - 相対Y座標(ブラシサイズの算出に使用)
     */
    slide(x, y) {
      var _a;
      var value;
      if (!((_a = Neo.painter.sliderTool) == null ? void 0 : _a.isAlt)) {
        if (x >= 0 && x < 48 && y >= 0 && y < 41) {
          var v = Math.floor((y - 4) * 30 / 33);
          value = v;
          this.value0 = value;
          this.y0 = y;
        } else {
          var d = (y - this.y0) / 7;
          value = this.value0 + d;
        }
      } else {
        var d = y - this.y0;
        value = this.value0 + d;
      }
      value = Math.max(Math.min(value, 30), 1);
      this.setSize(value);
    }
    /**
     * サイズをセット
     * @param {number} value
     */
    setSize(value) {
      value = Math.round(value);
      Neo.painter.lineWidth = Math.max(Math.min(30, value), 1);
      var tool = Neo.painter.getCurrentTool();
      if (tool) {
        if (tool.type == Painter.TOOLTYPE_BRUSH) {
          if (Neo.painter.brushTool) {
            Neo.painter.alpha = Neo.painter.brushTool.getAlpha();
          }
          Neo.sliders[Neo.SLIDERTYPE_ALPHA].update();
        } else if (tool.type == Painter.TOOLTYPE_TEXT) {
          Neo.painter.updateInputText();
        }
      }
      this.update();
    }
    update() {
      this.value = Neo.painter.lineWidth;
      var height = this.value * 33 / 30;
      height = Math.max(Math.min(34, height), 1);
      if (this.slider instanceof HTMLElement) {
        this.slider.style.height = height.toFixed(2) + "px";
        if (this.label instanceof HTMLElement) {
          this.label.innerHTML = this.value + "px";
        }
        this.slider.style.backgroundColor = Neo.painter.foregroundColor;
      }
    }
  };
  var LayerControl = class {
    constructor() {
      this.onmousedown = null;
      this.bg = null;
      this.label0 = null;
      this.label1 = null;
      this.line0 = null;
      this.line1 = null;
      this.element = null;
      this.params = null;
      this.elementID = "";
      this.isMouseDown = false;
    }
    /**
     * レイヤーコントローラーを初期化
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {LayerControl|null}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.isMouseDown = false;
      const ref = this;
      if (this.element) {
        this.element.onmousedown = function(e) {
          ref._mouseDownHandler(e);
        };
        this.element.addEventListener(
          "touchstart",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseDownHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
        this.element.className = "layerControl";
        var layerStrings = [translate("Layer0"), translate("Layer1")];
        this.element.innerHTML = "<div class='bg'></div><div class='label0'>" + layerStrings[0] + "</div><div class='label1'>" + layerStrings[1] + "</div><div class='line1'></div><div class='line0'></div>";
        this.bg = this.element.querySelector(".bg");
        this.label0 = this.element.querySelector(".label0");
        this.label1 = this.element.querySelector(".label1");
        this.line0 = this.element.querySelector(".line0");
        this.line1 = this.element.querySelector(".line1");
      }
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
    }
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
      if (getModifier(e) == "right") {
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
      if (Neo.painter.tool.type == Painter.TOOLTYPE_PASTE) {
        if (Neo.painter.pasteTool) {
          Neo.painter.pasteTool.drawCursor(Neo.painter);
        }
      }
      this.update();
      if (this.onmousedown) this.onmousedown(this);
    }
    update() {
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
    }
  };
  Neo.reserveControls = [];
  var ReserveControl = class {
    constructor() {
      this.element = null;
      this.elementID = "";
      this.params = null;
      this.reserve = null;
      this.isMouseDown = false;
    }
    /**
     * リバースコントローラーを初期化
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {ReserveControl|null}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      const ref = this;
      if (this.element) {
        this.element.onmousedown = function(e) {
          ref._mouseDownHandler(e);
        };
        this.element.addEventListener(
          "touchstart",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._mouseDownHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
        this.element.className = "reserve";
        var index = parseInt(this.elementID.slice(11)) - 1;
        this.element.style.top = "1px";
        this.element.style.left = index * 15 + 2 + "px";
        this.reserve = clone(Neo.config.reserves[index]);
      }
      this.update();
      Neo.reserveControls.push(this);
      return this;
    }
    /**
     * 保管ペンに保存
     */
    /** @param {MouseEvent|TouchEvent} e */
    _mouseDownHandler(e) {
      if (getModifier(e) == "right") {
        this.save();
      } else {
        this.load();
      }
      this.update();
    }
    load() {
      if (!this.reserve) {
        console.error("Reserve not found for ReserveControl load.");
        return;
      }
      Neo.painter.setToolByType(this.reserve.tool);
      Neo.painter.foregroundColor = this.reserve.color;
      Neo.painter.lineWidth = this.reserve.size;
      Neo.painter.alpha = this.reserve.alpha;
      switch (this.reserve.tool) {
        case Painter.TOOLTYPE_PEN:
        case Painter.TOOLTYPE_BRUSH:
        case Painter.TOOLTYPE_TONE:
          Neo.painter.drawType = this.reserve.drawType;
      }
      updateUI();
    }
    save() {
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
      updateUI();
    }
    update() {
      if (!this.element) {
        console.error("Element not found for ReserveControl update.");
        return;
      }
      this.element.style.backgroundColor = this.reserve.color;
    }
  };
  Neo.scrollH = null;
  Neo.scrollV = null;
  var ScrollBarButton = class {
    constructor() {
      this.element = null;
      this.elementID = "";
      this.params = /** @type {any} */
      null;
      this.barButton = null;
    }
    /**
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {ScrollBarButton|null} 初期化成功時はインスタンス、失敗時は null
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      if (this.element) {
        this.element.innerHTML = "<div></div>";
        this.barButton = this.element.querySelector("div");
        this.element["data-bar"] = true;
      }
      if (this.barButton) {
        this.barButton["data-bar"] = true;
      }
      if (elementID == "neo-scrollH") Neo.scrollH = this;
      if (elementID == "neo-scrollV") Neo.scrollV = this;
      return this;
    }
    /**
     * @param {Painter} oe
     * @returns {void|null} 更新成功時は void、失敗時は null
     */
    update(oe) {
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
    }
  };
  var _ViewerButton = class _ViewerButton extends Button {
    constructor() {
      super();
      this.element = null;
      this.canvas = null;
    }
    /**
     *
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {ViewerButton|null}
     */
    init(elementID, params = {}) {
      super.init(elementID, params);
      if (elementID != "neo-viewerSpeed") {
        if (this.element) {
          this.element.innerHTML = "<canvas width=24 height=24></canvas>";
          this.canvas = this.element.querySelector("canvas");
        }
        if (!this.canvas) {
          console.error("Canvas element not found for " + elementID);
          return null;
        }
        const ctx = this.canvas.getContext("2d", {
          willReadFrequently: true
        });
        if (!ctx) {
          console.error("Canvas context not found for " + elementID);
          return null;
        }
        const img = new Image();
        img.onload = function() {
          ctx.clearRect(0, 0, 24, 24);
          ctx.drawImage(img, 0, 0);
          tintImage(ctx, Neo.config.color_text);
        }.bind(this);
        img.src = /**@type {any}*/
        _ViewerButton[elementID.toLowerCase().replace(/neo-viewer/, "")];
      } else {
        if (this.element) {
          this.element.innerHTML = "<div></div><canvas width=24 height=24></canvas>";
        }
        this.update();
      }
      return this;
    }
    update() {
      if (this.elementID == "neo-viewerSpeed") {
        var mode = Neo.painter._actionMgr.speedMode();
        var speedString = translate(_ViewerButton.speedStrings[mode]);
        if (this.element) {
          this.element.children[0].innerHTML = "<div>" + speedString + "</div>";
        }
      }
    }
  };
  __publicField(_ViewerButton, "speedStrings", ["\u6700", "\u65E9", "\u65E2", "\u920D"]);
  __publicField(_ViewerButton, "minus", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYMAG5H+AEDYAADOnAi81ABEKAAAAAElFTkSuQmCC");
  __publicField(_ViewerButton, "plus", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX/////HgD/HgAvnCBAAAAAAnRSTlMAAHaTzTgAAAAfSURBVAjXY2BAA0wTMAimVasaIARj2FQHCIGkBAUAAGm3CXHeKF1tAAAAAElFTkSuQmCC");
  __publicField(_ViewerButton, "play", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX/////HgD/HgAvnCBAAAAAAnRSTlMAAHaTzTgAAAAuSURBVAjXY2BAABUQoQkitBxAxAQQsQRErAQRq+CspSBiKogIAekIABKqDhAzAAuwB6SsnxQ6AAAAAElFTkSuQmCC");
  __publicField(_ViewerButton, "stop", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYIAB+x8EEBgAACjyDV75Mi9xAAAAAElFTkSuQmCC");
  __publicField(_ViewerButton, "rewind", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/////HgA/G9hMAAAAAXRSTlMAQObYZgAAACxJREFUCNdjYAADJiYGNjYGPj4GOTkGOzuGujqGf/9AJJANFAGKA2WBahgYAIE2Bb0RIYJRAAAAAElFTkSuQmCC");
  var ViewerButton = _ViewerButton;
  var ViewerBar = class {
    constructor() {
      this.params = null;
      this.elementID = "";
      this.isMouseDown = false;
      this.element;
      this.seekElement;
      this.markElement;
      this.textElement;
      this.width = 0;
      this.length = 0;
      this.mark = 0;
      this.seek = 0;
    }
    /**
     *
     * @param {string} elementID
     * @param {Object} [params]
     * @returns {ViewerBar}
     */
    init(elementID, params = {}) {
      this.element = document.getElementById(elementID);
      this.params = params || {};
      this.elementID = elementID;
      this.isMouseDown = false;
      if (this.element) {
        this.element.style.display = "inline-block";
        this.element.innerHTML = "<div id='neo-viewerBarLeft'></div><div id='neo-viewerBarMark'></div><div id='neo-viewerBarText'>hoge</div>";
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
        const ref = this;
        this.element.addEventListener(
          "pointerdown",
          function(e) {
            ref.isMouseDown = true;
            ref._touchHandler(e);
          },
          { passive: false, capture: true }
        );
        this.element.addEventListener(
          "pointermove",
          function(e) {
            e.preventDefault();
            if (ref.isMouseDown) {
              ref._touchHandler(e);
            }
          },
          { passive: false, capture: true }
        );
        this.element.addEventListener(
          "touchstart",
          /**
           * @param {TouchEvent} e
           */
          function(e) {
            ref._touchHandler(e);
            e.preventDefault();
          },
          { passive: false, capture: true }
        );
      }
      this.update();
      return this;
    }
    /** 現在の再生位置に合わせて、シーク位置とマークを再描画する */
    update() {
      if (this.element) {
        this.width = this.element.offsetWidth;
      }
      this.mark = Neo.painter._actionMgr._mark;
      this.seek = Neo.painter._actionMgr._head;
      var markX = this.mark / this.length * this.width;
      this.markElement.style.left = markX + "px";
      var seekX = this.seek / this.length * this.width;
      this.seekElement.style.width = seekX + "px";
      this.textElement.innerHTML = this.seek + "/" + this.length;
    }
    /** @param {TouchEvent|PointerEvent} e */
    _touchHandler(e) {
      if (e instanceof PointerEvent) {
        if (e.offsetX === void 0) {
          return;
        }
        let x = e.offsetX / this.width;
        x = Math.max(Math.min(x, 1), 0);
        Neo.painter._actionMgr._mark = Math.round(x * this.length);
      }
      Neo.painter.onmark();
    }
  };

  // src/actions.js
  var ActionManager = class {
    constructor() {
      this._items = [];
      this._head = 0;
      this._index = 0;
      this._pause = false;
      this._mark = 0;
      this._speedTable = [-1, 0, 1, 11];
      Neo.speed = parseInt(Neo.config.speed || 0);
      this._prevSpeed = Neo.speed;
      this.isMouseDown = false;
    }
    speedMode() {
      if (Neo.speed < 0) {
        return 0;
      } else if (Neo.speed == 0) {
        return 1;
      } else if (Neo.speed <= 10) {
        return 2;
      } else {
        return 3;
      }
    }
    step() {
      if (!Neo.isAnimation) return;
      if (this._items.length > this._head) {
        this._items.length = this._head;
      }
      this._items.push([]);
      this._head++;
      this._index = 0;
    }
    back() {
      if (!Neo.isAnimation) return;
      if (this._head > 0) {
        this._head--;
      }
    }
    forward() {
      if (!Neo.isAnimation) return;
      if (this._head < this._items.length) {
        this._head++;
      }
    }
    push() {
      if (!Neo.isAnimation) return;
      const head = this._items[this._head - 1];
      for (let i = 0; i < arguments.length; i++) {
        head.push(arguments[i]);
      }
    }
    pushCurrent() {
      if (!Neo.isAnimation) return;
      const oe = Neo.painter;
      const head = this._items[this._head - 1];
      const color = oe._currentColor;
      const mask = oe._currentMask;
      const width = oe._currentWidth;
      const type = oe._currentMaskType;
      head.push(color[0], color[1], color[2], color[3]);
      head.push(mask[0], mask[1], mask[2]);
      head.push(width);
      head.push(type);
    }
    /**
     * 指定された描画アクション（履歴データ）から、ブラシ設定（色、マスク、太さ）を復元する
     * @param {Number[]} item - 描画アクションのデータ配列
     * [2]~[5]: RGBAカラー、[6]~[8]: マスクカラー、[9]: ブラシ幅、[10]: マスクタイプ
     */
    getCurrent(item) {
      const oe = Neo.painter;
      oe._currentColor = [item[2], item[3], item[4], item[5]];
      oe._currentMask = [item[6], item[7], item[8]];
      oe._currentWidth = item[9];
      oe._currentMaskType = item[10];
    }
    skip() {
      for (let i = 0; i < this._items.length; i++) {
        if (this._items[i][0] == "restore") {
          this._head = i;
        }
      }
    }
    play() {
      if (Neo.viewerBar) Neo.viewerBar.update();
      if (this._pause) {
        console.log("suspend viewer");
        return;
      }
      const painter = Neo.painter;
      if (this._head >= this._items.length || this._head >= this._mark) {
        painter.dirty = false;
        painter.busy = false;
        if (painter.busySkipped) {
          painter.busySkipped = false;
          console.log("animation skipped");
        } else {
          console.log("animation finished");
        }
        return;
      }
      const item = this._items[this._head];
      if (!Neo.viewer && !painter.busySkipped) {
        painter._pushUndo(0, 0, painter.canvasWidth, painter.canvasHeight, true);
      }
      if (Neo.viewer && Neo.viewerSpeed && this._index == 0) {
        Neo.viewerSpeed.update();
      }
      let func;
      const hasRestore = this._items.some(
        (item2) => item2[0] === "restore"
      );
      if (painter.busySkipped && hasRestore) {
        func = item[0] && /**@type {any}**/
        this[item[0]] && item[0] === "restore" ? item[0] : "dummy";
      } else {
        func = item[0] && /**@type {any}**/
        this[item[0]] ? item[0] : "dummy";
      }
      const ref = this;
      const wait = this._prevSpeed < 0 ? 0 : this._prevSpeed;
      this[func](item, function(result) {
        if (result) {
          if (painter.busySkipped && ref._head < ref._mark - 2 && ref._mark - 2 >= 0 && ref._items[ref._mark - 1][0] == "restore") {
            ref._head = ref._mark - 2;
          } else {
            ref._head++;
          }
          ref._index = 0;
          ref._prevSpeed = Neo.speed;
        }
        setTimeout(function() {
          painter._actionMgr.play();
        }, wait);
      });
    }
    /*
    -------------------------------------------------------------------------
        Action
    -------------------------------------------------------------------------
    */
    /**
     * 全消し
     */
    clearCanvas() {
      if (typeof arguments[0] != "object") {
        this.push("clearCanvas");
      }
      const painter = Neo.painter;
      painter.canvasCtx[0].clearRect(
        0,
        0,
        painter.canvasWidth,
        painter.canvasHeight
      );
      painter.canvasCtx[1].clearRect(
        0,
        0,
        painter.canvasWidth,
        painter.canvasHeight
      );
      painter.updateDestCanvas(0, 0, painter.canvasWidth, painter.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 画面を指定色で塗りつぶす（バケツツール）。
     * @param {*} layer - レイヤー番号、または録画データ配列
     * @param {*} [x] - X座標、または再生用コールバック
     * @param {*} [y] - Y座標
     * @param {*} [color] - 塗りつぶし色
     */
    floodFill(layer, x, y, color) {
      if (typeof layer != "object") {
        this.push("floodFill", layer, x, y, color);
      } else {
        const item = layer;
        layer = item[1];
        x = item[2];
        y = item[3];
        color = item[4];
      }
      const painter = Neo.painter;
      painter.doFloodFill(layer, x, y, color);
      painter.updateDestCanvas(0, 0, painter.canvasWidth, painter.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 全消し
     */
    eraseAll() {
      const painter = Neo.painter;
      let layer = painter.current;
      if (typeof arguments[0] != "object") {
        this.push("eraseAll", layer);
      } else {
        var item = arguments[0];
        layer = item[1];
      }
      const oe = Neo.painter;
      oe.canvasCtx[layer].clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 手書き線の描画アクション 等速
     * @param {number|Array<*>} x0 - 開始X座標、または一括描画するアクションデータ配列(item)
     * @param {number|null} [y0] - 開始Y座標
     * @param {number|null} [lineType] - 線の種類
     */
    freeHand(x0, y0, lineType) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const lineType2 = item[11];
        this.getCurrent(item);
        var i = this._index;
        if (i == 0) {
          i = 12;
        } else {
          i += 2;
        }
        const x1 = item[i + 0];
        const y1 = item[i + 1];
        const x02 = item[i + 2];
        const y02 = item[i + 3];
        oe.drawLine(oe.canvasCtx[layer2], x02, y02, x1, y1, lineType2);
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
    }
    /**
     * 手書き線の描画アクション 高速
     * @param {number|Array<*>} x0 - 開始X座標、または一括描画するアクションデータ配列(item)
     * @param {number|null} [y0] - 開始Y座標
     * @param {number|null} [lineType] - 線の種類
     */
    freeHandFast(x0, y0, lineType) {
      const oe = Neo.painter;
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
        let x02, y02, x1, y1, lineType2;
        var item = arguments[0];
        var length = item.length;
        layer = item[1];
        this.getCurrent(item);
        lineType2 = item[11];
        x02 = item[12];
        y02 = item[13];
        for (var i = 14; i + 1 < length; i += 2) {
          x1 = x02;
          y1 = y02;
          x02 = item[i + 0];
          y02 = item[i + 1];
          oe.drawLine(oe.canvasCtx[layer], x02, y02, x1, y1, lineType2);
        }
        oe.prevLine = null;
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      }
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * フリーハンド
     * @param {number} x0
     * @param {number} y0
     * @param {number} x1
     * @param {number} y1
     * @param {number} lineType
     */
    freeHandMove(x0, y0, x1, y1, lineType) {
      if (arguments.length > 1) {
        const oe = Neo.painter;
        var layer = oe.current;
        var head = this._items[this._head - 1];
        if (head && head.length == 0) {
          this.push("freeHand", layer);
          this.pushCurrent();
          this.push(lineType, x1, y1, x0, y0);
        } else if (Neo.isAnimation) {
          head.push(x0, y0);
          var x = head[head.length - 4];
          var y = head[head.length - 3];
          if (x1 != head[head.length - 4] || y1 != head[head.length - 3] || lineType != head[11]) {
            console.log("eror in freeHandMove?", x, y, lineType, head);
          }
        }
        oe.drawLine(oe.canvasCtx[layer], x0, y0, x1, y1, lineType);
      } else {
        console.log("error in freeHandMove: called from recorder");
      }
    }
    /**
     * 直線描画
     * @param {number|Array<*>} x0 - 始点X座標、または描画データ配列
     * @param {number|null} [y0] - 始点Y座標、またはコールバック関数
     * @param {number|null} [x1] - 終点X座標
     * @param {number|null} [y1] - 終点Y座標
     * @param {number|null} [lineType] - 線の種類
     */
    line(x0, y0, x1, y1, lineType) {
      const oe = Neo.painter;
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
        const item = arguments[0];
        const layer2 = item[1];
        this.getCurrent(item);
        const lineType2 = item[11];
        const x02 = item[12];
        const y02 = item[13];
        let x12 = item[14];
        let y12 = item[15];
        if (x12 === null) x12 = x02;
        if (y12 === null) y12 = y02;
        oe.drawLine(oe.canvasCtx[layer2], x02, y02, x12, y12, lineType2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
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
    bezier(x0, y0, x1, y1, x2, y2, x3, y3, lineType) {
      const oe = Neo.painter;
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
          isReplay
        );
      } else {
        const item = arguments[0];
        const layer2 = item[1];
        this.getCurrent(item);
        const lineType2 = item[11];
        const x02 = item[12];
        const y02 = item[13];
        const x12 = item[14];
        const y12 = item[15];
        const x22 = item[16];
        const y22 = item[17];
        const x32 = item[18];
        const y32 = item[19];
        oe.drawBezier(
          oe.canvasCtx[layer2],
          x02,
          y02,
          x12,
          y12,
          x22,
          y22,
          x32,
          y32,
          lineType2,
          isReplay
        );
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 塗り潰し
     * @param {number|Array<*>} x - 始点X座標、またはアクションデータ配列
     * @param {number|null} [y] - 始点Y座標、またはコールバック関数
     * @param {number|null} [width] - 矩形の幅
     * @param {number|null} [height] - 矩形の高さ
     * @param {number|null} [type] - 塗りつぶしの種類(四角楕円など)
     */
    fill(x, y, width, height, type) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        this.getCurrent(item);
        const x2 = item[11];
        const y2 = item[12];
        const width2 = item[13];
        const height2 = item[14];
        const type2 = item[15];
        oe.doFill(layer2, x2, y2, width2, height2, type2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 左右反転
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 反転する幅
     * @param {number} [height] - 反転する高さ
     */
    flipH(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.flipH(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 上下反転
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 反転する幅
     * @param {number} [height] - 反転する高さ
     */
    flipV(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.flipV(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * レイヤー結合
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 結合する幅
     * @param {number} [height] - 結合する高さ
     */
    merge(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.merge(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形ぼかし
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - ぼかす範囲の幅
     * @param {number} [height] - ぼかす範囲の高さ
     */
    blurRect(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.blurRect(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形消去
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 消去する幅
     * @param {number} [height] - 消去する高さ
     */
    eraseRect2(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        this.getCurrent(item);
        const x2 = item[11];
        const y2 = item[12];
        const width2 = item[13];
        const height2 = item[14];
        oe.eraseRect(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形消去
     * @deprecated 現在はeraseRect2 が使用されているため、この関数は未使用
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 消去する幅
     * @param {number} [height] - 消去する高さ
     */
    eraseRect(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.eraseRect(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形コピー
     * @description 指定された範囲の画像をコピーし、oe.tool にその座標とサイズを記憶する。
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - コピーする幅
     * @param {number} [height] - コピーする高さ
     */
    copy(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.copy(layer2, x2, y2, width2, height2);
      }
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形ペースト
     * @param {number|Array<*>} x - コピー元の開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - コピー元の開始Y座標、またはコールバック関数
     * @param {number} [width] - ペーストする幅
     * @param {number} [height] - ペーストする高さ
     * @param {number} [dx] - 貼り付け先のX座標
     * @param {number} [dy] - 貼り付け先のY座標
     */
    paste(x, y, width, height, dx, dy) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        const dx2 = item[6];
        const dy2 = item[7];
        oe.paste(layer2, x2, y2, width2, height2, dx2, dy2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    /**
     * 矩形傾け
     * @description ツールバーの「傾け」ボタンに対応する、指定範囲を90度回転させる処理。
     * @param {number|Array<*>} x - 開始X座標、またはアクションデータ配列
     * @param {number|function(boolean):void} [y] - 開始Y座標、またはコールバック関数
     * @param {number} [width] - 変形する範囲の幅
     * @param {number} [height] - 変形する範囲の高さ
     */
    turn(x, y, width, height) {
      const oe = Neo.painter;
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
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const width2 = item[4];
        const height2 = item[5];
        oe.turn(layer2, x2, y2, width2, height2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
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
    text(x, y, color, alpha, string, size, family) {
      string = String(string);
      size = String(size);
      family = String(family);
      const oe = Neo.painter;
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
          family
        );
        oe.doText(layer, numX, numY, numColor, numAlpha, string, size, family);
      } else {
        const item = arguments[0];
        const layer2 = item[1];
        const x2 = item[2];
        const y2 = item[3];
        const color2 = item[4];
        const alpha2 = item[5];
        const string2 = item[6];
        const size2 = item[7];
        const family2 = item[8];
        oe.doText(layer2, x2, y2, color2, alpha2, string2, size2, family2);
      }
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight);
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
    restore() {
      const oe = Neo.painter;
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
        img0.onload = function() {
          img1.onload = function() {
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
    }
    dummy() {
      const oe = Neo.painter;
      var callback = arguments[1];
      if (callback && typeof callback == "function") callback(true);
    }
  };
  Neo.createViewer = function(applet) {
    var neo = document.createElement("div");
    neo.className = "NEO";
    neo.id = "NEO";
    var html = '<div id="neo-pageView" style="margin:auto;"><div id="neo-container" style="visibility:visible;" class="o"><div id="neo-painter" style="background-color:white;"><div id="neo-canvas" style="background-color:white;"></div></div><div id="neo-viewerButtonsWrapper" style="display:block;"><div id="neo-viewerButtons" style="display:block;"><div id="neo-viewerPlay"></div><div id="neo-viewerStop"></div><div id="neo-viewerRewind"></div><div id="neo-viewerSpeed" style="padding-left:2px; margin-top: 1px;"></div><div id="neo-viewerPlus"></div><div id="neo-viewerMinus"></div><div id="neo-viewerBar" style="display:inline-block;"></div></div></div></div>';
    neo.innerHTML = html.replace(/\[(.*?)\]/g, function(match, str) {
      return translate(str);
    });
    var parent = applet.parentNode;
    parent == null ? void 0 : parent.appendChild(neo);
    parent == null ? void 0 : parent.insertBefore(neo, applet);
    setTimeout(function() {
      const tmp = document.querySelectorAll(".NEO");
      if (tmp.length > 1) {
        for (var i = 1; i < tmp.length; i++) {
          tmp[i].style.display = "none";
        }
      }
    }, 0);
  };
  Neo.initViewer = function(pch) {
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
    const BAR_HEIGHT = 26;
    const MARGIN = 20;
    const configWidth = Neo.config.width;
    const configHeight = Neo.config.height;
    let displayHeight = configHeight + BAR_HEIGHT;
    if (Neo.config.neo_viewer_max_width_100) {
      const availWidth = Math.min(
        document.documentElement.clientWidth,
        configWidth
      );
      displayHeight = configHeight * (availWidth / configWidth) + BAR_HEIGHT + MARGIN;
    }
    const viewerWrapperOnTop = Neo.config.neo_viewer_buttonswrapper_top && window.innerHeight < displayHeight;
    if (painter) {
      painter.style.marginTop = "0";
      painter.style.position = "absolute";
      painter.style.padding = "0";
      painter.style.left = dx + "px";
    }
    if (Neo.container) {
      Neo.container.style.boxSizing = "border-box";
      Neo.container.style.paddingTop = viewerWrapperOnTop ? "26px" : "";
    }
    var viewerButtonsWrapper = document.getElementById(
      "neo-viewerButtonsWrapper"
    );
    if (viewerButtonsWrapper) {
      viewerButtonsWrapper.style.width = pageWidth - 2 + "px";
      viewerButtonsWrapper.style.position = viewerWrapperOnTop ? "absolute" : "";
      viewerButtonsWrapper.style.top = viewerWrapperOnTop ? "0" : "";
    }
    const viewerBar = document.getElementById("neo-viewerBar");
    if (viewerBar) {
      viewerBar.style.position = "absolute";
      viewerBar.style.right = "2px";
      viewerBar.style.top = "1px";
      if (Neo.config.neo_viewer_max_width_100) {
        viewerBar.style.left = 24 * 6 - 2 + "px";
        viewerBar.style.width = "auto";
      } else {
        viewerBar.style.width = pageWidth - 24 * 6 - 2 + "px";
      }
    }
    Neo.canvas.style.width = Neo.config.width + "px";
    Neo.canvas.style.height = Neo.config.height + "px";
    Neo.painter = new Painter();
    Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);
    Neo.container.oncontextmenu = function() {
      return false;
    };
    Neo.painter._actionMgr.isMouseDown = false;
    painter == null ? void 0 : painter.addEventListener(
      "pointerdown",
      function() {
        Neo.painter._actionMgr.isMouseDown = true;
      },
      false
    );
    painter == null ? void 0 : painter.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
      },
      { passive: false, capture: false }
    );
    document.addEventListener(
      "pointermove",
      function(e) {
        e.preventDefault();
        if (Neo.painter._actionMgr.isMouseDown) {
          var zoom = Neo.painter.zoom;
          var x = Neo.painter.zoomX - e.movementX / zoom;
          var y = Neo.painter.zoomY - e.movementY / zoom;
          Neo.painter.setZoomPosition(x, y);
        }
      },
      { passive: false, capture: false }
    );
    document.addEventListener(
      "pointerup",
      function() {
        Neo.painter._actionMgr.isMouseDown = false;
        if (Neo.viewerBar) {
          Neo.viewerBar.isMouseDown = false;
        }
      },
      false
    );
    if (pch && pch.data && pch.data.length > 0) {
      Neo.painter._actionMgr._items = pch.data;
      Neo.startViewer();
      setTimeout(() => {
        Neo.painter.play();
      }, 50);
    }
  };
  Neo.startViewer = function() {
    if (Neo.applet) {
      var name = Neo.applet.getAttribute("name") || "pch";
      if (!/** @type {any} */
      document[name])
        document[name] = Neo;
      if (Neo.applet.parentNode) {
        Neo.applet.parentNode.removeChild(Neo.applet);
      }
    }
    Neo.styleSheet = getStyleSheet();
    var lightBack = multColor(Neo.config.color_back, 1.3);
    var darkBack = multColor(Neo.config.color_back, 0.7);
    addRule(".NEO #neo-viewerButtons", "color", Neo.config.color_text);
    addRule(".NEO #neo-viewerButtons", "background-color", Neo.config.color_back);
    addRule(
      ".NEO #neo-viewerButtonsWrapper",
      "border",
      "1px solid " + Neo.config.color_frame + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons",
      "border",
      "1px solid " + Neo.config.color_back + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons",
      "border-left",
      "1px solid " + lightBack + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons",
      "border-top",
      "1px solid " + lightBack + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOff",
      "background-color",
      Neo.config.color_icon + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOff:active",
      "background-color",
      darkBack + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOn",
      "background-color",
      darkBack + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div",
      "border",
      "1px solid " + Neo.config.color_frame + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOff:hover",
      "border",
      "1px solid" + Neo.config.color_bar_select + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOff:active",
      "border",
      "1px solid" + Neo.config.color_bar_select + " !important"
    );
    addRule(
      ".NEO #neo-viewerButtons >div.buttonOn",
      "border",
      "1px solid" + Neo.config.color_bar_select + " !important"
    );
    addRule(".NEO #neo-viewerBar >div", "background-color", Neo.config.color_bar);
    addRule(
      ".NEO #neo-viewerBarMark",
      "background-color",
      Neo.config.color_text + " !important"
    );
    if (Neo.config.neo_viewer_max_width_100) {
      addRule(".NEO #neo-pageView", "max-width", "100%");
      addRule(".NEO #neo-painter", "max-width", "100%");
      addRule(".NEO #neo-canvas", "max-width", "100%");
      addRule(".NEO #neo-canvas", "height", "auto");
      addRule(".NEO #neo-canvas canvas", "max-width", "100%");
      addRule(".NEO #neo-canvas canvas", "height", "auto");
      addRule(".NEO #neo-canvas canvas", "display", "block");
      addRule(".NEO #neo-viewerButtonsWrapper", "max-width", "100%");
      addRule(".NEO #neo-viewerButtonsWrapper", "position", "relative");
      addRule(".NEO #neo-viewerButtonsWrapper", "bottom", "auto");
      addRule(".NEO #neo-viewerButtonsWrapper", "left", "auto");
      Neo.painter.clearCanvasHeight();
    }
    setTimeout(function() {
      Neo.viewerPlay = new ViewerButton().init("neo-viewerPlay");
      if (!Neo.viewerPlay) {
        console.error("startViewer: ViewerPlay not found");
        return;
      }
      Neo.viewerPlay.setSelected(true);
      Neo.viewerPlay.onmouseup = function() {
        Neo.painter.onplay();
      };
      Neo.viewerStop = new ViewerButton().init("neo-viewerStop");
      if (!Neo.viewerStop) {
        console.error("startViewer: ViewerStop not found");
        return;
      }
      Neo.viewerStop.onmouseup = function() {
        Neo.painter.onstop();
      };
      Neo.viewerSpeed = new ViewerButton().init("neo-viewerSpeed");
      if (!Neo.viewerSpeed) {
        console.error("startViewer: ViewerSpeed not found");
        return;
      }
      Neo.viewerSpeed.onmouseup = function() {
        Neo.painter.onspeed();
        this.update();
      };
      const neo_viewerRewind = new ViewerButton().init("neo-viewerRewind");
      if (neo_viewerRewind) {
        neo_viewerRewind.onmouseup = function() {
          Neo.painter.onrewind();
        };
      }
      const commands = new Commands();
      const neo_viewerPlus = new ViewerButton().init("neo-viewerPlus");
      if (neo_viewerPlus) {
        neo_viewerPlus.onmouseup = function() {
          new commands.ZoomPlusCommand(Neo.painter).execute();
        };
      }
      const neo_viewerMinus = new ViewerButton().init("neo-viewerMinus");
      if (neo_viewerMinus) {
        neo_viewerMinus.onmouseup = function() {
          new commands.ZoomMinusCommand(Neo.painter).execute();
        };
      }
      const length = Neo.painter._actionMgr._items.length;
      Neo.viewerBar = new ViewerBar().init("neo-viewerBar", {
        length
      });
      if (Neo.config.neo_viewer_max_width_100 && Neo.viewerBar) {
        const viewerBar = document.getElementById("neo-viewerBar");
        if (viewerBar) {
          new ResizeObserver(() => {
            var _a;
            (_a = Neo.viewerBar) == null ? void 0 : _a.update();
          }).observe(viewerBar);
        }
      }
    }, 0);
  };
  var getFilename = function() {
    return Neo.config.pch_file || Neo.config.image_canvas;
  };
  var getPCH = function(filename, callback) {
    if (!filename || filename.slice(-4).toLowerCase() != ".pch") return null;
    fetch(filename).then((response) => response.arrayBuffer()).then((buffer) => {
      const pch = Neo.decodePCH(buffer);
      if (pch) {
        if (callback) callback(pch);
      } else {
        console.log("not a NEO animation");
      }
    }).catch((error) => {
      console.log(error);
    });
  };
  Neo.decodePCH = function(rawdata) {
    const byteArray = new Uint8Array(rawdata);
    const data = import_lz_string.default.decompressFromUint8Array(byteArray.subarray(12));
    const header = byteArray.subarray(0, 12);
    if (!data) {
      throw new Error("Failed to decompress data");
    }
    if (header[0] == "N".charCodeAt(0) && header[1] == "E".charCodeAt(0) && header[2] == "O".charCodeAt(0)) {
      const width = header[4] + header[5] * 256;
      const height = header[6] + header[7] * 256;
      const items = fixPCH(JSON.parse(data));
      return {
        width,
        height,
        data: items
      };
    } else {
      return null;
    }
  };
  var fixPCH = function(items) {
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
  Neo.playPCH = function() {
    Neo.painter.onplay();
  };
  Neo.suspendDraw = function() {
    Neo.painter.onstop();
  };
  Neo.setSpeed = function(value) {
    Neo.speed = value;
  };
  Neo.setVisit = function(layer, value) {
    Neo.painter.visible[layer] = value == 0 ? false : true;
    Neo.painter.updateDestCanvas(
      0,
      0,
      Neo.painter.canvasWidth,
      Neo.painter.canvasHeight
    );
  };
  Neo.setMark = function(value) {
    Neo.painter._actionMgr._mark = value;
    Neo.painter.onmark();
  };
  Neo.getSeek = function() {
    return Neo.painter._actionMgr._head;
  };
  Neo.getLineCount = function() {
    return Neo.painter._actionMgr._items.length;
  };

  // src/tools.js
  var ToolBase = class {
    constructor() {
      this.startX = 0;
      this.startY = 0;
      this.isDrag = false;
      this.isUpMove = false;
      this.ticking = false;
      this.type = 0;
      this.step = 0;
      this.reverse = false;
      this.lineType = Painter.LINETYPE_NONE;
    }
    /** @param {Painter} oe * */
    init(oe) {
    }
    kill() {
    }
    /** @param {Painter} oe * */
    downHandler(oe) {
      this.startX = oe.mouseX;
      this.startY = oe.mouseY;
    }
    /** @param {Painter} oe * */
    upHandler(oe) {
    }
    /** @param {Painter} oe * */
    moveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {KeyboardEvent} e */
    keyDownHandler(e) {
    }
    /** @param {KeyboardEvent} e */
    keyUpHandler(e) {
    }
    cancelBezier() {
    }
    /** @param {Painter} oe * */
    transformForZoom(oe) {
      var ctx = oe.destCanvasCtx;
      ctx.translate(oe.canvasWidth * 0.5, oe.canvasHeight * 0.5);
      ctx.scale(oe.zoom, oe.zoom);
      ctx.translate(-oe.zoomX, -oe.zoomY);
    }
    getType() {
      return this.type;
    }
    /**
     * @returns {ToolTip|FillButton|null}
     */
    getToolButton() {
      switch (this.type) {
        case Painter.TOOLTYPE_PEN:
        case Painter.TOOLTYPE_BRUSH:
        case Painter.TOOLTYPE_TEXT:
          return Neo.penTip;
        case Painter.TOOLTYPE_TONE:
        case Painter.TOOLTYPE_BLUR:
        case Painter.TOOLTYPE_DODGE:
        case Painter.TOOLTYPE_BURN:
          return Neo.pen2Tip;
        case Painter.TOOLTYPE_RECT:
        case Painter.TOOLTYPE_RECTFILL:
        case Painter.TOOLTYPE_ELLIPSE:
        case Painter.TOOLTYPE_ELLIPSEFILL:
          return Neo.effectTip;
        case Painter.TOOLTYPE_COPY:
        case Painter.TOOLTYPE_MERGE:
        case Painter.TOOLTYPE_BLURRECT:
        case Painter.TOOLTYPE_FLIP_H:
        case Painter.TOOLTYPE_FLIP_V:
        case Painter.TOOLTYPE_TURN:
          return Neo.effect2Tip;
        case Painter.TOOLTYPE_ERASER:
        case Painter.TOOLTYPE_ERASEALL:
        case Painter.TOOLTYPE_ERASERECT:
          return Neo.eraserTip;
        case Painter.TOOLTYPE_FILL:
          return Neo.fillButton;
      }
      return null;
    }
    /**
     * Java版PaintBBSの「消しゴムは独立した線の幅を持っています」
     * を再現する。
     *
     * 鉛筆/水彩/トーン/矩形/楕円/コピー/反転など「描画系」に分類される
     * ツールは全て Neo.reservePen を共有し、消しゴムだけは Neo.reserveEraser を
     * 独立して使う。
     *
     * this.type に応じて、上記2つのうちどちらに対応するかを判定し、
     * 共有オブジェクトへの参照そのものを返す(値のコピーではない)。
     * 呼び出し側でプロパティを書き換えると、その変更はグローバルな
     * 保管状態に直接反映される。
     * - loadStates() はこれを「読み取り専用」として使用する
     * - saveStates() はこれに「書き込み」を行うことで、現在の設定を記憶させる
     *
     * @returns {{size:number,color:string,alpha:number,tool:number,drawType:number}|null}
     */
    getReserve() {
      switch (this.type) {
        case Painter.TOOLTYPE_ERASER:
          return Neo.reserveEraser;
        case Painter.TOOLTYPE_PEN:
        case Painter.TOOLTYPE_BRUSH:
        case Painter.TOOLTYPE_TONE:
        case Painter.TOOLTYPE_ERASERECT:
        case Painter.TOOLTYPE_ERASEALL:
        case Painter.TOOLTYPE_COPY:
        case Painter.TOOLTYPE_MERGE:
        case Painter.TOOLTYPE_FLIP_H:
        case Painter.TOOLTYPE_FLIP_V:
        case Painter.TOOLTYPE_DODGE:
        case Painter.TOOLTYPE_BURN:
        case Painter.TOOLTYPE_BLUR:
        case Painter.TOOLTYPE_BLURRECT:
        case Painter.TOOLTYPE_TEXT:
        case Painter.TOOLTYPE_TURN:
        case Painter.TOOLTYPE_RECT:
        case Painter.TOOLTYPE_RECTFILL:
        case Painter.TOOLTYPE_ELLIPSE:
        case Painter.TOOLTYPE_ELLIPSEFILL:
          return Neo.reservePen;
      }
      return null;
    }
    //描画系ブラシまたは消しゴムのブラシサイズを取得し更新する
    loadStates() {
      const reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        updateUI();
      }
    }
    //描画系ブラシまたは消しゴムのブラシサイズを保存し上書きする
    saveStates() {
      const reserve = this.getReserve();
      if (reserve) {
        reserve.size = Neo.painter.lineWidth;
      }
    }
  };
  var DrawToolBase = class extends ToolBase {
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
      this.isUpMove = false;
      this.step = 0;
      this.startX = 0;
      this.startY = 0;
    }
    init() {
      this.step = 0;
      this.isUpMove = true;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      switch (oe.drawType) {
        case Painter.DRAWTYPE_FREEHAND:
          this.freeHandDownHandler(oe);
          break;
        case Painter.DRAWTYPE_LINE:
          this.lineDownHandler(oe);
          break;
        case Painter.DRAWTYPE_BEZIER:
          this.bezierDownHandler(oe);
          break;
      }
    }
    /** @param {Painter} oe */
    upHandler(oe) {
      switch (oe.drawType) {
        case Painter.DRAWTYPE_FREEHAND:
          this.freeHandUpHandler(oe);
          break;
        case Painter.DRAWTYPE_LINE:
          this.lineUpHandler(oe);
          break;
        case Painter.DRAWTYPE_BEZIER:
          this.bezierUpHandler(oe);
          break;
      }
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
      switch (oe.drawType) {
        case Painter.DRAWTYPE_FREEHAND:
          this.freeHandMoveHandler(oe);
          break;
        case Painter.DRAWTYPE_LINE:
          this.lineMoveHandler(oe);
          break;
        case Painter.DRAWTYPE_BEZIER:
          this.bezierMoveHandler(oe);
          break;
      }
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
      switch (oe.drawType) {
        case Painter.DRAWTYPE_FREEHAND:
          this.freeHandUpMoveHandler(oe);
          break;
        case Painter.DRAWTYPE_LINE:
          this.lineUpMoveHandler(oe);
          break;
        case Painter.DRAWTYPE_BEZIER:
          this.bezierUpMoveHandler(oe);
          break;
      }
    }
    /**
     * @param {KeyboardEvent} e
     */
    keyDownHandler(e) {
      switch (Neo.painter.drawType) {
        case Painter.DRAWTYPE_BEZIER:
          this.bezierKeyDownHandler(e);
          break;
      }
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
      if (!oe.isMouseDown && !oe.isMouseDownRight) {
        oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      }
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 1;
        updateUI();
      }
    }
    /**
     * FreeHand (手書き)
     *  @param {Painter} oe
     * */
    freeHandDownHandler(oe) {
      oe._pushUndo();
      oe.prepareDrawing();
      this.isUpMove = false;
      var ctx = oe.canvasCtx[oe.current];
      if (oe.alpha >= 1 || this.lineType != Painter.LINETYPE_BRUSH) {
        var x0 = Math.floor(oe.mouseX);
        var y0 = Math.floor(oe.mouseY);
        oe._actionMgr.freeHand(x0, y0, this.lineType);
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
      if (!isMobile()) {
        this.drawCursor(oe);
      }
    }
    /** @param {Painter} oe */
    freeHandUpHandler(oe) {
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
      if (oe.cursorRect) {
        var rect = oe.cursorRect;
        oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
        oe.cursorRect = null;
      }
      oe.prevLine = null;
    }
    /** @param {Painter} oe */
    freeHandMoveHandler(oe) {
      var ctx = oe.canvasCtx[oe.current];
      var x0 = Math.floor(oe.mouseX);
      var y0 = Math.floor(oe.mouseY);
      var x1 = Math.floor(oe.prevMouseX);
      var y1 = Math.floor(oe.prevMouseY);
      oe._actionMgr.freeHandMove(x0, y0, x1, y1, this.lineType);
      if (oe.cursorRect) {
        const rect2 = oe.cursorRect;
        oe.updateDestCanvas(rect2[0], rect2[1], rect2[2], rect2[3], true);
        oe.cursorRect = null;
      }
      var r = Math.ceil(oe.lineWidth / 2);
      const rect = oe.getBound(
        oe.mouseX,
        oe.mouseY,
        oe.prevMouseX,
        oe.prevMouseY,
        r
      );
      oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
      if (!isMobile()) {
        this.drawCursor(oe);
      }
    }
    /** @param {Painter} oe */
    freeHandUpMoveHandler(oe) {
      this.isUpMove = true;
      if (oe.cursorRect) {
        var rect = oe.cursorRect;
        oe.updateDestCanvas(rect[0], rect[1], rect[2], rect[3], true);
        oe.cursorRect = null;
      }
      if (oe.zoom < 1) {
        return;
      }
      this.drawCursor(oe);
    }
    /** @param {Painter} oe */
    drawCursor(oe) {
      if (oe.zoom < 0.5) {
        return;
      }
      var mx = Math.floor(oe.mouseX);
      var my = Math.floor(oe.mouseY);
      var d = oe.lineWidth;
      d = d == 1 ? 2 : d;
      var x = (mx - oe.zoomX + oe.destCanvas.width * 0.5 / oe.zoom) * oe.zoom;
      var y = (my - oe.zoomY + oe.destCanvas.height * 0.5 / oe.zoom) * oe.zoom;
      var r = d * 0.5 * oe.zoom;
      if (!(x > -r && y > -r && x < oe.destCanvas.width + r && y < oe.destCanvas.height + r))
        return;
      var ctx = oe.destCanvasCtx;
      ctx.save();
      this.transformForZoom(oe);
      var c = this.type == Painter.TOOLTYPE_ERASER ? 255 : 16777087;
      oe.drawXOREllipse(ctx, x - r, y - r, r * 2, r * 2, false, c);
      ctx.restore();
      oe.cursorRect = oe.getBound(mx, my, mx, my, Math.ceil(d / 2));
    }
    /**
     * Line (直線)
     *  @param {Painter} oe
     * */
    lineDownHandler(oe) {
      this.isUpMove = false;
      this.startX = Math.floor(oe.mouseX);
      this.startY = Math.floor(oe.mouseY);
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    }
    /** @param {Painter} oe */
    lineUpHandler(oe) {
      if (this.isUpMove == false) {
        this.isUpMove = true;
        oe._pushUndo();
        oe.prepareDrawing();
        var x0 = Math.floor(oe.mouseX);
        var y0 = Math.floor(oe.mouseY);
        oe._actionMgr.line(x0, y0, this.startX, this.startY, this.lineType);
      }
    }
    /** @param {Painter} oe */
    lineMoveHandler(oe) {
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      this.drawLineCursor(oe);
    }
    /** @param {Painter} oe */
    lineUpMoveHandler(oe) {
    }
    /**
     *  @param {Painter} oe
     *  @param {number} [mx]
     *  @param {number} [my]
     * */
    drawLineCursor(oe, mx = 0, my = 0) {
      if (!mx) mx = Math.floor(oe.mouseX);
      if (!my) my = Math.floor(oe.mouseY);
      var nx = this.startX;
      var ny = this.startY;
      var ctx = oe.destCanvasCtx;
      ctx.save();
      this.transformForZoom(oe);
      var x0 = (mx + 0.499 - oe.zoomX + oe.destCanvas.width * 0.5 / oe.zoom) * oe.zoom;
      var y0 = (my + 0.499 - oe.zoomY + oe.destCanvas.height * 0.5 / oe.zoom) * oe.zoom;
      var x1 = (nx + 0.499 - oe.zoomX + oe.destCanvas.width * 0.5 / oe.zoom) * oe.zoom;
      var y1 = (ny + 0.499 - oe.zoomY + oe.destCanvas.height * 0.5 / oe.zoom) * oe.zoom;
      oe.drawXORLine(ctx, x0, y0, x1, y1);
      ctx.restore();
    }
    /**
     *  Bezier (BZ曲線)
     *  @param {Painter} oe
     * */
    bezierDownHandler(oe) {
      oe.isBezierActive = true;
      this.isUpMove = false;
      if (this.step == 0) {
        this.startX = this.x0 = Math.floor(oe.mouseX);
        this.startY = this.y0 = Math.floor(oe.mouseY);
      }
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    }
    cancelBezier() {
      var oe = Neo.painter;
      this.step = 0;
      oe.isBezierActive = false;
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
      oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    }
    /** @param {Painter} oe */
    bezierUpHandler(oe) {
      if (this.isUpMove == false) {
        this.isUpMove = true;
      } else return;
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
          this.step = 0;
          oe.isBezierActive = false;
          break;
        default:
          this.step = 0;
          oe.isBezierActive = false;
          break;
      }
    }
    /** @param {Painter} oe */
    bezierMoveHandler(oe) {
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
    }
    /** @param {Painter} oe */
    bezierUpMoveHandler(oe) {
      if (this.step === 3) {
        this.bezierMoveHandler(oe);
        return;
      }
      if (this.ticking) return;
      this.ticking = true;
      setTimeout(() => {
        this.bezierMoveHandler(oe);
        this.ticking = false;
      }, 10);
    }
    /**
     * Bz曲線をエスケープキーでキャンセル
     * @param {KeyboardEvent} e
     */
    bezierKeyDownHandler(e) {
      if (e.key == "Escape") {
        this.cancelBezier();
      }
    }
    /** @param {Painter} oe */
    drawBezierCursor1(oe) {
      var ctx = oe.destCanvasCtx;
      var x = oe.mouseX;
      var y = oe.mouseY;
      var p = oe.getDestCanvasPosition(x, y, false, true);
      var p0 = oe.getDestCanvasPosition(this.x0, this.y0, false, true);
      var p3 = oe.getDestCanvasPosition(this.x3, this.y3, false, true);
      oe.drawXORLine(ctx, p0.x, p0.y, p.x, p.y);
      oe.drawXOREllipse(ctx, p.x - 4, p.y - 4, 8, 8);
      oe.drawXOREllipse(ctx, p0.x - 4, p0.y - 4, 8, 8);
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
        Painter.LINETYPE_PEN,
        //this.lineType,
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
    }
    /** @param {Painter} oe */
    drawBezierCursor2(oe) {
      var ctx = oe.destCanvasCtx;
      var x = oe.mouseX;
      var y = oe.mouseY;
      var p = oe.getDestCanvasPosition(oe.mouseX, oe.mouseY, false, true);
      var p0 = oe.getDestCanvasPosition(this.x0, this.y0, false, true);
      var p1 = oe.getDestCanvasPosition(this.x1, this.y1, false, true);
      var p3 = oe.getDestCanvasPosition(this.x3, this.y3, false, true);
      oe.drawXORLine(ctx, p3.x, p3.y, p.x, p.y);
      oe.drawXOREllipse(ctx, p.x - 4, p.y - 4, 8, 8);
      oe.drawXORLine(ctx, p0.x, p0.y, p1.x, p1.y);
      oe.drawXOREllipse(ctx, p1.x - 4, p1.y - 4, 8, 8);
      oe.drawXOREllipse(ctx, p0.x - 4, p0.y - 4, 8, 8);
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
        Painter.LINETYPE_PEN,
        //this.lineType,
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
    }
  };
  var PenTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_PEN;
      this.lineType = Painter.LINETYPE_PEN;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 1;
        updateUI();
      }
    }
  };
  var BrushTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_BRUSH;
      this.lineType = Painter.LINETYPE_BRUSH;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = this.getAlpha();
        updateUI();
      }
    }
    getAlpha() {
      var alpha = 241 - Math.floor(Neo.painter.lineWidth / 2) * 6;
      return alpha / 255;
    }
  };
  var ToneTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_TONE;
      this.lineType = Painter.LINETYPE_TONE;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 23 / 255;
        updateUI();
      }
    }
  };
  var EraserTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_ERASER;
      this.lineType = Painter.LINETYPE_ERASER;
    }
  };
  var BlurTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_BLUR;
      this.lineType = Painter.LINETYPE_BLUR;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 128 / 255;
        updateUI();
      }
    }
  };
  var DodgeTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_DODGE;
      this.lineType = Painter.LINETYPE_DODGE;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 128 / 255;
        updateUI();
      }
    }
  };
  var BurnTool = class extends DrawToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_BURN;
      this.lineType = Painter.LINETYPE_BURN;
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 128 / 255;
        updateUI();
      }
    }
  };
  var HandTool = class extends ToolBase {
    constructor() {
      super();
      this.latestX = 0;
      this.latestY = 0;
      this.startX = 0;
      this.startY = 0;
      this.type = Painter.TOOLTYPE_HAND;
      this.isUpMove = false;
      this.reverse = false;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
      this.isDrag = true;
      this.ticking = false;
      this.startX = oe.rawMouseX;
      this.startY = oe.rawMouseY;
    }
    /** @param {Painter} oe */
    upHandler(oe) {
      this.isDrag = false;
      oe.popTool();
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
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
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
  };
  var SliderTool = class extends ToolBase {
    constructor() {
      super();
      this.target = null;
      this.type = Painter.TOOLTYPE_SLIDER;
      this.isUpMove = false;
      this.isAlt = false;
    }
    /** @returns {number} */
    getSliderType() {
      var _a, _b;
      return this.isAlt ? Neo.SLIDERTYPE_SIZE : (_b = (_a = this.target) == null ? void 0 : _a["data-slider"]) != null ? _b : Neo.SLIDERTYPE_SIZE;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      if (!oe.isShiftDown) this.isDrag = true;
      if (!oe.isCopyActive) {
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      }
      if (!this.target) {
        console.error("SliderTool: Target element not found");
        return;
      }
      const rect = this.target.getBoundingClientRect();
      const sliderType = this.getSliderType();
      Neo.sliders[sliderType].downHandler(
        oe.rawMouseX - rect.left,
        oe.rawMouseY - rect.top
      );
    }
    /** @param {Painter} oe */
    upHandler(oe) {
      this.isDrag = false;
      oe.popTool();
      if (!this.target) {
        console.error("SliderTool: Target element not found");
        return;
      }
      const rect = this.target.getBoundingClientRect();
      const sliderType = this.getSliderType();
      Neo.sliders[sliderType].upHandler(
        oe.rawMouseX - rect.left,
        oe.rawMouseY - rect.top
      );
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
      if (this.isDrag) {
        if (!this.target) {
          console.error("SliderTool: Target element not found");
          return;
        }
        const rect = this.target.getBoundingClientRect();
        const sliderType = this.getSliderType();
        Neo.sliders[sliderType].moveHandler(
          oe.rawMouseX - rect.left,
          oe.rawMouseY - rect.top
        );
      }
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
  };
  var FillTool = class extends ToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_FILL;
      this.isUpMove = false;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      var x = Math.floor(oe.mouseX);
      var y = Math.floor(oe.mouseY);
      var layer = oe.current;
      var color = oe.getColor();
      oe._pushUndo();
      oe._actionMgr.floodFill(layer, x, y, color);
    }
    /** @param {Painter} oe */
    upHandler(oe) {
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
  };
  var EraseAllTool = class extends ToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_ERASEALL;
      this.isUpMove = false;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      oe._pushUndo();
      oe._actionMgr.eraseAll();
    }
    /** @param {Painter} oe */
    upHandler(oe) {
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
  };
  var EffectToolBase = class extends ToolBase {
    constructor() {
      super();
      this.startX = 0;
      this.startY = 0;
      this.latestX = 0;
      this.latestY = 0;
      this.isUpMove = false;
      this.isEllipse = false;
      this.isFill = false;
      this.endX = 0;
      this.endY = 0;
      this.ticking = false;
      this.defaultAlpha = 0;
    }
    /**
     * @param {Painter} oe
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    doEffect(oe, x, y, width, height) {
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      this.isUpMove = false;
      this.ticking = false;
      this.startX = this.endX = oe.clipMouseX;
      this.startY = this.endY = oe.clipMouseY;
    }
    /** @param {Painter} oe */
    upHandler(oe) {
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
      if (Neo.CurrentToolType != Painter.TOOLTYPE_PASTE) {
        setTimeout(() => {
          oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
        }, 10);
      }
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
      this.latestX = oe.clipMouseX;
      this.latestY = oe.clipMouseY;
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.endX = this.latestX;
        this.endY = this.latestY;
        if (oe.tool.type != Painter.TOOLTYPE_PASTE) {
          oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
          this.drawCursor(oe);
        }
        this.ticking = false;
      });
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    drawCursor(oe) {
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
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = this.defaultAlpha || 1;
        updateUI();
      }
    }
  };
  var EraseRectTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_ERASERECT;
    }
    /**
     * 矩形消去ツールの実行
     * @description
     * @param {Painter} oe - PaintBBS NEOのメインインスタンス (Neo.painter)
     * @param {number} x - 開始X座標
     * @param {number} y - 開始Y座標
     * @param {number} width - 消去する幅
     * @param {number} height - 消去する高さ
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.eraseRect2(x, y, width, height);
    }
  };
  var FlipHTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_FLIP_H;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.flipH(x, y, width, height);
    }
  };
  var FlipVTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_FLIP_V;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.flipV(x, y, width, height);
    }
  };
  var BlurRectTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_BLURRECT;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.blurRect(x, y, width, height);
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 0.5;
        updateUI();
      }
    }
  };
  var TurnTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_TURN;
    }
    /** @param {Painter} oe */
    doEffect(oe) {
      this.isUpMove = true;
      this.startX = Math.floor(this.startX);
      this.startY = Math.floor(this.startY);
      this.endX = Math.floor(this.endX);
      this.endY = Math.floor(this.endY);
      if (this.startX >= oe.canvasWidth) this.startX = oe.canvasWidth - 1;
      if (this.endX >= oe.canvasWidth) this.endX = oe.canvasWidth - 1;
      if (this.startY >= oe.canvasHeight) this.startY = oe.canvasHeight - 1;
      if (this.endY >= oe.canvasHeight) this.endY = oe.canvasHeight - 1;
      var x = this.startX < this.endX ? this.startX : this.endX;
      var y = this.startY < this.endY ? this.startY : this.endY;
      var width = Math.abs(this.startX - this.endX) + 1;
      var height = Math.abs(this.startY - this.endY) + 1;
      if (width > 0 && height > 0) {
        oe._pushUndo();
        oe._actionMgr.turn(x, y, width, height);
      }
      setTimeout(() => {
        oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
      }, 10);
    }
  };
  var MergeTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_MERGE;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.merge(x, y, width, height);
    }
  };
  var CopyTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_COPY;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe.isCopyActive = true;
      oe._actionMgr.copy(x, y, width, height);
      oe.setToolByType(Painter.TOOLTYPE_PASTE);
      if (oe.pasteTool) {
        oe.pasteTool.x = x;
        oe.pasteTool.y = y;
        oe.pasteTool.width = width;
        oe.pasteTool.height = height;
      }
    }
  };
  var PasteTool = class extends ToolBase {
    constructor() {
      super();
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.startX = 0;
      this.startY = 0;
      this.latestDX = 0;
      this.latestDY = 0;
      this.type = Painter.TOOLTYPE_PASTE;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      this.ticking = false;
      oe.isCopyActive = false;
      this.startX = oe.mouseX;
      this.startY = oe.mouseY;
      this.drawCursor(oe);
    }
    /** @param {Painter} oe */
    upHandler(oe) {
      oe._pushUndo();
      var dx = oe.tempX;
      var dy = oe.tempY;
      oe._actionMgr.paste(this.x, this.y, this.width, this.height, dx, dy);
      oe.setToolByType(Painter.TOOLTYPE_COPY);
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
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
        this.ticking = false;
      });
    }
    /**
     * コピーアンドペーストをエスケープキーでキャンセル
     * @param {KeyboardEvent} e
     */
    keyDownHandler(e) {
      var oe = Neo.painter;
      if (e.key == "Escape") {
        oe.cancelCopy();
      }
    }
    kill() {
      var oe = Neo.painter;
      oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    }
    /** @param {Painter} oe */
    drawCursor(oe) {
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
    }
  };
  var RectTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_RECT;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {void}
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.fill(x, y, width, height, this.type);
    }
  };
  var RectFillTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_RECTFILL;
      this.isFill = true;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.fill(x, y, width, height, this.type);
    }
  };
  var EllipseTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_ELLIPSE;
      this.isEllipse = true;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.fill(x, y, width, height, this.type);
    }
  };
  var EllipseFillTool = class extends EffectToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_ELLIPSEFILL;
      this.isEllipse = true;
      this.isFill = true;
    }
    /**
     * @param {Painter} oe
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     *
     */
    doEffect(oe, x, y, width, height) {
      oe._actionMgr.fill(x, y, width, height, this.type);
    }
  };
  var TextTool = class extends ToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_TEXT;
      this.isUpMove = false;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
      var _a;
      this.startX = oe.mouseX;
      this.startY = oe.mouseY;
      if (Neo.painter.inputText) {
        Neo.painter.updateInputText();
        var rect = (_a = oe.container) == null ? void 0 : _a.getBoundingClientRect();
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
    }
    /** @param {Painter} oe */
    upHandler(oe) {
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
    /**
     * テキスト入力の確定処理
     * @description
     * ユーザーがテキスト入力中にEnterキーを押した際、
     * 入力された内容をキャンバスに描画し、入力UIを終了する。
     * @param {KeyboardEvent} e - キーボードイベント
     */
    keyDownHandler(e) {
      if (e.key == "Enter") {
        e.preventDefault();
        const oe = Neo.painter;
        const text = oe.inputText;
        if (text) {
          oe._pushUndo();
          const string = text.textContent || text.innerText;
          const size = text.style.fontSize;
          const family = text.style.fontFamily || "Arial";
          const color = oe.getColor();
          const alpha = oe.alpha;
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
    }
    kill() {
      Neo.painter.hideInputText();
    }
    loadStates() {
      var reserve = this.getReserve();
      if (reserve) {
        Neo.painter.lineWidth = reserve.size;
        Neo.painter.alpha = 1;
        updateUI();
      }
    }
  };
  var DummyTool = class extends ToolBase {
    constructor() {
      super();
      this.type = Painter.TOOLTYPE_NONE;
      this.isUpMove = false;
    }
    /** @param {Painter} oe */
    downHandler(oe) {
    }
    /** @param {Painter} oe */
    upHandler(oe) {
      oe.popTool();
    }
    /** @param {Painter} oe */
    moveHandler(oe) {
    }
    /** @param {Painter} oe */
    upMoveHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOverHandler(oe) {
    }
    /** @param {Painter} oe */
    rollOutHandler(oe) {
    }
  };

  // src/painter.js
  var import_lz_string2 = __toESM(require_lz_string());
  Neo.CurrentToolType = 1;
  var _Painter = class _Painter {
    constructor() {
      this._undoMgr = new UndoManager(50);
      this._actionMgr = new ActionManager();
      this.clipMouseX = 0;
      this.clipMouseY = 0;
      this.scrollBarX = 0;
      this.scrollBarY = 0;
      this.scrollWidth = 0;
      this.scrollHeight = 0;
      this.lineWidth = 1;
      this.alpha = 1;
      this.zoom = 1;
      this.zoomX = 0;
      this.zoomY = 0;
      this.isMouseDown = false;
      this.isMouseDownRight = false;
      this.isSpaceDown = false;
      this.isBezierActive = false;
      this.isCopyActive = false;
      this.tempX = 0;
      this.tempY = 0;
      this.prevLine = null;
      this.container = null;
      this.tool = /** @type {ToolBase} */
      {};
      this.inputText = null;
      this.cursorRect = null;
      this.canvas = [];
      this.canvasCtx = [];
      this.visible = [];
      this.current = 0;
      this.tempCanvas;
      this.tempCanvasCtx;
      this.temp = null;
      this.destCanvas;
      this.destCanvasCtx;
      this.backgroundColor = "#ffffff";
      this.foregroundColor = "#000000";
      this.prevMouseX = 0;
      this.prevMouseY = 0;
      this.mouseX = 0;
      this.mouseY = 0;
      this.rawMouseX = 0;
      this.rawMouseY = 0;
      this.stabilizedX = null;
      this.stabilizedY = null;
      this.securityTimer = 0;
      this.securityCount = 0;
      this.destWidth = 0;
      this.destHeight = 0;
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this._currentWidth = 0;
      this._currentMaskType = 0;
      this.isShiftDown = false;
      this.isCtrlDown = false;
      this.isAltDown = false;
      this.virtualRight = false;
      this.virtualShift = false;
      this._roundData = [];
      this._toneData = [];
      this.toolStack = [];
      this.maskType = 0;
      this.drawType = 0;
      this.maskColor = "#000000";
      this._currentColor = [];
      this._currentMask = [];
      this.aerr = 0;
      this.dirty = false;
      this.busy = false;
      this.busySkipped = false;
      this.touchlength = 0;
      this.penTool;
      this.eraserTool;
      this.handTool;
      this.fillTool;
      this.eraseAllTool;
      this.eraseRectTool;
      this.copyTool;
      this.pasteTool;
      this.mergeTool;
      this.flipHTool;
      this.flipVTool;
      this.brushTool;
      this.textTool;
      this.toneTool;
      this.blurTool;
      this.dodgeTool;
      this.burnTool;
      this.sliderTool;
      this.dummyTool;
      this.rectTool;
      this.rectFillTool;
      this.ellipseTool;
      this.ellipseFillTool;
      this.blurRectTool;
      this.turnTool;
    }
    /**
     * ペインターの描画コンポーネントを初期化して、描画可能な状態にする。
     * @description
     * 描画エリア（Canvas）の生成、ツールセットの展開、描画データの初期化を順次行い、
     * 指定されたHTML要素内に PaintBBS NEO を構築する。
     * @param {HTMLElement} div - PaintBBSを描画する親コンテナ要素
     * @param {number|string} width - キャンバスの横幅（ピクセル）
     * @param {number|string} height - キャンバスの高さ（ピクセル）
     */
    build(div, width, height) {
      this.container = div;
      this._initCanvas(div, width, height);
      this._initRoundData();
      this._initToneData();
      this._initInputText();
      this._initTools();
      this.setTool(this.penTool);
    }
    /**
     * 現在のツールを切り替え、古いツールの終了と新しいツールの初期化を行う。
     * @description
     * 1. 現在のツールがあれば状態を保存する。
     * 2. 特定のツール（テキストやペースト）の終了処理を実行する。
     * 3. ツールを入れ替え、新しいツールの初期化を行う。
     * 4. 新しいツールの状態を読み込む。
     * @param {any} tool - Neo.ToolBase 新しく設定するツールインスタンス
     */
    setTool(tool) {
      var _a, _b;
      if (this.tool && this.tool.saveStates) this.tool.saveStates();
      if (tool !== this.textTool) {
        (_a = this.textTool) == null ? void 0 : _a.kill();
      }
      if (this.tool && this.tool.cancelBezier) {
        this.tool.cancelBezier();
      }
      if (tool !== this.pasteTool) {
        (_b = this.pasteTool) == null ? void 0 : _b.kill();
      }
      if (this.tool && this.tool.kill) {
        this.tool.kill();
      }
      this.tool = /**@type {ToolBase} */
      tool;
      tool.init(this);
      if (this.tool && this.tool.loadStates) this.tool.loadStates();
    }
    /**
     * 現在のツールをスタックに退避し、新しいツールをアクティブにする。
     * @description
     * ツールの一時的な切り替えを行う。現在使用中のツールを toolStack に保存し、
     * 指定されたツールを新しいアクティブツールとして初期化する。
     * 元のツールに戻る際は popTool を使用することを想定している。
     * @param {any} tool - スタックに積んだ後にアクティブにするツールインスタンス
     */
    pushTool(tool) {
      this.toolStack.push(this.tool);
      this.tool = /**@type {ToolBase} */
      tool;
      tool.init(this);
    }
    /**
     * 現在のツールを終了し、スタックから以前のツールを復元する。
     * @description
     * スタックに退避されていた以前のツールを現在のアクティブツールとして復元する。
     * 現在のツールに対しては終了処理（kill）を行い、安全に切り替える。
     */
    popTool() {
      var tool = this.tool;
      if (tool && tool.kill) {
        tool.kill();
      }
      this.tool = this.toolStack.pop();
    }
    /**
     * 現在アクティブなツールを取得する。
     * @description
     * ツールがスライダー等の設定変更中である場合、スタックの最上位にある
     * 以前のツール（ペイントツール等）を優先的に返すことで、
     * 現在の操作文脈を正しく取得する。
     * @returns {ToolBase|null} 現在のツールインスタンス、またはnull
     */
    getCurrentTool() {
      if (this.tool) {
        var tool = this.tool;
        if (tool && tool.type == _Painter.TOOLTYPE_SLIDER) {
          var stack = this.toolStack;
          if (stack.length > 0) {
            tool = stack[stack.length - 1];
          }
        }
        return tool;
      }
      return null;
    }
    /**
     * ツールタイプに基づいてアクティブなツールを切り替える。
     * @description
     * ツールタイプ（ID）から対応するインスタンスを特定し、セットする。
     * @param {number|string} toolType - Painter.TOOLTYPE_xxx で定義されたツールID
     */
    setToolByType(toolType) {
      switch (parseInt(String(toolType))) {
        case _Painter.TOOLTYPE_PEN:
          this.setTool(this.penTool);
          break;
        case _Painter.TOOLTYPE_ERASER:
          this.setTool(this.eraserTool);
          break;
        case _Painter.TOOLTYPE_HAND:
          this.setTool(this.handTool);
          break;
        case _Painter.TOOLTYPE_FILL:
          this.setTool(this.fillTool);
          break;
        case _Painter.TOOLTYPE_ERASEALL:
          this.setTool(this.eraseAllTool);
          break;
        case _Painter.TOOLTYPE_ERASERECT:
          this.setTool(this.eraseRectTool);
          break;
        case _Painter.TOOLTYPE_COPY:
          this.setTool(this.copyTool);
          break;
        case _Painter.TOOLTYPE_PASTE:
          this.setTool(this.pasteTool);
          break;
        case _Painter.TOOLTYPE_MERGE:
          this.setTool(this.mergeTool);
          break;
        case _Painter.TOOLTYPE_FLIP_H:
          this.setTool(this.flipHTool);
          break;
        case _Painter.TOOLTYPE_FLIP_V:
          this.setTool(this.flipVTool);
          break;
        case _Painter.TOOLTYPE_BRUSH:
          this.setTool(this.brushTool);
          break;
        case _Painter.TOOLTYPE_TEXT:
          this.setTool(this.textTool);
          break;
        case _Painter.TOOLTYPE_TONE:
          this.setTool(this.toneTool);
          break;
        case _Painter.TOOLTYPE_BLUR:
          this.setTool(this.blurTool);
          break;
        case _Painter.TOOLTYPE_DODGE:
          this.setTool(this.dodgeTool);
          break;
        case _Painter.TOOLTYPE_BURN:
          this.setTool(this.burnTool);
          break;
        case _Painter.TOOLTYPE_RECT:
          this.setTool(this.rectTool);
          break;
        case _Painter.TOOLTYPE_RECTFILL:
          this.setTool(this.rectFillTool);
          break;
        case _Painter.TOOLTYPE_ELLIPSE:
          this.setTool(this.ellipseTool);
          break;
        case _Painter.TOOLTYPE_ELLIPSEFILL:
          this.setTool(this.ellipseFillTool);
          break;
        case _Painter.TOOLTYPE_BLURRECT:
          this.setTool(this.blurRectTool);
          break;
        case _Painter.TOOLTYPE_TURN:
          this.setTool(this.turnTool);
          break;
        default:
          console.log("unknown toolType " + toolType);
          break;
      }
      Neo.CurrentToolType = Number(toolType);
    }
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
    _initCanvas(div, width, height) {
      var _a, _b;
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
          willReadFrequently: true
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
        willReadFrequently: true
      });
      if (!tempCanvasCtx) {
        console.error("_initCanvas: Failed to get 2d context");
        return;
      }
      this.tempCanvasCtx = tempCanvasCtx;
      this.tempCanvas.style.position = "absolute";
      var array = (_a = this.container) == null ? void 0 : _a.querySelectorAll("canvas");
      if (array && array.length > 0) {
        this.destCanvas = array[0];
      } else {
        this.destCanvas = document.createElement("canvas");
        (_b = this.container) == null ? void 0 : _b.appendChild(this.destCanvas);
      }
      const destCanvasCtx = this.destCanvas.getContext("2d", {
        willReadFrequently: true
      });
      if (!destCanvasCtx) {
        console.error("_initCanvas: Failed to get 2d context");
        return;
      }
      this.destCanvasCtx = destCanvasCtx;
      this.destCanvas.width = destWidth;
      this.destCanvas.height = destHeight;
      this.destCanvas.style.imageRendering = Neo.viewer ? "auto" : "pixelated";
      this.destCanvasCtx.imageSmoothingEnabled = false;
      const ref = this;
      if (!Neo.viewer) {
        const container = document.getElementById("neo-container");
        if (!container) return;
        container.addEventListener("mouseover", function(e) {
          ref._rollOverHandler(e);
        });
        container.addEventListener("mouseout", function(e) {
          ref._rollOutHandler(e);
        });
        container.addEventListener(
          "mousedown",
          //pointerdownに変更するとここが先にトリガーされ、線幅を保存できなくなる
          function(e) {
            ref._mouseDownHandler(e);
          },
          { passive: false, capture: false }
        );
        container.addEventListener(
          "mouseup",
          function(e) {
            ref.touchlength = 0;
            ref._mouseUpHandler(e);
          },
          { passive: false, capture: false }
        );
        container.addEventListener(
          "touchstart",
          function(e) {
            var _a2;
            ref.touchlength = (_a2 = e.touches) == null ? void 0 : _a2.length;
            ref._mouseDownHandler(e);
          },
          { passive: false, capture: false }
        );
        container.addEventListener(
          "touchend",
          function(e) {
            ref.touchlength = 0;
            ref._mouseUpHandler(e);
          },
          { passive: false, capture: false }
        );
        container.addEventListener(
          "pointermove",
          function(e) {
            var _a2, _b2;
            const freeHandMode = ref.drawType === 0;
            const usesHighPrecisionTool = [1, 2, 14].includes(
              Neo.CurrentToolType
            );
            const smallbrush = ref.lineWidth <= 16;
            if (ref.isMouseDown && freeHandMode && usesHighPrecisionTool && smallbrush) {
              const events = (_b2 = (_a2 = e.getCoalescedEvents) == null ? void 0 : _a2.call(e)) != null ? _b2 : [e];
              for (const ev of events) {
                ref._mouseMoveHandler(ev);
              }
            } else {
              ref._mouseMoveHandler(e);
            }
          },
          { passive: false, capture: false }
        );
        container.addEventListener(
          "pointercancel",
          function(e) {
            ref.touchlength = 0;
            ref.isMouseDown = false;
            ref._mouseUpHandler(e);
          },
          { capture: false }
        );
        document.addEventListener("keydown", function(e) {
          ref._keyDownHandler(e);
        });
        document.addEventListener("keyup", function(e) {
          ref._keyUpHandler(e);
        });
        window.addEventListener("blur", () => {
          ref.isSpaceDown = false;
          ref.isShiftDown = false;
          ref.isCtrlDown = false;
          ref.isAltDown = false;
        });
      }
      if (Neo.config.neo_confirm_unload == "true") {
        window.addEventListener("beforeunload", function(e) {
          if (!Neo.uploaded && ref.isDirty()) {
            e.preventDefault();
            return false;
          }
        });
      }
      this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight);
    }
    _initRoundData() {
      for (var r = 1; r <= 30; r++) {
        this._roundData[r] = new Uint8Array(r * r);
        var mask = this._roundData[r];
        var d = Math.floor(r / 2);
        var index = 0;
        for (var x = 0; x < r; x++) {
          for (var y = 0; y < r; y++) {
            var xx = x + 0.5 - r / 2;
            var yy = y + 0.5 - r / 2;
            mask[index++] = xx * xx + yy * yy <= r * r / 4 ? 1 : 0;
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
    }
    _initToneData() {
      var pattern = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      for (var i = 0; i < 16; i++) {
        this._toneData[i] = new Array(16);
        for (var j = 0; j < 16; j++) {
          this._toneData[i][j] = i >= pattern[j] ? 1 : 0;
        }
      }
    }
    /**
     * アルファ値に対応するトーンパターンデータを取得する。
     * @description
     * 定義済みの閾値テーブル(alphaTable)に基づき、指定されたアルファ値に最も近い
     * ハーフトーンのパターンを選択して返す。
     * @param {number} alpha - 0〜255の範囲のアルファ値（透明度）
     * @returns {Array<number>} 対応するハーフトーンパターン
     */
    getToneData(alpha) {
      var alphaTable = [
        23,
        47,
        69,
        92,
        114,
        114,
        114,
        138,
        161,
        184,
        184,
        207,
        230,
        230,
        253
      ];
      for (var i = 0; i < alphaTable.length; i++) {
        if (alpha < alphaTable[i]) {
          return this._toneData[i];
        }
      }
      return this._toneData[i];
    }
    /**
     * テキスト入力
     */
    _initInputText() {
      var _a;
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
      (_a = this.container) == null ? void 0 : _a.appendChild(text);
      this.inputText = text;
      this.updateInputText();
    }
    _initTools() {
      this.penTool = new PenTool();
      this.eraserTool = new EraserTool();
      this.handTool = new HandTool();
      this.fillTool = new FillTool();
      this.eraseAllTool = new EraseAllTool();
      this.eraseRectTool = new EraseRectTool();
      this.copyTool = new CopyTool();
      this.pasteTool = new PasteTool();
      this.mergeTool = new MergeTool();
      this.flipHTool = new FlipHTool();
      this.flipVTool = new FlipVTool();
      this.brushTool = new BrushTool();
      this.textTool = new TextTool();
      this.toneTool = new ToneTool();
      this.blurTool = new BlurTool();
      this.dodgeTool = new DodgeTool();
      this.burnTool = new BurnTool();
      this.rectTool = new RectTool();
      this.rectFillTool = new RectFillTool();
      this.ellipseTool = new EllipseTool();
      this.ellipseFillTool = new EllipseFillTool();
      this.blurRectTool = new BlurRectTool();
      this.turnTool = new TurnTool();
      this.sliderTool = new SliderTool();
      this.dummyTool = new DummyTool();
    }
    hideInputText() {
      const text = this.inputText;
      if (!text) {
        console.error("inputText not found for hideInputText");
        return;
      }
      text.blur();
      text.style.display = "none";
    }
    updateInputText() {
      const text = this.inputText;
      if (!text) {
        console.error("inputText not found for updateInputText");
        return;
      }
      const d = this.lineWidth;
      const fontSize = Math.round(d * 55 / 28 + 7);
      text.style.fontSize = fontSize + "px";
      text.style.lineHeight = fontSize + "px";
      text.style.height = fontSize + "px";
      text.style.marginTop = -fontSize + "px";
    }
    cancelCopy() {
      if (!this.isCopyActive) return;
      if (Neo.CurrentToolType !== _Painter.TOOLTYPE_PASTE) return;
      this.popTool();
      this.setToolByType(_Painter.TOOLTYPE_COPY);
      this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, true);
    }
    /*
      -----------------------------------------------------------------------
      Mouse Event Handling
      -----------------------------------------------------------------------
    */
    /**
     * @param {KeyboardEvent} e
     */
    _keyDownHandler(e) {
      const preventCtrlKeyDefaults = (e2) => {
        const keys = ["+", ";", "=", "-", "s", "h", "r", "u", "o"];
        if ((e2.ctrlKey || e2.metaKey) && e2.key && keys.includes(e2.key.toLowerCase())) {
          e2.preventDefault();
        }
      };
      const target = e.target;
      const NON_TEXT_INPUT_TYPES = [
        "radio",
        "checkbox",
        "range",
        "button",
        "submit",
        "reset"
      ];
      if (e.key !== "Tab" && (target instanceof HTMLButtonElement || target instanceof HTMLSelectElement || target instanceof HTMLInputElement && NON_TEXT_INPUT_TYPES.includes(target.type))) {
        target.blur();
      }
      if (target instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.includes(target.type) || target instanceof HTMLTextAreaElement) {
        this.isShiftDown = false;
        this.isCtrlDown = false;
        this.isAltDown = false;
        this.isSpaceDown = false;
        preventCtrlKeyDefaults(e);
        return;
      }
      this.isShiftDown = e.shiftKey;
      this.isCtrlDown = e.ctrlKey;
      this.isAltDown = e.altKey;
      var key = e.key ? e.key.toLowerCase() : null;
      if (key === " ") this.isSpaceDown = true;
      if (this.tool.keyDownHandler) {
        this.tool.keyDownHandler(e);
      }
      if (target === this.inputText) {
        preventCtrlKeyDefaults(e);
        return;
      }
      e.preventDefault();
      if (!this.isShiftDown && this.isCtrlDown) {
        if (!this.isAltDown) {
          if (key === "z" || key === "u") {
            this.cancelCopy();
            this.undo();
          }
          if (key === "y") this.redo();
        } else {
          if (key === "z") this.redo();
        }
      }
      if (!this.isShiftDown && !this.isCtrlDown && !this.isAltDown) {
        const commands = new Commands();
        if (key == "+") new commands.ZoomPlusCommand(this).execute();
        if (key == "-") new commands.ZoomMinusCommand(this).execute();
        if (key == "b") this.setToolByType(_Painter.TOOLTYPE_PEN);
        if (key == "w") this.setToolByType(_Painter.TOOLTYPE_BRUSH);
        if (key == "e") this.setToolByType(_Painter.TOOLTYPE_ERASER);
        if (document.activeElement != this.inputText && key && ["delete", "backspace"].includes(key)) {
          this._pushUndo();
          this._actionMgr.eraseAll();
        }
        if (Neo.sizeslider) {
          if (e.key === "]") {
            Neo.sizeslider.value++;
            Neo.sizeslider.setSize(Neo.sizeslider.value);
          }
          if (e.key === "[") {
            Neo.sizeslider.value = Math.max(Neo.sizeslider.value - 1, 1);
            Neo.sizeslider.setSize(Neo.sizeslider.value);
          }
        }
      }
    }
    /**
     * @param {KeyboardEvent} e
     */
    _keyUpHandler(e) {
      this.isShiftDown = e.shiftKey;
      this.isCtrlDown = e.ctrlKey;
      this.isAltDown = e.altKey;
      if (e.key == " ") this.isSpaceDown = false;
      if (e.key && e.key.toLowerCase() === "alt") {
        e.preventDefault();
      }
      if (this.tool.keyUpHandler) {
        this.tool.keyUpHandler(e);
      }
    }
    /**
     * @param {MouseEvent} e
     */
    _rollOverHandler(e) {
      if (this.tool.rollOverHandler) {
        this.tool.rollOverHandler(this);
      }
    }
    /**
     * @param {MouseEvent} e
     */
    _rollOutHandler(e) {
      if (this.tool.rollOutHandler) {
        this.tool.rollOutHandler(this);
      }
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     * @returns {void}
     */
    _mouseDownHandler(e) {
      if (this.busy) {
        if (e.target == this.destCanvas) {
          this.busySkipped = true;
        }
        return;
      }
      if (e.target == this.destCanvas) {
        e.preventDefault();
      }
      if (this.touchlength > 1) return;
      if (e instanceof MouseEvent && e.button == 2 || this.virtualRight) {
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
        this.saveSession();
      }
      if (Neo.CurrentToolType === _Painter.TOOLTYPE_PASTE && this.isCopyActive && this.isMouseDownRight) {
        this.cancelCopy();
        this.isMouseDownRight = false;
        return;
      }
      if (this.drawType == _Painter.DRAWTYPE_BEZIER && this.isBezierActive && this.isMouseDownRight) {
        this.isMouseDownRight = false;
        if (this.tool.cancelBezier) {
          this.tool.cancelBezier();
        }
        return;
      }
      if (this.drawType != _Painter.DRAWTYPE_BEZIER && this.isBezierActive) {
        if (this.tool.cancelBezier) {
          this.tool.cancelBezier();
        }
        return;
      }
      if (this.isMouseDownRight) {
        this.isMouseDownRight = false;
        if (e.target instanceof HTMLElement && !this.isWidget(e.target)) {
          this.pickColor(this.mouseX, this.mouseY);
          return;
        }
      }
      if (!this.isUIPaused()) {
        if (e.target instanceof HTMLElement && /** @type {BarElement} */
        e.target["data-bar"]) {
          this.pushTool(this.handTool);
          if (this.handTool) {
            this.handTool.reverse = false;
          }
        } else if (this.isSpaceDown && document.activeElement != this.inputText) {
          this.pushTool(this.handTool);
          if (this.handTool) {
            this.handTool.reverse = true;
          }
        } else if (e.target instanceof HTMLElement && /** @type {any} */
        e.target["data-slider"] != void 0) {
          this.pushTool(this.sliderTool);
          if (this.sliderTool) {
            this.sliderTool.target = e.target;
            this.sliderTool.isAlt = false;
          }
        } else if (e.ctrlKey && e.altKey && !e.shiftKey) {
          this.pushTool(this.sliderTool);
          if (this.sliderTool) {
            this.sliderTool.target = Neo.sliders[Neo.SLIDERTYPE_SIZE].element;
            this.sliderTool.isAlt = true;
          }
        } else if (e.target instanceof HTMLElement && this.isWidget(e.target)) {
          this.isMouseDown = false;
          this.pushTool(this.dummyTool);
        }
      }
      this.tool.downHandler(this);
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    _mouseUpHandler(e) {
      this.isMouseDown = false;
      this.isMouseDownRight = false;
      this.tool.upHandler(this);
      if (e.target instanceof HTMLElement && e.target.id != "neo-right") {
        this.virtualRight = false;
        RightButton.clear();
      }
      this._updateMousePosition(e);
    }
    /**
     * @param {PointerEvent|TouchEvent} e
     * @returns
     */
    _mouseMoveHandler(e) {
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
      if (e.cancelable && e.target instanceof HTMLElement && e.target.className != "o") {
        e.preventDefault();
      }
    }
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    getPosition(e) {
      if (e instanceof MouseEvent && e.clientX !== void 0) {
        return { x: e.clientX, y: e.clientY, e: e.type };
      } else if (e instanceof TouchEvent) {
        var touch = e.changedTouches[0];
        return { x: touch.clientX, y: touch.clientY, e: e.type };
      } else {
        console.warn("Unknown event:", e.type);
        return { x: 0, y: 0, e: e.type || "unknown" };
      }
    }
    /**
     * 手ぶれ補正
     */
    _stabilizer() {
      const freeHandMode = this.drawType === 0;
      const toolTypes = [
        _Painter.TOOLTYPE_PEN,
        _Painter.TOOLTYPE_ERASER,
        _Painter.TOOLTYPE_BRUSH,
        _Painter.TOOLTYPE_TONE,
        _Painter.TOOLTYPE_BLUR,
        _Painter.TOOLTYPE_DODGE,
        _Painter.TOOLTYPE_BURN
      ];
      const isDrawTool = freeHandMode && toolTypes.includes(Neo.CurrentToolType);
      if (!isDrawTool || !Neo.stabilize_level) {
        return;
      }
      if (this.isMouseDown) {
        const level = Math.max(0, Math.min(Neo.stabilize_level, 5));
        const stabilityTable = [0, 0.5, 0.65, 0.8, 0.9, 0.95];
        const stabilityLebel = stabilityTable[level];
        const zoomModifier = this.zoom <= 1 ? 1 : 0.8;
        const sizeModifier = this.lineWidth <= 8 ? 1 : 0.8;
        const stability = stabilityLebel * zoomModifier * sizeModifier;
        const factor = 1 - stability;
        if (typeof this.stabilizedX === "number" && typeof this.stabilizedY === "number") {
          this.stabilizedX = factor * this.mouseX + stability * this.stabilizedX;
          this.stabilizedY = factor * this.mouseY + stability * this.stabilizedY;
        } else {
          this.stabilizedX = this.mouseX;
          this.stabilizedY = this.mouseY;
        }
        this.mouseX = this.stabilizedX;
        this.mouseY = this.stabilizedY;
      } else {
        this.stabilizedX = null;
        this.stabilizedY = null;
      }
    }
    /**
     * ポインターの位置を更新する
     * @param {MouseEvent|TouchEvent} e
     */
    _updateMousePosition(e) {
      var rect = this.destCanvas.getBoundingClientRect();
      var pos = this.getPosition(e);
      var x = pos.x;
      var y = pos.y;
      if (this.zoom <= 0) this.zoom = 1;
      this.mouseX = (x - rect.left) / this.zoom + this.zoomX - this.destCanvas.width * 0.5 / this.zoom;
      this.mouseY = (y - rect.top) / this.zoom + this.zoomY - this.destCanvas.height * 0.5 / this.zoom;
      if (isNaN(this.prevMouseX)) {
        this.prevMouseX = this.mouseX;
      }
      if (isNaN(this.prevMouseY)) {
        this.prevMouseY = this.mouseY;
      }
      this._stabilizer();
      this.rawMouseX = x;
      this.rawMouseY = y;
      this.clipMouseX = Math.max(Math.min(this.canvasWidth, this.mouseX), 0);
      this.clipMouseY = Math.max(Math.min(this.canvasHeight, this.mouseY), 0);
    }
    /*
      -------------------------------------------------------------------------
      Undo
      -------------------------------------------------------------------------
    */
    undo() {
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
          undoItem.height
        );
      }
    }
    redo() {
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
          undoItem.height
        );
      }
    }
    //hasUndo() {
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
    _pushUndo(x, y, w, h, holdRedo = false) {
      x = x === void 0 ? 0 : x;
      y = y === void 0 ? 0 : y;
      w = w === void 0 ? this.canvasWidth : w;
      h = h === void 0 ? this.canvasHeight : h;
      var undoItem = new UndoItem();
      undoItem.x = 0;
      undoItem.y = 0;
      undoItem.width = w;
      undoItem.height = h;
      undoItem.data = [
        this.canvasCtx[0].getImageData(x, y, w, h),
        this.canvasCtx[1].getImageData(x, y, w, h)
      ];
      this._undoMgr.pushUndo(undoItem, holdRedo);
      if (!holdRedo) {
        this._actionMgr.step();
      }
      this.dirty = true;
    }
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
    _pushRedo(x, y, w, h) {
      x = x === void 0 ? 0 : x;
      y = y === void 0 ? 0 : y;
      w = w === void 0 ? this.canvasWidth : w;
      h = h === void 0 ? this.canvasHeight : h;
      var undoItem = new UndoItem();
      undoItem.x = 0;
      undoItem.y = 0;
      undoItem.width = w;
      undoItem.height = h;
      undoItem.data = [
        this.canvasCtx[0].getImageData(x, y, w, h),
        this.canvasCtx[1].getImageData(x, y, w, h)
      ];
      this._undoMgr.pushRedo(undoItem);
    }
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
    setZoom(value) {
      this.zoom = value;
      const container = document.getElementById("neo-container");
      if (!container) return;
      var width = this.canvasWidth * this.zoom;
      var height = this.canvasHeight * this.zoom;
      if (width > container.clientWidth - 100)
        width = container.clientWidth - 100;
      if (height > container.clientHeight - 130)
        height = container.clientHeight - 130;
      width = Math.floor(width / 2) * 2;
      height = Math.floor(height / 2) * 2;
      this.destWidth = width;
      this.destHeight = height;
      this.updateDestCanvas(0, 0, this.canvasWidth, this.canvasHeight, false);
      this.setZoomPosition(this.zoomX, this.zoomY);
    }
    /**
     * ズーム時の表示中心座標を設定し、スクロールバー等のUIを同期する。
     * @description
     * 表示領域（destCanvas）から、キャンバス全体のどの座標を中心に見るかを計算する。
     * 画面外にはみ出さないよう座標をクランプ（制限）し、表示用キャンバスを更新する。
     * また、スクロールバーの進捗率を計算して更新を行う。
     * @param {number} x - 視点の中心X座標
     * @param {number} y - 視点の中心Y座標
     */
    setZoomPosition(x, y) {
      var minx = this.destCanvas.width / this.zoom * 0.5;
      var maxx = this.canvasWidth - minx;
      var miny = this.destCanvas.height / this.zoom * 0.5;
      var maxy = this.canvasHeight - miny;
      x = Math.max(Math.min(maxx, x), minx);
      y = Math.max(Math.min(maxy, y), miny);
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
    }
    /*
      -------------------------------------------------------------------------
      Drawing Helper
      -------------------------------------------------------------------------
    */
    /**
     * データ送信
     * @param {string} baseURL 基準ディレクトリパス（URL形式、末尾は "/"）
     * @returns
     */
    submit(baseURL) {
      if (Neo.isAnimation) {
        var items = this._actionMgr._items;
        if (items.length > 0 && items[items.length - 1][0] != "restore" || items.length < 1) {
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
      const png = this.getPNG();
      if (!(png instanceof Blob)) {
        console.error("Failed to get PNG data. Submission aborted.");
        return;
      }
      submit(baseURL, png, thumbnail2, thumbnail);
    }
    useThumbnail() {
      var thumbnailWidth = this.getThumbnailWidth();
      var thumbnailHeight = this.getThumbnailHeight();
      if (thumbnailWidth && thumbnailHeight) {
        if (thumbnailWidth < this.canvasWidth || thumbnailHeight < this.canvasHeight) {
          return true;
        }
      }
      return false;
    }
    /**
     * DataURL形式の文字列をBlobオブジェクトに変換する。
     * @description
     * Base64形式またはURIエンコードされたDataURLから、
     * Blob（バイナリ）形式へ変換を行う。
     * ファイルアップロードやサーバー保存の直前段階で利用される。
     * @param {string} dataURL - 変換元のDataURL文字列
     * @returns {Blob} 変換後のBlobオブジェクト（type: image/png）
     */
    dataURLtoBlob(dataURL) {
      var byteString;
      if (dataURL.split(",")[0].indexOf("base64") >= 0) {
        byteString = atob(dataURL.split(",")[1]);
      } else {
        byteString = decodeURI(dataURL.split(",")[1]);
      }
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: "image/png" });
    }
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
    getImage(imageWidth, imageHeight) {
      const canvasWidth = this.canvasWidth;
      const canvasHeight = this.canvasHeight;
      const width = imageWidth != null ? imageWidth : canvasWidth;
      const height = imageHeight != null ? imageHeight : canvasHeight;
      const pngCanvas = document.createElement("canvas");
      pngCanvas.width = width;
      pngCanvas.height = height;
      var pngCanvasCtx = pngCanvas.getContext("2d", {
        willReadFrequently: true
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
          height
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
          height
        );
      }
      return pngCanvas;
    }
    /**
     * 現在の描画内容をPNG形式のBlobとして取得する。
     * @description
     * 1. getImage() を呼び出し、レイヤーを統合した完成画像（Canvas）を取得する。
     * 2. toDataURL("image/png") を使用して、Canvasの内容をBase64文字列に変換する。
     * 3. dataURLtoBlob() を使用して、Base64文字列をサーバー通信やダウンロードに適したBlobバイナリに変換する。
     * @returns {Blob|null} PNG形式のBlobオブジェクト。失敗時はnullを返す。
     */
    getPNG() {
      var image = this.getImage();
      if (!image) {
        console.error("Failed to export image.");
        return null;
      }
      var dataURL = image.toDataURL("image/png");
      return this.dataURLtoBlob(dataURL);
    }
    /**
     * 掲示板投稿や保存用のサムネイル、またはアニメーション用の描画データを取得する。
     * @description
     * - "animation" 以外: getImage() で生成した画像を指定サイズでリサイズし、Blobとして返す。
     * - "animation" 指定時: 描画手順をJSON化し、LZStringで圧縮したバイナリデータ（NEO形式）を返す。
     * @param {string} type - 出力形式（例: "png", "jpeg", "animation"）
     * @returns {Blob|null} 変換後のBlobオブジェクト、または失敗時のnull
     */
    getThumbnail(type) {
      if (type != "animation") {
        let thumbnailWidth = this.getThumbnailWidth();
        let thumbnailHeight = this.getThumbnailHeight();
        if (thumbnailWidth || thumbnailHeight) {
          const width = this.canvasWidth;
          const height = this.canvasHeight;
          if (thumbnailHeight && thumbnailWidth == 0) {
            thumbnailWidth = thumbnailHeight * width / height;
          }
          if (thumbnailWidth && thumbnailHeight == 0) {
            thumbnailHeight = thumbnailWidth * height / width;
          }
        } else {
          thumbnailWidth = thumbnailHeight = null;
        }
        console.log("get thumbnail", thumbnailWidth, thumbnailHeight);
        const image = this.getImage(thumbnailWidth, thumbnailHeight);
        if (!image) {
          console.error("Failed to export image.");
          return null;
        }
        var dataURL = image.toDataURL("image/" + type);
        return this.dataURLtoBlob(dataURL);
      } else {
        if (this._actionMgr._items.length < 1) {
          return null;
        }
        const jsonString = JSON.stringify(this._actionMgr._items);
        const compressed = import_lz_string2.default.compressToUint8Array(jsonString);
        const data = new Uint8Array(new ArrayBuffer(compressed.byteLength));
        data.set(compressed);
        var magic = "NEO ";
        var w = this.canvasWidth;
        var h = this.canvasHeight;
        return new Blob([
          magic,
          new Uint8Array([w % 256, Math.floor(w / 256)]),
          new Uint8Array([h % 256, Math.floor(h / 256)]),
          new Uint8Array(4),
          data
        ]);
      }
    }
    /**
     * サムネイルの幅を取得
     * @returns {Number}}
     */
    getThumbnailWidth() {
      var width = Neo.config.thumbnail_width;
      if (width) {
        if (width.match(/%$/)) {
          return Math.floor(this.canvasWidth * (parseInt(width) / 100));
        } else {
          return parseInt(width);
        }
      }
      return 0;
    }
    /**
     * サムネイルの高さを取得
     * @returns {Number}
     */
    getThumbnailHeight() {
      var height = Neo.config.thumbnail_height;
      if (height) {
        if (height.match(/%$/)) {
          return Math.floor(this.canvasHeight * (parseInt(height) / 100));
        } else {
          return parseInt(height);
        }
      }
      return 0;
    }
    /**
     * 全消し
     * @description
     * 1. オプションで消去の確認を行う。
     * 2. 履歴管理のため、消去前の状態をUndoスタックに保存する。
     * 3. アクションマネージャーを通じて描画レイヤーをクリアする。
     * @param {boolean} doConfirm - 消去時に確認ダイアログを表示するかどうか
     */
    clearCanvas(doConfirm) {
      if (!doConfirm || confirm("\u5168\u6D88\u3057\u3057\u307E\u3059")) {
        this._pushUndo();
        this._actionMgr.clearCanvas();
      }
    }
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
    updateDestCanvas(x, y, width, height, useTemp = false) {
      x = Math.floor(x);
      y = Math.floor(y);
      var canvasWidth = this.canvasWidth;
      var canvasHeight = this.canvasHeight;
      var updateAll = x === 0 && y === 0 && width === canvasWidth && height === canvasHeight;
      if (x + width > canvasWidth) width = canvasWidth - x;
      if (y + height > canvasHeight) height = canvasHeight - y;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (width <= 0 || height <= 0) return;
      var ctx = this.destCanvasCtx;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 1;
      const zoom = this.zoom;
      const is_useSuperSample = zoom === 1.5 || zoom === 2.5;
      this.scrollBarX = isNaN(this.scrollBarX) ? 0 : this.scrollBarX;
      this.scrollBarY = isNaN(this.scrollBarY) ? 0 : this.scrollBarY;
      let offsetX = this.scrollBarX * (this.canvasWidth * zoom - this.destCanvas.width);
      let offsetY = this.scrollBarY * (this.canvasHeight * zoom - this.destCanvas.height);
      if (is_useSuperSample) {
        offsetX = Math.round(offsetX);
        offsetY = Math.round(offsetY);
        const x1 = Math.min(canvasWidth, Math.ceil((x + width) / 2) * 2);
        const y1 = Math.min(canvasHeight, Math.ceil((y + height) / 2) * 2);
        x = Math.floor(x / 2) * 2;
        y = Math.floor(y / 2) * 2;
        width = x1 - x;
        height = y1 - y;
        const vx0 = Math.max(0, Math.floor(offsetX / zoom / 2) * 2);
        const vy0 = Math.max(0, Math.floor(offsetY / zoom / 2) * 2);
        const vx1 = Math.min(
          canvasWidth,
          Math.ceil((offsetX + this.destCanvas.width) / zoom / 2) * 2
        );
        const vy1 = Math.min(
          canvasHeight,
          Math.ceil((offsetY + this.destCanvas.height) / zoom / 2) * 2
        );
        const nx = Math.max(x, vx0);
        const ny = Math.max(y, vy0);
        const nw = Math.min(x + width, vx1) - nx;
        const nh = Math.min(y + height, vy1) - ny;
        if (nw <= 0 || nh <= 0) {
          ctx.restore();
          return;
        }
        x = nx;
        y = ny;
        width = nw;
        height = nh;
      }
      const pad = zoom < 1 ? Math.ceil(1 / zoom) + 2 : 2;
      {
        const px0 = Math.max(0, x - pad);
        const py0 = Math.max(0, y - pad);
        const px1 = Math.min(canvasWidth, x + width + pad);
        const py1 = Math.min(canvasHeight, y + height + pad);
        x = px0;
        y = py0;
        width = px1 - px0;
        height = py1 - py0;
      }
      const zx = Math.round(x * zoom - offsetX);
      const zy = Math.round(y * zoom - offsetY);
      const zw = Math.round((x + width) * zoom - offsetX) - zx;
      const zh = Math.round((y + height) * zoom - offsetY) - zy;
      if (updateAll) {
        ctx.fillRect(0, 0, this.destCanvas.width, this.destCanvas.height);
      } else {
        ctx.fillRect(zx, zy, zw, zh);
      }
      let drawn = false;
      if (is_useSuperSample) {
        const k = zoom * 2;
        const tw = width * k;
        const th = height * k;
        let tmp = this._upscaledCanvas;
        if (!tmp) {
          tmp = this._upscaledCanvas = document.createElement("canvas");
          this._upscaledCtx = tmp.getContext("2d");
        }
        const tctx = this._upscaledCtx;
        if (tctx) {
          if (tmp.width !== tw || tmp.height !== th) {
            tmp.width = tw;
            tmp.height = th;
          } else {
            tctx.clearRect(0, 0, tw, th);
          }
          tctx.imageSmoothingEnabled = false;
          for (let i = 0; i < 2; i++) {
            if (this.visible[i])
              tctx.drawImage(this.canvas[i], x, y, width, height, 0, 0, tw, th);
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "low";
          ctx.drawImage(tmp, 0, 0, tw, th, zx, zy, zw, zh);
          drawn = true;
        }
      }
      if (!drawn) {
        if (this.visible[0])
          ctx.drawImage(this.canvas[0], x, y, width, height, zx, zy, zw, zh);
        if (this.visible[1])
          ctx.drawImage(this.canvas[1], x, y, width, height, zx, zy, zw, zh);
      }
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
          zh
        );
      }
      ctx.restore();
      if (Neo.viewer && Neo.config.neo_viewer_max_width_100) {
        this.clearCanvasHeight();
      }
    }
    clearCanvasHeight() {
      const pageview = document.getElementById("neo-pageView");
      const painter = document.getElementById("neo-painter");
      const canvasBox = document.getElementById("neo-canvas");
      if (pageview) pageview.style.height = "";
      if (canvasBox) canvasBox.style.height = "";
      if (painter) {
        painter.style.position = "relative";
        painter.style.bottom = "";
        painter.style.left = "";
        painter.style.margin = "0 auto";
      }
    }
    /**
     * ブラシで描画した時に、書き換える必要がある「範囲」を計算する。
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
    getBound(x0, y0, x1, y1, r) {
      let left = Math.floor(x0 < x1 ? x0 : x1);
      let top = Math.floor(y0 < y1 ? y0 : y1);
      let width = Math.ceil(Math.abs(x0 - x1));
      let height = Math.ceil(Math.abs(y0 - y1));
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
    }
    /**
     * 色を取得
     * @param {string} [color]
     */
    getColor(color = "") {
      const c = color ? color : this.foregroundColor;
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      const a = Math.floor(this.alpha * 255);
      const value = a << 24 | b << 16 | g << 8 | r;
      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      const colorPickerId = Neo.config.neo_color_picker_id;
      const colorPicker = document.getElementById(colorPickerId);
      if (colorPickerId) {
        if (colorPicker instanceof HTMLInputElement) {
          colorPicker.value = hex;
        }
      }
      document.dispatchEvent(
        new CustomEvent("neo:colorchange", {
          detail: { hex, r, g, b, a }
        })
      );
      return value;
    }
    /**
     * 数値形式の色情報を、CSS等で利用可能な文字列（#RRGGBB）へ変換する。
     * 下位24ビットのRGB成分を抽出し、6桁の16進数文字列を生成する。
     * アルファチャンネル（透明度）は破棄される。
     * * @param {number} c - 変換対象の色数値
     * @returns {string} CSS形式のカラー文字列
     */
    getColorString(c) {
      const rgb = ("000000" + (c & 16777215).toString(16)).slice(-6);
      return "#" + rgb;
    }
    /**
     * 色をセット
     * @param {string|number} color
     */
    setColor(color) {
      if (typeof color != "string") color = this.getColorString(color);
      this.foregroundColor = color;
      updateUI();
    }
    /**
     * ツールの種類に応じて、現在の色から描画用のアルファ値を計算する。
     * @description
     * ツール（ペン、塗りつぶし、ブラシ）ごとに異なる数学的な曲線を用いてアルファ値を変換し、
     * 描き味の調整を行う。また、非常に低いアルファ値に対しては、累積誤差を利用して
     * 点を間引くことで見た目の濃度を擬似的に表現する（ディザリングに近い処理）。
     * @param {number} type - アルファ計算のタイプ（ALPHATYPE_PEN, ALPHATYPE_FILL, ALPHATYPE_BRUSH）
     * @returns {number} 0.0〜1.0 の範囲に正規化された描画用アルファ値
     */
    getAlpha(type) {
      let a1 = this._currentColor[3] / 255;
      switch (type) {
        case _Painter.ALPHATYPE_PEN:
          if (a1 > 0.5) {
            a1 = 1 / 16 + (a1 - 0.5) * 30 / 16;
          } else {
            a1 = Math.sqrt(2 * a1) / 16;
          }
          a1 = Math.min(1, Math.max(0, a1));
          break;
        case _Painter.ALPHATYPE_FILL:
          a1 = -56e-5 * a1 + 42e-4 / (1 - a1) - 42e-4;
          a1 = Math.min(1, Math.max(0, a1 * 10));
          break;
        case _Painter.ALPHATYPE_BRUSH:
          a1 = -56e-5 * a1 + 42e-4 / (1 - a1) - 42e-4;
          a1 = Math.min(1, Math.max(0, a1));
          break;
      }
      if (a1 < 1 / 255) {
        this.aerr += a1;
        a1 = 0;
        while (this.aerr > 1 / 255) {
          a1 = 1 / 255;
          this.aerr -= 1 / 255;
        }
      }
      return a1;
    }
    /**
     * 描画準備(前景色・マスク色をRGB(A)に変換してキャッシュ)
     *  描画開始前に、現在の前景色・マスク色・線幅・マスクタイプを
     *  内部プロパティ(_currentColor等)に確定させる
     * */
    prepareDrawing() {
      const r = parseInt(this.foregroundColor.slice(1, 3), 16);
      const g = parseInt(this.foregroundColor.slice(3, 5), 16);
      const b = parseInt(this.foregroundColor.slice(5, 7), 16);
      const a = Math.floor(this.alpha * 255);
      const maskR = parseInt(this.maskColor.slice(1, 3), 16);
      const maskG = parseInt(this.maskColor.slice(3, 5), 16);
      const maskB = parseInt(this.maskColor.slice(5, 7), 16);
      this._currentColor = [r, g, b, a];
      this._currentMask = [maskR, maskG, maskB];
      this._currentWidth = this.lineWidth;
      this._currentMaskType = this.maskType;
    }
    /**
     * 指定ピクセルの色が現在のマスク条件に適合するか判定する。
     * @description
     * 現在のマスク設定（特定色のみ、特定色以外、あるいは明度差による条件）に基づき、
     * ターゲットとなるピクセル（buf8, index）を描画対象にするかどうかを判定する。
     * @param {Uint8ClampedArray} buf8 - キャンバスの画素データ（RGBA）
     * @param {number} index - 判定対象ピクセルの開始インデックス
     * @returns {boolean|undefined} 描画を許可するなら true、禁止なら false、マスク無効なら undefined
     */
    isMasked(buf8, index) {
      const r = this._currentMask[0];
      const g = this._currentMask[1];
      const b = this._currentMask[2];
      const r1 = this._currentColor[0];
      const g1 = this._currentColor[1];
      const b1 = this._currentColor[2];
      let r0 = buf8[index + 0];
      let g0 = buf8[index + 1];
      let b0 = buf8[index + 2];
      let a0 = buf8[index + 3];
      if (a0 == 0) {
        r0 = 255;
        g0 = 255;
        b0 = 255;
      }
      let type = this._currentMaskType;
      if (type == _Painter.MASKTYPE_ADD || type == _Painter.MASKTYPE_SUB) {
        if (this._currentColor[3] < 250) {
          type = _Painter.MASKTYPE_NONE;
        }
      }
      switch (type) {
        case _Painter.MASKTYPE_NONE:
          return;
        case _Painter.MASKTYPE_NORMAL:
          return r0 == r && g0 == g && b0 == b ? true : false;
        case _Painter.MASKTYPE_REVERSE:
          return r0 != r || g0 != g || b0 != b ? true : false;
        case _Painter.MASKTYPE_ADD:
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
        case _Painter.MASKTYPE_SUB:
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
    }
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
     * @param {number} type - 使用するツールタイプ（Painter.LINETYPE_...）。
     * @returns {void}
     */
    setPoint(buf8, bufWidth, x0, y0, left, top, type) {
      const x = x0 - left;
      const y = y0 - top;
      switch (type) {
        case _Painter.LINETYPE_PEN:
          this.setPenPoint(buf8, bufWidth, x, y);
          break;
        case _Painter.LINETYPE_BRUSH:
          this.setBrushPoint(buf8, bufWidth, x, y);
          break;
        case _Painter.LINETYPE_TONE:
          this.setTonePoint(buf8, bufWidth, x, y, x0, y0);
          break;
        case _Painter.LINETYPE_ERASER:
          this.setEraserPoint(buf8, bufWidth, x, y);
          break;
        case _Painter.LINETYPE_BLUR:
          this.setBlurPoint(buf8, bufWidth, x, y, x0, y0);
          break;
        case _Painter.LINETYPE_DODGE:
          this.setDodgePoint(buf8, bufWidth, x, y);
          break;
        case _Painter.LINETYPE_BURN:
          this.setBurnPoint(buf8, bufWidth, x, y);
          break;
        default:
          break;
      }
    }
    /**
     * 指定した座標のピクセルに対してペンの描画処理を実行する。
     * @param {Uint8ClampedArray} buf8 - 画素データ
     * @param {number} width - バッファの横幅
     * @param {number} x - 相対X座標
     * @param {number} y - 相対Y座標
     */
    setPenPoint(buf8, width, x, y) {
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
      var a1 = this.getAlpha(_Painter.ALPHATYPE_PEN);
      if (a1 == 0) return;
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            let r02 = buf8[index + 0];
            let g0 = buf8[index + 1];
            let b0 = buf8[index + 2];
            let a0 = buf8[index + 3] / 255;
            var a = a0 + a1 - a0 * a1;
            let r = r02, g = g0, b = b0;
            if (a > 0) {
              var a1x = Math.max(a1, 1 / 255);
              r = (r1 * a1x + r02 * a0 * (1 - a1x)) / a;
              g = (g1 * a1x + g0 * a0 * (1 - a1x)) / a;
              b = (b1 * a1x + b0 * a0 * (1 - a1x)) / a;
              r = r1 > r02 ? Math.ceil(r) : Math.floor(r);
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
    }
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
    setBrushPoint(buf8, width, x, y) {
      const d = this._currentWidth;
      let r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      let index = (y * width + x) * 4;
      const shape = this._roundData[d];
      let shapeIndex = 0;
      const r1 = this._currentColor[0];
      const g1 = this._currentColor[1];
      const b1 = this._currentColor[2];
      const a1 = this.getAlpha(_Painter.ALPHATYPE_BRUSH);
      if (a1 == 0) return;
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            let r02 = buf8[index + 0];
            let g0 = buf8[index + 1];
            let b0 = buf8[index + 2];
            let a0 = buf8[index + 3] / 255;
            let a = a0 + a1 - a0 * a1;
            let r = r02, g = g0, b = b0;
            if (a > 0) {
              let a1x = Math.max(a1, 1 / 255);
              r = (r1 * a1x + r02 * a0) / (a0 + a1x);
              g = (g1 * a1x + g0 * a0) / (a0 + a1x);
              b = (b1 * a1x + b0 * a0) / (a0 + a1x);
              r = r1 > r02 ? Math.ceil(r) : Math.floor(r);
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
    }
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
    setTonePoint(buf8, width, x, y, x0, y0) {
      var d = this._currentWidth;
      var r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      x0 -= r0;
      y0 -= r0;
      var shape = this._roundData[d];
      var shapeIndex = 0;
      var index = (y * width + x) * 4;
      const r = this._currentColor[0];
      const g = this._currentColor[1];
      const b = this._currentColor[2];
      const a = this._currentColor[3];
      const toneData = this.getToneData(a);
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            if (toneData[(y0 + i) % 4 + (x0 + j) % 4 * 4]) {
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
    }
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
    setEraserPoint(buf8, width, x, y) {
      const d = this._currentWidth;
      const r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      const shape = this._roundData[d];
      let shapeIndex = 0;
      let index = (y * width + x) * 4;
      const a = Math.floor(this._currentColor[3]);
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            var k = buf8[index + 3] / 255 * (1 - a / 255);
            buf8[index + 3] -= a / (d * (255 - a) / 255);
          }
          index += 4;
        }
        index += (width - d) * 4;
      }
    }
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
    setBlurPoint(buf8, width, x, y, x0, y0) {
      var d = this._currentWidth;
      var r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      var shape = this._roundData[d];
      var shapeIndex = 0;
      var height = buf8.length / (width * 4);
      var a1 = this._currentColor[3] / 255 / 12;
      if (a1 == 0) return;
      var blur = a1;
      var tmp = new Uint8ClampedArray(buf8.length);
      for (var i = 0; i < buf8.length; i++) {
        tmp[i] = buf8[i];
      }
      var left = x0 - x - r0;
      var top = y0 - y - r0;
      var xstart = 0, xend = d;
      var ystart = 0, yend = d;
      if (xstart > left) xstart = -left;
      if (ystart > top) ystart = -top;
      if (xend > this.canvasWidth - left) xend = this.canvasWidth - left;
      if (yend > this.canvasHeight - top) yend = this.canvasHeight - top;
      for (var j = ystart; j < yend; j++) {
        var index = (j * width + xstart) * 4;
        for (var i = xstart; i < xend; i++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            var rgba = [0, 0, 0, 0, 0];
            this.addBlur(tmp, index, 1 - blur * 4, rgba);
            if (i > xstart) this.addBlur(tmp, index - 4, blur, rgba);
            if (i < xend - 1) this.addBlur(tmp, index + 4, blur, rgba);
            if (j > ystart) this.addBlur(tmp, index - width * 4, blur, rgba);
            if (j < yend - 1) this.addBlur(tmp, index + width * 4, blur, rgba);
            buf8[index + 0] = Math.round(rgba[0]);
            buf8[index + 1] = Math.round(rgba[1]);
            buf8[index + 2] = Math.round(rgba[2]);
            buf8[index + 3] = Math.round(rgba[3] / rgba[4] * 255);
          }
          index += 4;
        }
      }
    }
    /**
     * 覆い焼き（Dodge）ツールを使用して、指定範囲の画素の明度を上げる。
     * * @param {Uint8ClampedArray} buf8 - キャンバスの画像データを保持するUint8配列 (RGBA)。
     * @param {number} width - バッファの横幅（ピクセル単位）。
     * @param {number} x - 覆い焼きを適用する中心のX座標。
     * @param {number} y - 覆い焼きを適用する中心のY座標。
     * @returns {void}
     */
    setDodgePoint(buf8, width, x, y) {
      let r1;
      let g1;
      let b1;
      var d = this._currentWidth;
      const r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      var index = (y * width + x) * 4;
      var shape = this._roundData[d];
      var shapeIndex = 0;
      var a1 = this.getAlpha(_Painter.ALPHATYPE_BRUSH);
      if (a1 == 0) return;
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            let r02 = buf8[index + 0];
            let g0 = buf8[index + 1];
            let b0 = buf8[index + 2];
            let a0 = buf8[index + 3] / 255;
            if (a1 != 255) {
              r1 = r02 * 255 / (255 - a1);
              g1 = g0 * 255 / (255 - a1);
              b1 = b0 * 255 / (255 - a1);
            } else {
              r1 = 255;
              g1 = 255;
              b1 = 255;
            }
            const r = Math.ceil(r1);
            const g = Math.ceil(g1);
            const b = Math.ceil(b1);
            let a = a0;
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
    }
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
    setBurnPoint(buf8, width, x, y) {
      let r1;
      let g1;
      let b1;
      var d = this._currentWidth;
      const r0 = Math.floor(d / 2);
      x -= r0;
      y -= r0;
      var index = (y * width + x) * 4;
      var shape = this._roundData[d];
      var shapeIndex = 0;
      var a1 = this.getAlpha(_Painter.ALPHATYPE_BRUSH);
      if (a1 == 0) return;
      for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
          if (shape[shapeIndex++] && !this.isMasked(buf8, index)) {
            let r02 = buf8[index + 0];
            let g0 = buf8[index + 1];
            let b0 = buf8[index + 2];
            let a0 = buf8[index + 3] / 255;
            if (a1 != 255) {
              r1 = 255 - (255 - r02) * 255 / (255 - a1);
              g1 = 255 - (255 - g0) * 255 / (255 - a1);
              b1 = 255 - (255 - b0) * 255 / (255 - a1);
            } else {
              r1 = 0;
              g1 = 0;
              b1 = 0;
            }
            const r = Math.floor(r1);
            const g = Math.floor(g1);
            const b = Math.floor(b1);
            let a = a0;
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
    }
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
    xorPixel(buf32, bufWidth, x, y, c) {
      var index = y * bufWidth + x;
      if (!c) c = 16777215;
      buf32[index] ^= c;
    }
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
    getBezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3) {
      var a0 = (1 - t) * (1 - t) * (1 - t);
      var a1 = (1 - t) * (1 - t) * t * 3;
      var a2 = (1 - t) * t * t * 3;
      var a3 = t * t * t;
      var x = x0 * a0 + x1 * a1 + x2 * a2 + x3 * a3;
      var y = y0 * a0 + y1 * a1 + y2 * a2 + y3 * a3;
      return [x, y];
    }
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
    drawBezier(ctx, x0, y0, x1, y1, x2, y2, x3, y3, type, isReplay, isPreview = false) {
      var points = [
        [x0, y0],
        [x1, y1],
        [x2, y2],
        [x3, y3]
      ];
      var ref = this;
      this.draw(
        ctx,
        points,
        /** @type {DrawCallback} */
        function(left, top, width, height, buf8, imageData) {
          var n = Math.ceil((width + height) * 2.5);
          var oType = ref._currentMaskType;
          var oAlpha = ref._currentColor[3];
          if (isPreview) {
            ref._currentMaskType = _Painter.MASKTYPE_NONE;
            ref._currentColor[3] = 255;
          }
          for (var i = 0; i < n; i++) {
            var t = i * 1 / n;
            var p = ref.getBezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3);
            p[0] = Math.round(p[0]);
            p[1] = Math.round(p[1]);
            ref.plot(
              p,
              /** @param {number} x @param {number} y **/
              function(x, y) {
                ref.setPoint(buf8, imageData.width, x, y, left, top, type);
              }
            );
          }
          ref._currentMaskType = oType;
          ref._currentColor[3] = oAlpha;
          ref.prevLine = null;
        }
      );
    }
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
    drawLine(ctx, x0, y0, x1, y1, type) {
      x0 = Math.floor(x0);
      y0 = Math.floor(y0);
      x1 = Math.floor(x1);
      y1 = Math.floor(y1);
      var points = [
        [x0, y0],
        [x1, y1]
      ];
      var ref = this;
      this.aerr = 0;
      this.draw(
        ctx,
        points,
        /** @type {DrawCallback} */
        function(left, top, width, height, buf8, imageData) {
          ref.bresenham(
            points,
            /** @param {number} x @param {number} y **/
            function(x, y) {
              ref.setPoint(buf8, imageData.width, x, y, left, top, type);
            }
          );
        }
      );
      this.prevLine = points;
    }
    /**
     * 描画範囲を最適化し、バッファを取得・加工・反映させるラッパー。
     * * 指定された点群を囲む最小矩形を算出し、ブラシ幅(r)の余白を含めて
     * ImageDataを取得・書き戻すことで描画負荷を最小限に抑える。
     * * @param {CanvasRenderingContext2D} ctx - 描画対象のCanvasコンテキスト。
     * @param {Array<Array<number>>} points - 描画対象となる点の配列 [[x,y], ...]。
     * @param {Function} callback - バッファ操作を行う描画ロジック本体。
     * @returns {void}
     */
    draw(ctx, points, callback) {
      var xs = [], ys = [];
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
    }
    /**
     * ブレゼンハムのアルゴリズムを用いて、指定された始点と終点の間のピクセル座標を算出。
     * * [重要] 前回の線分(this.prevLine)と始点が一致する場合、重複描画を防ぐために
     * * コールバックをスキップする最適化ロジックを含む。
     * * @param {Array<Array<number>>} points - [[x0, y0], [x1, y1]] の形式の座標配列。
     * @param {Function} callback - 算出された座標(x, y)に対して実行する描画処理。
     * @returns {void}
     */
    bresenham(points, callback) {
      var x0 = points[0][0];
      var y0 = points[0][1];
      var x1 = points[1][0];
      var y1 = points[1][1];
      var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
      var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
      var err = (dx > dy ? dx : -dy) / 2;
      while (true) {
        if (this.prevLine == null || !(this.prevLine[0][0] == x0 && this.prevLine[0][1] == y0 || this.prevLine[1][0] == x0 && this.prevLine[1][1] == y0)) {
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
    }
    /**
     * 指定した座標に対して描画処理（callback）を実行する。
     * * 直前の描画座標(prevLine)と比較し、同一地点であれば再描画をスキップして
     * * 重複による色の重なりを防ぎます。
     * * @param {Array<number>} point - [x, y] 形式の描画対象座標。
     * @param {Function} callback - 実際に setPoint を呼び出す描画関数。
     * @returns {void}
     */
    plot(point, callback) {
      var x0 = point[0];
      var y0 = point[1];
      if (this.prevLine == null || !(this.prevLine[0][0] == x0 && this.prevLine[0][1] == y0)) {
        callback(x0, y0);
      }
      this.prevLine = [point, point];
    }
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
    drawPoint(ctx, x, y, type) {
      this.drawLine(ctx, x, y, x, y, type);
    }
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
    xorRect(buf32, bufWidth, x, y, width, height, c) {
      var index = y * bufWidth + x;
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          buf32[index] ^= c;
          index++;
        }
        index += width - bufWidth;
      }
    }
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
    drawXORRect(ctx, x, y, width, height, isFill = false, c = 16777215) {
      x = Math.round(x);
      y = Math.round(y);
      width = Math.round(width);
      height = Math.round(height);
      if (width == 0 || height == 0) return;
      var imageData = ctx.getImageData(x, y, width, height);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var index = 0;
      if (!c) c = 16777215;
      if (isFill) {
        this.xorRect(buf32, width, 0, 0, width, height, c);
      } else {
        for (var i = 0; i < width; i++) {
          buf32[index] = buf32[index] ^= c;
          index++;
        }
        if (height > 1) {
          index = width;
          for (var i = 1; i < height; i++) {
            buf32[index] = buf32[index] ^= c;
            index += width;
          }
          if (width > 1) {
            index = width * 2 - 1;
            for (var i = 1; i < height - 1; i++) {
              buf32[index] = buf32[index] ^= c;
              index += width;
            }
            index = width * (height - 1) + 1;
            for (var i = 1; i < width; i++) {
              buf32[index] = buf32[index] ^= c;
              index++;
            }
          }
        }
      }
      imageData.data.set(buf8);
      ctx.putImageData(imageData, x, y);
    }
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
    drawXOREllipse(ctx, x, y, width, height, isFill, c) {
      x = Math.round(x);
      y = Math.round(y);
      width = Math.round(width);
      height = Math.round(height);
      if (width == 0 || height == 0) return;
      if (!c) c = 16777215;
      var imageData = ctx.getImageData(x, y, width, height);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var a = width - 1, b = height - 1, b1 = b & 1;
      var dx = 4 * (1 - a) * b * b, dy = 4 * (b1 + 1) * a * a;
      var err = dx + dy + b1 * a * a, e2;
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
      y1 = y0 - b1;
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
        }
        if (e2 >= dx || 2 * err > dy) {
          x0++;
          x1--;
          err += dx += b1;
        }
      } while (x0 <= x1);
      imageData.data.set(buf8);
      ctx.putImageData(imageData, x, y);
    }
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
    drawXORLine(ctx, x0, y0, x1, y1, c) {
      x0 = Math.round(x0);
      x1 = Math.round(x1);
      y0 = Math.round(y0);
      y1 = Math.round(y1);
      var width = Math.abs(x1 - x0);
      var height = Math.abs(y1 - y0);
      var left = x0 < x1 ? x0 : x1;
      var top = y0 < y1 ? y0 : y1;
      var imageData = ctx.getImageData(left, top, width + 1, height + 1);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var dx = width, sx = x0 < x1 ? 1 : -1;
      var dy = height, sy = y0 < y1 ? 1 : -1;
      var err = (dx > dy ? dx : -dy) / 2;
      while (true) {
        if (this.prevLine == null || !(this.prevLine[0] == x0 && this.prevLine[1] == y0 || this.prevLine[2] == x0 && this.prevLine[3] == y0)) {
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
    }
    /**
     * 消し四角
     * @param {number} layer - 対象レイヤーインデックス。
     * @param {number} x - 開始X。
     * @param {number} y - 開始Y。
     * @param {number} width - 幅。
     * @param {number} height - 高さ。
     */
    eraseRect(layer, x, y, width, height) {
      var ctx = this.canvasCtx[layer];
      x = Math.round(x);
      y = Math.round(y);
      width = Math.round(width);
      height = Math.round(height);
      var imageData = ctx.getImageData(x, y, width, height);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var index = 0;
      var a = 1 - this._currentColor[3] / 255;
      if (a != 0) {
        a = Math.ceil(2 / a);
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
    }
    /**
     * 左右反転
     * * @param {number} layer - 操作対象のレイヤーインデックス。
     * @param {number} x - 反転対象範囲の開始X座標。
     * @param {number} y - 反転対象範囲の開始Y座標。
     * @param {number} width - 反転対象範囲の横幅。
     * @param {number} height - 反転対象範囲の高さ。
     * @returns {void}
     */
    flipH(layer, x, y, width, height) {
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
    }
    /**
     * 上下反転
     * * @param {number} layer - 操作対象のレイヤーインデックス。
     * @param {number} x - 反転対象範囲の開始X座標。
     * @param {number} y - 反転対象範囲の開始Y座標。
     * @param {number} width - 反転対象範囲の横幅。
     * @param {number} height - 反転対象範囲の高さ。
     * @returns {void}
     */
    flipV(layer, x, y, width, height) {
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
    }
    /**
     * レイヤー結合
     * * @param {number} layer - 統合先となるレイヤーインデックス(0 or 1)。
     * @param {number} x - 合成範囲の開始X座標。
     * @param {number} y - 合成範囲の開始Y座標。
     * @param {number} width - 合成範囲の横幅。
     * @param {number} height - 合成範囲の高さ。
     * @returns {void}
     */
    merge(layer, x, y, width, height) {
      x = Math.round(x);
      y = Math.round(y);
      width = Math.round(width);
      height = Math.round(height);
      var r = 0;
      var g = 0;
      var b = 0;
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
        var a0 = buf8[0][index + 3] / 255;
        var r1 = buf8[1][index + 0];
        var g1 = buf8[1][index + 1];
        var b1 = buf8[1][index + 2];
        var a1 = buf8[1][index + 3] / 255;
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
    }
    /**
     * 指定された矩形範囲内のピクセルに対して近傍平均化を行い、ぼかし効果を適用する。
     * * @param {number} layer - 操作対象のレイヤーインデックス。
     * @param {number} x - ぼかし対象範囲の開始X座標。
     * @param {number} y - ぼかし対象範囲の開始Y座標。
     * @param {number} width - ぼかし対象範囲の横幅。
     * @param {number} height - ぼかし対象範囲の高さ。
     * @returns {void}
     */
    blurRect(layer, x, y, width, height) {
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
      var a1 = this._currentColor[3] / 255 / 12;
      var blur = a1;
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          var rgba = [0, 0, 0, 0, 0];
          this.addBlur(tmp, index, 1 - blur * 4, rgba);
          if (i > 0) this.addBlur(tmp, index - 4, blur, rgba);
          if (i < width - 1) this.addBlur(tmp, index + 4, blur, rgba);
          if (j > 0) this.addBlur(tmp, index - width * 4, blur, rgba);
          if (j < height - 1) this.addBlur(tmp, index + width * 4, blur, rgba);
          var w = rgba[4];
          buf8[index + 0] = Math.round(rgba[0]);
          buf8[index + 1] = Math.round(rgba[1]);
          buf8[index + 2] = Math.round(rgba[2]);
          buf8[index + 3] = Math.ceil(rgba[3] / w * 255);
          index += 4;
        }
      }
      imageData.data.set(buf8);
      ctx.putImageData(imageData, x, y);
    }
    /**
     * ぼかし処理における画素加算とアルファブレンドを統合的に実行する。
     * * @param {Uint8ClampedArray} buffer - 操作対象の画像データバッファ。
     * @param {number} index - 加算対象のピクセルインデックス。
     * @param {number} a - 現在のサンプリングウェイト。
     * @param {Array<number>} rgba - 累積色値およびアルファ値、ウェイトを保持する配列 [r, g, b, a, weight]。
     * @returns {void}
     */
    addBlur(buffer, index, a, rgba) {
      var r0 = rgba[0];
      var g0 = rgba[1];
      var b0 = rgba[2];
      var a0 = rgba[3];
      var r1 = buffer[index + 0];
      var g1 = buffer[index + 1];
      var b1 = buffer[index + 2];
      var a1 = buffer[index + 3] / 255 * a;
      rgba[4] += a;
      var a = a0 + a1;
      if (a > 0) {
        rgba[0] = (r1 * a1 + r0 * a0) / (a0 + a1);
        rgba[1] = (g1 * a1 + g0 * a0) / (a0 + a1);
        rgba[2] = (b1 * a1 + b0 * a0) / (a0 + a1);
        rgba[3] = a;
      }
    }
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
    pickColor(x, y) {
      var _a;
      let r = 255, g = 255, b = 255, a = 0, result = 16777215;
      x = Math.floor(x);
      y = Math.floor(y);
      if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
        for (var i = 0; i < 2; i++) {
          if (this.visible[i]) {
            const ctx = this.canvasCtx[i];
            const imageData = ctx.getImageData(x, y, 1, 1);
            const buf32 = new Uint32Array(imageData.data.buffer);
            const buf8 = new Uint8ClampedArray(imageData.data.buffer);
            a = buf8[3] / 255;
            r = r * (1 - a) + buf8[2] * a;
            g = g * (1 - a) + buf8[1] * a;
            b = b * (1 - a) + buf8[0] * a;
          }
        }
        r = Math.max(Math.min(Math.round(r), 255), 0);
        g = Math.max(Math.min(Math.round(g), 255), 0);
        b = Math.max(Math.min(Math.round(b), 255), 0);
        result = r | g << 8 | b << 16;
      }
      this.setColor(result);
      if (this.current > 0) {
        if (a == 0 && (result == 16777215 || this.getEmulationMode() < 2.16)) {
          this.setToolByType(_Painter.TOOLTYPE_ERASER);
        } else {
          if ((_a = Neo.eraserTip) == null ? void 0 : _a.selected) {
            this.setToolByType(_Painter.TOOLTYPE_PEN);
          }
        }
      }
    }
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
    fillHorizontalLine(buf32, x0, x1, y, color) {
      var index = y * this.canvasWidth + x0;
      for (var x = x0; x <= x1; x++) {
        buf32[index++] = color;
      }
    }
    /**
     * スキャンライン・塗りつぶしアルゴリズムにおいて、対象線分上の座標をスタックへ追加する。
     * @param {number} x0 - 走査開始X。
     * @param {number} x1 - 走査終了X。
     * @param {number} y - 対象Y。
     * @param {number} baseColor - 置換対象の色（※現在未使用）。
     * @param {Uint32Array} buf32 - 画像データバッファ（※現在未使用）。
     * @param {Array<{x: number, y: number}>} stack - 塗りつぶし候補座標を保持するスタック。
     */
    scanLine(x0, x1, y, baseColor, buf32, stack) {
      for (var x = x0; x <= x1; x++) {
        stack.push({ x, y });
      }
    }
    /**
     * 塗り潰し
     * @param {number} layer - 対象レイヤーインデックス。
     * @param {number} x - クリック開始X。
     * @param {number} y - クリック開始Y。
     * @param {number} fillColor - 置換後の色（32bit整数）。
     */
    doFloodFill(layer, x, y, fillColor) {
      x = Math.round(x);
      y = Math.round(y);
      var ctx = this.canvasCtx[layer];
      if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
        return;
      }
      const imageData = ctx.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      const buf32 = new Uint32Array(imageData.data.buffer);
      const buf8 = new Uint8ClampedArray(imageData.data.buffer);
      const width = imageData.width;
      const stack = [{ x, y }];
      var baseColor = buf32[y * width + x];
      if ((baseColor & 4278190080) == 0 || baseColor != fillColor) {
        while (stack.length > 0) {
          if (stack.length > 1e6) {
            break;
          }
          var point = stack.pop();
          if (!point) {
            break;
          }
          const x2 = point.x;
          const y2 = point.y;
          let x0 = x2;
          let x1 = x2;
          if (buf32[y2 * width + x2] == fillColor) continue;
          if (buf32[y2 * width + x2] != baseColor) continue;
          for (; 0 < x0; x0--) {
            if (buf32[y2 * width + (x0 - 1)] != baseColor) break;
          }
          for (; x1 < this.canvasWidth - 1; x1++) {
            if (buf32[y2 * width + (x1 + 1)] != baseColor) break;
          }
          this.fillHorizontalLine(buf32, x0, x1, y2, fillColor);
          if (y2 + 1 < this.canvasHeight) {
            this.scanLine(x0, x1, y2 + 1, baseColor, buf32, stack);
          }
          if (y2 - 1 >= 0) {
            this.scanLine(x0, x1, y2 - 1, baseColor, buf32, stack);
          }
        }
      }
      imageData.data.set(buf8);
      ctx.putImageData(imageData, 0, 0);
    }
    /**
     * コピー
     * @description 指定範囲の画像を一時バッファとプレビュー用キャンバスにコピーする。
     * @param {number} layer - 対象レイヤーインデックス。
     * @param {number} x - 開始X。
     * @param {number} y - 開始Y。
     * @param {number} width - 幅。
     * @param {number} height - 高さ。
     */
    copy(layer, x, y, width, height) {
      this.tempX = 0;
      this.tempY = 0;
      this.tempCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      const imageData = this.canvasCtx[layer].getImageData(x, y, width, height);
      const buf32 = new Uint32Array(imageData.data.buffer);
      this.temp = new Uint32Array(buf32.length);
      for (var i = 0; i < buf32.length; i++) {
        this.temp[i] = buf32[i];
      }
      const tempImageData = this.tempCanvasCtx.getImageData(x, y, width, height);
      const tempBuf32 = new Uint32Array(tempImageData.data.buffer);
      let tempBuf8 = new Uint8ClampedArray(tempImageData.data.buffer);
      for (var i = 0; i < tempBuf32.length; i++) {
        if (this.temp[i] >> 24) {
          tempBuf32[i] = this.temp[i] | 4278190080;
        } else {
          tempBuf32[i] = 4294967295;
        }
      }
      tempImageData.data.set(tempBuf8);
      this.tempCanvasCtx.putImageData(tempImageData, x, y);
    }
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
    paste(layer, x, y, width, height, dx, dy) {
      var ctx = this.canvasCtx[layer];
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
    }
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
    turn(layer, x, y, width, height) {
      var ctx = this.canvasCtx[layer];
      var imageData = ctx.getImageData(x, y, width, height);
      var buf32 = new Uint32Array(imageData.data.buffer);
      var buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var temp = new Uint32Array(buf32.length);
      let fillPixel;
      if (Neo.config.neo_disable_turn_original_glitch) {
        fillPixel = function(index2) {
          return 0;
        };
      } else {
        fillPixel = function(index2) {
          return buf32[index2 % width];
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
    }
    /**
     * マスク形状タイプに応じたピクセル判定関数を返却する。
     * @param {string|number} type - 描画ツールまたは塗りつぶしの形状タイプ。
     * @returns {((i: number, j: number, w: number, h: number) => boolean) | null}
     * 指定座標が描画範囲内であれば true を返す関数。該当タイプがない場合は null。
     */
    getMaskFunc(type) {
      switch (type) {
        case _Painter.TOOLTYPE_RECT:
          return this.rectMask;
        case _Painter.TOOLTYPE_RECTFILL:
          return this.rectFillMask;
        case _Painter.TOOLTYPE_ELLIPSE:
          return this.ellipseMask;
        case _Painter.TOOLTYPE_ELLIPSEFILL:
          return this.ellipseFillMask;
      }
      return null;
    }
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
    doFill(layer, x, y, width, height, type) {
      const ctx = this.canvasCtx[layer];
      const maskFunc = this.getMaskFunc(type);
      const imageData = ctx.getImageData(x, y, width, height);
      const buf8 = new Uint8ClampedArray(imageData.data.buffer);
      var index = 0;
      var r1 = this._currentColor[0];
      var g1 = this._currentColor[1];
      var b1 = this._currentColor[2];
      var a1 = this.getAlpha(_Painter.ALPHATYPE_FILL);
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          if (maskFunc && maskFunc.call(this, i, j, width, height)) {
            if (this._currentMaskType >= _Painter.MASKTYPE_ADD || !this.isMasked(buf8, index)) {
              const r0 = buf8[index + 0];
              const g0 = buf8[index + 1];
              const b0 = buf8[index + 2];
              const a0 = buf8[index + 3] / 255;
              var a = a0 + a1 - a0 * a1;
              if (a > 0) {
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
      imageData.data.set(buf8);
      ctx.putImageData(imageData, x, y);
    }
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns
     */
    rectFillMask(x, y, width, height) {
      return true;
    }
    /**
     * 矩形枠線マスク関数。矩形の外周部のみ描画対象とする。
     * @param {number} x - 相対X座標
     * @param {number} y - 相対Y座標
     * @param {number} width - 矩形幅
     * @param {number} height - 矩形高さ
     * @returns {boolean} 外周の線幅内であれば true
     */
    rectMask(x, y, width, height) {
      var d = this._currentWidth;
      return x < d || x > width - 1 - d || y < d || y > height - 1 - d ? true : false;
    }
    /**
     * 楕円
     * @description 楕円塗り潰しマスク関数。楕円内部を全て描画対象とする。
     * @param {number} x - 相対X座標
     * @param {number} y - 相対Y座標
     * @param {number} width - 矩形幅
     * @param {number} height - 矩形高さ
     * @returns {boolean} 楕円内部の時に true
     */
    ellipseFillMask(x, y, width, height) {
      var cx = (width - 1) / 2;
      var cy = (height - 1) / 2;
      x = (x - cx) / (cx + 1);
      y = (y - cy) / (cy + 1);
      return x * x + y * y < 1 ? true : false;
    }
    /**
     * 線楕円
     * @description 楕円枠線マスク関数。楕円の輪郭部分のみ描画対象とする。
     * @param {number} x - 相対X座標
     * @param {number} y - 相対Y座標
     * @param {number} width - 矩形幅
     * @param {number} height - 矩形高さ
     * @returns {boolean} 輪郭内であれば true
     */
    ellipseMask(x, y, width, height) {
      var d = this._currentWidth;
      var cx = (width - 1) / 2;
      var cy = (height - 1) / 2;
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
    }
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
    getDestCanvasPosition(mouseX, mouseY, isClip, isCenter = false) {
      let mx = Math.floor(mouseX);
      let my = Math.floor(mouseY);
      if (isCenter) {
        mx += 0.499;
        my += 0.499;
      }
      var x = (mx - this.zoomX + this.destCanvas.width * 0.5 / this.zoom) * this.zoom;
      var y = (my - this.zoomY + this.destCanvas.height * 0.5 / this.zoom) * this.zoom;
      if (isClip) {
        x = Math.max(Math.min(x, this.destCanvas.width), 0);
        y = Math.max(Math.min(y, this.destCanvas.height), 0);
      }
      return { x, y };
    }
    /**
     * イベント発生源が描画キャンバス周辺か、またはUI操作領域かを判定する。
     * @param {Element} element - イベントターゲットとなるDOM要素。
     * @returns {boolean} 操作対象のUI（ツール、ボタン、入力欄）の時は true。描画領域（キャンバス）または周囲の余白の時は false。
     * @note
     * イベント伝播時に、UI操作とキャンバス操作を仕分けるための境界判定。
     * #NEO配下のツールバーやボタンを「ウィジェット」としてマークし、描画イベントの伝播を遮断する。
     */
    isWidget(element) {
      if (!element || !(element instanceof Element)) return false;
      const root = element.closest("#NEO");
      if (!root) return false;
      if (element.closest(
        "#neo-tools, .NEO .buttonOn, .NEO .buttonOff, .NEO .inputText"
      )) {
        return true;
      }
      return false;
    }
    /**
     * 要素がメインの描画・操作エリア（#neo-container）内にあるかを判定する。
     * @param {Element} element - 判定対象のDOM要素
     * @returns {boolean} #neo-container配下なら true
     */
    isContainer(element) {
      if (!element || !(element instanceof Element)) return false;
      const root = element.closest("#NEO");
      if (!root) return false;
      if (element.closest("#neo-container")) {
        return true;
      }
      return false;
    }
    /**
     * 実行中のツールを強制終了し、マウスの状態をリセットする。
     * @returns {void}
     */
    cancelTool() {
      if (this.tool) {
        this.isMouseDown = false;
        this.tool.upHandler(this);
      }
    }
    /**
     * 画像ファイルを読み込み、メインレイヤー（canvasCtx[0]）に描画する。
     * @param {string} filename - 画像のパスまたはDataURL
     * @returns {void}
     */
    loadImage(filename) {
      console.log("loadImage " + filename);
      var img = new Image();
      const ref = this;
      img.onload = function() {
        ref.canvasCtx[0].drawImage(img, 0, 0);
        ref.updateDestCanvas(0, 0, ref.canvasWidth, ref.canvasHeight);
      };
      img.src = filename;
    }
    /**
     * アニメーションデータ(PCH)を読み込み、再生を開始する。
     * @param {string} filename - アニメーションデータのURL
     * @returns {void}
     */
    loadAnimation(filename) {
      console.log("loadAnimation " + filename);
      this.busy = true;
      this.busySkipped = Neo.config.neo_animation_skip == "true";
      const ref = this;
      getPCH(filename, function(pch) {
        ref._actionMgr._items = pch.data;
        ref._actionMgr._mark = pch.data.length;
        ref._actionMgr.play();
      });
    }
    /**
     * ブラウザのストレージからレイヤーデータを読み込み、キャンバスを復元する。
     * @param {Function} [callback] - 読み込み完了後に実行するコールバック関数
     * @returns {void}
     */
    loadSession(callback) {
      const ref = this;
      if (Neo.storage) {
        const layerData0 = Neo.storage.getItem("layer0");
        const layerData1 = Neo.storage.getItem("layer1");
        if (!layerData0 || !layerData1) return;
        var img0 = new Image();
        img0.onload = function() {
          var img1 = new Image();
          img1.onload = function() {
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
    }
    /**
     * 現在のキャンバス状態（レイヤー0, 1）をブラウザのストレージに保存する。
     * @returns {void}
     */
    saveSession() {
      if (Neo.storage) {
        Neo.storage.setItem("timestamp", String(Date.now()));
        Neo.storage.setItem("layer0", this.canvas[0].toDataURL("image/png"));
        Neo.storage.setItem("layer1", this.canvas[1].toDataURL("image/png"));
      }
    }
    /**
     * ブラウザのストレージから保存済みのセッションデータを削除する。
     * @returns {void}
     */
    clearSession() {
      if (Neo.storage) {
        Neo.storage.removeItem("timestamp");
        Neo.storage.removeItem("layer0");
        Neo.storage.removeItem("layer1");
      }
    }
    /**
     * RGBの各色成分の値を比較し、小さい順にインデックス（0:R, 1:G, 2:B）を並べ替えて返す。
     * @param {number} r0 - 赤成分
     * @param {number} g0 - 緑成分
     * @param {number} b0 - 青成分
     * @returns {number[]} [最小値のインデックス, 中間値のインデックス, 最大値のインデックス]
     */
    sortColor(r0, g0, b0) {
      var min = r0 < g0 ? r0 < b0 ? 0 : 2 : g0 < b0 ? 1 : 2;
      var max = r0 > g0 ? r0 > b0 ? 0 : 2 : g0 > b0 ? 1 : 2;
      var mid = min + max == 1 ? 2 : min + max == 2 ? 1 : 0;
      return [min, mid, max];
    }
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
     * @returns {void}
     */
    doText(layer, x, y, color, alpha, string, fontSize, fontFamily) {
      if (string.length <= 0) return;
      var offset = parseInt(fontSize, 10);
      var ctx = this.tempCanvasCtx;
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.save();
      ctx.translate(x, y);
      ctx.font = fontSize + " " + fontFamily;
      ctx.fillStyle = "#000000";
      ctx.fillText(string, 0, 0);
      ctx.restore();
      const r = color & 255;
      const g = (color & 65280) >> 8;
      const b = (color & 16711680) >> 16;
      const a = Math.round(alpha * 255);
      const imageData = ctx.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      const buf32 = new Uint32Array(imageData.data.buffer);
      const buf8 = new Uint8ClampedArray(imageData.data.buffer);
      const length = this.canvasWidth * this.canvasHeight;
      let index = 0;
      for (var i = 0; i < length; i++) {
        if (buf8[index + 3] >= 96) {
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
      ctx = this.canvasCtx[layer];
      ctx.globalAlpha = 1;
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
    }
    /**
     * Bzで操作中かどうか
     * @returns {boolean} - Bzで操作中ならtrueが返る
     */
    isUIPaused() {
      if (this.drawType == _Painter.DRAWTYPE_BEZIER) {
        if (this.tool.step && this.tool.step > 0) {
          return true;
        }
      }
      return false;
    }
    /**
     * @returns {number}
     */
    getEmulationMode() {
      return parseFloat(Neo.config.neo_emulation_mode || 2.22);
    }
    /*
      -------------------------------------------------------------------------
      Recorder Test
      -------------------------------------------------------------------------
    */
    /**
     * @returns {void}
     */
    play() {
      if (this._actionMgr) {
        this._actionMgr.clearCanvas();
        this.prevLine = null;
        this._actionMgr._head = 0;
        this._actionMgr._index = 0;
        this._actionMgr._mark = this._actionMgr._items.length;
        this._actionMgr._pause = false;
        this._actionMgr.play();
      }
    }
    /**
     * @returns {void}
     */
    onrewind() {
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
    }
    /**
     * @returns {void}
     */
    onmark() {
      if (Neo.viewerBar) Neo.viewerBar.update();
      if (!this._actionMgr._pause) {
        if (this._actionMgr._head > this._actionMgr._mark) {
          this.onrewind();
        } else {
          this.onplay();
        }
      }
    }
    /**
     * @returns {void}
     */
    onplay() {
      var _a, _b;
      (_a = Neo.viewerPlay) == null ? void 0 : _a.setSelected(true);
      (_b = Neo.viewerStop) == null ? void 0 : _b.setSelected(false);
      this._actionMgr._pause = false;
      this._actionMgr.play();
    }
    /**
     * @returns {void}
     */
    onstop() {
      var _a, _b;
      (_a = Neo.viewerPlay) == null ? void 0 : _a.setSelected(false);
      (_b = Neo.viewerStop) == null ? void 0 : _b.setSelected(true);
      this._actionMgr._pause = true;
    }
    /**
     * @returns {void}
     */
    onspeed() {
      var mgr = this._actionMgr;
      var mode = mgr.speedMode();
      Neo.speed = mgr._speedTable[(mode + 1) % 4];
    }
    /**
     * @param {number[]} item
     */
    setCurrent(item) {
      var color = this._currentColor;
      var mask = this._currentMask;
      var width = this._currentWidth;
      var type = this._currentMaskType;
      item.push(color[0], color[1], color[2], color[3]);
      item.push(mask[0], mask[1], mask[2]);
      item.push(width);
      item.push(type);
    }
    /**
     * @param {number[]} item
     * @returns {void}
     */
    getCurrent(item) {
      this._currentColor = [item[2], item[3], item[4], item[5]];
      this._currentMask = [item[6], item[7], item[8]];
      this._currentWidth = item[9];
      this._currentMaskType = item[10];
    }
    /**
     * @returns {boolean}
     */
    isDirty() {
      return this.dirty;
    }
  };
  __publicField(_Painter, "LINETYPE_NONE", 0);
  __publicField(_Painter, "LINETYPE_PEN", 1);
  __publicField(_Painter, "LINETYPE_ERASER", 2);
  __publicField(_Painter, "LINETYPE_BRUSH", 3);
  __publicField(_Painter, "LINETYPE_TONE", 4);
  __publicField(_Painter, "LINETYPE_DODGE", 5);
  __publicField(_Painter, "LINETYPE_BURN", 6);
  __publicField(_Painter, "LINETYPE_BLUR", 7);
  __publicField(_Painter, "MASKTYPE_NONE", 0);
  __publicField(_Painter, "MASKTYPE_NORMAL", 1);
  __publicField(_Painter, "MASKTYPE_REVERSE", 2);
  __publicField(_Painter, "MASKTYPE_ADD", 3);
  __publicField(_Painter, "MASKTYPE_SUB", 4);
  __publicField(_Painter, "DRAWTYPE_FREEHAND", 0);
  __publicField(_Painter, "DRAWTYPE_LINE", 1);
  __publicField(_Painter, "DRAWTYPE_BEZIER", 2);
  __publicField(_Painter, "ALPHATYPE_NONE", 0);
  __publicField(_Painter, "ALPHATYPE_PEN", 1);
  __publicField(_Painter, "ALPHATYPE_FILL", 2);
  __publicField(_Painter, "ALPHATYPE_BRUSH", 3);
  __publicField(_Painter, "TOOLTYPE_NONE", 0);
  __publicField(_Painter, "TOOLTYPE_PEN", 1);
  __publicField(_Painter, "TOOLTYPE_ERASER", 2);
  __publicField(_Painter, "TOOLTYPE_HAND", 3);
  __publicField(_Painter, "TOOLTYPE_SLIDER", 4);
  __publicField(_Painter, "TOOLTYPE_FILL", 5);
  __publicField(_Painter, "TOOLTYPE_MASK", 6);
  __publicField(_Painter, "TOOLTYPE_ERASEALL", 7);
  __publicField(_Painter, "TOOLTYPE_ERASERECT", 8);
  __publicField(_Painter, "TOOLTYPE_COPY", 9);
  __publicField(_Painter, "TOOLTYPE_PASTE", 10);
  __publicField(_Painter, "TOOLTYPE_MERGE", 11);
  __publicField(_Painter, "TOOLTYPE_FLIP_H", 12);
  __publicField(_Painter, "TOOLTYPE_FLIP_V", 13);
  __publicField(_Painter, "TOOLTYPE_BRUSH", 14);
  __publicField(_Painter, "TOOLTYPE_TEXT", 15);
  __publicField(_Painter, "TOOLTYPE_TONE", 16);
  __publicField(_Painter, "TOOLTYPE_BLUR", 17);
  __publicField(_Painter, "TOOLTYPE_DODGE", 18);
  __publicField(_Painter, "TOOLTYPE_BURN", 19);
  __publicField(_Painter, "TOOLTYPE_RECT", 20);
  __publicField(_Painter, "TOOLTYPE_RECTFILL", 21);
  __publicField(_Painter, "TOOLTYPE_ELLIPSE", 22);
  __publicField(_Painter, "TOOLTYPE_ELLIPSEFILL", 23);
  __publicField(_Painter, "TOOLTYPE_BLURRECT", 24);
  __publicField(_Painter, "TOOLTYPE_TURN", 25);
  var Painter = _Painter;
  var UndoItem = class {
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
  var UndoManager = class {
    /**
     * @param {number} _maxStep - 最大ステップ数。これを超えると古い履歴が削除される。
     */
    constructor(_maxStep) {
      this._maxStep = _maxStep;
      this._undoItems = [];
      this._redoItems = [];
    }
    /**
     * 新しい操作履歴（UndoItem）を登録し、履歴を管理する。
     * @description
     * 1. 新しい状態をスタックに積む。
     * 2. 最大ステップ数を超えた場合、最も古い履歴を削除してメモリを解放する。
     * 3. 新しい操作が行われた場合、それ以降の「やり直し（Redo）」履歴をクリアし、
     * 操作の分岐点を明確にする。
     * @param {UndoItem} undoItem - 保存するキャンバスの状態データ
     * @param {boolean} holdRedo - Redo履歴を保持するかどうか
     * @returns {void}
     */
    pushUndo(undoItem, holdRedo) {
      this._undoItems.push(undoItem);
      if (this._undoItems.length > this._maxStep) {
        this._undoItems.shift();
      }
      if (!holdRedo == true) {
        this._redoItems = [];
      }
    }
    popUndo() {
      return this._undoItems.pop();
    }
    /**
     * やり直し（Redo）の履歴をスタックに追加する。
     * @description
     * Undo操作によってスタックから取り出された状態を Redo 履歴に保存して
     * Undoした状態からRedoできるようにする。
     * @param {UndoItem} undoItem - 保存するキャンバスの状態データ
     */
    pushRedo(undoItem) {
      this._redoItems.push(undoItem);
    }
    popRedo() {
      return this._redoItems.pop();
    }
  };
  Neo.setColor = function(color) {
    Neo.painter.setColor(color);
    var colorTip = (
      /** @type {ColorTip|null} **/
      ColorTip.getCurrent()
    );
    if (colorTip) {
      colorTip.setColor(color);
    }
  };
  window["__neodebug"] = () => {
    var _a;
    console.log({
      tool: Neo.painter.tool,
      isMouseDown: Neo.painter.isMouseDown,
      isMouseDownRight: Neo.painter.isMouseDownRight,
      isSpaceDown: Neo.painter.isSpaceDown,
      isCtrlDown: Neo.painter.isCtrlDown,
      isShiftDown: Neo.painter.isShiftDown,
      isAltDown: Neo.painter.isAltDown,
      isBezierActive: Neo.painter.isBezierActive,
      isCopyActive: Neo.painter.isCopyActive,
      busy: Neo.painter.busy,
      touchlength: Neo.painter.touchlength,
      hasFocus: document.hasFocus(),
      activeElement: (_a = document.activeElement) == null ? void 0 : _a.tagName
    });
  };

  // src/commands.js
  var Commands = class {
    constructor() {
      this.CommandBase = class {
        constructor() {
          this.data = null;
          this.zoom_steps = Neo.config.neo_enable_zoom_out ? [
            0.2,
            0.4,
            0.6,
            0.8,
            1,
            1.5,
            2,
            2.5,
            3,
            4,
            5,
            6,
            7,
            8,
            10,
            11,
            12
          ] : [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];
        }
        execute() {
        }
      };
      this.ZoomPlusCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          const steps = this.zoom_steps;
          let currentIndex = steps.findIndex((s) => s >= this.data.zoom);
          if (currentIndex === -1) currentIndex = steps.length - 1;
          if (steps[currentIndex] === this.data.zoom && currentIndex < steps.length - 1) {
            currentIndex++;
          } else if (steps[currentIndex] > this.data.zoom) {
          } else if (currentIndex < steps.length - 1) {
            currentIndex++;
          }
          if (currentIndex < steps.length) {
            this.data.setZoom(steps[currentIndex]);
          }
          Neo.resizeCanvas();
        }
      };
      this.ZoomMinusCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          const steps = this.zoom_steps;
          let currentIndex = steps.findIndex((s) => s >= this.data.zoom);
          if (currentIndex > 0) {
            if (steps[currentIndex] === this.data.zoom) {
              currentIndex--;
            } else {
              currentIndex = Math.max(0, currentIndex - 1);
            }
            this.data.setZoom(steps[currentIndex]);
          }
          Neo.resizeCanvas();
        }
      };
      this.UndoCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          this.data.cancelCopy();
          this.data.undo();
        }
      };
      this.RedoCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          this.data.redo();
        }
      };
      this.WindowCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          if (Neo.fullScreen) {
            if (confirm(translate("\u30DA\u30FC\u30B8\u30D3\u30E5\u30FC\uFF1F"))) {
              Neo.fullScreen = false;
              updateWindow();
            }
          } else {
            if (confirm(translate("\u30A6\u30A3\u30F3\u30C9\u30A6\u30D3\u30E5\u30FC\uFF1F"))) {
              Neo.fullScreen = true;
              updateWindow();
            }
          }
        }
      };
      this.SubmitCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          var baseURL = location.href.replace(/[^/]*$/, "");
          this.data.submit(baseURL);
        }
      };
      this.CopyrightCommand = class extends this.CommandBase {
        /** @param {Painter} data */
        constructor(data) {
          super();
          this.data = data;
        }
        execute() {
          var url = "http://github.com/funige/neo/";
          if (confirm(
            translate(
              "PaintBBS NEO\u306F\u3001\u304A\u7D75\u304B\u304D\u3057\u3043\u63B2\u793A\u677F PaintBBS (\xA92000-2004 \u3057\u3043\u3061\u3083\u3093) \u3092html5\u5316\u3059\u308B\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u3059\u3002\n\nPaintBBS NEO\u306E\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u3092\u8868\u793A\u3057\u307E\u3059\u304B\uFF1F"
            ) + "\n"
          )) {
            Neo.openURL(url);
          }
        }
      };
    }
  };

  // src/container.js
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
        passive: false
      }
    );
  });
  var extractBootConfig = function(targetName) {
    Neo.params = Neo.params || Neo.param;
    if (Neo.params && typeof Neo.params === "object" && Object.keys(Neo.params).length > 0) {
      const params2 = Neo.params;
      return params2[targetName] ? __spreadValues({}, params2[targetName]) : {};
    }
    const applet = `applet[name="${targetName}"], applet-dummy[name="${targetName}"], .neo-applet-${targetName}`;
    const node = document.querySelector(applet);
    if (!node) return {};
    const config = {};
    const params = node.querySelectorAll("param");
    for (const param of params) {
      const key = param.getAttribute("name");
      const val = param.getAttribute("value");
      if (key) {
        config[key] = fixConfig(String(val));
      }
    }
    return config;
  };
  Neo.init = function() {
    let applets = document.querySelectorAll(
      "applet,applet-dummy,.neo-applet-paintbbs,.neo-applet-pch"
    );
    for (const applet of applets) {
      if (applet instanceof HTMLElement) {
        let name = applet.getAttribute("name");
        if (!name) {
          for (const className of applet.classList) {
            if (className.startsWith("neo-applet-")) {
              name = className.replace("neo-applet-", "");
              break;
            }
          }
        }
        if (name == "paintbbs" || name == "pch") {
          Neo.applet = applet;
          if (name == "paintbbs") {
            initConfig(applet);
            createContainer(applet);
            init2();
          } else {
            Neo.viewer = true;
            initConfig(applet);
            var filename = getFilename();
            getPCH(filename, function(pch) {
              if (pch) {
                Neo.createViewer(applet);
                Neo.config.width = pch.width;
                Neo.config.height = pch.height;
                Neo.initViewer(pch);
              }
            });
          }
          return true;
        }
      }
    }
    return false;
  };
  var init2 = function() {
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
    if (Neo.center && Neo.container && Neo.container.clientWidth && Neo.container.clientWidth >= 400 && Neo.config.neo_disable_neo_center_min_width != "true") {
      Neo.center.style.minWidth = "397px";
    }
    Neo.painter = new Painter();
    Neo.painter.build(Neo.canvas, Neo.config.width, Neo.config.height);
    Neo.container.oncontextmenu = function() {
      return false;
    };
    Neo.isAnimation = Neo.config.thumbnail_type == "animation";
    Neo.storage = localStorage;
    var filename = getFilename();
    var message = !filename || filename.slice(-4).toLowerCase() != ".pch" ? "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F" : "\u63CF\u304D\u304B\u3051\u306E\u753B\u50CF\u304C\u3042\u308A\u307E\u3059\u3002\u52D5\u753B\u306E\u8AAD\u307F\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u3066\u5FA9\u5143\u3057\u307E\u3059\u304B\uFF1F";
    let storageTimestamp = Neo.storage.getItem("timestamp");
    const nowTimestamp = Date.now();
    if (Number.isInteger(Number(storageTimestamp)) && nowTimestamp - Number(storageTimestamp) > 3 * 86400 * 1e3) {
      Neo.painter.clearSession();
      storageTimestamp = null;
    }
    if (storageTimestamp && confirm(translate(message))) {
      setTimeout(function() {
        Neo.painter.loadSession(function() {
          Neo.painter._pushUndo();
          Neo.painter._actionMgr.restore();
          Neo.painter.dirty = false;
        });
      }, 1);
    } else {
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
      "beforeunload",
      //ブラウザを終了した時にも復元データを保存
      function(e) {
        if (!Neo.uploaded && Neo.painter.isDirty()) {
          Neo.painter.saveSession();
        } else if (Neo.uploaded) {
          Neo.painter.clearSession();
        }
      },
      false
    );
    const originalTitle = document.title;
    document.addEventListener("visibilitychange", () => {
      if (Neo.config.neo_visibility_change_title_rewrite === "true") {
        if (document.visibilityState === "visible") {
          document.title = originalTitle;
        } else if (document.visibilityState === "hidden") {
          setTimeout(() => {
            if (document.visibilityState === "hidden" && document.title === originalTitle) {
              document.title = `${originalTitle} *`;
            }
          }, 3e3);
        }
      }
    });
  };
  var initConfig = function(applet) {
    if (applet) {
      var appletWidth = applet.dataset.width || applet.getAttribute("width");
      var appletHeight = applet.dataset.height || applet.getAttribute("height");
      if (appletWidth) Neo.config.applet_width = parseInt(appletWidth);
      if (appletHeight) Neo.config.applet_height = parseInt(appletHeight);
      let targetName;
      if (applet instanceof HTMLElement) {
        targetName = applet.getAttribute("name");
        if (!targetName) {
          for (const className of applet.classList) {
            if (className.startsWith("neo-applet-")) {
              targetName = className.replace("neo-applet-", "");
              break;
            }
          }
        }
      }
      if (!targetName) {
        targetName = "paintbbs";
      }
      const params = extractBootConfig(targetName);
      if (params) {
        for (const key in params) {
          const value = String(params[key]);
          Neo.config[key] = fixConfig(value);
          if (key === "image_width") Neo.config.width = parseInt(value);
          if (key === "image_height") Neo.config.height = parseInt(value);
        }
      }
      var emulationMode = Neo.config.neo_emulation_mode || "2.22_8x";
      Neo.config.neo_alt_translation = emulationMode.slice(-1).match(/x/i);
      if (Neo.viewer && !Neo.config.color_bar) {
        Neo.config.color_bar = "#eeeeff";
      }
      readStyles();
      applyStyle("color_bk", "#ccccff");
      applyStyle("color_bk2", "#bbbbff");
      applyStyle("color_tool_icon", "#e8dfae");
      applyStyle("color_icon", "#ccccff");
      applyStyle("color_iconselect", "#ffaaaa");
      applyStyle("color_text", "#666699");
      applyStyle("color_bar", "#6f6fae");
      applyStyle("tool_color_button", "#e8dfae");
      applyStyle("tool_color_button2", "#f8daaa");
      applyStyle("tool_color_text", "#773333");
      applyStyle("tool_color_bar", "#ddddff");
      applyStyle("tool_color_frame", "#000000");
      if (Neo.viewer) {
        applyStyle("color_back", "#ccccff");
        applyStyle("color_bar_select", "#407675");
      }
      if (!Neo.config.color_frame) Neo.config.color_frame = Neo.config.color_text;
      if (Neo.config.neo_tool_side == "left" || Neo.config.neo_tool_side == "true") {
        Neo.toolSide = true;
      }
    }
    Neo.config.reserves = [
      {
        size: 1,
        color: "#000000",
        alpha: 1,
        tool: Painter.TOOLTYPE_PEN,
        drawType: Painter.DRAWTYPE_FREEHAND
      },
      {
        size: 5,
        color: "#FFFFFF",
        alpha: 1,
        tool: Painter.TOOLTYPE_ERASER,
        drawType: Painter.DRAWTYPE_FREEHAND
      },
      {
        size: 10,
        color: "#FFFFFF",
        alpha: 1,
        tool: Painter.TOOLTYPE_ERASER,
        drawType: Painter.DRAWTYPE_FREEHAND
      }
    ];
    Neo.reservePen = /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
    clone(Neo.config.reserves[0]);
    Neo.reserveEraser = /** @type {{size:number,color:string,alpha:number,tool:number,drawType:number}} */
    clone(Neo.config.reserves[1]);
  };
  var fixConfig = function(value) {
    if (value.match(/^#[0-9a-fA-F]{5}$/)) {
      value = "#0" + value.slice(1);
    }
    if (value.toLocaleLowerCase() === "true" || value.toLocaleLowerCase() === "false") {
      return value.toLocaleLowerCase();
    }
    return value;
  };
  var getStyleSheet = function() {
    var style = document.createElement("style");
    document.head.appendChild(style);
    return style.sheet;
  };
  var initSkin = function() {
    Neo.styleSheet = getStyleSheet();
    var lightBorder = multColor(Neo.config.color_icon, 1.3);
    var darkBorder = multColor(Neo.config.color_icon, 0.7);
    var lightBar = multColor(Neo.config.color_bar, 1.3);
    var darkBar = multColor(Neo.config.color_bar, 0.7);
    var bgImage = Neo.painter ? createBackgroundImage() : "";
    addRule(".NEO #neo-container", "background-image", "url(" + bgImage + ")");
    addRule(".NEO .colorSlider .label", "color", Neo.config.tool_color_text);
    addRule(".NEO .sizeSlider .label", "color", Neo.config.tool_color_text);
    addRule(".NEO .layerControl .label1", "color", Neo.config.tool_color_text);
    addRule(".NEO .layerControl .label0", "color", Neo.config.tool_color_text);
    addRule(".NEO .toolTipOn .label", "color", Neo.config.tool_color_text);
    addRule(".NEO .toolTipOff .label", "color", Neo.config.tool_color_text);
    addRule(".NEO #neo-toolSet", "background-color", Neo.config.color_bk);
    addRule(".NEO #neo-tools", "color", Neo.config.tool_color_text);
    addRule(
      ".NEO .layerControl .bg",
      "border-bottom",
      "1px solid " + Neo.config.tool_color_text
    );
    addRule(".NEO .buttonOn", "color", Neo.config.color_text);
    addRule(".NEO .buttonOff", "color", Neo.config.color_text);
    addRule(".NEO .buttonOff", "background-color", Neo.config.color_icon);
    addRule(".NEO .buttonOff", "border-top", "1px solid ", Neo.config.color_icon);
    addRule(
      ".NEO .buttonOff",
      "border-left",
      "1px solid ",
      Neo.config.color_icon
    );
    addRule(
      ".NEO .buttonOff",
      "box-shadow",
      "0 0 0 1px " + Neo.config.color_icon + ", 0 0 0 2px " + Neo.config.color_frame
    );
    addRule(".NEO .buttonOff:hover", "background-color", Neo.config.color_icon);
    addRule(".NEO .buttonOff:hover", "border-top", "1px solid " + lightBorder);
    addRule(".NEO .buttonOff:hover", "border-left", "1px solid " + lightBorder);
    addRule(
      ".NEO .buttonOff:hover",
      "box-shadow",
      "0 0 0 1px " + Neo.config.color_iconselect + ", 0 0 0 2px " + Neo.config.color_frame
    );
    addRule(
      ".NEO .buttonOff:active, .NEO .buttonOn",
      "background-color",
      darkBorder
    );
    addRule(
      ".NEO .buttonOff:active, .NEO .buttonOn",
      "border-top",
      "1px solid " + darkBorder
    );
    addRule(
      ".NEO .buttonOff:active, .NEO .buttonOn",
      "border-left",
      "1px solid " + darkBorder
    );
    addRule(
      ".NEO .buttonOff:active, .NEO .buttonOn",
      "box-shadow",
      "0 0 0 1px " + Neo.config.color_iconselect + ", 0 0 0 2px " + Neo.config.color_frame
    );
    addRule(".NEO #neo-canvas", "border", "1px solid " + Neo.config.color_frame);
    addRule(
      ".NEO #neo-scrollH, .NEO #neo-scrollV",
      "background-color",
      Neo.config.color_icon
    );
    addRule(
      ".NEO #neo-scrollH, .NEO #neo-scrollV",
      "box-shadow",
      "0 0 0 1px white, 0 0 0 2px " + Neo.config.color_frame
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "background-color",
      Neo.config.color_bar
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "box-shadow",
      "0 0 0 1px " + Neo.config.color_icon
    );
    addRule(
      ".NEO #neo-scrollH div:hover, .NEO #neo-scrollV div:hover",
      "box-shadow",
      "0 0 0 1px " + Neo.config.color_iconselect
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "border-top",
      "1px solid " + lightBar
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "border-left",
      "1px solid " + lightBar
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "border-right",
      "1px solid " + darkBar
    );
    addRule(
      ".NEO #neo-scrollH div, .NEO #neo-scrollV div",
      "border-bottom",
      "1px solid " + darkBar
    );
    addRule(
      ".NEO .toolTipOn",
      "background-color",
      multColor(Neo.config.tool_color_button, 0.7)
    );
    addRule(".NEO .toolTipOff", "background-color", Neo.config.tool_color_button);
    addRule(
      ".NEO .toolTipFixed",
      "background-color",
      Neo.config.tool_color_button2
    );
    addRule(
      ".NEO .colorSlider, .NEO .sizeSlider",
      "background-color",
      Neo.config.tool_color_bar
    );
    addRule(
      ".NEO .reserveControl",
      "background-color",
      Neo.config.tool_color_bar
    );
    addRule(
      ".NEO .reserveControl",
      "background-color",
      Neo.config.tool_color_bar
    );
    addRule(".NEO .layerControl", "background-color", Neo.config.tool_color_bar);
    addRule(
      ".NEO .colorTipOn, .NEO .colorTipOff",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .toolTipOn, .NEO .toolTipOff",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .toolTipFixed",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .colorSlider, .NEO .sizeSlider",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .reserveControl",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .layerControl",
      "box-shadow",
      "0 0 0 1px " + Neo.config.tool_color_frame
    );
    addRule(
      ".NEO .reserveControl .reserve",
      "border",
      "1px solid " + Neo.config.tool_color_frame
    );
    if (navigator.language.indexOf("ja") != 0) {
      var labels = ["Fixed", "On", "Off"];
      for (var i = 0; i < labels.length; i++) {
        var selector = ".NEO .toolTip" + labels[i] + " .label";
        addRule(selector, "letter-spacing", "0px !important");
      }
    }
    Neo.setToolSide(Neo.toolSide);
  };
  var addRule = function(selector, styleName, value, sheet = null) {
    if (!sheet) {
      sheet = Neo.styleSheet;
    }
    if (!sheet) {
      throw new Error("addRule: Stylesheet is undefined.");
    }
    try {
      if (sheet == null ? void 0 : sheet.insertRule) {
        sheet.insertRule(
          selector + " { " + styleName + ": " + value + "; }",
          sheet.cssRules.length
        );
      }
    } catch (e) {
      console.error("addRule: Failed to insert rule for '" + selector + "'.", e);
    }
  };
  var readStyles = function() {
    Neo.rules = {};
    for (var i = 0; i < document.styleSheets.length; i++) {
      readStyle(document.styleSheets[i]);
    }
  };
  var readStyle = function(sheet) {
    try {
      var rules = sheet.cssRules;
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule instanceof CSSImportRule && rule.styleSheet) {
          readStyle(rule.styleSheet);
          continue;
        }
        if (rule instanceof CSSStyleRule) {
          var selector = rule.selectorText;
          if (selector) {
            selector = selector.replace(/^(.NEO\s+)?\./, "");
            var css = rule.cssText || rule.style.cssText;
            var result = css.match(/color:\s*(.*)\s*;/);
            if (result) {
              var hex = colorNameToHex(result[1]);
              if (hex) {
                Neo.rules[selector] = hex;
              }
            }
          }
        }
      }
    } catch (e) {
    }
  };
  var applyStyle = function(name, defaultColor) {
    if (Neo.config[name] == void 0) {
      Neo.config[name] = Neo.rules[name] || defaultColor;
    }
  };
  var createBackgroundImage = function() {
    var c1 = Neo.painter.getColor(Neo.config.color_bk) | 4278190080;
    var c2 = Neo.painter.getColor(Neo.config.color_bk2) | 4278190080;
    var bgCanvas = document.createElement("canvas");
    bgCanvas.width = 16;
    bgCanvas.height = 16;
    var ctx = bgCanvas.getContext("2d", {
      willReadFrequently: true
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
  var multColor = function(c, scale) {
    const rNum = Math.round(parseInt(c.slice(1, 3), 16) * scale);
    const gNum = Math.round(parseInt(c.slice(3, 5), 16) * scale);
    const bNum = Math.round(parseInt(c.slice(5, 7), 16) * scale);
    const r = ("0" + Math.min(Math.max(rNum, 0), 255).toString(16)).slice(-2);
    const g = ("0" + Math.min(Math.max(gNum, 0), 255).toString(16)).slice(-2);
    const b = ("0" + Math.min(Math.max(bNum, 0), 255).toString(16)).slice(-2);
    return "#" + r + g + b;
  };
  var colorNameToHex = function(name) {
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
      yellowgreen: "#9acd32"
    };
    const rgb = name.toLowerCase().match(/rgb\((.*),(.*),(.*)\)/);
    if (rgb) {
      const r = ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
      const g = ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
      const b = ("0" + parseInt(rgb[3]).toString(16)).slice(-2);
      return "#" + r + g + b;
    }
    if (typeof colors[name.toLowerCase()] != "undefined") {
      return colors[name.toLowerCase()];
    }
    return false;
  };
  var initComponents = function() {
    const copyright = document.getElementById("neo-copyright");
    if (copyright) copyright.innerHTML += "v" + Neo.version;
    document.addEventListener(
      "mouseup",
      function(e) {
        if (Neo.painter && e.target instanceof Element && !Neo.painter.isContainer(e.target)) {
          Neo.painter.cancelTool();
        }
      },
      false
    );
    showWarning();
    if (Neo.styleSheet) {
      addRule("*", "user-select", "none");
      addRule("*", "-webkit-user-select", "none");
      addRule("*", "-ms-user-select", "none");
    }
  };
  var initButtons = function() {
    const commands = new Commands();
    const neo_undo = new Button().init("neo-undo");
    if (neo_undo) {
      neo_undo.onmouseup = function() {
        const UndoCommand = new commands.UndoCommand(Neo.painter);
        UndoCommand.execute();
      };
    }
    const neo_redo = new Button().init("neo-redo");
    if (neo_redo) {
      neo_redo.onmouseup = function() {
        const RedoCommand = new commands.RedoCommand(Neo.painter);
        RedoCommand.execute();
      };
    }
    const neo_window = new Button().init("neo-window");
    if (neo_window) {
      neo_window.onmouseup = function() {
        const WindowCommand = new commands.WindowCommand(Neo.painter);
        WindowCommand.execute();
      };
    }
    const neo_copyright = new Button().init("neo-copyright");
    if (neo_copyright) {
      neo_copyright.onmouseup = function() {
        const CopyrightCommand = new commands.CopyrightCommand(Neo.painter);
        CopyrightCommand.execute();
      };
    }
    const neo_zoomPlus = new Button().init("neo-zoomPlus");
    if (neo_zoomPlus) {
      neo_zoomPlus.onmouseup = function() {
        const ZoomPlusCommand = new commands.ZoomPlusCommand(Neo.painter);
        ZoomPlusCommand.execute();
      };
    }
    const neo_zoomMinus = new Button().init("neo-zoomMinus");
    if (neo_zoomMinus) {
      neo_zoomMinus.onmouseup = function() {
        const ZoomMinusCommand = new commands.ZoomMinusCommand(Neo.painter);
        ZoomMinusCommand.execute();
      };
    }
    Neo.submitButton = new Button().init("neo-submit");
    if (!Neo.submitButton) {
      console.error("initButtons: SubmitButton not found");
      return;
    }
    Neo.submitButton.onmouseup = function() {
      var _a;
      (_a = Neo.submitButton) == null ? void 0 : _a.disable(5e3);
      const SubmitCommand = new commands.SubmitCommand(Neo.painter);
      SubmitCommand.execute();
    };
    Neo.fillButton = new FillButton().init("neo-fill");
    Neo.rightButton = new RightButton().init("neo-right");
    if (!Neo.rightButton) {
      console.error("initButtons: RightButton not found");
      return;
    }
    if (isMobile() || Neo.config.neo_show_right_button == "true") {
      if (Neo.rightButton.element) {
        Neo.rightButton.element.style.display = "block";
      }
    }
    Neo.penTip = new PenTip().init("neo-pen");
    Neo.pen2Tip = new Pen2Tip().init("neo-pen2");
    Neo.effectTip = new EffectTip().init("neo-effect");
    Neo.effect2Tip = new Effect2Tip().init("neo-effect2");
    Neo.eraserTip = new EraserTip().init("neo-eraser");
    Neo.drawTip = new DrawTip().init("neo-draw");
    Neo.maskTip = new MaskTip().init("neo-mask");
    Neo.toolButtons = Neo.fillButton && Neo.penTip && Neo.pen2Tip && Neo.effectTip && Neo.effect2Tip && Neo.drawTip && Neo.eraserTip ? [
      Neo.fillButton,
      Neo.penTip,
      Neo.pen2Tip,
      Neo.effectTip,
      Neo.effect2Tip,
      Neo.drawTip,
      Neo.eraserTip
    ] : [];
    for (var i = 1; i <= 14; i++) {
      new ColorTip().init("neo-color" + i, { index: i });
    }
    Neo.sliders[Neo.SLIDERTYPE_RED] = new ColorSlider().init("neo-sliderRed", {
      type: Neo.SLIDERTYPE_RED
    });
    Neo.sliders[Neo.SLIDERTYPE_GREEN] = new ColorSlider().init(
      "neo-sliderGreen",
      { type: Neo.SLIDERTYPE_GREEN }
    );
    Neo.sliders[Neo.SLIDERTYPE_BLUE] = new ColorSlider().init("neo-sliderBlue", {
      type: Neo.SLIDERTYPE_BLUE
    });
    Neo.sliders[Neo.SLIDERTYPE_ALPHA] = new ColorSlider().init(
      "neo-sliderAlpha",
      { type: Neo.SLIDERTYPE_ALPHA }
    );
    Neo.sizeslider = new SizeSlider();
    Neo.sliders[Neo.SLIDERTYPE_SIZE] = Neo.sizeslider.init("neo-sliderSize", {
      type: Neo.SLIDERTYPE_SIZE
    });
    for (var i = 1; i <= 3; i++) {
      new ReserveControl().init("neo-reserve" + i, { index: i });
    }
    new LayerControl().init("neo-layerControl");
    new ScrollBarButton().init("neo-scrollH");
    new ScrollBarButton().init("neo-scrollV");
  };
  Neo.start = function(isApp = false) {
    if (Neo.viewer) return;
    initSkin();
    initComponents();
    initButtons();
    Neo.isApp = isApp;
    if (Neo.applet) {
      var name = Neo.applet.getAttribute("name") || "paintbbs";
      Neo.applet.outerHTML = "";
      document[name] = Neo;
      Neo.resizeCanvas();
      if (!Neo.container) {
        console.error("start: Container element not found");
        return;
      }
      Neo.container.style.visibility = "visible";
      if (Neo.isApp) {
        var ipc = __require("electron").ipcRenderer;
        ipc.sendToHost("neo-status", "ok");
      } else {
        if (document["paintBBSCallback"]) {
          document["paintBBSCallback"]("start");
        }
      }
    }
  };
  var isMobile = function() {
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) return true;
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true;
    return false;
  };
  var showWarning = function() {
    const futaba = location.hostname.match(/^(?:.+\.)?2chan\.net$/i);
    const samplebbs = location.hostname.match(/^(?:.+\.)?neo\.websozai\.jp$/i);
    var edgeMatch = navigator.userAgent.match(/Edge\/(\d+)/i);
    var edgeVersion = 0;
    if (edgeMatch && edgeMatch.length > 1) {
      edgeVersion = parseInt(edgeMatch[1], 10);
    }
    var str = "";
    if (futaba || samplebbs) {
      if (edgeVersion && edgeVersion < 15) {
        str = translate("\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F<br>\u6295\u7A3F\u306B\u5931\u6557\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059<br>");
      }
    }
    if (Neo.config.neo_warning) {
      str += Neo.config.neo_warning;
    }
    var warning = document.getElementById("neoWarning");
    if (!warning) {
      return;
    }
    warning.innerHTML = str;
    setTimeout(function() {
      if (!warning) {
        return;
      }
      warning.style.opacity = "0";
    }, 15e3);
  };
  var updateUI = function() {
    const current = Neo.painter.tool.getToolButton();
    for (let i = 0; i < Neo.toolButtons.length; i++) {
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
    updateUIColor(true, false);
  };
  var updateUIColor = function(updateSlider, updateColorTip) {
    for (let i = 0; i < Neo.toolButtons.length; i++) {
      const toolTip = Neo.toolButtons[i];
      toolTip.update();
    }
    if (updateSlider) {
      for (let i = 0; i < Neo.sliders.length; i++) {
        const slider = Neo.sliders[i];
        slider.update();
      }
    }
    if (updateColorTip) {
      const colorTip = ColorTip.getCurrent();
      if (colorTip) {
        colorTip.setColor(Neo.painter.foregroundColor);
      }
    }
  };
  var updateWindow = function() {
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
    document.dispatchEvent(
      new CustomEvent("neo:fullscreenchange", {
        detail: { fullscreen: Neo.fullScreen }
      })
    );
  };
  Neo.resizeCanvas = function(options = {}) {
    var _a;
    const updateDestCanvas = (_a = options.updateDestCanvas) != null ? _a : true;
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
    if (Neo.viewer) {
      width = canvasWidth;
      height = canvasHeight;
    }
    width = Math.floor(width / 2) * 2;
    height = Math.floor(height / 2) * 2;
    Neo.painter.destWidth = width;
    Neo.painter.destHeight = height;
    const destCanvas = Neo.painter.destCanvas;
    destCanvas.width = width;
    destCanvas.height = height;
    const destctx = destCanvas.getContext("2d", {
      willReadFrequently: true
    });
    if (!destctx) {
      console.error("resizeCanvas: Failed to get 2d context");
      return;
    }
    Neo.painter.destCanvasCtx = destctx;
    const ctx = Neo.painter.destCanvasCtx;
    if (Neo.painter.zoom < 1) {
      ctx.imageSmoothingEnabled = true;
      destCanvas.style.imageRendering = "smooth";
      if (Neo.painter.zoom < 0.5 && "imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
    } else {
      ctx.imageSmoothingEnabled = false;
      destCanvas.style.imageRendering = Neo.viewer ? "auto" : "pixelated";
    }
    destCanvas.style.touchAction = "none";
    destCanvas.style.pointerEvents = "auto";
    if (Neo.canvas) {
      Neo.canvas.style.touchAction = "none";
      Neo.canvas.style.pointerEvents = "auto";
      Neo.canvas.style.width = width + "px";
      Neo.canvas.style.height = height + "px";
    }
    const tools = Neo.tools || null;
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
        Neo.toolsWrapper.style.transform = "translate(0, " + top + "px) scale(1," + s + ")";
      } else {
        Neo.toolsWrapper.style.transform = "";
      }
    }
    Neo.painter.setZoom(Neo.painter.zoom);
    if (updateDestCanvas) {
      Neo.painter.updateDestCanvas(0, 0, canvasWidth, canvasHeight, false);
    }
  };
  var clone = function(src) {
    const dst = {};
    for (const k in src) {
      dst[k] = src[k];
    }
    return dst;
  };
  var getSizeString = function(len) {
    var result = String(len);
    while (result.length < 8) {
      result = "0" + result;
    }
    return result;
  };
  Neo.openURL = function(url) {
    if (Neo.isApp) {
      __require("electron").shell.openExternal(url);
    } else {
      window.open(url, "_blank");
    }
  };
  var getAbsoluteURL = function(baseURL, url) {
    if (url && (url.indexOf("://") > 0 || url.indexOf("//") === 0)) {
      return url;
    } else {
      return baseURL + url;
    }
  };
  var submit = function(baseURL, blob, thumbnail, thumbnail2) {
    var _a;
    let url = getAbsoluteURL(baseURL, Neo.config.url_save);
    var headerString = Neo.str_header || "";
    if (document["paintBBSCallback"]) {
      var result = document["paintBBSCallback"]("check");
      if (result == 0 || result == "false") {
        return;
      }
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
    if (Neo.config.neo_emulate_security_error == "true") {
      var securityError = false;
      if (Neo.config.security_click) {
        if (count - parseInt(Neo.config.security_click || 0) < 0) {
          securityError = true;
        }
      }
      if (Neo.config.security_timer) {
        if (timer - parseInt(Neo.config.security_timer || 0) * 1e3 < 0) {
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
      if (!isNaN(Neo.config.animation_max) && Number(Neo.config.animation_max)) {
        const maxSize = Number(Neo.config.animation_max) * 1024;
        if (maxSize < thumbnailSize) {
          thumbnail2 = null;
        }
      }
    }
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
        if (isNaN(Neo.config.neo_max_pch) || //0,-1の場合は無制限
        Number(Neo.config.neo_max_pch) <= 0 || Number(Neo.config.neo_max_pch) * 1024 * 1024 > headerString.length + blob.size + thumbnail_size + thumbnail2.size) {
          formData.append("pch", thumbnail2, "blob");
        } else {
          thumbnail2 = null;
        }
      }
    }
    var header = new Blob([headerString]);
    var headerLength = getSizeString(header.size);
    var imgLength = getSizeString(blob.size);
    var array = [
      "P",
      // PaintBBS
      headerLength,
      header,
      imgLength,
      "\r\n",
      blob
    ];
    if (thumbnail) {
      var thumbnailLength = getSizeString(thumbnail.size);
      array.push(thumbnailLength, thumbnail);
    }
    if (thumbnail2) {
      var thumbnail2Length = getSizeString(thumbnail2.size);
      array.push(thumbnail2Length, thumbnail2);
    }
    const futaba = location.hostname.match(/^(?:.+\.)?2chan\.net$/i);
    var subtype = futaba ? "octet-binary" : "octet-stream";
    var body = new Blob(array, { type: "application/" + subtype });
    const postData = (path, data2) => {
      var errorMessage = path + "\n";
      const requestOptions = {
        method: "post",
        body: data2
      };
      if (!futaba) {
        requestOptions.mode = "same-origin";
        requestOptions.headers = {
          "X-Requested-With": "PaintBBS"
        };
      }
      fetch(path, requestOptions).then((response) => {
        var _a2;
        if (response.ok) {
          response.text().then((text) => {
            var _a3, _b;
            console.log(text);
            if (text.match(/^error\n/m)) {
              (_a3 = Neo.submitButton) == null ? void 0 : _a3.enable();
              return alert(text.replace(/^error\n/m, ""));
            }
            if (Neo.config.neo_validate_exact_ok_text_in_response === "true") {
              if (text !== "ok") {
                (_b = Neo.submitButton) == null ? void 0 : _b.enable();
                return alert(
                  errorMessage + translate(
                    "\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002"
                  )
                );
              }
            }
            var exitURL = getAbsoluteURL(baseURL, Neo.config.url_exit);
            var responseURL = text.replace(/&amp;/g, "&");
            if (responseURL.match(/painttmp=/)) {
              exitURL = responseURL;
            }
            if (responseURL.match(/^URL:/)) {
              exitURL = responseURL.replace(/^URL:/, "");
            }
            Neo.uploaded = true;
            if (typeof Neo.handleExit === "function") {
              return Neo.handleExit();
            }
            return location.href = exitURL;
          });
        } else {
          (_a2 = Neo.submitButton) == null ? void 0 : _a2.enable();
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
            `${translate("HTTP\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9")} ${response_status} : ${httpErrorMessag}
${errorMessage}${translate("\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002")}`
          );
        }
      }).catch((error) => {
        var _a2;
        (_a2 = Neo.submitButton) == null ? void 0 : _a2.enable();
        return alert(
          errorMessage + translate("\u6295\u7A3F\u306B\u5931\u6557\u3002\u6642\u9593\u3092\u7F6E\u3044\u3066\u518D\u5EA6\u6295\u7A3F\u3057\u3066\u307F\u3066\u304F\u3060\u3055\u3044\u3002")
        );
      });
    };
    if (Neo.config.neo_confirm_layer_info_notsaved && !thumbnail2) {
      const isConfirmed = window.confirm(
        translate("\u30EC\u30A4\u30E4\u30FC\u60C5\u5831\u306F\u4FDD\u5B58\u3055\u308C\u307E\u305B\u3093\u3002\n\u7D9A\u884C\u3057\u3066\u3088\u308D\u3057\u3044\u3067\u3059\u304B?")
      );
      if (!isConfirmed) {
        (_a = Neo.submitButton) == null ? void 0 : _a.enable();
        console.log("\u4E2D\u6B62\u3057\u307E\u3057\u305F\u3002");
        return;
      }
    }
    const data = Neo.config.neo_send_with_formdata === "true" ? formData : body;
    if (data) {
      postData(url, data);
    } else {
      console.error("failed to post data");
    }
  };
  Neo.getColors = function() {
    var array = [];
    for (var i = 0; i < 14; i++) {
      array.push(Neo.colorTips[i].color);
    }
    return array.join("\n");
  };
  Neo.setColors = function(colors) {
    var array = colors.split("\n");
    for (var i = 0; i < 14; i++) {
      var color = array[i];
      Neo.config.colors[i] = color;
      Neo.colorTips[i].setColor(color);
    }
  };
  Neo.pExit = function() {
    const commands = new Commands();
    new commands.SubmitCommand(Neo.painter).execute();
  };
  Neo.str_header = "";
  var createContainer = function(applet) {
    var neo = document.createElement("div");
    neo.className = "NEO";
    neo.id = "NEO";
    const html = '<div id="neo-pageView" style="margin:auto; width:450px; height:470px;"><div id="neo-container" style="visibility:hidden;" class="o"><div id="neo-center" class="o"><div id="neo-painterContainer" class="o"><div id="neo-painterWrapper" class="o"><div id="neo-upper" class="o"><div id="neo-redo">[\u3084\u308A\u76F4\u3057]</div> <div id="neo-undo">[\u5143\u306B\u623B\u3059]</div> <div id="neo-fill">[\u5857\u308A\u6F70\u3057]</div> <div id="neo-right" style="display:none;">[\u53F3]</div> </div><div id="neo-painter"><div id="neo-canvas"><div id="neo-scrollH"></div><div id="neo-scrollV"></div><div id="neo-zoomPlusWrapper"><div id="neo-zoomPlus">+</div></div><div id="neo-zoomMinusWrapper"><div id="neo-zoomMinus">-</div></div><div id="neoWarning"></div></div></div><div id="neo-lower" class="o"></div></div><div id="neo-toolsWrapper"><div id="neo-tools"><div id="neo-toolSet"><div id="neo-pen"></div><div id="neo-pen2"></div><div id="neo-effect"></div><div id="neo-effect2"></div><div id="neo-eraser"></div><div id="neo-draw"></div><div id="neo-mask"></div><div class="colorTips"><div id="neo-color2"></div><div id="neo-color1"></div><br><div id="neo-color4"></div><div id="neo-color3"></div><br><div id="neo-color6"></div><div id="neo-color5"></div><br><div id="neo-color8"></div><div id="neo-color7"></div><br><div id="neo-color10"></div><div id="neo-color9"></div><br><div id="neo-color12"></div><div id="neo-color11"></div><br><div id="neo-color14"></div><div id="neo-color13"></div></div><div id="neo-sliderRed"></div><div id="neo-sliderGreen"></div><div id="neo-sliderBlue"></div><div id="neo-sliderAlpha"></div><div id="neo-sliderSize"></div><div class="reserveControl" style="margin-top:4px;"><div id="neo-reserve1"></div><div id="neo-reserve2"></div><div id="neo-reserve3"></div></div><div id="neo-layerControl" style="margin-top:6px;"></div></div></div></div></div></div><div id="neo-headerButtons"><div id="neo-window">[\u7A93]</div></div><div id="neo-footerButtons"><div id="neo-submit">[\u6295\u7A3F]</div> <div id="neo-copyright">[(C)\u3057\u3043\u3061\u3083\u3093 PaintBBS NEO]</div> </div></div></div><div id="neo-windowView" style="display: none;"></div>';
    neo.innerHTML = html.replace(/\[(.*?)\]/g, function(match, str) {
      return translate(str);
    });
    const parent = applet.parentNode;
    if (!parent) {
      console.error("Failed to create container.");
      return;
    }
    parent.appendChild(neo);
    parent.insertBefore(neo, applet);
    setTimeout(function() {
      const tmp = document.querySelectorAll(".NEO");
      if (tmp.length > 1) {
        for (var i = 1; i < tmp.length; i++) {
          tmp[i].style.display = "none";
        }
      }
    }, 0);
  };
  var tintImage = function(ctx, color) {
    const c = Neo.painter.getColor(color) & 16777215;
    var imageData = ctx.getImageData(0, 0, 46, 18);
    var buf32 = new Uint32Array(imageData.data.buffer);
    var buf8 = new Uint8ClampedArray(imageData.data.buffer);
    for (var i = 0; i < buf32.length; i++) {
      var a = buf32[i] & 4278190080;
      if (a) {
        buf32[i] = buf32[i] & a | c;
      }
    }
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
  };
  Neo.setToolSide = function(htmlConfiguredSide) {
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
      addRule(".NEO #neo-toolsWrapper", "right", "-3px");
      addRule(".NEO #neo-toolsWrapper", "left", "auto");
      addRule(".NEO #neo-painterWrapper", "padding", "0 55px 0 0 !important");
      addRule(".NEO #neo-upper", "padding-right", "75px !important");
    } else {
      addRule(".NEO #neo-toolsWrapper", "right", "auto");
      addRule(".NEO #neo-toolsWrapper", "left", "-1px");
      addRule(".NEO #neo-painterWrapper", "padding", "0 0 0 55px !important");
      addRule(".NEO #neo-upper", "padding-right", "20px !important");
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    let elementNeo_touchMoveListenerAdded = false;
    const isPinchZooming = function() {
      if ("visualViewport" in window && window.visualViewport) {
        return window.visualViewport.scale > 1;
      } else {
        return document.documentElement.clientWidth > window.innerWidth;
      }
    };
    const touch_move_grid_control = function(e) {
      if (Neo.config.neo_disable_grid_touch_move) {
        let screenwidth = Number(screen.width);
        if (e.touches.length === 1 && (screenwidth - Neo.config.applet_width > 100 || Neo.fullScreen)) {
          if (typeof e.cancelable !== "boolean" || e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };
    const elementNeo = document.getElementById("NEO");
    const add_touch_move_grid_control = function() {
      if (elementNeo && Neo.config.neo_disable_grid_touch_move) {
        if (!elementNeo_touchMoveListenerAdded) {
          elementNeo == null ? void 0 : elementNeo.addEventListener("touchmove", touch_move_grid_control, {
            passive: false
          });
          elementNeo_touchMoveListenerAdded = true;
        }
      }
    };
    elementNeo == null ? void 0 : elementNeo.addEventListener("touchmove", function(e) {
      if (elementNeo && Neo.config.neo_disable_grid_touch_move) {
        add_touch_move_grid_control();
        if (isPinchZooming()) {
          elementNeo.removeEventListener("touchmove", touch_move_grid_control);
          elementNeo_touchMoveListenerAdded = false;
        }
      }
    });
    add_touch_move_grid_control();
  });
  Neo.setStabilizeLevel = function(htmlConfig) {
    let level = parseInt(String(htmlConfig));
    if (isNaN(level) || level < 0) {
      level = 0;
    } else if (level > 5) {
      level = 5;
    }
    Neo.stabilize_level = level;
  };
  Neo.setStabilizLevel = Neo.setStabilizeLevel;

  // src/main.js
  window.Neo = Neo;
})();
