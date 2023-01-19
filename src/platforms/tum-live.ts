import { generateFfmpegCommandTemplate } from "../ffmpeg";
import { VideoManager } from "../videos";

// this function is executed in the page context of the stream page
// to generate a better title bases on data available on the page
function getTitleForTumLiveVideo(): string {
    const textElement =
        document.getElementById("bookmarks-desktop")?.nextElementSibling ??
        document.getElementById("watchWrapper")?.nextElementSibling;
    if (textElement) {
        return (textElement as HTMLElement).innerText
            .split("\n")
            .map(s => s.trim())
            .filter(s => s)
            .join(" - ");
    } else {
        return document.title;
    }
}

export function registerTumLiveListener(): void {
    chrome.webRequest.onBeforeRequest.addListener(
        (details): void => {
            (async () => {
                if (details.initiator === "https://live.rbg.tum.de") {
                    let title: string;

                    const injectionResults = await chrome.scripting.executeScript({
                        target: { tabId: details.tabId },
                        func: getTitleForTumLiveVideo,
                    });

                    if (injectionResults.length > 0 && typeof injectionResults[0].result === "string") {
                        title = injectionResults[0].result;
                    } else {
                        // fallback to tab title in case there is a problem with getting the title
                        const tab = await chrome.tabs.get(details.tabId);
                        title = (tab.title ?? "Video").replace("TUM-Live | ", "");
                    }

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
        {
            urls: [
                "https://stream.lrz.de/vod/_definst_/*/chunklist_*.m3u8", // legacy
                "https://edge.live.rbg.tum.de/vod/*/playlist.m3u8*",
            ],
        },
        []
    );
}
