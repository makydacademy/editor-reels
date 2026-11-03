import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args,rootOf,inside,uniquePath,writeNew} from './lib.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color=(x,f)=>/^#[0-9a-f]{6}$/i.test(x??'')?x:f;
export function buildStoryboard(project,input) {
  const root=fs.realpathSync(rootOf(project));
  const jsonPath=fs.realpathSync(path.resolve(root,input));
  if(!inside(root,jsonPath)) throw Error('JSON fuera del proyecto.');
  const data=JSON.parse(fs.readFileSync(jsonPath,'utf8'));
  if(!Array.isArray(data.scenes)||!data.scenes.length) throw Error('Incluye scenes con al menos una escena.');
  const cards=data.scenes.map((s,i)=>{
    if(!s.image) throw Error(`Escena ${i+1}: falta imagen real o mockup rotulado.`);
    const file=fs.realpathSync(path.resolve(path.dirname(jsonPath),s.image));
    if(!inside(root,file)) throw Error('Imagen fuera del proyecto.');
    const ext=path.extname(file).toLowerCase();
    const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[ext];
    if(!mime) throw Error('Usa PNG, JPG o WebP para la imagen.');
    const position=['top','center','bottom'].includes(s.position)?s.position:'bottom';
    const font=/^[a-zA-Z0-9 ,_-]{1,100}$/.test(s.font??'')?s.font:'Arial';
    return `<article><div class="phone" style="background:${color(s.background,'#402039')}"><img alt="Escena ${i+1}" src="data:${mime};base64,${fs.readFileSync(file).toString('base64')}"><div class="overlay ${position}" style="color:${color(s.color,'#FFFFFF')};font-family:${esc(font)}">${esc(s.text)}</div></div><h2>${i+1}. ${esc(s.time)}</h2><p>${esc(s.action)}</p><p><b>Movimiento:</b> ${esc(s.motion)}</p><p><b>Audio:</b> ${esc(s.audio)}</p><small>${esc(s.source)}</small></article>`;
  }).join('');
  return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(data.title)}</title><style>*{box-sizing:border-box}body{margin:0;background:#faf6f1;color:#30202a;font:16px/1.5 Arial,sans-serif}header,main,footer{max-width:1200px;margin:auto;padding:30px}header small{letter-spacing:2px}h1{font-size:36px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}article{background:white;border:1px solid #dfd4db;border-radius:18px;padding:18px}h2{font-size:20px}.phone{position:relative;aspect-ratio:9/16;overflow:hidden;border-radius:10px}.phone img{width:100%;height:100%;object-fit:contain}.overlay{position:absolute;left:7%;right:7%;padding:10px;background:#0009;text-align:center;font-weight:bold;font-size:24px;overflow-wrap:anywhere}.top{top:14%}.center{top:42%}.bottom{bottom:20%}small{color:#6c5362}footer{border-top:1px solid #dfd4db}@media print{article{break-inside:avoid}main{grid-template-columns:repeat(2,1fr)}}</style><header><small>MAKYD · PROPUESTA PARA REVISIÓN</small><h1>${esc(data.title)}</h1><p>${esc(data.direction)}</p><p>Storyboard aproximado. El vídeo completo se produce después de tu aprobación.</p></header><main>${cards}</main><footer>Responde en el chat: «Apruebo este storyboard» o indica qué cambiar. Abrir este archivo no constituye aprobación.</footer></html>`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{const a=args();const root=rootOf(a.project);const html=buildStoryboard(root,a.input);const out=uniquePath(path.join(root,'exportados'),'storyboard','.html');writeNew(out,html);console.log(out);}catch(e){console.error(e.message);process.exitCode=1;}
}
