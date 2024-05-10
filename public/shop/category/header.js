'use strict';

let categoriesHead = document.querySelector('.categoriesHead');
let headCategories = document.querySelector('.headCategories');

function dropDownHeadMenu(element, list) {
    let hide = true;

    element.addEventListener('mouseover', () => {
        list.style.display = 'flex';
    });
    element.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (hide) {
                list.style.display = 'none';
            }
        }, 300);
    });

    list.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        hide = false;
    });
    list.addEventListener('mouseout', (e) => {
        e.stopPropagation();
        if (!e.relatedTarget.classList.contains('category')) {
            hide = true;
            list.style.display = 'none';
        }
    });
}

dropDownHeadMenu(categoriesHead, headCategories);