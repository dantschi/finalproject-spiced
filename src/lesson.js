import React from "react";
import axios from "./axios";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

class Lesson extends React.Component {
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
                this.setState({
                    lesson: rslt.data
                });
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
                    finished: false
                });
            });
    }

    render() {
        if (!this.state.lesson || !this.props.userData) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Lesson {this.state.lesson.id} </h2>
                    {this.props.userData.id != this.state.lesson.user_id && (
                        <button onClick={this.startThisLesson}>
                            Start this lesson
                        </button>
                    )}
                    {this.props.userData.id == this.state.lesson.user_id && (
                        <h3>
                            You are the creator of this lesson! Thanks,{" "}
                            {this.props.userData.first}!
                        </h3>
                    )}
                </div>
            );
        }
    }
}

const mapStateToProps = (state, props) => {
    console.log("profilepic state, props", state, props);
    if (!state.userData) {
        return {};
    } else {
        return {
            userData: state.userData
        };
    }
};

export default connect(mapStateToProps)(Lesson);
