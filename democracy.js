var fs = require("fs");

module.exports = {
  commands: [],
  users: [],

  write: function (user, command) {
    if (!~this.users.indexOf(user['display-name'])) {
      this.users.push(user['display-name']);
      this.commands.push(command);
    }
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

    this.commands = [];
    this.users = [];

    var random_number = (Math.random() * most_frequent_element.length);
    var chosen_command = most_frequent_element[Math.floor(random_number)];

    fs.appendFile("res/command_list.txt", chosen_command + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written: " + chosen_command);
    });
  }
}
