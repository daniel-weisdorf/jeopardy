import React from "react";
import { withToastManager } from "react-toast-notifications";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { Pages } from "../globals/Enums";

class CreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            json: "",
            isBusy: false,
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    // Form State Handlers
    handleNameChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    handleFileChange(fileEvent) {
        if (!fileEvent.target.files[0]) {
            this.setState({
                json: "",
            });
            return;
        }
        this.setState({ isBusy: true });
        const reader = new FileReader();
        reader.addEventListener("load", (readEvent) => {
            try {
                this.setState({
                    json: JSON.parse(readEvent.target.result),
                    isBusy: false,
                });
            } catch (error) {
                this.setState({
                    json: "",
                    isBusy: false,
                });
                this.props.toastManager.add(
                    "This file does not appear to be a JSON format, and I'm not even checking for the expected JSON format. Come on.",
                    {
                        appearance: "error",
                    }
                );
            }
        });
        reader.readAsText(fileEvent.target.files[0]);
    }

    // Action Handlers
    async createGame(retries = 0) {
        this.setState({
            isBusy: true,
        });
        const data = {
            host_name: this.state.name,
            categories: this.state.json["categories"],
        };
        try {
            const response = await axios.post("/api/games/", data);
            this.props.setGameState(response.data);
            this.props.setPage(Pages.GAME);
        } catch (error) {
            const res = error.response;
            if (res.status === 500 && retries < 3) {
                setTimeout(() => {
                    this.createGame(++retries);
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
        const canCreate = this.state.name.length > 0 && this.state.json;
        return (
            <Form
                style={{
                    border: "1px solid gray",
                    borderRadius: 10,
                    padding: 20,
                    width: "30%",
                }}
            >
                <Form.Group controlId="name">
                    <Form.Label>Player Name</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type="text"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                    />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.File
                        id="JSONUpload"
                        label="Upload your JSON File of Questions:"
                        onChange={this.handleFileChange}
                        accept=".txt, .json"
                    />
                </Form.Group>
                <div style={{ textAlign: "center" }}>
                    <Button
                        variant="danger"
                        disabled={this.state.isBusy}
                        onClick={() => this.props.setPage(Pages.LANDING)}
                        style={{ marginRight: 20, width: 110 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant={canCreate ? "primary" : "secondary"}
                        disabled={this.state.isBusy || !canCreate}
                        onClick={() => this.createGame()}
                        style={{ width: 125 }}
                    >
                        {this.state.isBusy ? (
                            <Spinner animation="border" />
                        ) : (
                            "Create Game"
                        )}
                    </Button>
                </div>
            </Form>
        );
    }
}
export default withToastManager(CreatePage);
