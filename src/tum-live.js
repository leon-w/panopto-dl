chrome.webRequest.onBeforeRequest.addListener(
    async details => {
        if (details.initiator === "https://live.rbg.tum.de") {
            // retrieve title (dirty)
            let title = await new Promise(accept => {
                chrome.tabs.executeScript(
                    details.tabId,
                    {
                        code: `
                        (() => {
                            try {
                                return document
                                    .querySelector("main > font")
                                    .innerText.replace(/\\s+/g, " ")
                                    .split(" Uhrzeit:")[0]
                                    .replace("Veranstaltung: ", "")
                                    .replace(" Datum: ", " ")
                                    .replace(/\\./g, "-");
                            } catch {
                                return "video";
                            }
                        })();`,
                    },
                    result => accept(result[0])
                );
            });

            let extra = "";
            if (details.url.includes("CAM.mp4/")) {
                extra = "CAM";
            } else if (details.url.includes("PRES.mp4/")) {
                extra = "PRES";
            }

            if (extra !== "") {
                title += ` (${extra})`;
            }

            const command = `ffmpeg -i "${details.url}" -c copy -bsf:a aac_adtstoasc "file:${title}.mp4"`;

            registerVideo(command, title, "tum-live");
        }
    },
    {urls: ["https://stream.lrz.de/vod/_definst_/*/chunklist_*.m3u8"]},
    []
);
