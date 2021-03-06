var fs = require("fs");
var leaderboard = require("./leaderboard.js");
var gameboard = require("./gameboard.js");
module.exports = {
    write: function (user, command, position) {
        var position_old = position.value;
        switch(command){
            case "MU":
                position_old = position.value;
                position.value -= 10;
                if ((position.value + "").charAt(0) < 0) {
                    position.value = position_old;
                }
                break;
            case "MD":
                position_old = position.value;
                position.value += 10;
                if ((position.value + "").charAt(0) > 8) {
                    position.value = position_old;
                }
                break;
            case "ML":
                position_old = position.value;
                position.value --;
                if ((position.value + "").charAt(1) < 0) {
                    position.value = position_old;
                }
                break;
            case "MR":
                position_old = position.value;
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
        correct_command = "I" + (gameboard.solution[(position.value + "").charAt(0)] + "").charAt((position.value + "").charAt(1));

        if (command.startsWith("I")) {
            if (command === correct_command) {
                leaderboard.addScore(user, 20);
            }  else {
                leaderboard.removeScore(user, 1);
            }
        }

        fs.appendFile("res/command_list.txt", command + "\n", function(err) {
            if (err) {
                return console.log(err);
            }
        });
    }
};
