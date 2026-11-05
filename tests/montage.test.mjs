import test from 'node:test';
import assert from 'node:assert/strict';
import {transcript,repetitions,plan} from '../scripts/montage.mjs';
const words=s=>s.split(' ').map((text,i)=>({text,start:i*.5+.1,end:i*.5+.4}));
test('detecta frase repetida sin puntuación ni silencio largo',()=>{
 const w=words('hoy vamos a editar hoy vamos a editar este video');
 const r=repetitions(w);assert.ok(r.some(c=>c.wordCount===4&&c.first.start===.1&&c.second.start===2.1));
});
test('no confunde cambios de negación o cifra con frase completa idéntica',()=>{
 assert.equal(repetitions(words('no quiero vender sí quiero vender')).length,0);
 assert.equal(repetitions(words('cuesta 15 euros cuesta 50 euros')).length,0);
});
test('énfasis solo es candidato y no genera cortes',()=>{
 const w=words('muy muy bien');assert.equal(repetitions(w)[0].decision,'pending');
 assert.equal(plan(w,2,[]).words.length,3);
});
test('señala contenido intermedio sin proponer borrarlo',()=>{
 const r=repetitions(words('aprende a editar conserva esta explicación aprende a editar'));
 assert.equal(r[0].interveningText,'conserva esta explicación');assert.equal(r[0].first.end,1.4);
});
test('elimina solo la toma elegida y remapea subtítulos',()=>{
 const w=words('hoy vamos a editar hoy vamos a editar');
 const p=plan(w,4,[{start:0,end:2,reason:'duplicado',evidence:'caso sintético'}]);
 assert.equal(p.words.length,4);assert.ok(Math.abs(p.words[0].start-.1)<1e-8);assert.equal(p.duration,2);assert.equal(p.residualCandidates.length,0);
});
test('rechaza cortes dentro de palabras y sin evidencia',()=>{
 const w=words('hola mundo');
 assert.throws(()=>plan(w,1,[{start:.2,end:.5,reason:'x',evidence:'x'}]),/palabra/);
 assert.throws(()=>plan(w,1,[{start:0,end:.5,reason:'x'}]),/evidence/);
 assert.throws(()=>plan(w,1,[{start:0,end:1,reason:'x',evidence:'x'}]),/todo/);
});
test('une solapes sin descontar dos veces y preserva Unicode',()=>{
 const w=words('sí mañana sí mañana');
 const p=plan(w,2,[{start:0,end:.5,reason:'x',evidence:'x'},{start:0,end:1,reason:'x',evidence:'x'}]);
 assert.equal(p.duration,1);assert.equal(p.words[0].text,'sí');
 assert.throws(()=>transcript([{text:'x',start:1,end:2},{text:'y',start:0,end:1}]),/desordenadas/);
});
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {run} from '../scripts/lib.mjs';
import {render} from '../scripts/montage.mjs';
test('render real conserva audio y duración; no sobrescribe',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'makyd-montage-'));
 const src=path.join(dir,'original.mp4'),out=path.join(dir,'base.mp4');
 run('ffmpeg',['-v','error','-f','lavfi','-i','testsrc2=size=160x240:rate=30:duration=3','-f','lavfi','-i','sine=frequency=440:duration=3','-c:v','libx264','-c:a','aac','-shortest',src]);
 const p=plan(words('uno dos tres cuatro cinco seis'),3,[{start:1,end:2,reason:'prueba',evidence:'medio sintético'}]);
 render(src,out,p);
 const meta=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',out]));
 assert.ok(Math.abs(Number(meta.format.duration)-2)<.1);assert.ok(meta.streams.some(s=>s.codec_type==='audio'));
 assert.throws(()=>render(src,out,p),/nuevo/);assert.throws(()=>render(src,src,p),/nuevo/);
});
