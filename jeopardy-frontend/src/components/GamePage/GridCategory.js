import React from "react";
import Button from "react-bootstrap/Button";
import GridQuestion from "./GridQuestion";

// For usage in Grid, not Zoomed in
export default class GridCategory extends React.Component {
    render() {
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
                        border: "5px solid black",
                        height: 100,
                        width: 100,
                        backgroundColor: "blue",
                    }}
                >
                    {this.props.categoryName}
                </Button>
                {this.props.questions.map((o) => (
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
