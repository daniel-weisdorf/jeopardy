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
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        border: "1px solid gray",
                        borderRadius: 10,
                        backgroundColor: "lightblue",
                        padding: 20,
                        width: "30%",
                    }}
                >
                    <div
                        style={{
                            fontSize: 30,
                            textAlign: "center",
                        }}
                    >
                        {this.props.gameState.getIn(
                            ["selected_question", "category_name"],
                            "error"
                        )}
                        {" - "}
                        {this.props.gameState.getIn(
                            ["selected_question", "value"],
                            "error"
                        )}
                        <hr />
                    </div>
                    <br />
                    {this.props.gameState.get("show_full_question", false) &&
                        (!this.props.gameState.getIn(
                            ["selected_question", "is_picture_question"],
                            false
                        ) ? (
                            <div
                                style={{
                                    fontSize: 30,
                                }}
                            >
                                {this.props.gameState.getIn([
                                    "selected_question",
                                    "question",
                                ])}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <img
                                    style={{
                                        maxHeight: 400,
                                    }}
                                    src={this.props.gameState.getIn([
                                        "selected_question",
                                        "question",
                                    ])}
                                />
                            </div>
                        ))}
                </div>
                <br />
                {!this.props.isHost && (
                    <Button
                        disabled={
                            !!this.props.gameState.get(
                                "player_answering",
                                null
                            ) ||
                            !this.props.gameState.get(
                                "show_full_question",
                                false
                            )
                        }
                        onClick={this.buzz}
                        style={
                            {
                                // position: "absolute",
                                // bottom: 0,
                            }
                        }
                    >
                        Buzz
                    </Button>
                )}
            </div>
        );
    }
}
