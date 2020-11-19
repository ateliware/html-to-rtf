const HIDDEN_DISPLAY_OPENING = "\\v"

class Display {
  static getRtfDisplayContent(value) {
    console.log(value);
    if (value == 'none') {
      return HIDDEN_DISPLAY_OPENING;
    }

    return '';
  }
}
module.exports = Display;


