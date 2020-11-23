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

function render() {
    chrome.runtime.sendMessage({ type: "get_videos" }, videos => {
        if (videos.length == 0) {
            $("#no_videos").show();
            $("#table").hide();
        } else {
            $("#no_videos").hide();
            $("#table").show();
        }

        const tableBody = $("#table_body");
        tableBody.empty();
        for (let video of videos.reverse()) {
            const tr = $(`
            <tr>
                <td>${formatDelta(video.ts)}</td>
                <td class="title"><i class="icon ${video.type}"></i></td>
                <td class="delete"><a class="delete" href="#">Delete</a></td>
            </tr>`);

            $(".title", tr).append(
                $(`<a href="#">${video.title}.mp4</a>`).click(() => {
                    navigator.clipboard.writeText(video.command);
                })
            );

            $(".delete > a", tr).click(() => {
                chrome.runtime.sendMessage({ type: "delete_video", data: { deleteId: video.id } }, render);
            });

            tableBody.append(tr);
        }
    });
}

render();
