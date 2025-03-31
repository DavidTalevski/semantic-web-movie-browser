const { executeQuery } = require('../services/neo4j.service');

const getNeo4jInfo = async (req, res) => {
  try {
    const result = await executeQuery(
      'MATCH (n) RETURN count(n) AS nodeCount'
    );
    res.json({
      status: 'success',
      data: {
        nodeCount: result[0].get('nodeCount')
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovies = async (req, res) => {
    try {
      const result = await executeQuery(
        'MATCH (m:Movie) RETURN properties(m) AS movie LIMIT 24'
      );
      
      const movies = result.map(record => {
        const movieProperties = record.get('movie');
        return {
          id: movieProperties.movieId,
          genre: movieProperties.genre,
          imdbRating: movieProperties.imdbRating,
          title: movieProperties.title,
          releasedYear: movieProperties.releasedYear,
          overview: movieProperties.overview,
          gross: movieProperties.gross.low,
          noOfVotes: movieProperties.noOfVotes.low,
          certificate: movieProperties.certificate,
          runtime: movieProperties.runtime,
          posterLink: movieProperties.posterLink,
          releasedYear: movieProperties.releasedYear.low,
          metaScore: movieProperties.metaScore.low,
        };
      });
  
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { getNeo4jInfo, getMovies };