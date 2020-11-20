const LINE_HEIGHT_OPENING = "\\sl"
const LINE_HEIGHT_MULT = "\\slmult1"

class LineHeight {
  static getRtfLineHeigthContent(value) {
    if (value === "1" || value === "normal")
      return '';

    let convertedValue = parseFloat(value) * 240;
    return LINE_HEIGHT_OPENING + convertedValue + LINE_HEIGHT_MULT;

  }
}

module.exports = LineHeight;


