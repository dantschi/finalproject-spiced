import React from "react";
import axios from "./axios";

export class Recorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.record = this.record.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        //
        // this.getNews = this.getNews.bind(this);
    }

    componentDidMount() {
        this.props.closeMenu();
    }

    record() {
        // this.setState({ record: true });

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            var mediaRecorder = (this.mediaRecorder = new MediaRecorder(
                stream
            ));
            var audioDetails = (this.audioDetails = {});
            mediaRecorder.start();

            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
            this.setState({
                onRecord: true
            });
            this.audioDetails.start = new Date();

            mediaRecorder.addEventListener("stop", () => {
                this.setState({
                    onRecord: false
                });
                // let formData = new FormData();
                const audioBlob = new Blob(audioChunks, {
                    type: "audio/webm"
                });
                const audioUrl = URL.createObjectURL(audioBlob);

                this.audioDetails.stop = new Date();
                this.audioDetails.length =
                    (this.audioDetails.stop - this.audioDetails.start) / 1000;
                console.log("length", this.audioDetails.length);

                // formData.append("rec", audioBlob);
                this.props.handleFileChange({
                    data: audioBlob,
                    tempUrl: audioUrl
                });
                // axios
                //     .post("/audio-recorded", formData)
                //     .then(rslt => {
                //         console.log(rslt);
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     });
            });
        });
    }

    stopRecording() {
        if (!this.mediaRecorder) {
            return;
        } else {
            console.log("stopRecord fires");
            this.mediaRecorder.stop();
        }
    }

    render() {
        return (
            <div className="rec-container">
                <div className="rec-buttons">
                    {!this.state.onRecord && (
                        <div className="button">
                            <div onClick={this.record} className="btn-record" />
                        </div>
                    )}
                    {this.state.onRecord && (
                        <div className="button">
                            <div
                                onClick={this.stopRecording}
                                className="btn-stopRecord"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

///////////////////////////////////////////////////
// IN CASE OF FOURSQUARE
///////////////////////////////////////////////////

// this.fourSquare = this.fourSquare.bind(this);

// <button onClick={this.fourSquare} id="btn-foursquare">
//     Foursquare
// </button>

// fourSquare() {
//     console.log("fourSquare");
//     axios
//         .get("/foursquare")
//         .then(rslt => {
//             console.log("/foursquare server response", rslt);
//         })
//         .catch(err => {
//             console.log("/foursquare server error", err);
//         });
// }

///////////////////////////////////////////////////
// IN CASE OF NEWS API
///////////////////////////////////////////////////
//
// <div onClick={this.getNews} className="btn-getnews">
//     Get News
// </div>
