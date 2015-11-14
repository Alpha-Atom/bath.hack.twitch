var irc       = require("tmi.js");
var fs        = require("fs");
var checker   = require("./check_valid.js");
var democracy = require("./democracy.js");
var anarchy   = require("./anarchy.js");
var MILLIS    = 1000;
var mode      = false;
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

var client = new irc.client(options);
var toggle_mode = function() { mode = !mode; };

// Connect the client to the server..
client.connect();
client.on("chat", function (channel, user, message, self) {
  var message_formatted;
  if (self === false) {
    message_formatted = checker.check_valid_format_command(message);
    if (message_formatted["valid"] === true) {
      if (mode === true) {
        console.log("Command Processed: " + message_formatted["content"]);
        democracy.write(user, message_formatted["content"]);
      } else {
        console.log("Command Processed: " + message_formatted["content"]);
        anarchy.write(user, message_formatted["content"]);
      }
    }
  }
});
setInterval(function(){democracy.process(client, mode)}, 15*MILLIS);
