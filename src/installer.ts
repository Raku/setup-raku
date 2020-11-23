import * as core from "@actions/core";
import * as http from "@actions/http-client";
import * as path from "path";
import * as toolCache from "@actions/tool-cache";
import { promises as fs } from "fs";

export interface Release {
  arch: string;
  backend: string;
  build_rev: number | null;
  type: string;
  platform: string;
  latest: number | null;
  url: string;
  ver: string;
}

export async function getAllReleases(): Promise<Release[]> {
  const client = new http.HttpClient("setup-raku", [], {
    allowRetries: true,
    maxRetries: 3
  });
  const url = "https://rakudo.org/dl/rakudo";
  const res = await client.getJson<Release[]>(url);
  return res.result || [];
}

export async function getRelease(
  version: string,
  platform: "win" | "macos" | "linux",
  arch: "x86_64"
): Promise<Release | null> {
  const releases = (await getAllReleases())
    .filter(
      r =>
        r.arch === arch &&
        r.type === "archive" &&
        r.backend === "moar" &&
        r.platform === platform &&
        (version === "latest" ? true : r.ver === version)
    )
    .sort((r1, r2) => {
      if (r1.ver !== r2.ver) {
        return r1.ver < r2.ver ? 1 : -1;
      } else if (r2.build_rev === null && r1.build_rev === null) {
        return 0;
      } else if (r1.build_rev === null) {
        return 1;
      } else if (r2.build_rev === null) {
        return -1;
      } else {
        return r1.build_rev < r2.build_rev ? 1 : -1;
      }
    });
  return releases.length > 0 ? releases[0] : null;
}

export async function getRaku(
  version: string,
  platform: "win" | "macos" | "linux",
  arch: "x86_64"
): Promise<void> {
  const release = await getRelease(version, platform, arch);
  if (release === null) {
    throw new Error(
      `Failed to find rakudo for version "${version}" and platform "${platform}"`
    );
  }

  const url = release.url;
  core.info(`Downloading rakudo ${version} from ${url}`);
  const downloadPath = await toolCache.downloadTool(url);

  core.info("Extracting archive");
  let extPath: string;
  if (platform === "win") {
    extPath = await toolCache.extractZip(downloadPath);
  } else {
    extPath = await toolCache.extractTar(downloadPath);
  }

  let dirname = (url.split("/").pop() || "").replace(/\.(tar\.gz|zip)$/, "");
  await fs.access(path.join(extPath, dirname)).catch(() => {
    dirname = `rakudo-${release.ver}`;
  });

  const versionWithBuildRev = `${release.ver}-0${release.build_rev}`;
  const toolPath = await toolCache.cacheDir(
    path.join(extPath, dirname),
    "rakudo",
    versionWithBuildRev,
    arch
  );
  core.info(`Successfully installed rakudo into ${toolPath}`);

  core.addPath(path.join(toolPath, "bin"));
  core.addPath(path.join(toolPath, "share", "perl6", "site", "bin"));
}
