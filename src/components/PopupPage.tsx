import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import ReactDOM from "react-dom";

import { VideoTable } from "./VideoTable";

type PopupPageState = {
    snackbarOpen: boolean;
    snackbarMessage: string;
};

class PopupPage extends React.Component<object, PopupPageState> {
    state: PopupPageState = {
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
        <CssBaseline />
        <PopupPage />
    </React.StrictMode>,
    document.getElementById("root")
);
