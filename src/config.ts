import { resolve } from "path";
import dotenv from 'dotenv';

export let loaded = false;

export let error: Error | undefined = void 0;

export default function config() {
  console.log('Configurando...')

  
  let output = dotenv.config({
    encoding: 'utf-8',
    path: resolve(__dirname, '../src/.env.development')
  });

  output = dotenv.config({
    encoding: 'utf-8',
    path: resolve(__dirname, '../src/.env')
  });

  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  if (output.error)
    error = output.error
  else if (output.parsed)
    loaded = true;
}