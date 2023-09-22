import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

import { ActionButton } from "./ActionButton";
import { OptionKey, OptionsManager } from "../options";

type StringOptionProps = {
    title: string;
    optionKey: OptionKey;
    snackbarCallback?: (message: string) => void;
};

type StringOptionState = {
    edited: boolean;
    currentValue: string;
};

export class StringOption extends React.Component<StringOptionProps, StringOptionState> {
    state: StringOptionState = {
        edited: false,
        currentValue: "",
    };
    textFieldRef = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        OptionsManager.getStringOption(this.props.optionKey).then(value => {
            this.setState({ currentValue: value });
            if (this.textFieldRef.current) {
                this.textFieldRef.current.value = value;
            }
        });
    }

    async handleSaveChanges() {
        if (this.textFieldRef.current) {
            const newValue = this.textFieldRef.current.value;
            if (newValue !== this.state.currentValue) {
                await OptionsManager.setStringOption(this.props.optionKey, newValue);
                this.props.snackbarCallback?.("Saved changes!");
            }
            this.setState({ edited: false, currentValue: newValue });
        }
    }

    render() {
        return (
            <Paper variant="outlined" sx={{ my: { xs: 2, md: 4 }, p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" gutterBottom>
                    {this.props.title}
                    {this.state.edited ? "*" : undefined}
                </Typography>
                {this.props.children}
                <TextField
                    variant="standard"
                    placeholder={this.state.currentValue}
                    fullWidth
                    inputRef={this.textFieldRef}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ActionButton
                                    disabled={!this.state.edited}
                                    tooltip="Save Changes"
                                    variant="save"
                                    onClick={() => this.handleSaveChanges()}
                                />
                            </InputAdornment>
                        ),
                    }}
                    onChange={({ target }) => this.setState({ edited: target.value !== this.state.currentValue })}
                />
            </Paper>
        );
    }
}
