import { generateFfmpegCommandTemplate } from "../ffmpeg";
import { VideoManager } from "../videos";

export function registerTumLiveListener(): void {
    chrome.webRequest.onBeforeRequest.addListener(
        (details): void => {
            (async () => {
                if (details.initiator === "https://live.rbg.tum.de") {
                    const tab = await chrome.tabs.get(details.tabId);
                    let title = (tab.title ?? "Video").replace("TUM-Live | ", "");

                    // indicate in the title that a video is only cam/presentation
                    if (details.url.includes("CAM.mp4/")) {
                        title += " CAM";
                    } else if (details.url.includes("PRES.mp4/")) {
                        title += " PRES";
                    }

                    const command = generateFfmpegCommandTemplate(details.url);

                    VideoManager.registerVideo(title, command, "tum-live");
                }
            })();
        },
        { urls: ["https://stream.lrz.de/vod/_definst_/*/chunklist_*.m3u8"] },
        []
    );
}
