import React from "react";
import {
    TeamGridBorder,
    TeamGridCellHeight,
    TeamGridCellWidth,
} from "../../globals/StyleConstants";

export default class Player extends React.Component {
    render() {
        return (
            <div
                style={{
                    borderTop: TeamGridBorder,
                    backgroundColor: this.props.player.get("is_answering")
                        ? "green"
                        : "inherit",
                    height: TeamGridCellHeight,
                    width: TeamGridCellWidth,
                    padding: 10,
                }}
            >
                {this.props.player.get("name")}
                {this.props.player.get("is_captain") && "*"}
            </div>
        );
    }
}
