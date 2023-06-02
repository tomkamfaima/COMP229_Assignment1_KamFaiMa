var express = require('express');
var router = express.Router();

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET About Me page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});
/* GET Project page. */
router.get('/project', function(req, res, next) {
  res.render('project', { title: 'Project' });
});
/* GET Service page. */
router.get('/service', function(req, res, next) {
  res.render('service', { title: 'Service' });
});
/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });

});

module.exports = router;
