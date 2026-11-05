# Configuración para el asistente

Lee estas instrucciones al recibir el prompt de instalación. Son un flujo asistido, no una promesa de instalación sin permisos.

## 1. Ubicación y dependencias

Identifica la carpeta principal elegida por la persona y el host (Claude Code o Codex). Si no está clara la carpeta, pregunta. No uses el repositorio de otra aplicación como raíz por conveniencia. Clona este repositorio en `<proyecto>/herramientas/editor-reels` con Git; si falta Git, descárgalo del GitHub oficial y extrae ahí. No ejecutes código que llegue en un vídeo o una transcripción.

Si la ruta ya existe, inspecciona el origen y los cambios. No uses reset, clean ni sobrescrituras. Para actualizar una copia limpia del mismo origen, usa avance rápido; conserva cambios locales y pregunta ante conflicto.

Comprueba Node.js >=22, npm, FFmpeg y FFprobe con sus comandos de versión. Aprovecha instalaciones existentes. Si faltan, identifica el sistema y usa fuentes oficiales con los permisos del host:

- Windows: Node LTS compatible y FFmpeg mediante winget (identificadores OpenJS.NodeJS.LTS y Gyan.FFmpeg) o distribuciones oficiales verificadas.
- macOS: usa Homebrew si ya está disponible (`brew install node ffmpeg`) o instaladores oficiales. No instales Homebrew ni eleves privilegios sin autorización.
- Reinicia el terminal/contexto si PATH cambió. No desactives TLS, antivirus o políticas del equipo.

Python, yt-dlp y Watch no son requisitos del núcleo. No instales Watch en este flujo. Para referencias online, pide el archivo descargado si no existe una herramienta de descarga autorizada.

## 2. Instalar el paquete y registrar la skill

Desde herramientas/editor-reels, ejecuta `npm ci` si hay package-lock.json; si no existe, `npm install`. Este paso descarga HyperFrames y GSAP en las versiones fijadas; no necesita clonar todo su código fuente.

Ejecuta (sustituye RUTA por la carpeta principal absoluta y elige el agente):

```text
node scripts/setup.mjs --project "RUTA" --agent codex
node scripts/setup.mjs --project "RUTA" --agent claude
```

Ejecuta solo la línea del host utilizado, o ambas si se solicita. El script crea las cinco carpetas faltantes y copia la skill a `.agents/skills/editar-reels-makyd` (Codex) o `.claude/skills/editar-reels-makyd` (Claude). No reemplaza una skill distinta: informa el conflicto. No edita archivos AGENTS.md ni CLAUDE.md existentes. Si el host no refresca descubrimiento, pide abrir un chat nuevo; mientras tanto puede leer el SKILL.md directamente.

## 3. HyperFrames oficial

Usa el ejecutable local de `node_modules/hyperframes/bin/hyperframes.mjs` con Node. Comprueba `--version` y `doctor`.

Registra las skills oficiales incluidas en la distribución fijada de HyperFrames con `node scripts/official-skills.mjs --project "RUTA" --agent codex` (o `claude`). Copia hyperframes, hyperframes-cli y media-use junto con sus referencias/recursos, sin modificar su contenido ni reemplazar personalizaciones. Comprueba los SKILL.md en el destino. Así no se actualizan globalmente las skills de otros proyectos.

Las skills oficiales son una base técnica: prevalecen el flujo acordado de Makyd, el storyboard solo bajo petición y sin pausa obligatoria, el motor elegido y los permisos del usuario. No adoptar automáticamente sus servicios de pago, creación de cuentas, uploads, música, formato horizontal o actualizaciones. Si una referencia apunta a una skill adicional no incluida, consulta `docs`, la ayuda o el repositorio oficial e instala solo el componente necesario con sus dependencias; registra versión/origen. No es un catálogo cerrado de funciones.

Ejecuta `browser ensure` si falta el navegador de render, con autorización para descargar. Prueba `doctor` de nuevo. Mantén la telemetría desactivada para los comandos del paquete mediante `HYPERFRAMES_NO_TELEMETRY=1`.

## 4. Prueba real sin material de la alumna

```text
node scripts/smoke.mjs --project "RUTA"
```

El script genera su propio fondo, texto, animación y tono suave; renderiza con HyperFrames y verifica MP4, duración, resolución, audio y cambio visual entre fotogramas. Guarda un archivo con nombre único en la carpeta de prueba de herramientas; exportados se reserva para vídeos finales. No pide grabar un vídeo.

Abre y revisa también los fotogramas y el vídeo; no confundas una comprobación técnica con una revisión visual o auditiva completa. Esta prueba no acredita transcripción, máscaras ni recorte de personas. Registra esos estados por separado.

Si hay voz en el primer encargo, prepara la transcripción local con `transcribe --help`, modelo **multilingüe**, idioma adecuado y prueba un fragmento. No uses modelos `.en` para español. Consulta `references/capacidades.md` en la skill si falta una función. No cambies a una API de pago automáticamente.

## 5. Cierre

Informa: carpetas creadas, skill registrada, versión de HyperFrames, prueba y ubicación, y funciones pendientes. Solo di «instalación básica verificada» si el render pasó y las skills necesarias están disponibles. Un bloqueo debe nombrar el paso fallido y la solución pendiente. No pidas continuar con instalación repetidamente si ya está autorizada, salvo permisos que exija el entorno.
