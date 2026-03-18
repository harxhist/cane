import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Layers, TrendingUp, IndianRupeeIcon } from 'lucide-react';

// Import the data from our JSON file
import data from './db.json';
const productionData = data.productionData;

// Calculate percentage changes for summary cards
const calculateChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const latestYear = productionData[productionData.length - 1];
const previousYear = productionData[productionData.length - 2];

const productionChange = calculateChange(latestYear.production, previousYear.production);
const rateChange = calculateChange(latestYear.rate, previousYear.rate);
const revenueChange = calculateChange(latestYear.totalRevenue, previousYear.totalRevenue);

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage
const formatPercentage = (value) => {
  return value.toFixed(1) + '%';
};

export default function BusinessDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('production');
  
  const metrics = [
    { id: 'production', name: 'Production', icon: <Layers size={16} /> },
    { id: 'rate', name: 'Rate', icon: <TrendingUp size={16} /> },
    { id: 'totalRevenue', name: 'Revenue', icon: <IndianRupeeIcon size={16} /> }
  ];

  const formatYAxisTick = (value) => {
    if (selectedMetric === 'totalRevenue') {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (selectedMetric === 'production') {
      return value.toFixed(0);
    } else {
      return value;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cane Revenue</h1>
        <p className="text-gray-600">Production and Revenue Analysis (2019-2025)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Production Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Production</p>
              <p className="text-xl font-bold">{latestYear.production.toFixed(2)}</p>
            </div>
            <div className={`flex items-center ${productionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {productionChange >= 0 ? 
                <ArrowUpCircle size={20} className="mr-1" /> : 
                <ArrowDownCircle size={20} className="mr-1" />}
              <span>{formatPercentage(Math.abs(productionChange))}</span>
            </div>
          </div>
        </div>

        {/* Rate Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Rate</p>
              <p className="text-xl font-bold">{latestYear.rate.toFixed(2)}</p>
            </div>
            <div className={`flex items-center ${rateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {rateChange >= 0 ? 
                <ArrowUpCircle size={20} className="mr-1" /> : 
                <ArrowDownCircle size={20} className="mr-1" />}
              <span>{formatPercentage(Math.abs(rateChange))}</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(latestYear.totalRevenue)}</p>
            </div>
            <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueChange >= 0 ? 
                <ArrowUpCircle size={20} className="mr-1" /> : 
                <ArrowDownCircle size={20} className="mr-1" />}
              <span>{formatPercentage(Math.abs(revenueChange))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(metric => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              selectedMetric === metric.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="mr-2">{metric.icon}</span>
            {metric.name}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {selectedMetric === 'production' && 'Production Trends'}
          {selectedMetric === 'rate' && 'Rate Trends'}
          {selectedMetric === 'totalRevenue' && 'Revenue Trends'}
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis 
                tickFormatter={formatYAxisTick}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value) => {
                  if (selectedMetric === 'totalRevenue') {
                    return [formatCurrency(value), 'Revenue'];
                  } else if (selectedMetric === 'rate') {
                    return [value, 'Rate'];
                  } else {
                    return [value.toFixed(2), 'Production'];
                  }
                }}
              />
              <Legend />
              <Bar 
                dataKey={selectedMetric} 
                fill="#3b82f6" 
                barSize={30} 
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#2563eb" 
                dot={{ fill: '#2563eb', r: 4 }}
                strokeWidth={2} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Chart - All Metrics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Yearly Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#10b981" 
                domain={[300, 400]} 
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'totalRevenue') {
                    return [formatCurrency(value), 'Revenue'];
                  } else if (name === 'production') {
                    return [value.toFixed(2), 'Production'];
                  } else {
                    return [value, 'Rate'];
                  }
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="production" name="Production" fill="#3b82f6" barSize={10} />
              <Bar yAxisId="right" dataKey="rate" name="Rate" fill="#10b981" barSize={10} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="totalRevenue" 
                name="Revenue" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}