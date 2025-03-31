const { startServer } = require('./src/app');

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  const { closeNeo4j } = require('./src/config/neo4j');
  await closeNeo4j();
  process.exit(0);
});