import jsPDF from 'jspdf';

function saveInvoicePDF (params) {
	let doc = new jsPDF();
    doc.text(20,20, 'Hello World!');
    doc.save('hahaha.pdf');
}

export { saveInvoicePDF };