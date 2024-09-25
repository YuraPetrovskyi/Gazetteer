// script.js

import { fetchCountryData } from './countryData.js';
import { getCountryBorders } from './getCountryBorders.js';
import { getCountryBordersTwo } from './getCountryBordersTwo.js';

import { loadCountryList } from './loadCountries.js';

import { getCountryDetails } from './getCountryDetails.js';
import { loadAllCountryBorders } from './loadAllCountryBorders.js'; // Імпорт нової функції
import { getCountryCities } from './getCountryCities.js';

// Ініціалізація Leaflet карти
// var map = L.map('map').setView([50, 30], 6);  // Центр на світі, масштаб 2
var map = L.map('map').fitWorld();  // Автоматично масштабувати карту на весь світ

// Приклад: додавання маркеру для вибраної країни
var markerRef = { current: null };
var countryBorderLayerRef = { current: null }; // Для відстеження шару кордонів 


// **************************************************** слої карт **************************************

// Визначення базових шарів
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);  // Додаємо за замовчуванням

var satellite = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>.'
});

// Інший варіант Satellite з Esri
// var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//     maxZoom: 19,
//     attribution: 'Tiles &copy; Esri'
// });
var satelliteTwo = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);

// Групування базових шарів
var baseMaps = {
    "Streets": streets,
    "Satellite": satellite,
    "SatelliteTwo": satelliteTwo
};

// Додавання контролю шарів на карту
L.control.layers(baseMaps).addTo(map);

// **************************************************** Функції для навігаційної панелі **************************************
function toggleCountrySearch() {
    const button = document.getElementById('selectCountryButton');
    const countrySelectContainer = document.getElementById('countrySelectContainer');
    
    if (button.classList.contains('d-none')) {
      // Повертаємо кнопку "Select Country" і приховуємо список країн
        button.classList.remove('d-none');
        countrySelectContainer.classList.add('d-none');
    } else {
      // Приховуємо кнопку і показуємо список країн
        button.classList.add('d-none');
        countrySelectContainer.classList.remove('d-none');
    }
}
// Додаємо обробники подій для кнопки вибору і кнопки закриття
document.getElementById('selectCountryButton').addEventListener('click', toggleCountrySearch);
document.getElementById('closeCountrySelect').addEventListener('click', toggleCountrySearch);

// Обробник для вибору країни зі списку
document.getElementById('countrySelect').addEventListener('change', function() {
    const countryName = this.options[this.selectedIndex].text;
    document.getElementById('currentCountry').textContent = countryName;
    toggleCountrySearch();
});

// Пошук по введеному значенню у списку країн
document.getElementById('countrySearchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const options = document.querySelectorAll('#countrySelect option');

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(filter)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
});

// Оновлюємо відображення країни і зберігаємо ISO-код у атрибуті data-country-iso
document.getElementById('countrySelect').addEventListener('change', function() {
    const countryName = this.options[this.selectedIndex].text;
    const isoCode = this.value;
    console.log(countryName, '---', isoCode);

    const currentCountryElement = document.getElementById('currentCountry');
    currentCountryElement.textContent = countryName; // Відображаємо назву країни
    currentCountryElement.setAttribute('data-country-iso', isoCode); // Зберігаємо ISO-код
    
    // Тепер можна робити запити для відображення даних і кордонів вибраної країни
    fetchCountryData(countryName, isoCode, map, markerRef);
    // getCountryBorders(isoCode, map, countryBorderLayerRef);
    getCountryBordersTwo(isoCode, map, countryBorderLayerRef);

});

// Доступ до ISO-коду в подальшому
const countryISO = document.getElementById('currentCountry').getAttribute('data-country-iso');
console.log('ISO код вибраної країни:', countryISO);

// **************************************************** геолокація користувача **************************************
// Функція для роботи з геолокацією користувача
map.locate({
    setView: true,
    maxZoom: 16,
    watch: false, // Уникаємо оновлення координат постійно
    enableHighAccuracy: true
});

