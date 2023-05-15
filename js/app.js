let imageContainer = document.querySelector('.images');
let loadMoreBtn = document.querySelector('.load-more');
let searchInput = document.querySelector('#searchInput');
let lightBox = document.querySelector('.light-box');
let closeLightBoxBtn = lightBox.querySelector('#close-btn');
let downloadImageBtn = document.querySelector('#download-btn');

const apiKey = 'M9tfeZzg3a0enIQWPLfODLj29yyxj0y2Kl30K3D5xaoTANIyGU8DJY87';
let perPage = 15;
let currentPage = 1;
let searchValue = '';

let generatePhoto = (images) => {
    imageContainer.innerHTML += images.map(img =>
        ` <li class="card">
            <img onclick="showLightBox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="${img.src.alt}">
            <div class="details">
                <div class="photographer">
                    <i class="fa-camera fa-solid"></i>
                    <span>${img.photographer}</span>
                </div>
                <button type="button" onclick="downloadImage('${img.src.large2x}')"><i class="fa-solid fa-download"></i></button>
            </div>
        </li>`
    ).join('');
}

let getImages = (apiUrl) => {
    loadMoreBtn.innerHTML = 'Loading...';
    loadMoreBtn.classList.add('disabled');
    fetch(apiUrl, {
        headers: {
            Authorization: apiKey
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        generatePhoto(data.photos);
        loadMoreBtn.innerHTML = 'Load More';
        loadMoreBtn.classList.remove('disabled');
    }).catch(() => {
        alert('Failed to load image');
    })
}

let loadMoreImage = () => {
    currentPage++;
    let query = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    query = searchValue ? `https://api.pexels.com/v1/search?query=${searchValue}&page=${currentPage}&per_page=${perPage}` : query;
    getImages(query);
}

let searchImage = (e) => {
    if (e.target.value === '') {
        window.location.reload();
    }
    if (e.key === 'Enter') {
        currentPage = 1;
        searchValue = e.target.value;
        imageContainer.innerHTML = '';
        let query = `https://api.pexels.com/v1/search?query=${searchValue}&page=${currentPage}&per_page=${perPage}`;
        getImages(query);
    }
}

let downloadImage = (imageUrl) => {
    fetch(imageUrl).then(res => {
        return res.blob()
    }).then(file => {
        let link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = new Date().getTime();
        link.click();
    }).catch(() => {
        alert('Failed to download image');
    })
}

let showLightBox = (name, img) => {
    lightBox.classList.add('active');
    lightBox.querySelector('img').src = img;
    lightBox.querySelector('span').textContent = name;
    downloadImageBtn.setAttribute('data-image', img);
}

let closeLightBox = () => {
    lightBox.classList.remove('active');
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
closeLightBoxBtn.addEventListener('click', closeLightBox);
loadMoreBtn.addEventListener('click', loadMoreImage);
searchInput.addEventListener('keyup', searchImage);
downloadImageBtn.addEventListener('click', (e) => downloadImage(e.target.dataset.image));