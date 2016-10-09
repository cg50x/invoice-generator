const pdfMake = window.pdfMake;

export function saveInvoicePDF (params) {
	if (params.imageLogo) {
		console.log('imageLogo', params.imageLogo);
		let fileReader = new FileReader();
		fileReader.addEventListener('load', onDataURLLoaded.bind(null, params, fileReader), false);
		fileReader.readAsDataURL(params.imageLogo);
	} else {
		createPDFFromParams(params);
	}
}

// Private functions
function onDataURLLoaded(params, fileReader) {
	// Set imageLogo to data URI of file
	params.imageLogo = fileReader.result;
	createPDFFromParams(params);
}

function createPDFFromParams(params) {
	let docDefinition = buildDocDefinition(params);
	pdfMake.createPdf(docDefinition).open();
}

function buildDocDefinition(params) {
	let notesAndTerms = buildNotesAndTerms(params);
	console.log('notesAndTerms', notesAndTerms);
	return {
	  content: [
	  	buildHeaderInformation(params),
	    buildLineItemsTable(params),
	    buildTotal(params),
	    ...buildNotesAndTerms(params)
	  ]
	};
}

function buildHeaderInformation(params) {
	return {
		columns: [{
			stack: [
			...buildImageLogo(params),
			{
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
						stack: ['Date', 'Payment Terms', 'Due Date'],
						alignment: 'right'
					},{
						stack: [params.date, params.paymentTerms, params.dueDate],
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
    			[
    				'Item',
    				{ text: 'Quantity', alignment: 'right' },
    				{ text: 'Rate', alignment: 'right' },
    				{ text: 'Amount', alignment: 'right' }
    			],
    			...lineItemRows
    		]
    	},
    	layout: 'lightHorizontalLines'
    };
}

function buildTotal(params) {
	let total = params.lineItems.reduce((sum, lineItem) => {
		return sum + lineItem.quantity * lineItem.rate;
	}, 0);
	return {
		table: {
			widths: ['*', '10%'],
			body: [
				[{
					text: 'Total',
					alignment: 'right'
				}, {
					text: String(total),
					alignment: 'right'
				}]
			]
		},
		layout: 'noBorders',
		margin: [0, 0, 0, 30]
	};
}

// Returns an array
function buildNotesAndTerms(params) {
	let result = [];
	console.log('params', params);
	if (params.notes) {
		result = result.concat([
			{ text: 'Notes' },
			{ text: params.notes, margin: [0, 0, 0, 30] }
		]);
	}
	if (params.terms) {
		result = result.concat([
			{ text: 'Terms' },
			{ text: params.terms, margin: [0, 0, 0, 30] }
		]);
	}
	return result;
}

function buildLineItem(lineItem) {
	return [
		lineItem.description,
		{ text: lineItem.quantity, alignment: 'right' },
		{ text: lineItem.rate, alignment: 'right' },
		{ text: String(lineItem.quantity * lineItem.rate), alignment: 'right' }
	];
}

function buildImageLogo(params) {
	let result = [];
	if (params.imageLogo) {
		result.push({
			image: params.imageLogo
		});
	}
	return result;
}