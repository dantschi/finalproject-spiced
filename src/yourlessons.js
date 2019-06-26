import React from "react";
// import { Link } from "react-router-dom";
import axios from "./axios";
import { usersLessons, ownLessons } from "./actions";
import { Link } from "react-router-dom";

// import { socket } from "./socket";

import { connect } from "react-redux";

class YourLessons extends React.Component {
    constructor() {
        super();
        this.state = {};

        // this.props = this.props.bind(this);
    }

    async componentDidMount() {
        // this.props.closeMenu();
        await axios
            .get("/get-started-lessons")
            .then(rslt => {
                console.log("yourlessons did mount result", rslt.data);
                console.log("yourlessos did mount this.props", this.props);
                this.props.dispatch(usersLessons(rslt.data));
            })
            .catch(err => {
                console.log("get started lessons error", err);
            });
        axios.get("/get-your-created-lessons").then(rslt => {
            console.log("/get-your-created-lessons result", rslt);
            this.props.dispatch(ownLessons(rslt.data));
        });
    }

    render() {
        console.log("this.props in render", this.props);
        if (!this.props.completed || !this.props.onGoing) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        } else {
            return (
                <div className="usersLessons-container">
                    <div className="usersLessons-column">
                        <h2>Completed lessons</h2>
                        {!!this.props.completed &&
                            this.props.completed.map(lesson => (
                                <div key={lesson.parent_lesson_id}>
                                    <Link
                                        to={`/lesson/${
                                            lesson.parent_lesson_id
                                        }`}
                                    >
                                        <p>#{lesson.parent_lesson_id}</p>
                                    </Link>
                                </div>
                            ))}
                    </div>
                    <div className="usersLessons-column">
                        <h2>Started lessons</h2>
                        {!!this.props.onGoing &&
                            this.props.onGoing.map(lesson => (
                                <div key={lesson.parent_lesson_id}>
                                    <Link
                                        to={`/lesson/${
                                            lesson.parent_lesson_id
                                        }`}
                                    >
                                        <p>#{lesson.parent_lesson_id}</p>
                                    </Link>
                                </div>
                            ))}
                    </div>
                    <div className="usersLessons-column">
                        <h2>Lessons what you created</h2>
                        {!!this.props.ownLessons &&
                            this.props.ownLessons.map(lesson => (
                                <div key={lesson.id}>
                                    <Link to={`/lesson/${lesson.id}`}>
                                        <p>#{lesson.id}</p>
                                    </Link>
                                </div>
                            ))}
                    </div>
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
            completed: state.usersLessons
                .reverse()
                .filter(lesson => lesson.completed == true),
            onGoing: state.usersLessons
                .reverse()
                .filter(lesson => lesson.completed == false),
            ownLessons: state.ownLessons
        };
    }
};

export default connect(mapStateToProps)(YourLessons);
