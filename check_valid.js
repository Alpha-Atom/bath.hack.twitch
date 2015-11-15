var ProgressBar = require('progress');
var leaderboard = require("./leaderboard.js");
var command_regex = /(up|down|left|right|[1-9]|delete|anarchy|democracy|!score|!leaderboard|meme|memes)/;
var votes = { 
  "anarchy":   2,
  "democracy": 2,
};

var bar = new ProgressBar('  :title [:bar] :percent', {
      complete: '='
    , incomplete: ' '
    , width: 25
    , total: 100
  });

var forward = function(tick_amount) { 
  process.stdout.write('\033[2J');
    bar.tick(tick_amount, { title: 'To Anarchy: ' });
  };

var backward = function (tick_amount) {
    bar.tick(-tick_amount, { title: 'To Democracy' });
  };


var timeout_command = false;
module.exports = {
  mode: false,
  users: [],

  reset_user_votes_for_mode: function() {
    this.users = [];
  },

  check_valid_format_command: function (message, user, client) {
    var command_type = message.match(command_regex);
    if (command_type !== null) {
      command_type = command_type[0];
      switch (command_type) {
        case "up":
          command_type = "MU";
        break;
        case "down":
          command_type = "MD";
        break;
        case "left":
          command_type = "ML";
        break;
        case "right":
          command_type = "MR";
        break;
        case "delete":
          command_type = "D";
        break;
        case "anarchy":
          if (!~this.users.indexOf(user['display-name'])) {
            votes["anarchy"] += 1;
            this.users.push(user['display-name']);
            if (((votes["anarchy"]) / (votes["anarchy"] + votes["democracy"])) > 0.3) {
              this.mode = false;
            }
          
          forward(((votes["anarchy"]) / (votes["anarchy"] + votes["democracy"]) * 100) - bar.curr);

          }
        break;
        case "democracy":
          if (!~this.users.indexOf(user['display-name'])) {
            votes["democracy"] += 1;
            this.users.push(user['display-name']);
            if (((votes["democracy"]) / (votes["anarchy"] + votes["democracy"])) > 0.5) {
              this.mode = true;
            }
          }
        break;
        case "!score":
          var score = leaderboard.getScore(user['display-name'], true);
          if (timeout_command === false) {
            client.say("#twitchsolvessudoku",user['display-name'] + ", you have accumulated: " + score + ((score === 1) ? " point!" : " points!"));
            timeout_command = true;
            setTimeout(function(){timeout_command=false}, 10000);
          }
        break;
        case "meme":
          if (timeout_command === false) {
            client.say("#twitchsolvessudoku", "Did you mean maymay?");
            timeout_command = true;
            setTimeout(function(){timeout_command=false}, 10000);
          }
        break;
        case "memes":
          if (timeout_command === false) {
            client.say("#twitchsolvessudoku", "Did you mean maymays?");
            timeout_command = true;
            setTimeout(function(){timeout_command=false}, 10000);
          }
        break;
        default:
          break;
      }
      if (command_type.match(/[1-9]/) !== null) {
        command_type = "I" + command_type;
      }
      return {
        "valid": true,
        "content": command_type
      };
    } else {
      return {
        "valid": false,
        "content": message
      };
    }
  }
}
