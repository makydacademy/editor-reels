# Propuesta visual y aprobación

El resultado de esta fase es un storyboard **visual**, accesible en HTML local y con alternativa de imágenes si el host no lo puede mostrar. El asistente debe abrirlo o renderizarlo para revisar que se ve antes de entregarlo. No basta con poner un archivo en disco sin ofrecer acceso.

## Contenido mínimo

Cada escena muestra un fotograma real de crudos, una composición representativa (texto, encuadre y tratamiento visual) y una leyenda corta: intervalo aproximado, acción, transición/animación, sonido y recurso de origen. Cuando sea útil, añade la referencia al lado y aclara que no formará parte del vídeo final.

Muestra el conjunto en orden, no un conjunto de estilos sueltos. Usa el número de escenas que necesita el vídeo. Si el efecto depende del movimiento, crea una pequeña muestra animada o secuencia, rotulada como propuesta.

Puedes usar `scripts/storyboard.mjs` del paquete para montar HTML a partir de JSON. Sus tarjetas son una base: si una tipografía, recorte o máscara concreta es decisiva, crea un mockup fiel e inclúyelo como imagen. No presentes una tarjeta genérica como vista exacta del render final.

```json
{
  "title": "Propuesta del reel",
  "direction": "Kit elegido y rasgos de la referencia",
  "scenes": [
    {
      "time": "0-3 s",
      "image": "frames/inicio.jpg",
      "text": "Texto del guion real",
      "action": "Encuadre inicial y aparición del título",
      "motion": "Entrada suave coherente con el kit",
      "audio": "Voz original; sin música en la apertura",
      "source": "crudos/toma.mp4 · 00:04",
      "color": "#FFFFFF",
      "background": "#402039",
      "font": "Arial",
      "position": "bottom"
    }
  ]
}
```

Las rutas de imagen son relativas al JSON o absolutas dentro del proyecto; el generador incrusta sus bytes y no descarga URLs. Para diseño exacto se pueden incrustar fuentes con licencia en HTML o usar mockups prerenderizados.

## Decisión

Pregunta al entregar: «¿Apruebas este storyboard o qué cambiarías?». Guarda plan v1, v2... La aprobación debe venir del chat actual y corresponder al plan mostrado. Solo después comienza producción. Un registro técnico de aprobación nunca sustituye el mensaje del usuario.
