import { useEffect, useState } from 'react';
import { Package, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'products' | 'customers' | 'invoices') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    invoices: 0,
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

    setStats({
      products: products.length,
      customers: customers.length,
      invoices: invoices.length,
    });
  }, []);

  const cards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => onNavigate('products'),
    },
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => onNavigate('customers'),
    },
    {
      title: 'Invoices Created',
      value: stats.invoices,
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      onClick: () => onNavigate('invoices'),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-slate-900 mb-2">Welcome back!</h2>
        <p className="text-slate-600">Here's an overview of your billing system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow border-0 overflow-hidden"
            onClick={card.onClick}
          >
            <div className={`h-2 bg-gradient-to-r ${card.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">
                {card.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('products')}
              className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
            >
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-slate-900 mb-1">Add Product</div>
              <p className="text-sm text-slate-600">Create a new product</p>
            </button>

            <button
              onClick={() => onNavigate('customers')}
              className="p-4 rounded-lg border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50 transition-all text-left"
            >
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-slate-900 mb-1">Add Customer</div>
              <p className="text-sm text-slate-600">Register new customer</p>
            </button>

            <button
              onClick={() => onNavigate('invoices')}
              className="p-4 rounded-lg border-2 border-slate-200 hover:border-orange-600 hover:bg-orange-50 transition-all text-left"
            >
              <FileText className="w-6 h-6 text-orange-600 mb-2" />
              <div className="text-slate-900 mb-1">Create Invoice</div>
              <p className="text-sm text-slate-600">Generate new invoice</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
