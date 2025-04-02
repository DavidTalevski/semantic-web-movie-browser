const { executeQuery } = require('../services/neo4j.service');

class Neo4jController {
  async getNeo4jInfo(req, res) {
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
  }

  async getMovies(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24;
        const skip = (page - 1) * limit;

        const result = await executeQuery(
          `MATCH (m:Movie) RETURN properties(m) AS movie SKIP toInteger($skip) LIMIT toInteger($limit)`,
          { skip: parseInt(skip, 10), limit: parseInt(limit, 10) }
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
  }

  async getActors(req, res) {
    try {

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 24;
      const skip = (page - 1) * limit;
  
      const result = await executeQuery(
        `MATCH (p:Person) WHERE p.primaryProfession = "actor" RETURN properties(p) AS actor SKIP toInteger($skip) LIMIT toInteger($limit)`,
         { skip: parseInt(skip, 10), limit: parseInt(limit, 10) }
      );


      const actors = result.map(record => {
        const actorProperties = record.get('actor');
        return {
          id: actorProperties.personId,
          name: actorProperties.name,
          birthYear: actorProperties.birthYear?.low,
          deathYear: parseInt(actorProperties.deathYear),
          primaryProfession: actorProperties.primaryProfession,
        };
      });

      res.json(actors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActorById(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery(
        'MATCH (p:Person {personId: $id}) RETURN properties(p) AS actor',
        { id }
      );

      if (result.length === 0) {
        return res.status(404).json({ error: 'Actor not found' });
      }

      const actorProperties = result[0].get('actor');
      res.json({
        id: actorProperties.personId,
        name: actorProperties.name,
        birthYear: actorProperties.birthYear?.low,
        deathYear: parseInt(actorProperties.deathYear).low,
        primaryProfession: actorProperties.primaryProfession,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActorMovies(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery(
        `MATCH (:Person {personId: $id})-[:ACTED_IN]->(m:Movie)
         RETURN properties(m) AS movie`,
        { id }
      );

      const movies = result.map(record => {
        const movieProperties = record.get('movie');
        return {
          id: movieProperties.movieId,
          title: movieProperties.title,
          genre: movieProperties.genre,
          imdbRating: movieProperties.imdbRating,
          releasedYear: movieProperties.releasedYear?.low || null,
          overview: movieProperties.overview,
          posterLink: movieProperties.posterLink,
        };
      });

      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDirectors(req, res) {
    try {
      const result = await executeQuery(
        'MATCH (p:Person) WHERE p.primaryProfession = "director" RETURN properties(p) AS director LIMIT 24'
      );

      const directors = result.map(record => {
        const directorProperties = record.get('director');
        return {
          id: directorProperties.personId,
          name: directorProperties.name,
          birthYear: directorProperties.birthYear?.low,
          deathYear: parseInt(directorProperties.deathYear),
          primaryProfession: directorProperties.primaryProfession,
        };
      });

      res.json(directors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDirectorMovies(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery(
        `MATCH (:Person {personId: $id})-[:DIRECTED]->(m:Movie)
         RETURN properties(m) AS movie`,
        { id }
      );

      const movies = result.map(record => {
        const movieProperties = record.get('movie');
        return {
          id: movieProperties.movieId,
          title: movieProperties.title,
          genre: movieProperties.genre,
          imdbRating: movieProperties.imdbRating,
          releasedYear: movieProperties.releasedYear?.low || null,
          overview: movieProperties.overview,
          posterLink: movieProperties.posterLink,
        };
      });

      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new Neo4jController();