var fs = require("fs");
module.exports = {
  write: function (user, command) {
    fs.writeFile("res/command_list.txt", command, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    });
  }
}
