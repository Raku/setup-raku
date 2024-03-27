import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as installer from "./installer";
import * as os from "os";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("raku-version") || "latest";
    const platform =
      os.platform() === "darwin"
        ? "macos"
        : os.platform() === "win32"
        ? "win"
        : "linux";
    const arch = os.arch() === "arm64" ? "arm64" : "x86_64";
    await installer.getRaku(version, platform, arch);

    core.startGroup("raku -V");
    await exec.exec("raku", ["-V"]);
    core.endGroup();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
