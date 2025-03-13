// Using the free Exchange Rates API (https://exchangerate.host)
const BASE_URL = 'https://api.exchangerate.host';

export async function getExchangeRate(base: string, quote: string): Promise<number> {
  const response = await fetch(
    `${BASE_URL}/convert?from=${base}&to=${quote}`
  );
  const data = await response.json();
  return data.result;
}

export async function getLatestRates(base: string): Promise<Record<string, number>> {
  const response = await fetch(`${BASE_URL}/latest?base=${base}`);
  const data = await response.json();
  return data.rates;
}