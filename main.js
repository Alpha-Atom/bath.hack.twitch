var irc       = require("tmi.js");
var fs        = require("fs");
var checker   = require("./check_valid.js");
var democracy = require("./democracy.js");
var anarchy   = require("./anarchy.js");
var leaderboard = require("./leaderboard.js");
var MILLIS    = 1000;
var position  = {
  value: 00
};

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
try {
  fs.unlinkSync('res/command_list.txt');
} catch (err) {
  console.log("Was not able to delete command list.");
}
fs.writeFileSync('res/command_list.txt', '');

leaderboard.loadFromFile();
var client = new irc.client(options);

// Connect the client to the server..
client.connect();
client.on("chat", function (channel, user, message, self) {
  var message_formatted;
  if (self === false) {
    message_formatted = checker.check_valid_format_command(message, user, client);
    if (message_formatted["valid"] === true) {
      if (checker.mode === true) {
        console.log("Command Processed: " + message_formatted["content"]);
        democracy.write(user, message_formatted["content"], position);
      } else {
        console.log("Command Processed: " + message_formatted["content"]);
        anarchy.write(user, message_formatted["content"], position);
      }
    }
  }
});
setInterval(function(){democracy.process(client, checker.mode, position)}, 15*MILLIS);
setInterval(function(){checker.reset_user_votes_for_mode()}, 60*MILLIS);
