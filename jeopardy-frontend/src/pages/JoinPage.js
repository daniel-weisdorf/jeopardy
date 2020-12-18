import React from "react";
import { withToastManager } from "react-toast-notifications";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { Pages } from "../globals/Enums";

class JoinPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            team: "",
            roomCode: "",
            isBusy: false,
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
    }

    // Form State Handlers
    handleNameChange(event) {
        this.setState({
            name: event.target.value,
        });
    }
    handleRoomCodeChange(event) {
        this.setState({
            roomCode: event.target.value,
        });
    }

    // Actions
    async getGameInfo(retries = 0) {
        this.setState({
            isBusy: true,
        });
        try {
            const response = await axios.get(
                `/api/games/?roomCode=${this.state.roomCode.toUpperCase()}`
            );
            this.props.setGameState(response.data);
        } catch (error) {
            const res = error.response;
            if (res.status === 404) {
                this.props.toastManager.add("Room Code not found", {
                    appearance: "error",
                });
                this.setState({
                    isBusy: false,
                });
            } else if (res.status === 500 && retries < 3) {
                setTimeout(() => {
                    this.getGameInfo(++retries);
                }, 1000);
            } else {
                this.props.toastManager.add(
                    "Hmm, something went wrong. Try again in a little bit!",
                    {
                        appearance: "error",
                    }
                );
                this.setState({
                    isBusy: false,
                });
            }
        }
    }

    render() {
        const canGetGameInfo = this.state.roomCode.length === 10;
        return (
            <>
                {this.props.gameState.get("teams", false) ? (
                    <div>teamselect/join</div>
                ) : (
                    <Form
                        style={{
                            border: "1px solid gray",
                            borderRadius: 10,
                            padding: 20,
                            width: "30%",
                        }}
                    >
                        <Form.Group controlId="roomCode">
                            <Form.Label>Room Code</Form.Label>
                            <Form.Control
                                style={{ textTransform: "uppercase" }}
                                autoComplete="off"
                                maxLength="10"
                                type="text"
                                placeholder="Enter your 10 letter room code"
                                value={this.state.roomCode}
                                onChange={this.handleRoomCodeChange}
                            />
                        </Form.Group>
                        <div style={{ textAlign: "center" }}>
                            <Button
                                variant="danger"
                                disabled={this.state.isBusy}
                                onClick={() =>
                                    this.props.setPage(Pages.LANDING)
                                }
                                style={{ marginRight: 20, width: 110 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant={
                                    canGetGameInfo ? "primary" : "secondary"
                                }
                                disabled={this.state.isBusy || !canGetGameInfo}
                                onClick={() => this.getGameInfo()}
                                style={{ width: 115 }}
                            >
                                Join Game
                            </Button>
                        </div>
                    </Form>
                )}
            </>
        );
    }
}
export default withToastManager(JoinPage);
