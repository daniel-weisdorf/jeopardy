import React from "react";
import Button from "react-bootstrap/Button";
import GridCategory from "../components/GamePage/GridCategory";
import Immutable from "immutable";
import TeamGrid from "../components/GamePage/TeamGrid";

export default class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.startGame = this.startGame.bind(this);
    }

    // Actions
    async startGame() {
        this.props.socket.send('{"type":"start_game"}');
    }

    render() {
        const canClick =
            this.props.isCaptain &&
            this.props.gameState.get("picking_team_id", 0) ===
                this.props.teamId;
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {this.props.isHost &&
                    this.props.gameState.get("picking_team_id", 0) === 0 &&
                    !this.props.gameState.get("selected_question", null) &&
                    this.props.gameState.get("teams").length > 0 && (
                        <Button onClick={this.startGame}>Start Game</Button>
                    )}
                <br />
                Room Code: {this.props.gameState.get("room_code")}
                <br />
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
                                socket={this.props.socket}
                                teamId={this.props.teamId}
                            />
                        ))}
                </div>
                <br />
                <br />
                {this.props.gameState.get("teams").toJS().length > 0 && (
                    <TeamGrid
                        teams={this.props.gameState.get("teams")}
                        isHost={this.props.isHost}
                    />
                )}
            </div>
        );
    }
}
