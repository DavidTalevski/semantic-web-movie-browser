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
      const { page, limit, search, sort } = req.query;
      const validSorts = ['year', 'rating', 'votes', 'gross'];
      const sortFieldMap = {
        year: 'm.releasedYear',
        rating: 'm.imdbRating',
        votes: 'm.noOfVotes',
        gross: 'm.gross'
      };

      // Validate sort parameter
      const sortField = validSorts.includes(sort)
        ? sortFieldMap[sort]
        : 'm.releasedYear';

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 24;
      const skip = (pageNum - 1) * limitNum;
      let query = 'MATCH (m:Movie) ';
      const params = { skip, limit: limitNum };

      if (search) {
        query += `
          WHERE toLower(m.title) CONTAINS toLower($search) 
          OR toLower(m.genre) CONTAINS toLower($search) 
          OR toLower(m.overview) CONTAINS toLower($search) 
        `;
        params.search = search;
      }

      query += `
        RETURN properties(m) AS movie
        ORDER BY ${sortField} DESC
        SKIP toInteger($skip)
        LIMIT toInteger($limit)
      `;

      const result = await executeQuery(query, params);

      const movies = result.map(record => {
        const movieProperties = record.get('movie');
        return {
          id: movieProperties.movieId,
          genre: movieProperties.genre,
          imdbRating: movieProperties.imdbRating,
          title: movieProperties.title,
          releasedYear: movieProperties.releasedYear,
          overview: movieProperties.overview,
          gross: movieProperties.gross?.low,
          noOfVotes: movieProperties.noOfVotes?.low,
          certificate: movieProperties.certificate,
          runtime: movieProperties.runtime,
          posterLink: movieProperties.posterLink,
          releasedYear: movieProperties.releasedYear?.low,
          metaScore: movieProperties.metaScore?.low,
        };
      });

      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActors(req, res) {
    try {
      const { page, limit, search } = req.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 24;
      const skip = (pageNum - 1) * limitNum;

      let query = 'MATCH (p:Person) ';
      const params = { skip, limit: limitNum };

      if (search) {
        query += `
          WHERE (
            toLower(p.name) CONTAINS toLower($search) OR
            toLower(p.primaryProfession) CONTAINS toLower($search) OR
            p.birthYear = toInteger($search) OR
            p.deathYear = toInteger($search)
          )
        `;
        params.search = search;
      }

      query += `
        RETURN properties(p) AS actor
        ORDER BY p.name
        SKIP toInteger($skip)
        LIMIT toInteger($limit)
      `;

      const result = await executeQuery(query, params);

      const actors = result.map(record => {
        const actorProperties = record.get('actor');
        return {
          id: actorProperties.personId,
          name: actorProperties.name,
          birthYear: actorProperties.birthYear?.low,
          deathYear: actorProperties.deathYear?.low,
          primaryProfession: actorProperties.primaryProfession
        };
      });

      res.json(actors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // In your Neo4j controller
  async getActorDetails(req, res) {
    try {
      const { id } = req.params;

      const result = await executeQuery(`
      MATCH (a:Person {personId: $id})
      OPTIONAL MATCH (a)-[acted:ACTED_IN]->(actedMovie:Movie)
      OPTIONAL MATCH (a)-[directed:DIRECTED]->(directedMovie:Movie)
      RETURN 
        properties(a) as actor,
        collect(DISTINCT {
          id: actedMovie.movieId,
          title: actedMovie.title,
          posterLink: actedMovie.posterLink,
          releasedYear: actedMovie.releasedYear,
          imdbRating: actedMovie.imdbRating
        }) as actedMovies,
        collect(DISTINCT {
          id: directedMovie.movieId,
          title: directedMovie.title,
          posterLink: directedMovie.posterLink,
          releasedYear: directedMovie.releasedYear,
          imdbRating: directedMovie.imdbRating
        }) as directedMovies
    `, { id });

      if (result.length === 0) {
        return res.status(404).json({ error: 'Actor not found' });
      }

      const data = result[0];
      const actor = data.get('actor');

      res.json({
        id: actor.personId,
        name: actor.name,
        birthYear: actor.birthYear?.low,
        deathYear: actor.deathYear?.low,
        primaryProfession: actor.primaryProfession,
        actedMovies: data.get('actedMovies').filter(m => m.id).map(m => { m.releasedYear = m.releasedYear.low; return m }),
        directedMovies: data.get('directedMovies').filter(m => m.id).map(m => { m.releasedYear = m.releasedYear.low; return m }),
      });
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

  // In Neo4jController.js
  async getMovieDetails(req, res) {
    try {
      const { id } = req.params;

      const result = await executeQuery(`
      MATCH (m:Movie {movieId: $id})
      OPTIONAL MATCH (d:Person)-[:DIRECTED]->(m)
      OPTIONAL MATCH (a:Person)-[r:ACTED_IN]->(m)
      RETURN 
        properties(m) as movie,
        collect(DISTINCT properties(d)) as directors,
        collect(DISTINCT {person: properties(a), role: r.role}) as cast
    `, { id });

      if (result.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const movieData = result[0];
      const movie = this.processMovieProperties(movieData.get('movie'));

      const response = {
        ...movie,
        directors: movieData.get('directors').map(d => ({
          id: d.personId,
          name: d.name
        })),
        cast: movieData.get('cast').map(c => ({
          id: c.person.personId,
          name: c.person.name,
          role: c.role || 'Unknown Role'
        }))
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Helper function
  processMovieProperties(movie) {
    return {
      id: movie.movieId,
      title: movie.title,
      overview: movie.overview,
      genre: movie.genre,
      imdbRating: movie.imdbRating,
      releasedYear: movie.releasedYear?.low || null,
      certificate: movie.certificate,
      runtime: movie.runtime,
      posterLink: movie.posterLink,
      metaScore: movie.metaScore?.low || null,
      noOfVotes: movie.noOfVotes?.low || null,
      gross: movie.gross?.low || null,
      budget: movie.budget?.low || null
    };
  }
}

module.exports = new Neo4jController();