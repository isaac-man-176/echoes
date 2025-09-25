import React, { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track scroll to hide "scroll down" prompt
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Title Section */}
      <section className="title-section">
  {/* Ripples at multiple positions */}
  <span className="ripple" style={{ top: "20%", left: "30%", animationDelay: "0s" }}></span>
  <span className="ripple" style={{ top: "70%", left: "50%", animationDelay: "1.5s" }}></span>
  <span className="ripple" style={{ top: "40%", left: "80%", animationDelay: "3s" }}></span>
  <span className="ripple" style={{ top: "60%", left: "20%", animationDelay: "4.5s" }}></span>
  <span className="ripple" style={{ top: "50%", left: "70%", animationDelay: "6s" }}></span>

  <div className="title-text">
    <span className="welcome-text">Welcome to</span>
    <span className="echoes-text">Echoes</span>
  </div>

  {/* Scroll Down Prompt */}
  <div className={`scroll-down ${scrolled ? "hidden" : ""}`}>
    Scroll down to learn more
  </div>
</section>


      {/* Content Section */}
      <section className="content-section">
        <h2>The Story Behind Echoes</h2>
        <p>
          Echoes was born out of my own experience as a first-year university student,
          standing at the crossroads of my future. Over the past few years, I’ve had to
          make countless decisions about my path in life—what to study, what to pursue,
          and who I want to become. I noticed that most of the advice we get comes from
          guest speakers, TED talkers, or professionals who are already at the peak of
          their careers. While inspiring, their journeys don’t always feel relatable.
          They represent the most accomplished people in society, not the messy, uncertain,
          in-progress stories most of us are living right now.
        </p>

        <h3>What is Echoes</h3>
        <p>
          Echoes is a place for everyone to share their life experiences, not just the
          “success stories”. Each person’s story is called an Echo, and anyone can browse
          echoes from around the world, find inspiration, and see that they’re not alone
          in their challenges and decisions. Using AI, users can even search for echoes
          similar to their own, creating meaningful connections with people who have walked
          similar paths. Think of it as a blend between anonymous blogging and the kind of
          deep, honest conversation you’d have over coffee with someone who’s been where you are.
        </p>

        <h3>Why It Matters</h3>
        <p>
          University is often a confusing time filled with both excitement and uncertainty.
          People around you seem to have everything figured out, which can make it feel like
          you’re falling behind. Echoes exists to normalize that uncertainty and give students
          and young adults a platform to share their experiences without judgment. By seeing
          the struggles and growth of others, you gain insight, empathy, and reassurance that
          your journey, with all its twists and turns, is completely valid.
        </p>

        <h3>How It Works</h3>
        <p>
          Users can submit their own Echo anonymously or under a chosen name. Each Echo consists
          of a title, author, and content describing a life experience, challenge, or lesson.
          Other users can read, search, and explore echoes based on themes or keywords. AI
          recommendation tools help match readers with echoes most relevant to their own experiences,
          making the platform feel personal and meaningful.
        </p>

        <h3>Join the Community</h3>
        <p>
          Everyone has a story worth sharing. Echoes is for students, young professionals,
          and anyone navigating the messy, complicated path of life. Whether you’re looking
          for advice, solidarity, or inspiration, Echoes provides a safe, empathetic space
          to learn from the journeys of others. Join today, share your story, and see how
          your experiences resonate with people just like you.
        </p>
      </section>
      <footer className="page-footer">
        © {new Date().getFullYear()} Echoes. Built by a freshman with a vision.
      </footer>
    </div>
    
  );
}
