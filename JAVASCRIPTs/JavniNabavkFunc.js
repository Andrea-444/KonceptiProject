async function fetchJavniNabavkiInfo() {
    // let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/javniNabavki.json")
    // let data = await fetchData("../podatoci/javniNabavki.json")
    // console.log(data)

    let dropdownDataInst = []
    for (let mapaInstKey in mapaInst) {
        dropdownDataInst.push(mapaInstKey)
    }

    // let dropdownDataStoka = []
    // for (let key in data["Тип на стоки, услуги"]) {
    //     dropdownDataStoka.push(data["Тип на стоки, услуги"][key]["Тип на стоки\/услуги"])
    // }

    await makeDropdownInstitucii(dropdownDataInst)
    await updateDropdownStoka()
    await makeCards()
}

async function makeDropdownInstitucii(data) {
    const dropdown = document.getElementById('institucija');

    data.forEach(key => {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        dropdown.appendChild(option);
    })

}

async function makeDropdownKriteriumi(data) {
    const dropdown1 = document.getElementById('kriterium');

    dropdown1.innerHTML = `<option value="Сите">Сите</option>`

    data.forEach(key => {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        dropdown1.appendChild(option);
    })
}

async function makeDropdownStoka(data) {
    const dropdown1 = document.getElementById('stoka');

    dropdown1.innerHTML = `<option value="Сите">Сите</option>`

    data.forEach(key => {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        dropdown1.appendChild(option);
    })
}

async function makeCards() {
    let daticka = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/javniNabavki.json")
    // let daticka = await fetchData("../podatoci/javniNabavki.json")

    let data = []
    daticka = daticka[mapaInst[institucijaChecked]]

    if (stokaChecked !== "Сите") {
        for (let dataKey in daticka) {
            // console.log(data[dataKey])
            let ctr = daticka[dataKey]["Тип на стока\/услуга"]

            if (ctr === undefined) {
                ctr = daticka[dataKey]["Tип на стока\/услуга"]
            }
            if (ctr === undefined) {
                ctr = daticka[dataKey]["Тип на услуга\/стока"]
            }
            if (ctr === undefined) {
                ctr = daticka[dataKey]["Тип на стоки\/услуги"]
            }
            // console.log(ctr)

            if (ctr === stokaChecked) {
                data.push(daticka[dataKey])
            }
        }
    } else {
        data = daticka
    }

    // console.log(data)
    const cardsDiv = document.getElementById('javniCards')

    cardsDiv.innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        let predmet = data[i]["Предмет на договорот за јавна набавка"]
        if (predmet === undefined) {
            predmet = data[i]["Предмет на договорот за  јавна \nнабавка"]
        }
        predmet = predmet.toUpperCase()

        let tip = data[i]["Тип на стока\/услуга"]
        if (tip === undefined) {
            tip = data[i]["Tип на стока\/услуга"]
        }
        if (tip === undefined) {
            tip = data[i]["Тип на услуга\/стока"]
        }
        if (tip === undefined) {
            tip = data[i]["Тип на стоки\/услуги"]
        }

        let ddv = data[i]["Вредност на склучениот договор со ДДВ"]
        if (ddv === undefined) {
            ddv = data[i]["Вредност на склучениот \nдоговор со ДДВ"]
        }


        cardsDiv.innerHTML += `<div class="javnaCard">
            <p>${predmet}</p>
            <p>Тип на стока/услуга: ${tip}</p>
            <p>Назив на носителот на набавката: ${data[i]["Назив на носителот на набавката"]}</p>
            <p>Вредност на склучениот договор со ДДВ: ${ddv},</p>
            <div class="cardDates">
                <p>Датум на договорот: ${data[i]["Датум на договорот"]},</p>
                <p>Датум на објава: ${data[i]["Датум на објава"]}</p>
            </div>
        </div>`
    }
}

let mapaInst = {
    "Министерство за информатичко општество и администрација": "МИО",
    "Министерство за образование и наука": "МОН",
    "Министерство за транспорт и врски": "MТВ",
    "Министерство за финансии": "Министерство за финансии",
    "Министерство за здравство": "Министерство за здравство",
    "Министерство за внатрешни работи": "МВР",
    "Министерство за правда": "Министерство за правда",
    "Министерство за економија": "Министерство за економија",
    "Министерство за надворешни работи": "МНР",
    "Агенција за катастар на недвижности": "Aгенција за кат. на недвижности",
    "Агенција за електронски комуникации": "Агенција за елек. комуникации",
    "Агенција за планирање на простор": "Агенција за план. на простор",
    "Агенција за иселеништво": "Агенција за иселеништво",
    "Дирекција за заштита и спасување": "Дирекција за зашт. и спасување",
    "Дирекција за радијациона сигурност": "Дир. за радијациона сигурност",
    "Дирекција за безбедност на класифицирани информации": "Дир. за безб. на класиф. инфо.",
    "Дирекција за технолошки индустриски развојни зони": "Дир. за тех. инд. развојни зони",
}

let institucijaChecked = "Министерство за информатичко општество и администрација"
let stokaChecked = "Сите"

fetchJavniNabavkiInfo()


async function updateDropdownStoka() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/javniNabavki.json")
    // let data = await fetchData("../podatoci/javniNabavki.json")

    data = data[mapaInst[institucijaChecked]]

    let stoki = new Set()
    for (let dataKey in data) {
        // console.log(data[dataKey])
        let ctr = data[dataKey]["Тип на стока\/услуга"]

        if (ctr === undefined) {
            ctr = data[dataKey]["Tип на стока\/услуга"]
        }
        if (ctr === undefined) {
            ctr = data[dataKey]["Тип на услуга\/стока"]
        }
        if (ctr === undefined) {
            ctr = data[dataKey]["Тип на стоки\/услуги"]
        }



        stoki.add(ctr)
    }

    // console.log(stoki)
    makeDropdownStoka(stoki)
}

document.addEventListener("DOMContentLoaded", function() {
    const institucija = document.getElementById('institucija');
    const stoka = document.getElementById('stoka');

    institucija.addEventListener('change', function () {
        institucijaChecked = institucija.options[institucija.selectedIndex].value;

        stokaChecked = "Сите"
        updateDropdownStoka()
        makeCards()
    })

    stoka.addEventListener('change', function () {
        stokaChecked = stoka.options[stoka.selectedIndex].value;
        makeCards()
    })
});