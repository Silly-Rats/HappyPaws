'use strict';

let infoBody = document.querySelector('.productDesc');
let imgBody = document.querySelector('.productImg');
let alertBtn = document.querySelector('.cartAlert');
let xmark = document.querySelector('.fa-xmark');
let id = 1;

    const getResource = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    async function fetchProductDesc() {
        let url = `http://localhost:8080/api/item/${id}/info`; 
    
        try {
            const data = await getResource(url);
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
        productQty(ip, im, qp);
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



        
        productPrice(select, classObj, h1p);


        weightsOrColors.appendChild(select);
        shortInfo.appendChild(weightsOrColors);
        let btn = document.createElement('button');
        btn.type = 'submit';
        btn.innerHTML = 'Add to cart';
        shortInfo.appendChild(btn);
        cartAlert(btn, h1p, h1, qp);

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

    
function productQty(plus, minus, number) {
    plus.addEventListener('click', () => {
        number.textContent = (+(number.textContent)) + 1;
    })
    minus.addEventListener('click', () => {
        if (number.textContent === '1') {
            return;
        }
        number.innerHTML = (+(number.textContent)) - 1;
    })
}

function productPrice(select, objPrice, field){
    console.log(objPrice);
    select.addEventListener("click", () => {
        const index = select.selectedIndex;
        console.log(index);
        field.textContent = `${objPrice.types[index].price}$`;
    });
}

function cartAlert(btn, price, name, qty){
    console.log(price, name, qty);
    let prdName = document.querySelector('#prdName');
    let orderQty = document.querySelector("#orderQty");
    let orderPrc = document.querySelector('#orderPrc');




    btn.addEventListener('click', () => {
        alertBtn.classList.remove('hide');
        alertBtn.style.display = 'block';
    })
    xmark.addEventListener('click', () => {
        alertBtn.classList.add('hide');
        alertBtn.style.display = 'none';
    })
}

    async function fetchPhotos() {

        let url = `http://localhost:8080/api/item/${id}/images`; 
    
        try {
            const data = await getResource(url);
            renderPhotos(data);
    
        } catch (error) {
            console.error('Error: ', error);
        }

    }

    fetchPhotos();

    let slideIndex = 1;
    let images = [];

    function renderPhotos(classObj){
        let imageSlider = document.createElement('div');
        imageSlider.classList.add('imageSlider');
        
        for (let i = 0; i < classObj.length; i++){
            let img = document.createElement('img');
            img.classList.add('slide');
            img.src = classObj[i].image;
            imageSlider.appendChild(img);
            images.push(img);
        }
        imgBody.appendChild(imageSlider);
        let dotSlider = document.createElement('div');
        dotSlider.classList.add('dotSlider');
        let ip = document.createElement('i');
        ip.classList.add('fa-solid');
        ip.classList.add('fa-angle-left');
        ip.classList.add('arrow');
        ip.classList.add('previous');
        dotSlider.appendChild(ip);
        let dots = [];
        for (let i = 0; i < classObj.length; i++){
            let dot = document.createElement('div');
            dot.classList.add('dot');
            dotSlider.appendChild(dot);
            dots.push(dot);
        }
        let inext = document.createElement('i');
        inext.classList.add('fa-solid');
        inext.classList.add('fa-angle-right');
        inext.classList.add('arrow');
        inext.classList.add('next');
        dotSlider.appendChild(inext);
        imgBody.appendChild(dotSlider);
    
        showSlides(slideIndex, images);

        ip.addEventListener('click', () => {
            plusSlides(-1);
            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });
        inext.addEventListener('click', () => {
            plusSlides(1);
            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        })


    }

    function showSlides(n, classObj){
        if (n > classObj.length){
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = classObj.length;
        }

        classObj.forEach(item => item.style.display = 'none');
        classObj[slideIndex - 1].style.display = 'block';

    }

    function plusSlides(n){
        showSlides(slideIndex += n, images);
    }

   



