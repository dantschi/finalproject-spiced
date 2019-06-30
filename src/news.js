import React from "react";
import axios from "./axios";

export class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: []
        };

        this.getNews = this.getNews.bind(this);
    }

    componentDidMount() {
        this.getNews();
    }

    getNews() {
        axios
            .get("/get-news")
            .then(rslt => {
                console.log("/getNews result", rslt);
                this.setState(
                    {
                        ...this.state,
                        news: rslt.data
                    },
                    () => console.log(this.state)
                );
            })
            .catch(err => {
                console.log("getNews error", err);
            });
    }

    render() {
        if (!this.state.news.length) {
            return <h1>Loading</h1>;
        }
        return (
            <React.Fragment>
                {/*
                <div onClick={this.getNews} className="btn-getnews">
                    Get News
                </div>
                */}
                <div className="news-container">
                    {this.state.news.map((news, i) => (
                        <div className="news-box" key={i}>
                            <a
                                href={news.url}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <div className="news-box-left">
                                    <div className="news-box-img-container">
                                        <img src={news.urlToImage} />{" "}
                                    </div>
                                </div>
                            </a>
                            <div className="news-box-right">
                                <h2>{news.title}</h2>
                                <p>{news.description}</p>
                                <p>{news.author || "author"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}
