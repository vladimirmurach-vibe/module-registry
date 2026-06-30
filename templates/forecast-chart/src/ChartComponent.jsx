import React, { useEffect, useRef, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import ChartConfig from './ChartConfig';
import './styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const METRIC_COLORS = {
  base_forecast: { border: '#6b7280', bg: '#6b728033' },
  adjustment: { border: '#f59e0b', bg: '#f59e0b33' },
  consensus_forecast: { border: '#15803d', bg: '#15803d33' },
};

const METRIC_LABELS = {
  base_forecast: 'Базовый прогноз',
  adjustment: 'Корректировка',
  consensus_forecast: 'Консенсус-прогноз',
};

function pivotToChartData(pivotResponse, xAxis, metrics) {
  const labels = [];
  const valueMap = new Map();

  for (const cell of pivotResponse.cells || []) {
    const label = cell.row?.[xAxis] ?? cell.col?.[xAxis] ?? '—';
    if (!labels.includes(label)) labels.push(label);
    const existing = valueMap.get(label) || {};
    for (const metric of metrics) {
      existing[metric] = (existing[metric] || 0) + (cell.values?.[metric] || 0);
    }
    valueMap.set(label, existing);
  }

  const datasets = metrics.map((metric) => ({
    label: METRIC_LABELS[metric] || metric,
    data: labels.map((label) => valueMap.get(label)?.[metric] ?? 0),
    borderColor: METRIC_COLORS[metric]?.border || '#8884d8',
    backgroundColor: METRIC_COLORS[metric]?.bg || '#8884d833',
    fill: false,
  }));

  return { labels, datasets };
}

const ForecastChart = ({ apiBaseUrl = '', initialFilters = {}, refreshKey = 0 }) => {
  const [chartType, setChartType] = useState('line');
  const [metrics, setMetrics] = useState(['base_forecast', 'adjustment', 'consensus_forecast']);
  const [xAxis, setXAxis] = useState('week_id');
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const chartRef = useRef(null);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/api/pivot`, {
        rows: [xAxis],
        cols: [],
        metrics,
        filters,
      });
      setData(pivotToChartData(response.data, xAxis, metrics));
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [metrics, xAxis, filters, chartType, refreshKey]);

  const exportPng = () => {
    const canvas = chartRef.current?.canvas;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'forecast_chart.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return (
    <div className="forecast-chart-container">
      <ChartConfig
        metrics={metrics}
        setMetrics={setMetrics}
        xAxis={xAxis}
        setXAxis={setXAxis}
        chartType={chartType}
        setChartType={setChartType}
        onExport={exportPng}
      />
      {loading ? (
        <div className="chart-loading">Загрузка...</div>
      ) : (
        <div className="chart-wrapper">
          <ChartComponent
            ref={chartRef}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Прогноз' },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ForecastChart;
