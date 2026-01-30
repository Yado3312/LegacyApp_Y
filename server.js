import dotenv from 'dotenv';
dotenv.config(); // 👈 SIEMPRE PRIMERO

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 7369;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('PORT desde env:', process.env.PORT);
});
