/* 메인페이지 */

const mainEl = document.querySelector("main");
const FormEl = document.querySelector("main>form");
const inputEl = FormEl.querySelector("input");
const yearsEl = FormEl.querySelector("select");
const movieContainerEl = document.querySelector(".movies");
const mainLoadingEl = movieContainerEl.querySelector(".loading");
const CounterEl = movieContainerEl.querySelector('h3');
const moviesEl = movieContainerEl.querySelector("ul");
const errEl = movieContainerEl.querySelector(".err");
const selectEl = document.querySelector("form>select");

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

    mainLoadingEl.style.display = "none";

    MovieResult (totalResults);
    MovieList (movies);
  }

  //영화검색이 되지 않았을때
  if (json.Error) {
    mainLoadingEl.style.display = "none";
    
    if (searched) {
      MakeTopBtn(); //검색결과가 노출중일 때 (top버튼 생성)

    } else {
      CounterEl.textContent = "검색결과가 없습니다." //검색결과가 노출중이지 않을 때
    }

    searched = false;
  }
}

// 토탈영화갯수 출력
function MovieResult (totalResults) {
  CounterEl.innerHTML = "";

  const strong = document.createElement('span');
  const text = document.createTextNode('개의 영화가 검색되었습니다');

  strong.textContent = totalResults;
  
  CounterEl.append(strong, text);
}

//받아온 영화 API목록을 html 코드위에 생성
function MovieList (movies) {
  searched = true;

  for(const movie of movies) {
    // 필요한 태그 생성
    const liEl = document.createElement('li')
    const aEl = document.createElement('a')
    const imgEl = document.createElement('div')
    const infoEl = document.createElement('div')
    const yearEl = document.createElement('span')
    const titleEl = document.createElement('span')

    moviesEl.append(liEl);
    liEl.append(aEl);
    aEl.append(imgEl, infoEl);
    infoEl.append(yearEl, titleEl);

    aEl.setAttribute('href','javascript:void(0)')
    imgEl.classList.add('poster');
    imgEl.style.backgroundImage = `url(${movie.Poster === "N/A" ? "/images/no_image.png" : movie.Poster})`;
    infoEl.classList.add('info');
    yearEl.textContent = movie.Year;
    yearEl.classList.add('year');
    titleEl.textContent = movie.Title;
    titleEl.classList.add('title');

    //영화 포스터 클릭 시 디테일 창 팝업
    aEl.addEventListener('click',function(){
      backgroundEl.style.display = 'flex';
      detailLoadingEl.style.display = "block";

      getDetail(movie.imdbID);
    });
  }
}

function MakeTopBtn() {
  const topBtn = document.createElement('button');
  errEl.append(topBtn);
  topBtn.classList.add('material-symbols-outlined')
  topBtn.classList.add('top')
  topBtn.textContent = "arrow_upward"
  
  topBtn.addEventListener('click',function(e){
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
  });
}

// 영화검색 submit
FormEl.addEventListener('submit',function(e){
  e.preventDefault();

  if(inputEl.value.length < 3) {
    alert("최소 3글자 이상의 영문검색어를 입력해주세요")
    return
  }

  // 검색정보 저장
  search.keyword = inputEl.value;
  search.year = yearsEl.value === "all" ? "" : yearsEl.value;
  search.page = 1

  // 검색목록 초기화
  moviesEl.innerHTML = "";
  CounterEl.innerHTML = "";
  errEl.innerHTML = "";
  searched = false;

  mainEl.style.height = "70vh";
  mainLoadingEl.style.display = "block";

  getMovies();
});


//무한스크롤 구현
window.addEventListener('scroll', function(){
  if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight) {
    if (searched) {
      search.page++;
      mainLoadingEl.style.display = "block";
      
      getMovies();
    }
  }
});

// 년도선택 select창 옵션 채우기
for (let i = 0; i <= 35; i++) {
  const year = new Date().getFullYear() - i 

  const option = document.createElement('option');
  option.setAttribute('value', year);
  option.textContent = year;

  selectEl.append(option);
}


/* 상세페이지 */

const backgroundEl = document.querySelector('aside');
const posterEl = backgroundEl.querySelector('.poster');
const titleEl = backgroundEl.querySelector('.info>h2');
const ratedEl = backgroundEl.querySelector('.info>.flex-box>.rated');
const releasedEl = backgroundEl.querySelector('.info>.flex-box>.released');
const genreEl = backgroundEl.querySelector('.info>.genre');
const runTimeEl = backgroundEl.querySelector('.info>.run-time');
const plotEl = backgroundEl.querySelector('.info>p');
const directorEl = backgroundEl.querySelector('.info>.director');
const writerEl = backgroundEl.querySelector('.info>.writer');
const actorsEl = backgroundEl.querySelector('.info>.actors');
const detailLoadingEl = backgroundEl.querySelector('.loading');

// 상세페이지 생성
async function getDetail(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=7035c60c&i=${id}`);
  const json = await res.json()

  if (json.Response === 'True') {
    const movie = json

    detailLoadingEl.style.display = "none";
    setDetail(movie);
  }

  json.Error
}

async function setDetail(movie) {
  // 상세페이지 내용출력
  posterEl.style.backgroundImage = `url(${movie.Poster})`
  titleEl.textContent = movie.Title;
  ratedEl.textContent = `⭐ ${movie.imdbRating}`
  releasedEl.textContent = movie.Released;
  genreEl.textContent = `💃 ${movie.Genre}`;
  runTimeEl.textContent = `⏰ ${movie.Runtime}`;
  directorEl.innerHTML = `<span>Director</span> ${movie.Director}`
  writerEl.innerHTML = `<span>Writer</span> ${movie.Writer}`
  actorsEl.innerHTML = `<span>Actors</span> ${movie.Actors}`
  plotEl.textContent = movie.Plot;
}

function resetDetail () {
  // 상세페이지 내용초기화   
  posterEl.style.backgroundImage = `url(/images/no_image.png)`
  titleEl.textContent = '';   
  ratedEl.textContent = '';
  releasedEl.textContent = '';
  genreEl.textContent = '';
  runTimeEl.textContent = '';
  directorEl.textContent = '';
  writerEl.textContent = '';
  actorsEl.textContent = '';
  plotEl.textContent = '';
}

//상세페이지 닫기
backgroundEl.addEventListener('click',function(e){
  if(e.target === e.currentTarget){
    backgroundEl.style.display = 'none';
    resetDetail();
  }
});


