import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

export default class JoinTeam extends React.Component {
    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 40,
                    justifyContent: "space-between",
                    marginTop: 20,
                    marginBottom: 20,
                }}
            >
                {this.props.create ? (
                    <Form.Group style={{ height: "100%" }} controlId="teamName">
                        <Form.Control
                            autoComplete="off"
                            type="text"
                            placeholder="Team Name"
                            value={this.props.name}
                            onChange={this.props.handleTeamNameChange}
                        />
                    </Form.Group>
                ) : (
                    this.props.name +
                    " (" +
                    this.props.players.toJS().length +
                    (this.props.players.toJS().length == 1
                        ? " player)"
                        : " players)")
                )}

                <Button
                    disabled={
                        !this.props.canClick ||
                        (this.props.create && !this.props.name)
                    }
                    style={{ height: "100%" }}
                    onClick={this.props.onClick}
                >
                    {this.props.isBusy ? (
                        <Spinner animation="border" />
                    ) : this.props.create ? (
                        "Create Team"
                    ) : (
                        "Join Team"
                    )}
                </Button>
            </div>
        );
    }
}
