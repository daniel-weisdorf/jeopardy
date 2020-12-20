import React from "react";
import Button from "react-bootstrap/Button";
import {
    GridHeight,
    GridWidth,
    GridBorder,
    GridBackgroundColor,
} from "../../globals/StyleConstants";

// For usage in Grid, not Zoomed in
export default class GridQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.selectQuestion = this.selectQuestion.bind(this);
    }
    // Actions

    async selectQuestion() {
        this.props.socket.send(
            `{"type":"select_question", "question_id": ${this.props.id}, "team_id": ${this.props.teamId}}`
        );
    }

    render() {
        return (
            <Button
                style={{
                    border: GridBorder,
                    height: GridHeight,
                    width: GridWidth,
                    backgroundColor: GridBackgroundColor,
                    fontSize: 40,
                    color: "yellow",
                    margin: 1,
                }}
                disabled={this.props.isAnswered || !this.props.canClick}
                onClick={this.selectQuestion}
            >
                {this.props.isAnswered ? "" : "$" + this.props.value}
            </Button>
        );
    }
}
