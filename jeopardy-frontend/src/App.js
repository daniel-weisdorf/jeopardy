import "./App.css";
import React from "react";
import { Pages } from "./globals/Enums";
import LandingPage from "./pages/LandingPage";
import { withToastManager } from "react-toast-notifications";
import CreatePage from "./pages/CreatePage";
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
            </div>
        );
    }
}

export default withToastManager(App);
