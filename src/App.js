import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

import {
  PageHeader,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

import LineItemList from './LineItemList.js';

class App extends Component {
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
                <FormControl type="text" placeholder="4" />
              </Col>
            </FormGroup>
            <FormGroup controlId="fromName">
              <Col componentClass={ ControlLabel } sm={2}>
                From
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="4" />
              </Col>
            </FormGroup>
            <FormGroup controlId="toName">
              <Col componentClass={ ControlLabel } sm={2}>
                Bill To
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="4" />
              </Col>
            </FormGroup>
            <FormGroup controlId="date">
              <Col componentClass={ ControlLabel } sm={2}>
                Date
              </Col>
              <Col sm={10}>
                <FormControl type="date" />
              </Col>
            </FormGroup>
            <FormGroup controlId="dueDate">
              <Col componentClass={ ControlLabel } sm={2}>
                Due Date
              </Col>
              <Col sm={10}>
                <FormControl type="date" />
              </Col>
            </FormGroup>
            <FormGroup controlId="balanceDue">
              <Col componentClass={ ControlLabel } sm={2}>
                Balance Due
              </Col>
              <Col sm={10}>
                <FormControl type="number" min="0.01" step="0.01" />
              </Col>
            </FormGroup>
            <LineItemList></LineItemList>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
