const should          = require('should');
const StyleProperties = require('./style-properties.module');

describe('StylePropertiesTest', () => {
  it('Length of module', () => {
    should(StyleProperties.length).be.equal(5);
  });

  StyleProperties.forEach(element => {
    if (element.propertyName == 'color')
      it('color', () => should(element.allowed).be.true());

    else if (element.propertyName == 'font-size')
      it('font-size', () => should(element.allowed).be.true());

    else if (element.propertyName == 'text-align')
      it('text-align', () => should(element.allowed).be.true());

    else if (element.propertyName == 'background')
      it('background', () => should(element.allowed).be.false());

    else if (element.propertyName == 'display')
      it("display", () => should(element.allowed).be.true());
  });
});
