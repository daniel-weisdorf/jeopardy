import React from "react";
import GridCategory from "./GridCategory";
import Immutable from "immutable";

export default class GameGrid extends React.Component {
    render() {
        const canClick =
            this.props.isCaptain &&
            this.props.gameState.get("picking_team_id", 0) ===
                this.props.teamId;
        return (
            <div
                id="grid"
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {this.props.gameState
                    .get("categories")
                    .toJS()
                    .map((o) => (
                        <GridCategory
                            key={o.id}
                            questions={Immutable.fromJS(o.questions)}
                            categoryName={o.name}
                            canClick={canClick}
                            socket={this.props.socket}
                            teamId={this.props.teamId}
                        />
                    ))}
            </div>
        );
    }
}
