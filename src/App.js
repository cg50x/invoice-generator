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
      invoiceNumber: '123',
      fromName: 'Chris',
      imageLogo: null,
      paymentTerms: 'terms terms',
      toName: 'Not Chris',
      date: '2012-12-12',
      dueDate: '2012-12-12',
      lineItems: [{
        description: 'Item #1',
        quantity: 1,
        rate: 1.50
      }, {
        description: 'Item #2',
        quantity: 2,
        rate: 2.50
      }],
      notes: 'Notes are here',
      terms: 'Terms are here!'
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

  onImageLogoChange(event) {
    let files = event.target.files;
    let stateUpdate = {};
    if (files.length > 0) {
      stateUpdate.imageLogo = files[0];
    }
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
    saveInvoicePDF(this.state);
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
                <FormControl type="text" value={this.state.invoiceNumber} onChange={this.onFieldValueChange.bind(this, 'invoiceNumber')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="fromName">
              <Col componentClass={ ControlLabel } sm={2}>
                From
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="Who is this invoice from?" value={this.state.fromName} onChange={this.onFieldValueChange.bind(this, 'fromName')}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="imageLogo">
              <Col componentClass={ ControlLabel } sm={2}>
                Logo
              </Col>
              <Col sm={10}>
                <FormControl type="file" onChange={this.onImageLogoChange.bind(this)}/>
              </Col>
            </FormGroup>
            <FormGroup controlId="toName">
              <Col componentClass={ ControlLabel } sm={2}>
                Bill To
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="Who is this invoice to?" value={this.state.toName} onChange={this.onFieldValueChange.bind(this, 'toName')}/>
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
            <FormGroup controlId="paymentTerms">
              <Col componentClass={ ControlLabel } sm={2}>
                Payment Terms
              </Col>
              <Col sm={10}>
                <FormControl type="text" value={this.state.paymentTerms} onChange={this.onFieldValueChange.bind(this, 'paymentTerms')}/>
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
              <ControlLabel>Notes</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Notes - any relevant information not already covered"
                value={this.state.notes}
                onChange={this.onFieldValueChange.bind(this, 'notes')}
              ></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Terms</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={this.state.terms}
                onChange={this.onFieldValueChange.bind(this, 'terms')}
              ></FormControl>
            </FormGroup>
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
