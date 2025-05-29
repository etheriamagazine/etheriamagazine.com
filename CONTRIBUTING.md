# Editar artículos para etheriamagazine.com
Cómo editar un artículo en Hugo para etheriamagazine.

## Estructura
Un artículo tipo en Hugo tiene dos partes diferenciadas

- Cabecera con los metadatos:
- Contenido 


```markdown
---
  title: Este es el título, el h1 o título de primer nivel
  date: 2025-01-01
  authors:
    - Redacción Etheria
---
Este es el primer párrafo del artículo, el párrafor introductorio y que por defecto
aparece como resumen del artículo.

Y este es un segundo párrafo con más información.

## Esto es un h2 o título de segundo nivel
Otro párrafo de texto y debajo una imagen:

![Texto alternativo](https://fotos.etheriamagazine.com/url-de-la-imagen.jpg "Pie de foto")
```

## Shortcodes
La sintaxis básica de Markdown permite crear elementos sencillos de HTML como
son los párrafos, titulares, imágenes e hipervínculos sencillos a otras páginas.

No obstante, los usuarios esperan que una página pueda contener otros elementos más complejos, como
un QR, un video, un player de audio, un mapa...


Los shortcodes son pequeños códigos informáticos que se pueden introducir en el
cuerpo de la entrada para aumentar y enriquecer nuestro artículo.

### youtube: incrustar un vídeo de youtube
```markdown
Esto es un párrafo del artículo y voy a insertar un video
mediante un shortcode, pásandole el identificador del vídeo de youtube:

{{< youtube id=G-8Nrnl4JjQ >}} 
```

### reflink: link interno a otra página de la web de etheria
El shortcode reflink inserta un link completo a otra entrada de nuestra web. 

Este shortcode sólo requiere del parametro `path` donde se le pasa la ruta del
artículo relativa a la carpeta `content`.


```markdown
Te recomendamos adicionalmente:  
- {{< reflink path=/posts/2025/02/viaje-por-asia-central-en-furgoneta-tbilisi-uzbekistan >}}
- {{< reflink path=/posts/2025/02/viaje-romantico-costa-amalfitana >}}

```

