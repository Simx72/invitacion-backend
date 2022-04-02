import { Request, Response, Router } from "express";
import DB, { insertRespuesta, existsIp, cambiarRegistro } from "./server/database";

console.log('Creando enrutador...');

interface Sender<Params extends Array<any> = [], R = void> {
  (req: Request, res: Response, ...params: Params): R;
}


let sendLogin: Sender = (req, res) => {
  res.render('login.pug', { next_url: req.url });
}

let sendForbidden: Sender = (req, res) => {
  res.status(403).render('forbidden.pug');
}

let sendSite: Sender<[], Promise<void>> = async (req, res) => {
  let respuestas = await DB.all("SELECT * FROM respuestas;");
  res.render('portal.pug', { 
    respuestas,
    losquesi: respuestas.filter(v => v.asiste == 1),
    losqueno: respuestas.filter(v => v.asiste == 0)
  });
}

let sendError: Sender<[any]> = (req, res, error) => {
  console.error(error);
  res.status(500).render('error.pug');
}



declare module 'express-session' {
  interface SessionData {
    username: string;
    password: string;
  }
}

function authIsCorrect(auth: { username?: any, password?: any }) {
  const { username, password } = auth;
  const { USERNAME, PASSWORD } = process.env;
  return (username === USERNAME && password === PASSWORD);
}



const router = Router();

router.get('/', async (req, res) => {
  try {
    console.log(req.session.id)
    if (authIsCorrect(req.session))
      await sendSite(req, res);
    else
      sendLogin(req, res);
  } catch (e: any) {
    sendError(req, res, e);
  }
});

router.post('/session', (req, res) => {
  console.log(req.body);
  if (authIsCorrect(req.body)) {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    res.redirect(302, req.body.next_url || '/');
  } else
    res.redirect(302, '/forbidden')
});

router.get('/forbidden', sendForbidden);

router.all('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
  });
  res.redirect('/');
});

let existen = (val: { [c: string]: any }): boolean => {
  for (const key in val)
    if (Object.prototype.hasOwnProperty.call(val, key))
      if (typeof val[key] == 'undefined')
        return false;
  return true;
}

function getIP(req: Request) {
  let ip = (<string>req.headers['x-forwarded-for']) || req.socket.remoteAddress || req.ip;
  return ip;
}

router.post('/nuevo-invitado', async (req, res) => {
  try {
    let ip = getIP(req);
    const { nombre, asiste, cantidad } = req.body;
    console.dir(req.body)
    if (existen({ nombre, asiste, cantidad })) {
      let exists = await existsIp(ip);
      if (exists) {
        cambiarRegistro(ip, nombre, asiste == 1, cantidad);
        res.status(200).send({ msg: "La asistencia fue modificada con exito"});
      } else {
        insertRespuesta(nombre, asiste == 1, cantidad, ip);
        res.status(200).send({ msg: "La asistencia fue añadida con exito"});
      }
    } else {
      res.status(403).send({ err: "El registro no pudo ser añadido" });
    }
  } catch (e: any) {
    sendError(req, res, e);
  }
})

router.get('/check', async (req, res) => {
  let ip = getIP(req);
  let exists = await existsIp(ip);
  res.send(exists);
})

export { router };
export default router;