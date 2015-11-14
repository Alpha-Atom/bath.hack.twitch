var fs = require("fs");
module.exports = {
  commands: [],

  write: function (user, command) {
    commands.push(command);
  },

  process: function () {
    if (commands.length === 0) {
      return null;
    }
    var modes = {};

    var most_frequent_element = [commands[0]];
    var highest_mode = 1;

    for (var i = 0; i < commands.length; i++) {

      var element = commands[i];
      if (modes[element] === null) {
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

    commands = [];

    fs.writeFile("res/command_list.txt", most_frequent_element[Math.floor((Math.random() *
           most_frequent_element.length) + 1)] + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    });
  }
}
