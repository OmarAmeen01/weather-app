// grabbing items of the document

const overlay = document.getElementById('overlay')
const modalClose =document.getElementById('modal-close')
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-icon");
const timeElement = document.getElementById("time");
const select = document.querySelector("#temp-unit");
const  recentlySearched= document.querySelector('.recently-searched')
const cards = document.querySelector(".cards");
const errormsg = document.querySelector("#error p");
const topShiftBtn = document.getElementById("shift-buttons");
const topLeftShift =document.querySelector('.left-shift-top')
const topRightShift =document.querySelector('.right-shift-top')
const topslider = document.querySelectorAll('.shift-button')
const shadow = document.getElementById("shadow");
const locationName = document.querySelector(".current-location-name");
const changeIcon = document.getElementById("change-icon");
const locationContainer = document.getElementById("mylocation");

//##########hero section values#############
const heroContainer = document.getElementById('weather-hero-section')
const heroIcon = document.getElementById('hero-weather-icon')
const maxTemp = document.getElementById("max");
const minTemp = document.getElementById("min");
const heroTemp = document.getElementById("hero-temp");
const heroTempUnit = document.getElementById("hero-temp-unit");
const weatherType = document.getElementById("weather-type");
const feels = document.getElementById("feels");
const sunRiseTime = document.getElementById("sun-rise-time");

const sunSEtTime = document.getElementById("sun-set-time");
const description = document.getElementById("weather-description");

const seaValue = document.getElementById("sea-value");
const WindValue = document.getElementById("wind-value");
const HumidValue = document.getElementById("humidity-value");
const VisbilityValue = document.getElementById("visibility-value");
const presureValue = document.getElementById("pressure-value");
const degreeValue = document.getElementById("degree-value");
const dayContainer =document.getElementById('day-container')
const dayRightShift = document.getElementById('right-shift')
const dayLeftShift = document.getElementById('left-shift')
const hourrightShift = document.getElementById('right-shift-hour')
const hourLeftShift = document.getElementById('left-shift-hour')
const hours = document.querySelector('.hours')
const chartDiv = document.getElementById('hourly-graph')
const presbtn= document.getElementById('presbtn')
const chartbtns = document.querySelectorAll('.overview-btn-item')
const tempbtn = document.getElementById("tempbtn")

// api variable and storate varaible
const apiKey =import.meta.env.VITE_API_KEY;

let cityName;
let lat;
let lon;
let capitalCityName;
let imgSrc;
let recentCardArr = [];
let sunrisetime;
let sun;
let conditionStr;
let amOrpm;
let monthName;
let dIndex;
// clock portion of the web
window.setInterval(getCurrentTime, 1000);
function getCurrentTime() {
  const time = new Date();
  timeElement.innerHTML = "";
  if (time.getHours() >= 12) {
    if (time.getHours() < 10) {
      timeElement.innerHTML = `0${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} pm`;
    } else if (time.getMinutes() < 10) {
      timeElement.innerHTML = `${time.getHours()}:0${time.getMinutes()}:${time.getSeconds()} pm`;
    } else if (time.getSeconds() < 10) {
      timeElement.innerHTML = `${time.getHours()}:${time.getMinutes()}:0${time.getSeconds()} pm`;
    } else {
      timeElement.innerHTML = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} pm`;
    }
  } else {
    if (time.getHours() < 10) {
      timeElement.innerHTML = `0${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} pm`;
    } else if (time.getMinutes() < 10) {
      timeElement.innerHTML = `${time.getHours()}:0${time.getMinutes()}:${time.getSeconds()} pm`;
    } else if (time.getSeconds() < 10) {
      timeElement.innerHTML = `${time.getHours()}:${time.getMinutes()}:0${time.getSeconds()} pm`;
    } else {
      timeElement.innerHTML = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} pm`;
    }
  }
}
// geting and convertin citynames into geocoordinates
searchBtn.addEventListener("click", async(e) => {
  e.preventDefault();
  cityName = search.value;
  try {
    heroContainer.classList.remove(conditionStr)
    await getCityCoordinates();
chartDiv.innerHTML=''
    updateImgSrc();
    modifyCityName();
    
    createHourAndDayElement()
    makeTempratureChart()
    getMonthName()
    createDayAndHourModel()
    createRecentCard();
    createLocationItem();
    errormsg.style.display = "none";
    
  } catch (error) {
    console.log(error);
  }
});


