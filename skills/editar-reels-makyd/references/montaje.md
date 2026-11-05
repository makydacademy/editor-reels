# Montaje con voz

## Una sola línea de tiempo

Conserva transcripción original por palabra, identidad del archivo (hash), idioma/modelo y duración de FFprobe en trabajo. Reutiliza estos artefactos si no cambió el original ni la configuración. No transcribas once veces para once estilos. Normaliza a `{words:[{text,start,end}]}` en segundos; el helper también acepta un array y el campo `word`. No inventes tiempos de palabras dividiendo segmentos. Si hay solapes del ASR, alinea contra el audio antes de continuar.

1. Revisa el texto completo por sentido: frases duplicadas, reinicios, correcciones, tomas parciales. Ejecuta candidatos sobre el original, antes de acortar silencios. El detector compara secuencias ordenadas incluso dentro de una misma frase; no depende de puntuación ni pausas.
2. Usa silencios acústicos de FFmpeg/VAD como evidencia adicional, no huecos de la transcripción como prueba de silencio. Un ASR puede omitir voz. Conserva respiraciones/pausas expresivas. Deja margen suficiente antes y después de palabras; confirma el empalme en audio.
3. Para cada candidato examina ambos pasajes y contexto. Conserva la toma completa y clara, no necesariamente la última. Un énfasis ('muy muy'), estribillo, contraste, cifra o negación diferente puede ser intencional. Los reinicios reformulados y repeticiones de dos palabras requieren revisión del agente: el detector exacto no los cubre todos.
4. Reproduce únicamente los fragmentos dudosos con contexto; si texto y audio discrepan, retranscribe localmente ese fragmento y convierte sus tiempos al origen. No repitas el ASR completo por defecto. Sin evidencia suficiente, conserva el tramo y registra la limitación; no conviertas cada duda en una pregunta al usuario.
5. Registra decisiones en `cuts.json`: `{ "cuts": [{"start":1.2,"end":3.4,"reason":"toma fallida", "evidence":"comparación de ambos pasajes; segunda toma completa"}] }`. Evidence describe una revisión real. El agente elige límites entre palabras y ajusta márgenes al audio. Nunca borres automáticamente desde la primera frase hasta el comienzo de la segunda: puede haber contenido válido en medio. Silencios y repeticiones usan siempre tiempos originales.
6. Genera la EDL y revisa texto remapeado/candidatos residuales como parte del control 1. Renderiza una base con una única operación FFmpeg. Comprueba empalmes reales; si hay clic, ajusta el límite o una envolvente corta solo en ese empalme, sin tapar consonantes. El helper no añade fades automáticamente.

Desde la carpeta del paquete (rutas absolutas o relativas al directorio actual):

```text
node scripts/montage.mjs --mode candidates --transcript palabras.json --output candidatos.json
node scripts/montage.mjs --mode plan --transcript palabras.json --duration 63.6 --cuts cuts.json --output montaje.json
node scripts/montage.mjs --mode plan --transcript palabras.json --duration 63.6 --cuts cuts.json --output montaje-v2.json --video original.mp4 --render base-v1.mp4
```

El render requiere vídeo con audio. Nunca reemplaza destinos existentes. `keep` documenta origen y destino; `words` sincroniza subtítulos y beats; `residualCandidates` señala posibles repeticiones conservadas. Son ayudas, no una certificación semántica. Cero candidatos no prueba ausencia de repeticiones, especialmente si el ASR las omitió. El helper rechaza límites dentro de palabras, rangos inválidos y eliminación total. No corta por su cuenta ni elige la mejor toma.

## Dos controles, no una cadena de revisiones

Control 1 agrupa discurso, empalmes y audio de la base. Registra candidatos conservados/eliminados y motivo en trabajo; no lo añadas al storyboard. Control 2 agrupa resultado visual, movimiento y mezcla. No repitas revisión del discurso por cada kit si la base sigue idéntica. Una modificación del montaje invalida remapeo, subtítulos y beats; una modificación de estilo no invalida transcripción ni cortes.
