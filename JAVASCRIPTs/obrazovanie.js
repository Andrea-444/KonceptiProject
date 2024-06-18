var mymap = L.map('mapid').setView([41.5501684, 21.5836714], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mymap);

var marker =[]

osnovni_ucilishta = []
sredni_ucilishta = []
datagradovi = []


async function makeDropdown(data) {
    // console.log(data)
    // data = data.sort()
    let dropdown = document.getElementById('odberi_opstina')
    for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        let key = data[i]["град"]
        option.value = key;
        option.textContent = key;
        dropdown.appendChild(option);
    }
}

async function getData() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/obrazovanie.json")
    let jsongradovi = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/gradovi.json")
    // let jsongradovi = await fetchData("./podatoci/gradovi.json")
    // console.log(data)
    await makeDropdown(jsongradovi)

    data["Основни училишта во Македонија"].forEach(school => {
        osnovni_ucilishta.push(school)
    })
    data["Средни училишта во Македонија"].forEach(school => {
        sredni_ucilishta.push(school)
    })

    jsongradovi.forEach(grad=>{

        datagradovi.push(grad)
    })

}

function logdata() {
    let dropdown = document.getElementById('odberi_opstina')
    let opshtina = dropdown.options[dropdown.selectedIndex].value;
    // console.log(opshtina)
    let odberi_ucilishte = document.getElementById("odberi_ucilishte").value
    let informaci_za_ucilishtata = document.getElementById("informacizaucilishtata")
    let vkbrucilishta = document.getElementById("vkbrucilishta")
    informaci_za_ucilishtata.innerHTML = ""
    vkbrucilishta.innerHTML=""
    var counter = 0;
    informaci_za_ucilishtata.innerHTML+="<h2 id='vkparagraphucilishta'></h2>"

    if (odberi_ucilishte === "site") {
        osnovni_ucilishta.forEach(school => {
            if (school["општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
            //    console.log(school["општина"])
                counter++;
                informaci_za_ucilishtata.innerHTML += "<div class='povekje_info_za_ucilishta'><p>Име на училиштето:<br> "+school['основно училиште'] +"</p><p>Адреса на училиштето: <br>"+school['адреса'] +"</p><p>Тип на училиште:<br>Основно училиште</p> </div>"
            }

        });
        sredni_ucilishta.forEach(school => {
            if (school["општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
           //    console.log(school["општина"])
                counter++;
                informaci_za_ucilishtata.innerHTML += "<div class='povekje_info_za_ucilishta'><p>Име на училиштето:<br> "+school['училиште '] +"</p><p>Адреса на училиштето: <br>"+school['адреса'] +"</p><p>Тип на училиште:<br>Средно училиште</p> </div>"

            }
        });
    } else if (odberi_ucilishte === "основно училиште") {
        osnovni_ucilishta.forEach(school => {
            if (school["општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
           //     console.log(school)
                counter++;
                informaci_za_ucilishtata.innerHTML += "<div class='povekje_info_za_ucilishta'><p>Име на училиштето:<br> "+school['основно училиште'] +"</p><p>Адреса на училиштето: <br>"+school['адреса'] +"</p><p>Тип на училиште:<br>Основно училиште</p> </div>"

            }
        });
    } else {
        sredni_ucilishta.forEach(school => {
            if (school["општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
            //    console.log(school)
                counter++;
                informaci_za_ucilishtata.innerHTML += "<div class='povekje_info_za_ucilishta'><p>Име на училиштето:<br> "+school['училиште '] +"</p><p>Адреса на училиштето: <br>"+school['адреса'] +"</p><p>Тип на училиште:<br>Средно училиште</p> </div>"

            }
        });
    }
    let vkparagraph = document.getElementById("vkparagraphucilishta").innerHTML = "Вкупен број на училишта " + counter + ""



        mymap.removeLayer(marker)
    datagradovi.forEach(grad=>{
        if(grad["град"].toString().toLowerCase()===opshtina.toString().toLowerCase()){

             marker = L.marker([grad["координати"]["latitude"], grad["координати"]["longitude"]]).addTo(mymap);

        }

    })



}

document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById('odberi_opstina');
    const sch = document.getElementById("odberi_ucilishte");

    dropdown.addEventListener('change', function () {
        logdata()
    })

    sch.addEventListener('change', function () {
        logdata()
    })
});


getData();













