import React, { useState } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  PageHeader,
} from 'react-bootstrap';
import { symbols } from 'currencyformatter.js';
import { dequal } from 'dequal';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import HistoryList from './HistoryList';
import LineItemList from './LineItemList.js';
import { saveInvoicePDF } from './PDFService.js';
import useLocalStorage from './useLocalStorage.ts';

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

function App() {
  const [editedInvoice, setEditedInvoice] = useState(emptyState);
  const [historyStates, setHistoryStates] = useLocalStorage(
    'invoiceHistory',
    [],
  );

  function onFieldValueChange(propertyName, event) {
    let newVal = event.target.value;
    let stateUpdate = {};
    stateUpdate[propertyName] = newVal;
    setEditedInvoice({
      ...editedInvoice,
      ...stateUpdate,
    });
  }

  function onImageLogoChange(event) {
    let files = event.target.files;
    let stateUpdate = {};
    if (files.length > 0) {
      stateUpdate.imageLogo = files[0];
    }
    setEditedInvoice({ ...editedInvoice, ...stateUpdate });
  }

  function onLineItemDescriptionChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.description = params.newDescription;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemQuantityChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.quantity = params.newQuantity;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemRateChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.rate = params.newRate;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemDeleteClick(params) {
    let lineItems = editedInvoice.lineItems;
    lineItems.splice(params.index, 1);
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemAddClick() {
    let lineItems = editedInvoice.lineItems;
    lineItems.push({
      description: '',
      quantity: 0,
      rate: 0,
    });
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onExampleLinkClick() {
    setEditedInvoice({
      ...editedInvoice,
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
          rate: 1.5,
        },
        {
          description: 'Item #2',
          quantity: 2,
          rate: 2.5,
        },
      ],
      notes: 'This invoice does not include service fees.',
      terms: 'Payment must be made via PayPal.',
    });
  }

  function onClearFormClick() {
    setEditedInvoice(emptyState);
  }

  function onRemoveImageClick() {
    // Clear out the input file element
    let inputElem = document.getElementById('imageLogo');
    inputElem.value = '';

    // Clear out the imageLogo on the state
    setEditedInvoice({
      ...editedInvoice,
      imageLogo: null,
    });
  }

  function onSubmitClick() {
    saveInvoicePDF(editedInvoice);
    if (!dequal(editedInvoice, historyStates[0])) {
      setHistoryStates([editedInvoice, ...historyStates.slice(0, 24)]);
    }
  }

  function onHistoryStateClick(historyState) {
    setEditedInvoice(historyState);
  }

  return (
    <div className="App">
      <div>
        <PageHeader>Invoice Generator</PageHeader>
        <p>
          This is an invoice generator. Fill in the fields below and click
          'Create Invoice' to generate the invoice as a PDF document.{' '}
          <button onClick={onExampleLinkClick}>Click here</button> to see an
          example.
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
                  value={editedInvoice.invoiceNumber}
                  onChange={onFieldValueChange.bind(this, 'invoiceNumber')}
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
                  value={editedInvoice.fromName}
                  onChange={onFieldValueChange.bind(this, 'fromName')}
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
                  onChange={onImageLogoChange.bind(this)}
                />
                {editedInvoice.imageLogo ? (
                  <button onClick={onRemoveImageClick}>Remove image</button>
                ) : null}
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
                  value={editedInvoice.toName}
                  onChange={onFieldValueChange.bind(this, 'toName')}
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
                  value={editedInvoice.date}
                  onChange={onFieldValueChange.bind(this, 'date')}
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
                  value={editedInvoice.dueDate}
                  onChange={onFieldValueChange.bind(this, 'dueDate')}
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
                  value={editedInvoice.paymentTerms}
                  onChange={onFieldValueChange.bind(this, 'paymentTerms')}
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
                  defaultValue={editedInvoice.currency}
                  onChange={onFieldValueChange.bind(this, 'currency')}
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
              lineItems={editedInvoice.lineItems}
              currency={editedInvoice.currency}
              onLineItemDescriptionChange={onLineItemDescriptionChange}
              onLineItemQuantityChange={onLineItemQuantityChange}
              onLineItemRateChange={onLineItemRateChange}
              onLineItemDeleteClick={onLineItemDeleteClick}
              onLineItemAddClick={onLineItemAddClick}
            />
            <FormGroup>
              <ControlLabel>Notes</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Notes - any relevant information not already covered"
                value={editedInvoice.notes}
                onChange={onFieldValueChange.bind(this, 'notes')}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Terms</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={editedInvoice.terms}
                onChange={onFieldValueChange.bind(this, 'terms')}
              />
            </FormGroup>
          </Form>
        </div>
        <div className="Footer-Container">
          <div className="Footer">
            <Col sm={2}>
              <Button onClick={onClearFormClick}>Clear Form</Button>
            </Col>
            <Col smOffset={8} sm={2}>
              <Button onClick={onSubmitClick} bsStyle="primary">
                Create Invoice
              </Button>
            </Col>
          </div>
        </div>
      </div>
      <div>
        <HistoryList
          historyStates={historyStates}
          onHistoryStateClick={onHistoryStateClick}
        />
      </div>
    </div>
  );
}

export default App;
