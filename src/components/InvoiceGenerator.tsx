import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Printer, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Product } from "./ProductsManagement";
import type { Customer } from "./CustomersManagement";
import logo from "../asset/logo.svg";

interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  discount: number;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
}

export default function InvoiceGenerator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "",
  });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedProducts = localStorage.getItem("products");
    const storedCustomers = localStorage.getItem("customers");

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  const handleAddItem = () => {
    if (!currentItem.productId || !currentItem.quantity) return;

    const product = products.find((p) => p.id === currentItem.productId);
    if (!product) return;

    const quantity = parseFloat(currentItem.quantity);
    const amount = product.price * quantity;

    const item: InvoiceItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity,
      rate: product.price,
      amount,
    };

    setInvoiceItems([...invoiceItems, item]);
    setCurrentItem({ productId: "", quantity: "" });
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (subtotal * (selectedCustomer?.discount || 0)) / 100;
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total };
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  const handlePrint = () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add items to the invoice");
      return;
    }

    // Save invoice to localStorage
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      discount: selectedCustomer.discount,
      items: invoiceItems,
      subtotal,
      discountAmount,
      total,
    };

    const storedInvoices = localStorage.getItem("invoices");
    const invoices = storedInvoices ? JSON.parse(storedInvoices) : [];
    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));

    // Print
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
            .company-info h1 { color: #6366f1; font-size: 32px; margin-bottom: 5px; }
            .company-info p { color: #666; font-size: 14px; }
            .invoice-info { text-align: right; }
            .invoice-info h2 { color: #6366f1; font-size: 24px; margin-bottom: 10px; }
            .invoice-info p { color: #666; font-size: 14px; margin-bottom: 5px; }
            .customer-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .customer-info h3 { color: #333; margin-bottom: 10px; font-size: 16px; }
            .customer-info p { color: #666; font-size: 14px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            thead { background: #6366f1; color: white; }
            th { padding: 12px; text-align: left; font-size: 14px; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            tbody tr:hover { background: #f8f9fa; }
            .text-right { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
            .totals-row.subtotal { border-top: 1px solid #e5e7eb; }
            .totals-row.discount { color: #10b981; }
            .totals-row.total { border-top: 2px solid #6366f1; font-size: 18px; font-weight: bold; color: #6366f1; margin-top: 10px; padding-top: 15px; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-info">
              <img src="${logo}" alt="logo" style="height:50px; margin-bottom:10px;" />
                <h1>InvoicePro</h1>
                <p>Professional Billing Software</p>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoice.date}</p>
              </div>
            </div>

            <div class="customer-info">
              <h3>Bill To:</h3>
              <p><strong>${invoice.customerName}</strong></p>
              <p>${invoice.customerEmail}</p>
              <p>${invoice.customerPhone}</p>
              <p>${invoice.customerAddress}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">$${item.rate.toFixed(2)}</td>
                    <td class="text-right">$${item.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row subtotal">
                <span>Subtotal:</span>
                <span>$${invoice.subtotal.toFixed(2)}</span>
              </div>
              ${
                invoice.discount > 0
                  ? `
                <div class="totals-row discount">
                  <span>Discount (${invoice.discount}%):</span>
                  <span>-$${invoice.discountAmount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div class="totals-row total">
                <span>Total:</span>
                <span>$${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated invoice.</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    // Reset form
    setSelectedCustomer(null);
    setInvoiceItems([]);
    setCurrentItem({ productId: "", quantity: "" });
  };

  return (
    <div className="p-8">
      <Card className="border-0 shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Create Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Customer Selection */}
          <div className="mb-6">
            <Label>Select Customer</Label>
            <Select onValueChange={handleCustomerSelect}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCustomer && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Customer Name</p>
                  <p className="text-slate-900">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-slate-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="text-slate-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Discount</p>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                    {selectedCustomer.discount}% OFF
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Add Product Section */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-slate-900 mb-4">Add Product</h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <Label>Product</Label>
                <Select
                  value={currentItem.productId}
                  onValueChange={(value: string) =>
                    setCurrentItem({ ...currentItem, productId: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, quantity: e.target.value })
                  }
                  placeholder="0"
                  className="mt-2"
                />
              </div>
              <div className="col-span-2 flex items-end">
                <Button
                  onClick={handleAddItem}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          {invoiceItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-slate-900 mb-4">Invoice Items</h3>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-slate-600">
                        Product
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-600">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-600">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-600">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-4 py-3 text-slate-900">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          ${item.rate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 ml-auto w-80 space-y-2">
                <div className="flex justify-between p-3 bg-slate-50 rounded">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                {selectedCustomer && selectedCustomer.discount > 0 && (
                  <div className="flex justify-between p-3 bg-green-50 rounded">
                    <span className="text-green-600">
                      Discount ({selectedCustomer.discount}%):
                    </span>
                    <span className="text-green-600">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Print Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handlePrint}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden print content */}
      <div ref={printRef} style={{ display: "none" }} />
    </div>
  );
}
