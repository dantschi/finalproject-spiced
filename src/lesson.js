import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";

export class Lesson extends React.Component {
    constructor() {
        super();
        this.state = {
            lesson: {}
        };
        this.startThisLesson = this.startThisLesson.bind(this);
    }

    componentDidMount() {
        console.log("this.props in get-lesson", this.props);
        axios
            .get("/get-lesson-data/" + this.props.match.params.id)
            .then(rslt => {
                console.log(
                    "/get-lesson-data GET response from server",
                    rslt.data
                );

                console.log("result in OtherProfile: ", rslt.data);
                this.setState({ lesson: rslt.data });
            });
    }

    startThisLesson() {
        axios
            .post("/start-lesson", {
                lessonId: this.props.match.params.id
            })
            .then(rslt => {
                console.log("/start-lesson result", rslt);
                this.setState({
                    ...this.state,
                    finished: false
                });
            });
    }

    render() {
        if (!this.state.lesson) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Lesson {this.state.lesson.id} </h2>

                    <button onClick={this.startThisLesson}>
                        Start this lesson
                    </button>
                </div>
            );
        }
    }
}
