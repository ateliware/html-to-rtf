const cheerio = require('cheerio')
const Style = require('../style/style.class')
const AllowedHtmlTags = require('../allowed-html-tags/allowed-html-tags.class')
const Table = require('../table/table.class')
const MyString = require('../string/my-string.class')
const juice = require('juice')
const fs = require('fs')

class Rtf {
  constructor() {
    this.rtfHeaderOpening = "{\\rtf1\\deff0{\\fonttbl {\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset2 Symbol;}}{\\colortbl ;}{\\*\\defchp \\fs22}"
    this.rtfHeaderContent = ''
    this.rtfClosing = "}"
    this.rtfContentReferences = []
    this.Table = new Table()
  }

  convertHtmlToRtf(html) {
    let htmlWithoutStrangerTags, $, treeOfTags

    let sanitizedHtml = html.replace(/\r?\n|\r/g, '');
    htmlWithoutStrangerTags = this.swapHtmlStrangerTags(sanitizedHtml, 'p')

    $ = cheerio.load(juice(htmlWithoutStrangerTags))
    treeOfTags = $('html').children()

    Array.from(treeOfTags).forEach(tag => this.readAllChildsInTag(tag))
    return this.buildRtf()
  }

  swapHtmlStrangerTags(html, dafaultTag) {
    return html.replace(/<(\/?[a-z-_]+[a-z0-9-_]*)( *[^>]*)?>/gi, (match, tagName, options) => {
      let newTag = !tagName.includes('/') ? `<${dafaultTag}${options ? options : ''}>` : `</${dafaultTag}>`
      return AllowedHtmlTags.isKnowedTag(tagName) ? match : `${newTag}`
    })
  }

  buildRtf() {
    this.rtfHeaderContent += Style.getRtfColorTable()
    let content = (this.rtfHeaderOpening + this.rtfHeaderContent + this.getRtfContentReferences() + this.rtfClosing)
    this.clearCacheContent()
    return content
  }

  getRtfContentReferences() {
    let rtfReference = ''
    this.rtfContentReferences.forEach(value => {
      rtfReference += value.content
    })
    return rtfReference
  }

  // Don't has a test
  readAllChildsInTag(fatherTag) {
    if (fatherTag.children != undefined) {
      if (this.insideTable){
        if ((fatherTag.name.toLowerCase() != 'br')){
          this.addOpeningTagInRtfCode(fatherTag.name)
        }
        if ((fatherTag.name.toLowerCase() == 'p')){
          this.addOpeningTagInRtfCode('table_par')
        }
      }
      else{
        this.addOpeningTagInRtfCode(fatherTag.name)
      }

      this.ifExistsAttributesAddAllReferencesInRtfCode(fatherTag.attribs)

      if (fatherTag.name.toLowerCase() == 'table'){
        let tableWidth = this.getElementWidth(fatherTag);
        if (tableWidth == null) {
          tableWidth = 100;
        }
        this.Table.setAmountOfColumns(this.getAmountOfColumnThroughOfFirstChildOfTbodyTag(fatherTag.children), tableWidth)
        this.insideTable = true;
      }

      if (fatherTag.name.toLowerCase() == 'tr'){
        let colSpanArray = this.getTableRowColSpans(fatherTag.children);
        this.addReferenceTagInRtfCode(this.Table.buildCellsLengthOfEachColumn(colSpanArray))
      }

      if (fatherTag.name.toLowerCase() == 'mark')
        this.setHighlightInRtf();

      (fatherTag.children).forEach((child, index) => {
        if (child.type != 'text')
          this.readAllChildsInTag(child)
        else
          this.addContentOfTagInRtfCode(child)
      })

      if (this.insideTable){
        if ((fatherTag.next == null || fatherTag.next == undefined) && (fatherTag.name.toLowerCase() == 'p' || fatherTag.name.toLowerCase() == 'br')){
          return;
        }
      }

      if (fatherTag.name.toLowerCase() == 'table'){
        this.insideTable = false;
      }

      this.addClosingFatherTagInRtfCode(fatherTag.name)
    }
  }

