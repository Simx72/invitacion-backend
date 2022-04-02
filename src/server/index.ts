import express from 'express';
import { useSession } from './session';
import { resolve } from "path";
import cors from "cors";

console.log('Iniciando aplicación...');
const app = express()
app.set('port', process.env.PORT ?? 3000);
app.set('views', resolve(__dirname, '../../src/views'));
app.set('view engine', 'pug');

// middlewares
console.log('Creando middlewares...')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
useSession(app);
app.use(express.static(resolve(__dirname, '../../src/static')));

export { app };
export default app;