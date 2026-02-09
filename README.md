[autoría]: #autoría
[bun]: https://bun.com/
[contenido]: #contenido
[copyright]: #copyright
[etheria magazine]: https://etheriamagazine.com
[fly.io]: https://fly.io
[github actions]: https://github.com/features/actions
[hugo]: https://gohugo.io
[npm]: https://nodejs.org/en
[markdown]: https://en.wikipedia.org/wiki/Markdown
[propiedad intelectual]: #propiedad-intelectual
[scripts]: ./scripts/
[sitio web]: https://etheriamagazine.com

<a href="https://etheriamagazine.com/"><img src="https://github.com/user-attachments/assets/acfbd4df-7af3-46b3-b5f6-5e51ce692b66" width="260" alt="Etheria Magazine" /></a>

Etheria Magazine — La revista de las mujeres viajeras  

[![Fly Deploy](https://github.com/etheriamagazine/etheriamagazine.com/actions/workflows/fly-deploy.yml/badge.svg)](https://github.com/etheriamagazine/etheriamagazine.com/actions/workflows/fly-deploy.yml)
---

**[Contenido]** | **[Autoría]** | **[Propiedad intelectual]** | **[Sitio web]**

## 📰 Descripción

Etheria Magazine la primera revista de viajes dirigida a mujeres en España. Impulsada
en 2018 por dos periodistas especializadas en Turismo y con una larga trayectoria en
el sector editorial, se centra en las necesidades de la mujer viajera.

## 🗂️ Contenido

La carpeta [content](./content) tiene todos los artículos y textos publicados en
[Etheria Magazine](https://etheriamagazine.com) desde 2018. 

Originariamente en un sistema Wordpress, se han exportado a formato [Markdown]
para poder publicarlos mediante una herramienta de generación de sitios
estáticos como [Hugo]. Todo el proceso de publicación se dispara desde este
repositorio y se automatiza gracias a [GitHub Actions].

## ✍️ Autoría

Todos los textos y artículos de este repositorio son obras originales de sus
autoras. El campo `author` en el bloque de metadatos al comienzo
de cada artículo (frontmatter) recoge el nombre del autora.

<details>
  <summary>Ver ejemplo de autoría</summary>

```
---
title: "Ruta en coche por Irlanda: condados de Cork y Kerry"
date: 2023-12-30
cover: https://fotos.etheriamagazine.com/2023/12/irlanda-isla-Garinish.jpg
categories: 
  - viajar-con-amigas
tags: 
  - europa
authors: 
  - Pepa G. Marín
---

Entre brumas, bosques, lagos...
```

</details>


La firma **'Redacción Etheria'** distingue ciertos artículos escritos a través
de fuentes o entre varias periodistas y cuya autoría recae en el equipo de
redacción de la revista.

## ⚖️ Propiedad Intelectual

Todo el contenido de este repositorio —incluidos los [artículos](content/posts), textos, imágenes, diseño, código fuente y demás materiales— constituye una obra protegida por la legislación vigente en materia de propiedad intelectual.

### Titularidad  
La titularidad de todos los derechos corresponde a **Marakanda Comunicación, SL** (*MARAKANDA*).  
El acceso o uso de este repositorio **no implica cesión ni licencia** de derechos de explotación, salvo lo estrictamente necesario para su correcta visualización o uso técnico.

### Uso permitido  
- Puedes **consultar**, **leer** o **enlazar** libremente los artículos publicados en [Etheria Magazine](https://etheriamagazine.com).  
- Se permite el uso personal y no comercial de los materiales, siempre que se mantengan intactos los avisos de autoría y copyright.

### Restricciones  
No está permitida la **reproducción**, **distribución**, **modificación** o **comunicación pública** de los contenidos sin autorización previa y por escrito de *MARAKANDA*.  
Tampoco se autoriza su instalación en servidores públicos, redes o servicios comerciales.

### Marcas y signos distintivos  
Todas las marcas, logotipos y nombres comerciales incluidos en este repositorio son propiedad de *MARAKANDA* o de sus legítimos titulares.  
El acceso a este repositorio **no confiere ningún derecho de uso** sobre dichos elementos.


## 🧰 Construir desde el código fuente

### 📋 Prerequisitos
Para generar el sitio web desde el código fuente necesitas:
- El generador [Hugo]
- Un gestor de paquetes como [bun] o [npm]

### Uso
Se incluyen varios [scripts] para facilitar las tareas comunes:

🚀 Lanzar el servidor de desarrollo (con hot reload en `localhost:1313`):

```shell
bun dev
```

📦 Lanzar al app completa (incluyendo buscador Pagefind en `localhost:3000)`:

```shell
bun preview
```

### 🔧 Variables de configuración

En **entornos de desarrollo**, usa un archivo `.env` o `.env.local` con las
variables necesarias para `imgproxy` y `mailchimp`. Asegúrate que estos archivos
estén excluídos del repositorio en el archivo `.gitignore` para no exponer
ninguna clave o secreto.

```dosini
# required at build time 
HUGO_IMGPROXY_SALT="..."
HUGO_IMGPROXY_KEY=...

# required at runtime 
MAILCHIMP_DC=
MAILCHIMP_APIKEY=
MAILCHIMP_LIST_ID=
```

En **entornos de integración contínua CI/CD** usa las herramientas de cada
plataforma para establecer los secretos:

- **Imgproxy**  
Establecer las variables `HUGO_IMGPROX_SALT` y `HUGO_IMGPROX_KEY` según la
documentación sobre [Url Signing](https://docs.imgproxy.net/usage/signing_url)
para el acceso autenticado al servicio imgproxy. Usa los [GitHub
secrets](https://docs.github.com/es/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
en el repositorio o a través del GitHub Cli para que estas variables puedan ser
consumidas al hacer el build.

  ```shell
  # establece el secreto en un prompt interactivo
  gh secret set HUGO_IMGPROXY_KEY
  ```

- **Mailchimp**  
Estas variables se usan en tiempo de ejecución (runtime) en el propio host. Establecer según el
proveedor cloud elegido. En el caso de [Fly.io]:
  ```shell
  fly secrets set MAICHIMP_DC=... --stage
  fly secrets set MAICHIMP_APIKEY=... --stage
  fly secrets set MAICHIMP_LIST_ID=... --stage
  fly deploy
  ```


---

© 2018–2026 **Marakanda Comunicación, SL**  
Todos los derechos reservados.
