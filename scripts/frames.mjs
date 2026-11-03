import fs from 'node:fs';
import path from 'node:path';
import {args,rootOf,run,ensureDir,inside} from './lib.mjs';

// Evidence for visual review, not an automatic claim that a video was understood.
try {
  const a=args(); const root=fs.realpathSync(rootOf(a.project));
  if(!a.input || !a.output) throw Error('Usa --project RUTA --input VIDEO --output CARPETA [--every 2].');
  const input=fs.realpathSync(path.resolve(root,a.input));
  const output=path.resolve(root,a.output);
  if(!inside(root,input) || !inside(root,output)) throw Error('Entrada y salida deben estar dentro del proyecto.');
  const rel=path.relative(root,output).split(path.sep);
  if(!['herramientas','exportados'].includes(rel[0])) throw Error('Guarda fotogramas en herramientas o exportados.');
  let probe=root;
  for(const part of rel) {probe=path.join(probe,part);if(fs.existsSync(probe)&&fs.lstatSync(probe).isSymbolicLink()) throw Error('No escribir a través de enlaces.');}
  if(fs.existsSync(output)) throw Error('Elige una carpeta de salida nueva.');
  const every=Number(a.every??2);
  if(!Number.isFinite(every)||every<0.05||every>60) throw Error('--every debe estar entre 0.05 y 60 segundos.');
  const meta=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',input]));
  ensureDir(output);
  run('ffmpeg',['-nostdin','-n','-i',input,'-vf',`fps=1/${every},scale=540:-2`,'-frames:v','120',path.join(output,'frame-%04d.jpg')]);
  fs.writeFileSync(path.join(output,'metadata.json'),JSON.stringify({input:path.relative(root,input),every,limit:120,metadata:meta,note:'Muestreo uniforme. Ampliar alrededor de cortes/movimientos; no mide por sí solo todos los eventos.'},null,2),{flag:'wx'});
  console.log(output);
}catch(e){console.error(e.message);process.exitCode=1;}
