import React from "react";
import { withToastManager } from "react-toast-notifications";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Pages } from "../globals/Enums";
import GridCategory from "../components/GamePage/GridCategory";
import Immutable from "immutable";
import TeamGrid from "../components/GamePage/TeamGrid";

export default class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const canClick =
            this.props.isCaptain &&
            this.props.gameState.get("picking_team_id", 0) == this.props.teamId;
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                Room Code: {this.props.gameState.get("room_code")}
                <br />
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
                            />
                        ))}
                </div>
                <br />
                <br />
                {this.props.gameState.get("teams").toJS().length > 0 && (
                    <TeamGrid teams={this.props.gameState.get("teams")} />
                )}
            </div>
        );
    }
}
