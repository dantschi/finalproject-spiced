import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import AudioPlayer from "react-h5-audio-player";
import { Recorder } from "./recorder";
// import ReactPlayer from "react-player";
// import ReactAudioPlayer from "react-audio-player";

// import { Link } from "react-router-dom";

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

                this.setState({
                    lesson: rslt.data
                });
            });
    }

    handleFileChange(e) {
        console.log("handleFileChange", e);

        this.setState({
            tempRec: e.data,
            tempUrl: e.tempUrl
        });
        // this.setState({
        //     data: {
        //         ...this.state.data
        //     }
        // });
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
            let creator = this.props.userData.id == this.state.lesson.user_id;
            let notStarted = this.state.lesson.completed === null;
            let completed = this.state.lesson.completed == true;

            console.log("creator", creator);
            console.log("notStarted", notStarted);
            console.log("completed", completed);
            console.log("!creator && notStarted", !creator && notStarted);
            console.log("lesson this.state", this.state);
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
                        <h3>Voice note for the assignment</h3>
                        {this.state.lesson.recording_url && (
                            <AudioPlayer
                                src={this.state.lesson.recording_url}
                                preload="none"
                            />
                        )}
                    </div>
                    <div className="lesson-box-right">
                        {creator && (
                            <h3>
                                You are the creator of this lesson! Thanks,{" "}
                                {this.props.userData.first}!
                            </h3>
                        )}

                        {!creator && notStarted && (
                            <button onClick={this.startThisLesson}>
                                Start this lesson
                            </button>
                        )}
                        {!creator && !notStarted && (
                            <div>
                                <h1>Not creator, started!!!!</h1>
                                <div className="input-row">
                                    <p className="input-label">Your answer</p>
                                    <div className="input-wrapper">
                                        <textarea
                                            name="text-answer"
                                            type="text"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-row">
                                    <p className="input-label">Recording</p>
                                    <div className="input-wrapper">
                                        <Recorder
                                            closeMenu={this.props.closeMenu}
                                            handleFileChange={
                                                this.handleFileChange
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {completed && (
                            <div>
                                <h1>Completed!!!!!!!!</h1>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state, props) => {
    console.log("lesson state, props", state, props);
    if (!state.userData) {
        return {};
    } else {
        return {
            userData: state.userData
        };
    }
};

export default connect(mapStateToProps)(Lesson);
