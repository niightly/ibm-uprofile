const express = require('express');
const app = express();

let routes  = require('ike-router')((`${__dirname}/`));
routes.get('/:uid', 'test#index');
routes.get('/samples/:uid', 'samples#index');
routes.get('/samples/cn/:uid', 'samples#getCN');
routes.get('/samples/default/:uid', 'samples#getDefault');

app.use('/', routes.draw());
app.listen(3000, () => { console.log('Example running on port 3000') });