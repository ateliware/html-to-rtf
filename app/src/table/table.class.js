class Table {
  constructor() {
    this.rtfReferenceRow = '\\clbrdrt\\brdrw15\\brdrs\\clbrdrl\\brdrw15\\brdrs\\clbrdrb\\brdrw15\\brdrs\\clbrdrr\\clvertalc\\brdrw15\\brdrs\\cellx';
    this.amountOfColumns = 0;
    this.tableWidth = 100;
    this.defaultLengthOfPageInTwips = 10200;
  }

  setAmountOfColumns(amountOfColumns, tableWidth) {
    this.amountOfColumns = amountOfColumns;
    this.tableWidth = parseFloat(tableWidth);
  }

  getAmountOfColumns() {
    return this.amountOfColumns;
  }

  getCellLength(colSpan) {
    return Math.floor(this.defaultLengthOfPageInTwips/parseInt(colSpan) * this.tableWidth / 100);
  }

  getCellLengthFromWidth(width) {
    return Math.floor(this.defaultLengthOfPageInTwips * width / 100 * this.tableWidth / 100);
  }

  getRtfReferenceRow() {
    return this.rtfReferenceRow;
  }

  buildCellsLengthOfEachColumn(cells) {
    let cellGroup = '';
    let currentPos = 0;
    let fullWidth = 0;

    cells.forEach((cellinfo) => {
      if (cellinfo.width != null){
        fullWidth += parseFloat(cellinfo.width);
      }
    });

    cells.forEach((cellinfo) => {
      var cellSize;

      if (cellinfo.width == null){
        cellSize = this.getCellLength(this.getAmountOfColumns() - cellinfo.colspan + 1);
      }
      else {
        cellSize = this.getCellLengthFromWidth(parseFloat(cellinfo.width) * 100 / fullWidth);
      }
      cellGroup += this.rtfReferenceRow + (currentPos + cellSize);
      currentPos += cellSize;
    });
    return cellGroup;
  }
}
module.exports = Table;
