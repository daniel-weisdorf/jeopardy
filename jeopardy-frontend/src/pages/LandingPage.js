import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { GameName } from "../globals/TextConstants";
import { Pages } from "../globals/Enums";

export default class LandingPage extends React.Component {
    render() {
        return (
            <Container>
                <h1 style={{ textAlign: "center" }}>
                    Epic {GameName} Website Woooooo
                </h1>
                <div style={{ margin: "auto", textAlign: "center" }}>
                    <Button
                        onClick={() => this.props.goToPage(Pages.CREATE)}
                        style={{
                            margin: 10,
                            width: 150,
                        }}
                    >
                        <div>Create a game</div>
                    </Button>
                    <Button
                        onClick={() => this.props.goToPage(Pages.JOIN)}
                        style={{
                            margin: 10,
                            width: 150,
                        }}
                    >
                        <div>Join a game</div>
                    </Button>
                </div>
            </Container>
        );
    }
}