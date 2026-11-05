# Storyboard visual

Muestra únicamente las escenas en orden con fotogramas reales y el diseño del kit aplicado. Usa mockups prerenderizados fieles, sin capas genéricas, recuadros ni fuentes de sustitución. Si un efecto se entiende por movimiento, añade una muestra corta MP4/WebM o imagen animada. El único texto visible es el que aparecerá en el vídeo. No incluyas títulos de presentación, tiempos, leyendas, explicaciones técnicas ni solicitudes de aprobación.

`scripts/storyboard.mjs` incrusta imágenes y vídeos locales en un HTML. Cada imagen ya debe contener el diseño final propuesto; el generador no añade textos ni fondos al contenido. Rutas relativas al JSON, dentro del proyecto:

```json
{"scenes":[{"image":"mockups/inicio.png"},{"video":"previews/transicion.mp4"}]}
```

Los detalles de origen, cortes y sonido van en el plan interno, no en la vista. Los tiempos definitivos siguen al diálogo, no a tarjetas de duración fija. Comprueba que el HTML se muestra con medios cargados y ofrece enlace; si el host no lo abre, entrega las imágenes directamente. No presentes placeholders como escenas terminadas. Mostrarlo no pausa producción salvo petición expresa del usuario. No hace falta una aprobación nueva por cada corrección.
