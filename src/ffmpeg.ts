// https://github.com/sindresorhus/filenamify/issues/26
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import filenamify from "filenamify/browser";

import { Video } from "./videos";

export function escapeFilename(filename: string): string {
    return filenamify(filename, { replacement: " " });
}

export function generateFfmpegCommandTemplate(videoUrl: string, options?: { audioUrl?: string }): string {
    let command;

    if (options?.audioUrl) {
        command = `ffmpeg -i "${videoUrl}" -i "${options.audioUrl}" -c:v copy -c:a aac "file:{{title}}.mp4"`;
    } else {
        command = `ffmpeg -i "${videoUrl}" -c copy -bsf:a aac_adtstoasc "file:{{title}}.mp4"`;
    }

    return command;
}

export function buildFfmpegCommand(video: Video): string {
    const command = video.command.replace("{{title}}", escapeFilename(video.title));
    return command;
}

export function buildFfmpegBulkCommand(videos: Array<Video>): string {
    const command = videos
        .map(v => buildFfmpegCommand(v))
        .reverse()
        .join(" && \\\n");
    return command;
}
