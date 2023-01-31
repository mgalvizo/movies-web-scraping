const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.route('/search').get(movieController.getSearchMovieForm);

router.route('/results').get(movieController.getMovieResults);

module.exports = router;
