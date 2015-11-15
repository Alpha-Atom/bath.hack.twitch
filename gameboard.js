var fs = require("fs");
var leaderboard = require("./leaderboard.js");

var gameboard_name;

module.exports = {

  gameboard: [],
  solution: [],

  loadGameboard: function () {
    var board_tmp;
    if (this.checkGame() === true) {
      board_tmp = fs.readFileSync(gameboard_name + ".txt", 'utf-8');
      gameboard = board_tmp.split("\n");
      solution = fs.readFileSync(gameboard_name + "solution.txt", 'utf-8').split("\n");
      leaderboard.saveToFile();
    }
  },

  checkGame: function () {
    var name_tmp = fs.readFileSync("./res/current_game.txt", 'utf-8');
    if (name_tmp !== gameboard_name) {
      gameboard_name = name_tmp;
      return true;
    }
    return false;
  }

}
