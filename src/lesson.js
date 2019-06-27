import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import AudioPlayer from "react-h5-audio-player";
import { Recorder } from "./recorder";
import { socket } from "./socket";
import { Link } from "react-router-dom";
// import ReactPlayer from "react-player";
// import ReactAudioPlayer from "react-audio-player";

// import { Link } from "react-router-dom";

class Lesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            lesson: {},
            error: "",
            loopLesson: false
        };
        this.startThisLesson = this.startThisLesson.bind(this);
        this.saveNotes = this.saveNotes.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.deleteRecording = this.deleteRecording.bind(this);
        this.loopToggle = this.loopToggle.bind(this);
    }

    componentDidMount() {
        console.log("this.props in get-lesson", this.props);
        axios
            .get("/get-lesson-data/" + this.props.match.params.id)
            .then(rslt => {
                console.log("/get-lesson-data GET response from server", rslt);

                this.setState({
                    lesson: rslt.data[1]["0"],
                    started: rslt.data[0]
                });
            });
    }

    loopToggle() {
        this.setState({
            loopLesson: !this.state.loopLesson
        });
    }

    deleteRecording() {
        this.setState({
            tempUrl: "",
            tempData: null
        });
    }

    handleFileChange(e) {
        console.log("handleFileChange", e);

        this.setState({
            tempRec: e.data,
            tempUrl: e.tempUrl
        });
    }

    handleChange(e) {
        console.log(this.state);
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

    submitLesson() {
        if (!this.state.tempRec) {
            axios
                .post("/submit-lesson-without-audio", this.state.data)
                .then(rslt => {
                    console.log(rslt);
                    // this.setState({
                    //     data: {
                    //         categories: "",
                    //         challenge: "",
                    //         description: "",
                    //         goal: "",
                    //         title: "",
                    //         externalUrl: ""
                    //     }
                    // });
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            let formData = new FormData();

            formData.append("rec", this.state.tempRec);
            formData.append("answer", this.state.textanswer);
            // socket.emit("newLesson", this.state.data);
            axios
                .post("/submit-lesson-with-audio", formData)
                .then(rslt => {
                    console.log(rslt);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    saveNotes() {
        console.log("savenotes fires");
        socket.emit("newNote", {
            note: this.state.data.notes,
            parent_id: this.state.lesson.started_lesson_id
        });
        socket.on("addNoteResult", rslt => {
            console.log("addNoteResult", rslt);
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
                    lesson: {
                        ...this.state.lesson,
                        completed: false,
                        started_id: rslt.data.id
                    }
                });
            })
            .catch(err => {
                console.log;
                console.log("/start-lesson error", err);
            });
    }

    acceptAnswer(e) {
        console.log("accept answer fires", e);
        socket.emit("acceptAnswer", {
            user_id: e,
            lesson_parent_id: this.state.lesson.parent_id
        });
        socket.on("answerAccepted", rslt => {
            console.log(rslt);
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
            let creator =
                this.props.userData.id == this.state.lesson.creator_id;
            let notStarted = this.state.lesson.completed === null;
            let completed = this.state.lesson.completed == true;

            console.log("creator", creator);
            console.log("notStarted", notStarted);
            console.log("completed", completed);
            console.log("!creator && notStarted", !creator && notStarted);
            console.log("lesson this.state, props", this.state, this.props);
            return (
                <div className="lesson-container">
                    <div className="lesson-box-left">
                        <p>Lesson {this.state.lesson.parent_id} </p>
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
                        {this.state.lesson.recording_url && (
                            <div>
                                <h3>Voice note for the assignment</h3>

                                <AudioPlayer
                                    src={this.state.lesson.recording_url}
                                    preload="none"
                                    loop={this.state.loopLesson}
                                />
                                <p onClick={this.loopToggle}>Loop it!</p>
                            </div>
                        )}
                        {this.state.lesson.external_url && (
                            <React.Fragment>
                                <h4>External source</h4>
                                <a
                                    className="ext-box"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={this.state.lesson.external_url.url}
                                >
                                    <div className="external-url-wrapper">
                                        <div className="external-url-img-box">
                                            <img
                                                src={
                                                    this.state.lesson
                                                        .external_url.imageurl
                                                }
                                            />
                                            <p>
                                                {
                                                    this.state.lesson
                                                        .external_url.name
                                                }
                                            </p>
                                        </div>
                                        <p>
                                            {
                                                this.state.lesson.external_url
                                                    .desc
                                            }
                                        </p>
                                    </div>
                                </a>
                            </React.Fragment>
                        )}
                    </div>

                    <div className="lesson-box-right">
                        {creator && (
                            <div className="lesson-starters-list">
                                <h3>
                                    You are the creator of this lesson! Thanks,{" "}
                                    {this.props.userData.first}!
                                </h3>
                                <h4>
                                    People who started lesson #
                                    {this.state.lesson.parent_id}:
                                </h4>
                                {this.state.started.map(user => (
                                    <div
                                        className="user-box"
                                        key={user.user_id}
                                    >
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                        <p>Answer: {user.text_answer}</p>
                                        <p>Recording: </p>
                                        <AudioPlayer
                                            src={this.state.tempUrl}
                                            preload="none"
                                        />
                                        {user.completed == false && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        this.acceptAnswer(
                                                            user.user_id
                                                        )
                                                    }
                                                >
                                                    Accept answer
                                                </button>
                                            </div>
                                        )}
                                        {user.completed == true && (
                                            <p>
                                                Completed! You have already
                                                accepted the answer of{" "}
                                                {user.first}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!creator && notStarted && (
                            <button onClick={this.startThisLesson}>
                                Start this lesson
                            </button>
                        )}
                        {!creator && !notStarted && (
                            <div>
                                <h1>Not creator, started but not completed!</h1>
                                <div className="input-row right">
                                    <p className="input-label no-width">
                                        Your answer
                                    </p>
                                    <div className="input-wrapper wide">
                                        <textarea
                                            name="textanswer"
                                            type="text"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                {!this.state.tempUrl && (
                                    <div className="input-row right">
                                        <p className="input-label no-width">
                                            Recording
                                        </p>
                                        <div className="input-wrapper wide">
                                            <Recorder
                                                closeMenu={this.props.closeMenu}
                                                handleFileChange={
                                                    this.handleFileChange
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {this.state.tempUrl && (
                                    <div className="input-row right">
                                        <p className="input-label no-width">
                                            Your recording
                                        </p>
                                        <div className="input-wrapper wide">
                                            <AudioPlayer
                                                src={this.state.tempUrl}
                                                preload="none"
                                            />
                                            <button
                                                onClick={() =>
                                                    this.deleteRecording()
                                                }
                                            >
                                                Delete this recording if you are
                                                not satisfied with it
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="input-row">
                                    <button onClick={this.submitLesson}>
                                        Submit this lesson
                                    </button>
                                </div>
                                <div className="input-row right">
                                    <p className="input-label no-width">
                                        Notes
                                    </p>
                                    <div className="input-wrapper wide">
                                        <textarea
                                            name="notes"
                                            type="text"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-row right">
                                    <button onClick={this.saveNotes}>
                                        Save notes
                                    </button>
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
