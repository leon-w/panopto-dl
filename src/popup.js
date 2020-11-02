function formatDelta(time) {
    const rtf = new Intl.RelativeTimeFormat("en");
    let delta = Math.round((new Date() - time) / 1000);
    if (delta < 60) {
        return rtf.format(-delta, "second");
    }
    delta = Math.round(delta / 60);
    if (delta < 60) {
        return rtf.format(-delta, "minute");
    }
    delta = Math.round(delta / 60);
    return rtf.format(-delta, "hour");
}

function generateCommand(video) {
    return `ffmpeg -i "${video.url}" -c copy -bsf:a aac_adtstoasc "${video.title}.mp4"`;
}

function render() {
    chrome.runtime.sendMessage({ type: "get_videos" }, videos => {
        const tableBody = $("#table_body");
        tableBody.empty();
        for (let video of videos.reverse()) {
            const tr = $(`
            <tr>
                <td>${formatDelta(video.ts)}</td>
                <td class="title"></td>
                <td class="delete"><a class="delete" href="#">Delete</a></td>
            </tr>`);

            $(".title", tr).append(
                $(`<a href="#">${video.title}.mp4</a>`).click(() => {
                    navigator.clipboard.writeText(generateCommand(video))
                })
            );

            $(".delete > a", tr).click(() => {
                chrome.runtime.sendMessage({ type: "delete_video", delete_url: video.url }, () => {
                    render();
                });
            });

            tableBody.append(tr);
        }
    });
}

render();
