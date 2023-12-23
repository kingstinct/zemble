// @bun
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = (id) => {
  return import.meta.require(id);
};

// /Users/robertherber/code/zemble/node_modules/dotenv/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "dotenv",
    version: "16.3.1",
    description: "Loads environment variables from .env file",
    main: "lib/main.js",
    types: "lib/main.d.ts",
    exports: {
      ".": {
        types: "./lib/main.d.ts",
        require: "./lib/main.js",
        default: "./lib/main.js"
      },
      "./config": "./config.js",
      "./config.js": "./config.js",
      "./lib/env-options": "./lib/env-options.js",
      "./lib/env-options.js": "./lib/env-options.js",
      "./lib/cli-options": "./lib/cli-options.js",
      "./lib/cli-options.js": "./lib/cli-options.js",
      "./package.json": "./package.json"
    },
    scripts: {
      "dts-check": "tsc --project tests/types/tsconfig.json",
      lint: "standard",
      "lint-readme": "standard-markdown",
      pretest: "npm run lint && npm run dts-check",
      test: "tap tests/*.js --100 -Rspec",
      prerelease: "npm test",
      release: "standard-version"
    },
    repository: {
      type: "git",
      url: "git://github.com/motdotla/dotenv.git"
    },
    funding: "https://github.com/motdotla/dotenv?sponsor=1",
    keywords: [
      "dotenv",
      "env",
      ".env",
      "environment",
      "variables",
      "config",
      "settings"
    ],
    readmeFilename: "README.md",
    license: "BSD-2-Clause",
    devDependencies: {
      "@definitelytyped/dtslint": "^0.0.133",
      "@types/node": "^18.11.3",
      decache: "^4.6.1",
      sinon: "^14.0.1",
      standard: "^17.0.0",
      "standard-markdown": "^7.1.0",
      "standard-version": "^9.5.0",
      tap: "^16.3.0",
      tar: "^6.1.11",
      typescript: "^4.8.4"
    },
    engines: {
      node: ">=12"
    },
    browser: {
      fs: false
    }
  };
});

// /Users/robertherber/code/zemble/node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module) => {
  var parse = function(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, "\n");
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, "\n");
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  };
  var _parseVault = function(options) {
    const vaultPath = _vaultPath(options);
    const result = DotenvModule.configDotenv({ path: vaultPath });
    if (!result.parsed) {
      throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  };
  var _log = function(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`);
  };
  var _warn = function(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`);
  };
  var _debug = function(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  };
  var _dotenvKey = function(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  };
  var _instructions = function(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      throw new Error("INVALID_DOTENV_KEY: Missing key part");
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      throw new Error("INVALID_DOTENV_KEY: Missing environment part");
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
    }
    return { ciphertext, key };
  };
  var _vaultPath = function(options) {
    let dotenvPath = path.resolve(process.cwd(), ".env");
    if (options && options.path && options.path.length > 0) {
      dotenvPath = options.path;
    }
    return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
  };
  var _resolveHome = function(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  };
  var _configVault = function(options) {
    _log("Loading env from encrypted .env.vault");
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  };
  var configDotenv = function(options) {
    let dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    const debug = Boolean(options && options.debug);
    if (options) {
      if (options.path != null) {
        dotenvPath = _resolveHome(options.path);
      }
      if (options.encoding != null) {
        encoding = options.encoding;
      }
    }
    try {
      const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    } catch (e) {
      if (debug) {
        _debug(`Failed to load ${dotenvPath} ${e.message}`);
      }
      return { error: e };
    }
  };
  var config = function(options) {
    const vaultPath = _vaultPath(options);
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    if (!fs.existsSync(vaultPath)) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  };
  var decrypt = function(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.slice(0, 12);
    const authTag = ciphertext.slice(-16);
    ciphertext = ciphertext.slice(12, -16);
    try {
      const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
        throw new Error(msg);
      } else if (decryptionFailed) {
        const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
        throw new Error(msg);
      } else {
        console.error("Error: ", error.code);
        console.error("Error: ", error.message);
        throw error;
      }
    }
  };
  var populate = function(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (typeof parsed !== "object") {
      throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
      }
    }
  };
  var fs = import.meta.require("fs");
  var path = import.meta.require("path");
  var os = import.meta.require("os");
  var crypto2 = import.meta.require("crypto");
  var packageJson = require_package();
  var version = packageJson.version;
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  exports.configDotenv = DotenvModule.configDotenv;
  exports._configVault = DotenvModule._configVault;
  exports._parseVault = DotenvModule._parseVault;
  exports.config = DotenvModule.config;
  exports.decrypt = DotenvModule.decrypt;
  exports.parse = DotenvModule.parse;
  exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});
// /Users/robertherber/code/zemble/packages/core/Plugin.ts
var import_dotenv = __toESM(require_main(), 1);

