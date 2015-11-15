var jsonfile = require("jsonfile");
var jQuery = require("jquery");
var util = require("util");

var leaderboard = {};
var old_leaderboard = {};
var path_to_json = "res/leaderboards.json";

module.exports = {

  getScore: function (display_name, get_old) {
    if (undefined === display_name) {
      return 0;
    }
    if (undefined === get_old) {
      get_old = false;
    }
    if (get_old === false) {
      if (display_name in leaderboard) {
        return leaderboard[display_name];
      }
    } else {
      if (display_name in old_leaderboard) {
        return old_leaderboard[display_name];
      }
    }
    return 0;
  },

  addScore: function (display_name, score) {
    if (undefined === score) {
      score = 0;
    }
    if (undefined === display_name) {
      return false;
    }
    if (display_name in leaderboard) {
      leaderboard[display_name] += score;
      return true;
    } else {
      leaderboard[display_name] = score;
      return true;
    }
  },

  removeScore: function (display_name, score) {
    if (undefined === score) {
      score = 0;
    }
    if (undefined === display_name) {
      return false;
    }
    if (display_name in leaderboard) {
      leaderboard[display_name] -= score;
      return true;
    } else {
      return false;
    }
  },

  removeUser: function (display_name) {
    if (undefined === display_name) {
      return false;
    }
    if (display_name in leaderboard) {
      leaderboard[display_name] = 0;
    }
  },

  saveToFile: function () {
    jsonfile.writeFile(path_to_json, leaderboard, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("Successfully wrote leaderboard to file.");
    old_leaderboard = $.extend(true, {}, leaderboard);
    });
  },

  loadFromFile: function() {
    jsonfile.readFile(path_to_json, leaderboard, function(err, obj) {
      if (err) {
        return console.error(err);
      }
      leaderboard = obj;
      old_leaderboard = $.extend(true, {}, leaderboard);
    });
  }

}
