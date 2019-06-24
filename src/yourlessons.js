import React from "react";
// import { Link } from "react-router-dom";
import axios from "./axios";
import { abc } from "./actions";

// import { socket } from "./socket";

import { connect } from "react-redux";

export class YourLessons extends React.Component {
    constructor() {
        super();
        this.state = {};

        // this.props = this.props.bind(this);
    }

    componentDidMount() {
        // this.props.closeMenu();
        axios
            .get("/get-started-lessons")
            .then(rslt => {
                console.log("yourlessons did mount result", rslt.data);
                console.log("yourlessos did mount this.props", this.props);
                this.props.dispatch(abc(rslt.data));
            })
            .catch(err => {
                console.log("get started lessons error", err);
            });
    }

    render() {
        // console.log("this.props in render", this.props);
        if (!this.props.usersLessons) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        } else {
            return (
                <div>
                    <h2>users lessons</h2>
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    console.log("lessons state", state);
    if (!state.usersLessons) {
        return {};
    } else {
        return {
            usersLessons: state.usersLessons
        };
    }
};

export default connect(mapStateToProps)(YourLessons);
