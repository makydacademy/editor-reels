import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args,rootOf,repo,ensureDir} from './lib.mjs';

// Install the official skills shipped with the pinned npm distribution.
// Copy all supporting files, keeping upstream content and licenses intact.
export function installOfficial(project,agent){
 const root=rootOf(project);
 if(!['codex','claude','both'].includes(agent))throw Error('Agente inválido.');
 const source=path.join(repo,'node_modules/hyperframes/dist/skills');
 if(!fs.existsSync(source))throw Error('Instala las dependencias con npm ci primero.');
 const names=fs.readdirSync(source).filter(n=>fs.existsSync(path.join(source,n,'SKILL.md')));
 if(!names.includes('hyperframes')||!names.includes('hyperframes-cli'))throw Error('La distribución no contiene las skills básicas esperadas.');
 const plans=[];
 const scan=(dir,base,result=[])=>{
  for(const name of fs.readdirSync(dir)){
   const file=path.join(dir,name);const st=fs.lstatSync(file);
   if(st.isSymbolicLink())throw Error('Enlace inesperado en las skills oficiales.');
   if(st.isDirectory())scan(file,base,result);else result.push(path.relative(base,file));
  }return result;
 };
 for(const host of agent==='both'?['codex','claude']:[agent]){
  const targetBase=path.join(root,host==='codex'?'.agents':'.claude','skills');
  let cursor=root;
  for(const segment of path.relative(root,targetBase).split(path.sep)){cursor=path.join(cursor,segment);ensureDir(cursor);}
  for(const name of names){
   const origin=path.join(source,name),target=path.join(targetBase,name);
   const files=scan(origin,origin);
   for(const file of files){
    const dest=path.join(target,file);
    let current=target;
    for(const segment of ['.',...path.dirname(file).split(path.sep)]){
     current=path.resolve(current,segment);
     if(fs.existsSync(current)&&(!fs.lstatSync(current).isDirectory()||fs.lstatSync(current).isSymbolicLink()))throw Error('Destino no seguro: '+current);
    }
    if(fs.existsSync(dest)&&(!fs.lstatSync(dest).isFile()||!fs.readFileSync(dest).equals(fs.readFileSync(path.join(origin,file)))))throw Error('Skill oficial existente distinta; se conserva: '+dest);
   }
   plans.push({origin,target,files,name,host});
  }
 }
 for(const p of plans)for(const file of p.files){const dest=path.join(p.target,file);ensureDir(path.dirname(dest));if(!fs.existsSync(dest))fs.copyFileSync(path.join(p.origin,file),dest,fs.constants.COPYFILE_EXCL);}
 return plans.map(p=>({host:p.host,name:p.name,path:p.target,files:p.files.length}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{const a=args();console.log(JSON.stringify(installOfficial(a.project,a.agent),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
