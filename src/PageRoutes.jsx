import { useState, useEffect } from 'react';
import HomePage from './pages/Home.jsx';
import SendEcho from './pages/SendEcho.jsx';
import ViewEcho from './pages/ViewEcho.jsx';
import SearchEcho from './pages/SearchEcho.jsx';
import './PageRoutes.css';

export default function PageRoutes () {
  const [page, setPage] = useState('home');
  const [scrolledHeader, setScrolledHeader] = useState(false);

  const handleNavClick = (e, targetPage) => {
    e.preventDefault();
    setPage(targetPage);
    window.scrollTo(0, 0); 
  }

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) setScrolledHeader(true);
      else setScrolledHeader(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`navBar ${scrolledHeader ? 'scrolled' : ''}`}>
        <nav>
          <a href="/" onClick={(e) => handleNavClick(e, 'home')} className={page === 'home' ? 'active' : ''}>Home</a>
          <a href="/send" onClick={(e) => handleNavClick(e, 'send')} className={page === 'send' ? 'active' : ''}>Send Echo</a>
          <a href="/view" onClick={(e) => handleNavClick(e, 'view')} className={page === 'view' ? 'active' : ''}>View Echoes</a>
          <a href="/search" onClick={(e) => handleNavClick(e, 'search')} className={page === 'search' ? 'active' : ''}>Search for Echoes</a>
        </nav>
      </header>

      <main style={{ marginTop: 0 }}>
        {page === 'home' && <HomePage />}
        {page === 'send' && <SendEcho />}
        {page === 'view' && <ViewEcho />}
        {page === 'search' && <SearchEcho />}
      </main>
    </>
  );
}
