import { escapeFilename } from "./ffmpeg";

export type VideoType = "panopto" | "bbb" | "tum-live";

export type Video = {
    title: string;
    command: string;
    type: VideoType;
    timestamp: number;
    id: number;
};

function generateRandomId(): number {
    return Math.round(Math.random() * 1e8);
}

export abstract class VideoManager {
    static async registerVideo(title: string, command: string, type: VideoType): Promise<void> {
        const newVideo: Video = {
            title: escapeFilename(title),
            command,
            type,
            timestamp: Date.now(),
            id: generateRandomId(),
        };

        const videos = await VideoManager.getVideos();
        videos.push(newVideo);
        await VideoManager.setVideos(videos);
    }

    static async getVideos(): Promise<Array<Video>> {
        const videos = (await chrome.storage.local.get("videos")).videos as Array<Video>;
        if (!Array.isArray(videos)) {
            return [];
        }
        return videos;
    }

    static async setVideos(videos: Array<Video>): Promise<void> {
        await chrome.storage.local.set({ videos });
        // display the number of videos as a badge at the extension icon
        const badgeText = videos.length > 0 ? videos.length.toString() : "";
        await chrome.action.setBadgeText({ text: badgeText });
    }

    static async deleteAllVideos(): Promise<void> {
        await VideoManager.setVideos([]);
    }

    static async deleteVideoById(deleteId: number): Promise<void> {
        const videos = await VideoManager.getVideos();
        const index = videos.findIndex(({ id }) => id === deleteId);
        if (index > -1) {
            videos.splice(index, 1);
            await VideoManager.setVideos(videos);
        }
    }

    static async updateVideo(video: Video): Promise<void> {
        const videos = await VideoManager.getVideos();
        const index = videos.findIndex(({ id }) => id === video.id);
        if (index > -1) {
            videos[index] = video;
            await VideoManager.setVideos(videos);
        }
    }
}
