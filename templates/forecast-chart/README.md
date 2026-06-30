# Forecast Chart Component

React component for displaying forecast charts (line/bar) based on aggregated data from `/api/pivot`.

## Usage

```jsx
import { ForecastChart } from 'forecast-chart';

<ForecastChart
  apiBaseUrl=""
  initialFilters={{ region_name: 'Region ST1' }}
  refreshKey={dataVersion}
/>
```

## Dependencies

- chart.js ^4.4.0
- react-chartjs-2 ^5.2.0
- axios ^1.6.0

## Features

- Line and bar chart types
- Metric selection (base_forecast, adjustment, consensus_forecast)
- X-axis grouping by time, product, or location dimensions
- Auto-refresh via `refreshKey` prop
- PNG export
