const express = require('express');
const router = express.Router();
const neo4jController = require('../controllers/Neo4jController');

router.get('/neo4j-info', (req, res) => neo4jController.getNeo4jInfo(req, res));
router.get('/movies', (req, res) => neo4jController.getMovies(req, res));
router.get('/movies/:id', (req, res) => neo4jController.getMovieDetails(req, res));
router.get('/actors', (req, res) => neo4jController.getActors(req, res));
router.get('/actors/:id', (req, res) => neo4jController.getActorDetails(req, res));
router.get('/actors/:id/movies', (req, res) => neo4jController.getActorMovies(req, res));
router.get('/directors', (req, res) => neo4jController.getDirectors(req, res));
router.get('/directors/:id/movies', (req, res) => neo4jController.getDirectorMovies(req, res));

module.exports = router;