import React, { Component } from "react";
import { Link } from "react-router-dom";
import MoviesTable from "./commons/moviesTable";
import ListGroup from "./commons/listGroup";
import Pagination from "./commons/pagination";
import { paginate } from "../utils/paginate";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import SearchBox from "./searchBox";
import _ from "lodash";

import { toast } from "react-toastify";
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    selectedGenre: null,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "Title", order: "asc" }
  };
  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genre" }, ...data];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("this movie is already been deleted");

      this.setState({ movies: originalMovies });
    }
    //const movies = this.state.movies.filter(m => m._id !== movie._id);
    //in modern js if key-value are same then we can use below syntax to set state
    //this.setState({movies})
  };
  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handlePageChange = page => {
    this.setState({ currentPage: page });
    console.log(page);
  };
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };
  handlePagedData = () => {
    const {
      currentPage,
      pageSize,
      movies: allMovies,
      selectedGenre,
      searchQuery,
      sortColumn
    } = this.state;
    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, movies };
  };
  render() {
    const { length: count } = this.state.movies;
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;
    const { totalCount, movies } = this.handlePagedData();
    const { user } = this.props;
    if (count === 0) return <p>There are no movies in the DB</p>;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing{totalCount} movies from the DB </p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />

          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
