import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args,rootOf,inside,uniquePath,writeNew} from './lib.mjs';
export function buildStoryboard(project,input) {
 const root=fs.realpathSync(rootOf(project)), jsonPath=fs.realpathSync(path.resolve(root,input));
 if(!inside(root,jsonPath)) throw Error('JSON fuera del proyecto.');
 const data=JSON.parse(fs.readFileSync(jsonPath,'utf8').replace(/^\uFEFF/,''));
 if(!Array.isArray(data.scenes)||!data.scenes.length) throw Error('Incluye scenes.');
 const scenes=data.scenes.map((s,i)=>{
  if(!s.image&&!s.video) throw Error(`Escena ${i+1}: falta mockup o muestra animada.`);
  const file=fs.realpathSync(path.resolve(path.dirname(jsonPath),s.video||s.image));
  if(!inside(root,file)) throw Error('Medio fuera del proyecto.');
  const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.webm':'video/webm'}[path.extname(file).toLowerCase()];
  if(!mime||(s.video?!mime.startsWith('video/'):!mime.startsWith('image/'))) throw Error('Formato de medio inválido.');
  const src=`data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  return s.video?`<video controls loop playsinline preload="metadata" src="${src}"></video>`:`<img alt="Escena ${i+1}" src="${src}">`;
 }).join('');
 return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Storyboard</title><style>*{box-sizing:border-box}body{margin:0;background:#171717}main{max-width:1200px;margin:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}img,video{display:block;width:100%;height:auto;max-height:85vh;object-fit:contain}</style><main>${scenes}</main></html>`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{const a=args(),root=rootOf(a.project),out=uniquePath(path.join(root,'exportados'),'storyboard','.html');writeNew(out,buildStoryboard(root,a.input));console.log(out);}catch(e){console.error(e.message);process.exitCode=1;}
}
