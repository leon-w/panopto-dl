// https://github.com/sindresorhus/filenamify/issues/26
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import filenamify from "filenamify/browser";

import { OptionsManager } from "./options";
import { Video } from "./videos";

export function escapeFilename(filename: string): string {
    return filenamify(filename, { replacement: " " });
}

export function generateFfmpegCommandTemplate(videoUrl: string, options?: { audioUrl?: string }): string {
    let command;

    if (options?.audioUrl) {
        command = `{{ffmpeg}} -i "${videoUrl}" -i "${options.audioUrl}" -c:v copy -c:a aac "file:{{title}}.mp4"`;
    } else {
        command = `{{ffmpeg}} -i "${videoUrl}" -c copy -bsf:a aac_adtstoasc "file:{{title}}.mp4"`;
    }

    return command;
}

export async function buildFfmpegCommand(video: Video): Promise<string> {
    return video.command
        .replace("{{title}}", escapeFilename(video.title))
        .replace("{{ffmpeg}}", await OptionsManager.getStringOption("ffmpegPath"));
}

export async function buildFfmpegBulkCommand(videos: Array<Video>): Promise<string> {
    const ffmpegPath = await OptionsManager.getStringOption("ffmpegPath");
    return videos
        .map(video => video.command.replace("{{title}}", escapeFilename(video.title)).replace("{{ffmpeg}}", ffmpegPath))
        .reverse()
        .join(" && \\\n");
}
