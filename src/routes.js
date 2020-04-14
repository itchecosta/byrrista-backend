const { Router } = require('express');

const BusinessController = require('./controllers/BusinessController');
const SearchController = require('./controllers/SearchController');
const LoginController = require('./controllers/LoginController');

const routes = Router();

routes.post('/login', LoginController.create);

routes.get('/business', BusinessController.index);
routes.post('/business', BusinessController.store);

routes.get('/search', SearchController.index);

routes.delete('/business/delete', BusinessController.delete);

module.exports = routes;
