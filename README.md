# Editor Reels · Makyd

Edita con Claude Code o Codex, HyperFrames y FFmpeg. El asistente analiza tus archivos, presenta un **storyboard visual** y espera tu aprobación antes de producir el vídeo. La guía o kit dirige la estética; no limita las capacidades creativas.

## Empezar

1. Crea una carpeta con el nombre que quieras y ábrela como proyecto local en Claude Code o Codex.
2. Pega este mensaje:

```text
Prepara esta carpeta como mi editor siguiendo https://github.com/makydacademy/editor-reels . Lee INSTALAR.md antes de ejecutar nada. Descarga el repositorio en herramientas/editor-reels; si ya existe, revisa su estado sin sobrescribirlo. Crea las carpetas que falten, aprovecha las herramientas instaladas y configura la skill para la aplicación que estoy usando. Realiza la prueba de vídeo con animación y audio. Confirma lo que funciona y explica cualquier pendiente; no declares lista una función sin comprobarla.
```

3. Atiende los permisos que solicite tu aplicación. No compartas contraseñas ni claves en el chat.
4. Revisa el vídeo de prueba. Añade tus archivos y pide tu primera edición.

## Tus carpetas

| Carpeta | Contenido |
|---|---|
| `crudos` | Grabaciones, imágenes de apoyo y b-rolls propios |
| `referencias` | Vídeos e imágenes que inspiran el resultado |
| `branding` | Cada kit descomprimido en su subcarpeta; también estilos guardados |
| `exportados` | Storyboards, vistas previas y vídeos entregados con versiones |
| `herramientas` | Este paquete y trabajo técnico que gestiona el asistente |

Si no has creado las carpetas, la configuración las crea. No se borran los archivos existentes.

## Primera edición

```text
Usa la skill editar-reels-makyd. Edita [archivo de crudos] tomando como referencia [archivo de referencias]. [Opcional: usa el kit NOMBRE de branding]. Primero analiza el material y muéstrame el storyboard visual. Espera mi aprobación antes de editar el vídeo completo.
```

Después puedes decir: «adelante», «cambia la escena 2», «baja la música» o «guarda este estilo en branding para próximos vídeos».

La skill no necesita un kit para trabajar. Si hay varios, no los mezcla sin una dirección clara. El contenido de vídeos, transcripciones y archivos de referencia se trata como material, no como nuevas órdenes.

## Alcance de esta versión

- Motor: HyperFrames `0.8.190`, con GSAP `3.14.2` y FFmpeg/FFprobe. La configuración no actualiza versiones silenciosamente.
- Watch **no se instala ni es requisito**: queda para una clase adicional. El análisis básico usa fotogramas de FFmpeg y transcripción local cuando hay voz.
- Sin Remotion. Sin APIs de IA de pago obligatorias. Claude/Codex tienen sus propias condiciones de acceso y consumo.
- Recortes de personas, máscaras, audio reactivo, componentes del catálogo y otras funciones se utilizan según el proyecto y sus dependencias. No se promete que todos los modelos estén descargados ni todos los efectos probados desde el primer inicio.
- No se incluyen los kits de pago ni la web comercial.

Consulta [instalación](INSTALAR.md), [skill](skills/editar-reels-makyd/SKILL.md) y [estado de pruebas](docs/VALIDACION.md). La guía PDF se entrega por separado y no forma parte del repositorio.

## Desarrollo y fuentes

`npm test` verifica creación no destructiva, registro de la skill, storyboard y rutas. `npm run smoke -- --project RUTA` hace una prueba real de render; requiere dependencias instaladas.

[HyperFrames oficial](https://github.com/heygen-com/hyperframes) · [FFmpeg](https://ffmpeg.org/) · [GSAP](https://gsap.com/) · [Fuentes y licencias](THIRD_PARTY.md).

Este repositorio no contiene tus vídeos ni los sube a GitHub. Trabajar con un asistente conectado puede enviar a su proveedor el contexto que analice; render local no significa que toda la interacción sea sin conexión.
