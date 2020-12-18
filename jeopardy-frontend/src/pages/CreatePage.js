import React from "react";
import { withToastManager } from "react-toast-notifications";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class CreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            json: "",
            canCreate: false,
            isBusy: false,
        };
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    // Form State Handlers
    handleNameChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    // Action Handlers
    async createGame(retries = 0) {
        this.setState({
            isBusy: true,
        });
        const response = await fetch("/api/games/", {
            method: "POST",
            body: JSON.stringify(""),
        });

        if (response.ok) {
            const json = await response.json();
        } else if (retries < 3) {
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

    render() {
        return (
            <Form
                style={{
                    border: "1px solid gray",
                    borderRadius: 10,
                    padding: 20,
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
                    />
                </Form.Group>
                <div style={{ textAlign: "center" }}>
                    <Button
                        variant={this.state.canCreate ? "primary" : "secondary"}
                        disabled={this.state.isBusy || !this.state.canCreate}
                        onClick={() => this.createGame()}
                    >
                        Create Game
                    </Button>
                </div>
            </Form>
        );
    }
}
export default withToastManager(CreatePage);