// /Users/robertherber/code/zemble/node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (path) => {
  const groups = [];
  for (let i = 0;; ) {
    let replaced = false;
    path = path.replace(/\{[^}]+\}/g, (m) => {
      const mark = `@\\${i}`;
      groups[i] = [mark, m];
      i++;
      replaced = true;
      return mark;
    });
    if (!replaced) {
      break;
    }
  }
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].indexOf(mark) !== -1) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var getPath = (request) => {
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : "";
};
var getQueryStrings = (url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path) => {
  const match = path.match(/^(.+|)(\/\:[^\/]+)\?$/);
  if (!match)
    return null;
  const base = match[1];
  const optional = base + match[2];
  return [base === "" ? "/" : base.replace(/\/$/, ""), optional];
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      (results[name] ?? (results[name] = [])).push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// /Users/robertherber/code/zemble/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1)
      return parsedCookie;
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName))
      return parsedCookie;
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"'))
      cookieValue = cookieValue.slice(1, -1);
    if (validCookieValueRegEx.test(cookieValue))
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    return parsedCookie;
  }, {});
};
var _serialize = (name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain) {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite}`;
  }
  if (opt.partitioned) {
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name, value, opt = {}) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/utils/html.js
var resolveStream = (str, buffer) => {
  if (!str.callbacks?.length) {
    return Promise.resolve(str);
  }
  const callbacks = str.callbacks;
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  return Promise.all(callbacks.map((c) => c({ buffer }))).then((res) => Promise.all(res.map((str2) => resolveStream(str2, buffer))).then(() => buffer[0]));
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/utils/stream.js
var StreamingApi = class {
  constructor(writable) {
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder;
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch (e) {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch (e) {
    }
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/context.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var _status;
var _executionCtx;
var _headers;
var _preparedHeaders;
var _res;
var _isFresh;
var Context = class {
  constructor(req, options) {
    this.env = {};
    this._var = {};
    this.finalized = false;
    this.error = undefined;
    __privateAdd(this, _status, 200);
    __privateAdd(this, _executionCtx, undefined);
    __privateAdd(this, _headers, undefined);
    __privateAdd(this, _preparedHeaders, undefined);
    __privateAdd(this, _res, undefined);
    __privateAdd(this, _isFresh, true);
    this.renderer = (content) => this.html(content);
    this.notFoundHandler = () => new Response;
    this.render = (...args) => this.renderer(...args);
    this.setRenderer = (renderer) => {
      this.renderer = renderer;
    };
    this.header = (name, value, options2) => {
      if (value === undefined) {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).delete(name);
        } else if (__privateGet(this, _preparedHeaders)) {
          delete __privateGet(this, _preparedHeaders)[name.toLocaleLowerCase()];
        }
        if (this.finalized) {
          this.res.headers.delete(name);
        }
        return;
      }
      if (options2?.append) {
        if (!__privateGet(this, _headers)) {
          __privateSet(this, _isFresh, false);
          __privateSet(this, _headers, new Headers(__privateGet(this, _preparedHeaders)));
          __privateSet(this, _preparedHeaders, {});
        }
        __privateGet(this, _headers).append(name, value);
      } else {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).set(name, value);
        } else {
          __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
          __privateGet(this, _preparedHeaders)[name.toLowerCase()] = value;
        }
      }
      if (this.finalized) {
        if (options2?.append) {
          this.res.headers.append(name, value);
        } else {
          this.res.headers.set(name, value);
        }
      }
    };
    this.status = (status) => {
      __privateSet(this, _isFresh, false);
      __privateSet(this, _status, status);
    };
    this.set = (key, value) => {
      this._var ?? (this._var = {});
      this._var[key] = value;
    };
    this.get = (key) => {
      return this._var ? this._var[key] : undefined;
    };
    this.newResponse = (data, arg, headers) => {
      if (__privateGet(this, _isFresh) && !headers && !arg && __privateGet(this, _status) === 200) {
        return new Response(data, {
          headers: __privateGet(this, _preparedHeaders)
        });
      }
      if (arg && typeof arg !== "number") {
        this.res = new Response(data, arg);
      }
      const status = typeof arg === "number" ? arg : arg ? arg.status : __privateGet(this, _status);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers);
      for (const [k, v] of Object.entries(__privateGet(this, _preparedHeaders))) {
        __privateGet(this, _headers).set(k, v);
      }
      if (__privateGet(this, _res)) {
        __privateGet(this, _res).headers.forEach((v, k) => {
          __privateGet(this, _headers)?.set(k, v);
        });
        for (const [k, v] of Object.entries(__privateGet(this, _preparedHeaders))) {
          __privateGet(this, _headers).set(k, v);
        }
      }
      headers ?? (headers = {});
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          __privateGet(this, _headers).set(k, v);
        } else {
          __privateGet(this, _headers).delete(k);
          for (const v2 of v) {
            __privateGet(this, _headers).append(k, v2);
          }
        }
      }
      return new Response(data, {
        status,
        headers: __privateGet(this, _headers)
      });
    };
    this.body = (data, arg, headers) => {
      return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
    };
    this.text = (text, arg, headers) => {
      if (!__privateGet(this, _preparedHeaders)) {
        if (__privateGet(this, _isFresh) && !headers && !arg) {
          return new Response(text);
        }
        __privateSet(this, _preparedHeaders, {});
      }
      __privateGet(this, _preparedHeaders)["content-type"] = TEXT_PLAIN;
      return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
    };
    this.json = (object, arg, headers) => {
      const body = JSON.stringify(object);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "application/json; charset=UTF-8";
      return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
    };
    this.jsonT = (object, arg, headers) => {
      return this.json(object, arg, headers);
    };
    this.html = (html4, arg, headers) => {
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "text/html; charset=UTF-8";
      if (typeof html4 === "object") {
        if (!(html4 instanceof Promise)) {
          html4 = html4.toString();
        }
        if (html4 instanceof Promise) {
          return html4.then((html22) => resolveStream(html22)).then((html22) => {
            return typeof arg === "number" ? this.newResponse(html22, arg, headers) : this.newResponse(html22, arg);
          });
        }
      }
      return typeof arg === "number" ? this.newResponse(html4, arg, headers) : this.newResponse(html4, arg);
    };
    this.redirect = (location, status = 302) => {
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers);
      __privateGet(this, _headers).set("Location", location);
      return this.newResponse(null, status);
    };
    this.streamText = (cb, arg, headers) => {
      headers ?? (headers = {});
      this.header("content-type", TEXT_PLAIN);
      this.header("x-content-type-options", "nosniff");
      this.header("transfer-encoding", "chunked");
      return this.stream(cb, arg, headers);
    };
    this.stream = (cb, arg, headers) => {
      const { readable, writable } = new TransformStream;
      const stream2 = new StreamingApi(writable);
      cb(stream2).finally(() => stream2.close());
      return typeof arg === "number" ? this.newResponse(readable, arg, headers) : this.newResponse(readable, arg);
    };
    this.cookie = (name, value, opt) => {
      const cookie2 = serialize(name, value, opt);
      this.header("set-cookie", cookie2, { append: true });
    };
    this.notFound = () => {
      return this.notFoundHandler(this);
    };
    this.req = req;
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (__privateGet(this, _executionCtx) && "respondWith" in __privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    __privateSet(this, _isFresh, false);
    return __privateGet(this, _res) || __privateSet(this, _res, new Response("404 Not Found", { status: 404 }));
  }
  set res(_res2) {
    __privateSet(this, _isFresh, false);
    if (__privateGet(this, _res) && _res2) {
      __privateGet(this, _res).headers.delete("content-type");
      __privateGet(this, _res).headers.forEach((v, k) => {
        _res2.headers.set(k, v);
      });
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }
  get var() {
    return { ...this._var };
  }
  get runtime() {
    const global = globalThis;
    if (global?.Deno !== undefined) {
      return "deno";
    }
    if (global?.Bun !== undefined) {
      return "bun";
    }
    if (typeof global?.WebSocketPair === "function") {
      return "workerd";
    }
    if (typeof global?.EdgeRuntime === "string") {
      return "edge-light";
    }
    if (global?.fastly !== undefined) {
      return "fastly";
    }
    if (global?.__lagon__ !== undefined) {
      return "lagon";
    }
    if (global?.process?.release?.name === "node") {
      return "node";
    }
    return "other";
  }
};
_status = new WeakMap;
_executionCtx = new WeakMap;
_headers = new WeakMap;
_preparedHeaders = new WeakMap;
_res = new WeakMap;
_isFresh = new WeakMap;

// /Users/robertherber/code/zemble/node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context2 instanceof Context) {
          context2.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (!handler) {
        if (context2 instanceof Context && context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      } else {
        try {
          res = await handler(context2, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context2 instanceof Context && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
  };
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  constructor(status = 500, options) {
    super(options?.message);
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/utils/body.js
var isArrayField = (value) => {
  return Array.isArray(value);
};
var parseBody = async (request, options = {
  all: false
}) => {
  let body = {};
  const contentType = request.headers.get("Content-Type");
  if (contentType && (contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded"))) {
    const formData = await request.formData();
    if (formData) {
      const form = {};
      formData.forEach((value, key) => {
        const shouldParseAllValues = options.all || key.slice(-2) === "[]";
        if (!shouldParseAllValues) {
          form[key] = value;
          return;
        }
        if (form[key] && isArrayField(form[key])) {
          form[key].push(value);
          return;
        }
        if (form[key]) {
          form[key] = [form[key], value];
          return;
        }
        form[key] = value;
      });
      body = form;
    }
  }
  return body;
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/request.js
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _validatedData;
var _matchResult;
var HonoRequest = class {
  constructor(request, path = "/", matchResult = [[]]) {
    __privateAdd2(this, _validatedData, undefined);
    __privateAdd2(this, _matchResult, undefined);
    this.routeIndex = 0;
    this.bodyCache = {};
    this.cachedBody = (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody)
        return cachedBody;
      if (bodyCache.arrayBuffer) {
        return (async () => {
          return await new Response(bodyCache.arrayBuffer)[key]();
        })();
      }
      return bodyCache[key] = raw2[key]();
    };
    this.raw = request;
    this.path = path;
    __privateSet2(this, _matchResult, matchResult);
    __privateSet2(this, _validatedData, {});
  }
  param(key) {
    if (key) {
      const param = __privateGet2(this, _matchResult)[1] ? __privateGet2(this, _matchResult)[1][__privateGet2(this, _matchResult)[0][this.routeIndex][1][key]] : __privateGet2(this, _matchResult)[0][this.routeIndex][1][key];
      return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : undefined;
    } else {
      const decoded = {};
      const keys = Object.keys(__privateGet2(this, _matchResult)[0][this.routeIndex][1]);
      for (let i = 0, len = keys.length;i < len; i++) {
        const key2 = keys[i];
        const value = __privateGet2(this, _matchResult)[1] ? __privateGet2(this, _matchResult)[1][__privateGet2(this, _matchResult)[0][this.routeIndex][1][key2]] : __privateGet2(this, _matchResult)[0][this.routeIndex][1][key2];
        if (value && typeof value === "string") {
          decoded[key2] = /\%/.test(value) ? decodeURIComponent_(value) : value;
        }
      }
      return decoded;
    }
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name)
      return this.raw.headers.get(name.toLowerCase()) ?? undefined;
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  cookie(key) {
    const cookie3 = this.raw.headers.get("Cookie");
    if (!cookie3)
      return;
    const obj = parse(cookie3);
    if (key) {
      const value = obj[key];
      return value;
    } else {
      return obj;
    }
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody)
      return this.bodyCache.parsedBody;
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    __privateGet2(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet2(this, _validatedData)[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route);
  }
  get routePath() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
  get headers() {
    return this.raw.headers;
  }
  get body() {
    return this.raw.body;
  }
  get bodyUsed() {
    return this.raw.bodyUsed;
  }
  get integrity() {
    return this.raw.integrity;
  }
  get keepalive() {
    return this.raw.keepalive;
  }
  get referrer() {
    return this.raw.referrer;
  }
  get signal() {
    return this.raw.signal;
  }
};
_validatedData = new WeakMap;
_matchResult = new WeakMap;

// /Users/robertherber/code/zemble/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/hono-base.js
var defineDynamicClass = function() {
  return class {
  };
};
var __accessCheck3 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet3 = (obj, member, getter) => {
  __accessCheck3(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd3 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet3 = (obj, member, value, setter) => {
  __accessCheck3(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  const message = "Internal Server Error";
  return c.text(message, 500);
};
var _path;
var _Hono = class extends defineDynamicClass() {
  constructor(options = {}) {
    super();
    this._basePath = "/";
    __privateAdd3(this, _path, "/");
    this.routes = [];
    this.notFoundHandler = notFoundHandler;
    this.errorHandler = errorHandler;
    this.onError = (handler) => {
      this.errorHandler = handler;
      return this;
    };
    this.notFound = (handler) => {
      this.notFoundHandler = handler;
      return this;
    };
    this.head = () => {
      console.warn("`app.head()` is no longer used. `app.get()` implicitly handles the HEAD method.");
      return this;
    };
    this.handleEvent = (event) => {
      return this.dispatch(event.request, event, undefined, event.request.method);
    };
    this.fetch = (request2, Env, executionCtx) => {
      return this.dispatch(request2, executionCtx, Env, request2.method);
    };
    this.request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        if (requestInit !== undefined) {
          input = new Request(input, requestInit);
        }
        return this.fetch(input, Env, executionCtx);
      }
      input = input.toString();
      const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
      const req = new Request(path, requestInit);
      return this.fetch(req, Env, executionCtx);
    };
    this.fire = () => {
      addEventListener("fetch", (event) => {
        event.respondWith(this.dispatch(event.request, event, undefined, event.request.method));
      });
    };
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.map((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet3(this, _path, args1);
        } else {
          this.addRoute(method, __privateGet3(this, _path), args1);
        }
        args.map((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, __privateGet3(this, _path), handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      if (!method)
        return this;
      __privateSet3(this, _path, path);
      for (const m of [method].flat()) {
        handlers.map((handler) => {
          this.addRoute(m.toUpperCase(), __privateGet3(this, _path), handler);
        });
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        __privateSet3(this, _path, arg1);
      } else {
        handlers.unshift(arg1);
      }
      handlers.map((handler) => {
        this.addRoute(METHOD_NAME_ALL, __privateGet3(this, _path), handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  route(path, app) {
    const subApp = this.basePath(path);
    if (!app) {
      return subApp;
    }
    app.routes.map((r) => {
      const handler = app.errorHandler === errorHandler ? r.handler : async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  showRoutes() {
    const length = 8;
    this.routes.map((route) => {
      console.log(`\x1B[32m${route.method}\x1B[0m ${" ".repeat(length - route.method.length)} ${route.path}`);
    });
  }
  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler = async (c, next) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(new Request(new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url), c.req.raw), ...optionsArray);
      if (res)
        return res;
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  get routerName() {
    this.matchRoute("GET", "/");
    return this.router.name;
  }
  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request2, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request2, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request2, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request2, path, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
        });
        if (!res) {
          return this.notFoundHandler(c);
        }
      } catch (err) {
        return this.handleError(err, c);
      }
      if (res instanceof Response)
        return res;
      return (async () => {
        let awaited;
        try {
          awaited = await res;
          if (!awaited) {
            return this.notFoundHandler(c);
          }
        } catch (err) {
          return this.handleError(err, c);
        }
        return awaited;
      })();
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context3 = await composed(c);
        if (!context3.finalized) {
          throw new Error("Context is not finalized. You may forget returning Response object or `await next()`");
        }
        return context3.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
};
var Hono = _Hono;
_path = new WeakMap;

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/reg-exp-router/node.js
var compareKey = function(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
};
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var Node = class {
  constructor() {
    this.children = {};
  }
  insert(tokens, index, paramMap, context3, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node;
        if (name !== "") {
          node.varIndex = context3.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node;
      }
    }
    node.insert(restTokens, index, paramMap, context3, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  constructor() {
    this.context = { varIndex: 0 };
    this.root = new Node;
  }
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/reg-exp-router/router.js
var buildWildcardRegExp = function(path) {
  return wildcardRegExpCache[path] ?? (wildcardRegExpCache[path] = new RegExp(path === "*" ? "" : `^${path.replace(/\/\*/, "(?:|/.*)")}\$`));
};
var clearWildcardRegExpCache = function() {
  wildcardRegExpCache = {};
};
var buildMatcherFromPreprocessedRoutes = function(routes) {
  const trie2 = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = {};
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, {}]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie2.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = {};
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie2.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
};
var findMiddleware = function(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
};
var methodNames = [METHOD_NAME_ALL, ...METHODS].map((method) => method.toUpperCase());
var emptyParam = [];
var nullMatcher = [/^$/, [], {}];
var wildcardRegExpCache = {};
var RegExpRouter = class {
  constructor() {
    this.name = "RegExpRouter";
    this.middleware = { [METHOD_NAME_ALL]: {} };
    this.routes = { [METHOD_NAME_ALL]: {} };
  }
  add(method, path, handler) {
    var _a;
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (methodNames.indexOf(method) === -1)
      methodNames.push(method);
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = {};
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a2;
          (_a2 = middleware[m])[path] || (_a2[path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
        });
      } else {
        (_a = middleware[method])[path] || (_a[path] = findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a2;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a2 = routes[m])[path2] || (_a2[path2] = [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ]);
          routes[m][path2].push([
            handler,
            paths.length === 2 && i === 0 ? paramCount - 1 : paramCount
          ]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = {};
    methodNames.forEach((method) => {
      matchers[method] = this.buildMatcher(method) || matchers[METHOD_NAME_ALL];
    });
    this.middleware = this.routes = undefined;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute || (hasOwnRoute = true);
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  constructor(init) {
    this.name = "SmartRouter";
    this.routers = [];
    this.routes = [];
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router5 = routers[i];
      try {
        routes.forEach((args) => {
          router5.add(...args);
        });
        res = router5.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router5.match.bind(router5);
      this.routers = [router5];
      this.routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  constructor(method, handler, children) {
    this.order = 0;
    this.params = {};
    this.children = children || {};
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = {};
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    const parentPatterns = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        parentPatterns.push(...curNode.patterns);
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2)
          possibleKeys.push(pattern2[1]);
        continue;
      }
      curNode.children[p] = new Node2;
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        parentPatterns.push(...curNode.patterns);
        possibleKeys.push(pattern[1]);
      }
      parentPatterns.push(...curNode.patterns);
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = {};
    const handlerSet = {
      handler,
      possibleKeys,
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node3, method, params) {
    const handlerSets = [];
    for (let i = 0, len = node3.methods.length;i < len; i++) {
      const m = node3.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet !== undefined) {
        handlerSet.params = {};
        handlerSet.possibleKeys.map((key) => {
          handlerSet.params[key] = params[key];
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    const params = {};
    this.params = {};
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node3 = curNodes[j];
        const nextNode = node3.children[part];
        if (nextNode) {
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.gHSets(nextNode.children["*"], method, node3.params));
            }
            handlerSets.push(...this.gHSets(nextNode, method, node3.params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node3.patterns.length;k < len3; k++) {
          const pattern = node3.patterns[k];
          if (pattern === "*") {
            const astNode = node3.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node3.params));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "")
            continue;
          const [key, name, matcher] = pattern;
          const child = node3.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, { ...params, ...node3.params }));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, { ...params, ...node3.params }));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, { ...params, ...node3.params }));
                }
              } else {
                child.params = { ...params };
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params: params2 }) => [handler, params2])];
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  constructor() {
    this.name = "TrieRouter";
    this.node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      return () => optsOrigin;
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : optsOrigin[0];
    }
  })(opts.origin);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = findAllowOrigin(c.req.header("origin") || "");
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      set("Vary", "Origin");
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method !== "OPTIONS") {
      await next();
    } else {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      if (opts.allowMethods?.length) {
        set("Access-Control-Allow-Methods", opts.allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: c.res.statusText
      });
    }
  };
};

// /Users/robertherber/code/zemble/node_modules/hono/dist/middleware/logger/index.js
var log = function(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `  ${prefix} ${method} ${path}` : `  ${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
};
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s"]);
};
var colorStatus = (status) => {
  const out = {
    7: `\x1B[35m${status}\x1B[0m`,
    5: `\x1B[31m${status}\x1B[0m`,
    4: `\x1B[33m${status}\x1B[0m`,
    3: `\x1B[36m${status}\x1B[0m`,
    2: `\x1B[32m${status}\x1B[0m`,
    1: `\x1B[32m${status}\x1B[0m`,
    0: `\x1B[33m${status}\x1B[0m`
  };
  const calculateStatus = status / 100 | 0;
  return out[calculateStatus];
};
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// /Users/robertherber/code/zemble/packages/core/utils/readPackageJson.ts
import * as fs from "fs";
import * as path from "path";
var readPackageJson = (p = process.cwd()) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(p, "package.json"), "utf8"));
    if (!packageJson.name) {
      throw new Error(`[@zemble] Invalid package.json, missing "name", looked in: ${packageJson.name}`);
    }
    if (!packageJson.version) {
      throw new Error(`[@zemble] Invalid package.json, missing "version", looked in: ${packageJson.name}`);
    }
    return packageJson;
  } catch (e) {
    throw new Error(`[@zemble] Invalid package.json, expected at path: ${p}`);
  }
};

