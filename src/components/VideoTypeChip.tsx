import Chip from "@mui/material/Chip";
import React from "react";

import { VideoType } from "../videos";

export type VideoTypeChipProps = {
    type: VideoType;
};

export class VideoTypeChip extends React.Component<VideoTypeChipProps> {
    render() {
        let color;
        switch (this.props.type) {
            case "panopto":
                color = "#069e0b";
                break;
            case "tum-live":
                color = "#067a9e";
                break;
            case "bbb":
                color = "#062e9e";
                break;
        }

        return <Chip size="small" label={this.props.type} sx={{ backgroundColor: color, color: "white" }} />;
    }
}
