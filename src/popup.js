import { getVideos, deleteVideo, deleteAll } from "/src/videos.js";

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
    getVideos().then(videos => {
        if (videos.length === 0) {
            $("#no_videos").show();
            $("#table").hide();
        } else {
            $("#no_videos").hide();
            $("#table").show();
        }

        if (videos.length < 2) {
            // the d-flex bootstrap class has a !important rule so just calling .hide() wont work
            $("#multi_button_row").attr("style", "display: none !important");
        } else {
            $("#multi_button_row").show();
        }

        const tableBody = $("#table_body");
        tableBody.empty();
        for (const video of videos.reverse()) {
            const tr = $(`
            <tr class="align-middle">
                <td>${formatDelta(video.ts)}</td>
                <td class="title"><i class="icon ${video.type} p-3"></i></td>
                <td class="delete"><a class="delete btn btn-danger" href="#">Delete</a></td>
            </tr>`);

            $(".title", tr).append(
                $(`<a href="#">${video.title}.mp4</a>`).click(() => {
                    navigator.clipboard.writeText(video.command);
                })
            );

            $(".delete > a", tr).click(() => {
                deleteVideo(video.id).then(render);
            });

            tableBody.append(tr);
        }
        $("#download_all").click(() =>
            navigator.clipboard.writeText(
                videos
                    .reverse()
                    .map(v => v.command)
                    .join(" && \\\n")
            )
        );
        $("#delete_all").click(() => deleteAll().then(render));
    });
}

render();
