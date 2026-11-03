"""Build the draft student guide. Development only: requires reportlab."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs'/'guia-instalacion-borrador.pdf'
OUT.parent.mkdir(exist_ok=True)
fontroot=Path(os.environ.get('WINDIR','C:/Windows'))/'Fonts'
if (fontroot/'arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('Body',str(fontroot/'arial.ttf')))
    pdfmetrics.registerFont(TTFont('Bold',str(fontroot/'arialbd.ttf')))
else:
    pdfmetrics.registerFont(pdfmetrics.Font('Body','Helvetica','WinAnsiEncoding'))
    pdfmetrics.registerFont(pdfmetrics.Font('Bold','Helvetica-Bold','WinAnsiEncoding'))

W,H=595.28,841.89
ink=HexColor('#402A38'); muted=HexColor('#715A68'); rose=HexColor('#D94D84'); bg=HexColor('#FBF7F3')
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Tu editor de reels · Guía de instalación · Borrador')
c.setAuthor('Makyd')
style=ParagraphStyle('body',fontName='Body',fontSize=11.3,leading=17,textColor=ink)
small=ParagraphStyle('small',parent=style,fontSize=9,leading=13,textColor=muted)
prompt=ParagraphStyle('prompt',parent=style,fontSize=10.5,leading=16)

def para(text,y,sty=style,x=48,width=W-96):
    p=Paragraph(text,sty);_,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height
def base(n,label):
    c.setFillColor(bg);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(rose);c.rect(48,H-52,26,4,fill=1,stroke=0)
    c.setFont('Bold',10);c.drawString(84,H-52,'MAKYD / EDITOR REELS')
    c.setFillColor(muted);c.setFont('Body',9);c.drawRightString(W-48,H-52,label)
    c.setStrokeColor(HexColor('#E4D8DE'));c.line(48,52,W-48,52)
    c.setFont('Body',8);c.drawString(48,36,'BORRADOR · 03 NOV 2026 · v0.1.0')
    c.drawRightString(W-48,36,f'{n} / 3')
def title(a,b):
    c.setFillColor(ink);c.setFont('Bold',32);c.drawString(48,728,a);c.drawString(48,690,b)
def heading(n,text,y):
    c.setFillColor(rose);c.circle(60,y-9,12,fill=1,stroke=0)
    c.setFillColor(HexColor('#FFFFFF'));c.setFont('Bold',11);c.drawCentredString(60,y-13,str(n))
    c.setFillColor(ink);c.setFont('Bold',14);c.drawString(82,y-14,text)
    return y-31
def box(text,top,height):
    c.setFillColor(HexColor('#F0E6EC'));c.roundRect(48,top-height,W-96,height,12,fill=1,stroke=0)
    return para(text,top-18,prompt,64,W-128)

base(1,'PREPARA TU ESPACIO');title('Tu editor de reels,','paso a paso.')
y=para('Configúralo una vez. Después añade tus vídeos, revisa una propuesta visual y pide los cambios que necesites.',659)
y=heading(1,'Abre tu asistente',y-27)
y=para('Utiliza <b>Claude Code o Codex</b> en el ordenador, con acceso a una carpeta local. Esta guía empieza con tu aplicación instalada y tu cuenta activa.',y)
y=heading(2,'Crea y abre una carpeta',y-26)
y=para('Ponle el nombre que quieras, por ejemplo <b>Mi editor</b>, y ábrela como proyecto en tu aplicación. Dentro puedes crear estas cuatro carpetas:',y)
rows=[('crudos','Tus vídeos, imágenes de apoyo y b-rolls.'),('referencias','Vídeos e imágenes que orientan la edición.'),('branding','Los kits descomprimidos que quieras utilizar.'),('exportados','Los storyboards y vídeos que recibes.')]
y-=18
for name,desc in rows:
    c.setFillColor(ink);c.setFont('Bold',12);c.drawString(62,y,name)
    para(desc,y+4,small,172,350);y-=38
y=para('<b>¿No las creaste?</b> El asistente creará las que falten. También preparará <b>herramientas</b> para los archivos técnicos.',y-5)
y=heading(3,'Ten a mano el enlace',y-25)
y=para('<link href="https://github.com/makydacademy/editor-reels" color="#A72F64">github.com/makydacademy/editor-reels</link>',y)
para('No necesitas descargar un ZIP ni el repositorio completo de HyperFrames por separado. El siguiente mensaje inicia la configuración.',y-14,small)
c.showPage()

base(2,'INSTALA Y COMPRUEBA');title('Un mensaje.','Una prueba real.')
y=para('Con tu carpeta principal abierta, copia este mensaje en el chat:',658)
install='Prepara esta carpeta como mi editor siguiendo https://github.com/makydacademy/editor-reels . Lee INSTALAR.md y configura el paquete en herramientas/editor-reels para la aplicación que uso. Crea las carpetas que falten sin borrar archivos. Comprueba lo que ya tengo e instala lo necesario con los permisos correspondientes. Genera el vídeo de prueba con animación y audio. Confirma qué funciona y qué queda pendiente.'
box(install,615,180)
y=heading(4,'Atiende los permisos y espera',405)
y=para('El asistente revisará tu equipo y preparará HyperFrames y sus herramientas. Puede pedir permiso para instalar o descargar componentes. No necesitas grabar nada para la prueba.',y)
y=heading(5,'Abre el vídeo de prueba',y-28)
y=para('Busca el archivo <b>prueba-editor_v1.mp4</b> (o una versión posterior) en <b>exportados</b>. Debes ver texto y movimiento, y escuchar un tono suave.',y)
y=para('Si no hay vídeo o aparece un error, pega este mensaje:',y-21)
box('Revisa el paso que falló y explícamelo de forma sencilla. Conserva mis archivos y vuelve a comprobar el resultado. No marques la instalación como lista si aún hay un bloqueo.',y-12,75)
para('Esta prueba verifica el render básico. La transcripción de voz y los efectos que necesitan modelos se comprueban cuando se utilizan. El consumo de Claude o Codex depende de tu cuenta.',98,small)
c.showPage()

base(3,'TU PRIMER VÍDEO');title('Primero lo ves.','Después se edita.')
y=para('Añade tu vídeo a <b>crudos</b> y el ejemplo que te inspira a <b>referencias</b>. Si tienes un kit, descomprímelo en su propia subcarpeta dentro de <b>branding</b>. El kit es opcional.',657)
box('Usa la skill editar-reels-makyd. Edita [nombre del vídeo] de crudos tomando como referencia [nombre del ejemplo]. Si corresponde, usa el kit [nombre] de branding. Muéstrame primero el storyboard visual y espera mi aprobación antes de producir el vídeo completo.',575,135)
y=para('<b>1. Revisa la propuesta visual.</b> Verás escenas con imágenes, textos, tiempos aproximados y efectos propuestos. Pide cambios si algo no encaja.',415)
y=para('<b>2. Aprueba el storyboard.</b> Responde «Apruebo este storyboard, adelante» cuando estés conforme. Entonces comienza la edición.',y-17)
y=para('<b>3. Mira el resultado.</b> Lo encontrarás en exportados. Puedes pedir: «baja la música», «mueve el texto de la escena 2» o «quita esa pausa». Las correcciones se guardan como nuevas versiones.',y-17)
y=para('<b>4. Reutiliza lo que te guste.</b> Si quieres, pide: «Guarda el estilo de este vídeo en branding para próximos vídeos».',y-17)
y=para('<b>Si la skill no aparece:</b> abre un chat nuevo en la misma carpeta o pide que lea herramientas/editor-reels/skills/editar-reels-makyd/SKILL.md.',y-24,small)
y=para('<b>Herramientas adicionales:</b> Watch se enseña aparte; no es necesario instalarlo para este flujo básico. Los kits de pago se descargan por separado desde la biblioteca.',y-12,small)
para('Fuentes técnicas: <link href="https://github.com/heygen-com/hyperframes">HyperFrames oficial</link> y <link href="https://ffmpeg.org/">FFmpeg</link>. Guía original preparada para el flujo acordado de Makyd. Consulta el estado de pruebas actualizado en el repositorio antes de distribuirla como versión final.',109,small)
c.save()
print(OUT)
