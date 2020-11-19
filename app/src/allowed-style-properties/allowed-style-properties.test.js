const should                  = require('should');
const { isTagAllowed } = require('./allowed-style-properties.class');
const AllowedStyleProperties  = require('./allowed-style-properties.class');

describe('AllowedStylePropertiesTest', () => {
  it('tagIsAllowed()', () => {
    should(AllowedStyleProperties.isTagAllowed('color')).be.true();
    should(AllowedStyleProperties.isTagAllowed('background')).be.false();
    should(AllowedStyleProperties.isTagAllowed('')).be.false();
    should(AllowedStyleProperties.isTagAllowed('display')).be.true()
  });
});
