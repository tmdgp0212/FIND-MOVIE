const $searchForm = document.querySelector("main>form");
const $input = $searchForm.querySelector("input");
const $years = $searchForm.querySelector("select");
const $movieContainer = document.querySelector(".movies");
const $movies = $movieContainer.querySelector("ul");
const $err = $movieContainer.querySelector(".err");
const $more = document.querySelector(".more");


// 검색키워드를 저장
const search = {
  keyword : '',
  year: '',
  page: 1
}

let searched = false;

async function getMovies() {
  const s = `&s=${search.keyword}`
  const y = `&y=${search.year}`
  const p = `&page=${search.page}`
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`)
  const json = await res.json()

  if (json.Response === 'True') {
    const { Search: movies, totalResults } = json

    MovieList (movies);
    return search.page
  }

  if (json.Error) {
    if (searched) {

      const topBtn = document.createElement('button');
      $err.appendChild(topBtn);
      topBtn.classList.add('material-symbols-outlined')
      topBtn.classList.add('top')
      topBtn.textContent = "arrow_upward"

      
      topBtn.addEventListener('click',function(e){
        e.preventDefault();

        window.scrollTo({top:0, behavior:"smooth"});
      });

      searched = false;

    } else {

      const pEl = document.createElement('p');
      $err.appendChild(pEl);
      pEl.textContent = "검색결과가 없습니다."
      
      searched = false;
    }
  }
}

async function MovieList (movies) {
  searched = true;

  if(movies) {
    for(const movie of movies) {
      const liEl = document.createElement('li')
      const aEl = document.createElement('a')
      const imgEl = document.createElement('div')
      const infoEl = document.createElement('div')
      const yearEl = document.createElement('span')
      const titleEl = document.createElement('span')
  
      $movies.appendChild(liEl);
      liEl.appendChild(aEl);
      aEl.appendChild(imgEl);
      aEl.appendChild(infoEl);
      infoEl.appendChild(yearEl);
      infoEl.appendChild(titleEl);
  
      aEl.setAttribute('href',`/movie/${movie.imdbID}`)
      imgEl.classList.add('poster');
      imgEl.style.backgroundImage = `url(${movie.Poster === "N/A" ? "/images/no_image.png" : movie.Poster})`;
      infoEl.classList.add('info');
      yearEl.textContent = movie.Year;
      yearEl.classList.add('year');
      titleEl.textContent = movie.Title;
      titleEl.classList.add('title');
    }
  }
}

$searchForm.addEventListener('submit',function(e){
  e.preventDefault();

  search.keyword = $input.value;
  search.year = $years.value === "all" ? "" : $years.value;
  search.page = 1

  $movies.innerHTML = "";
  $err.innerHTML = "";

  getMovies();
});


window.addEventListener('scroll', function(){
  if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight) {
    if (searched) {
      search.page++;
      getMovies();
    }
  }
});

