let allVideos = [];
let id_counter = 0;

function registerVideo(command, title, type) {
    allVideos.push({
        command: command,
        title: title,
        type: type,
        ts: +new Date(),
        id: id_counter++,
    });
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    const type = request.type;
    const data = request.data;
    if (type === "get_videos") {
        sendResponse(allVideos);
    } else if (type === "delete_video") {
        allVideos = allVideos.filter(v => v.id !== data.deleteId);
        sendResponse();
    } else if (type === "register_video") {
        registerVideo(data.command, data.title, data.type);
    }
});
