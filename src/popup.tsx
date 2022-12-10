import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import ReactDOM from "react-dom";

import { VideoTable } from "./components/VideoTable";

type PopupState = {
    snackbarOpen: boolean;
    snackbarMessage: string;
};

class Popup extends React.Component<object, PopupState> {
    state: PopupState = {
        snackbarOpen: false,
        snackbarMessage: "",
    };

    openSnackbar(message: string) {
        this.setState({ snackbarOpen: true, snackbarMessage: message });
    }

    render() {
        return (
            <>
                <VideoTable snackbarCallback={message => this.openSnackbar(message)} />
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={this.state.snackbarOpen}
                    onClose={() => this.setState({ snackbarOpen: false })}
                    autoHideDuration={1500}
                >
                    <Alert
                        onClose={() => this.setState({ snackbarOpen: false })}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </>
        );
    }
}

ReactDOM.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
    document.getElementById("root")
);
