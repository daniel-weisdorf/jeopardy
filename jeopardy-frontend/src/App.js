import "./App.css";
import React from "react";
import { Pages } from "./globals/Enums";
import LandingPage from "./pages/LandingPage";
import { withToastManager } from "react-toast-notifications";
import CreatePage from "./pages/CreatePage";
import JoinPage from "./pages/JoinPage";
import GamePage from "./pages/GamePage";
import Immutable from "immutable";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: Pages.LANDING,
            gameState: Immutable.Map(),
            isHost: false,
            isCaptain: false,
            playerUUID: null,
            teamId: null,
        };
        this.setPage = this.setPage.bind(this);
        this.setGameState = this.setGameState.bind(this);
        this.setHost = this.setHost.bind(this);
        this.setCaptain = this.setCaptain.bind(this);
        this.setPlayerUUID = this.setPlayerUUID.bind(this);
        this.setTeamId = this.setTeamId.bind(this);
        this.connectSocket = this.connectSocket.bind(this);
        this.socketSendGameUpdate = this.socketSendGameUpdate.bind(this);
    }

    socket = null;

    setHost(bool) {
        this.setState({ isHost: bool });
        sessionStorage.setItem("isHost", bool);
    }
    setCaptain(bool) {
        this.setState({ isCaptain: bool });
        sessionStorage.setItem("isCaptain", bool);
    }
    setPage(page) {
        this.setState({ currentPage: page });
    }
    setGameState(data) {
        this.setState({
            gameState: Immutable.fromJS(data),
        });
        sessionStorage.setItem("roomCode", data.room_code);
    }
    setPlayerUUID(uuid) {
        this.setState({
            playerUUID: uuid,
        });
        sessionStorage.setItem("uuid", uuid);
    }
    setTeamId(id) {
        this.setState({
            teamId: id,
        });
        sessionStorage.setItem("teamId", id);
    }
    connectSocket() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.socket = new WebSocket(
            "ws://" +
                "localhost:8000" +
                "/ws/jeopardy/" +
                sessionStorage.getItem("roomCode") +
                "/"
        );
        this.socket.onopen = () => this.socketSendGameUpdate();
        this.socket.addEventListener("message", (event) => {
            const json = JSON.parse(event.data);
            this.setGameState(json.data);
        });
    }
    socketSendGameUpdate() {
        //this.socket.send('{"type":"game_update"}');
    }

    componentDidMount() {
        this.setState({
            isHost: sessionStorage.getItem("isHost") || false,
            isCaptain: sessionStorage.getItem("isCaptain") || false,
            uuid: sessionStorage.getItem("uuid") || null,
        });
        // TODO - jump back into game?
    }

    render() {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightgray",
                }}
            >
                {this.state.currentPage === Pages.LANDING && (
                    <LandingPage
                        setPage={this.setPage}
                        setCaptain={this.setCaptain}
                        setHost={this.setHost}
                    />
                )}
                {this.state.currentPage === Pages.CREATE && (
                    <CreatePage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                        setHost={this.setHost}
                        setCaptain={this.setCaptain}
                        connectSocket={this.connectSocket}
                        socketSendGameUpdate={this.socketSendGameUpdate}
                    />
                )}
                {this.state.currentPage === Pages.JOIN && (
                    <JoinPage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                        setCaptain={this.setCaptain}
                        setHost={this.setHost}
                        gameState={this.state.gameState}
                        setPlayerUUID={this.setPlayerUUID}
                        setTeamId={this.setTeamId}
                        connectSocket={this.connectSocket}
                        socketSendGameUpdate={this.socketSendGameUpdate}
                    />
                )}
                {this.state.currentPage === Pages.GAME && (
                    <GamePage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                        gameState={this.state.gameState}
                        isHost={this.state.isHost}
                        isCaptain={this.state.isCaptain}
                        teamId={this.state.teamId}
                        socket={this.socket}
                        socketSendGameUpdate={this.socketSendGameUpdate}
                    />
                )}
            </div>
        );
    }
}

export default withToastManager(App);
