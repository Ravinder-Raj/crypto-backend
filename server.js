const express = require('express');
const axios = require('axios');
const connectDB = require('./database/Db'); // Import MongoDB connection function
const WazirxTicker = require('./Models/Tickers'); // Import Mongoose schema

const app = express();
const port =  5000; // Set port from environment variable or default to 5000

const cors = require('cors'); // Install cors package: npm install cors

app.use(cors());
// Connect to MongoDB
connectDB();

// Fetch Wazirx ticker data
const fetchTop10Tickers = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const top10Tickers = Object.values(response.data).slice(0, 10); // Get top 10 tickers

    // Save top 10 tickers to MongoDB
    await Promise.all(
      top10Tickers.map(async (ticker) => {
        const existingTicker = await WazirxTicker.findOne({ base_unit: ticker.base_unit });
        if (!existingTicker) {
          const newTicker = new WazirxTicker({
            base_unit: ticker.base_unit,
            quote_unit: ticker.quote_unit,
            low: ticker.low,
            high: ticker.high,
            last: ticker.last,
            open: ticker.open,
            volume: ticker.volume,
            sell: ticker.sell,
            buy: ticker.buy,
            name: ticker.name,
          });
          await newTicker.save(); // Save new ticker data
        }
      })
    );

    console.log('Top 10 Wazirx tickers saved to MongoDB successfully!');
  } catch (err) {
    console.error('Error fetching or saving tickers:', err.message);
  }
};

app.get('/api/tickers', async (req, res) => {
    try {
      const tickers = await WazirxTicker.find(); // Fetch all tickers from MongoDB
      res.json(tickers);
    } catch (err) {
      res.status(500).json({ message: err.message }); // Handle errors
    }
  });

// Run fetch function on server startup or periodically based on your requirements
fetchTop10Tickers(); // Uncomment to fetch on startup
// Consider implementing a cron job or scheduling library for periodic fetching


app.listen(port, () => console.log(`Server listening on port ${port}`));
