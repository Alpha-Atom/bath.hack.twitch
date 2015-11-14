var fs = require("fs");
module.exports = {
  write: function (user, command, position) {
    fs.appendFile("res/command_list.txt", command + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    });
  }
}
