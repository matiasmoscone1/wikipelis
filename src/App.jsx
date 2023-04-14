import { useState, useEffect } from "react";
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function App() {
  
  //Inicializando la url para que muestre las peliculas recientes con mayor popularidad.
  const urlDiscover = "https://www.api.themoviedb.org/3/discover/movie/?api_key=5624fe0a0335053b1f0138f4b72cc6b7&language=es-ES";

  //Declaracion de estados.
  const [movies, setMovies] = useState([]);
  const [url, setURL] = useState(urlDiscover);
  const [search, setSearch] = useState("");
  const [peli, setPeli] = useState({});
  const [trailer, setTrailer] = useState({});
  const [playing, setPlaying] = useState(false);

  //Inicializando la url para la busqueda de peliculas.
  const urlSearch = `https://www.api.themoviedb.org/3/search/movie?api_key=5624fe0a0335053b1f0138f4b72cc6b7&query=${search}&language=es-ES`;

  //Consulta a la API con fetch.
  const showData = async () => {
    try{
      const response = await fetch(url);
      if(response.ok){
        const data = await response.json();
        setMovies(data.results);
        setPeli(data.results[0]);
        // aca puede ir el showdatavideo
      }else{
        console.log("Error al obtener los datos");
      }  
    }catch(error){
      console.log(error);
    }
  }

  //Ejecutando nuevamente la funcion que consulta a la API luego del renderizado 
  //y cada vez que cambie la url.
  useEffect(() => {
    showData();
  }, [url]);

  //Consulta a la API nuevamente pero con una nueva url con la id de la pelicula en portada.
  //Guarda los datos de video de la pelicula (para trabajar con el trailer).
  const showDataVideo = async () => {
    const response = await fetch(`https://www.api.themoviedb.org/3/movie/${peli.id}?api_key=5624fe0a0335053b1f0138f4b72cc6b7&append_to_response=videos`);
    const data = await response.json();
    setTrailer(data.videos.results[0]);
  }

  //Ejecuta de nuevo la consulta a la API con la funcion de guardar datos de video,
  //cada vez que cambie la pelicula de portada
  useEffect(() => {
    showDataVideo();   
  }, [peli.id]);


  //console.log(trailer);

  //Manipula el texto ingresado en la busqueda de peliculas.
  const handleInput = (e) => {
    setSearch(e.target.value);
    if(e.target.value === ""){
      setURL(urlDiscover);
    }
  }

  //Cambia la url de acuerdo al campo de texto ingresado en el input.
  const handleSearch = () => {
    setURL(urlSearch);
  }

  //Previene el comportamiento por default del submit del formulario,
  //para que no se borren los datos.
  const handleSubmit = (e) => {
    e.preventDefault();
  }


  //console.log(movies);

  //console.log(peli);
  
  //Se ejecuta cuando se le da click en la pelicula que uno desee (las que estan renderizadas),
  //mapea todas las peliculas y matchea los id, setea la pelicula seleccionada para que aparezca en portada.
  const selectMovie = (id) => {
    movies.map((movie) => {
      if(movie.id === id){
        setPeli(movie);
      }
    })
    window.scrollTo(0,0);
  }

  //Nuevamente setea la url para que muestre las peliculas recientes con mayor popularidad
  //pero con la pagina seleccionada.
  const handleDiscover = (id) => {
    setURL(`https://www.api.themoviedb.org/3/discover/movie/?api_key=5624fe0a0335053b1f0138f4b72cc6b7&page=${id}&language=es-ES`);
    window.scrollTo(0,0);
  }

 
 
  return (
    
    <div>
      <header className="title-container">
        <h2>WikiPelis</h2>
      </header>

      {/* Si el estado playing esta en true, se ejecuta todo el contenido del trailer.*/}
      {playing ? (
        <>
        {window.scrollTo(0,0)}
        <div className="close-container">
          {/* Boton para cerrar el trailer, pone el estado playing en false. */}
          <button onClick={() => setPlaying(false)} className="boton">
            X
          </button>
        </div>
        <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        cc_lang_pref: "es",
                      },
                    }}
                  />
          <div className="close-container">
          </div>

                  <br/>
                  <br/>
                  <br/>

        </>
      ) : (<>
      </>)}
  
        {/* Renderiza toda la pelicula en portada. */} 
      <div className="movie-container" style={{backgroundImage: `url("https://image.tmdb.org/t/p/original${peli.backdrop_path}")`,
    backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
          <div className="movie-features">
            <button className="btn-trailer" onClick={() => {setPlaying(true)}} style={{marginLeft: "10%"}}>Trailer</button>
            <h2 style={{color: "white"}}>{peli.title}</h2>
            <p style={{color: "white"}}>{peli.overview}</p>
          </div>
     </div>
    
        {/* Renderiza el contenido de la busqueda de peliculas. */} 
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" placeholder="Buscar pelicula" onChange={handleInput}/>
        <button onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
      </form>

      {/* Renderiza todas las peliculas recientes con mayor popularidad. */}
      <main className="main-container">
        {movies.map((movie) => {
          return(
            <div key={movie.id} className="card-container" onClick={() => selectMovie(movie.id)}>
              <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
              className="card-img" />
              <h4 className="card-title">{movie.title}</h4> 
            </div>
          )
        })}

        </main>
        {/* Renderiza los botones para que aparezcan mas peliculas */}
        <div className="carrete-container">
          <button onClick={() => {handleDiscover(1)}}>1</button>
          <button onClick={() => {handleDiscover(2)}}>2</button>
          <button onClick={() => {handleDiscover(3)}}>3</button>
          <button onClick={() => {handleDiscover(4)}}>4</button>
          <button onClick={() => {handleDiscover(5)}}>5</button>
          <button onClick={() => {handleDiscover(6)}}>6</button>
          <button onClick={() => {handleDiscover(7)}}>7</button>
          <button onClick={() => {handleDiscover(8)}}>8</button>
          <button onClick={() => {handleDiscover(9)}}>9</button>
          <button onClick={() => {handleDiscover(10)}}>10</button>
        </div> 
      
    </div>
    
  )
}


export default App
