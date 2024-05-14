
const mongoose = require('mongoose');

const WazirxTickerSchema = new mongoose.Schema({
 base_unit: { type: String, required: true },
  volume: { type: Number, required: true },
  sell: { type: Number, required: true },
 buy: { type: Number, required: true },
  name: { type: String, required: true },
  at: { type: Date, required: true, default: Date.now }, // Timestamp
});

const WazirxTicker = mongoose.model('crypto', WazirxTickerSchema);
module.exports = WazirxTicker;