// /Users/robertherber/code/zemble/packages/core/zembleContext.ts
class ContextInstance {
  logger = console;
  kv(prefix) {
    return new KeyValue(prefix);
  }
}
var zembleContext_default = new ContextInstance;

// /Users/robertherber/code/zemble/packages/core/createApp.ts
var packageJson = readPackageJson();
var logFilter = (log2) => log2.includes("BEGIN PRIVATE KEY") || log2.includes("BEGIN PUBLIC KEY") ? "<<KEY>>" : log2;
var filterConfig = (config) => Object.keys(config).reduce((prev, key) => {
  const value = config[key];
  return {
    ...prev,
    [key]: typeof value === "string" ? logFilter(value) : value
  };
}, {});
var createApp = async ({ plugins: pluginsBeforeResolvingDeps }) => {
  const hono2 = new Hono2;
  if (true) {
    hono2.use("*", logger(zembleContext_default.logger.log));
  }
  hono2.use("*", async (ctx, next) => {
    ctx.env = {
      ...ctx.env ?? {},
      ...{
        kv: zembleContext_default.kv.bind(zembleContext_default),
        logger: zembleContext_default.logger
      }
    };
    await next();
  });
  hono2.use("*", cors());
  const resolved = pluginsBeforeResolvingDeps.flatMap((plugin) => [...plugin.dependencies, plugin]);
  const plugins = resolved.reduce((prev, plugin) => {
    const existingPlugin = prev.find(({ pluginName }) => pluginName === plugin.pluginName);
    if (existingPlugin) {
      if (existingPlugin !== plugin) {
        const pluginToUse = existingPlugin.pluginVersion >= plugin.pluginVersion ? existingPlugin.configure(plugin.config) : plugin.configure(existingPlugin.config);
        zembleContext_default.logger.warn(`[@zemble] Found multiple instances of ${plugin.pluginName}, attempting to merge config, using version ${plugin.pluginVersion}`);
        return prev.map((p) => p.pluginName !== pluginToUse.pluginName ? p : pluginToUse);
      }
      return prev;
    }
    return [...prev, plugin];
  }, []);
  const middleware = plugins.filter((plugin) => ("initializeMiddleware" in plugin));
  zembleContext_default.logger.log(`[@zemble] Initializing ${packageJson.name} with ${plugins.length} plugins:\n${plugins.map((p) => `- ${p.pluginName}@${p.pluginVersion}${"initializeMiddleware" in p ? " (middleware)" : ""}`).join("\n")}`);
  if (process.env.DEBUG) {
    plugins.forEach((plugin) => {
      zembleContext_default.logger.log(`[@zemble] Loading ${plugin.pluginName} with config: ${JSON.stringify(filterConfig(plugin.config), null, 2)}`);
    });
  }
  const appDir = process.cwd();
  const preInitApp = {
    hono: hono2,
    appDir,
    providers: {}
  };
  const runBeforeServe = await middleware?.reduce(async (prev, middleware2) => {
    const p = await prev;
    const ret = await middleware2.initializeMiddleware({
      plugins,
      app: preInitApp,
      context: zembleContext_default,
      config: middleware2.config
    });
    if (typeof ret === "function") {
      return [...p, ret];
    }
    return p;
  }, Promise.resolve([]));
  const zembleApp = {
    ...preInitApp,
    hono: hono2,
    appDir,
    runBeforeServe
  };
  hono2.get("/", async (c) => c.html(`<html>
    <head>
      <title>${packageJson.name}</title>
      <meta name="color-scheme" content="light dark">
    </head>
    <body>
      <div>
        <p>Hello Zemble! Serving ${packageJson.name}</p>
        <p><a href='/graphql'>Check out your GraphQL API here</a></p>
      </div>
    </body>
  </html>`));
  if (process.env.DEBUG) {
    const routes = hono2.routes.map((route) => ` - [${route.method}] ${route.path}`).join("\n");
    console.log(`[@zemble] Routes:\n${routes}`);
  }
  return zembleApp;
};

