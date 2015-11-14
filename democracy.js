var fs = require("fs");

module.exports = {
  commands: [],

  write: function (user, command) {
    this.commands.push(command);
  },

  process: function (client, mode) {
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

    this.commands = [];

    fs.appendFile("res/command_list.txt", most_frequent_element[Math.floor((Math.random() *
           most_frequent_element.length) + 1)] + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    });
  }
}
