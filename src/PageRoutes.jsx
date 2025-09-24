import { useState } from 'react';
import HomePage from './pages/Home.jsx';
import CreateEcho from './pages/CreateEcho.jsx';
import ViewEcho from './pages/ViewEcho.jsx';
import SearchEcho from './pages/SearchEcho.jsx';

export default function PageRoutes () {
  const [page, setPage] = useState('home');

  const  handleNavClick = (e, targetPage) => {
    e.preventDefault();
    setPage(targetPage);
  }
  return (
    <>
      <header className = "navBar">
        <nav>
          <a href = "/" onClick = {(e) => handleNavClick(e, 'home')}>Home</a>
          <a href = "/create" onClick = {(e) => handleNavClick(e, 'create')}>Create Echoe</a>
          <a href = "/view" onClick = {(e) => handleNavClick(e, 'view')}>View Echoe</a>
          <a href = "/search" onClick = {(e) => handleNavClick(e, 'search')}>Search Echoe</a>
        </nav>
        {page === 'home' && <HomePage />}
        {page === 'create' && <CreateEcho/>}
        {page === 'view' && <ViewEcho/>}
        {page === 'search' && <SearchEcho/>}
      </header>
    </>
  )
}