import { useState } from "react";
import { Package, Users, FileText, Home } from "lucide-react";
import ProductsManagement from "./components/ProductsManagement";
import CustomersManagement from "./components/CustomersManagement";
import InvoiceGenerator from "./components/InvoiceGenerator";
import Dashboard from "./components/Dashboard";
import logo from "./asset/logo.svg";

type View = "dashboard" | "products" | "customers" | "invoices";

// const logo = require("./asset/logo.svg") as string;

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} />;
      case "products":
        return <ProductsManagement />;
      case "customers":
        return <CustomersManagement />;
      case "invoices":
        return <InvoiceGenerator />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex flex-col items-start justify-start gap-4">
              <img src={logo} alt="logo" />
              <div>
                <h1 className="text-slate-900 text-lg font-semibold">
                  Peniel InvoicePro
                </h1>
                <p className="text-base text-slate-500">Billing Software</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === "dashboard"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === "products"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setCurrentView("customers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === "customers"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setCurrentView("invoices")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === "invoices"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Create Invoice</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  );
}