  getTableRowColSpans(children) {
    let colSpans = []
    children.forEach((child) => {
      if (child.type != 'text')
      var width = this.getElementWidth(child);
      var colspan = 1;
      if(child.attribs != undefined && child.attribs.colspan != undefined)
           colspan = parseInt(child.attribs.colspan)
      colSpans.push({
        colspan: colspan,
        width: width
      });
    });
    return colSpans;
  }

  getElementWidth(element){
    if(element.attribs != undefined && element.attribs.style != undefined) {
      let widthProp = element.attribs.style.match(/(?:^|\s|\;)width:.\d{1,3}.\d{0,4}/g);
      if (widthProp && widthProp.length > 0) {
        return widthProp[0].replace('width:','').replace(';','').trim().replace('%', '');
      }
    }

    if(element.attribs != undefined && element.attribs.width != undefined) {
      let widthProp = element.attribs.width;
      if (widthProp && widthProp.length > 0) {
        return widthProp.trim().replace('%', '');
      }
    }

    return null;
  }

  getAmountOfColumnThroughOfFirstChildOfTbodyTag(tableChildren) {
    let count = 0
    let tbodyIndex = tableChildren.findIndex(value => value.name == 'tbody')
    for (let i = 0; i < tableChildren[tbodyIndex].children.length; i++) {
      if (tableChildren[tbodyIndex].children[i].type != 'text') {
        (tableChildren[tbodyIndex].children[i].children).forEach((child, index) => {
          if (child.type != 'text')
            if(child.attribs != undefined && child.attribs.colspan != undefined)
              count += parseInt(child.attribs.colspan)
            else
              count++
        })
        break
      }
    }
    return count
  }

  ifExistsAttributesAddAllReferencesInRtfCode(attributes) {
    if (attributes.style != undefined)
      this.addReferenceTagInRtfCode(Style.getRtfReferencesInStyleProperty(attributes.style))
    if (attributes.align != undefined)
      this.addReferenceTagInRtfCode(Style.getRtfAlignmentReference(attributes.align))
  }

  addReferenceTagInRtfCode(referenceTag) {
    if (referenceTag != undefined)
      this.rtfContentReferences.push({ content: referenceTag, tag: true })
  }

  addOpeningTagInRtfCode(tag) {
    this.addReferenceTagInRtfCode(AllowedHtmlTags.getRtfReferenceTag(tag))
  }

  addClosingFatherTagInRtfCode(closingFatherTag) {
    this.addReferenceTagInRtfCode(AllowedHtmlTags.getRtfReferenceTag(`/${closingFatherTag}`))
  }

  addContentOfTagInRtfCode(child) {
    let contentOfTag = MyString.removeCharacterOfEscapeInAllString(child.data, '\n\t')
    if (contentOfTag != undefined)
    {
      if ((this.rtfContentReferences[this.rtfContentReferences.length-1].tag)
          && (this.rtfContentReferences[this.rtfContentReferences.length-1].content != "{")
          && (this.rtfContentReferences[this.rtfContentReferences.length-1].content != "}")
          && !MyString.hasOnlyWhiteSpace(contentOfTag)){
        if (child.parent.name === 'span' && child.parent.attribs.class === 'template-input') {
          this.rtfContentReferences.push({ content: `${contentOfTag}`, tag: false })
        } else {
          this.rtfContentReferences.push({ content: ` ${contentOfTag}`, tag: false })
        }
      }
      else
      {
        this.rtfContentReferences.push({ content: contentOfTag, tag: false })
      }
    }
  }

  setHighlightInRtf() {
    let rtfReferenceColor = Style.getRtfReferenceColor('rgb(255, 255, 0)')
    let referenceColorNumber = rtfReferenceColor.match(/[0-9]+/)
    this.addReferenceTagInRtfCode('\\highlight' + referenceColorNumber.toString())
  }

  saveRtfInFile(path, value) {
    fs.writeFile(path, value, (err) => {
      if (err) throw err
      console.log('The file has been saved at '+path)
    })
  }

  clearCacheContent() {
    this.rtfHeaderContent = ''
    this.rtfContentReferences = []
  }
}

module.exports = Rtf
