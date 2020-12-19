import React from "react";
import Button from "react-bootstrap/Button";
import GridQuestion from "./GridQuestion";
import {
    GridSize,
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
                <Button
                    disabled={true}
                    style={{
                        border: GridBorder,
                        height: GridSize,
                        width: GridSize,
                        backgroundColor: GridBackgroundColor,
                        fontWeight: "bold",
                        margin: 1,
                    }}
                >
                    {this.props.categoryName.toUpperCase()}
                </Button>
                {questions.map((o) => (
                    <GridQuestion
                        key={o.id}
                        isAnswered={o.isAnswered}
                        value={o.value}
                        canClick={this.props.canClick}
                    />
                ))}
            </div>
        );
    }
}
