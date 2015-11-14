var options = {
    options: {
        debug: true
    },
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
        username: "Schmoopiie",
        password: "oauth:a29b68aede41e25179a66c5978b21437"
    },
    channels: ["#schmoopiie"]
};

var client = new irc.client(options);

// Connect the client to the server..
client.connect();
