let allVideos = [];

chrome.webRequest.onBeforeRequest.addListener(
    async details => {
        if (details.initiator === "https://tum.cloud.panopto.eu") {
            const url = details.url;
            const title = await new Promise(accept => chrome.tabs.get(details.tabId, tab => accept(tab.title)));

            allVideos.push({ url, title, ts: +new Date() });
        }
    },
    { urls: ["https://*.cloudfront.net/sessions/*/index.m3u8"] },
    []
);

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {      
    if (request.type === "get_videos") {
        sendResponse(allVideos);
    } else if (request.type === "delete_video") {
        console.log(request.delete_url)
        allVideos = allVideos.filter(v => v.url != request.delete_url);
        sendResponse();
    }
});