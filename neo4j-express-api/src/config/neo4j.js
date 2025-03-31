const neo4j = require('neo4j-driver');
require('dotenv').config();

let driver;

const connectNeo4j = async () => {
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
    
    const serverInfo = await driver.getServerInfo();
    console.log('Neo4j Connection Established:', serverInfo);
    return driver;
  } catch (error) {
    console.error('Neo4j Connection Error:', error);
    process.exit(1);
  }
};

const getDriver = () => driver;
const closeNeo4j = () => driver?.close();

module.exports = { connectNeo4j, getDriver, closeNeo4j: closeNeo4j };