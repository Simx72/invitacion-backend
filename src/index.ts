console.time('process')
import config from './config';
config();
import router from './router';
import app from './server';

app.use(router);

console.log("modo: ", process.env.NODE_ENV)
console.timeLog('process', 'Cargado!')

app.listen(app.get('port'), () => {
  console.log(`\nServer listening\n  http://localhost:${app.get('port')}/\n\n`)
})