// header를 페이지 아래로 스크롤시 스타일링 적용
const header = document.querySelector('.header')
// 요소의 총 높이
const headerHeight = header.offsetHeight
// console.log(headerHeight)
document.addEventListener('scroll', ()=>{
    if(window.scrollY>headerHeight){
        console.log(window.scrollY)
        header.classList.add('header--dark')
    }else{
        header.classList.remove('header--dark')
    }
})

//Home 섹션을 아래로 스크롤시 투명하게 처리함
const home = document.querySelector('.home__container')
const homeHeight = home.offsetHeight
document.addEventListener('scroll',() => {
    home.style.opacity = 1 - window.scrollY / homeHeight
})

// Arrow up 버튼을 아래로 스크롤시 투명하게 처리함
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll', ()=>{
    if(window.scrollY > homeHeight / 2){
        arrowUp.style.opacity = 1
    }else{
        arrowUp.style.opacity = 0
    }
})

// navbar 토글버튼 클릭 처리
const navbarMenu = document.querySelector('.header__menu')
const navbarToggle = document.querySelector('.header__toggle')
navbarToggle.addEventListener('click',() => {
    navbarMenu.classList.toggle('open')
})

// Navbar 메뉴 클릭시 메뉴를 자동으로 닫아줌
navbarMenu.addEventListener('click',()=>{
    navbarMenu.classList.remove('open')
})

// 주요 섹션 ID 배열
const sectionIds = ["home", "about", "skills", "work", "license", "contact"];
let currentSectionIndex = 0;
let isScrolling = false; // 현재 스크롤 중인지 확인하는 변수

// 네비게이션 아이템 요소 가져오기
const navItems = document.querySelectorAll(".header__menu__item");

// 부드러운 스크롤 애니메이션 함수
function smoothScrollTo(targetPosition) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 600; // 스크롤 애니메이션 시간 (밀리초)
    let startTime = null;

    function animationScroll(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animationScroll);
        } else {
            isScrolling = false; // 스크롤 완료 후 다시 스크롤 가능하도록
        }
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}

// 네비게이션 포커스 업데이트 함수
function updateNavFocus(index) {
    navItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add("active"); // 포커스 클래스 추가
        } else {
            item.classList.remove("active"); // 다른 항목은 포커스 해제
        }
    });
}

// 네비게이션 아이템 클릭 이벤트 추가
navItems.forEach((item, index) => {
    item.addEventListener("click", (event) => {
        event.preventDefault(); // 기본 클릭 동작 막기
        currentSectionIndex = index; // 현재 인덱스를 클릭한 메뉴의 인덱스로 업데이트
        const targetPosition = document.getElementById(sectionIds[index]).offsetTop;
        smoothScrollTo(targetPosition); // 해당 섹션으로 부드럽게 스크롤
        updateNavFocus(currentSectionIndex); // 클릭한 메뉴에 포커스 업데이트
    });
});

// 휠 이벤트 리스너 추가
window.addEventListener("wheel", (event) => {
    if (isScrolling) return;

    if (event.deltaY > 0) {
        if (currentSectionIndex < sectionIds.length - 1) {
            currentSectionIndex++;
            const targetPosition = document.getElementById(sectionIds[currentSectionIndex]).offsetTop;
            smoothScrollTo(targetPosition);
            isScrolling = true;
        }
    } else {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            const targetPosition = document.getElementById(sectionIds[currentSectionIndex]).offsetTop;
            smoothScrollTo(targetPosition);
            isScrolling = true;
        }
    }
    updateNavFocus(currentSectionIndex); // 스크롤할 때 네비게이션 포커스 업데이트
});

// 사용자가 직접 스크롤할 때 현재 섹션 위치 업데이트
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            currentSectionIndex = sectionIds.indexOf(entry.target.id);
            updateNavFocus(currentSectionIndex); // 관찰 중 네비게이션 포커스 업데이트
        }
    });
}, { threshold: 0.5 });

// 각 주요 섹션에 대해 관찰 시작
sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
});

