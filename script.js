// Use 'use strict' to enforce modern syntax rules
'use strict';

// Movie Base Class
class Movie {
  static allMovies = [];
  #rating;

  constructor(title, genre, rating) {
    this.title = title;
    this.genre = genre;
    this.#rating = rating;
    Movie.allMovies.push(this);
  }

  getRating() {
    return this.#rating;
  }

  setRating(value) {
    if (value >= 0 && value <= 10) {
      this.#rating = value;
    }
  }

  display() {
    return `
      <div class="movie">
        <h3>${this.title}</h3>
        <p>Genre: ${this.genre}</p>
        <p>Rating: ${this.getRating()}</p>
      </div>
    `;
  }
}

// Inheritance
class ActionMovie extends Movie {
  constructor(title, rating) {
    super(title, 'Action', rating);
  }

  display() {
    return `<div class="movie action">
      🎯 <strong>${this.title}</strong> — Action | Rating: ${this.getRating()}
    </div>`;
  }
}

class ComedyMovie extends Movie {
  constructor(title, rating) {
    super(title, 'Comedy', rating);
  }

  display() {
    return `<div class="movie comedy">
      😂 <strong>${this.title}</strong> — Comedy | Rating: ${this.getRating()}
    </div>`;
  }
}

class DramaMovie extends Movie {
  constructor(title, rating) {
    super(title, 'Drama', rating);
  }

  display() {
    return `<div class="movie drama">
      🎭 <strong>${this.title}</strong> — Drama | Rating: ${this.getRating()}
    </div>`;
  }
}

// User Class
class User {
  static users = [];

  constructor(name) {
    this.name = name;
    this.movies = [];
    User.users.push(this);
  }

  addMovie(movie) {
    this.movies.push(movie);
  }
}

// Review Class
class Review {
  constructor(user, movie, text) {
    this.user = user;
    this.movie = movie;
    this.text = text;
  }

  display() {
    return `<p>${this.user.name} on <strong>${this.movie.title}</strong>: ${this.text}</p>`;
  }
}
