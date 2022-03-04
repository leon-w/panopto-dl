import { registerVideo } from "./videos.js";

chrome.webRequest.onBeforeRequest.addListener(
    async details => {
        if (details.initiator === "https://live.rbg.tum.de") {
            let title = (await chrome.tabs.get(details.tabId)).title.replace(" | TUM Live", "");

            // indicate in the title that a video is only cam/presentation
            if (details.url.includes("CAM.mp4/")) {
                title += " CAM";
            } else if (details.url.includes("PRES.mp4/")) {
                title += " PRES";
            }

            const command = `ffmpeg -i "${details.url}" -c copy -bsf:a aac_adtstoasc "file:${title}.mp4"`;

            registerVideo(command, title, "tum-live");
        }
    },
    { urls: ["https://stream.lrz.de/vod/_definst_/*/chunklist_*.m3u8"] },
    []
);
