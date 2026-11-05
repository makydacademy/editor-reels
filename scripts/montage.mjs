import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args,writeNew,run} from './lib.mjs';

export function transcript(data) {
  const words=Array.isArray(data)?data:data.words;
  if(!Array.isArray(words)||!words.length) throw Error('Se requieren palabras con tiempos, no segmentos.');
  let end=0;
  return words.map(w=>{
    const text=w.text??w.word;
    if(typeof text!=='string'||!text.trim()||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.start<end-0.001||w.end<=w.start) throw Error('Palabras inválidas, superpuestas o desordenadas. Normaliza la transcripción.');
    end=w.end;return {text,start:w.start,end:w.end};
  });
}
const token=s=>s.normalize('NFC').toLocaleLowerCase('es').replace(/[^\p{L}\p{N}]/gu,'');
// Candidates only: exact ordered matches preserve negations, numbers and accents.
export function repetitions(words,{window=90,minWords=3}={}) {
  const t=words.map(w=>token(w.text)), found=[];
  for(let i=0;i<t.length;i++) for(let j=i+1;j<t.length&&words[j].start-words[i].start<=window;j++) {
    if(!t[i]||t[i]!==t[j]) continue;
    if(i>0&&j>0&&t[i-1]===t[j-1]) continue;
    let n=0;while(i+n<j&&j+n<t.length&&t[i+n]&&t[i+n]===t[j+n]) n++;
    if(n<minWords&&!(n===1&&j===i+1)) continue;
    found.push({id:`repeat-${i}-${j}`,kind:n===1?'possible-stutter':'repeated-sequence',wordCount:n,
      first:{start:words[i].start,end:words[i+n-1].end},second:{start:words[j].start,end:words[j+n-1].end},
      firstText:words.slice(i,i+n).map(w=>w.text).join(' '),
      context:words.slice(Math.max(0,i-5),Math.min(words.length,j+n+5)).map(w=>w.text).join(' '),
      interveningText:words.slice(i+n,j).map(w=>w.text).join(' '),decision:'pending'});
  }
  return found;
}
export function plan(words,duration,cuts) {
  if(!Number.isFinite(duration)||duration<=0||words.at(-1).end>duration+0.001||!Array.isArray(cuts)) throw Error('Duración o lista de cortes inválida.');
  const sorted=cuts.map(c=>{
    if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end>duration||c.end<=c.start||!c.reason?.trim()||!c.evidence?.trim()) throw Error('Cada corte necesita rango válido, reason y evidence.');
    if(words.some(w=>(c.start>w.start+0.001&&c.start<w.end-0.001)||(c.end>w.start+0.001&&c.end<w.end-0.001))) throw Error('Un límite corta una palabra.');
    return {...c};
  }).sort((a,b)=>a.start-b.start);
  const merged=[];
  for(const c of sorted){const p=merged.at(-1);if(p&&c.start<=p.end){p.end=Math.max(p.end,c.end);}else merged.push({start:c.start,end:c.end});}
  let cursor=0,dest=0;const keep=[];
  for(const c of [...merged,{start:duration,end:duration}]) {
    if(c.start>cursor){keep.push({start:cursor,end:c.start,outputStart:dest});dest+=c.start-cursor;}
    cursor=c.end;
  }
  if(!keep.length) throw Error('Los cortes eliminan todo el vídeo.');
  const mapped=words.flatMap(w=>{const k=keep.find(k=>w.start>=k.start-0.001&&w.end<=k.end+0.001);return k?[{...w,start:k.outputStart+w.start-k.start,end:k.outputStart+w.end-k.start}]:[];});
  return {duration:dest,cuts:sorted,keep,words:mapped,residualCandidates:repetitions(mapped)};
}
export function render(source,output,edl) {
  if(fs.existsSync(output)||path.resolve(source)===path.resolve(output)) throw Error('El destino debe ser nuevo.');
  if(!edl.keep?.length) throw Error('EDL sin intervalos.');
  const filters=edl.keep.map((k,i)=>`[0:v]trim=start=${k.start}:end=${k.end},setpts=PTS-STARTPTS[v${i}];[0:a]atrim=start=${k.start}:end=${k.end},asetpts=PTS-STARTPTS[a${i}]`);
  filters.push(edl.keep.map((_,i)=>`[v${i}][a${i}]`).join('')+`concat=n=${edl.keep.length}:v=1:a=1[v][a]`);
  run('ffmpeg',['-v','error','-n','-i',source,'-filter_complex',filters.join(';'),'-map','[v]','-map','[a]','-c:v','libx264','-crf','18','-c:a','aac','-b:a','192k',output],{timeout:3600000});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try {
  const a=args(),words=transcript(JSON.parse(fs.readFileSync(a.transcript,'utf8').replace(/^\uFEFF/,'')));
  if(a.mode==='candidates') writeNew(a.output,JSON.stringify({candidates:repetitions(words)},null,2));
  else if(a.mode==='plan') {
   const edl=plan(words,Number(a.duration),JSON.parse(fs.readFileSync(a.cuts,'utf8').replace(/^\uFEFF/,'')).cuts);
   writeNew(a.output,JSON.stringify(edl,null,2));
   if(a.video&&a.render) render(a.video,a.render,edl);
  } else throw Error('--mode candidates o plan');
 }catch(e){console.error(e.message);process.exitCode=1;}
}
