import { useMemo } from 'react';
import {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useInventory } from '../context/InventoryContext';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/common/ChartCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { calculateStockValue, formatCurrency } from '../utils/inventoryUtils';
import { getStockByCategory, getInventoryValueOverTime } from '../utils/dashboardUtils';

const CATEGORY_COLORS = [
  '#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#84cc16',
];

export default function Dashboard() {
  const { products, stockMovements, settings, loading, error, reload } = useInventory();

  const currency = settings?.currency || 'USD';

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const stockValue = calculateStockValue(products);
    const lowStock = products.filter((p) => p.status === 'Low Stock').length;
    const outOfStock = products.filter((p) => p.status === 'Out of Stock').length;
    return { totalProducts, stockValue, lowStock, outOfStock };
  }, [products]);

  const categoryData = useMemo(() => getStockByCategory(products), [products]);
  const valueOverTime = useMemo(
    () => getInventoryValueOverTime(products, stockMovements),
    [products, stockMovements]
  );

  if (loading) return <LoadingState label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} tone="default" />
        <StatCard
          label="Total Stock Value"
          value={formatCurrency(stats.stockValue, currency)}
          icon={DollarSign}
          tone="green"
        />
        <StatCard label="Low Stock Items" value={stats.lowStock} icon={AlertTriangle} tone="amber" />
        <StatCard label="Out of Stock" value={stats.outOfStock} icon={XCircle} tone="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Stock by Category" subtitle="Total quantity currently held per category">
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">No product data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  height={55}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Units', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(value) => [`${value} units`, 'Quantity']}
                />
                <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Inventory Value Over Time" subtitle="Reconstructed from recorded stock movements">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={valueOverTime} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                label={{ value: `Value (${currency})`, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(value) => [formatCurrency(value, currency), 'Stock Value']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                name="Inventory Value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Recent Stock Activity
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
          Latest stock-in and stock-out movements
        </p>
        <RecentActivity movements={stockMovements} />
      </div>
    </div>
  );
}
