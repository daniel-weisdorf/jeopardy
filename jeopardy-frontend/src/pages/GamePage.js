import React from "react";
import { withToastManager } from "react-toast-notifications";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Pages } from "../globals/Enums";
import GridCategory from "../components/GamePage/GridCategory";

export default class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        // Map Categories
        // Map Questions
        // Map Teams -> Players
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {this.props.gameState
                    .get("categories")
                    .toJS()
                    .map((o) => (
                        <GridCategory
                            key={o.id}
                            questions={o.questions}
                            categoryName={o.name}
                            canClick={this.props.isCaptain}
                        />
                    ))}
            </div>
        );
    }
}
