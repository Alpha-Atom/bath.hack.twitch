module.exports = {
  anarcho_write: function (user, command) {
    fs.writeFile("command_list.txt", command, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Command written");
    )}
  }
}
