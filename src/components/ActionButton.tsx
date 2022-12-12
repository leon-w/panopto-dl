import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import IconButton, { IconButtonTypeMap } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

export type ActionButtonProps = {
    variant: "confirm" | "cancel" | "edit" | "download" | "delete" | "save";
    onClick?: () => void;
    tooltip?: string;
    disabled?: boolean;
};

export class ActionButton extends React.Component<ActionButtonProps> {
    render() {
        let color: IconButtonTypeMap["props"]["color"];
        let icon;
        switch (this.props.variant) {
            case "confirm":
                color = "success";
                icon = <CheckIcon />;
                break;
            case "cancel":
                color = "error";
                icon = <CloseIcon />;
                break;
            case "edit":
                color = "secondary";
                icon = <EditIcon />;
                break;
            case "download":
                color = "primary";
                icon = <DownloadIcon />;
                break;
            case "delete":
                color = "error";
                icon = <DeleteIcon />;
                break;
            case "save":
                color = "primary";
                icon = <SaveIcon />;
        }

        const button = (
            <IconButton disabled={this.props.disabled} color={color} onClick={() => this.props.onClick?.()}>
                {icon}
            </IconButton>
        );

        return this.props.tooltip && !this.props.disabled ? (
            <Tooltip title={this.props.tooltip}>{button}</Tooltip>
        ) : (
            button
        );
    }
}
