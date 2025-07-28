// Simulate private rating field using closure
function RatingManager() {
    var rating = null;
    return {
        setRating: function(r) {
            if (r >= 0 && r <= 5) rating = r;
        },
        getRating: function() {
            return rating;
        }
    };
}

// Review Class
function Review(user, movieTitle, comment, stars) {
    this.user = user;
    this.movieTitle = movieTitle;
    this.comment = comment;
    this.stars = stars;
}

// Movie Class
function Movie(title, genre, year, poster) {
    this.title = title;
    this.genre = genre;
    this.year = year;
    this.poster = poster;
    this.ratingManager = RatingManager();
    this.reviews = [];
}

Movie.prototype.addReview = function(review) {
    this.reviews.push(review);
};

Movie.prototype.renderReviews = function(container) {
    container.innerHTML = '<h4>Reviews:</h4>';
    if (this.reviews.length === 0) {
        container.innerHTML += '<p>No reviews yet.</p>';
    } else {
        for (var i = 0; i < this.reviews.length; i++) {
            var r = this.reviews[i];
            container.innerHTML += '<p><strong>' + r.user + ':</strong> ' +
                                   r.stars + '/5 - ' + r.comment + '</p>';
        }
    }
};

Movie.prototype.display = function() {
    var card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML =
        '<h2>' + this.title + ' (' + this.year + ')</h2>' +
        '<p><strong>Genre:</strong> ' + this.genre + '</p>' +
        '<img src="' + this.poster + '" width="100"><br>' +
        '<p><strong>Rating:</strong> ' + this.ratingManager.getRating() + '/5</p>' +
        '<div class="reviews-section"></div>' +
        '<div class="review-form">' +
        '<input type="text" class="review-comment" placeholder="Your comment">' +
        '<select class="review-stars">' +
        '<option value="1">⭐</option>' +
        '<option value="2">⭐⭐</option>' +
        '<option value="3">⭐⭐⭐</option>' +
        '<option value="4">⭐⭐⭐⭐</option>' +
        '<option value="5">⭐⭐⭐⭐⭐</option>' +
        '</select>' +
        '<button class="submit-review">Submit Review</button>' +
        '</div>';

    var self = this;

    setTimeout(function() {
        var submitBtn = card.querySelector('.submit-review');
        submitBtn.addEventListener('click', function() {
            var comment = card.querySelector('.review-comment').value;
            var stars = parseInt(card.querySelector('.review-stars').value, 10);
            if (!comment) return alert('Please write a comment');
            var review = new Review(currentUser.name, self.title, comment, stars);
            self.addReview(review);
            self.renderReviews(card.querySelector('.reviews-section'));
        });
    }, 0);

    return card;
};

// Inheritance: ActionMovie
function ActionMovie(title, genre, year, poster) {
    Movie.call(this, title, genre, year, poster);
}
ActionMovie.prototype = Object.create(Movie.prototype);
ActionMovie.prototype.constructor = ActionMovie;
ActionMovie.prototype.display = function() {
    var card = Movie.prototype.display.call(this);
    card.style.borderLeft = '5px solid crimson';
    return card;
};

// Inheritance: ComedyMovie
function ComedyMovie(title, genre, year, poster) {
    Movie.call(this, title, genre, year, poster);
}
ComedyMovie.prototype = Object.create(Movie.prototype);
ComedyMovie.prototype.constructor = ComedyMovie;
ComedyMovie.prototype.display = function() {
    var card = Movie.prototype.display.call(this);
    card.style.borderLeft = '5px solid orange';
    return card;
};

// User Class
function User(name) {
    this.name = name;
    this.collection = [];
}

User.prototype.addMovie = function(movie) {
    this.collection.push(movie);
};

User.prototype.displayCollection = function(container) {
    container.innerHTML = '';
    for (var i = 0; i < this.collection.length; i++) {
        var card = this.collection[i].display();
        this.collection[i].renderReviews(card.querySelector('.reviews-section'));
        container.appendChild(card);
    }
};

// Create default user
var currentUser = new User('DefaultUser');

// Handle DOM interaction
document.getElementById('addMovieBtn').addEventListener('click', function() {
    var title = document.getElementById('movieTitle').value;
    if (!title) return alert('Please enter a movie title');

    fetchMovieFromOMDb(title, function(data) {
        if (!data || data.Response === "False") {
            alert('Movie not found!');
            return;
        }

        var genre = data.Genre || 'Unknown';
        var movie;
        if (genre.indexOf('Action') !== -1) {
            movie = new ActionMovie(data.Title, genre, data.Year, data.Poster);
        } else if (genre.indexOf('Comedy') !== -1) {
            movie = new ComedyMovie(data.Title, genre, data.Year, data.Poster);
        } else {
            movie = new Movie(data.Title, genre, data.Year, data.Poster);
        }

        movie.ratingManager.setRating(Math.floor(Math.random() * 5) + 1); // Simulate rating
        currentUser.addMovie(movie);
        currentUser.displayCollection(document.getElementById('library'));
    });
});

// OMDb API Fetch
function fetchMovieFromOMDb(title, callback) {
    var apiKey = 'af0720b9'; 
    var url = 'https://www.omdbapi.com/?apikey=' + apiKey + '&t=' + encodeURIComponent(title);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        callback(data);
    };
    xhr.send();
}
// Initial setup        
document.addEventListener('DOMContentLoaded', function() {
    currentUser.displayCollection(document.getElementById('library'));
});

