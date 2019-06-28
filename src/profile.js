import React from "react";
import ProfilePic from "./profilepic";
import axios from "./axios";
import { changeUserImage, changeUserData } from "./actions";
import { connect } from "react-redux";

export class Profile extends React.Component {
    constructor(props) {
        // console.log("profile props", props);
        super(props);
        this.state = {
            data: {},
            error: ""
        };
        // this.showProps = this.showProps.bind(this);
        // this.deleteAccount = this.deleteAccount.bind(this);
        console.log("profile this.props", this.props);
        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentDidMount() {
        console.log("props in profile componentDidMount", this.props);
        // this.props.closeMenu();
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

    handleFileChange(e) {
        // console.log("handleFileChange", e.target.files[0]);
        if (e.target.files[0].size > 2097152) {
            this.setState({
                ...this.state,
                error: "Maximal file size is 2MB"
            });
        } else {
            this.setState({
                file: e.target.files[0],
                error: null
            });
        }
    }

    async saveChanges() {
        // console.log("saveChanges, this.state", this.state);
        // console.log("uploader file:", this.state.file);

        if (this.state.file) {
            let formData = new FormData();
            formData.append("file", this.state.file);
            formData.append("location", this.state.data.location);
            formData.append("genres", this.state.data.genres);
            formData.append("bands", this.state.data.bands);
            formData.append("instruments", this.state.data.instruments);
            formData.append("description", this.state.data.description);
            // let rslt = await axios.post("/change-user-data-with-image", this.state.data);
            // console.log("/change-user-data-image", rslt);
            axios
                .post("/changeuserdata-with-image", formData)
                .then(rslt => {
                    console.log("/change-user-data-with-image result", rslt);
                    this.props.dispatch(changeUserImage(rslt.data.url));
                })
                .catch(err => {
                    console.log("/changeuserdata-image POST error", err);
                });
        } else {
            axios
                .post("/change-user-data", this.state.data)
                .then(rslt => {
                    console.log("changeUserData result", rslt);
                    this.props.dispatch(changeUserData(rslt.data));
                })
                .catch(err => {
                    console.log("/changeuserdata-image POST error", err);
                });
        }
    }

    render() {
        if (!this.props.userData) {
            return (
                <div className="loading">
                    <img src="./Ajax-loader.gif" />
                </div>
            );
        }
        console.log("props", this.props);
        return (
            <div className="profile-container">
                <div className="editor-box">
                    <div className="editor-section">
                        <h2 className="input-label">Edit profile</h2>
                    </div>
                    <div className="editor-section">
                        <h3 className="input-label">Personal data</h3>
                        <div className="input-row">
                            <p className="input-label">First</p>
                            <div className="input-wrapper">
                                <input
                                    defaultValue={this.props.userData.first}
                                    name="first"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="First name"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Last</p>
                            <div className="input-wrapper">
                                <input
                                    defaultValue={this.props.userData.last}
                                    name="last"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Last name"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="profilepic-box input-label">
                                <ProfilePic
                                    imageurl={this.props.userData.imageurl}
                                    first={this.props.userData.first}
                                    last={this.props.userData.last}
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    className="inputfile"
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={this.handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="editor-section">
                        <div className="input-row">
                            <p className="input-label">Location</p>
                            <div className="input-wrapper">
                                <input
                                    defaultValue={this.props.userData.location}
                                    name="location"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Tell us the city you are"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <p className="input-label">Bands</p>
                            <div className="input-wrapper">
                                <input
                                    defaultValue={this.props.userData.bands}
                                    name="bands"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Tell us the bands you like (comma separated)"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <p className="input-label">Instruments</p>
                            <div className="input-wrapper">
                                <input
                                    defaultValue={
                                        this.props.userData.instruments
                                    }
                                    name="instruments"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Tell us the instruments you are interested in"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="editor-section">
                        <div className="input-row">
                            <p className="input-label">
                                Anything else you want to share with others
                                about yourself
                            </p>
                            <div className="input-wrapper">
                                <textarea
                                    defaultValue={
                                        this.props.userData.description
                                    }
                                    name="description"
                                    type="text"
                                    onChange={this.handleChange}
                                />
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

export default connect(mapStateToProps)(Profile);

// <div className="input-row">
//     <p className="input-label">Genres</p>
//     <div className="input-wrapper">
//         <input
//             defaultValue={this.props.userData.genres}
//             name="genre"
//             type="text"
//             onChange={this.handleChange}
//             placeholder="Tell us the genres you like (comma separated)"
//             autoComplete="new-password"
//         />
//     </div>
// </div>
