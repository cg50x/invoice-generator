import React from 'react';
import ReactDOM from 'react-dom';
import LineItemList from './LineItemList';

describe('LineItemList Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LineItemList />, div);
  });

  describe('getLineItemsTotal()', () => {
    it('returns 0 for an empty array', () => {
      let input = [];
      let component = new LineItemList();
      let result = component.getLineItemsTotal(input);

      expect(result).toBe(0);
    });
    it('returns 5 for an array containing 5 line items with quantity 1 and rate 1', () => {
      let input = Array(5).fill({ quantity: 1, rate: 1 });
      let component = new LineItemList();

      let result = component.getLineItemsTotal(input);

      expect(result).toBe(5);
    });
  });
});