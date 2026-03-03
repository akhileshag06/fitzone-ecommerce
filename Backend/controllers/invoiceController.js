const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('items.product', 'name image category');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);

    doc.pipe(res);

    // ===== HEADER =====
    doc
      .fillColor('#ffb74d')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('FIT ZONE', 50, 50);

    doc
      .fillColor('#666666')
      .fontSize(10)
      .font('Helvetica')
      .text('Premium Fitness Supplements & Gear', 50, 85)
      .text('support@fitzone.com  |  www.fitzone.com', 50, 100);

    // Right side - INVOICE label
    doc
      .fillColor('#333333')
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 50, { align: 'right' });

    // ✅ FIX: Each line has its own Y position with enough gap — no overlapping
    doc.fillColor('#666666').fontSize(10).font('Helvetica');
    doc.text('Invoice #:', 350, 80, { align: 'right', width: 195 });
    doc.text(order.orderId, 350, 94, { align: 'right', width: 195 });
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      })}`,
      350, 112, { align: 'right', width: 195 }
    );
    doc.text(`Status: ${order.status}`, 350, 128, { align: 'right', width: 195 });

    // Divider line
    doc
      .strokeColor('#ffb74d')
      .lineWidth(2)
      .moveTo(50, 150)
      .lineTo(550, 150)
      .stroke();

    // ===== BILL TO =====
    doc
      .fillColor('#333333')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('BILL TO:', 50, 170);

    doc
      .fillColor('#555555')
      .fontSize(10)
      .font('Helvetica')
      .text(order.shippingAddress?.fullName || order.user.name, 50, 188)
      .text(order.user.email, 50, 203)
      .text(order.user.phoneNumber || '', 50, 218)
      .text(order.shippingAddress?.address || '', 50, 233)
      .text(`${order.shippingAddress?.city || ''} - ${order.shippingAddress?.zipCode || ''}`, 50, 248);

    // Payment info on right
    doc
      .fillColor('#333333')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('PAYMENT METHOD:', 350, 170);

    const paymentMethod = order.paymentInfo?.method || 'Razorpay';
    const paymentId = order.paymentInfo?.razorpayPaymentId || order.paymentInfo?.transactionId || 'N/A';

    doc
      .fillColor('#555555')
      .fontSize(10)
      .font('Helvetica')
      .text(paymentMethod.toUpperCase(), 350, 188)
      .text(`Txn ID: ${paymentId}`, 350, 203);

    // ===== ITEMS TABLE HEADER =====
    const tableTop = 290;

    doc
      .fillColor('#ffb74d')
      .rect(50, tableTop, 500, 25)
      .fill();

    doc
      .fillColor('#000000')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('#', 60, tableTop + 7)
      .text('PRODUCT', 90, tableTop + 7)
      .text('QTY', 330, tableTop + 7)
      .text('UNIT PRICE', 380, tableTop + 7)
      .text('TOTAL', 470, tableTop + 7);

    // ===== ITEMS =====
    let y = tableTop + 35;
    let rowIndex = 0;

    for (const item of order.items) {
      if (rowIndex % 2 === 0) {
        doc.fillColor('#f9f9f9').rect(50, y - 5, 500, 22).fill();
      }

      const itemTotal = item.price * item.quantity;

      doc
        .fillColor('#333333')
        .fontSize(9)
        .font('Helvetica')
        .text(String(rowIndex + 1), 60, y)
        .text(item.name || item.product?.name || 'Product', 90, y, { width: 230 })
        .text(String(item.quantity), 335, y)
        .text(`Rs. ${item.price.toLocaleString('en-IN')}`, 375, y)
        .text(`Rs. ${itemTotal.toLocaleString('en-IN')}`, 465, y);

      if (item.selectedFlavor) {
        y += 13;
        doc.fillColor('#888888').fontSize(8).text(`Flavor: ${item.selectedFlavor}`, 90, y);
      }

      y += 25;
      rowIndex++;
    }

    // Divider
    doc.strokeColor('#dddddd').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    y += 15;

    // ===== TOTALS =====
    const totalsX = 350;

    doc
      .fillColor('#555555').fontSize(10).font('Helvetica')
      .text('Subtotal:', totalsX, y)
      .text(`Rs. ${order.subtotal.toLocaleString('en-IN')}`, totalsX + 100, y, { align: 'right', width: 100 });

    y += 18;
    doc
      .text('Shipping:', totalsX, y)
      .text(order.shippingCost === 0 ? 'FREE' : `Rs. ${order.shippingCost.toLocaleString('en-IN')}`, totalsX + 100, y, { align: 'right', width: 100 });

    y += 18;

    // Total box
    doc.fillColor('#ffb74d').rect(totalsX - 10, y - 5, 215, 28).fill();
    doc
      .fillColor('#000000').fontSize(13).font('Helvetica-Bold')
      .text('TOTAL:', totalsX, y + 2)
      .text(`Rs. ${order.total.toLocaleString('en-IN')}`, totalsX + 100, y + 2, { align: 'right', width: 100 });

    // ===== FOOTER =====
    const footerY = doc.page.height - 80;

    doc.strokeColor('#ffb74d').lineWidth(1).moveTo(50, footerY).lineTo(550, footerY).stroke();

    doc
      .fillColor('#888888').fontSize(9).font('Helvetica')
      .text('Thank you for shopping with FIT ZONE! 💪', 50, footerY + 12, { align: 'center', width: 500 })
      .text('For any queries, contact us at support@fitzone.com', 50, footerY + 27, { align: 'center', width: 500 })
      .text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 42, { align: 'center', width: 500 });

    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate invoice' });
    }
  }
};

module.exports = { generateInvoice };