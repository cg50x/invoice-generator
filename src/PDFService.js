const pdfMake = window.pdfMake;

export function saveInvoicePDF (params) {
	let docDefinition = buildDocDefinition();
	pdfMake.createPdf(docDefinition).open();
}

// Private functions
function buildDocDefinition() {
	return {
	  content: [
	    {
	      columns: [
	      	{
	      		stack: [
	      			{
	      				text: 'Chris Guevara',
	      				margin: [0, 30, 0, 30]
	      			},
	      			{
	      				text: 'Bill To',
	      				margin: [0, 0, 0, 0],
	      			},
	      			{
	      				text: 'CLIENT NAME HERE'
	      			}
	      		]
	      	},
	      	{
	      		stack: [
	      			{
	      				text: 'INVOICE',
	      				style: ['header']
	      			},
	      			{
	      				text: '# 123',
	      				style: ['subHeader'],
	      				margin: [0, 0, 0, 30]
	      			},
	      			{
	      				columns: [{
	      					width: 60,
	      					text: ''
	      				}, 
	      				{
	      					width: '*',
		      				columns: [
			      				{
			      					stack: ['Date', 'Payment Terms', 'Due Date'],
			      					alignment: 'right'
			      				},
			      				{
			      					stack: ['1/1/16', 'Biweekly', '1/2/16'],
			      					alignment: 'right'
			      				}
		      				]
		      			}]
	      			}
	      		],
	      		style: 'rightAlign'
	      	}
	      ],
	      // optional space between columns
	      columnGap: 10,
	      margin: [0, 0, 0, 30]
	    }, {
	    	table: {
	    		widths: ['*', '10%', '10%', '10%'],
	    		headerRows: 1,
	    		body: [
	    			['Item', 'Quantity', 'Rate', 'Amount'],
	    			['Hello world app', '4', '3.50', '14.00'],
	    			['Inspector app', '1', '.50', '.50'],
	    			['consumer app', '1', '.50', '.50'],
	    			['', '', 'Subtotal', '15.00']
	    		]
	    	}
	    }

	  ],
	  styles: {
	  	rightAlign: {
	  		alignment: 'right'
	  	},
	  	header: {
	  		fontSize: 25
	  	},
	  	subHeader: {
	  		fontSize: 15
	  	}
	  }
	};
}