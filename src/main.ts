import * as core from "@actions/core";
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
    await installer.getRaku(version, platform, "x86_64");
  } catch (error) {
    core.setFailed(error.message);
  }
}
