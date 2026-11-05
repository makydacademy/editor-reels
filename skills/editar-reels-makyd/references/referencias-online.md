# Referencias por enlace

El setup instala yt-dlp o aprovecha el disponible; su informe guarda `checks.ytdlp.command` y versión. También puedes resolverlo con `findYtdlp(root)` de scripts/ytdlp.mjs. No lo confundas con Watch: descargar no equivale a analizar.

Para un enlace HTTP(S) de vídeo aportado por la persona, usa el ejecutable resuelto con argumentos separados (sin construir comandos de shell a partir del enlace):

```text
<RUTA_YT_DLP> --ignore-config --no-playlist --no-overwrites --restrict-filenames --js-runtimes node -P <RAIZ/referencias> -o "%(title).100B [%(id)s].%(ext)s" -- <URL>
```

Permite que FFmpeg fusione audio/vídeo; no fuerces MP4 si el material necesita otro contenedor. No descargues toda una playlist por un enlace de vídeo. Comprueba el archivo resultante con FFprobe y analiza fotogramas, secuencias y audio según el encargo. Conserva la procedencia en herramientas/trabajo, sin credenciales. Una referencia orienta el estilo; no concede permiso para reutilizar su música o imágenes en el resultado.

Si hay error, revisa una vez su causa y aplica una solución concreta (por ejemplo runtime o versión desactualizada) antes de reintentar. No encadenes intentos idénticos. Si requiere acceso privado, autenticación o el sitio no está soportado, explica brevemente y pide el archivo descargado por la persona. No extraigas cookies del navegador automáticamente ni solicites contraseñas o cookies en el chat. No eludas DRM. Una instalación correcta no garantiza todos los sitios.
