var fs = require("fs");
var leaderboard = require("./leaderboard.js");
var gameboard = require("./gameboard.js");

module.exports = {
  commands: [],
  users: [],

  write: function (user, command, position) {
    if (!~this.users.indexOf(user['display-name'])) {
      this.users.push(user['display-name']);
      this.commands.push(command);
    }
  },

  process: function (client, mode, position) {
    if (mode === false) {
      return;
    }
    client.say("#twitchsolvessudoku","Beginning democracy process!");
    if (this.commands.length === 0) {
      return null;
    }
    var modes = {};

    var most_frequent_element = [this.commands[0]];
    var highest_mode = 1;

    for (var i = 0; i < this.commands.length; i++) {

      var element = this.commands[i];
      if (modes[element] === undefined) {
        modes[element] = 1;
      } else {
        modes[element] ++;
      }

      if (modes[element] > highest_mode) {
        most_frequent_element = [element];
        highest_mode = modes[element];
      } else if (modes[element] === highest_mode) {
        most_frequent_element.push(element);
      }

    }

    var random_number = (Math.random() * most_frequent_element.length);
    var chosen_command = most_frequent_element[Math.floor(random_number)];

    switch(chosen_command){
      case "MU":
        position.value -= 10;
        break;
      case "MD":
        position.value += 10;
        break;
      case "ML":
        position.value --;
        break;
      case "MR":
        position.value ++;
        break;
      default:
        break;
    }

    var correct_command = null;
    gameboard.loadGameboard();
    correct_command = "I" + gameboard.solution[(position + "").charAt(0)].charAt((position + "").charAt(0));

    if (chosen_command.startsWith("I")) {
      //update leaderboard
      for (var i = 0; i < commands.length; i+=1) {
        if (commands[i] === correct_command) {
          leaderboard.addScore(users[i], 5);
        } else {
          leaderboard.removeScore(users[i], 1);
        }
      }
    }

    fs.appendFile("res/command_list.txt", chosen_command + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written: " + chosen_command);
    });

    this.commands = [];
    this.users = [];
  }
}
