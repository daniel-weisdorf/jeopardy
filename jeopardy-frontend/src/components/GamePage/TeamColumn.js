import React from "react";
import { TeamGridBorder } from "../../globals/StyleConstants";
import Immutable from "immutable";
import Player from "./Player";

export default class TeamColumn extends React.Component {
    render() {
        // Show Team Name
        // Map player names
        // Players turn green when they have buzzed
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRight: TeamGridBorder,
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        borderTop: TeamGridBorder,
                        padding: 10,
                    }}
                >
                    {this.props.team.get("name")}
                </div>
                {this.props.team
                    .get("players")
                    .toJS()
                    .map((o) => (
                        <Player key={o.id} player={Immutable.fromJS(o)} />
                    ))}
            </div>
        );
    }
}
