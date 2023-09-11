$(function() {
    $("#searchButton").on('click', function() {
      const query = $("#searchInput").val();
      const searchUrl = `/search/results?q=${query}`;
      window.location.replace(searchUrl);
    });
  });
