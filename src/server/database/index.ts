import { PromisedDatabase as Database } from "promised-sqlite3";
import { readFile } from "fs/promises";
import { resolve } from "path";

const DB = new Database();

function databaseError(err: any): never {
  console.error(err);
  process.exit(1);
}

(async function init() {
  
  let openP = DB.open(':memory:');
  let startScriptP = readFile(
    resolve(__dirname, '../../../src/server/database/create.sql'),
    "utf-8"
  );

  await openP;
  let startScript = await startScriptP;

  await DB.run(startScript);

})().catch(databaseError)

let indiceDeRespuesta = 1;

export async function insertRespuesta(nombre: string, asiste: boolean, cantidad: number, ip: string) {
  const sql = "INSERT INTO respuestas (id, nombre, asiste, cantidad, ip) VALUES (?, ?, ?, ?, ?);";

  DB.run(
    sql,
    indiceDeRespuesta++,
    nombre,
    asiste,
    cantidad,
    ip
  );
}

export async function existsIp(ip: string) {
  const sql = "SELECT * FROM respuestas WHERE ip = ?;";

  let ret = await DB.get(sql, ip);

  return (typeof ret != 'undefined');
}

export async function cambiarRegistro(ip: string, nombre: string, asiste: boolean, cantidad: number) {
  const sql = "UPDATE respuestas SET nombre=?, asiste=?, cantidad=? WHERE ip=?;";

  let res = DB.run(sql, nombre, asiste, cantidad, ip)

  console.log("Cambiado ", ip, await res)
}

export { DB };
export default DB;