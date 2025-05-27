import "./style.css";
import axios from "axios";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

class MovieService {
  async search(title, type, page) {
    const {
      data: { Search: moviesArr },
    } = await axios.get(
      `http://www.omdbapi.com/?apikey=b14a1940&s=${title}&type=${type}&page=${page}`
    );
    return moviesArr;
  }

  async getMovie(movieId) {
    const { data: movieInfo } = await axios.get(
      `http://www.omdbapi.com/?apikey=b14a1940&i=${movieId}`
    );
    return movieInfo;
  }
}

class MovieUi {
  page = 1;
  moviesArr = [];
  constructor(searchForm, resultContainer, loading, container, filmsTitle) {
    this.resultContainer = resultContainer;
    this.loading = loading;
    this.searchForm = searchForm;
    this.container = container;
    this.filmsTitle = filmsTitle;
  }

  renderMovies(movies, movieInfo) {
    this.searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      this.resultContainer.innerHTML = "";
      this.loading.style.display = "block";
      this.filmsTitle.style.display = "block";

      const [{ value: title }, { value: type }] = e.target;

      try {
        this.moviesArr = await movies(title, type, this.page);
        console.log(this.moviesArr);
        this.moviesArr.forEach(
          async ({
            Title: title,
            Year: year,
            Poster: poster,
            Type,
            imdbID: filmId,
          }) => {
            const movieContainer = document.createElement("li");
            const details = document.createElement("button");
            const filmYear = document.createElement("div");
            const filmName = document.createElement("h3");
            const img = document.createElement("img");

            details.textContent = "Details";
            filmName.textContent = title;
            filmYear.textContent = year;
            img.src = poster;

            const movieInfoObj = await movieInfo(filmId);
            const {
              Released: released,
              Genre: genre,
              Country: country,
              Director: director,
              Writer: writer,
            } = movieInfoObj;
            console.log(movieInfoObj);
            const instance = basicLightbox.create(
              `<div class='info-container'><div>${img.outerHTML}</div>
               <ul>
              <li><h3>Title:</h3>${title}</li>
              <li><h3>Released:</h3>${released}</li>
              <li><h3>Genre:</h3>${genre}</li>
              <li><h3>Country:</h3>${country}</li>
              <li><h3>Director:</h3>${director}</li>
              <li><h3>Writer:</h3>${writer}</li>

              </ul>
              </div>`
            );
            details.addEventListener("click", async () => {
              instance.show();
            });

            movieContainer.append(img);
            movieContainer.append(filmName);
            movieContainer.append(filmYear);
            movieContainer.append(details);
            this.resultContainer.append(movieContainer);
          }
        );
      } finally {
        this.loading.style.display = "none";
      }
    });
  }
}

class MovieApp {
  constructor() {
    this.movieService = new MovieService();
    this.movieUi = new MovieUi(
      document.querySelector(".search-form"),
      document.querySelector(".result-container"),
      document.querySelector(".loading"),
      document.querySelector(".container"),
      document.querySelector(".films-title")
    );
  }

  loadMovies(title, type, page) {
    return this.movieService.search(title, type, page);
  }

  loadMovieInfo(movieId) {
    return this.movieService.getMovie(movieId);
  }
  init() {
    // this.movieService.getMovie("tt1528854");
    this.movieUi.renderMovies(
      this.loadMovies.bind(this),
      this.loadMovieInfo.bind(this)
    );
  }
}

const app = new MovieApp();
app.init();

// const a = document.createElement("h1");
// a.textContent = "hkasygdj";

// const instance = basicLightbox.create(`${a.outerHTML}`);
// instance.show(console.log(a));
