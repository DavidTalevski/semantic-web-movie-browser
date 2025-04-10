import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MoviesList from "./components/MoviesList/MoviesList";
import ActorsList from "./components/ActorsList/ActorsList";
import ActorDetailsPage from './components/DetailsPage/ActorDetailsPage';
import MovieDetailsPage from './components/DetailsPage/MovieDetailsPage';
import './App.css';

import { NavLink } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav className="main-nav">
      <div className="nav-content">
        <NavLink to="/" className="nav-logo">MovieDB</NavLink>
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/actors"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            People
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/actors" element={<ActorsList />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/actors/:id" element={<ActorDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;