import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {prepare} from '../scripts/setup.mjs';
import {buildStoryboard} from '../scripts/storyboard.mjs';

test('prepara ambos hosts, conserva originales y permite repetir instalación',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'makyd-test-'));
 fs.mkdirSync(path.join(root,'crudos'));fs.writeFileSync(path.join(root,'crudos','original.txt'),'intacto');
 prepare(root,'both');prepare(root,'both');
 assert.equal(fs.readFileSync(path.join(root,'crudos','original.txt'),'utf8'),'intacto');
 assert.ok(fs.existsSync(path.join(root,'.agents/skills/editar-reels-makyd/SKILL.md')));
 assert.ok(fs.existsSync(path.join(root,'.claude/skills/editar-reels-makyd/SKILL.md')));
 const skill=path.join(root,'.agents/skills/editar-reels-makyd/SKILL.md');fs.writeFileSync(skill,'personalización');
 assert.throws(()=>prepare(root,'codex'),/se conserva/);
 assert.equal(fs.readFileSync(skill,'utf8'),'personalización');
});
test('un archivo ocupando una carpeta no se reemplaza',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'makyd-test-'));
 fs.writeFileSync(path.join(root,'branding'),'original');
 assert.throws(()=>prepare(root,'codex'),/conflicto/);
 assert.equal(fs.readFileSync(path.join(root,'branding'),'utf8'),'original');
});
test('storyboard incrusta imagen, escapa texto y rechaza referencias externas',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'makyd-test-'));
 fs.writeFileSync(path.join(root,'frame.png'),Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64'));
 const plan={title:'<script>alert(1)</script>',scenes:[{image:'frame.png',text:'Hola',time:'0-3s'}]};
 fs.writeFileSync(path.join(root,'plan.json'),JSON.stringify(plan));
 const html=buildStoryboard(root,'plan.json');assert.ok(html.includes('data:image/png;base64,'));assert.ok(!html.includes('<script>'));
 plan.scenes[0].image='../fuera.png';fs.writeFileSync(path.join(root,'plan.json'),JSON.stringify(plan));
 assert.throws(()=>buildStoryboard(root,'plan.json'));
});
