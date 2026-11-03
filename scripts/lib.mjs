import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function args(argv = process.argv.slice(2)) {
  const out = {};
  for (let i=0;i<argv.length;i++) {
    if (!argv[i].startsWith('--') || !argv[i+1] || argv[i+1].startsWith('--')) throw Error('Argumentos: --opcion valor');
    out[argv[i].slice(2)] = argv[++i];
  }
  return out;
}
export function rootOf(value) {
  if (!value) throw Error('Indica --project con la carpeta principal.');
  const root=path.resolve(value);
  if (root===path.parse(root).root) throw Error('Elige una carpeta de proyecto, no la raíz del disco.');
  return root;
}
export function ensureDir(dir) {
  if (fs.existsSync(dir) && (!fs.lstatSync(dir).isDirectory() || fs.lstatSync(dir).isSymbolicLink())) throw Error(`Ruta en conflicto: ${dir}`);
  fs.mkdirSync(dir,{recursive:true});
}
export function run(command, argv, options={}) {
  const result=spawnSync(command,argv,{encoding:'utf8',timeout:options.timeout??120000,windowsHide:true,
    env:{...process.env,HYPERFRAMES_NO_TELEMETRY:'1'},...options});
  if (result.error || result.status!==0) throw Error(`${command} falló: ${result.error?.message || result.stderr || result.stdout}`);
  return result.stdout || '';
}
export function hf(argv, options={}) {
  const bin=process.env.MAKYD_HYPERFRAMES_BIN || path.join(repo,'node_modules/hyperframes/bin/hyperframes.mjs');
  if(!fs.existsSync(bin)) throw Error('HyperFrames no está instalado. Sigue INSTALAR.md.');
  return run(process.execPath,[bin,...argv],options);
}
export function uniquePath(dir,stem,ext) {
  ensureDir(dir);
  for(let n=1;n<10000;n++) {
    const p=path.join(dir,`${stem}_v${n}${ext}`);
    if(!fs.existsSync(p)) return p;
  }
  throw Error('Demasiadas versiones.');
}
export function writeNew(file,content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file,content,{flag:'wx'});
}
export function inside(root,file) {
  const rel=path.relative(root,file);
  return rel==='' || (!rel.startsWith('..'+path.sep) && rel!=='..' && !path.isAbsolute(rel));
}
