import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { formatDistance, formatRelative } from "date-fns";
import React from "react";

import { buildFfmpegBulkCommand, buildFfmpegCommand } from "../ffmpeg";
import { Video, VideoManager } from "../videos";
import { ActionButton } from "./ActionButton";
import { VideoTypeChip } from "./VideoTypeChip";

type VideoTableRowProps = {
    video: Video;
    onDelete: () => void;
    onEdit: (editedVideo: Video) => void;
    onDownload: () => void;
};
type VideoTableRowState = {
    editing: boolean;
};

class VideoTableRow extends React.Component<VideoTableRowProps, VideoTableRowState> {
    state: VideoTableRowState = {
        editing: false,
    };
    nameTextFieldRef = React.createRef<HTMLInputElement>();

    handleEditVideoName() {
        this.setState({ editing: false });

        let newTitle = this.props.video.title;
        if (this.nameTextFieldRef.current) {
            newTitle = this.nameTextFieldRef.current.value;
        }
        if (newTitle !== this.props.video.title) {
            const updatedVideo: Video = {
                ...this.props.video,
                title: newTitle,
            };
            this.props.onEdit(updatedVideo);
        }
    }

    render() {
        return (
            <TableRow>
                <TableCell>
                    <Tooltip title={formatRelative(this.props.video.timestamp, new Date())}>
                        <Typography variant="body2" noWrap={true}>
                            {formatDistance(this.props.video.timestamp, new Date(), { addSuffix: true })}
                        </Typography>
                    </Tooltip>
                </TableCell>
                <TableCell align="center">
                    <VideoTypeChip type={this.props.video.type} />
                </TableCell>
                <TableCell>
                    {this.state.editing ? (
                        <TextField
                            sx={{ maxWidth: 250, minWidth: 250, pr: 0 }}
                            size="small"
                            inputRef={this.nameTextFieldRef}
                            onKeyDown={({ key }) => {
                                if (key === "Enter") this.handleEditVideoName();
                            }}
                            placeholder="Video Title"
                            defaultValue={this.props.video.title}
                        />
                    ) : (
                        <Tooltip title={this.props.video.title} placement="top">
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: "bold", maxWidth: 300, minWidth: 300, pr: 0 }}
                                noWrap={true}
                            >
                                {this.props.video.title}
                            </Typography>
                        </Tooltip>
                    )}
                </TableCell>
                <TableCell>
                    <ButtonGroup variant="contained">
                        {this.state.editing ? (
                            <>
                                <ActionButton
                                    variant="confirm"
                                    tooltip="Update Video Title"
                                    onClick={() => this.handleEditVideoName()}
                                />
                                <ActionButton
                                    variant="cancel"
                                    tooltip="Cancel Edit Video Title"
                                    onClick={() => this.setState({ editing: false })}
                                />
                            </>
                        ) : (
                            <>
                                <ActionButton
                                    variant="download"
                                    tooltip="Copy Download Command"
                                    onClick={() => this.props.onDownload()}
                                />
                                <ActionButton
                                    variant="edit"
                                    tooltip="Edit Video Title"
                                    onClick={() => this.setState({ editing: true })}
                                />
                            </>
                        )}
                        <ActionButton
                            variant="delete"
                            tooltip="Delete Video from List"
                            onClick={() => this.props.onDelete()}
                        />
                    </ButtonGroup>
                </TableCell>
            </TableRow>
        );
    }
}

export type VideoTableProps = {
    snackbarCallback?: (message: string) => void;
};

export type VideoTableState = {
    videos: Array<Video>;
};

export class VideoTable extends React.Component<VideoTableProps, VideoTableState> {
    state: VideoTableState = {
        videos: [],
    };

    componentDidMount(): void {
        this.reloadVideos();
    }

    async reloadVideos(): Promise<void> {
        this.setState({ videos: await VideoManager.getVideos() });
    }

    async handleDeleteVideo(video: Video): Promise<void> {
        await VideoManager.deleteVideoById(video.id);
        await this.reloadVideos();
    }

    async handleEditVideo(video: Video): Promise<void> {
        await VideoManager.updateVideo(video);
        await this.reloadVideos();
    }

    async handleDeleteAllVideos(): Promise<void> {
        await VideoManager.deleteAllVideos();
        await this.reloadVideos();
    }

    async handleDownloadVideo(video: Video): Promise<void> {
        navigator.clipboard.writeText(await buildFfmpegCommand(video));
        this.props.snackbarCallback?.("Download Command copied.");
    }

    async handleDownloadAllVideos(): Promise<void> {
        navigator.clipboard.writeText(await buildFfmpegBulkCommand(this.state.videos));
        this.props.snackbarCallback?.("Multi-Download Command copied.");
    }

    render() {
        // no videos
        if (this.state.videos.length === 0) {
            return (
                <Alert sx={{ minWidth: 230 }} severity="info">
                    No videos to download.
                </Alert>
            );
        }

        return (
            <Stack>
                <TableContainer sx={{ maxHeight: 400, overflowX: "hidden" }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography>Time</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Type</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Video</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Actions</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.videos.map(video => (
                                <VideoTableRow
                                    key={video.id}
                                    video={video}
                                    onDelete={() => this.handleDeleteVideo(video)}
                                    onEdit={newVideo => this.handleEditVideo(newVideo)}
                                    onDownload={() => this.handleDownloadVideo(video)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {this.state.videos.length > 1 && (
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} m={1.5}>
                        <Button
                            variant="contained"
                            size="medium"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            sx={{ textTransform: "none" }}
                            onClick={() => this.handleDownloadAllVideos()}
                        >
                            Download All
                        </Button>
                        <Button
                            variant="contained"
                            size="medium"
                            startIcon={<DeleteIcon />}
                            color="error"
                            sx={{ textTransform: "none" }}
                            onClick={() => this.handleDeleteAllVideos()}
                        >
                            Delete All
                        </Button>
                    </Stack>
                )}
            </Stack>
        );
    }
}
