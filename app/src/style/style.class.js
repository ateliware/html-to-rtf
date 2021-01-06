const cheerio   = require('cheerio');
const $         = cheerio.load('');
const Color     = require('../color/color.class');
const Alignment = require('../alignment/alignment.class');
const FontSize  = require('../font-size/font-size.class');
const AllowedStyleProperties = require('../allowed-style-properties/allowed-style-properties.class');
const Display = require('../display/display.class');
const Margin = require('../margin/margin.class');
const LineHeight = require('../line-height/line-height.class');
const FontWeight = require('../font-weight/font-weight.class');

class Style {
  static getRtfReferenceColor(value) {
    return Color.getRtfReferenceColor(value);
  }

  static getRtfColorTable() {
    return Color.getRtfColorTable();
  }

  static getRtfAlignmentReference(value) {
    return Alignment.getRtfAlignmentReference(value);
  }

  static getRtfFontSizeReference(value) {
    return FontSize.getRtfFontSizeReference(value);
  }

  static getRtfDisplayReference(value) {
    return Display.getRtfDisplayContent(value);
  }

  static getRtfMarginBottomReference(value) {
    return Margin.getRtfMarginBottomContent(value);
  }

  static getRtfMarginTopReference(value) {
    return Margin.getRtfMarginTopContent(value);
  }

  static getRtfMarginReference(value) {
    return Margin.getRtfMarginContent(value);
  }

  static getRtfLineHeightReference(value) {
    return LineHeight.getRtfLineHeigthContent(value);
  }

  static getRtfFontWeightReference(value) {
    return FontWeight.getRtfFontWeightContent(value);
  }

  static getRtfReferencesInStyleProperty(styleValue) {
    if(styleValue == '')
      return undefined;

    let fictitiousTagWithTruthStyle = "<span style='"+styleValue+"'></span>";
    let listOfRtfReferences = '';

    AllowedStyleProperties.getAllowedTags().forEach(value => {
      if($(fictitiousTagWithTruthStyle).css(value.propertyName) != undefined) {
        switch(value.propertyName) {
          case 'color': listOfRtfReferences       += this.getRtfReferenceColor($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'font-size': listOfRtfReferences   += this.getRtfFontSizeReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'text-align': listOfRtfReferences += this.getRtfAlignmentReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'display': listOfRtfReferences  += this.getRtfDisplayReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'margin-bottom': listOfRtfReferences  += this.getRtfMarginBottomReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'margin-top': listOfRtfReferences  += this.getRtfMarginTopReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'line-height': listOfRtfReferences  += this.getRtfLineHeightReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'font-weight': listOfRtfReferences  += this.getRtfFontWeightReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
          case 'margin': listOfRtfReferences  += this.getRtfMarginReference($(fictitiousTagWithTruthStyle).css(value.propertyName)); break;
        }
      }
    });

    if(listOfRtfReferences == '')
      return undefined;

    return listOfRtfReferences;
  }
}
module.exports = Style;
