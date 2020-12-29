const FONT_WEIGHT_ON = "\\b"
const FONT_WEIGHT_OFF = "\\b0"

class FontWeight {
  static getRtfFontWeightContent(value) {
    if (value == 'bold') {
        return FONT_WEIGHT_ON;
    } else if (value == 'normal') {
        return FONT_WEIGHT_OFF;
    } else {
        return '';
    }
  }
}

module.exports = FontWeight;