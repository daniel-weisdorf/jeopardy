import React from "react";
import Button from "react-bootstrap/Button";

export default class SelectedQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.buzz = this.buzz.bind(this);
    }
    // Actions
    async buzz() {
        this.props.socket.send(
            `{"type":"buzz", "uuid":"${sessionStorage.getItem("uuid")}"}`
        );
    }
    render() {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <div>
                    {!this.props.gameState.get("show_full_question", false) ? (
                        <div>Category - Value</div>
                    ) : (
                        <div>Question Text</div>
                    )}
                </div>

                {!this.props.isHost &&
                    this.props.gameState.get("show_full_question", false) && (
                        <Button
                            disabled={
                                !!this.props.gameState.get(
                                    "player_answering",
                                    null
                                )
                            }
                            onClick={this.buzz}
                            style={{
                                position: "absolute",
                                bottom: 0,
                            }}
                        >
                            Buzz
                        </Button>
                    )}
            </div>
        );
    }
}
