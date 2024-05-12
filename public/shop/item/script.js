'use strict';

let prev = document.querySelector('.previous');
let next = document.querySelector('.next');
let slides = document.querySelectorAll('.slide');
let slideIndex = 1;
let dots = document.querySelectorAll('.dot');

showSlides(slideIndex);

    function showSlides(n){
        if (n > slides.length){
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => item.style.display = 'none');
        slides[slideIndex - 1].style.display = 'block';

    }

    function plusSlides(n){
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', () => {
        plusSlides(-1);
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });
    next.addEventListener('click', () => {
        plusSlides(1);
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    })