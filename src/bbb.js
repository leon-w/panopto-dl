function sanitizeTitle(title) {
    return title.replace(/\//g, "_");
}

function registerVideo() {
    let title = sanitizeTitle(document.getElementsByClassName("title")?.[0]?.innerText ?? document.title);

    let screen, webcam;
    for (const { src } of document.getElementsByTagName("video")) {
        if (src.includes("webcams.mp4")) {
            webcam = src;
        } else if (src.includes("deskshare.mp4")) {
            screen = src;
        }
    }

    let command = `ffmpeg -i "${screen}" -i "${webcam}" -c:v copy -c:a aac "file:${title}.mp4"`;

    if (screen === undefined && webcam) {
        title += "_WEBCAM_ONLY";
        command = `ffmpeg -i "${webcam}" -c copy -bsf:a aac_adtstoasc "file:${title}.mp4"`;
    } else if (screen === undefined && webcam === undefined) {
        console.warn("unsupported playback");
        return;
    }

    chrome.runtime.sendMessage({type: "register_video", data: {command, title, type: "bbb"}});
}

(async () => {
    while (true) {
        if (document.getElementById("player")?.style?.visibility === "") {
            setTimeout(registerVideo, 500);
            break;
        }
        await new Promise(accept => setTimeout(accept, 100));
    }
})();