// /Users/robertherber/code/zemble/packages/core/utils/mergeDeep.ts
function mergeDeep(...objects) {
  function isObject(obj) {
    return obj && typeof obj === "object";
  }
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
}
var mergeDeep_default = mergeDeep;

// /Users/robertherber/code/zemble/packages/core/Plugin.ts
import_dotenv.configDotenv();

class Plugin {
  #config;
  devConfig;
  dependencies;
  pluginPath;
  providers = {};
  #pluginName;
  constructor(__dirname2, opts) {
    this.pluginPath = __dirname2;
    this.#config = opts?.defaultConfig ?? {};
    this.devConfig = opts?.devConfig;
    this.#pluginName = opts?.name ?? this.pluginName;
    this.#pluginVersion = opts?.version ?? this.pluginVersion;
    const deps = opts?.dependencies ?? [];
    const allDeps = typeof deps === "function" ? deps(this) : deps;
    const filteredDeps = allDeps.filter(this.#filterDevDependencies.bind(this));
    const resolvedDeps = filteredDeps.map(({ plugin, config }) => plugin.configure(config));
    this.dependencies = resolvedDeps;
  }
  get #isPluginDevMode() {
    return process.cwd() === this.pluginPath;
  }
  #filterDevDependencies(dep) {
    if (this.#isPluginDevMode) {
      return true;
    }
    return !dep.devOnly;
  }
  #pluginVersion;
  #readPackageJson() {
    const pkgJson = readPackageJson(this.pluginPath);
    this.#pluginVersion = pkgJson.version;
    this.#pluginName = pkgJson.name;
    return pkgJson;
  }
  get pluginVersion() {
    if (!this.#pluginVersion) {
      return this.#readPackageJson().version;
    }
    return this.#pluginVersion;
  }
  get pluginName() {
    if (!this.#pluginName) {
      return this.#readPackageJson().name;
    }
    return this.#pluginName;
  }
  configure(config) {
    if (config) {
      this.#config = mergeDeep_default(this.#config, config);
    }
    return this;
  }
  get config() {
    return this.#config;
  }
  async testApp() {
    const resolved = this.configure(this.devConfig);
    return createApp({
      plugins: [
        ...this.dependencies,
        resolved
      ]
    });
  }
}
var Plugin_default = Plugin;
// /Users/robertherber/code/zemble/packages/core/PluginWithMiddleware.ts
var import_dotenv2 = __toESM(require_main(), 1);
import_dotenv2.configDotenv();

