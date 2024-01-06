// ----------------------------- API_KEYS -----------------------------------

//NASA key:
const my_KEY = 'PLEASE ADD YOUR API KEY HERE'

//OpenAI key:
const OPENAI_API_KEY = "PLEASE ADD YOUR API KEY HERE";

// ----------------------------- NASA_API -----------------------------------

//setting date for retrieving data: one month before current time. 

const enter = document.getElementById("enter");

const date = new Date();

let day = date.getDate();
let dayPre = date.getDate()-30;

let month = date.getMonth() + 1;
let year = date.getFullYear();

let prevDate = `${year}-${month}-${dayPre}`;

let currentDate = `${year}-${month}-${day}`;


// ----------------------------- NASA_API 01: Coronal Mass Ejection (CME) -----------------------------------

const cme_URL = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=${prevDate}&endDate=${currentDate}&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${my_KEY}`

enter.addEventListener('click',getCme);

async function getCme(){
  try{
    const respC = await fetch(cme_URL);
    const dataC = await respC.json();
    const datas = dataC[0];

    addNasa(datas);
  } catch (error){
    console.log(error)
  }
  
}


// display retrieved data on page 2 
const des = document.getElementById("right");

function addNasa(datas){
    des.innerHTML = `<div id="right">
    <h3>Coronal Mass Ejection (CME): 1 Month Ago</h3>
    <p>AssociatedCMEID: <span id="associatedCMEID">${datas.associatedCMEID}</span></p>
    <p>Catalog: <span id="catalog">${datas.catalog}</span></p>
    <p>HalfAngle: <span id="halfAngle">${datas.halfAngle}</span></p>
    <p>Latitude: <span id="latitude">${datas.latitude}</span></p>
    <p>Longitude: <span id="longitude">${datas.longitude}</span></p>
    <p>Speed: <span id="speed">${datas.speed}</span></p>
    <p>Info: <span id="note">${datas.note}</span></p>

</div>`
  
  // store parameter "note" into local storage for later prompt in GPT
  localStorage.setItem("pNote", `${datas.note}` ); 
  
}


  
// ----------------------------- NASA_API 02: Mars Rover Photo -----------------------------------

const mars_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${my_KEY}`

enter.addEventListener('click',getMars);

async function getMars(){
    const respM = await fetch(mars_URL);
    const dataM = await respM.json();

    //random Mars photo selection [old database, no update anymore]
    let mars_src = dataM.photos[Math.floor(Math.random() * 10)].img_src;

    addMarsPic(mars_src)
}

const marsPic = document.getElementById("left")

// display Mars photo on page 2
function addMarsPic(mars_src){
    marsPic.innerHTML = `<div id="left"><img id = "marsPic", src="${mars_src}" alt=""></div>`
}



// ----------------------------- OpenAI: text & image -----------------------------------

// ----------------------------- GPT 3.5 for generating prompt -----------------------------------

// get stored note of NASA: Coronal Mass Ejection (CME) from local storage
const notes = localStorage.getItem("pNote");

// request GPT to generate a prompt for Dalle and display on HTML. 
const submitButton1 = document.querySelector('.gen1'); 
const outputElement = document.querySelector('#textRight');

async function getMessage1(){

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{role: "assistant", content:`please imagine and describe a microbe lives in Mars geological minerals according to the description of Coronal Mass Ejection (CME): ${notes} , no more than 50 words, format: name + description.`}],
        model: "gpt-3.5-turbo",
        max_tokens: 100

      })

    }

    try {

        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()

        textRight.textContent = data.choices[0].message.content
        localStorage.setItem("gptText", `${data.choices[0].message.content}`); 

    }catch (error){
      console.error(error)

    }

}




// ----------------------------- DALLE 2 for generating image from GPT prompt -----------------------------------

//click on the button to generate prompt from GPT [by calling the function of getMessage1]. 
submitButton1.addEventListener('click',getMessage1);


// identify the html related sections. 
const submitIcon = document.querySelector('.gen2') 
const imageSection = document.getElementById('images-section')

// get the pompt generated from GPT, store it into a variable 
const gText = localStorage.getItem("gptText");
console.log(gText)
    

const getImages = async () => {
  const options1 = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "dall-e-2", 
      prompt: "Please generate pure black background realistic photo: " + gText, 
      n: 1, 
      size:"512x512"    
    })
  }
  try{
    const imgs = await fetch('https://api.openai.com/v1/images/generations', options1)
    const imgData = await imgs.json()
    console.log(imgData)

    // get the generated image url. 
    picUrl = imgData.data[0].url
   
    // launch the funtion to display the generated image
    addPic(picUrl)



  }catch (error){
    console.log(error)
  }
}

// function for HIML image display 
function addPic(u){
  imageSection.innerHTML = `
  <img id = "genPic", class = "genPic", src="${u}" alt="">`  
}

// button click to run Dalle. 
submitIcon.addEventListener('click', getImages)



