function registerVideo() {
    let title = document.getElementById("recording-title").innerText;

    const screen = document.querySelector("#deskshare-video source[type^='video/mp4']")?.src;
    const webcam = document.querySelector("#video source[type^='video/mp4']")?.src;

    let command = `ffmpeg -i "${screen}" -i "${webcam}" -c:v copy -c:a aac "file:${title}.mp4"`;;

    if (screen === undefined && webcam) {
        title += "_WEBCAM_ONLY";
        command = `ffmpeg -i "${webcam}" -c copy -bsf:a aac_adtstoasc "file:${title}.mp4"`;
    } else if (screen === undefined && webcam === undefined) {
        console.log("Unsupported video");
        return;
    }

    chrome.runtime.sendMessage({ type: "register_video", data: { command, title, type: "bbb" } });
}

function waitForLoading() {
    if (document.getElementById("loading").style.visibility == "hidden") {
        registerVideo();
    } else {
        setTimeout(waitForLoading, 100);
    }
}

waitForLoading();
