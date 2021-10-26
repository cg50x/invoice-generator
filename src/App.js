import React, { useState } from 'react';
import {
  Button,
  Form,
} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
        <div className="Page-Header">
          <h1>Invoice Generator</h1>
        </div>
        <p>
          This is an invoice generator. Fill in the fields below and click
          'Create Invoice' to generate the invoice as a PDF document.
        </p>
        <p className="mb-4">
          <Button variant="secondary" size="sm" onClick={onExampleLinkClick}>Click here to see an example</Button>
        </p>
        <div className="App-invoice">
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="invoiceNumber">
              <Form.Label column sm="2" className="text-end fw-bold">
                Invoice #
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={editedInvoice.invoiceNumber}
                  onChange={onFieldValueChange.bind(this, 'invoiceNumber')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="fromName">
              <Form.Label column sm="2" className="text-end fw-bold">
                From
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="textarea"
                  rows="3"
                  placeholder="Who is this invoice from?"
                  value={editedInvoice.fromName}
                  onChange={onFieldValueChange.bind(this, 'fromName')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="imageLogo">
              <Form.Label column sm="2" className="text-end fw-bold">
                Logo
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="file"
                  onChange={onImageLogoChange.bind(this)}
                />
                {editedInvoice.imageLogo ? (
                  <button onClick={onRemoveImageClick}>Remove image</button>
                ) : null}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="toName">
              <Form.Label column sm="2" className="text-end fw-bold">
                Bill To
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="textarea"
                  rows="3"
                  placeholder="Who is this invoice to?"
                  value={editedInvoice.toName}
                  onChange={onFieldValueChange.bind(this, 'toName')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="date">
              <Form.Label column sm="2" className="text-end fw-bold">
                Date
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  value={editedInvoice.date}
                  onChange={onFieldValueChange.bind(this, 'date')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="dueDate">
              <Form.Label column sm="2" className="text-end fw-bold">
                Due Date
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  value={editedInvoice.dueDate}
                  onChange={onFieldValueChange.bind(this, 'dueDate')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="paymentTerms">
              <Form.Label column sm="2" className="text-end fw-bold">
                Payment Terms
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={editedInvoice.paymentTerms}
                  onChange={onFieldValueChange.bind(this, 'paymentTerms')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="currency">
              <Form.Label column sm="2" className="text-end fw-bold">
                Currency
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  placeholder="Select currency"
                  defaultValue={editedInvoice.currency}
                  onChange={onFieldValueChange.bind(this, 'currency')}
                >
                  {currencyCodes.map((currencyCode, index) => (
                    <option value={currencyCode} key={index}>
                      {currencyCode}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            <LineItemList
              className="mb-3"
              lineItems={editedInvoice.lineItems}
              currency={editedInvoice.currency}
              onLineItemDescriptionChange={onLineItemDescriptionChange}
              onLineItemQuantityChange={onLineItemQuantityChange}
              onLineItemRateChange={onLineItemRateChange}
              onLineItemDeleteClick={onLineItemDeleteClick}
              onLineItemAddClick={onLineItemAddClick}
            />
            <Form.Group>
              <Form.Label className="fw-bold">Notes</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Notes - any relevant information not already covered"
                value={editedInvoice.notes}
                onChange={onFieldValueChange.bind(this, 'notes')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Terms</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                value={editedInvoice.terms}
                onChange={onFieldValueChange.bind(this, 'terms')}
              />
            </Form.Group>
          </Form>
        </div>
        <div className="Footer-Container">
          <Row className="Footer">
            <Col sm={2}>
              <Button onClick={onClearFormClick} variant="light">
                Clear Form
              </Button>
            </Col>
            <Col sm={{ span: 2, offset: 8}}>
              <Button onClick={onSubmitClick} variant="primary">
                Create Invoice
              </Button>
            </Col>
          </Row>
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
