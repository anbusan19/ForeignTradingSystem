const API_KEY = 'Qso1p7VqztyYs4w1wH3p5wDbCShAWjUz';
const BASE_URL = 'https://api.apilayer.com/exchangerates_data';

const headers = {
  'apikey': API_KEY
};

export interface ExchangeRate {
  rates: { [key: string]: number };
  base: string;
  date: string;
}

export interface TimeSeriesData {
  rates: { [date: string]: { [currency: string]: number } };
  base: string;
  start_date: string;
  end_date: string;
}

export const exchangeRatesService = {
  async getLatestRates(base: string = 'USD') {
    const response = await fetch(`${BASE_URL}/latest?base=${base}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    return response.json() as Promise<ExchangeRate>;
  },

  async getTimeSeries(
    startDate: string,
    endDate: string,
    base: string = 'USD',
    symbols: string[]
  ) {
    const response = await fetch(
      `${BASE_URL}/timeseries?base=${base}&start_date=${startDate}&end_date=${endDate}&symbols=${symbols.join(',')}`,
      { headers }
    );
    if (!response.ok) throw new Error('Failed to fetch time series data');
    return response.json() as Promise<TimeSeriesData>;
  }
};