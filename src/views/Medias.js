import React, { useState } from "react";
import { getMedias } from "../routes/mediaRoutes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaTimes,
  FaArrowDown,
  FaCompass,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = ["All", "Mysteries", "Culture", "Life", "Science"];

const Medias = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: medias = [], isLoading, error, refetch } = useQuery({
    queryKey: ["medias"],
    queryFn: async () => {
      const res = await getMedias();
      return res.data;
    },
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setVisibleCount(12);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setVisibleCount(12);
  };

  if (isLoading) {
    return (
      <div className="mediasContainer">
        <div className="heroSection skeletonHero">
          <div className="skeletonHeroPill"></div>
          <div className="skeletonHeroTitle"></div>
          <div className="skeletonHeroSubtitle"></div>
          <div className="skeletonSearchBar"></div>
        </div>
        <div className="mediaGrid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="skeletonCard" key={i}>
              <div className="skeletonImage"></div>
              <div className="skeletonContent">
                <div className="skeletonTitle"></div>
                <div className="skeletonText"></div>
                <div className="skeletonText short"></div>
                <div className="skeletonMeta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mediasContainer">
        <div className="errorContainer">
          <h2>Error loading stories</h2>
          <p>Please check your connection and try again.</p>
          <button onClick={() => refetch()} className="btnRetry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter stories based on search and category pills
  const filteredMedias = medias.filter((media) => {
    const query = searchQuery.trim().toLowerCase();
    const title = (media.title || "").toLowerCase();
    const content = (media.content || "").toLowerCase();
    const author = (media.author || "").toLowerCase();

    const matchesSearch =
      !query || title.includes(query) || content.includes(query) || author.includes(query);

    if (!matchesSearch) return false;

    if (selectedCategory === "All") return true;

    const fullText = `${title} ${content}`;
    if (selectedCategory === "Mysteries") {
      return (
        fullText.includes("mystery") ||
        fullText.includes("mysteries") ||
        fullText.includes("ancient") ||
        fullText.includes("strange") ||
        fullText.includes("unsolved") ||
        fullText.includes("secret") ||
        fullText.includes("legend")
      );
    }
    if (selectedCategory === "Culture") {
      return (
        fullText.includes("culture") ||
        fullText.includes("art") ||
        fullText.includes("history") ||
        fullText.includes("music") ||
        fullText.includes("book") ||
        fullText.includes("travel") ||
        fullText.includes("society")
      );
    }
    if (selectedCategory === "Life") {
      return (
        fullText.includes("life") ||
        fullText.includes("mind") ||
        fullText.includes("story") ||
        fullText.includes("people") ||
        fullText.includes("growth") ||
        fullText.includes("journey") ||
        fullText.includes("thought")
      );
    }
    if (selectedCategory === "Science") {
      return (
        fullText.includes("science") ||
        fullText.includes("space") ||
        fullText.includes("universe") ||
        fullText.includes("physics") ||
        fullText.includes("nature") ||
        fullText.includes("earth") ||
        fullText.includes("planet")
      );
    }

    return true;
  });

  const displayedMedias = filteredMedias.slice(0, visibleCount);

  return (
    <div className="mediasContainer">
      <section className="heroSection">
        <div className="heroBadge">
          <FaCompass className="heroBadgeIcon" />
          <span>Explore Perspectives & Chronicles</span>
        </div>
        <h1 className="heroTitle">
          Strange Stories. Ancient Mysteries. <span className="highlightText">Unanswered Questions.</span>
        </h1>
        <p className="heroSubtitle">
          Discover hand-crafted stories, curious anomalies, and fresh ideas published by
          curious minds across the globe.
        </p>

        {/* Search Bar */}
        <div className="heroSearchContainer">
          <div className="searchBarWrapper">
            <FaSearch className="searchIcon" />
            <input
              type="text"
              placeholder="Search stories, topics, or authors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="searchInput"
            />
            {searchQuery && (
              <button
                className="btnClearSearch"
                onClick={clearSearch}
                title="Clear search"
                aria-label="Clear search query"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="filterPillsContainer">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filterPill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="storiesHeaderBar">
        <div className="feedTitleWrapper">
          <h2 className="feedTitle">
            {selectedCategory === "All" ? "All Stories" : `${selectedCategory} Stories`}
          </h2>
          <span className="feedCount">({filteredMedias.length})</span>
        </div>

        {user && (
          <Link to="/add_media" className="btnFeedAdd">
            + New Story
          </Link>
        )}
      </div>

      {filteredMedias.length >= 1 ? (
        <>
          <div className="mediaGrid">
            {displayedMedias.map((media) => {
              const mediaDate = new Date(media.date);
              const dateOptions = { day: "numeric", month: "short", year: "numeric" };
              const formattedMediaDate = mediaDate.toLocaleDateString("en-US", dateOptions);

              return (
                <article className="mediaCard" key={media._id}>
                  <Link to={`/medias/${media._id}`} className="cardLink">
                    <div className="cardImageWrapper">
                      <img
                        src={media.imageUrl}
                        alt={media.title}
                        className="cardImage"
                        loading="lazy"
                      />
                    </div>
                    <div className="cardBody">
                      <h3 className="cardTitle">
                        {media.title.length >= 40
                          ? media.title.slice(0, 40) + "..."
                          : media.title}
                      </h3>
                      <p className="cardExcerpt">
                        {media.content.length >= 85
                          ? media.content.slice(0, 85) + "..."
                          : media.content}
                      </p>
                      <div className="cardFooter">
                        <span className="cardAuthor">
                          <FaUser size={12} className="metaIcon" />
                          {media.author}
                        </span>
                        <span className="cardDate">
                          <FaCalendarAlt size={12} className="metaIcon" />
                          {formattedMediaDate}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* ── Load More Functionality ────────────────────────── */}
          {visibleCount < filteredMedias.length ? (
            <div className="loadMoreContainer">
              <button
                className="btnLoadMore"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                <FaArrowDown size={12} style={{ marginRight: 8 }} />
                Load More Stories ({filteredMedias.length - visibleCount} more)
              </button>
              <p className="loadMoreCounter">
                Showing {displayedMedias.length} of {filteredMedias.length} stories
              </p>
            </div>
          ) : (
            <div className="allLoadedNotice">
              <p>✓ You've viewed all {filteredMedias.length} stories</p>
            </div>
          )}
        </>
      ) : (
        <div className="noBlogs">
          {searchQuery || selectedCategory !== "All" ? (
            <>
              <h3>No matching stories found</h3>
              <p>Try searching for a different keyword or select another topic.</p>
              <button
                className="btnResetFilter"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setVisibleCount(12);
                }}
              >
                Reset Search & Filters
              </button>
            </>
          ) : (
            <>
              <h3>No stories to display yet</h3>
              <p>Be the first to share a story on BlogBase.</p>
              {user ? (
                <Link to="/add_media" className="btnAddFirst">
                  Create a Blog Post
                </Link>
              ) : (
                <Link to="/login" className="btnAddFirst">
                  Sign In to Post
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Medias;
