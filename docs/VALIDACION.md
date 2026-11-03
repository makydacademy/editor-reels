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
- El storyboard es una propuesta; aprobación y seguimiento son instrucciones del agente, no una barrera de seguridad impuesta al motor HyperFrames.

No describir estos pendientes como funcionalidades verificadas.
