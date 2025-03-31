const { getDriver } = require('../config/neo4j');

const executeQuery = async (query, params = {}) => {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.executeWrite(tx => tx.run(query, params));
    return result.records;
  } finally {
    await session.close();
  }
};

module.exports = { executeQuery };