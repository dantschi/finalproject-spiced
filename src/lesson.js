import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import AudioPlayer from "react-h5-audio-player";
// import ReactPlayer from "react-player";
// import ReactAudioPlayer from "react-audio-player";

import { Link } from "react-router-dom";

class Lesson extends React.Component {
    constructor(props) {
        super(props);
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
                <div className="lesson-container">
                    <div className="lesson-box-left">
                        <p>Lesson {this.state.lesson.id} </p>
                        <p>
                            Created by {this.state.lesson.creator_first}{" "}
                            {this.state.lesson.creator_last}
                        </p>
                        <h3>Goal of this lesson</h3>
                        <p>{this.state.lesson.goal}</p>
                        <h3>Title</h3>
                        <p>{this.state.lesson.title}</p>

                        <h3>Challenge</h3>
                        <p>{this.state.lesson.challenge}</p>
                        <h3>Description</h3>
                        <p>{this.state.lesson.description}</p>
                        <h4>Voice note for the assignment</h4>
                        {this.state.lesson.recording_url && (
                            <AudioPlayer
                                src={this.state.lesson.recording_url}
                                preload="none"
                            />
                        )}
                    </div>
                    <div className="lesson-box-right">
                        {this.props.userData.id !=
                            this.state.lesson.user_id && (
                            <button onClick={this.startThisLesson}>
                                Start this lesson
                            </button>
                        )}
                        {this.props.userData.id ==
                            this.state.lesson.user_id && (
                            <h3>
                                You are the creator of this lesson! Thanks,{" "}
                                {this.props.userData.first}!
                            </h3>
                        )}
                    </div>
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
