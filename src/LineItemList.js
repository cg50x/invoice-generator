import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.css';

import { Button, FormControl } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { format, symbols } from 'currencyformatter.js';
import decode from './decode.js';

const currencyCodes = Object.keys(symbols);

class LineItemList extends Component {
  onLineItemDescriptionChange(index, event) {
    this.props.onLineItemDescriptionChange({
      index: index,
      newDescription: event.target.value,
    });
  }

  onLineItemQuantityChange(index, event) {
    this.props.onLineItemQuantityChange({
      index: index,
      newQuantity: event.target.value,
    });
  }

  onLineItemRateChange(index, event) {
    this.props.onLineItemRateChange({
      index: index,
      newRate: event.target.value,
    });
  }

  onLineItemDeleteClick(index) {
    this.props.onLineItemDeleteClick({
      index: index,
    });
  }

  getLineItemsTotal(lineItems) {
    return lineItems.reduce((sum, lineItem) => {
      return sum + lineItem.quantity * lineItem.rate;
    }, 0);
  }

  renderLineItemRow(lineItem, index) {
    return (
      <Row key={index} className="mb-1">
        <Col sm={8}>
          <FormControl
            type="text"
            value={lineItem.description}
            onChange={this.onLineItemDescriptionChange.bind(this, index)}
          />
        </Col>
        <Col sm={1} style={{ paddingLeft: '7px', paddingRight: '7px' }}>
          <FormControl
            type="number"
            step="0.1"
            value={lineItem.quantity}
            onChange={this.onLineItemQuantityChange.bind(this, index)}
          />
        </Col>
        <Col sm={1} style={{ paddingLeft: '7px', paddingRight: '7px' }}>
          <FormControl
            type="number"
            value={lineItem.rate}
            onChange={this.onLineItemRateChange.bind(this, index)}
          />
        </Col>
        <Col sm={1}>
          {decode(
            format(lineItem.quantity * lineItem.rate, {
              currency: this.props.currency,
            }),
          )}
        </Col>
        <Col sm={1}>
          <Button
            variant="danger"
            onClick={this.onLineItemDeleteClick.bind(this, index)}
          >
            X
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    let lineItems = this.props.lineItems;
    let lineItemRows = lineItems.map(this.renderLineItemRow.bind(this));
    let lineItemsTotal = this.getLineItemsTotal(lineItems);
    return (
      <div className={this.props.className}>
        <Row className="mb-2">
          <Col sm={8} className="fw-bold">
            Item
          </Col>
          <Col sm={1} className="fw-bold">
            Quantity
          </Col>
          <Col sm={1} className="fw-bold">
            Rate
          </Col>
          <Col sm={1} className="fw-bold">
            Amount
          </Col>
          <Col sm={1} />
        </Row>
        {lineItemRows}
        <Row>
          <Col sm={8}>
            <Button variant="success" onClick={this.props.onLineItemAddClick}>
              + Add Line Item
            </Button>
          </Col>
          <Col sm={1} />
          <Col sm={1} className="fw-bold">
            Total
          </Col>
          <Col sm={1}>
            {decode(format(lineItemsTotal, { currency: this.props.currency }))}
          </Col>
          <Col sm={1} />
        </Row>
      </div>
    );
  }
}

LineItemList.propTypes = {
  currency: PropTypes.oneOf(currencyCodes),
  lineItems: PropTypes.array,
  onLineItemDescriptionChange: PropTypes.func,
  onLineItemQuantityChange: PropTypes.func,
  onLineItemRateChange: PropTypes.func,
  onLineItemDeleteClick: PropTypes.func,
};

LineItemList.defaultProps = {
  lineItems: [],
};

export default LineItemList;
