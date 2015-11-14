var command_regex = /(up|down|left|right|[1-9]|delete)/;
module.exports = {
  check_valid_format_command: function (message) {
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
