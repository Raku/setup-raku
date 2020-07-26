import io = require("@actions/io");
import fs = require("fs");
import path = require("path");

const toolDir = path.join(
  __dirname,
  "runner",
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  "tools"
);

const tempDir = path.join(
  __dirname,
  "runner",
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  "temp"
);

process.env["RUNNER_TOOL_CACHE"] = toolDir;
process.env["RUNNER_TEMP"] = tempDir;

import * as installer from "../src/installer";

describe("installer", () => {
  jest.setTimeout(30 * 1000); // 30sec
  it("gets latest", async () => {
    const macos = await installer.getRelease("latest", "macos", "x86_64");
    const linux = await installer.getRelease("latest", "linux", "x86_64");
    const win = await installer.getRelease("latest", "win", "x86_64");
    expect(macos).toBeDefined();
    expect(linux).toBeDefined();
    expect(win).toBeDefined();
  });
  it("gets 2020.02.1 build rev 2 for win release", async () => {
    const win = await installer.getRelease("2020.02.1", "win", "x86_64");
    expect(win?.url).toBe(
      "https://rakudo.org/dl/rakudo/rakudo-moar-2020.02.1-02-win-x86_64.zip"
    );
  });
  it("installs 2020.06 rakudo", async () => {
    await installer.getRaku("2020.06", "linux", "x86_64");
    const raku = path.join(
      toolDir,
      "rakudo",
      "2020.06-01",
      "x86_64",
      "bin",
      "raku"
    );
    expect(() => fs.statSync(raku)).not.toThrow();
  });
});
