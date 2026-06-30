import { describe, it, expect } from 'vitest';

describe('ForecastChart module', () => {
  it('exports ForecastChart component', async () => {
    const mod = await import('../src/index.js');
    expect(mod.ForecastChart).toBeDefined();
    expect(mod.ChartConfig).toBeDefined();
  });
});
