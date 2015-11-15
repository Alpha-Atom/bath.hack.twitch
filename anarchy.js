var fs = require("fs");
var leaderboard = require("./leaderboard.js");
var gameboard = require("./gameboard.js");
module.exports = {
  write: function (user, command, position) {
   switch(command){
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

    var correct_command;
    gameboard.loadGameboard();
    correct_command = "I" + gameboard.solution[(position.value + "").charAt(0)].charAt((position.value + "").charAt(1));

    if (command.startsWith("I")) {
      if (command === correct_command) {
        leaderboard.addScore(user["display-name"], 20);
        console.log(user["display-name"] + " was awarded 20 points! They now have: " + leaderboard.getScore(user["display-name"], false));
      } else {
        leaderboard.removeScore(user["display-name"], 1);
        console.log(user["display-name"] + " was deducted 1 points! They now have: " + leaderboard.getScore(user["display-name"], false));
      }
    }

    fs.appendFile("res/command_list.txt", command + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }
}
