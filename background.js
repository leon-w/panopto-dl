import "./src/panopto.js";
import "./src/tum-live.js";
import { registerVideo } from "./src/videos.js";

chrome.runtime.onMessage.addListener(({ type, data }) => {
    if (type === "register_video") {
        registerVideo(data.command, data.title, data.type);
    }
    return true;
});
