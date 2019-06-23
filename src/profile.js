import React from "react";
import ProfilePic from "./profilepic";

export class Profile extends React.Component {
    constructor(props) {
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

    saveChanges() {
        console.log("saveChanges, this.state", this.state);
    }

    // showProps() {
    //     console.log("this.props in Profile: ", this.props);
    // }

    render() {
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
                            <div className="profilepic-box">
                                <ProfilePic />
                            </div>
                        </div>
                    </div>

                    <div className="editor-section">
                        <div className="input-row">
                            <p className="input-label">Location</p>
                            <div className="input-wrapper">
                                <input
                                    name="location"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Tell us the city you are"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <p className="input-label">Genres</p>
                            <div className="input-wrapper">
                                <input
                                    name="genre"
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Tell us the genres you like (comma separated)"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <p className="input-label">Bands</p>
                            <div className="input-wrapper">
                                <input
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
                                <textarea name="bio" />
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
