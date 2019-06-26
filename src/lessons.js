import React from "react";
import { connect } from "react-redux";
import { getLessons } from "./actions";
import axios from "./axios";

import { Route, Link } from "react-router-dom";

export class Lessons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("lessons did mount, props, state", this.props, this.state);
        axios
            .get("/get-lessons")
            .then(rslt => {
                console.log(rslt);
                this.props.dispatch(getLessons(rslt));
            })
            .catch(err => {
                console.log(err);
            });
        // axios.get("/get-lessons").then(rslt => {
        //     console.log("get-lessons result", rslt.data);
        //     this.props.dispatch(getLessons(rslt.data));
        // });
    }

    render() {
        if (!this.props.lessons) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        } else {
            console.log("this.props in lessons render", this.props.lessons);
            return (
                <div className="lessons-container">
                    {!!this.props.lessons.length &&
                        this.props.lessons.map(lesson => (
                            <div className="lessons-box" key={lesson.id}>
                                <h2>Lesson #{lesson.id}</h2>
                                <div className="lessons">
                                    <div className="lessons-box-abs">
                                        <img src={lesson.creator_img} />
                                    </div>
                                    <p>Title: {lesson.title}</p>

                                    <p>Challenge: {lesson.challenge}</p>
                                    <p>Categories: {lesson.categories}</p>
                                    <Link to={`/lesson/${lesson.id}`}>
                                        Start this lesson now!
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    console.log("lessons state, props", state);
    if (!state.lessons) {
        return {};
    } else {
        return {
            lessons: state.lessons
        };
    }
};

export default connect(mapStateToProps)(Lessons);