class PluginWithMiddleware extends Plugin_default {
  #middleware;
  constructor(__dirname2, middleware, opts) {
    super(__dirname2, opts);
    this.#middleware = middleware;
  }
  get initializeMiddleware() {
    return this.#middleware;
  }
}
// /Users/robertherber/code/zemble/node_modules/@zemble/core/runBeforeServe.ts
var runBeforeServe = async (app) => {
  await app.runBeforeServe.reduce(async (prev, runner) => {
    await prev;
    await runner();
  }, Promise.resolve());
};
// /Users/robertherber/code/zemble/node_modules/@zemble/bun/serve.ts
var Bun = globalThis.Bun;
var serve = async (config) => {
  const app = await ("plugins" in config ? createApp(config) : config);
  await runBeforeServe(app);
  const bunServer = Bun.serve({ fetch: app.hono.fetch });
  const linkPrefix = bunServer.hostname === "localhost" ? "http://" : "";
  console.log(`[@zemble/bun] Serving on ${linkPrefix}${bunServer.hostname}:${bunServer.port}`);
  return app;
};
var serve_default = serve;

// node_modules/@zemble/graphql/index.json
var graphql_default = [
  "0BSD",
  "AAL",
  "ADSL",
  "AFL-1.1",
  "AFL-1.2",
  "AFL-2.0",
  "AFL-2.1",
  "AFL-3.0",
  "AGPL-1.0-only",
  "AGPL-1.0-or-later",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "AMDPLPA",
  "AML",
  "AMPAS",
  "ANTLR-PD",
  "ANTLR-PD-fallback",
  "APAFML",
  "APL-1.0",
  "APSL-1.0",
  "APSL-1.1",
  "APSL-1.2",
  "APSL-2.0",
  "ASWF-Digital-Assets-1.0",
  "ASWF-Digital-Assets-1.1",
  "Abstyles",
  "AdaCore-doc",
  "Adobe-2006",
  "Adobe-Glyph",
  "Adobe-Utopia",
  "Afmparse",
  "Aladdin",
  "Apache-1.0",
  "Apache-1.1",
  "Apache-2.0",
  "App-s2p",
  "Arphic-1999",
  "Artistic-1.0",
  "Artistic-1.0-Perl",
  "Artistic-1.0-cl8",
  "Artistic-2.0",
  "BSD-1-Clause",
  "BSD-2-Clause",
  "BSD-2-Clause-Patent",
  "BSD-2-Clause-Views",
  "BSD-3-Clause",
  "BSD-3-Clause-Attribution",
  "BSD-3-Clause-Clear",
  "BSD-3-Clause-HP",
  "BSD-3-Clause-LBNL",
  "BSD-3-Clause-Modification",
  "BSD-3-Clause-No-Military-License",
  "BSD-3-Clause-No-Nuclear-License",
  "BSD-3-Clause-No-Nuclear-License-2014",
  "BSD-3-Clause-No-Nuclear-Warranty",
  "BSD-3-Clause-Open-MPI",
  "BSD-3-Clause-Sun",
  "BSD-3-Clause-flex",
  "BSD-4-Clause",
  "BSD-4-Clause-Shortened",
  "BSD-4-Clause-UC",
  "BSD-4.3RENO",
  "BSD-4.3TAHOE",
  "BSD-Advertising-Acknowledgement",
  "BSD-Attribution-HPND-disclaimer",
  "BSD-Inferno-Nettverk",
  "BSD-Protection",
  "BSD-Source-Code",
  "BSD-Systemics",
  "BSL-1.0",
  "BUSL-1.1",
  "Baekmuk",
  "Bahyph",
  "Barr",
  "Beerware",
  "BitTorrent-1.0",
  "BitTorrent-1.1",
  "Bitstream-Charter",
  "Bitstream-Vera",
  "BlueOak-1.0.0",
  "Boehm-GC",
  "Borceux",
  "Brian-Gladman-3-Clause",
  "C-UDA-1.0",
  "CAL-1.0",
  "CAL-1.0-Combined-Work-Exception",
  "CATOSL-1.1",
  "CC-BY-1.0",
  "CC-BY-2.0",
  "CC-BY-2.5",
  "CC-BY-2.5-AU",
  "CC-BY-3.0",
  "CC-BY-3.0-AT",
  "CC-BY-3.0-DE",
  "CC-BY-3.0-IGO",
  "CC-BY-3.0-NL",
  "CC-BY-3.0-US",
  "CC-BY-4.0",
  "CC-BY-NC-1.0",
  "CC-BY-NC-2.0",
  "CC-BY-NC-2.5",
  "CC-BY-NC-3.0",
  "CC-BY-NC-3.0-DE",
  "CC-BY-NC-4.0",
  "CC-BY-NC-ND-1.0",
  "CC-BY-NC-ND-2.0",
  "CC-BY-NC-ND-2.5",
  "CC-BY-NC-ND-3.0",
  "CC-BY-NC-ND-3.0-DE",
  "CC-BY-NC-ND-3.0-IGO",
  "CC-BY-NC-ND-4.0",
  "CC-BY-NC-SA-1.0",
  "CC-BY-NC-SA-2.0",
  "CC-BY-NC-SA-2.0-DE",
  "CC-BY-NC-SA-2.0-FR",
  "CC-BY-NC-SA-2.0-UK",
  "CC-BY-NC-SA-2.5",
  "CC-BY-NC-SA-3.0",
  "CC-BY-NC-SA-3.0-DE",
  "CC-BY-NC-SA-3.0-IGO",
  "CC-BY-NC-SA-4.0",
  "CC-BY-ND-1.0",
  "CC-BY-ND-2.0",
  "CC-BY-ND-2.5",
  "CC-BY-ND-3.0",
  "CC-BY-ND-3.0-DE",
  "CC-BY-ND-4.0",
  "CC-BY-SA-1.0",
  "CC-BY-SA-2.0",
  "CC-BY-SA-2.0-UK",
  "CC-BY-SA-2.1-JP",
  "CC-BY-SA-2.5",
  "CC-BY-SA-3.0",
  "CC-BY-SA-3.0-AT",
  "CC-BY-SA-3.0-DE",
  "CC-BY-SA-3.0-IGO",
  "CC-BY-SA-4.0",
  "CC-PDDC",
  "CC0-1.0",
  "CDDL-1.0",
  "CDDL-1.1",
  "CDL-1.0",
  "CDLA-Permissive-1.0",
  "CDLA-Permissive-2.0",
  "CDLA-Sharing-1.0",
  "CECILL-1.0",
  "CECILL-1.1",
  "CECILL-2.0",
  "CECILL-2.1",
  "CECILL-B",
  "CECILL-C",
  "CERN-OHL-1.1",
  "CERN-OHL-1.2",
  "CERN-OHL-P-2.0",
  "CERN-OHL-S-2.0",
  "CERN-OHL-W-2.0",
  "CFITSIO",
  "CMU-Mach",
  "CNRI-Jython",
  "CNRI-Python",
  "CNRI-Python-GPL-Compatible",
  "COIL-1.0",
  "CPAL-1.0",
  "CPL-1.0",
  "CPOL-1.02",
  "CUA-OPL-1.0",
  "Caldera",
  "ClArtistic",
  "Clips",
  "Community-Spec-1.0",
  "Condor-1.1",
  "Cornell-Lossless-JPEG",
  "Cronyx",
  "Crossword",
  "CrystalStacker",
  "Cube",
  "D-FSL-1.0",
  "DL-DE-BY-2.0",
  "DL-DE-ZERO-2.0",
  "DOC",
  "DRL-1.0",
  "DSDP",
  "Dotseqn",
  "ECL-1.0",
  "ECL-2.0",
  "EFL-1.0",
  "EFL-2.0",
  "EPICS",
  "EPL-1.0",
  "EPL-2.0",
  "EUDatagrid",
  "EUPL-1.0",
  "EUPL-1.1",
  "EUPL-1.2",
  "Elastic-2.0",
  "Entessa",
  "ErlPL-1.1",
  "Eurosym",
  "FBM",
  "FDK-AAC",
  "FSFAP",
  "FSFUL",
  "FSFULLR",
  "FSFULLRWD",
  "FTL",
  "Fair",
  "Ferguson-Twofish",
  "Frameworx-1.0",
  "FreeBSD-DOC",
  "FreeImage",
  "Furuseth",
  "GD",
  "GFDL-1.1-invariants-only",
  "GFDL-1.1-invariants-or-later",
  "GFDL-1.1-no-invariants-only",
  "GFDL-1.1-no-invariants-or-later",
  "GFDL-1.1-only",
  "GFDL-1.1-or-later",
  "GFDL-1.2-invariants-only",
  "GFDL-1.2-invariants-or-later",
  "GFDL-1.2-no-invariants-only",
  "GFDL-1.2-no-invariants-or-later",
  "GFDL-1.2-only",
  "GFDL-1.2-or-later",
  "GFDL-1.3-invariants-only",
  "GFDL-1.3-invariants-or-later",
  "GFDL-1.3-no-invariants-only",
  "GFDL-1.3-no-invariants-or-later",
  "GFDL-1.3-only",
  "GFDL-1.3-or-later",
  "GL2PS",
  "GLWTPL",
  "GPL-1.0-only",
  "GPL-1.0-or-later",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "Giftware",
  "Glide",
  "Glulxe",
  "Graphics-Gems",
  "HP-1986",
  "HP-1989",
  "HPND",
  "HPND-DEC",
  "HPND-Markus-Kuhn",
  "HPND-Pbmplus",
  "HPND-UC",
  "HPND-doc",
  "HPND-doc-sell",
  "HPND-export-US",
  "HPND-export-US-modify",
  "HPND-sell-regexpr",
  "HPND-sell-variant",
  "HPND-sell-variant-MIT-disclaimer",
  "HTMLTIDY",
  "HaskellReport",
  "Hippocratic-2.1",
  "IBM-pibs",
  "ICU",
  "IEC-Code-Components-EULA",
  "IJG",
  "IJG-short",
  "IPA",
  "IPL-1.0",
  "ISC",
  "ImageMagick",
  "Imlib2",
  "Info-ZIP",
  "Inner-Net-2.0",
  "Intel",
  "Intel-ACPI",
  "Interbase-1.0",
  "JPL-image",
  "JPNIC",
  "JSON",
  "Jam",
  "JasPer-2.0",
  "Kastrup",
  "Kazlib",
  "Knuth-CTAN",
  "LAL-1.2",
  "LAL-1.3",
  "LGPL-2.0-only",
  "LGPL-2.0-or-later",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "LGPLLR",
  "LOOP",
  "LPL-1.0",
  "LPL-1.02",
  "LPPL-1.0",
  "LPPL-1.1",
  "LPPL-1.2",
  "LPPL-1.3a",
  "LPPL-1.3c",
  "LZMA-SDK-9.11-to-9.20",
  "LZMA-SDK-9.22",
  "Latex2e",
  "Latex2e-translated-notice",
  "Leptonica",
  "LiLiQ-P-1.1",
  "LiLiQ-R-1.1",
  "LiLiQ-Rplus-1.1",
  "Libpng",
  "Linux-OpenIB",
  "Linux-man-pages-1-para",
  "Linux-man-pages-copyleft",
  "Linux-man-pages-copyleft-2-para",
  "Linux-man-pages-copyleft-var",
  "Lucida-Bitmap-Fonts",
  "MIT",
  "MIT-0",
  "MIT-CMU",
  "MIT-Festival",
  "MIT-Modern-Variant",
  "MIT-Wu",
  "MIT-advertising",
  "MIT-enna",
  "MIT-feh",
  "MIT-open-group",
  "MIT-testregex",
  "MITNFA",
  "MMIXware",
  "MPEG-SSG",
  "MPL-1.0",
  "MPL-1.1",
  "MPL-2.0",
  "MPL-2.0-no-copyleft-exception",
  "MS-LPL",
  "MS-PL",
  "MS-RL",
  "MTLL",
  "MakeIndex",
  "Martin-Birgmeier",
  "McPhee-slideshow",
  "Minpack",
  "MirOS",
  "Motosoto",
  "MulanPSL-1.0",
  "MulanPSL-2.0",
  "Multics",
  "Mup",
  "NAIST-2003",
  "NASA-1.3",
  "NBPL-1.0",
  "NCGL-UK-2.0",
  "NCSA",
  "NGPL",
  "NICTA-1.0",
  "NIST-PD",
  "NIST-PD-fallback",
  "NIST-Software",
  "NLOD-1.0",
  "NLOD-2.0",
  "NLPL",
  "NOSL",
  "NPL-1.0",
  "NPL-1.1",
  "NPOSL-3.0",
  "NRL",
  "NTP",
  "NTP-0",
  "Naumen",
  "Net-SNMP",
  "NetCDF",
  "Newsletr",
  "Nokia",
  "Noweb",
  "O-UDA-1.0",
  "OCCT-PL",
  "OCLC-2.0",
  "ODC-By-1.0",
  "ODbL-1.0",
  "OFFIS",
  "OFL-1.0",
  "OFL-1.0-RFN",
  "OFL-1.0-no-RFN",
  "OFL-1.1",
  "OFL-1.1-RFN",
  "OFL-1.1-no-RFN",
  "OGC-1.0",
  "OGDL-Taiwan-1.0",
  "OGL-Canada-2.0",
  "OGL-UK-1.0",
  "OGL-UK-2.0",
  "OGL-UK-3.0",
  "OGTSL",
  "OLDAP-1.1",
  "OLDAP-1.2",
  "OLDAP-1.3",
  "OLDAP-1.4",
  "OLDAP-2.0",
  "OLDAP-2.0.1",
  "OLDAP-2.1",
  "OLDAP-2.2",
  "OLDAP-2.2.1",
  "OLDAP-2.2.2",
  "OLDAP-2.3",
  "OLDAP-2.4",
  "OLDAP-2.5",
  "OLDAP-2.6",
  "OLDAP-2.7",
  "OLDAP-2.8",
  "OLFL-1.3",
  "OML",
  "OPL-1.0",
  "OPL-UK-3.0",
  "OPUBL-1.0",
  "OSET-PL-2.1",
  "OSL-1.0",
  "OSL-1.1",
  "OSL-2.0",
  "OSL-2.1",
  "OSL-3.0",
  "OpenPBS-2.3",
  "OpenSSL",
  "PADL",
  "PDDL-1.0",
  "PHP-3.0",
  "PHP-3.01",
  "PSF-2.0",
  "Parity-6.0.0",
  "Parity-7.0.0",
  "Plexus",
  "PolyForm-Noncommercial-1.0.0",
  "PolyForm-Small-Business-1.0.0",
  "PostgreSQL",
  "Python-2.0",
  "Python-2.0.1",
  "QPL-1.0",
  "QPL-1.0-INRIA-2004",
  "Qhull",
  "RHeCos-1.1",
  "RPL-1.1",
  "RPL-1.5",
  "RPSL-1.0",
  "RSA-MD",
  "RSCPL",
  "Rdisc",
  "Ruby",
  "SAX-PD",
  "SCEA",
  "SGI-B-1.0",
  "SGI-B-1.1",
  "SGI-B-2.0",
  "SGI-OpenGL",
  "SGP4",
  "SHL-0.5",
  "SHL-0.51",
  "SISSL",
  "SISSL-1.2",
  "SL",
  "SMLNJ",
  "SMPPL",
  "SNIA",
  "SPL-1.0",
  "SSH-OpenSSH",
  "SSH-short",
  "SSPL-1.0",
  "SWL",
  "Saxpath",
  "SchemeReport",
  "Sendmail",
  "Sendmail-8.23",
  "SimPL-2.0",
  "Sleepycat",
  "Soundex",
  "Spencer-86",
  "Spencer-94",
  "Spencer-99",
  "SugarCRM-1.1.3",
  "SunPro",
  "Symlinks",
  "TAPR-OHL-1.0",
  "TCL",
  "TCP-wrappers",
  "TMate",
  "TORQUE-1.1",
  "TOSL",
  "TPDL",
  "TPL-1.0",
  "TTWL",
  "TTYP0",
  "TU-Berlin-1.0",
  "TU-Berlin-2.0",
  "TermReadKey",
  "UCAR",
  "UCL-1.0",
  "UPL-1.0",
  "URT-RLE",
  "Unicode-DFS-2015",
  "Unicode-DFS-2016",
  "Unicode-TOU",
  "UnixCrypt",
  "Unlicense",
  "VOSTROM",
  "VSL-1.0",
  "Vim",
  "W3C",
  "W3C-19980720",
  "W3C-20150513",
  "WTFPL",
  "Watcom-1.0",
  "Widget-Workshop",
  "Wsuipa",
  "X11",
  "X11-distribute-modifications-variant",
  "XFree86-1.1",
  "XSkat",
  "Xdebug-1.03",
  "Xerox",
  "Xfig",
  "Xnet",
  "YPL-1.0",
  "YPL-1.1",
  "ZPL-1.1",
  "ZPL-2.0",
  "ZPL-2.1",
  "Zed",
  "Zeeff",
  "Zend-2.0",
  "Zimbra-1.3",
  "Zimbra-1.4",
  "Zlib",
  "blessing",
  "bzip2-1.0.6",
  "check-cvs",
  "checkmk",
  "copyleft-next-0.3.0",
  "copyleft-next-0.3.1",
  "curl",
  "diffmark",
  "dtoa",
  "dvipdfm",
  "eGenix",
  "etalab-2.0",
  "fwlw",
  "gSOAP-1.3b",
  "gnuplot",
  "iMatix",
  "libpng-2.0",
  "libselinux-1.0",
  "libtiff",
  "libutil-David-Nugent",
  "lsof",
  "magaz",
  "metamail",
  "mpi-permissive",
  "mpich2",
  "mplus",
  "pnmstitch",
  "psfrag",
  "psutils",
  "python-ldap",
  "snprintf",
  "ssh-keyscan",
  "swrule",
  "ulem",
  "w3m",
  "xinetd",
  "xlock",
  "xpp",
  "zlib-acknowledgement"
];

