import React from "react";
import Button from "react-bootstrap/Button";
import {
    GridSize,
    GridBorder,
    GridBackgroundColor,
} from "../../globals/StyleConstants";

// For usage in Grid, not Zoomed in
export default class GridQuestion extends React.Component {
    render() {
        return (
            <Button
                style={{
                    border: GridBorder,
                    height: GridSize,
                    width: GridSize,
                    backgroundColor: GridBackgroundColor,
                    margin: 1,
                }}
                disabled={this.props.isAnswered || !this.props.canClick}
            >
                {this.props.isAnswered ? "" : "$" + this.props.value}
            </Button>
        );
    }
}
