import fs from 'node:fs';
import path from 'node:path';
import {args,rootOf,ensureDir,repo,run,hf,uniquePath,writeNew} from './lib.mjs';

try {
  const a=args(); const root=rootOf(a.project);
  for(const n of ['crudos','referencias','branding','exportados','herramientas']) ensureDir(path.join(root,n));
  const work=fs.mkdtempSync(path.join(root,'herramientas','prueba-'));
  const gsap=process.env.MAKYD_GSAP_FILE || path.join(repo,'node_modules/gsap/dist/gsap.min.js');
  if(!fs.existsSync(gsap)) throw Error('Falta GSAP. Sigue INSTALAR.md.');
  fs.copyFileSync(gsap,path.join(work,'gsap.min.js'));
  run('ffmpeg',['-nostdin','-n','-f','lavfi','-i','sine=frequency=440:duration=3','-af','volume=0.2,afade=t=in:d=0.2,afade=t=out:st=2.5:d=0.5',path.join(work,'tono.wav')]);
  writeNew(path.join(work,'DESIGN.md'),'# Prueba de instalación\nPaleta crema #FAF6F1, vino #472638, rosa #ED6C9B. Tipografía Arial del sistema. Entrada suave y desplazamiento horizontal. No es un kit comercial.\n');
  writeNew(path.join(work,'index.html'),`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#FAF6F1}#main{position:relative;width:1080px;height:1920px;font-family:Arial,sans-serif;color:#472638}.content{width:100%;height:100%;padding:200px 90px;display:flex;flex-direction:column;justify-content:center;gap:45px;box-sizing:border-box}h1{font-size:100px;line-height:1.05;margin:0}p{font-size:40px;margin:0}.circle{width:160px;height:160px;border-radius:50%;background:#ED6C9B}.tag{font-size:28px;letter-spacing:8px}</style></head><body><div id="main" data-composition-id="main" data-start="0" data-duration="3" data-width="1080" data-height="1920"><div class="content"><span class="tag">MAKYD · PRUEBA</span><h1>Tu editor<br>cobra vida.</h1><div class="circle"></div><p>Imagen + animación + audio</p></div><audio id="tone" src="tono.wav" data-start="0" data-duration="3" data-track-index="1" data-volume="1"></audio></div><script src="gsap.min.js"></script><script>window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});tl.from('h1',{opacity:0,y:65,duration:.7},0);tl.to('.circle',{x:580,duration:2.5,ease:'power1.inOut'},.25);window.__timelines.main=tl;</script></body></html>`);
  console.log('Verificando composición…');
  console.log(hf(['lint',work],{timeout:120000}));
  const output=uniquePath(work,'prueba-editor','.mp4');
  console.log('Renderizando prueba de 3 segundos…');
  console.log(hf(['render',work,'--output',output,'--fps','30','--quality','draft','--workers','1'],{timeout:600000}));
  const metadata=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',output]));
  const v=metadata.streams.find(s=>s.codec_type==='video');const audio=metadata.streams.find(s=>s.codec_type==='audio');
  const duration=Number(metadata.format.duration);
  if(!v||v.width!==1080||v.height!==1920||!audio||duration<2.8||duration>3.3) throw Error('La prueba no cumple dimensiones, audio o duración.');
  const samples=[];
  for(const [name,t] of [['inicio','0.2'],['final','2.5']]) {
    const frame=path.join(work,`${name}.png`);
    run('ffmpeg',['-nostdin','-n','-ss',t,'-i',output,'-frames:v','1',frame]);
    samples.push(fs.readFileSync(frame));
  }
  if(samples[0].equals(samples[1])) throw Error('No se detectó cambio visual.');
  // Validate non-silent audio; decode failure is also a failure.
  // ffmpeg statistics go to stderr; separately obtain raw PCM to measure samples.
  const pcm=run('ffmpeg',['-nostdin','-v','error','-i',output,'-vn','-ac','1','-ar','8000','-f','s16le','pipe:1'],{encoding:null,maxBuffer:1000000});
  let peak=0;for(let i=0;i+1<pcm.length;i+=2)peak=Math.max(peak,Math.abs(pcm.readInt16LE(i)));
  if(peak===0)throw Error('Audio silencioso.');
  const report={status:'render_basico_verificado',hyperframes:hf(['--version']).trim(),output,duration,width:v.width,height:v.height,audioPeak:peak,framesDifferent:true,frames:[path.join(work,'inicio.png'),path.join(work,'final.png')],pending:['Revisión humana de vídeo y audio','Transcripción con voz','Recortes/modelos opcionales','Registro de skills oficiales: comprobar en el host'],timestamp:new Date().toISOString()};
  writeNew(path.join(work,'resultado.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} catch(e){console.error(e.message);process.exitCode=1;}
