"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const toolDir = path.join(__dirname, "runner", path.join(Math.random()
    .toString(36)
    .substring(7)), "tools");
const tempDir = path.join(__dirname, "runner", path.join(Math.random()
    .toString(36)
    .substring(7)), "temp");
process.env["RUNNER_TOOL_CACHE"] = toolDir;
process.env["RUNNER_TEMP"] = tempDir;
const installer = __importStar(require("../src/installer"));
describe("installer", () => {
    jest.setTimeout(30 * 1000); // 30sec
    it("gets latest", () => __awaiter(void 0, void 0, void 0, function* () {
        const macos = yield installer.getRelease("latest", "macos", "x86_64");
        const linux = yield installer.getRelease("latest", "linux", "x86_64");
        expect(macos).toBeDefined();
        expect(linux).toBeDefined();
    }));
    it("gets 2020.02.1 build rev 2 for win release", () => __awaiter(void 0, void 0, void 0, function* () {
        const win = yield installer.getRelease("2020.02.1", "win", "x86_64");
        expect(win === null || win === void 0 ? void 0 : win.url).toBe("https://rakudo.org/dl/rakudo/rakudo-moar-2020.02.1-02-win-x86_64.zip");
    }));
    it("installs 2020.06 rakudo", () => __awaiter(void 0, void 0, void 0, function* () {
        yield installer.getRaku("2020.06", "linux", "x86_64");
        const raku = path.join(toolDir, "rakudo", "2020.06-01", "x86_64", "bin", "raku");
        expect(() => fs.statSync(raku)).not.toThrow();
    }));
});