async function getCityCoordinates() {
  try {
 lat =''
 lon=''
    let request = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
    );
    let result = await request.json();
     lat = result[0].lat;
     lon = result[0].lon;
  } catch (error) {
    console.log(error)
  }
}

async function getCurrentWeatherdata() {
  try {
    if (lon === "" || lon === undefined) {
      errormsg.style.display = "block";
    } else {

        let weatherRequest = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${select.value}`
        );
        let result = await weatherRequest.json();
   
        locationName.innerHTML = "";
        locationName.innerHTML = capitalCityName;

        // modifing hero element
        heroIcon.src = imgSrc
        maxTemp.innerHTML = `${Math.ceil(result.main.temp_max)}°`;
        minTemp.innerHTML = `${Math.ceil(result.main.temp_min)}°`;
        heroTemp.innerHTML = Math.ceil(result.main.temp);

        if (select.value === "imperial") {
          heroTempUnit.innerText = "°F";
        } else {
          heroTempUnit.innerHTML = "°C";
        }
        weatherType.innerHTML =
          result.weather[0].description.slice(0, 1).toUpperCase() +
          result.weather[0].description.slice(1);

        feels.innerHTML = `${Math.ceil(result.main.feels_like)}°`;
        let sunrise = new Date(result.sys.sunrise * 1000);
        if (sunrise.getMinutes() < 10) {
          sunRiseTime.innerHTML = `${sunrise.getHours()}:0${
            sunrise.getMinutes()
          } am`;
        } else {
          sunRiseTime.innerHTML = `${sunrise.getHours()}:${sunrise.getMinutes()} am`;
        }

        let sunset = new Date(result.sys.sunset * 1000);
        if (sunset.getMinutes() < 10) {
          sunSEtTime.innerHTML = `${sunset.getHours()}:0${
            sunset.getMinutes()
          } pm`;
        } else {
          sunSEtTime.innerHTML = `${sunset.getHours()}:${sunset.getMinutes()} pm`;
        }
        description.innerHTML = `Expected ${
          result.weather[0].main
        }. The High will be ${Math.ceil(result.main.temp_max)}°`;

        seaValue.innerHTML = `${result.main.sea_level} hPa`;
        presureValue.innerHTML = `${result.main.pressure} mb`;
        HumidValue.innerHTML = `${result.main.humidity}%`;
        VisbilityValue.innerHTML = `${result.visibility / 1000} km`;
        WindValue.innerHTML = `${result.wind.speed} km/h`;
        degreeValue.innerHTML = `${result.wind.deg}°`;

        return result;

    }
  } catch (error) {
  console.log(error)
  }
}

function modifyCityName() {
  capitalCityName = cityName.slice(0, 1).toUpperCase() + cityName.slice(1);
  return capitalCityName;
}






async function updateImgSrc() {
  let data = await getCurrentWeatherdata();

  let time = new Date();
  let sunsetC = new Date((data.sys.sunset)*1000)
  if (time.getHours() 
   < sunsetC.getHours()) {

    if (data.weather[0].main === "Clouds") {
      imgSrc = `./public/Icons/wi-day-cloudy.svg`;
      heroContainer.classList.add('cloudy')
     conditionStr = 'cloudy'
     
    } else if (data.weather[0].main === "Rain") {
      imgSrc = "./public/Icons/wi-day-rain-mix.svg";
   heroContainer.classList.add('rain')
  conditionStr = 'rain'

   } else if (data.weather[0].main === "Clear") {
      imgSrc = `./public/Icons/wi-day-sunny.svg`;
    heroContainer.classList.add('clear')
   conditionStr = 'clear'
      } else if (data.weather[0].main === "Drizzle") {
        imgSrc = "./public/Icons/wi-day-showers.svg";
 heroContainer.classList.add('cloudy')
conditionStr = 'cloudy'
    } else if (data.weather[0].main === "Mist") {
        imgSrc = "./public/Icons/wi-day-cloudy-gusts.svg";
        heroContainer.classList.add('cloudy')
       conditionStr = 'cloudy'

    } else if (data.weather[0].main === "Snow") {
        imgSrc = "./public/Icons/wi-day-snow.svg";

        heroContainer.classList.add('cloudy')
       conditionStr = 'cloudy'
    }  
    else if (data.weather[0].main === "Haze") {
      imgSrc = "./public/Icons/wi-day-haze.svg";

      heroContainer.classList.add('cloudy')
     conditionStr = 'cloudy'
  } 


    
  } else {

    if (data.weather[0].main === "Clouds") {
        imgSrc = "./public/Icons/wi-night-alt-cloudy.svg";

        heroContainer.classList.add('cloudyN')
       conditionStr = 'cloudyN'
    } else if (data.weather[0].main === "Rain") {
        imgSrc = "./public/Icons/wi-night-alt-rain.svg";

        heroContainer.classList.add('rain')
       conditionStr = 'rain'
   } else if (data.weather[0].main === "Clear") {
        imgSrc = "./public/Icons/wi-night-clear.svg";

    }
     else if (data.weather[0].main ===       "Drizzle") {
        imgSrc = "./public/Icons/wi-night-alt-mix.svg";
  
        heroContainer.classList.add('cloudyN')
       conditionStr = 'cloudyN'
    } else if (data.weather[0].main === "Mist") {
        imgSrc = "./public/Icons/wi-night-alt-cloudy-gusts.svg";

        heroContainer.classList.add('cloudyN')
       conditionStr = 'cloudyN'
    } else if (data.weather[0].main === "Snow") {
        imgSrc = "./public/Icons/wi-night-alt-snow.svg";

        heroContainer.classList.add('cloudyN')
       conditionStr = 'cloudyN'
    }else if (data.weather[0].main === "Haze") {
      imgSrc = "./public/Icons/wi-night-alt-cloudy-windy.svg";

      heroContainer.classList.add('cloudyN')
     conditionStr = 'cloudyN'
  } 
  }
}


async function createRecentCard() {
  try {
    if (!recentCardArr.includes(capitalCityName)) {

      let data = await getCurrentWeatherdata();
      console.log(data)
      let recentCard = document.createElement("div");
      recentCard.classList.add("recent-card");
      recentCard.innerHTML = `<p class="city-name">${capitalCityName}</p>
      <div class="icon-temp">
        <img
          src=${imgSrc}
          alt=""
          class="city-weather-icon"
        />
        <p class="city-temp">${Math.ceil(data.main.temp)}°</p>
      </div>
    `;
      let removebtn = document.createElement("button");
      removebtn.classList.add("remove-btn");
      removebtn.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="16"
    viewBox="0 0 40 16"
    fill="none"
    class="remove-icon"
    >
    <path
      d="M2 3.75C1.0335 3.75 0.25 2.9665 0.25 2C0.25 1.0335 1.0335 0.25 2 0.25C2.9665 0.25 3.75 1.0335 3.75 2C3.75 2.9665 2.9665 3.75 2 3.75ZM2 9.75C1.0335 9.75 0.25 8.9665 0.25 8C0.25 7.0335 1.0335 6.25 2 6.25C2.9665 6.25 3.75 7.0335 3.75 8C3.75 8.9665 2.9665 9.75 2 9.75ZM0.249999 14C0.249999 14.9665 1.0335 15.75 2 15.75C2.9665 15.75 3.75 14.9665 3.75 14C3.75 13.0335 2.9665 12.25 2 12.25C1.0335 12.25 0.249999 13.0335 0.249999 14Z"
      fill="white"
    ></path>
    </svg>
    `;
      let cardRemove = document.createElement("button");
      cardRemove.classList.add("card-remove");
      cardRemove.innerHTML = "Remove";
      removebtn.appendChild(cardRemove);
      recentCard.appendChild(removebtn);
      cards.prepend(recentCard);
   
      recentCardArr.push(recentCard.firstElementChild.innerHTML);

      recentCard.lastChild.addEventListener("click", () => {
        if (cardRemove.style.display === "block") {
          cardRemove.style.display = "none";
        } else {
          cardRemove.style.display = "block";
        }
      });
     
      cardRemove.addEventListener("click", (e) => {
        
     
        let nameOfItem =
          e.target.parentElement.parentElement.firstElementChild.innerHTML;
        let indexOfitem = recentCardArr.indexOf(nameOfItem);
        recentCardArr.splice(indexOfitem, 1);
 
        cards.removeChild(e.target.parentElement.parentElement);
      });
     
      recentCard.addEventListener('click',async(e)=>{

    for(let i= 1 ;i<2;i++){
      if(e.target===recentCard){
        cityName=e.target.firstElementChild.innerHTML
  
       }else if(e.target===recentCard.children[i].children[i]){ 
        cityName= e.target.parentElement.parentElement.firstElementChild.innerHTML
  
       }
       else{
        cityName = e.target.parentElement.firstElementChild.innerHTML;
        }
    }
        try {
          heroContainer.classList.remove(conditionStr)
          await getCityCoordinates()
          updateImgSrc();
          modifyCityName();
          createHourAndDayElement()
          getMonthName()
          createDayAndHourModel()
          errormsg.style.display = "none";
        } catch (error) {
          console.log(error);
        }

      })
      // slider setting 
      MakeArrowFunctional(cards,recentCard,topLeftShift,topRightShift)
   

     
        
      
    } else {
      lon = "";
      lat = "";
    }
    return recentCardArr;
  } catch (error) {
    console.error(error);
  }
}
changeIcon.addEventListener("click", () => {
  if (locationContainer.style.display === "block") {
    locationContainer.style.display = "none";
  } else {
    locationContainer.style.display = "block";
  }
});


