# panopto-dl

A simple chrome extension to generate ffmpeg commands to download videos from TUM panopto / TUM BigBlueButton / TUM live.

### installation

* download source
* goto `chrome://extensions`
* enable developer mode
* click `Load unpacked` and select the extracted folder

### ho to use

* open the video streaming page for a short moment and the video will get registered (embedded players will not work)
* click the extension icon to view all detected videos
  * click the video title to copy a `ffmpeg` command that will download the video as `.mp4`
  * click delete to remove the video from the list
