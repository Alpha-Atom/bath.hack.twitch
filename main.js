var options = {
    options: {
        debug: true
    },
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
        username: "TwitchSolvesSudoku",
        password: "oauth:32l6fq5c829gi3hivx6gvv8rod4sji"
    },
    channels: ["#TwitchSolvesSudoku"]
};

var client = new irc.client(options);

// Connect the client to the server..
client.connect();
