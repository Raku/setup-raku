"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaku = exports.getRelease = exports.getAllReleases = void 0;
const core = __importStar(require("@actions/core"));
const http = __importStar(require("@actions/http-client"));
const path = __importStar(require("path"));
const toolCache = __importStar(require("@actions/tool-cache"));
const fs_1 = require("fs");
function getAllReleases() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new http.HttpClient("setup-raku", [], {
            allowRetries: true,
            maxRetries: 3
        });
        const url = "https://rakudo.org/dl/rakudo";
        const res = yield client.getJson(url);
        return res.result || [];
    });
}
exports.getAllReleases = getAllReleases;
function getRelease(version, platform, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const releases = (yield getAllReleases())
            .filter(r => r.arch === arch &&
            r.type === "archive" &&
            r.backend === "moar" &&
            r.platform === platform &&
            (version === "latest" ? true : r.ver === version))
            .sort((r1, r2) => {
            if (r1.ver !== r2.ver) {
                return r1.ver < r2.ver ? 1 : -1;
            }
            else if (r2.build_rev === null && r1.build_rev === null) {
                return 0;
            }
            else if (r1.build_rev === null) {
                return 1;
            }
            else if (r2.build_rev === null) {
                return -1;
            }
            else {
                return r1.build_rev < r2.build_rev ? 1 : -1;
            }
        });
        return releases.length > 0 ? releases[0] : null;
    });
}
exports.getRelease = getRelease;
function getRaku(version, platform, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const release = yield getRelease(version, platform, arch);
        if (release === null) {
            throw new Error(`Failed to find rakudo for version "${version}" and platform "${platform}"`);
        }
        const url = release.url;
        const ver = release.ver;
        core.info(`Downloading rakudo ${ver} from ${url}`);
        const downloadPath = yield toolCache.downloadTool(url);
        core.info("Extracting archive");
        let extPath;
        if (platform === "win") {
            extPath = yield toolCache.extractZip(downloadPath);
        }
        else {
            extPath = yield toolCache.extractTar(downloadPath);
        }
        let dirname = (url.split("/").pop() || "").replace(/\.(tar\.gz|zip)$/, "");
        yield fs_1.promises.access(path.join(extPath, dirname)).catch(() => {
            dirname = `rakudo-${ver}`;
        });
        const versionWithBuildRev = `${ver}-0${release.build_rev}`;
        const toolPath = yield toolCache.cacheDir(path.join(extPath, dirname), "rakudo", versionWithBuildRev, arch);
        core.info(`Successfully installed rakudo into ${toolPath}`);
        core.addPath(path.join(toolPath, "bin"));
        core.addPath(path.join(toolPath, "share", "perl6", "site", "bin"));
    });
}
exports.getRaku = getRaku;
