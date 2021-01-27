const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
  // paginacionDiv.addEventListener('click', direccionPaginacion);
}

function validarFormulario(e){
  e.preventDefault();

  const terminoBusqueda = document.querySelector('#termino').value;

  if (terminoBusqueda === ''){
    mostrarAlerta('Agrega un término de búsqueda');
    return;
  }

  BuscarImagenes();

}

function mostrarAlerta(mensaje){

  const existeAlerta = document.querySelector('.bg-red-100');

  if(!existeAlerta){
    const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
      
    alerta.innerHTML = `
        <strong class="font-bold">¡Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;
  
    formulario.appendChild(alerta);
  
    setTimeout(() => {
      alerta.remove();
    },3000);
  }

}

function BuscarImagenes(){

  const termino= document.querySelector('#termino').value;

  const key = '19869614-0d2a0cb85bfd0cab755bb2667';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  console.log(url);

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      console.log(totalPaginas)
      mostrarImagenes(resultado.hits);
    })
}

//Generador que registra la cantidad de elementos según las páginas
function *crearPaginador(total){
  console.log(total)
  for (let i=1; i <= total; i++){
    yield i;
  }
}

function calcularPaginas(total){
  return parseInt(Math.ceil( total / registrosPorPagina ));
}


function mostrarImagenes(imagenes){

  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }

  imagenes.forEach(imagen => {
    const {previewURL, likes, views, largeImageURL} = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-white">
        <img class="w-full" src="${previewURL}">
        <div class="p-4">
          <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
          <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>

          <a 
            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercse font-bold text-center rounded mt-5 p-1"
            href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imágen</a>
        </div>
      </div>
    </div> 
    `;
  });

  //Limpiar el paginador previo
  while(paginacionDiv.firstChild){
    paginacionDiv.removeChild(paginacionDiv.firstChild)
  }



  //Generar el nuevo HTML
  imprimirPaginador();
  
}


function imprimirPaginador(){
  iterador = crearPaginador(totalPaginas);

  while( true ) {
    const { value, done } = iterador.next();

    if(done) return;

    // Crear botón de sig
    const boton = document.createElement('a');
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-10', 'font-bold', 'uppercase', 'rounded');

    boton.onclick = () => {
      paginaActual = value;
      
      BuscarImagenes();
    }

    paginacionDiv.appendChild(boton);
  }
}