const HIDDEN_DISPLAY_OPENING = "\\v"

class Display {
  static getRtfDisplayContent(value) {
    if (value == 'none') {
      return HIDDEN_DISPLAY_OPENING;
    }

    return '';
  }
}
module.exports = Display;


