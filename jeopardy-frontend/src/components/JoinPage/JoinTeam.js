import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default class JoinTeam extends React.Component {
    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 40,
                    justifyContent: "space-between",
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
                    this.props.name
                )}

                <Button style={{ height: "100%" }}>
                    {this.props.create ? "Create Team" : "Join Team"}
                </Button>
            </div>
        );
    }
}
