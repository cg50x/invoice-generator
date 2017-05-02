import React, {Component} from 'react';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  PageHeader,
} from 'react-bootstrap';
import {symbols} from 'currencyformatter.js';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import LineItemList from './LineItemList.js';
import {saveInvoicePDF} from './PDFService.js';

const currencyCodes = Object.keys(symbols);

const emptyState = {
  invoiceNumber: '',
  fromName: '',
  imageLogo: null,
  paymentTerms: '',
  currency: 'USD',
  toName: '',
  date: '',
  dueDate: '',
  lineItems: [],
  notes: '',
  terms: '',
};

class App extends Component {
  constructor() {
    super();
    this.state = emptyState;

    this.onFieldValueChange = this.onFieldValueChange.bind(this);
    this.onLineItemDescriptionChange = this.onLineItemDescriptionChange.bind(
      this
    );
    this.onLineItemQuantityChange = this.onLineItemQuantityChange.bind(this);
    this.onLineItemRateChange = this.onLineItemRateChange.bind(this);
    this.onLineItemDeleteClick = this.onLineItemDeleteClick.bind(this);
    this.onLineItemAddClick = this.onLineItemAddClick.bind(this);
    this.onExampleLinkClick = this.onExampleLinkClick.bind(this);
    this.onClearFormClick = this.onClearFormClick.bind(this);
    this.onRemoveImageClick = this.onRemoveImageClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  onInvoiceNumberChange(event) {
    let newVal = event.target.value;
    this.setState({
      invoiceNumber: newVal,
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
    let lineItem = lineItems[params.index];
    lineItem.description = params.newDescription;
    this.setState({
      lineItems: lineItems,
    });
  }

  onLineItemQuantityChange(params) {
    let lineItems = this.state.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.quantity = params.newQuantity;
    this.setState({
      lineItems: lineItems,
    });
  }

  onLineItemRateChange(params) {
    let lineItems = this.state.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.rate = params.newRate;
    this.setState({
      lineItems: lineItems,
    });
  }

  onLineItemDeleteClick(params) {
    let lineItems = this.state.lineItems;
    lineItems.splice(params.index, 1);
    this.setState({
      lineItems: lineItems,
    });
  }

  onLineItemAddClick() {
    let lineItems = this.state.lineItems;
    lineItems.push({
      description: '',
      quantity: 0,
      rate: 0,
    });
    this.setState({
      lineItems: lineItems,
    });
  }

  onExampleLinkClick() {
    this.setState({
      invoiceNumber: '123',
      fromName: 'John Smith\n123 Address St.\nLos Angeles, CA 12345',
      imageLogo: null,
      paymentTerms: 'Biweekly',
      currency: 'USD',
      toName: 'Jane Smith\n999 Address St.\nSeattle, WA 54321',
      date: '2016-10-10',
      dueDate: '2016-11-01',
      lineItems: [
        {
          description: 'Item #1',
          quantity: 1,
          rate: 1.50,
        },
        {
          description: 'Item #2',
          quantity: 2,
          rate: 2.50,
        },
      ],
      notes: 'This invoice does not include service fees.',
      terms: 'Payment must be made via PayPal.',
    });
  }

  onClearFormClick() {
    this.setState(emptyState);
  }

  onRemoveImageClick() {
    // Clear out the input file element
    let inputElem = document.getElementById('imageLogo');
    inputElem.value = '';

    // Clear out the imageLogo on the state
    this.setState({
      imageLogo: null,
    });
  }

  onSubmitClick() {
    saveInvoicePDF(this.state);
  }

  render() {
    return (
      <div className="App">
        <PageHeader>Invoice Generator</PageHeader>
        <p>
          This is an invoice generator. Fill in the fields below and click 'Create Invoice' to generate the invoice as a PDF document.
          {' '}
          <a onClick={this.onExampleLinkClick}>Click here</a>
          {' '}
          to see an example.
        </p>
        <div className="App-invoice">
          <Form horizontal>
            <FormGroup controlId="invoiceNumber">
              <Col componentClass={ControlLabel} sm={2}>
                Invoice #
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={this.state.invoiceNumber}
                  onChange={this.onFieldValueChange.bind(this, 'invoiceNumber')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="fromName">
              <Col componentClass={ControlLabel} sm={2}>
                From
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  rows="3"
                  placeholder="Who is this invoice from?"
                  value={this.state.fromName}
                  onChange={this.onFieldValueChange.bind(this, 'fromName')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="imageLogo">
              <Col componentClass={ControlLabel} sm={2}>
                Logo
              </Col>
              <Col sm={10}>
                <FormControl
                  type="file"
                  onChange={this.onImageLogoChange.bind(this)}
                />
                {this.state.imageLogo
                  ? <a onClick={this.onRemoveImageClick}>Remove image</a>
                  : null}
              </Col>
            </FormGroup>
            <FormGroup controlId="toName">
              <Col componentClass={ControlLabel} sm={2}>
                Bill To
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  rows="3"
                  placeholder="Who is this invoice to?"
                  value={this.state.toName}
                  onChange={this.onFieldValueChange.bind(this, 'toName')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="date">
              <Col componentClass={ControlLabel} sm={2}>
                Date
              </Col>
              <Col sm={10}>
                <FormControl
                  type="date"
                  value={this.state.date}
                  onChange={this.onFieldValueChange.bind(this, 'date')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="dueDate">
              <Col componentClass={ControlLabel} sm={2}>
                Due Date
              </Col>
              <Col sm={10}>
                <FormControl
                  type="date"
                  value={this.state.dueDate}
                  onChange={this.onFieldValueChange.bind(this, 'dueDate')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="paymentTerms">
              <Col componentClass={ControlLabel} sm={2}>
                Payment Terms
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={this.state.paymentTerms}
                  onChange={this.onFieldValueChange.bind(this, 'paymentTerms')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="currency">
              <Col componentClass={ControlLabel} sm={2}>
                Currency
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="select"
                  placeholder="Select currency"
                  defaultValue={this.state.currency}
                  onChange={this.onFieldValueChange.bind(this, 'currency')}
                >
                  {currencyCodes.map((currencyCode, index) => (
                    <option value={currencyCode} key={index}>
                      {currencyCode}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <LineItemList
              lineItems={this.state.lineItems}
              currency={this.state.currency}
              onLineItemDescriptionChange={this.onLineItemDescriptionChange}
              onLineItemQuantityChange={this.onLineItemQuantityChange}
              onLineItemRateChange={this.onLineItemRateChange}
              onLineItemDeleteClick={this.onLineItemDeleteClick}
              onLineItemAddClick={this.onLineItemAddClick}
            />
            <FormGroup>
              <ControlLabel>Notes</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Notes - any relevant information not already covered"
                value={this.state.notes}
                onChange={this.onFieldValueChange.bind(this, 'notes')}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Terms</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={this.state.terms}
                onChange={this.onFieldValueChange.bind(this, 'terms')}
              />
            </FormGroup>
          </Form>
        </div>
        <div className="Footer-Container">
          <div className="Footer">
            <Col sm={2}>
              <Button onClick={this.onClearFormClick}>Clear Form</Button>
            </Col>
            <Col smOffset={8} sm={2}>
              <Button onClick={this.onSubmitClick} bsStyle="primary">
                Create Invoice
              </Button>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
