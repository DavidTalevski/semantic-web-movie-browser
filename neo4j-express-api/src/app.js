const express = require('express');
const { connectNeo4j } = require('./config/neo4j');
const apiRouter = require('./routes/api');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/', (req, res) => res.send('Neo4j API Server is running'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  await connectNeo4j();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

module.exports = { app, startServer };