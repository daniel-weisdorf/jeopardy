import React from "react";
import { TeamGridBorder } from "../../globals/StyleConstants";
import TeamColumn from "./TeamColumn";
import Immutable from "immutable";

export default class TeamGrid extends React.Component {
    render() {
        // Map columns
        // Map player names
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    border: TeamGridBorder,
                    borderRight: "0px solid black",
                    borderTop: "0px solid black",
                }}
            >
                {this.props.teams.toJS().map((o) => (
                    <TeamColumn
                        key={o.id}
                        team={Immutable.fromJS(o)}
                        isHost={this.props.isHost}
                    />
                ))}
            </div>
        );
    }
}
