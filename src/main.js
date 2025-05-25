import "./style.css";
import axios from "axios";

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

    console.log(movieInfo);
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

  renderMovies(movies) {
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
          ({ Title: title, Year: year, Poster: poster, Type, imdbID }) => {
            const movieContainer = document.createElement("li");
            const details = document.createElement("button");
            const filmYear = document.createElement("div");
            const filmName = document.createElement("h3");
            const img = document.createElement("img");

            details.textContent = "Details";
            filmName.textContent = title;
            filmYear.textContent = year;
            img.src = poster;

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
  init() {
    // this.movieService.getMovie("tt1528854");
    this.movieUi.renderMovies(this.loadMovies.bind(this));
  }
}

const app = new MovieApp();
app.init();
