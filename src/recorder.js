import React from "react";
import axios from "./axios";

export class Recorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.record = this.record.bind(this);
        this.stopRecord = this.stopRecording.bind(this);

        this.getNews = this.getNews.bind(this);
    }

    componentDidMount() {
        this.props.closeMenu();
    }

    record() {
        this.setState({ record: true });
        if (this.state.record) {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(stream => {
                    var mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();

                    const audioChunks = [];

                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener("stop", () => {
                        let formData = new FormData();
                        const audioBlob = new Blob(audioChunks, {
                            type: "audio/webm"
                        });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        console.log(
                            "audioChunks",
                            audioBlob,
                            audioChunks,
                            audio
                        );

                        formData.append("rec", audioBlob);
                        axios
                            .post("/audio-recorded", formData)
                            .then(rslt => {
                                console.log(rslt);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });

                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 3000);
                });
        }
    }

    stopRecording() {
        this.setState({
            record: false
        });
        mediaRecorder.stop();
        console.log("stopRecord fires");
    }

    getNews() {
        console.log("getNews");
        axios
            .get("/get-news")
            .then(rslt => {
                console.log("getNews rslt", rslt);
            })
            .catch(err => {
                console.log("getNews error", err);
            });
    }

    render() {
        return (
            <div className="recorder-container">
                <h2>Recorder is here</h2>

                <div className="buttons">
                    <button onClick={this.record} id="btn-record">
                        record
                    </button>
                    <button onClick={this.stopRecording} id="btn-stop">
                        stop
                    </button>
                    <button id="btn-play">play</button>

                    <button onClick={this.getNews} id="btn-getnews">
                        Get News
                    </button>
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
