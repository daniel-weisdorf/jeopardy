import React from "react";
import { withToastManager } from "react-toast-notifications";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { Pages } from "../globals/Enums";
import Immutable from "immutable";
import JoinTeam from "../components/JoinPage/JoinTeam";

class JoinPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: "",
            teamName: "",
            roomCode: "",
            isBusy: false,
        };
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
        this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
        this.joinTeam = this.joinTeam.bind(this);
        this.createTeam = this.createTeam.bind(this);
    }

    // Form State Handlers
    handlePlayerNameChange(event) {
        this.setState({
            playerName: event.target.value,
        });
    }
    handleRoomCodeChange(event) {
        this.setState({
            roomCode: event.target.value,
        });
    }
    handleTeamNameChange(event) {
        this.setState({
            teamName: event.target.value,
        });
    }

    // Actions
    async getGameInfo(retries = 0) {
        this.setState({
            isBusy: true,
        });
        let response = null;
        try {
            response = await axios.get(
                `/api/games/?roomCode=${this.state.roomCode.toUpperCase()}`
            );
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
            return;
        }
        this.props.setGameState(response.data);
        this.props.connectSocket();
        this.setState({
            isBusy: false,
        });
    }

    async createTeam(retries = 0) {
        this.setState({
            isBusy: true,
        });
        let response = null;
        try {
            response = await axios.post(`/api/teams/`, {
                room_code: this.props.gameState.get("room_code"),
                name: this.state.teamName,
                captain_name: this.state.playerName,
            });
        } catch (error) {
            const res = error.response;
            if (res.status === 404) {
                this.props.toastManager.add("Game not found", {
                    appearance: "error",
                });
                this.setState({
                    isBusy: false,
                });
            } else if (res.status === 400) {
                this.props.toastManager.add("Game is complete", {
                    appearance: "error",
                });
                this.setState({
                    isBusy: false,
                });
            } else if (res.status === 500 && retries < 3) {
                setTimeout(() => {
                    this.createTeam(++retries);
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
            return;
        }
        // Socket will update local state
        this.props.socketSendGameUpdate();
        this.props.setCaptain(true);
        this.props.setHost(false);
        this.props.setPlayerUUID(response.data.id);
        this.props.setTeamId(response.data.team);
        this.props.setPage(Pages.GAME);
    }

    async joinTeam(teamId, retries = 0) {
        this.setState({
            isBusy: true,
        });
        let response = null;
        try {
            response = await axios.post(`/api/players/`, {
                team_id: teamId,
                player_name: this.state.playerName,
            });
        } catch (error) {
            const res = error.response;
            if (res.status === 404) {
                this.props.toastManager.add("Game not found", {
                    appearance: "error",
                });
                this.setState({
                    isBusy: false,
                });
            } else if (res.status === 400) {
                this.props.toastManager.add("Game is complete", {
                    appearance: "error",
                });
                this.setState({
                    isBusy: false,
                });
            } else if (res.status === 500 && retries < 3) {
                setTimeout(() => {
                    this.joinTeam(++retries);
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
            return;
        }
        // Socket will update local state
        this.props.socketSendGameUpdate();
        this.props.setCaptain(false);
        this.props.setHost(false);
        this.props.setPlayerUUID(response.data.id);
        this.props.setTeamId(response.data.team);
        this.props.setPage(Pages.GAME);
    }

    render() {
        const canGetGameInfo = this.state.roomCode.length === 10;
        const canClick = !!this.state.playerName && !this.state.isBusy;
        return (
            <>
                {!this.props.gameState.get("teams", false) ? (
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
                                {this.state.isBusy ? (
                                    <Spinner animation="border" />
                                ) : (
                                    "Join Game"
                                )}
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Form
                        style={{
                            border: "1px solid gray",
                            borderRadius: 10,
                            padding: 20,
                            width: "30%",
                        }}
                    >
                        <Form.Group controlId="playerName">
                            <Form.Label>Player Name</Form.Label>
                            <Form.Control
                                autoComplete="off"
                                type="text"
                                value={this.state.playerName}
                                onChange={this.handlePlayerNameChange}
                            />
                        </Form.Group>
                        {this.props.gameState
                            .get("teams")
                            .toJS()
                            .map((o) => (
                                <JoinTeam
                                    key={o.id}
                                    name={o.name}
                                    players={Immutable.fromJS(o.players)}
                                    isBusy={this.state.isBusy}
                                    canClick={canClick}
                                    onClick={() => this.joinTeam(o.id)}
                                />
                            ))}
                        <JoinTeam
                            name={this.state.teamName}
                            handleTeamNameChange={this.handleTeamNameChange}
                            create={true}
                            isBusy={this.state.isBusy}
                            canClick={canClick}
                            onClick={() => this.createTeam()}
                        />
                    </Form>
                )}
            </>
        );
    }
}
export default withToastManager(JoinPage);
