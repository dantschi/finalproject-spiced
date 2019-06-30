const https = require("https");
const { newsApiKey } = require("./secret.json");

module.exports.getNews = function getNews(tag, cb) {
    console.log("getNews fires!, Tag:", tag);

    const req = https
        .get(
            `https://newsapi.org/v2/everything?q=${tag}&apiKey=${newsApiKey}`,
            res => {
                if (res.statusCode != 200) {
                    cb(new Error(res.statusCode));
                } else {
                    console.log(res.status, res.total);
                    let body = "";
                    res.on("data", chunk => (body += chunk)).on("end", () => {
                        try {
                            console.log("newsapi body");
                            body = JSON.parse(body);

                            cb(null, body.articles);
                        } catch (err) {
                            console.log("response error", err);
                        }
                    });
                }
            }
        )
        .on("error", err => {
            console.log("ERROR: " + err);
        });
    https.end;
};

// var url =
//     "https://newsapi.org/v2/top-headlines?" +
//     "country=us&" +
//     "apiKey=16a1eafc63ce49edae568c5780ddb4e7";
// var req = new Request(url);
// fetch(req).then(function(response) {
//     console.log(response.json());
// });
