const cheerio = require("cheerio");
const https = require("https");

module.exports.getOgDetails = function getOgDetails(url, cb) {
    var data = "";

    https
        .get(url, resp => {
            resp.on("data", chunk => {
                data += Buffer.from(chunk);
            });

            resp.on("end", () => {
                if (resp.statusCode != 200) {
                    cb(new Error(resp.statusCode));
                } else {
                    var $ = cheerio.load(data);
                    let type = $('meta[property="og:type"]').attr("content");
                    let title = $('meta[property="og:title"]').attr("content");
                    let siteUrl = $('meta[property="og:url"]').attr("content");
                    let desc = $('meta[property="og:description"]').attr(
                        "content"
                    );
                    let name = $('meta[property="og:site_name"]').attr(
                        "content"
                    );
                    let img = $('meta[property="og:image"]').attr("content");
                    console.log("om:type", type);
                    let resObj = {
                        type: type || "external page",
                        title: title || "external page",
                        url: siteUrl || "/",
                        desc:
                            desc ||
                            "This is a link to an external page without og tag.",
                        name: name || "external page",
                        imageurl: img || "./logo.svg"
                    };
                    console.log("getOgDetails resObj", resObj);
                    cb(null, resObj);
                }
            });
        })
        .on("error", err => {
            console.log("Error: " + err.message);
        });

    https.end;
};
