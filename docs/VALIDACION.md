# Estado de validación · 0.1.0

Versión inicial. Esta página distingue pruebas realizadas de compatibilidad prevista.

## Pruebas

- Windows x64, Node 22.23.4, HyperFrames 0.8.190, FFmpeg/FFprobe disponibles.
- Instalación real de dependencias npm y lockfile generado.
- Pruebas automatizadas: creación idempotente, conservación de crudos, rechazo de sobrescritura de skill personalizada, conflicto de nombres y storyboard con imágenes incrustadas y texto escapado.
- Registro local de la skill propia en estructuras de Claude Code y Codex.
- Copia de las tres skills oficiales incluidas en npm (hyperframes, hyperframes-cli, media-use) con 289 archivos por host, dentro de un proyecto de prueba. No se alteraron instalaciones globales.
- Render real de prueba: 3 segundos, 1080x1920, 30 fps, pista de audio no silenciosa, fotogramas diferentes y cero errores/advertencias de lint. Fotogramas revisados visualmente.
- Extracción de fotogramas con FFmpeg sobre el vídeo generado.
- Guía PDF: tres páginas, texto extraíble, enlaces y revisión visual.

`doctor` detectó poca RAM disponible y componentes opcionales ausentes (Docker, TTS, generación musical). No impidieron el render local básico; no se instalaron esos componentes innecesariamente. Se conserva la versión fijada aunque exista una más reciente.

## Límites

- No se ha validado una instalación limpia en todos los modelos de Windows/Mac.
- La ejecución real en Claude Code requiere una prueba de usuario en ese host.
- La prueba sintética no acredita transcripción de voz ni recorte de personas.
- La calidad creativa requiere pruebas con material real y revisión del storyboard.
- El storyboard es una propuesta; su presentación no exige aprobación; el seguimiento son instrucciones del agente, no una barrera de seguridad impuesta al motor HyperFrames.

No describir estos pendientes como funcionalidades verificadas.

## Actualización 2026-11-05

12 pruebas pasan con `npm test`, incluyendo render FFmpeg de vídeo/audio sintético de 3 a 2 segundos, rechazo de sobrescritura, remapeo de palabras, repeticiones dentro de una misma frase, contenido intermedio, negaciones/cifras, Unicode y storyboard sin textos de presentación. La prueba de render requiere FFmpeg/FFprobe en PATH.

El detector genera candidatos exactos, no decisiones semánticas: reformulaciones, repeticiones cortas y omisiones del ASR requieren revisión contextual del agente. El storyboard admite medios animados, pero estas pruebas no certifican su apariencia en todos los navegadores. No se reeditaron los vídeos existentes ni se hizo una nueva prueba editorial con voz real.

## yt-dlp · 2026-11-05

14 pruebas pasan. Se probó además una descarga real del binario oficial Windows x64, verificación SHA256, ejecución --version (2026.10.26) y reutilización sin volver a instalar. macOS/Linux y descarga de una referencia desde una plataforma concreta no se han probado en esta actualización. El setup informa pendiente y devuelve error si yt-dlp no queda disponible. No se instala Watch.
