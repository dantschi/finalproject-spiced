import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import { socket } from "./socket";
import AudioPlayer from "react-h5-audio-player";

import { Recorder } from "./recorder";

class CreateLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.deleteRecording = this.deleteRecording.bind(this);
    }

    componentDidMount() {}

    deleteRecording() {
        this.setState({
            tempUrl: "",
            tempData: null
        });
    }

    handleChange(e) {
        // console.log(e.target.name, e.target.value, this.state);
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            error: ""
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
    // if (e.target.files[0].size > 2097152) {
    //     this.setState({
    //         ...this.state,
    //         error: "Maximal file size is 2MB"
    //     });
    // } else {
    //     this.setState({
    //         file: e.target.files[0],
    //         error: null
    //     });
    // }

    // handleFileChange(e) {
    //     console.log("handleFileChange", e.target.files[0]);
    //     if (e.target.files[0].size > 2097152) {
    //         this.setState({
    //             ...this.state,
    //             error: "Maximal file size is 2MB"
    //         });
    //     } else {
    //         this.setState({
    //             file: e.target.files[0],
    //             error: null
    //         });
    //     }
    // }

    saveChanges() {
        console.log("CreateLesson this.state", this.state);
        let {
            categories,
            challenge,
            description,
            goal,
            title,
            externalUrl
        } = this.state.data;

        if (!categories || !challenge || !description || !goal || !title) {
            this.setState({
                error: "Please fill out the required fields"
            });
        } else {
            if (!this.state.tempRec) {
                axios
                    .post("/add-lesson-without-audio", this.state.data)
                    .then(rslt => {
                        console.log(rslt);
                        this.setState({
                            data: {
                                categories: "",
                                challenge: "",
                                description: "",
                                goal: "",
                                title: "",
                                externalUrl: ""
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                let formData = new FormData();
                formData.append("goal", goal);
                formData.append("title", title);
                formData.append("externalUrl", externalUrl);
                formData.append("desc", description);
                formData.append("challenge", challenge);
                formData.append("categories", categories);
                formData.append("rec", this.state.tempRec);
                // socket.emit("newLesson", this.state.data);
                axios
                    .post("/add-lesson-with-audio", formData)
                    .then(rslt => {
                        console.log(rslt);
                        this.setState({
                            ...this.state,
                            data: {
                                categories: "",
                                challenge: "",
                                description: "",
                                goal: "",
                                title: "",
                                externalUrl: ""
                            },
                            tempUrl: "",
                            tempRec: ""
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

        // console.log("uploader file:", this.state.file);
        // let formData = new FormData();
        // formData.append("file", this.state.file);
        // console.log("handleUpload tihs.state", this.state, formData);
        // axios
        //     .post("/changeuserinfo", formData)
        //     .then(rslt => {
        //         console.log("/changeuserimage POST response", rslt);
        //         // this.props.dispatch(changeUserInfo(rslt.data));
        //     })
        //     .catch(err => {
        //         console.log("/changeuserimage POST error", err);
        //     });
    }

    render() {
        console.log("props");
        return (
            <div className="create-lesson-container">
                <div className="editor-box">
                    <div className="editor-section">
                        <h2 className="input-label">Create lesson</h2>
                    </div>
                    <div className="editor-section">
                        <div className="input-row">
                            <h3 className="input-label">Goal of this lesson</h3>
                            <div className="input-wrapper">
                                <input
                                    value={this.state.data.goal}
                                    name="goal"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Goal of this lesson"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Title</p>
                            <div className="input-wrapper">
                                <input
                                    value={this.state.data.title}
                                    name="title"
                                    type="text"
                                    await
                                    onChange={this.handleChange}
                                    placeholder="Title"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">External url</p>
                            <div className="input-wrapper">
                                <input
                                    value={this.state.data.externalUrl}
                                    name="externalUrl"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="External url (optional)"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <p className="input-label">Description</p>
                            <div className="input-wrapper">
                                <textarea
                                    value={this.state.data.description}
                                    name="description"
                                    type="text"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Challenge</p>
                            <div className="input-wrapper">
                                <input
                                    value={this.state.data.challenge}
                                    name="challenge"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="What is the challenge?"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Categories</p>
                            <div className="input-wrapper">
                                <input
                                    value={this.state.data.categories}
                                    name="categories"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Type here the categories"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        {!this.state.tempUrl && (
                            <div className="input-row">
                                <p className="input-label">Recording</p>
                                <div className="input-wrapper">
                                    <Recorder
                                        // closeMenu={this.props.closeMenu}
                                        handleFileChange={this.handleFileChange}
                                    />
                                </div>
                            </div>
                        )}
                        {this.state.tempUrl && (
                            <div className="input-row">
                                <p className="input-label">Your recording</p>
                                <div className="input-wrapper">
                                    <AudioPlayer
                                        src={this.state.tempUrl}
                                        preload="none"
                                    />
                                    <button
                                        onClick={() => this.deleteRecording()}
                                    >
                                        Delete this recording if you are not
                                        satisfied with it
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {!!this.state.error.length && (
                        <p className="error">{this.state.error}</p>
                    )}
                    <button onClick={() => this.saveChanges()}>
                        Save changes
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("profile state, props", state);
    if (!state.userData) {
        return {};
    } else {
        return {
            userData: state.userData
        };
    }
};

export default connect(mapStateToProps)(CreateLesson);

///////////////////////////////////////////////////////////
// uploadig additional files only when everything else works
///////////////////////////////////////////////////////////
// <div className="input-row">
//     <p className="input-label">Additional file</p>
//     <div className="input-wrapper">
//         <input
//             className="inputfile"
//             id="file"
//             name="file"
//             type="file"
//             onChange={this.handleFileChange}
//         />
//     </div>
// </div>
///////////////////////////////////////////////////////////
