function registerVideo() {
    const title = document.getElementById("recording-title").innerText;

    const screen = document.querySelector("#deskshare-video source[type^='video/mp4']").src;
    const webcam = document.querySelector("#video source[type^='video/mp4']").src;

    const command = `ffmpeg -i "${screen}" -i "${webcam}" -c:v copy -c:a aac "${title}.mp4"`;

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
