import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import AboutPage from './AboutPage';

describe('<AboutPage />', () => {
  it('should have a header called \'About\'', () => {
    const wrapper = shallow(<AboutPage />);
    const actual = wrapper.find('h1.page-header').text();
    const expected = 'About ExploreJS';

    expect(actual).to.equal(expected);
  });

  it('should have a header with \'section-title\' class', () => {
    const wrapper = shallow(<AboutPage />);
    const actual = wrapper.find('h1').prop('className');
    const expected = 'page-header';

    expect(actual).to.equal(expected);
  });

  // it('should link to an unknown route path', () => {
  //   const wrapper = shallow(<AboutPage />);
  //   const actual = wrapper.findWhere(n => n.prop('to') === '/badlink').length;
  //   const expected = 1;
  //
  //   expect(actual).to.be.equal(expected);
  // });
});
