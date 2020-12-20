import React from "react";
import Button from "react-bootstrap/Button";
import GridQuestion from "./GridQuestion";
import {
    GridHeight,
    GridWidth,
    GridBorder,
    GridBackgroundColor,
} from "../../globals/StyleConstants";

// For usage in Grid, not Zoomed in
export default class GridCategory extends React.Component {
    render() {
        const questions = this.props.questions.toJS();
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* NOT A BUTTON JUST FOR STYLE, SUE ME*/}
                <Button
                    disabled={false}
                    style={{
                        border: GridBorder,
                        height: GridHeight,
                        width: GridWidth,
                        backgroundColor: GridBackgroundColor,
                        fontWeight: "bold",
                        margin: 1,
                        fontSize: 20,
                        cursor: "default",
                    }}
                >
                    {this.props.categoryName.toUpperCase()}
                </Button>
                {questions.map((o) => (
                    <GridQuestion
                        key={o.id}
                        id={o.id}
                        teamId={this.props.teamId}
                        isAnswered={o.is_answered}
                        value={o.value}
                        canClick={this.props.canClick}
                        socket={this.props.socket}
                    />
                ))}
            </div>
        );
    }
}
