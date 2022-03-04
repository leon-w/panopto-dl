export async function registerVideo(command, title, type) {
    const videos = await getVideos();
    videos.push({
        command,
        title,
        type,
        ts: Date.now(),
        id: Math.round(Math.random() * 1e8),
    });

    await chrome.storage.local.set({ videos: videos });
}

export async function deleteVideo(deleteId) {
    const videos = await getVideos();
    const index = videos.findIndex(v => v.id === deleteId);
    if (index > -1) {
        videos.splice(index, 1);
    }
    await chrome.storage.local.set({ videos: videos });
}

export function getVideos() {
    return new Promise(resolve => {
        chrome.storage.local.get("videos", ({ videos }) => resolve(videos ?? []));
    });
}
