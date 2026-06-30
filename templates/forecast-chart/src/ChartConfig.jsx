import React from 'react';

const ChartConfig = ({
  metrics,
  setMetrics,
  xAxis,
  setXAxis,
  chartType,
  setChartType,
  onExport,
}) => {
  const metricOptions = [
    { value: 'base_forecast', label: 'Базовый прогноз' },
    { value: 'adjustment', label: 'Корректировка' },
    { value: 'consensus_forecast', label: 'Консенсус-прогноз' },
  ];
  const xAxisOptions = [
    { value: 'week_id', label: 'Неделя' },
    { value: 'month_name', label: 'Месяц' },
    { value: 'category_name', label: 'Категория' },
    { value: 'sku_name', label: 'SKU' },
    { value: 'region_name', label: 'Регион' },
    { value: 'store_name', label: 'Магазин' },
  ];

  return (
    <div className="chart-config">
      <div className="chart-config-group">
        <span className="chart-config-label">Показатели:</span>
        {metricOptions.map((opt) => (
          <label key={opt.value}>
            <input
              type="checkbox"
              checked={metrics.includes(opt.value)}
              onChange={(e) => {
                if (e.target.checked) setMetrics([...metrics, opt.value]);
                else if (metrics.length > 1) setMetrics(metrics.filter((m) => m !== opt.value));
              }}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <div className="chart-config-group">
        <label>
          Группировка по оси X:
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
            {xAxisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chart-config-group">
        <label>
          Тип графика:
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Линейный</option>
            <option value="bar">Столбчатый</option>
          </select>
        </label>
      </div>
      <button type="button" className="chart-export-btn" onClick={onExport}>
        Экспорт графика
      </button>
    </div>
  );
};

export default ChartConfig;