map.on('locationfound', function(e) {
    console.log("Location found: ", e.latlng);
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;
    console.log('start getCountryByCoordinates.php:');

    // Використаємо Reverse Geocoding для отримання країни користувача
    // `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}
    fetch(`php/getCountryByCoordinates.php?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            console.log('Country data from getCountryByCoordinates.php:', data);
            const userCountry = data.address.country;
            const userCountryISO = data.address.country_code.toUpperCase();
            console.log(`Ваша країна: ${userCountry} (${userCountryISO})`);

            // Відображаємо країну користувача в новому контейнері навігаційної панелі
            document.getElementById('currentCountry').textContent = `${userCountry}`;
            document.getElementById('currentCountry').setAttribute('data-country-iso', userCountryISO); // Зберігаємо ISO-код
            // Виконуємо запити для відображення даних і кордонів країни
            // fetchCountryData(userCountry, userCountryISO, map, countryBorderLayerRef);
            // getCountryBorders(userCountryISO, map, countryBorderLayerRef);
        })
        .catch(error => {
            console.error('Error fetching country by coordinates:', error);
        });

    // Додаємо маркер на мапу для місцезнаходження
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are here")
        .openPopup();
});

map.on('locationerror', function(e) {
    // alert(e.message);
});

// **************************************************** Робота з DOM **************************************

document.addEventListener("DOMContentLoaded", function() {
    // Викликаємо функцію для заповнення випадаючого списку країн
    console.log("before loadCountryList()");
    loadCountryList();
    
});

// **************************************************** дадавання модалки Info  **************************************

// Додаємо кнопку на карту для виклику модального вікна
L.easyButton('fa-info fa-xl', function() {
    // Викликаємо функцію Bootstrap для відкриття модального вікна
    const countryModal = new bootstrap.Modal(document.getElementById('countryModal'));
    countryModal.show();
}).addTo(map);

// Викликаємо функцію при натисканні на кнопку
document.querySelector('.easy-button-button').addEventListener('click', function() {
    // const countryName = document.getElementById('currentCountry').options[document.getElementById('countrySelect').selectedIndex].text;
    const countryName = document.getElementById('currentCountry').textContent;
    console.log('you choose country: ', countryName);    
    getCountryDetails(countryName);
});

// **************************************************** відображення кордонів країн **************************************
// var countryBordersLayer = null;
// // Функція для завантаження і відображення кордонів
// function loadAllCountryBorders() {
//     if (countryBordersLayer) {
//         // Якщо шар уже є на карті, видаляємо його (приховуємо кордони)
//         map.removeLayer(countryBordersLayer);
//         countryBordersLayer = null;
//     } else {
//         // Якщо шар відсутній, завантажуємо GeoJSON з кордонами
//         fetch('data/countries.geojson')  // Шлях до вашого файлу countries.geojson
//         .then(response => response.json())
//         .then(data => {
//             console.log("loadAllCountryBorders data: ", data);
//             // Додаємо країни як шар на карту
//             countryBordersLayer = L.geoJSON(data, {
//                 style: {
//                     color: '#ff0000',  // Колір кордонів
//                     weight: 2,         // Товщина лінії
//                     dashArray: '5, 5',  // Пунктирна лінія
//                     fillOpacity: 0     // Без заливки
//                 },
//                 onEachFeature: function (feature, layer) {
//                     // Додаємо попап з назвою країни при натисканні
//                     layer.bindPopup(`<b>${feature.properties.ADMIN}</b>`);
//                 }
//             }).addTo(map)
//             // Після додавання кордонів маштабуємо карту
//             map.setZoom(6); 
//             // на весь світ
//             // var bounds = countryBordersLayer.getBounds();  // Отримуємо межі (bounds) шару кордонів
//             // map.fitBounds(bounds);  // Маштабуємо карту на межі кордонів 
            
//         })
//         .catch(error => {
//             console.error('Error loading country borders:', error);
//         });
//     }
// }

L.easyButton('fa-globe', function() {
    loadAllCountryBorders(map);  // Викликаємо функцію для завантаження/приховування кордонів
}).addTo(map);



// // **************************************************** погода **************************************

// // Кластерна група для маркерів погоди
// var weatherMarkers = L.markerClusterGroup();
// // Масив для збереження маркерів погоди
// // let weatherMarkers = [];
// // Додаємо кнопку для показу погоди на карту
// L.easyButton('fa-cloud', function () {
//     const isoCode = document.getElementById('countrySelect').value; // Отримуємо ISO-код країни
//     console.log('isoCode: ', isoCode);

//     // Очищуємо старі маркери погоди
//     // clearWeatherMarkers();

//     // Очищуємо кластерну групу перед додаванням нових маркерів
//     weatherMarkers.clearLayers();
    
//     getCountryCities(isoCode); // Отримуємо найбільші міста та показуємо погоду
// }).addTo(map);

// // Функція для очищення старих маркерів погоди з карти
// // function clearWeatherMarkers() {
// //     weatherMarkers.forEach(marker => map.removeLayer(marker));  // Видаляємо всі старі маркери
// //     weatherMarkers = [];  // Очищуємо масив після видалення маркерів
// // }

// // Функція для запиту до GeoNames API для отримання найбільших міст країни
// function getCountryCities(isoCode) {
//     fetch(`php/getCountryCities.php?iso=${isoCode}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log("Cities: ", data);
//             data.forEach(city => {
//                 // Отримуємо погоду для кожного міста
//                 getWeatherData(city.lat, city.lng, city.name);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching cities:', error);
//         });
// }

// // Функція для запиту до OpenWeather API через getWeather.php
// function getWeatherData(lat, lon, locationName) {
//     fetch(`php/getWeather.php?lat=${lat}&lon=${lon}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log('weather data: ', data);
//             const temp = data.main.temp;
//             const weatherDescription = data.weather[0].description;
//             const iconCode = data.weather[0].icon;

//             // URL для іконки погоди
//             const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

//             // Створюємо кастомну іконку з використанням класів Bootstrap
//             const weatherIcon = L.divIcon({
//                 className: '',  // Не потрібно окремого класу
//                 html: `
//                     <div class="text-center p-1  rounded shadow-sm">
//                         <img src="${iconUrl}" class="img-fluid" alt="Weather icon" style="width: 50px; height: 50px;" />
//                         <div class="fw-bold text-primary">${temp}°C</div>
//                     </div>
//                 `,
//                 iconSize: [60, 60], // Загальний розмір іконки
//                 iconAnchor: [30, 30] // Точка, де іконка "кріпиться" на карті
//             });

//             // Додаємо маркер з кастомною іконкою
//             const marker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);

//             marker.bindPopup(`<b>${locationName}</b><br>Temperature: ${temp}°C<br>Weather: ${weatherDescription}`);
            
//             // Додаємо маркер до масиву для подальшого очищення
//             weatherMarkers.addLayer(marker);
//         })
//         .catch(error => {
//             console.error('Error fetching weather data:', error);
//         });
// }

// // Додаємо кластерну групу до карти
// map.addLayer(weatherMarkers);




// **************************************************** Функції **************************************

// Функція для скидання карти до початкового стану
// function resetMap() {
//     // Видаляємо маркер і кордони, якщо є
//     if (markerRef.current) {
//         map.removeLayer(markerRef.current);
//         markerRef.current = null;
//     }
//     if (countryBorderLayerRef.current) {
//         map.removeLayer(countryBorderLayerRef.current);
//         countryBorderLayerRef.current = null;
//     }
//     map.setView([20, 0], 2);
// }
