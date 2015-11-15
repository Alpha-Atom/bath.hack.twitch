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

    var position_old = position.value;
    switch(chosen_command){
      case "MU":
        position.value -= 10;
        if ((position.value + "").charAt(0) < 0) {
          position.value = position_old;
        }
        break;
      case "MD":
        position.value += 10;
        if ((position.value + "").charAt(0) > 8) {
          position.value = position_old;
        }
        break;
      case "ML":
        position.value --;
        if ((position.value + "").charAt(1) < 0) {
          position.value = position_old;
        }
        break;
      case "MR":
        position.value ++;
        if ((position.value + "").charAt(1) > 8) {
          position.value = position_old;
        }
        break;
      default:
        break;
    }

    var correct_command = null;
    gameboard.loadGameboard();
    correct_command = "I" + gameboard.solution[(position.value + "").charAt(0)].charAt((position.value + "").charAt(1));

    if (chosen_command.startsWith("I")) {
      //update leaderboard
      for (var i = 0; i < this.commands.length; i+=1) {
        if (this.commands[i] === correct_command) {
          leaderboard.addScore(this.users[i], 5);
          console.log(this.users[i] + " was awarded 5 points! They now have: " + leaderboard.getScore(this.users[i], false));
        } else {
          leaderboard.removeScore(this.users[i], 1);
          console.log(this.users[i] + " was deducted 1 point! They now have: " + leaderboard.getScore(this.users[i], false));
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
