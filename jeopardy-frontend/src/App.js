import "./App.css";
import React from "react";
import { Pages } from "./globals/Enums";
import LandingPage from "./pages/LandingPage";

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
            </div>
        );
    }
}

export default App;
