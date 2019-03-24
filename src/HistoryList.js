import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import { format } from 'currencyformatter.js';
import decode from './decode.js';

function HistoryList({ historyStates, onHistoryStateClick }) {
  return (
    <ListGroup>
      {historyStates.map((historyState, index) => (
        <ListGroupItem
          header={`${historyState.invoiceNumber} (${
            (historyState.toName.split('\n') || [''])[0]
          })`}
          onClick={() => onHistoryStateClick(historyState)}
          key={`historyState${index}`}
        >
          {decode(
            format(
              historyState.lineItems.reduce(
                (prev, curr) => prev + curr.quantity * curr.rate,
                0,
              ),
              {
                currency: historyState.currency,
              },
            ),
          )}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

HistoryList.propTypes = {
  onHistoryClick: PropTypes.func,
};

export default HistoryList;
