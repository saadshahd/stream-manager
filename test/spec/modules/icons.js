import * as icons from '../../../app/bundle/modules/icons';
import * as chai from 'chai';

const expect = chai.expect;

describe('chevron', () => {
  it('should be defined', () => {
    expect(icons.chevron).to.exist;
  });

  it('should return <svg>', () => {
    const chevronIcon = icons.chevron();

    expect(chevronIcon).to.be.a('string');
    expect(chevronIcon).to.have.string('<svg');
    expect(chevronIcon).to.have.string('</svg>');
  });
});
