import React from "react";
import Button from "react-bootstrap/Button";

// For usage in Grid, not Zoomed in
export default class GridQuestion extends React.Component {
    render() {
        return (
            <Button
                style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "blue",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                }}
                disabled={this.props.isAnswered || !this.props.canClick}
            >
                {this.props.isAnswered ? "" : this.props.value}
            </Button>
        );
    }
}
