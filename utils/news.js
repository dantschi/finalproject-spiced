const https = require("https");
const { newsApiKey } = require("./secret.json");

module.exports.getNews = function getNews(tag, cb) {
    console.log("getNews fires!, Tag:", tag);
    const req = https
        .request(
            {
                host: `https://newsapi.org/v2/everything`,
                path: `?q=${tag}&apiKey=${newsApiKey}`,
                method: "GET"
            },
            res => {
                if (res.statusCode != 200) {
                    cb(new Error(res.statusCode));
                } else {
                    console.log(res);
                    let body = "";
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
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
