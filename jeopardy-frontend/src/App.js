import "./App.css";
import React from "react";
import { Pages } from "./globals/Enums";
import LandingPage from "./pages/LandingPage";
import { withToastManager } from "react-toast-notifications";
import CreatePage from "./pages/CreatePage";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: Pages.LANDING,
        };
        this.setPage = this.setPage.bind(this);
    }

    setPage(page) {
        this.setState({ currentPage: page });
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
                    <LandingPage goToPage={this.setPage} />
                )}
                {this.state.currentPage === Pages.CREATE && (
                    <CreatePage goToPage={this.setPage} />
                )}
            </div>
        );
    }
}

export default withToastManager(App);
