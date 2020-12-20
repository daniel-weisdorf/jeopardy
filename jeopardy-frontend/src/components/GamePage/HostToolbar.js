import React from "react";
import Button from "react-bootstrap/Button";

export default class HostToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.startGame = this.startGame.bind(this);
        this.showQuestion = this.showQuestion.bind(this);
        this.skipQuestion = this.skipQuestion.bind(this);
        this.answerQuestion = this.answerQuestion.bind(this);
    }
    // Actions
    async startGame() {
        this.props.socket.send('{"type":"start_game"}');
    }
    async showQuestion() {
        this.props.socket.send('{"type":"show_question"}');
    }
    async skipQuestion() {
        this.props.socket.send('{"type":"skip_question"}');
    }
    async answerQuestion(data) {
        this.props.socket.send(
            `{"type":"question_answered", "data":"${data}"}`
        );
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {this.props.gameState.get("picking_team_id", 0) === 0 &&
                !this.props.gameState.get("selected_question", null) &&
                this.props.gameState.get("teams").toJS().length > 0 ? (
                    <Button onClick={this.startGame}>Start Game</Button>
                ) : this.props.gameState.get("selected_question", null) &&
                  !this.props.gameState.get("show_full_question", false) ? (
                    <Button onClick={this.showQuestion}>Show Question</Button>
                ) : this.props.gameState.get("selected_question", null) &&
                  this.props.gameState.get("show_full_question", false) &&
                  !this.props.gameState.get("player_answering", null) ? (
                    <Button onClick={this.skipQuestion}>Skip Question</Button>
                ) : this.props.gameState.get("selected_question", null) &&
                  this.props.gameState.get("show_full_question", false) &&
                  !!this.props.gameState.get("player_answering", null) ? (
                    <>
                        <Button
                            style={{
                                margin: 10,
                            }}
                            onClick={() => this.answerQuestion("right")}
                        >
                            Right
                        </Button>
                        <Button
                            style={{
                                margin: 10,
                            }}
                            onClick={() => this.answerQuestion("wrong")}
                        >
                            Wrong
                        </Button>
                        <Button
                            style={{
                                margin: 10,
                            }}
                            onClick={() => this.answerQuestion("clear")}
                        >
                            Clear
                        </Button>
                    </>
                ) : (
                    false
                )}
            </div>
        );
    }
}
