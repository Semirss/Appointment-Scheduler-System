import express from 'express';
import dotenv from 'dotenv';
import mySqlConnection from './Config/db.js';
import router from './Routes/route.js';
import bcrypt from 'bcrypt';
// import adminRouter from './routes/adminRoute.js';
// import cookieParser from 'cookie-parser';
import cors from 'cors'; 
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://company1.localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// CORS configuration
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main application routes
app.use('/api', router);

// Admin routes - mounted under /api/admin
// app.use('/api/admin', adminRouter);

// Error handling middleware (add this after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Server startup
app.listen(port, async () => {
  try {
    await mySqlConnection.query('SELECT 1');
    console.log(`Server is running on port ${port} and DB is connected`);

    const plainPassword = '123';
    const saltRounds = 10;

    bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
        if (err) throw err;
        console.log('Hashed password:', hash);
    });
  } catch (error) {
    console.error('DB connection failed:', error.message);
  }
});