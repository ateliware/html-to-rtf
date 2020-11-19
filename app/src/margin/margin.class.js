const MARGIN_BOTTOM_OPENING = "\\sa"
const MARGIN_TOP_OPENING = "\\sb"

class Margin {
  static getRtfMarginBottomContent(value) {
    let marginSize = value.replace('pt', '');

    if (marginSize === "0")
      return '';

    let convertedValue = parseInt(marginSize) * 20;
    return MARGIN_BOTTOM_OPENING + convertedValue;
  }

  static getRtfMarginTopContent(value) {
    let marginSize = value.replace('pt', '');

    if (marginSize === "0")
      return '';

    let convertedValue = parseInt(marginSize) * 20;
    return MARGIN_TOP_OPENING + convertedValue;
  }
}

module.exports = Margin;