async function createLocationItem() {
  let data = await getCurrentWeatherdata();
  let recentArr = await createRecentCard();
  let locations

  if (recentArr.length < 6) {
    locations = document.createElement("div");
    locations.classList.add("locations");
    locations.innerHTML = ` <div class="location-name-part">
    <p class="locate-city-name">${capitalCityName}</p>
    <p class="sub-city-name" title='location name'>${data.name},${data.sys.country}</p>
    </div>
    <div class="loaction-img-temp-part">
    <img src=${imgSrc} alt=""  title='weather condition'/>
     <p class="loaction-temp">${Math.ceil(data.main.temp)}°</p>
    </div>`;
    locationContainer.appendChild(locations);
  } 
  else {
    locationContainer.removeChild(locationContainer.children[1]);
    locations = document.createElement("div");
    locations.classList.add("locations");
    locations.innerHTML = ` <div class="location-name-part">
  <p class="locate-city-name">${capitalCityName}</p>
  <p class="sub-city-name" title='location name'>${data.name},${data.sys.country}</p>
  </div>
  <div class="loaction-img-temp-part">
  <img src=${imgSrc} alt=""  title='weather condition'/>
  <p class="loaction-temp">${data.main.temp}°</p>
  </div>`;
    locationContainer.appendChild(locations);
  }
locations.addEventListener('click',async(e)=>{

  for(let i= 0 ;i<2;i++){

    if(e.target===locations){
      cityName=e.target.firstElementChild.firstElementChild.innerHTML

     }else if(e.target===locations.children[i].children[i] ||e.target===locations.children[0].children[1]){ 
      cityName= e.target.parentElement.parentElement.firstElementChild.firstElementChild.innerHTML

     }
  
  }
      try {
        heroContainer.classList.remove(conditionStr)
        await getCityCoordinates()
        updateImgSrc();
        modifyCityName();
        createHourAndDayElement()
        getMonthName()
        createDayAndHourModel()
        errormsg.style.display = "none";
      } catch (error) {
        console.log(error);
      }

})

}

