const $searchForm = document.querySelector("main>form");
const $input = $searchForm.querySelector("input");
const $years = $searchForm.querySelector("select");
const $movieContainer = document.querySelector(".movies");
const $movieCounter = $movieContainer.querySelector('h3');
const $movies = $movieContainer.querySelector("ul");
const $err = $movieContainer.querySelector(".err");
const $more = document.querySelector(".more");
const $select = document.querySelector("form>select");

let movieID = '';
export default movieID;

// 검색키워드를 저장
const search = {
  keyword : '',
  year: '',
  page: 1
}

//검색내용이 출력되어있는 상태를 관리
let searched = false;

//영화 API를 받아오는 함수
async function getMovies() {
  const s = `&s=${search.keyword}`
  const y = `&y=${search.year}`
  const p = `&page=${search.page}`
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`)
  const json = await res.json()

  //API response가 있는 경우 받아온 API를 받아서 출력
  if (json.Response === 'True') {
    const { Search: movies, totalResults } = json;

    $movieCounter.innerHTML = "";
    const strong = document.createElement('span');
    const text = document.createTextNode('개의 영화가 검색되었습니다');
    $movieCounter.appendChild(strong);
    strong.textContent = totalResults;
    
    $movieCounter.appendChild(strong);
    $movieCounter.appendChild(text);
    
    MovieList (movies);
  }

  //영화검색이 되지 않았을때
  if (json.Error) {
    if (searched) {
      //검색결과가 노출중일 때 (top버튼 생성)
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
      //검색결과가 노출중이지 않을 때
      const pEl = document.createElement('p');
      $err.appendChild(pEl);
      pEl.textContent = "검색결과가 없습니다."
      
      searched = false;
    }
  }
}

//받아온 영화 API목록을 html 코드위에 생성
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
  
      aEl.setAttribute('href','javascript:void(0)')
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

// 영화검색 submit
$searchForm.addEventListener('submit',function(e){
  e.preventDefault();

  // 검색정보 저장
  search.keyword = $input.value;
  search.year = $years.value === "all" ? "" : $years.value;
  search.page = 1

  // 검색목록 초기화
  $movies.innerHTML = "";
  $err.innerHTML = "";

  getMovies();
});


//무한스크롤 구현
window.addEventListener('scroll', function(){
  if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight) {
    if (searched) {
      search.page++;
      getMovies();
    }
  }
});

for (let i = 0; i <= 35; i++) {
  const year = new Date().getFullYear() - i 

  const option = document.createElement('option');
  option.setAttribute('value', year);
  option.textContent = year;

  $select.appendChild(option);
}