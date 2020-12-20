import React from "react";
import TeamGrid from "../components/GamePage/TeamGrid";
import HostToolbar from "../components/GamePage/HostToolbar";
import GameGrid from "../components/GamePage/GameGrid";
import SelectedQuestion from "../components/GamePage/SelectedQuestion";

export default class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                    }}
                >
                    Room Code: {this.props.gameState.get("room_code")}
                </div>
                {this.props.isHost && (
                    <div
                        style={{
                            position: "fixed",
                            top: 50,
                        }}
                    >
                        <HostToolbar
                            gameState={this.props.gameState}
                            socket={this.props.socket}
                        />
                        <br />
                    </div>
                )}
                {!this.props.gameState.get("selected_question", null) ? (
                    <GameGrid
                        isCaptain={this.props.isCaptain}
                        gameState={this.props.gameState}
                        socket={this.props.socket}
                        teamId={this.props.teamId}
                    />
                ) : (
                    <SelectedQuestion
                        gameState={this.props.gameState}
                        isHost={this.props.isHost}
                        socket={this.props.socket}
                    />
                )}
                <br />
                <br />
                {this.props.gameState.get("teams").toJS().length > 0 && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: 30,
                        }}
                    >
                        <TeamGrid
                            teams={this.props.gameState.get("teams")}
                            isHost={this.props.isHost}
                        />
                    </div>
                )}
            </div>
        );
    }
}
