# Karanda’y Productora — primera versión

## 1. Abrir la web
Descomprimí el ZIP y abrí index.html con tu navegador. Conservá styles.css al lado de index.html. No necesitás instalar programas ni compilar. Esta versión no depende de librerías, fuentes externas externos. El movimiento usa motion.js, incluido en la carpeta.

## 2. Estructura
- Inicio: presentación y enlaces hacia portafolio y contacto.
- Quiénes somos: texto inicial para revisar con el dueño.
- Servicios: propuesta de grabación, fotografía y edición, pendiente de confirmar.
- Portafolio: tres espacios identificados como pendientes, sin proyectos inventados.
- Contacto: campos pendientes, sin enlaces falsos ni formulario que simule envíos.

## 3. Archivos
- index.html: textos, secciones y enlaces. Editalo con un editor de texto.
- styles.css: colores, tipografía, espaciado, animaciones y adaptación a celular.
- motion.js: entradas al hacer scroll y parallax sutil; no requiere instalación.
- assets/: carpeta para incorporar el logo y fotos reales.
- .nojekyll: indica a GitHub Pages que sirva los archivos directamente.

## 4. Personalizar antes de publicar
1. Confirmar textos y servicios. El logo y el isologo originales están incluidos en assets/. Se muestran sin redibujarlos; el encuadre se ajusta con CSS.
2. Cambiar los colores en :root al comienzo de styles.css.
3. Agregar al menos tres trabajos con nombre, descripción, imagen y enlace al video cuando corresponda. Usar material con autorización para publicar.
4. Sustituir los bloques pendientes de contacto por enlaces reales:
   - WhatsApp: https://wa.me/ seguido del número internacional, solo dígitos.
   - Correo: mailto: seguido del correo real.
   - Instagram: URL completa del perfil.
5. No publicar datos privados o credenciales.

Ejemplo de imagen, una vez que exista el archivo:
<img src="./assets/proyecto-01.jpg" alt="Descripción concreta del trabajo" width="1200" height="800" loading="lazy" style="width:100%;height:auto">

## 5. Guardar en GitHub sin terminal
1. Iniciá sesión en tu cuenta de GitHub y creá un repositorio llamado karanday-productora.
2. Usá Add file > Upload files para subir los archivos descomprimidos, no el ZIP.
3. index.html y styles.css deben quedar directamente en la raíz del repositorio.
4. Confirmá con Commit changes. Esto guarda el código; no equivale a publicar la página.

## 6. Publicar más adelante con GitHub Pages
En el repositorio, entrá a Settings > Pages. En Build and deployment seleccioná Deploy from a branch, elegí main y /(root), y guardá. GitHub mostrará la dirección cuando termine de publicar. La web será pública. Los archivos usan rutas relativas para funcionar también bajo el nombre del repositorio.
Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
Configuración: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 7. Alternativa: Netlify
Con tu sesión iniciada, abrí Netlify Drop y arrastrá la carpeta descomprimida que contiene index.html y styles.css. No requiere compilación. Publicá únicamente cuando hayas revisado el contenido.
Guía oficial: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/

Vercel también puede servir esta web estática. No hace falta elegir ni configurar los tres servicios: con uno alcanza. Esta entrega no crea un repositorio en tu cuenta de GitHub ni publica en un hosting externo.

## Comprobaciones
Se verificaron las secciones, los destinos de enlaces internos y la presencia de la hoja de estilos. Incluye reglas responsive y foco visible para teclado. No se realizó una prueba visual en navegador; revisá la apariencia en celular y computadora antes de publicar. Los enlaces de contacto y los medios se probarán al agregarlos.

## Identidad aplicada
Negro, blanco y naranja #F39200 (muestreado del archivo, no una especificación oficial de marca). Composición editorial, espacios amplios, logo original y acentos contenidos. Los PNG se conservan sin modificaciones.

## Versión con movimiento
Descomprimí todos los archivos juntos, incluido motion.js. Abrí index.html. Si reemplazaste una versión abierta, actualizá con Ctrl+F5. Entrada de título y logo, revelado al desplazar, zoom lento en proyectos y parallax de hasta 9 px. El parallax se desactiva en dispositivos táctiles. Se respeta Reducir movimiento del sistema. Sin JavaScript el contenido permanece visible. No hay sonido automático, movimiento infinito ni desplazamiento forzado. Las fotos reales de los proyectos siguen pendientes.
Validación: compilación, sintaxis de JavaScript y pruebas del revelado, movimiento reducido y limpieza de eventos. No se hizo una prueba visual en navegador.

## Transiciones del menú
Quiénes somos: fade, desenfoque de 3 px y desplazamiento leve. Servicios: bloques secuenciales. Portafolio: máscara lateral suave. Contacto: fade y expansión del 98,5 al 100 %. Se activan al llegar al destino, también al repetir el enlace. La rueda, el gesto táctil y las teclas de navegación interrumpen el efecto. Reducir movimiento desactiva estas entradas. Se mantiene el comportamiento nativo de las anclas y el historial.
Para actualizar la versión anterior, reemplazá styles.css y motion.js juntos, luego Ctrl+F5. HTML y recursos gráficos no cambian.