async function getHourAndDailyWeatherData(){

  let request =await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${select.value}`)
  let result = await request.json()

  return result 
}







async function createHourAndDayElement(){
  let data = await getHourAndDailyWeatherData()
  let time = new Date()
  let hour
  let day
let j= 0

 hours.innerHTML=''
dayContainer.innerHTML=''
 for(let i=0; i<data.list.length;i++)
 {
  if(parseFloat(data.list[i].dt_txt.slice(11,16))<12){
    amOrpm='am'
}else{
    amOrpm='pm'
}
  hour = document.createElement('div')
  hour.classList.add('hour')
  hour.setAttribute('title','Hourly forcast')
  hour.setAttribute('data-id',i)
  hour.innerHTML=`<p id="time" title="time" data-id=${i}>${data.list[i].dt_txt.slice(11,13)} ${amOrpm}</p>
  <img
  src=${imgSrc}
  alt="" title="weather condition"
  id="hour-wet-icon" data-id=${i}
  class="reuse-icon-size"
   />
  <div class="pop-cont" data-id=${i}>
  <i class="fa-solid fa-droplet pop-drop" title="precipitation" data-id=${i}></i>
 <p class="precipitation" data-id=${i}>${Math.round(data.list[i].pop*100)}%</p>
  </div>
  <p id="tmep" title="temprature" data-id=${i}>${Math.ceil(data.list[i].main.temp)}°</p>
  <p id="hour-wet-type" data-id=${i}>${data.list[i].weather[0].description}</p>`
  hours.appendChild(hour)   

  
  MakeArrowFunctional(hours,hour,hourLeftShift,hourrightShift)
}

while(time.getDate()===parseFloat(data.list[j].dt_txt.slice(8,10))){
  dIndex= j+1
  j++
}

for(let i=dIndex;i<data.list.length;i+=8){
 
day = document.createElement('div')
day.classList.add('day')
day.setAttribute('data-id',i)
day.innerHTML= `<p id="day" title="day" data-id=${i}>${data.list[i].dt_txt.slice(8,10)} ${monthName}</p>
<img
  src=${imgSrc}
  alt="" title="weather condition"
  id="day-wet-icon" data-id=${i}
  class="reuse-icon-size"
/>
<div class="pop-cont" data-id=${i}>
  <i class="fa-solid fa-droplet pop-drop" title="precipitation" data-id=${i}></i>
  <p class="precipitation" data-id=${i}>${Math.round(data.list[i].pop*100)}%</p>
</div>
<p id="tmep" title="temprature" data-id=${i}>${Math.ceil(data.list[i].main.temp)}°</p>
<p id="hour-wet-type" data-id=${i}>${data.list[i].weather[0].description}</p>`
dayContainer.appendChild(day)
MakeArrowFunctional(dayContainer,day,dayLeftShift,dayRightShift)
}

}


async function getMonthName(){
let data = await getHourAndDailyWeatherData()
for(let i=0;i<data.list.length;i++){

if(data.list[i].dt_txt.slice(5,7)==='01'){
monthName='Jan'

}
else if(data.list[i].dt_txt.slice(5,7)==='02'){
monthName= 'Feb'
}
else if(data.list[i].dt_txt.slice(5,7)==='03'){
  monthName= 'Mar'
  }
  else if(data.list[i].dt_txt.slice(5,7)==='04'){
    monthName= 'Apr'
    }
    else if(data.list[i].dt_txt.slice(5,7)==='05'){
      monthName= 'May'
      }
      else if(data.list[i].dt_txt.slice(5,7)==='06'){
        monthName= 'Jun'
        }
        else if(data.list[i].dt_txt.slice(5,7)==='07'){
          monthName= 'JUL'
          }
          else if(data.list[i].dt_txt.slice(5,7)==='08'){
            monthName= 'Aug'
            }
            else if(data.list[i].dt_txt.slice(5,7)==='09'){
              monthName= 'Sep'
              }
              else if(data.list[i].dt_txt.slice(5,7)==='010'){
                monthName= 'Oct'
                }
                else if(data.list[i].dt_txt.slice(5,7)==='11'){
                  monthName= 'Nov'
                  }
                  else if(data.list[i].dt_txt.slice(5,7)==='12'){
                    monthName= 'Dec'
                    }


}

}

async function createDayAndHourModel(){


await createHourAndDayElement()
await getCityCoordinates()
let data = await getHourAndDailyWeatherData()
let hour = document.querySelectorAll('.hour')
let day = document.querySelectorAll('.day')
       hour.forEach((item)=>{
         item.addEventListener('click',(e)=>{
        overlay.innerHTML=''
          overlay.style.display='flex'
          let cardNumber = Number(e.target.dataset.id)
               
          let modal =document.createElement('div')
     
          modal.classList.add('modal')
          modal.innerHTML=`<div class="modal">
          <button id="modal-close" title="close">x</button>
          <h4 id="modal-header">${data.list[cardNumber].dt_txt.slice(11,13)} ${amOrpm}</h4>     
          <div id="modal-main">
            <div id="modal-temo-icon" >
              <img src=${imgSrc} alt="" class="modal-wet-icon">
              <p class="main-text">${Math.ceil(data.list[cardNumber].main.temp)}°
              </p>
            </div>
             <div id="modal-feels">
               <p class="modal-feels-text modal-condition">${data.list[cardNumber].weather[0].description}</p>
               <p class="modal-feels-text">Feels like 
                 <span class="modal-feels-text"> ${Math.ceil(data.list[cardNumber].main.feels_like)}°
                 </span>
               </p>
             </div> 
          </div>
          <div id="modal-detials">
            <div class="modal-item">
              <p class="modal-text">Max temp <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.temp_max)}°</span></p>
               <p class="modal-text">Precipitation <span class="modal-unit">${Math.round(data.list[cardNumber].pop*100)}%</span></p>
               <p class="modal-text">Clouds <span class="modal-unit">95%</span></p>
            </div>
            <div class="modal-item">
              <p class="modal-text">Pressure <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.pressure)} mb</span></p>
               <p class="modal-text">Min temp <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.temp_min)}°</span></p>
               <p class="modal-text">Humidity <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.humidity)}°%</span></p>
            </div>
            <div class="modal-item">
              <p class="modal-text">Visibility <span class="modal-unit">${data.list[cardNumber].visibility} Km</span></p>
               <p class="modal-text">Wind <span class="modal-unit">${data.list[cardNumber].wind.speed} Km/h</span></p>
               <p class="modal-text">Wind degree <span class="modal-unit">${data.list[cardNumber].wind.deg}°</span></p>
            </div>
            
            
          </div>
        
        </div>
        
        `

        overlay.appendChild(modal)
        let modalExit= document.getElementById('modal-close')
        modalExit.addEventListener('click',()=>{
         overlay.style.display='none'
         })
  
       })
       })
       day.forEach((item)=>{
        item.addEventListener('click',(e)=>{
       overlay.innerHTML=''
         overlay.style.display='flex'
         let cardNumber = Number(e.target.dataset.id)
              
         let modal =document.createElement('div')
    
         modal.classList.add('modal')
         modal.innerHTML=`<div class="modal">
         <button id="modal-close" title="close">x</button>
         <h4 id="modal-header">${data.list[cardNumber].dt_txt.slice(8,10
          )} ${monthName}</h4>     
         <div id="modal-main">
           <div id="modal-temo-icon" >
             <img src=${imgSrc} alt="" class="modal-wet-icon">
             <p class="main-text">${Math.ceil(data.list[cardNumber].main.temp)}°
             </p>
           </div>
            <div id="modal-feels">
              <p class="modal-feels-text modal-condition">${data.list[cardNumber].weather[0].description}</p>
              <p class="modal-feels-text">Feels like 
                <span class="modal-feels-text"> ${Math.ceil(data.list[cardNumber].main.feels_like)}°
                </span>
              </p>
            </div> 
         </div>
         <div id="modal-detials">
           <div class="modal-item">
             <p class="modal-text">Max temp <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.temp_max)}°</span></p>
              <p class="modal-text">Precipitation <span class="modal-unit">${Math.round(data.list[cardNumber].pop*100)}%</span></p>
              <p class="modal-text">Clouds <span class="modal-unit">95%</span></p>
           </div>
           <div class="modal-item">
             <p class="modal-text">Pressure <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.pressure)} mb</span></p>
              <p class="modal-text">Min temp <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.temp_min)}°</span></p>
              <p class="modal-text">Humidity <span class="modal-unit">${Math.ceil(data.list[cardNumber].main.humidity)}°%</span></p>
           </div>
           <div class="modal-item">
             <p class="modal-text">Visibility <span class="modal-unit">${data.list[cardNumber].visibility} Km</span></p>
              <p class="modal-text">Wind <span class="modal-unit">${data.list[cardNumber].wind.speed} Km/h</span></p>
              <p class="modal-text">Wind degree <span class="modal-unit">${data.list[cardNumber].wind.deg}°</span></p>
           </div>
           
           
         </div>
       
       </div>
       
       `

       overlay.appendChild(modal)
       let modalExit= document.getElementById('modal-close')
       modalExit.addEventListener('click',()=>{
        overlay.style.display='none'
        })
 
      })
      })
}

 function MakeArrowFunctional(container,child,leftarrow,rightarrow){

     if(container.getBoundingClientRect().right>container.lastElementChild.getBoundingClientRect().right && container.getBoundingClientRect().left>container.firstElementChild.getBoundingClientRect().left){
rightarrow.style.display= 'block'
  leftarrow.style.display='none'

     }
     else if(container.getBoundingClientRect().right<container.lastElementChild.getBoundingClientRect().right){
      leftarrow.style.display='block'
     rightarrow.style.display='none'

     } 
     else if(container.getBoundingClientRect().left<=container.firstElementChild.getBoundingClientRect().left && container.getBoundingClientRect().right>=container.lastElementChild.getBoundingClientRect().right){
    leftarrow.style.display='none'
    rightarrow.style.display='none'
    }
    let sliderIndex
   leftarrow.addEventListener('click',()=>{
    sliderIndex = parseFloat(getComputedStyle(child).getPropertyValue('--slider-index'))
         
    child.style.setProperty('--slider-index',sliderIndex-1) 
     if(container.getBoundingClientRect().right>container.lastElementChild.getBoundingClientRect().right){
    rightarrow.style.display= 'block'
    leftarrow.style.display='none'

   }else if(container.getBoundingClientRect().left>container.firstElementChild.getBoundingClientRect().left && container.getBoundingClientRect().right<container.lastElementChild.getBoundingClientRect().right){
  leftarrow.style.display= 'block'
  rightarrow.style.display ='block'

   }

        })
 rightarrow.addEventListener('click',()=>{
  sliderIndex = parseFloat(getComputedStyle(child).getPropertyValue('--slider-index'))
  child.style.setProperty('--slider-index',sliderIndex+1)
     if(container.getBoundingClientRect().left<=container.firstElementChild.getBoundingClientRect().left && container.getBoundingClientRect().right<container.lastElementChild.getBoundingClientRect().right){
      leftarrow.style.display= 'block'
      rightarrow.style.display = 'none'

       
     }else if(container.getBoundingClientRect().left>container.firstElementChild.getBoundingClientRect().left && container.getBoundingClientRect().right<container.lastElementChild.getBoundingClientRect().right){
      leftarrow.style.display= 'block'
      rightarrow.style.display ='block'

       }
    
   })
}

chartbtns.forEach((chartbtn)=>{
  
  chartbtn.addEventListener('click',async(e)=>{
    const datarequest = await getHourAndDailyWeatherData()
chartDiv.innerHTML=''


  const ctx =document.createElement('canvas')

  ctx.id= 'mychart'
  chartDiv.appendChild(ctx)
    if(e.target.innerHTML==='Temprature'){
      const tempData = datarequest.list.map((item)=>Math.ceil(item.main.temp))
  const data = datarequest.list.map(item=>item.dt_txt.slice(11,13))
      for (let x of chartbtns){
  x.classList.remove('active')
      }
       e.target.classList.add('active')
        new Chart(ctx,{
        type:'line',
       data:{
        labels:data,
        
        datasets:[{
          label:'Temprature chart',
          data:tempData,
          fill:true,
          tension:.6,
          pointBackgroundColor:'#ffff',
        
        }]
        
       },
       options:{
        responsive:true,
        maintainAspectRatio:false,
      scales:{
        x:{
          type: 'category',
          ticks:{
            color:'#ffff',
           stepSize:10,
            fontSize:5,
      
          }
        },
        y:{
          ticks:{
            color:'#ffff',
            callback:(value)=>{
              return value + '°'
              
            
            },
            fontSize:5,
          
          }
        },
    
      },
      plugins: {
          legend: {
            labels: {
              color: '#ffff',
              fontSize:14,
            }
          },
        hoverRadius:10,
        
      },
    height:10,
    
    
    
       },
    
     
      })
    }
    else if(e.target.innerHTML==='Humidity'){
      const humidData = datarequest.list.map((item)=>Math.ceil(item.main.humidity))
        const data = datarequest.list.map(item=>item.dt_txt.slice(11,13))
      for (let x of chartbtns){
        x.classList.remove('active')
            }
             e.target.classList.add('active')

           
           new Chart(ctx,{
               type:'line',
              data:{
               labels:data,
               
               datasets:[{
                 label:'Humidity chart',
                 data:humidData,
                 fill:true,
                 tension:.6,
                 pointBackgroundColor:'#ffff',
               
               }]
               
              },
              options:{
               responsive:true,
               maintainAspectRatio:false,
             scales:{
               x:{
                 type: 'category',
                 ticks:{
                   color:'#ffff',
                  stepSize:10,
                   fontSize:5,
             
                 }
               },
               y:{
                 ticks:{
                   color:'#ffff',
                   callback:(value)=>{
                     return value + '%'
                     
                   
                   },
                   fontSize:5,
                 
                 }
               },
           
             },
             plugins: {
                 legend: {
                   labels: {
                     color: '#ffff',
                     fontSize:14,
                   }
                 },
               
             },
             hoverRadius:10,
           height:10,
           
           
           
              },
           
            
             })
           

    }else if(e.target.innerHTML==='Rainfall'){
        const rainData = datarequest.list.map((item)=>Math.ceil(item.pop))
  const data = datarequest.list.map(item=>item.dt_txt.slice(11,13))
      for (let x of chartbtns){
        x.classList.remove('active')
            }
             e.target.classList.add('active')
      new Chart(ctx,{
        type:'line',
       data:{
        labels:data,
        
        datasets:[{
          label:' Rain chart',
          data:rainData,
          fill:true, 
          tension:.6,
          pointBackgroundColor:'#ffff',
        
        }]
        
       },
       options:{
        responsive:true,
        maintainAspectRatio:false,
      scales:{
        x:{
          type: 'category',
          ticks:{
            color:'#ffff',
           stepSize:10,
            fontSize:5,
      
          }
        },
        y:{
          ticks:{
            color:'#ffff',
            callback:(value)=>{
              return value + '%'
              
            
            },
            fontSize:5,
          
          }
        },
    
      },
      plugins: {
          legend: {
            labels: {
              color: '#ffff',
              fontSize:14,
            }
          },
        hoverRadius:10,
        
      },
    height:10,
    
    
    
       },
    
     
      })
    
    }else if(e.target.innerHTML==='Pressure'){

      const pressureData = datarequest.list.map((item)=>Math.ceil(item.main.pressure))
        const data = datarequest.list.map(item=>item.dt_txt.slice(11,13))
      for (let x of chartbtns){
        x.classList.remove('active')
            }
             e.target.classList.add('active')
      new Chart(ctx,{
        type:'line',
       data:{
        labels:data,
        
        datasets:[{
          label:'Pressure chart',
          data:pressureData,
          fill:true,
          tension:.6,
          pointBackgroundColor:'#ffff',
        
        }]
        
       },
       options:{
        responsive:true,
        maintainAspectRatio:false,
      scales:{
        x:{
          type: 'category',
          ticks:{
            color:'#ffff',
           stepSize:10,
            fontSize:5,
      
          }
        },
        y:{
          ticks:{
            color:'#ffff',
            callback:(value)=>{
              return value + 'mb'
              
            
            },
            fontSize:5,
          
          }
        },
    
      },
      plugins: {
          legend: {
            labels: {
              color: '#ffff',
              fontSize:14,
            }
          },
        hoverRadius:10,
        
      },
    height:10,
    
    
    
       },
    
     
      })
    }
  })
})

async function makeTempratureChart(){
  const datarequest = await getHourAndDailyWeatherData()
  const tempData = datarequest.list.map((item)=>Math.ceil(item.main.temp))
  const data = datarequest.list.map(item=>item.dt_txt.slice(11,13))
  const ctx =document.createElement('canvas')

  ctx.id= 'mychart'
  chartDiv.appendChild(ctx)
 
  new Chart(ctx,{
    type:'line',
   data:{
    labels:data,
    
    datasets:[{
      label:'Temprature chart',
      data:tempData,
      fill:true,
      tension:.6,
      pointBackgroundColor:'#ffff',
    
    }]
    
   },
   options:{
    responsive:true,
    maintainAspectRatio:false,
  scales:{
    x:{
      type: 'category',
      ticks:{
        color:'#ffff',
       stepSize:10,
        fontSize:5,
  
      }
    },
    y:{
      ticks:{
        color:'#ffff',
        callback:(value)=>{
          return value + '°'
          
        
        },
        fontSize:5,
      
      }
    },

  },
  plugins: {
      legend: {
        labels: {
          color: '#ffff',
          fontSize:14,
        }
      },
    hoverRadius:10,
    
  },
height:10,



   },

 
  })


}
