document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const toggleSearchTypeBtn = document.getElementById('toggleSearchType');
  const resultsContainer = document.getElementById('resultsContainer');

  let searchType = 'user'; // Default search type

  searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value;

      if (searchTerm.trim() === '') {
          alert('Please enter a username');
          return;
      }

      let apiUrl = '';

      if (searchType === 'user') {
          apiUrl = 'https://api.github.com/search/users?q=' + searchTerm;
      } else {
          apiUrl = 'https://api.github.com/search/repositories?q=' + searchTerm;
      }

      fetch(apiUrl, {
          headers: {
              'Accept': 'application/vnd.github.v3+json'
          }
      })
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          displayResults(data.items);
      })
      .catch(function (error) {
          console.error('Error fetching data:', error);
      });
  });

  toggleSearchTypeBtn.addEventListener('click', function () {
      if (searchType === 'user') {
          searchType = 'repo';
          toggleSearchTypeBtn.textContent = 'Search Repositories';
      } else {
          searchType = 'user';
          toggleSearchTypeBtn.textContent = 'Search Users';
      }
  });

  function displayResults(results) {
      resultsContainer.innerHTML = '';

      for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const card = document.createElement('div');
          card.classList.add('userCard');

          if (searchType === 'user') {
              card.innerHTML = '<img src="' + result.avatar_url + '" alt="' + result.login + '" width="100">' +
                  '<h3>' + result.login + '</h3>' +
                  '<a href="' + result.html_url + '" target="_blank">View Profile</a>';
          } else {
              card.innerHTML = '<h3>' + result.full_name + '</h3>' +
                  '<p>' + result.description + '</p>' +
                  '<a href="' + result.html_url + '" target="_blank">View Repository</a>';
          }

          resultsContainer.appendChild(card);
      }
  }
});
