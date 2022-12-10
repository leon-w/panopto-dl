import { generateFfmpegCommandTemplate } from "../ffmpeg";
import { VideoManager } from "../videos";

export function registerPanoptoListener(): void {
    chrome.webRequest.onBeforeRequest.addListener(
        (details): void => {
            (async (): Promise<void> => {
                if (details.initiator === "https://tum.cloud.panopto.eu") {
                    const tab = await chrome.tabs.get(details.tabId);
                    const title = tab.title ?? "Video";
                    const command = generateFfmpegCommandTemplate(details.url);

                    VideoManager.registerVideo(title, command, "panopto");
                }
            })();
        },
        { urls: ["https://*.cloudfront.net/sessions/*/index.m3u8"] },
        []
    );
}
