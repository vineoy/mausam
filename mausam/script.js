const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    locationBtn = inputPart.querySelector("button"),
    arrowBack = wrapper.querySelector("header i"),
    wIcon = document.querySelector(".weather-part img");
inputField = inputPart.querySelector("input");


let api;


inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your browser does not supports geolocation API");
    }
})

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=4af87b617d7ce949614337569e0972c9`;
    fetchData();
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=4af87b617d7ce949614337569e0972c9`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting weather summary..."
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}


function weatherDetails(info) {
    infoTxt.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "icons/clear.png";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.png";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.png";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.png";
        } else if (id >= 801 && id <= 8040) {
            wIcon.src = "icons/cloud.png";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "icons/rain.png";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;



        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);

    }

}
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});