import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ensureDir,run} from './lib.mjs';

export function assetFor(platform=process.platform,arch=process.arch){
 const assets={win32:{x64:'yt-dlp.exe',arm64:'yt-dlp_arm64.exe',ia32:'yt-dlp_x86.exe'},darwin:{x64:'yt-dlp_macos',arm64:'yt-dlp_macos'},linux:{x64:'yt-dlp_linux',arm64:'yt-dlp_linux_aarch64'}};
 const asset=assets[platform]?.[arch];if(!asset)throw Error('Instala yt-dlp siguiendo su documentación oficial para este sistema.');return asset;
}
export function verify(bytes,sums,name){
 const line=sums.split(/\r?\n/).find(l=>l.trim().split(/\s+/).at(-1)?.replace(/^\*/,'')===name);
 const expected=line?.trim().split(/\s+/)[0];
 if(!expected||createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('SHA256 de yt-dlp no coincide. No se ejecutará.');
}
export function findYtdlp(root){
 const local=path.join(root,'herramientas','bin',process.platform==='win32'?'yt-dlp.exe':'yt-dlp');
 for(const command of [local,'yt-dlp'])try{return {command,version:run(command,['--ignore-config','--version']).trim()};}catch{}
 return null;
}
export async function ensureYtdlp(root){
 const existing=findYtdlp(root);if(existing)return {...existing,installed:false};
 const asset=assetFor();
 const get=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error(`Descarga yt-dlp: HTTP ${r.status}`);return r;};
 // Resolve latest once; binary and checksum always come from the same release.
 const release=await get('https://github.com/yt-dlp/yt-dlp/releases/latest');
 const tag=new URL(release.url).pathname.split('/').at(-1);
 if(!/^[\w.-]+$/.test(tag)||tag==='latest')throw Error('No se pudo resolver la versión de yt-dlp.');
 const base=`https://github.com/yt-dlp/yt-dlp/releases/download/${tag}/`;
 const bytes=Buffer.from(await (await get(base+asset)).arrayBuffer());
 verify(bytes,await (await get(base+'SHA2-256SUMS')).text(),asset);
 const dir=path.join(root,'herramientas','bin');ensureDir(dir);
 const command=path.join(dir,process.platform==='win32'?'yt-dlp.exe':'yt-dlp');
 fs.writeFileSync(command,bytes,{flag:'wx',mode:0o755});
 return {command,version:run(command,['--ignore-config','--version']).trim(),installed:true,source:base+asset};
}
