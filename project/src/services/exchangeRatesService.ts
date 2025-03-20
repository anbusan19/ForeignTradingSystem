// Base exchange rates (USD as base)
const BASE_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 82.95,
  JPY: 149.12,
  CHF: 0.89,
  CAD: 1.35,
  AUD: 1.52,
  NZD: 1.64,
};

// Add some random fluctuation to simulate real-time changes
const addRandomFluctuation = (rate: number): number => {
  const fluctuation = (Math.random() - 0.5) * 0.001; // Small random change
  return Number((rate + fluctuation).toFixed(4));
};

const API_KEY = 'Qso1p7VqztyYs4w1wH3p5wDbCShAWjUz';
const BASE_URL = 'https://api.apilayer.com/exchangerates_data';

export type CurrencyRate = {
  code: string;
  rate: number;
};

export interface ExchangeRateResponse {
  success: boolean;
  rates: { [key: string]: number };
  base: string;
  date: string;
}

export interface TimeSeriesResponse {
  success: boolean;
  rates: { [date: string]: { [currency: string]: number } };
  base: string;
  start_date: string;
  end_date: string;
}

const headers = new Headers({
  'apikey': API_KEY
});

const requestOptions: RequestInit = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

// Generate historical data for a currency pair
const generateHistoricalData = (
  startDate: Date,
  endDate: Date,
  baseRate: number
): { [date: string]: number } => {
  const data: { [date: string]: number } = {};
  let currentDate = new Date(startDate);
  let rate = baseRate;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    // Add some random walk to the rate
    rate = rate * (1 + (Math.random() - 0.5) * 0.02);
    data[dateStr] = Number(rate.toFixed(4));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

export const exchangeRatesService = {
  // Get latest rates
  getLatestRates: (base: string = 'USD'): ExchangeRateResponse => {
    const rates: { [key: string]: number } = {};
    const baseRate = BASE_RATES[base as keyof typeof BASE_RATES] || 1;

    // Calculate cross-rates
    Object.entries(BASE_RATES).forEach(([currency, rate]) => {
      rates[currency] = addRandomFluctuation(rate / baseRate);
    });

    return {
      success: true,
      rates,
      base,
      date: new Date().toISOString().split('T')[0]
    };
  },

  // Get time series data
  getTimeSeries: (
    startDate: string,
    endDate: string,
    base: string = 'USD',
    symbols: string[] = []
  ): TimeSeriesResponse => {
    const rates: { [date: string]: { [currency: string]: number } } = {};
    const currenciesToInclude = symbols.length > 0 ? symbols : Object.keys(BASE_RATES);
    const start = new Date(startDate);
    const end = new Date(endDate);

    currenciesToInclude.forEach(currency => {
      const baseRate = BASE_RATES[currency as keyof typeof BASE_RATES] / BASE_RATES[base as keyof typeof BASE_RATES];
      const historicalData = generateHistoricalData(start, end, baseRate);
      
      Object.entries(historicalData).forEach(([date, rate]) => {
        if (!rates[date]) {
          rates[date] = {};
        }
        rates[date][currency] = rate;
      });
    });

    return {
      success: true,
      rates,
      base,
      start_date: startDate,
      end_date: endDate
    };
  },

  // Get all available rates
  getAllRates: (): CurrencyRate[] => {
    const response = exchangeRatesService.getLatestRates();
    return Object.entries(response.rates).map(([code, rate]) => ({
      code,
      rate,
    }));
  },

  // Get rate for a specific currency
  getRate: (currency: string): number | null => {
    const response = exchangeRatesService.getLatestRates();
    return response.rates[currency] || null;
  },

  // Get all currency pairs with their rates
  getCurrencyPairs: (): { pair: string; rate: number }[] => {
    const response = exchangeRatesService.getLatestRates();
    const pairs: { pair: string; rate: number }[] = [];
    
    Object.entries(response.rates).forEach(([currency, rate]) => {
      if (currency !== 'USD') {
        pairs.push({
          pair: `USD/${currency}`,
          rate,
        });
      }
    });

    return pairs;
  },

  // Calculate exchange rate between any two currencies
  calculateRate: (fromCurrency: string, toCurrency: string): number | null => {
    const rates = exchangeRatesService.getLatestRates().rates;
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) return null;
    return Number((toRate / fromRate).toFixed(4));
  },

  // Format currency amount
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  },
};