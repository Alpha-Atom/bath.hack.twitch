var fs = require("fs");
module.exports = {
  write: function (user, command, position) {
   switch(command){
      case "MU":
        position.value -= 10;
        break;
      case "MD":
        position.value += 10;
        break;
      case "ML":
        position.value --;
        break;
      case "MR":
        position.value ++;
        break;
      default:
        break;
    }
    fs.appendFile("res/command_list.txt", command + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    });
  }
}
