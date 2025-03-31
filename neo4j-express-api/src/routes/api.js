const express = require('express');
const router = express.Router();
const { getNeo4jInfo, getMovies } = require('../controllers/example.controller');

router.get('/info', getNeo4jInfo);
router.get('/movies', getMovies);

module.exports = router;