import React, { useRef } from "react";
import { useParams } from "react-router-dom";
// import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

  const invoiceRef = useRef(); // référence pour impression

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading invoice</p>;

  const {
    _id,
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    createdAt,
  } = order;

  const handleDownload = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);
    pdf.save(`invoice_${_id}.pdf`);
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // recharge la page pour restaurer React
  };

  return (
    <div className="py-10">
      {/* Boutons Download / Print */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Print Invoice
        </button>
      </div>

      {/* Invoice */}
      <div
        ref={invoiceRef}
        id="invoice"
        className="max-w-3xl mx-auto bg-white shadow p-8 border"
      >
        {/* Header */}
        <div className="text-center border-b pb-5">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-32 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-700">INVOICE #{_id}</h1>
          <p className="text-gray-500">{new Date(createdAt).toLocaleString()}</p>
        </div>

        {/* Company / Customer */}
        <div className="flex justify-between mt-6 flex-col md:flex-row gap-4">
          {/* Company */}
          <div>
            <h2 className="font-semibold text-gray-700">Ibooker</h2>
            <p className="text-sm text-gray-600">
              455 Foggy Heights, AZ 85004, US
            </p>
            <p className="text-sm text-gray-600">(602) 519-0450</p>
            <p className="text-sm text-blue-600">
              <a href="mailto:info@shopit.com">info@shopit.com</a>
            </p>
          </div>

          {/* Customer */}
          <div className="text-right">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Address:</span></p>
            <p className="text-sm text-gray-600">
              {shippingAddress.address}<br></br>, {shippingAddress.city},{" "}<br></br>
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Payment Status:</span>{" "}
              {paymentResult?.status || "Pending"}
            </p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mt-8 border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>

          <tbody className="text-right">
            {orderItems.map((item) => (
              <tr key={item.product} className="border-b hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.qty}</td>
                <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                <td className="p-2 text-right">
                  ${(item.qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan="3" className="p-2 font-semibold text-right">
                Subtotal:
              </td>
              <td className="p-2">${itemsPrice.toFixed(2)}</td>
            </tr>

            <tr>
              <td colSpan="3" className="p-2 font-semibold text-right">
                Tax:
              </td>
              <td className="p-2">${taxPrice.toFixed(2)}</td>
            </tr>

            <tr>
              <td colSpan="3" className="p-2 font-semibold text-right">
                Shipping:
              </td>
              <td className="p-2">${shippingPrice.toFixed(2)}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan="3" className="p-2 font-bold text-right">
                Total:
              </td>
              <td className="p-2 font-bold">${totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6 border-t pt-4">
          Invoice generated automatically — valid without signature.
        </p>
      </div>
    </div>
  );
};

export default Invoice;
