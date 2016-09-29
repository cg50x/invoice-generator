import React, { Component } from 'react';
import {
  PageHeader,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import LineItemList from './LineItemList.js';
import { saveInvoicePDF } from './PDFService.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      invoiceNumber: '',
      fromName: '',
      toName: '',
      date: '',
      dueDate: '',
      balanceDue: 0,
      lineItems: [{
        description: '',
        quantity: 0,
        rate: 0
      }]
    };

    this.onFieldValueChange = this.onFieldValueChange.bind(this);
    this.onLineItemDescriptionChange = this.onLineItemDescriptionChange.bind(this);
    this.onLineItemQuantityChange = this.onLineItemQuantityChange.bind(this);
    this.onLineItemRateChange = this.onLineItemRateChange.bind(this);
    this.onLineItemDeleteClick = this.onLineItemDeleteClick.bind(this);
    this.onLineItemAddClick = this.onLineItemAddClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  onInvoiceNumberChange(event) {
    let newVal = event.target.value;
    this.setState({
      invoiceNumber: newVal
    });
  }

  onFieldValueChange(propertyName, event) {
    let newVal = event.target.value;
    let stateUpdate = {};
    stateUpdate[propertyName] = newVal;
    this.setState(stateUpdate);
  }

  onLineItemDescriptionChange(params) {
    let lineItems = this.state.lineItems;
    let lineItem = lineItems[params.index]
    lineItem.description = params.newDescription;
    this.setState({
      lineItems: lineItems
    });
  }

  onLineItemQuantityChange(params) {
    let lineItems = this.state.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.quantity = params.newQuantity;
    this.setState({
      lineItems: lineItems
    });
  }

  onLineItemRateChange(params) {
    let lineItems = this.state.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.rate = params.newRate;
    this.setState({
      lineItems: lineItems
    });
  }

  onLineItemDeleteClick(params) {
    let lineItems = this.state.lineItems;
    lineItems.splice(params.index, 1);
    this.setState({
      lineItems: lineItems
    });
  }

  onLineItemAddClick() {
    let lineItems = this.state.lineItems;
    lineItems.push({
      description: '',
      quantity: 0,
      rate: 0
    });
    this.setState({
      lineItems: lineItems
    });
  }

  onSubmitClick() {
    saveInvoicePDF();
  }

  render() {
    return (
      <div className="App">
        <PageHeader>Invoice Generator</PageHeader>
        <p>This is a small invoice generator that is entirely contained on the client side.</p>
        <div className="App-invoice">
          <Form horizontal>
            <FormGroup controlId="invoiceNumber">
              <Col componentClass={ ControlLabel } sm={2}>
                Invoice #
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="4" value={this.state.invoiceNumber} onChange={this.onFieldValueChange.bind(this, 'invoiceNumber')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="fromName">
              <Col componentClass={ ControlLabel } sm={2}>
                From
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="4" value={this.state.fromName} onChange={this.onFieldValueChange.bind(this, 'fromName')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="toName">
              <Col componentClass={ ControlLabel } sm={2}>
                Bill To
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="4" value={this.state.toName} onChange={this.onFieldValueChange.bind(this, 'toName')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="date">
              <Col componentClass={ ControlLabel } sm={2}>
                Date
              </Col>
              <Col sm={10}>
                <FormControl type="date" value={this.state.date} onChange={this.onFieldValueChange.bind(this, 'date')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="dueDate">
              <Col componentClass={ ControlLabel } sm={2}>
                Due Date
              </Col>
              <Col sm={10}>
                <FormControl type="date" value={this.state.dueDate} onChange={this.onFieldValueChange.bind(this, 'dueDate')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="balanceDue">
              <Col componentClass={ ControlLabel } sm={2}>
                Balance Due
              </Col>
              <Col sm={10}>
                <FormControl type="number" min="0.01" step="0.01" value={this.state.balanceDue} onChange={this.onFieldValueChange.bind(this, 'balanceDue')}/>
              </Col>
            </FormGroup>
            <LineItemList
              lineItems={this.state.lineItems}
              onLineItemDescriptionChange={this.onLineItemDescriptionChange}
              onLineItemQuantityChange={this.onLineItemQuantityChange}
              onLineItemRateChange={this.onLineItemRateChange}
              onLineItemDeleteClick={this.onLineItemDeleteClick}
              onLineItemAddClick={this.onLineItemAddClick}
              >
            </LineItemList>
            <FormGroup>
              <Col smOffset={10} sm={2}>
                <Button onClick={this.onSubmitClick} bsStyle="primary">Create Invoice</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
