chrome.webRequest.onBeforeRequest.addListener(
    async details => {
        if (details.initiator === "https://tum.cloud.panopto.eu") {
            const title = await new Promise(accept => chrome.tabs.get(details.tabId, tab => accept(tab.title)));
            const command = `ffmpeg -i "${details.url}" -c copy -bsf:a aac_adtstoasc "file:${title}.mp4"`;

            registerVideo(command, title, "panopto");
        }
    },
    { urls: ["https://*.cloudfront.net/sessions/*/index.m3u8"] },
    []
);
