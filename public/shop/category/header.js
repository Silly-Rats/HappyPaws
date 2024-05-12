'use strict';

let categoriesHead = document.querySelector('.categoriesHead');
let headCategories = document.querySelector('.headCategories');

async function fetchCategories() {

    let data = await fetch('http://localhost:8080/api/category/info')
        .then(res => res.json());
    data.subCategories.forEach(({id, name}) => {

        let h4 = document.createElement('h4');
        h4.innerText = name;
        h4.classList.add('headCategory');
        h4.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `http://localhost:8000/shop/category/${id}`;
        });
        headCategories.appendChild(h4);
    });
}

fetchCategories();

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
        if (!e.relatedTarget.classList.contains('headCategory')) {
            hide = true;
            list.style.display = 'none';
        }
    });
}
dropDownHeadMenu(categoriesHead, headCategories);

const navAndLogo = document.querySelector('.imgLogo');

navAndLogo.addEventListener('click', () => {
    window.location.href = `http://localhost:8000/shop/category`;
})
