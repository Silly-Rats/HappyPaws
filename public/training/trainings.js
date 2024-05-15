/*const trainersInfo = document.querySelector('#trainers-info');

fetch('http://localhost:8080/api/user/worker/trainer')
    .then(res => res.json())
    .then(res => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            let selection = document.createElement('div');
            if (i % 2 === 0) {
                console.log(res[i]);
                selection.classList.add('profile-section1');

                let profileImage = document.createElement('div');
                profileImage.classList.add('profile-image1');
                let img = document.createElement('img');
                img.src = 'images/trainer1.png';
                profileImage.appendChild(img);
                selection.appendChild(profileImage);

                let details = document.createElement('div');
                details.classList.add('profile-details1');

                let nameAndRating = document.createElement('div');
                nameAndRating.classList.add('name-and-rating');
                let h5 = document.createElement('h5');
                h5.textContent = res[i].firstName + ' ' + res[i].lastName;
                'Experience: ' + res[i].experience + ' years';

                let rating = res[i].rating;
                for (let j = 0; j < 5; j++) {
                    img = document.createElement('img');
                    if (j < rating) {

                    } else {

                    }
                }
                nameAndRating.appendChild(h5);
                details.appendChild(nameAndRating);

                selection.appendChild(details);
            } else {
               console.log(res[i]);
                selection.classList.add('profile-section2');

                let profileImage = document.createElement('div');
                profileImage.classList.add('profile-image2');
                let img = document.createElement('img');
                img.src = 'images/trainer2.png';
                profileImage.appendChild(img);
                selection.appendChild(profileImage);
            }

            trainersInfo.appendChild(selection);
        }
    });*/