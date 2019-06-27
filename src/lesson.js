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
        this.acceptAnswer = this.acceptAnswer.bind(this);
        this.submitLesson = this.submitLesson.bind(this);
        this.tryAgain = this.tryAgain.bind(this);
        // this.handleChangeNotes = this.handleChangeNotes.bind(this);
    }

    componentDidMount() {
        console.log("this.props in get-lesson", this.props);
        axios
            .get("/get-lesson-data/" + this.props.match.params.id)
            .then(rslt => {
                console.log("/get-lesson-data GET response from server", rslt);

                this.setState(
                    {
                        started: rslt.data[0],
                        lesson: rslt.data[1][0]
                    },
                    () => console.log("this.state", this.state)
                );
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
            tempRec: null
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
        // console.log(this.state);
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

    // handleChangeNotes(e) {
    //     this.setState({
    //         lesson: {
    //             ...this.state.lesson,
    //             lesson_notes: e
    //         }
    //     });
    // }

    submitLesson() {
        console.log("submitLesson this.state", this.state);
        if (!this.state.tempUrl) {
            console.log("submit lesson without audio");
            console.log("textAnswer", this.state.data.textanswer);
            axios
                .post("/submit-lesson-without-audio", {
                    answer: this.state.data.textanswer,
                    parent_lesson_id: this.state.lesson.parent_id
                })
                .then(rslt => {
                    console.log("submit lesson result", rslt);
                })
                .catch(err => {
                    console.log("submit lesson error", err);
                });
        } else {
            console.log("submit lesson with audio");
            console.log("this.state.tempRec", this.state.tempRec);
            const formData = new FormData();
            formData.append("rec", this.state.tempRec);
            formData.append("answer", this.state.data.textanswer);
            formData.append("parent_lesson_id", this.state.lesson.parent_id);
            for (var pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }
            socket.emit("newLesson", {
                text: this.state.data.textanswer,
                formData: formData
            });
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

    acceptAnswer(e, i) {
        console.log("accept answer fires", e, i);
        socket.emit("acceptAnswer", {
            user_id: e,
            lesson_parent_id: this.state.lesson.parent_id
        });
        socket.on("answerAccepted", rslt => {
            console.log(rslt);
            let updated = this.state.started;
            updated[i].completed = true;

            this.setState({
                ...this.state,
                started: updated
            });
        });
    }

    tryAgain(e, i) {
        console.log("accept answer fires", e, i);
        socket.emit("tryAgain", {
            user_id: e,
            lesson_parent_id: this.state.lesson.parent_id
        });
        socket.on("answerSentBack", rslt => {
            console.log(rslt);
            let updated = this.state.started;
            updated[i].lesson_submitted = false;

            this.setState({
                ...this.state,
                started: updated
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
            let creator =
                this.props.userData.id == this.state.lesson.creator_id;
            let notStarted = this.state.lesson.completed === null;
            let completed = this.state.lesson.completed == true;
            let submitted = this.state.lesson.lesson_submitted == true;
            let textAnswer = this.state.lesson.text_answer;
            let audioAnswer = this.state.lesson.audio_answer;
            let tempAudio = this.state.tempUrl;

            // console.log("creator", creator);
            // console.log("notStarted", notStarted);
            // console.log("completed", completed);
            // console.log("!creator && notStarted", !creator && notStarted);
            // console.log("lesson this.state, props", this.state, this.props);
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
                        {/* CREATOR */}

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
                                {this.state.started.map((user, index) => (
                                    <div
                                        className="user-box"
                                        key={user.user_id}
                                    >
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                        <p>Answer: {user.text_answer}</p>
                                        {user.audio_answer && (
                                            <React.Fragment>
                                                <p>Recording: </p>
                                                <AudioPlayer
                                                    src={user.audio_answer}
                                                    preload="none"
                                                />
                                            </React.Fragment>
                                        )}
                                        {user.completed == false && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        this.acceptAnswer(
                                                            user.user_id,
                                                            index
                                                        )
                                                    }
                                                >
                                                    Accept answer
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        this.tryAgain(
                                                            user.user_id,
                                                            index
                                                        );
                                                    }}
                                                >
                                                    Try again
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

                        {/* COMPLETED */}

                        {completed && (
                            <div>
                                <h2>You have already completed this lesson</h2>
                                <h3>Your answer was:</h3>
                                <p>{textAnswer}</p>
                                {audioAnswer && (
                                    <AudioPlayer
                                        src={audioAnswer}
                                        preload="none"
                                    />
                                )}
                            </div>
                        )}

                        {/* NOT CREATOR, NOT COMPLETED, NOT STARTED  */}

                        {!creator && !completed && notStarted && (
                            <button onClick={this.startThisLesson}>
                                Start this lesson
                            </button>
                        )}

                        {/* NOT CREATOR, NOT COMPLETED, STARTED */}

                        {!creator && !completed && !notStarted && (
                            // NOT CREATOR, NOT COMPLETED, STARTED || SUBMITTED

                            <React.Fragment>
                                {submitted && (
                                    // NOT CREATOR, NOT COMPLETED, STARTED, SUBMITTED, NOT APPROVED

                                    <React.Fragment>
                                        <div>
                                            <p>
                                                You have submitted this lesson,
                                                but it has not been approved
                                                yet.
                                            </p>

                                            <h2>Your solution was:</h2>
                                            <p>{textAnswer}</p>
                                            {audioAnswer && (
                                                <AudioPlayer
                                                    src={audioAnswer}
                                                    preload="none"
                                                />
                                            )}
                                        </div>
                                    </React.Fragment>
                                )}

                                {/* NOT CREATOR, NOT COMPLETED, STARTED || NOT SUBMITTED */}

                                {!submitted && (
                                    <React.Fragment>
                                        <p>Your answer</p>
                                        <div className="input-wrapper wide">
                                            <textarea
                                                name="textanswer"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        {/* NOT CREATOR, NOT COMPLETED, STARTED, NOT SUBMITTED || AUDIO NOT RECORDED */}

                                        {!this.state.tempUrl && (
                                            <React.Fragment>
                                                <p>Your audio-answer</p>
                                                <Recorder
                                                    closeMenu={
                                                        this.props.closeMenu
                                                    }
                                                    handleFileChange={
                                                        this.handleFileChange
                                                    }
                                                />
                                            </React.Fragment>
                                        )}

                                        {/* NOT CREATOR, NOT COMPLETED, STARTED, NOT SUBMITTED || AUDIO RECORDED */}

                                        {this.state.tempUrl && (
                                            <React.Fragment>
                                                <p>Your audio-answer</p>
                                                <AudioPlayer
                                                    src={this.state.tempUrl}
                                                    preload="none"
                                                />
                                                <button
                                                    onClick={() =>
                                                        this.deleteRecording()
                                                    }
                                                >
                                                    Delete this recording if you
                                                    are not satisfied with it
                                                </button>
                                            </React.Fragment>
                                        )}

                                        <button onClick={this.submitLesson}>
                                            Submit this lesson
                                        </button>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
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

// optional
// <div className="input-row right">
//     <p className="input-label no-width">
//         Notes
//     </p>
//
//     <div className="input-wrapper wide">
//         <textarea
//             defaultValue={
//                 this.state.lesson.lesson_notes
//             }
//             name="notes"
//             type="text"
//             onChange={this.handleChangeNotes}
//         />
//     </div>
// </div>
// <div className="input-row right">
//     <button onClick={this.saveNotes}>
//         Save notes
//     </button>
// </div>
