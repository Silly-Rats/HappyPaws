'use strict';

let prev = document.querySelector('.previous');
let next = document.querySelector('.next');
let slides = document.querySelectorAll('.slide');
let slideIndex = 1;
let dots = document.querySelectorAll('.dot');
let infoBody = document.querySelector('.productDesc');

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


    const getResource = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    async function fetchProductDesc() {
        let url = `http://localhost:8080/api/item/1/info`; 
    
        try {
            const data = await getResource(url);
            console.log(data);
            infoBody.appendChild(renderInfo(data));
            renderDesc(data);
        } catch (error) {
            console.error('Error: ', error);
        }

    }

    fetchProductDesc();

    function renderInfo(classObj) {
        let info = document.createElement('div');
        info.classList.add('info');
        let shortInfo = document.createElement('div');
        shortInfo.classList.add('shortInfo');
        let h1 = document.createElement('h1');
        h1.innerHTML = classObj.name;
        shortInfo.appendChild(h1);
        let priceQua = document.createElement('div');
        priceQua.classList.add('priceQua');
        let h1p = document.createElement('h1');
        h1p.innerHTML = `${classObj.types[0].price}$`;
        priceQua.appendChild(h1p);
        let quantity = document.createElement('div');
        quantity.classList.add('quantity');
        let ip = document.createElement('i');
        ip.classList.add('fa-solid');
        ip.classList.add('fa-plus');
        quantity.appendChild(ip);
        let qp = document.createElement('p');
        qp.innerHTML = '1';
        quantity.appendChild(qp);
        let im = document.createElement('i');
        im.classList.add('fa-solid');
        im.classList.add('fa-minus');
        quantity.appendChild(im);
        shortInfo.appendChild(priceQua);
        priceQua.appendChild(quantity);

        let weightsOrColors = document.createElement('div');
        weightsOrColors.classList.add('weightsOrColors');
        let select = document.createElement('select');
        for (let i = 0; i < classObj.types.length; i++){
            let option = document.createElement('option')
            option.innerHTML = classObj.types[i].name;
            select.appendChild(option);
        }
        weightsOrColors.appendChild(select);
        shortInfo.appendChild(weightsOrColors);
        let btn = document.createElement('button');
        btn.type = 'submit';
        btn.innerHTML = 'Add to cart';
        shortInfo.appendChild(btn);

        let specifications = document.createElement('div');
        specifications.classList.add('specifications');
        let h2 = document.createElement('h2');
        h2.textContent = 'Description and specifications';
        let table = document.createElement('table');
        for (let i = 0; i < classObj.attributes.length; i++){
            let tr = document.createElement('tr')
            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            th1.innerHTML = classObj.attributes[i].attribute;
            th2.innerHTML = classObj.attributes[i].value;
            tr.appendChild(th1);
            tr.appendChild(th2);
            table.appendChild(tr);
        }
        specifications.appendChild(h2);
        specifications.appendChild(table);
        info.appendChild(shortInfo);
        info.appendChild(specifications);
        
        return info;
    }

    function renderDesc(classObj){
        let detailDesc = document.createElement('div');
        detailDesc.classList.add('detailDesc');
        detailDesc.innerHTML = classObj.description;
        infoBody.appendChild(detailDesc);
    }

