import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { exchangeRatesService, TimeSeriesData } from '../services/exchangeRatesService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function CurrencyChart() {
  const { currency } = useParams<{ currency: string }>();
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSeries = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const data = await exchangeRatesService.getTimeSeries(
          startDate,
          endDate,
          'USD',
          [currency || 'EUR']
        );
        setTimeSeriesData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch time series data');
      } finally {
        setLoading(false);
      }
    };

    if (currency) {
      fetchTimeSeries();
    }
  }, [currency]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!timeSeriesData) return null;

  const dates = Object.keys(timeSeriesData.rates);
  const values = dates.map(date => timeSeriesData.rates[date][currency || 'EUR']);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: `USD/${currency}`,
        data: values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `USD/${currency} Exchange Rate (Last 30 Days)`
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Currency Chart: USD/{currency}</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}