// /Users/robertherber/code/zemble/node_modules/@zemble/migrations/plugin.ts
import {readdir} from "fs/promises";
import {join as join2} from "path";
var getMigrations = async (migrationsDir, adapter) => {
  const dirContents = await readdir(migrationsDir).catch(() => []);
  const filesRaw = dirContents.filter((filename) => !filename.includes(".test.") && !filename.includes(".spec."));
  if (filesRaw.length === 0) {
    return [];
  }
  if (!adapter) {
    throw new Error(`No migration adapter provided, expected one for migrations in ${migrationsDir}`);
  }
  const statuses = await adapter.status();
  const migrations = filesRaw.map((filename) => {
    const filenameWithoutExtension = filename.split(".").slice(0, -1).join(".");
    const currentStatus = statuses.find((status) => status.name === filenameWithoutExtension);
    return {
      migrationName: filenameWithoutExtension,
      fullPath: join2(migrationsDir, filename),
      isMigrated: !!currentStatus?.completedAt,
      progress: currentStatus?.progress,
      adapter
    };
  });
  return migrations;
};
var upMigrationsRemaining = [];
var downMigrationsRemaining = [];
var migrateUp = async (migrateUpCount = Infinity) => {
  console.log(`[@zemble/migrations] migrateUp: ${upMigrationsRemaining.length} migrations to process`);
  await upMigrationsRemaining.reduce(async (prev, {
    migrationName,
    fullPath,
    progress,
    adapter
  }, index) => {
    await prev;
    if (index >= migrateUpCount) {
      return;
    }
    console.log(`[@zemble/migrations] Migrate up: ${migrationName}`);
    const { up } = await import(fullPath);
    if (up) {
      await adapter?.up(migrationName, async (context3) => up({
        context: context3 ?? {},
        progress,
        progressCallback: adapter.progress ? async (pgs) => adapter.progress?.({ name: migrationName, progress: pgs }) : undefined
      }));
    }
  }, Promise.resolve());
};
var defaultConfig = {
  runMigrationsOnStart: true,
  waitForMigrationsToComplete: true
};
var plugin_default = new PluginWithMiddleware(import.meta.dir, async ({
  plugins,
  app,
  config
}) => {
  const migrationsPathOfApp = join2(app.appDir, config.migrationsDir ?? "migrations");
  const appMigrations = await getMigrations(migrationsPathOfApp, await config?.createAdapter?.(app));
  const pluginMigrations = await Promise.all(plugins.map(async (plugin) => {
    const migrationConfig = plugin.config.middleware?.["@zemble/migrations"];
    const pluginMigrationsPath = join2(plugin.pluginPath, migrationConfig?.migrationsDir ?? "migrations");
    return getMigrations(pluginMigrationsPath, await migrationConfig?.createAdapter?.(plugin));
  }));
  const allMigrations = appMigrations.concat(...pluginMigrations.flat());
  upMigrationsRemaining = allMigrations.filter((migration) => !migration.isMigrated).sort((a, b) => a.migrationName.localeCompare(b.migrationName));
  downMigrationsRemaining = allMigrations.filter((migration) => migration.isMigrated).sort((a, b) => b.migrationName.localeCompare(a.migrationName));
  return async () => {
    if (config.runMigrationsOnStart) {
      const completer = migrateUp();
      if (config.waitForMigrationsToComplete) {
        await completer;
      }
    }
  };
}, {
  dependencies: [],
  defaultConfig
});

