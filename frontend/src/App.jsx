import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CreditCard,
  Crown,
  LayoutDashboard,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
  Truck,
  Wallet,
} from 'lucide-react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API = 'http://localhost:8080/api/dashboard'

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Sales Analytics', icon: BarChart3 },
  { label: 'Products', icon: Boxes },
  { label: 'Customers', icon: Users },
  { label: 'Customer Intelligence', icon: Crown },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Payments', icon: CreditCard },
  { label: 'Delivery', icon: Truck },
]

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('en-US')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

function MetricCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </article>
  )
}

function App() {
  const [kpis, setKpis] = useState(null)
  const [monthlySales, setMonthlySales] = useState([])
  const [categories, setCategories] = useState([])
  const [customerInsights, setCustomerInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentInsights, setPaymentInsights] = useState([])
  const [orderInsights, setOrderInsights] = useState([])
  const [advancedCustomerKpis, setAdvancedCustomerKpis] = useState(null)
  const [customerSegments, setCustomerSegments] = useState([])
  const [customerRetention, setCustomerRetention] = useState([])
  const [activeSection, setActiveSection] = useState('overview')
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '', paymentType: '', category: '' })
  const [appliedFilters, setAppliedFilters] = useState({ startDate: '', endDate: '', status: '', paymentType: '', category: '' })

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      const [
        kpiResponse,
        salesResponse,
        categoryResponse,
        customerResponse,
        paymentResponse,
        orderResponse,
        advancedKpiResponse,
        segmentResponse,
        retentionResponse,
      ] = await Promise.all([
        fetch(`${API}/kpis`),
        fetch(`${API}/monthly-sales`),
        fetch(`${API}/top-categories`),
        fetch(`${API}/customer-insights`),
        fetch(`${API}/payment-insights`),
        fetch(`${API}/order-insights`),
        fetch(`${API}/customer-advanced-kpis`),
        fetch(`${API}/customer-segments`),
        fetch(`${API}/customer-retention`),
      ])

      if (
        !kpiResponse.ok ||
        !salesResponse.ok ||
        !categoryResponse.ok ||
        !customerResponse.ok ||
        !paymentResponse.ok ||
        !orderResponse.ok ||
        !advancedKpiResponse.ok ||
        !segmentResponse.ok ||
        !retentionResponse.ok
      ) {
        throw new Error(
          'A dashboard API returned an error. Check the Spring Boot endpoints.',
        )
      }

      const [
        kpiData,
        salesData,
        categoryData,
        customerData,
        paymentData,
        orderData,
        advancedKpiData,
        segmentData,
        retentionData,
      ] = await Promise.all([
        kpiResponse.json(),
        salesResponse.json(),
        categoryResponse.json(),
        customerResponse.json(),
        paymentResponse.json(),
        orderResponse.json(),
        advancedKpiResponse.json(),
        segmentResponse.json(),
        retentionResponse.json(),
      ])

      setKpis(kpiData)

      setMonthlySales(
        salesData.map((item) => ({
          ...item,
          sales: Number(item.total_item_sales ?? 0),
        })),
      )

      setCategories(
        categoryData.map((item) => ({
          ...item,
          sales: Number(item.total_sales ?? 0),
          orders: Number(item.total_orders ?? 0),
        })),
      )

      setCustomerInsights(
        customerData.map((item) => ({
          ...item,
          total_customers: Number(item.total_customers ?? 0),
        })),
      )

      setPaymentInsights(
        paymentData.map((item) => ({
          ...item,
          total_payment_value: Number(item.total_payment_value ?? 0),
          total_orders: Number(item.total_orders ?? 0),
          payment_records: Number(item.payment_records ?? 0),
          average_payment_value: Number(item.average_payment_value ?? 0),
        })),
      )

      setOrderInsights(
        orderData.map((item) => ({ ...item, total_orders: Number(item.total_orders ?? 0) })),
      )
      setAdvancedCustomerKpis(advancedKpiData)
      setCustomerSegments(segmentData.map((item) => ({ ...item, total_customers: Number(item.total_customers ?? 0), customer_percentage: Number(item.customer_percentage ?? 0), average_lifetime_sales: Number(item.average_lifetime_sales ?? 0), average_orders: Number(item.average_orders ?? 0) })))
      setCustomerRetention(retentionData.map((item) => ({ ...item, active_customers: Number(item.active_customers ?? 0), returning_customers: Number(item.returning_customers ?? 0), returning_customer_rate: Number(item.returning_customer_rate ?? 0) })))
      setLastRefreshed(new Date())
    } catch (err) {
      setError(
        err.message ||
          'Unable to connect to the backend. Make sure Spring Boot is running on port 8080.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    const sectionIds = ['overview', 'sales', 'products', 'customers', 'customer-intelligence', 'orders', 'payments', 'delivery']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -65% 0px', threshold: [0, 0.1, 0.25, 0.5] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  async function applyFilters(event) {
    event.preventDefault()

    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      setError('Start date must be on or before the end date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      const response = await fetch(`${API}/filtered-order-insights?${params.toString()}`)
      if (!response.ok) throw new Error('Unable to apply filters. Check the filtered analytics API.')
      const data = await response.json()
      setOrderInsights(data.map((item) => ({ ...item, total_orders: Number(item.total_orders ?? 0) })))
      setAppliedFilters({ ...filters })
    } catch (err) {
      setError(err.message || 'Unable to apply filters.')
    } finally {
      setLoading(false)
    }
  }

  async function resetFilters() {
    const emptyFilters = { startDate: '', endDate: '', status: '', paymentType: '', category: '' }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API}/order-insights`)
      if (!response.ok) throw new Error('Unable to reset order filters.')
      const data = await response.json()
      setOrderInsights(data.map((item) => ({ ...item, total_orders: Number(item.total_orders ?? 0) })))
    } catch (err) {
      setError(err.message || 'Unable to reset filters.')
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    {
      title: 'Delivered Orders',
      value: formatNumber(kpis?.delivered_orders),
      subtitle: 'Successfully delivered orders',
      icon: ShoppingCart,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Unique Customers',
      value: formatNumber(kpis?.unique_customers),
      subtitle: 'Customers who placed delivered orders',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Item Sales',
      value: formatCurrency(kpis?.total_item_sales),
      subtitle: 'Product sales, excluding freight',
      icon: Wallet,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'On-Time Delivery',
      value:
        kpis?.on_time_delivery_percentage != null
          ? `${Number(kpis.on_time_delivery_percentage).toFixed(2)}%`
          : '—',
      subtitle: 'Delivered by the estimated date',
      icon: Truck,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  const customerColors = ['#0f766e', '#f59e0b']

  const totalCustomers = customerInsights.reduce(
    (total, customer) => total + customer.total_customers,
    0,
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col self-start overflow-y-auto bg-slate-950 text-white lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="rounded-xl bg-indigo-500 p-2.5">
              <BarChart3 size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                InsightSQL
              </h1>
              <p className="text-xs text-slate-400">
                Business Intelligence
              </p>
            </div>
          </div>

          <div className="px-4 pt-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map(({ label, icon: Icon }, index) => (
                <button
                  key={label}
                  onClick={() => {
                    const targets = [
                      'overview',
                      'sales',
                      'products',
                      'customers',
                      'customer-intelligence',
                      'orders',
                      'payments',
                      'delivery',
                    ]

                    document
                      .getElementById(targets[index])
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    activeSection === ['overview', 'sales', 'products', 'customers', 'customer-intelligence', 'orders', 'payments', 'delivery'][index]
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Data source
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                PostgreSQL · Spring Boot API
              </p>

              <p className="mt-3 text-xs text-emerald-300">
                Live database queries
              </p>
            </div>
          </div>
        </aside>

        {/* Main dashboard */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Analytics / Overview
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Business Overview
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                PostgreSQL Analytics
              </span>

              <button
                onClick={loadDashboard}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
              {lastRefreshed && <span className="hidden text-xs text-slate-400 xl:inline">Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
            <nav aria-label="Dashboard sections" className="order-3 -mx-5 flex w-[calc(100%+2.5rem)] gap-2 overflow-x-auto border-t border-slate-100 px-5 pt-3 lg:hidden sm:-mx-8 sm:w-[calc(100%+4rem)] sm:px-8">
              {navigation.map(({ label, icon: Icon }, index) => {
                const targets = ['overview', 'sales', 'products', 'customers', 'customer-intelligence', 'orders', 'payments', 'delivery']
                return <button key={label} onClick={() => document.getElementById(targets[index])?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${activeSection === targets[index] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Icon size={14} />{label}</button>
              })}
            </nav>
          </header>

          <div className="mx-auto max-w-[1600px] space-y-7 p-5 sm:p-8">
            {/* Overview */}
            <section
              id="overview"
              className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Your business at a glance
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Key performance indicators calculated from your e-commerce dataset.
                </p>
              </div>

              <p className="text-xs text-slate-400">
                Currency: Brazilian Real (BRL)
              </p>
            </section>

            {/* Interactive order filters (Phase 5) */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900">Explore Order Data</h3>
                <p className="mt-1 text-sm text-slate-500">Filter order-status analytics by purchase date, status, payment method, and product category.</p>
              </div>
              <form onSubmit={applyFilters} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <label className="text-xs font-medium text-slate-600">Start date
                  <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-600">End date
                  <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400" />
                </label>
                <label className="text-xs font-medium text-slate-600">Order status
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400">
                    <option value="">All statuses</option>
                    {['delivered', 'shipped', 'canceled', 'unavailable', 'invoiced', 'processing', 'created', 'approved'].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-600">Payment method
                  <select value={filters.paymentType} onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400">
                    <option value="">All payment methods</option>
                    {['credit_card', 'boleto', 'voucher', 'debit_card', 'not_defined'].map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-600">Product category
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400">
                    <option value="">All categories</option>
                    {categories.map((item) => <option key={item.category} value={item.category}>{item.category}</option>)}
                  </select>
                </label>
                <div className="flex flex-wrap items-end gap-2 sm:col-span-2 xl:col-span-5">
                  <button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">Apply filters</button>
                  <button type="button" onClick={resetFilters} disabled={loading} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">Reset</button>
                  <p className="text-xs text-slate-400">Filters update the Order Status chart; other overview cards remain based on the full dataset.</p>
                </div>
              </form>
            </section>

            {error && (
              <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>

                <button
                  onClick={loadDashboard}
                  className="flex shrink-0 items-center gap-2 font-semibold"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            )}

            {loading && !kpis ? (
              <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
                <LoaderCircle size={20} className="animate-spin" />
                Loading analytics from your database...
              </div>
            ) : (
              <section className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.title} {...metric} />
                ))}
              </section>
            )}

            {/* Sales and delivery */}
            <section
              id="sales"
              className="grid gap-6 xl:grid-cols-3"
            >
              <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Monthly Sales
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Product sales by order purchase month
                    </p>
                  </div>

                  <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                    Historical overview
                  </span>
                </div>

                <div className="mt-7 h-72 w-full">
                  {monthlySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlySales}
                        margin={{
                          top: 8,
                          right: 12,
                          left: 8,
                          bottom: 4,
                        }}
                      >
                        <CartesianGrid
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={24}
                        />

                        <YAxis
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            value >= 1000000
                              ? `${(value / 1000000).toFixed(1)}M`
                              : `${Math.round(value / 1000)}K`
                          }
                        />

                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value),
                            'Item sales',
                          ]}
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            fontSize: 12,
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="sales"
                          name="Item sales"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      {loading
                        ? 'Loading sales data...'
                        : 'No monthly sales data available.'}
                    </div>
                  )}
                </div>
              </article>

              <article
                id="delivery"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Delivery Performance
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      On-time delivery rate
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Activity size={20} />
                  </div>
                </div>

                <div className="flex flex-col items-center py-8">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#10b981 ${
                        Number(
                          kpis?.on_time_delivery_percentage ?? 0,
                        ) * 3.6
                      }deg, #e2e8f0 0deg)`,
                    }}
                  >
                    <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-3xl font-bold text-slate-900">
                        {kpis?.on_time_delivery_percentage != null
                          ? `${Number(
                              kpis.on_time_delivery_percentage,
                            ).toFixed(2)}%`
                          : '—'}
                      </span>

                      <span className="mt-1 text-xs text-slate-500">
                        On time
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm leading-6 text-slate-500">
                    Percentage of eligible delivered orders that arrived by
                    their estimated delivery date.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Delivery status
                    </span>

                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                      <ArrowUpRight size={16} />
                      Calculated from data
                    </span>
                  </div>
                </div>
              </article>
            </section>

            {/* Product and customer analytics */}
            <section className="grid gap-6 xl:grid-cols-2">
              {/* Product categories */}
              <article
                id="products"
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Package size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Top Product Categories
                    </h3>

                    <p className="text-sm text-slate-500">
                      Top 10 categories ranked by item sales
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-80 w-full">
                  {categories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categories}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 20,
                          left: 15,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            `${(value / 1000).toFixed(0)}K`
                          }
                        />

                        <YAxis
                          type="category"
                          dataKey="category"
                          width={125}
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                        />

                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value),
                            'Item sales',
                          ]}
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            fontSize: 12,
                          }}
                        />

                        <Bar
                          dataKey="sales"
                          name="Item sales"
                          fill="#6366f1"
                          radius={[0, 5, 5, 0]}
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      {loading
                        ? 'Loading product categories...'
                        : 'No category data available.'}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Sales are calculated from delivered orders and exclude freight.
                </p>
              </article>

              {/* Customer insights */}
              <article
                id="customers"
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Users size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Customer Insights
                    </h3>

                    <p className="text-sm text-slate-500">
                      One-time versus repeat customers
                    </p>
                  </div>
                </div>

                {customerInsights.length > 0 ? (
                  <>
                    <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                      {/* Donut chart */}
                      <div className="h-60 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={customerInsights}
                              dataKey="total_customers"
                              nameKey="customer_type"
                              cx="50%"
                              cy="50%"
                              innerRadius={58}
                              outerRadius={86}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {customerInsights.map((customer, index) => (
                                <Cell
                                  key={customer.customer_type}
                                  fill={
                                    customerColors[
                                      index % customerColors.length
                                    ]
                                  }
                                />
                              ))}
                            </Pie>

                            <Tooltip
                              formatter={(value) => [
                                formatNumber(value),
                                'Customers',
                              ]}
                              contentStyle={{
                                borderRadius: 12,
                                border: '1px solid #e2e8f0',
                                fontSize: 12,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Chart summary */}
                      <div className="space-y-5">
                        {customerInsights.map((customer, index) => {
                          const percentage =
                            totalCustomers > 0
                              ? (customer.total_customers / totalCustomers) *
                                100
                              : 0

                          return (
                            <div key={customer.customer_type}>
                              <div className="flex items-start gap-2">
                                <span
                                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor:
                                      customerColors[
                                        index % customerColors.length
                                      ],
                                  }}
                                />

                                <p className="text-sm leading-5 text-slate-600">
                                  {customer.customer_type}
                                </p>
                              </div>

                              <p className="mt-1 text-2xl font-bold text-slate-900">
                                {formatNumber(customer.total_customers)}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {percentage.toFixed(2)}% of analyzed customers
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs leading-5 text-slate-500">
                        Customers are classified by the number of distinct
                        delivered orders associated with their customer
                        identity in the dataset.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-60 flex-col items-center justify-center text-center">
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={22}
                          className="animate-spin text-emerald-600"
                        />
                        <p className="mt-3 text-sm text-slate-500">
                          Loading customer insights...
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No customer insights available.
                      </p>
                    )}
                  </div>
                )}
              </article>
            </section>

            {/* Phase 6: advanced customer analytics */}
            <section id="customer-intelligence" className="scroll-mt-36 space-y-6 lg:scroll-mt-24">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Advanced Customer Intelligence</h3>
                <p className="mt-1 text-sm text-slate-500">Understand repeat buying, customer value, loyalty segments, and monthly returning-customer activity.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { title: 'Repeat Purchase Rate', value: advancedCustomerKpis?.repeat_purchase_rate != null ? `${Number(advancedCustomerKpis.repeat_purchase_rate).toFixed(2)}%` : '—', note: 'Customers with 2+ delivered orders', icon: Users, tone: 'bg-emerald-50 text-emerald-700' },
                  { title: 'Average Order Value', value: formatCurrency(advancedCustomerKpis?.average_order_value), note: 'Average item sales per delivered order', icon: Wallet, tone: 'bg-indigo-50 text-indigo-700' },
                  { title: 'Avg. Lifetime Sales', value: formatCurrency(advancedCustomerKpis?.average_customer_lifetime_sales), note: 'Average delivered item sales per customer', icon: Activity, tone: 'bg-violet-50 text-violet-700' },
                  { title: 'Orders per Customer', value: advancedCustomerKpis?.average_orders_per_customer != null ? Number(advancedCustomerKpis.average_orders_per_customer).toFixed(2) : '—', note: `${formatNumber(advancedCustomerKpis?.analyzed_customers)} customers analyzed`, icon: ShoppingCart, tone: 'bg-amber-50 text-amber-700' },
                ].map((metric) => <MetricCard key={metric.title} title={metric.title} value={metric.value} subtitle={metric.note} icon={metric.icon} color={metric.tone} />)}
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h4 className="font-bold text-slate-900">Customer Loyalty Segments</h4>
                  <p className="mt-1 text-sm text-slate-500">Grouped by number of distinct delivered orders per customer identity.</p>
                  {customerSegments.length ? <>
                    <div className="mt-4 h-72 min-w-0"><ResponsiveContainer width="100%" height="100%"><BarChart data={customerSegments} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}><CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="customer_segment" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} /><YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} /><Tooltip formatter={(value, name) => [formatNumber(value), name === 'total_customers' ? 'Customers' : name]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} /><Bar dataKey="total_customers" name="Customers" fill="#0f766e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
                    <div className="mt-3 space-y-2">{customerSegments.map((segment) => <div key={segment.customer_segment} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"><span className="text-sm font-medium text-slate-700">{segment.customer_segment}</span><span className="text-sm text-slate-600">{formatNumber(segment.total_customers)} · {segment.customer_percentage.toFixed(2)}%</span><span className="text-xs text-slate-500">Avg. lifetime sales {formatCurrency(segment.average_lifetime_sales)}</span></div>)}</div>
                  </> : <div className="flex h-60 items-center justify-center text-sm text-slate-400">No customer segment data available.</div>}
                </article>
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h4 className="font-bold text-slate-900">Monthly Returning-Customer Rate</h4>
                  <p className="mt-1 text-sm text-slate-500">Share of customers active in a month who had a delivered order in an earlier month.</p>
                  {customerRetention.length ? <div className="mt-4 h-80 min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={customerRetention} margin={{ top: 10, right: 12, left: 0, bottom: 8 }}><CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} minTickGap={18} /><YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} unit="%" /><Tooltip formatter={(value, name) => [name === 'returning_customer_rate' ? `${Number(value).toFixed(2)}%` : formatNumber(value), name === 'returning_customer_rate' ? 'Returning rate' : name === 'returning_customers' ? 'Returning customers' : 'Active customers']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} /><Legend /><Line type="monotone" dataKey="returning_customer_rate" name="Returning rate" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} /></LineChart></ResponsiveContainer></div> : <div className="flex h-60 items-center justify-center text-sm text-slate-400">No retention data available.</div>}
                  {customerRetention.length > 0 && <div className="mt-3 rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-800">Returning customers are identified using customer_unique_id and must have at least one delivered order before the current calendar month. This is a monthly repeat-activity measure, not a fixed cohort-retention curve.</div>}
                </article>
              </div>
            </section>

            {/* Order status analytics */}
            <section id="orders" className="scroll-mt-36 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600"><ShoppingCart size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900">Order Status Analytics</h3>
                  <p className="text-sm text-slate-500">Order counts for the selected filters</p>
                </div>
              </div>
              <div className="mt-6 h-80 w-full">
                {orderInsights.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderInsights} margin={{ top: 10, right: 20, left: 5, bottom: 10 }}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                      <XAxis dataKey="order_status" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toLocaleString('en-US')} />
                      <Tooltip formatter={(value) => [formatNumber(value), 'Orders']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                      <Bar dataKey="total_orders" name="Orders" fill="#6366f1" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No orders match the selected filters.</div>
                )}
              </div>
              {(appliedFilters.startDate || appliedFilters.endDate || appliedFilters.status || appliedFilters.paymentType || appliedFilters.category) && (
                <p className="mt-2 text-xs text-slate-500">Filtered results are based on order purchase date and the selected order, payment, and category criteria.</p>
              )}
            </section>

            {/* Payment analytics */}
            <section id="payments" className="scroll-mt-36 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><CreditCard size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900">Payment Analytics</h3>
                  <p className="text-sm text-slate-500">Transaction value by payment method</p>
                </div>
              </div>
              {paymentInsights.length > 0 ? (
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div className="h-72 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={paymentInsights} dataKey="total_payment_value" nameKey="payment_type" cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={3}>
                          {paymentInsights.map((payment, index) => <Cell key={payment.payment_type} fill={['#4f46e5', '#0f766e', '#f59e0b', '#db2777', '#64748b'][index % 5]} />)}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Payment value']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {paymentInsights.map((payment) => (
                      <div key={payment.payment_type} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-sm font-semibold capitalize text-slate-700">{String(payment.payment_type).replaceAll('_', ' ')}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatNumber(payment.total_orders)} distinct orders · {formatNumber(payment.payment_records)} payment records</p>
                          <p className="mt-1 text-xs text-slate-500">Average record: {formatCurrency(payment.average_payment_value)}</p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-900">{formatCurrency(payment.total_payment_value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-slate-400">No payment data available.</div>
              )}
              <p className="mt-3 text-xs text-slate-400">Payment totals include payment records across all order statuses and are not restricted by the order filters above.</p>
            </section>

            <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">
              <p>InsightSQL · E-commerce Analytics Platform</p>
              <p>React · Spring Boot · PostgreSQL{lastRefreshed ? ` · Refreshed ${lastRefreshed.toLocaleString()}` : ''}</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App