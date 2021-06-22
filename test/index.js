const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

let routes = require('ike-router')((`${__dirname}/`));

routes.get('/:uid', 'test#index');
routes.get('/:uid/team', 'test#team');
routes.get('/:uid/skills', 'test#skills');
routes.get('/:uid/all', 'test#all');
routes.post('/users', 'test#users');

app.use('/', routes.draw());
app.listen(3000, () => { console.log('Example running on port 3000') });
console.clear()