// /Users/robertherber/code/zemble/node_modules/@zemble/migrations/adapters/dryrun.ts
var dryRunAdapter = {
  status: async () => [],
  up: async (status) => {
    console.log("Completed up migration", status);
  },
  down: async (name) => {
    console.log("Completed down migration", name);
  },
  progress: async (status) => {
    console.log("Migration progress", status);
  }
};
var dryrun_default = dryRunAdapter;

// /Users/robertherber/code/zemble/packages/routes/utils/initializePlugin.ts
import * as fs3 from "fs";
import * as path3 from "path";

// /Users/robertherber/code/zemble/packages/routes/utils/readRoutes.ts
import * as fs2 from "fs";
import * as path2 from "path";
var readRoutes = async (rootDir, prefix = "") => fs2.readdirSync(path2.join(rootDir, prefix)).reduce(async (prev, filename) => {
  const route = path2.join(rootDir, prefix, filename);
  const tat = fs2.statSync(route);
  if (tat.isDirectory()) {
    const newRoutes = await readRoutes(rootDir, path2.join(prefix, filename));
    return { ...await prev, ...newRoutes };
  }
  try {
    const newRoutes = { ...await prev, [route]: { filename, relativePath: path2.join(prefix, filename) } };
    return newRoutes;
  } catch (error) {
    console.log(error);
    return prev;
  }
}, Promise.resolve({}));
var readRoutes_default = readRoutes;

