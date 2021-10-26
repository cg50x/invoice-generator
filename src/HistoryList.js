import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

import { format } from 'currencyformatter.js';
import decode from './decode.js';

function HistoryList({ historyStates, onHistoryStateClick }) {
  return (
    <ListGroup>
      {historyStates.map((historyState, index) => (
        <ListGroup.Item
          action
          header={`${historyState.invoiceNumber} (${
            (historyState.toName.split('\n') || [''])[0]
          })`}
          onClick={() => onHistoryStateClick(historyState)}
          key={`historyState${index}`}
        >
          <div className="fs-6">
            {`${historyState.invoiceNumber} (${
              (historyState.toName.split('\n') || [''])[0]
            })`}
          </div>
          <div className="text-secondary">
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
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

HistoryList.propTypes = {
  onHistoryClick: PropTypes.func,
};

export default HistoryList;
