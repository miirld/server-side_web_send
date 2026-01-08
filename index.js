const express = require("express");
const https = require("https");

const app = express();
const LOGIN = "miirld_";

app.get("/login", (_, res) => {
    res.type("text/plain").send(LOGIN);
});

app.get("/id/:N", (req, res) => {
    const options = {
        hostname: "nd.kodaktor.ru",
        path: `/users/${req.params.N}`,
        method: "GET",
    };

    https.get(options, (response) => {
        let data = "";

        response.on("data", (chunk) => (data += chunk));

        response.on("end", () => {
            try {
                const json = JSON.parse(data);
                json.login
                    ? res.type("text/plain").send(json.login)
                    : res.status(404).send("Login field not found");
            } catch {
                res.status(500).send("Failed to parse upstream response");
            }
        });
    }).on("error", () => {
        res.status(500).send("Upstream request failed");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
