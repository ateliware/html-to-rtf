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

  static getRtfMarginContent(value) {
    let marginTop = value.split(' ')[0];
    let marginBottom = value.split(' ')[2];
    
    if (marginTop != '0pt' && marginBottom != '0pt') {
      return this.getRtfMarginTopAndBottomContent(marginTop, marginBottom);
    } else if (marginTop != '0pt') {
      return this.getRtfMarginTopContent(marginTop);
    } else {
      return this.getRtfMarginBottomContent(marginBottom);
    }
  }

  static getRtfMarginTopAndBottomContent(top, bottom) {
    let marginTopSize = top.replace('pt', '');
    let marginBottomSize = bottom.replace('pt', '');

    let convertedTopValue = parseInt(marginTopSize) * 20;
    let convertedBottomValue = parseInt(marginBottomSize) * 20;
    return MARGIN_TOP_OPENING + convertedTopValue + MARGIN_BOTTOM_OPENING + convertedBottomValue;
  }
}

module.exports = Margin;


