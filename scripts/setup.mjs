import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args,rootOf,ensureDir,repo,run,hf,uniquePath,writeNew} from './lib.mjs';

export function prepare(project,agent) {
  const root=rootOf(project);
  if(!['codex','claude','both'].includes(agent)) throw Error('--agent debe ser codex, claude o both.');
  ensureDir(root);
  for(const name of ['crudos','referencias','branding','exportados','herramientas']) ensureDir(path.join(root,name));
  const source=path.join(repo,'skills/editar-reels-makyd');
  const files=[];
  function scan(dir) {
    for(const name of fs.readdirSync(dir)) {
      const p=path.join(dir,name); const st=fs.lstatSync(p);
      if(st.isSymbolicLink()) throw Error('No se admiten enlaces dentro de la skill.');
      if(st.isDirectory()) scan(p); else files.push(path.relative(source,p));
    }
  }
  scan(source);
  const targets=(agent==='both'?['codex','claude']:[agent]).map(a=>path.join(root,a==='codex'?'.agents':'.claude','skills','editar-reels-makyd'));
  // Preflight every destination before copying: do not replace a customized installation.
  for(const dest of targets) {
    let current=root;
    for(const part of path.relative(root,dest).split(path.sep)) {
      current=path.join(current,part);
      if(fs.existsSync(current) && (fs.lstatSync(current).isSymbolicLink() || !fs.statSync(current).isDirectory())) throw Error(`Destino en conflicto: ${current}`);
    }
    for(const file of files) {
      const target=path.join(dest,file);
      if(fs.existsSync(target) && (!fs.lstatSync(target).isFile() || !fs.readFileSync(target).equals(fs.readFileSync(path.join(source,file))))) throw Error(`Skill existente distinta; se conserva: ${target}`);
    }
  }
  for(const dest of targets) for(const file of files) {
    const target=path.join(dest,file);
    ensureDir(path.dirname(target));
    if(!fs.existsSync(target)) fs.copyFileSync(path.join(source,file),target,fs.constants.COPYFILE_EXCL);
  }
  return {root,targets};
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const a=args(); const state=prepare(a.project,a.agent);
    const checks={node:process.version};
    for(const tool of ['ffmpeg','ffprobe']) {
      try {checks[tool]=run(tool,['-version']).split('\n')[0];} catch {checks[tool]='PENDIENTE';}
    }
    try {checks.hyperframes=hf(['--version']).trim();} catch {checks.hyperframes='PENDIENTE';}
    const report={...state,checks,render:'PENDIENTE: ejecutar smoke.mjs',officialSkills:'PENDIENTE: comprobar en el host',transcription:'PENDIENTE: probar con voz',createdAt:new Date().toISOString()};
    const target=uniquePath(path.join(state.root,'herramientas'),'estado-instalacion','.json');
    writeNew(target,JSON.stringify(report,null,2));
    console.log(JSON.stringify({...report,report:target},null,2));
  } catch(e) {console.error(e.message);process.exitCode=1;}
}
