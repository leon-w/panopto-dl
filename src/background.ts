import { registerPanoptoListener } from "./platforms/panopto";
import { registerTumLiveListener } from "./platforms/tum-live";
import { VideoManager, VideoType } from "./videos";

export type RegisterVideoMessage = {
    type: "register_video";
    data: {
        title: string;
        command: string;
        type: VideoType;
    };
};

function isRegisterVideoMessage(message: unknown): message is RegisterVideoMessage {
    return (message as { type: string }).type === "register_video";
}

chrome.runtime.onMessage.addListener(message => {
    if (isRegisterVideoMessage(message)) {
        const { title, command, type } = message.data;
        VideoManager.registerVideo(title, command, type);
    }
    return true;
});

// register listeners
registerPanoptoListener();
registerTumLiveListener();
