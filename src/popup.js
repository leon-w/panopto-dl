import { getVideos, deleteVideo } from "/src/videos.js";

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
<<<<<<< HEAD
    getVideos().then(videos => {
        if (videos.length == 0) {
=======
    chrome.runtime.sendMessage({type: "get_videos"}, videos => {
        if (videos.length === 0) {
>>>>>>> d5b3ac1a57021f392b65a82dd69bacac3473e86e
            $("#no_videos").show();
            $("#table").hide();
        } else {
            $("#no_videos").hide();
            $("#table").show();
        }

        if (videos.length < 2) {
            $("#download_all").hide();
            $("#delete_all").hide();
        } else {
            $("#download_all").show();
            $("#delete_all").show();
        }

        const tableBody = $("#table_body");
        tableBody.empty();
        for (const video of videos.reverse()) {
            const tr = $(`
            <tr>
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
        $("#delete_all").click(() =>
            videos.forEach(v => {
                chrome.runtime.sendMessage({type: "delete_video", data: {deleteId: v.id}}, render)
            })
        );
    });
}

render();