// /Users/robertherber/code/zemble/packages/routes/utils/initializePlugin.ts
async function initializePlugin({
  pluginPath,
  app,
  config
}) {
  const routePath = path3.join(pluginPath, config.rootPath ?? "routes");
  await initializeRoutes(routePath, app, config);
}
var httpVerbs = [
  "get",
  "post",
  "put",
  "delete",
  "patch"
];
var fileExtensionToMimeType = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".eot": "application/vnd.ms-fontobject",
  ".epub": "application/epub+zip",
  ".gz": "application/gzip",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".ics": "text/calendar",
  ".jar": "application/java-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jsonld": "application/ld+json",
  ".mid": "audio/midi",
  ".midi": "audio/midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".opus": "audio/opus",
  ".otf": "font/otf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".php": "application/x-httpd-php",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".rar": "application/vnd.rar",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".swf": "application/x-shockwave-flash",
  ".tar": "application/x-tar",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ts": "video/mp2t",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml": "application/xml",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".3gp": "video/3gpp",
  ".3g2": "video/3gpp2",
  ".7z": "application/x-7z-compressed"
};
var initializeRoutes = async (routePath, app, config) => {
  const hasRoutes = fs3.existsSync(routePath);
  const { hono: hono2 } = app;
  if (hasRoutes) {
    const routesAndFilenames = await readRoutes_default(routePath);
    const routePromises = Object.keys(routesAndFilenames).map(async (route) => {
      const val = routesAndFilenames[route];
      const relativePath = path3.join(config.rootUrl ?? "", val.relativePath.toLowerCase());
      const filename = val.filename.toLowerCase();
      const is404 = filename.startsWith("404");
      if (relativePath.endsWith(".js") || relativePath.endsWith(".ts") || relativePath.endsWith(".jsx") || relativePath.endsWith(".tsx")) {
        const code = await import(route);
        const relativePathNoExt = relativePath.substring(0, relativePath.length - 3);
        if (code.default) {
          const foundVerb = httpVerbs.some((verb) => {
            if (relativePathNoExt.endsWith(`.${verb}`)) {
              hono2[verb](relativePathNoExt.replace(new RegExp(`\\.${verb}\$`), ""), code.default);
              return true;
            }
            return false;
          });
          if (is404) {
            hono2.notFound(code.default);
          } else if (!foundVerb) {
            hono2.all(relativePathNoExt, code.default);
          }
        }
        httpVerbs.forEach((verb) => {
          if (code[verb]) {
            hono2[verb](relativePathNoExt, code[verb]);
          }
        });
      } else {
        const registerFileRoute = (url8) => {
          hono2.get(url8, async (context3) => {
            const fileStream = fs3.createReadStream(route);
            const conentType = fileExtensionToMimeType[path3.extname(route)];
            return context3.stream(async (stream2) => {
              fileStream.on("data", async (data) => {
                stream2.write(data);
              });
              fileStream.on("end", async () => {
                await stream2.close();
              });
            }, {
              headers: {
                "Content-Type": conentType,
                "X-Content-Type-Options": "nosniff",
                "Content-Length": fileStream.readableLength.toString(),
                "Transfer-Encoding": "chunked"
              }
            });
          });
        };
        if (relativePath.endsWith(".json")) {
          registerFileRoute(relativePath.replace(/\.json$/, ""));
          registerFileRoute(relativePath);
        } else if (relativePath.endsWith(".html")) {
          const pathWithoutExt = relativePath.replace(".html", "");
          if (pathWithoutExt.endsWith("index")) {
            registerFileRoute(pathWithoutExt.replace(/index$/, ""));
          } else {
            registerFileRoute(pathWithoutExt);
          }
        } else {
          registerFileRoute(relativePath);
        }
      }
    });
    await Promise.all(routePromises);
  }
};
var initializePlugin_default = initializePlugin;

// /Users/robertherber/code/zemble/packages/routes/middleware.ts
var middleware = async ({ app, plugins }) => {
  await plugins.reduce(async (prev, { pluginPath, config }) => {
    await prev;
    if (!config.middleware?.["@zemble/routes"]?.disable) {
      await initializePlugin_default({
        pluginPath,
        app,
        config: config.middleware?.["@zemble/routes"] ?? {}
      });
    }
    return;
  }, Promise.resolve(undefined));
  await initializePlugin_default({ pluginPath: process.cwd(), app, config: {} });
};
var middleware_default = middleware;

// /Users/robertherber/code/zemble/node_modules/@zemble/routes/plugin.ts
var defaultConfig2 = {};
var plugin_default2 = new PluginWithMiddleware(import.meta.dir, middleware_default, { defaultConfig: defaultConfig2 });

// plugins/files/plugin.ts
var plugin_default3 = new Plugin_default(import.meta.dir, {
  name: "files",
  version: "0.0.1",
  dependencies: [
    {
      plugin: plugin_default2
    }
  ]
});

// app.ts
var app_default = createApp({
  plugins: [
    plugin_default2.configure(),
    graphql_default.configure({}),
    plugin_default3.configure(),
    plugin_default.configure({
      createAdapter: () => dryrun_default
    })
  ]
});

// serve.ts
serve_default(app_default);
