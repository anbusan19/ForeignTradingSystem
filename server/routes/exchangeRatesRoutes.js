const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get latest exchange rates
router.get('/latest', async (req, res) => {
  try {
    const { base = 'USD' } = req.query;
    const response = await axios.get(`https://api.apilayer.com/exchangerates_data/latest?base=${base}`, {
      headers: {
        'apikey': process.env.APILAYER_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch exchange rates',
      error: error.response?.data || error.message 
    });
  }
});

// Get time series data
router.get('/timeseries', async (req, res) => {
  try {
    const { base = 'USD', start_date, end_date, symbols } = req.query;
    const response = await axios.get(
      `https://api.apilayer.com/exchangerates_data/timeseries?base=${base}&start_date=${start_date}&end_date=${end_date}&symbols=${symbols}`,
      {
        headers: {
          'apikey': process.env.APILAYER_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching time series data:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch time series data',
      error: error.response?.data || error.message 
    });
  }
});

module.exports = router; 