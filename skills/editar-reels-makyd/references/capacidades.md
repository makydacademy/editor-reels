# Capacidades abiertas, dependencias explícitas

Consulta primero la ayuda de la versión instalada de HyperFrames; los comandos y el catálogo cambian. Usa el ejecutable fijado en herramientas/editor-reels, no `@latest` en mitad de una edición.

| Necesidad | Ruta de trabajo |
|---|---|
| Montaje y audio | FFmpeg/FFprobe, intervalos trazables y control de sincronía |
| Ver referencias sin Watch | `scripts/frames.mjs`, imágenes observadas por el asistente y muestreo más denso alrededor de cortes; transcripción local si hay voz |
| Subtítulos | HyperFrames transcribe con modelo multilingüe e idioma correcto; verificar tiempos después de los cortes |
| Animaciones y transiciones | Skills oficiales, GSAP, `catalog`/`add` y documentación de componentes |
| Máscaras, recortes y texto detrás | Documentación/skill oficial de la función, modelo local si hace falta, prueba breve de bordes y consistencia temporal antes del render largo |
| Audio reactivo, composiciones avanzadas | Documentación pertinente y pruebas en el equipo; no limitarse a un catálogo predefinido del editor |
| Música y efectos | Archivos propios/licenciados o sonidos sintéticos locales; no asumir que una URL garantiza licencia |
| Recursos faltantes | Avisar, proponer alternativa o solicitar el recurso; no declarar listo lo que no se pudo verificar |

Fuentes oficiales: https://github.com/heygen-com/hyperframes y https://hyperframes.app/docs/5-packages/cli . Las funciones se evalúan según la versión y el equipo. Si una función no está soportada, explica el límite y ofrece una alternativa; no instales Remotion ni una API de pago.

Transcripción: comprueba `transcribe --help` y modelos disponibles. Para español no usar variantes `.en`. Una instalación de render no acredita reconocimiento de voz. Descargar un modelo requiere red y espacio; las siguientes ejecuciones pueden ser locales. Si hay aceleración GPU compatible, úsala tras comprobarla; no la presupongas.

Watch se enseña aparte. No lo descargues como solución automática a un error de este paquete.
