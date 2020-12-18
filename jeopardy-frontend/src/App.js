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
        };
        this.setPage = this.setPage.bind(this);
        this.setGameState = this.setGameState.bind(this);
    }

    setPage(page) {
        this.setState({ currentPage: page });
    }
    setGameState(data) {
        this.setState({
            gameState: Immutable.fromJS(data),
        });
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
                    <LandingPage setPage={this.setPage} />
                )}
                {this.state.currentPage === Pages.CREATE && (
                    <CreatePage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                    />
                )}
                {this.state.currentPage === Pages.JOIN && (
                    <JoinPage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                        gameState={this.state.gameState}
                    />
                )}
                {this.state.currentPage === Pages.GAME && (
                    <GamePage
                        setPage={this.setPage}
                        setGameState={this.setGameState}
                        gameState={this.state.gameState}
                    />
                )}
            </div>
        );
    }
}

export default withToastManager(App);
