import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import ReactDOM from "react-dom";

import { InlineCode } from "./InlineCode";
import { StringOption } from "./StringOption";

type OptionsPageState = {
    snackbarOpen: boolean;
    snackbarMessage: string;
};

class OptionsPage extends React.Component<Record<string, never>, OptionsPageState> {
    state: OptionsPageState = {
        snackbarOpen: false,
        snackbarMessage: "",
    };

    openSnackbar(message: string) {
        this.setState({ snackbarOpen: true, snackbarMessage: message });
    }

    render() {
        return (
            <>
                <AppBar position="sticky" color="default" elevation={1}>
                    <Toolbar>
                        <Typography variant="h6" align="center" noWrap>
                            Panopto Downloader Options
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <StringOption
                        title="FFMPEG Binary"
                        optionKey="ffmpegPath"
                        snackbarCallback={message => this.openSnackbar(message)}
                    >
                        <Typography gutterBottom>
                            The path to the ffmpeg binary, e.g. <InlineCode>ffmpeg</InlineCode>
                            {", "}
                            <InlineCode>ffmpeg.exe</InlineCode>
                            {", "}
                            <InlineCode>/path/to/ffmpeg</InlineCode>
                        </Typography>
                    </StringOption>

                    <Typography variant="body2" color="text.secondary" align="center">
                        <Link href="https://github.com/leon-w/panopto-dl">Panopto Downloader</Link>
                    </Typography>
                </Container>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={this.state.snackbarOpen}
                    onClose={() => this.setState({ snackbarOpen: false })}
                    autoHideDuration={3000}
                >
                    <Alert onClose={() => this.setState({ snackbarOpen: false })} severity="success" variant="outlined">
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
        <OptionsPage />
    </React.StrictMode>,
    document.getElementById("root")
);
