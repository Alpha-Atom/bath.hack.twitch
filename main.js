var irc       = require("tmi.js");
var fs        = require("fs");
var checker   = require("./check_valid.js");
var democracy = require("./democracy.js");
var anarchy   = require("./anarchy.js");
var leaderboard = require("./leaderboard.js");
var SECONDS    = 1000;
var position  = {
  value: 00
};

var options = {
  options: {
    debug: false
  },
  connection: {
    random: "chat",
    reconnect: true
  },
  identity: {
    username: "TwitchSolvesSudoku",
    password: "oauth:d25xs9dmdz2glaoesdm7kn20l10o1l"
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
process.stdout.write("\033c");

// Spoof an anarchy message
checker.check_valid_format_command("anarchy", "bot", client);

client.on("chat", function (channel, user, message, self) {
  var message_formatted;
  if (self === false) {
    message_formatted = checker.check_valid_format_command(message, user["display_name"], client);
    if (message_formatted["valid"] === true) {
      if (checker.mode === true) {
        democracy.write(user["display_name"], message_formatted["content"], position);
      } else {
        anarchy.write(user["display_name"], message_formatted["content"], position);
      }
    }
  }
});
setInterval(function(){democracy.process(client, checker.mode, position)}, 15*SECONDS);
setInterval(function(){checker.reset_user_votes_for_mode()}, 60*SECONDS);
