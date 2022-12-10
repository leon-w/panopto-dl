// content script

import { RegisterVideoMessage } from "../background";
import { generateFfmpegCommandTemplate } from "../ffmpeg";
import { sleep } from "../utils";

function registerVideo() {
    const titleNode = document.getElementsByClassName("title")?.[0] as HTMLElement | undefined;
    let title = titleNode?.innerText ?? document.title;

    let screenUrl, webcamUrl;
    for (const { src } of document.getElementsByTagName("video")) {
        if (src.includes("webcams.mp4")) {
            webcamUrl = src;
        } else if (src.includes("deskshare.mp4")) {
            screenUrl = src;
        }
    }

    let command;
    if (screenUrl && webcamUrl) {
        command = generateFfmpegCommandTemplate(screenUrl, { audioUrl: webcamUrl });
    } else if (screenUrl) {
        title += ": SCREEN ONLY";
        command = generateFfmpegCommandTemplate(screenUrl);
    } else if (webcamUrl) {
        title += ": WEBCAM ONLY";
        command = generateFfmpegCommandTemplate(webcamUrl);
    } else {
        // eslint-disable-next-line no-console
        console.warn("[panopto-dl] unsupported playback");
        return;
    }

    const message: RegisterVideoMessage = {
        type: "register_video",
        data: { command, title, type: "bbb" },
    };

    chrome.runtime.sendMessage(message);
}

// wait until the page is loaded
(async () => {
    while (!(document.getElementById("player")?.style?.visibility === "")) {
        await sleep(100);
    }
    await sleep(500);
    registerVideo();
})();
