const pdfMake = window.pdfMake;

export function saveInvoicePDF (params) {
	let docDefinition = buildDocDefinition(params);
	pdfMake.createPdf(docDefinition).open();
}

// Private functions
function buildDocDefinition(params) {
	return {
	  content: [
	  	buildHeaderInformation(params),
	    buildLineItemsTable(params)
	  ]
	};
}

function buildHeaderInformation(params) {
	return {
		columns: [{
			stack: [{
				text: params.fromName,
				margin: [0, 30, 0, 30]
			},{
				text: 'Bill To',
				margin: [0, 0, 0, 0],
			},{
				text: params.toName
			}]
		},{
			stack: [{
				text: 'INVOICE',
				fontSize: 25
			},{
				text: `# ${params.invoiceNumber}`,
				fontSize: 15,
				margin: [0, 0, 0, 30]
			},{
				columns: [{
					width: 60,
					text: ''
				},{
					width: '*',
					columns: [{
						stack: ['Date', 'Due Date'],
						alignment: 'right'
					},{
						stack: [params.date, params.dueDate],
						alignment: 'right'
					}]
				}]
			}],
			alignment: 'right'
		}],
		// optional space between columns
		columnGap: 10,
		margin: [0, 0, 0, 30]
	};
}

function buildLineItemsTable(params) {
	let lineItemRows = params.lineItems.map(buildLineItem);
	return {
    	table: {
    		widths: ['*', '10%', '10%', '10%'],
    		headerRows: 1,
    		body: [
    			['Item', 'Quantity', 'Rate', 'Amount'],
    			...lineItemRows
    		]
    	}
    };
}

function buildLineItem(lineItem) {
	return [
		lineItem.description,
		lineItem.quantity,
		lineItem.rate,
		lineItem.quantity * lineItem.rate
	];
}