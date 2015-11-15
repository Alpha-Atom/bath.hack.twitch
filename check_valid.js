var command_regex = /(up|down|left|right|[1-9]|delete|anarchy|democracy)/;
var votes = { 
  "anarchy":   10,
  "democracy": 10,
};
module.exports = {
  mode: false,
  users: [],

  reset_user_votes_for_mode: function() {
    this.users = [];
  },

  check_valid_format_command: function (message, user) {
    var command_type = message.match(command_regex);
    if (command_type !== null) {
      command_type = command_type[0];
      switch (command_type) {
        case "up":
          command_type = "MU";
        break;
        case "down":
          command_type = "MD";
        break;
        case "left":
          command_type = "ML";
        break;
        case "right":
          command_type = "MR";
        break;
        case "delete":
          command_type = "D";
        break;
        case "anarchy":
          if (!~this.users.indexOf(user['display-name'])) {
            votes["anarchy"] += 1;
            this.users.push(user['display-name']);
            console.log(votes["anarchy"]);
            if (((votes["anarchy"]) / (votes["anarchy"] + votes["democracy"])) > 0.6) {
              this.mode = false;
            }
          }
        break;
        case "democracy":
          if (!~this.users.indexOf(user['display-name'])) {
            votes["democracy"] += 1;
            this.users.push(user['display-name']);
            console.log(votes["democracy"]);
            if (((votes["democracy"]) / (votes["anarchy"] + votes["democracy"])) > 0.8) {
              this.mode = true;
            }
          }
        break;
        default:
          break;
      }
      if (command_type.match(/[1-9]/) !== null) {
        command_type = "I" + command_type;
      }
      return {
        "valid": true,
        "content": command_type
      };
    } else {
      return {
        "valid": false,
        "content": message
      };
    }
  }
}
