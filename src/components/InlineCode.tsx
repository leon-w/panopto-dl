import React from "react";

export class InlineCode extends React.Component {
    render() {
        return <code style={{ background: "#eeeeee", borderRadius: "4px" }}>{this.props.children}</code>;
    }
}
