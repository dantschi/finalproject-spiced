import React from "react";
import axios from "./axios";
import { connect } from "react-redux";
import { socket } from "./socket";

export class CreateLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        // this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleChange(e) {
        // console.log(e.target.name, e.target.value, this.state);
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

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

        socket.emit("newLesson", this.state.data);

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
                            <p className="input-label">Title</p>
                            <div className="input-wrapper">
                                <input
                                    name="title"
                                    type="text"
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
                                    name="externalUrl"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Title"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Description</p>
                            <div className="input-wrapper">
                                <textarea
                                    name="description"
                                    type="text"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <p className="input-label">Recording</p>
                            <div className="input-wrapper">
                                <h4>Recorder</h4>
                            </div>
                        </div>
                    </div>

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
