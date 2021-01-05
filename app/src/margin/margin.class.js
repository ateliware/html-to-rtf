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
    let marginShorthand = value.split(' ').length

    if (marginShorthand == 3 || marginShorthand == 4) {
      return this.marginTopAndBottomHandler(value.split(' ')[0], value.split(' ')[2]);
    } else {
        return this.marginTopAndBottomHandler(value.split(' ')[0], value.split(' ')[0]);
      }
  }

  static marginTopAndBottomHandler(top, bottom) {
    let marginTopSize = top.replace('pt', '');
    let marginBottomSize = bottom.replace('pt', '');

    if (marginTopSize === "0" && marginBottomSize === "0") {
      return ''
    } else if (marginTopSize != "0" && marginBottomSize === "0") {
        return this.getRtfMarginTopContent(marginTopSize);
    } else if (marginTopSize === "0" && marginBottomSize != "0") {
        return this.getRtfMarginBottomContent(marginBottomSize);
    } else {
        let convertedTopValue = parseInt(marginTopSize) * 20;
        let convertedBottomValue = parseInt(marginBottomSize) * 20;
        return MARGIN_TOP_OPENING + convertedTopValue + MARGIN_BOTTOM_OPENING + convertedBottomValue;
    }    
  }
}

module.exports = Margin;


