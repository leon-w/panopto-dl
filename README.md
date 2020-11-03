# panopto-dl

A simple chrome extension to generate ffmpeg commands to download videos from panopto.

### installation

* download source
* goto `chrome://extensions`
* enable developer mode
* click `Load unpacked` and select the extracted folder

### ho to use

* when opening a panopto video, the video source url gets saved, the video title gets fetched from the tab title (wont work properly when using the embedded player)
* click the extension icon to view all detected videos
  * click the video title to copy a `ffmpeg` command that will download the video as `.mp4`
  * click delete to remove the video from the list
