dokdata = []

function createTable() {
    tabela = document.getElementById("doktoriTabela")
    DrzPriv = document.getElementById("DrzPriv")
    sektor = document.getElementById("sektor")
    pol = document.getElementById("pol")
    specijalnost = document.getElementById("specijalnost")
    tabela.innerHTML ="  <thead>\n" +
        "            <tr>\n" +
        "                <th>Доктор</th>\n" +
        "                <th>Пол</th>\n" +
        "                <th>Специјалност</th>\n" +
        "                <th>Работно место</th>\n" +
        "                <th>Државни/Приватни</th>\n" +
        "                <th>Сектор</th>\n" +
        "                <th>Општина</th>\n" +
        "            </tr>\n" +
        "            </thead>"
    for (let i = 0; i < dokdata.length; i++) {
        if (dokdata[i]['\u041F\u043E\u043B']) {

            if (dokdata[i]["Пол"].toString().toLowerCase().match(pol.options[pol.selectedIndex].value.toString().toLowerCase()))
                if (dokdata[i]["Специјалност"].toString().toLowerCase() === specijalnost.options[specijalnost.selectedIndex].value.toString().toLowerCase())
                    if (dokdata[i]["Приватно\/Државно"].toString().toLowerCase() === DrzPriv.options[DrzPriv.selectedIndex].value.toString().toLowerCase())
                        if (dokdata[i]["Примарно\/Секундарно\/Терциерно"] === sektor.options[sektor.selectedIndex].value)
                            {
                            tabela.innerHTML+="<tr><th>"+dokdata[i]["Доктор"]+"</th><th>"+dokdata[i]["Пол"]+"</th><th>"+dokdata[i]["Специјалност"]+"</th><th>"+dokdata[i]["Работно место"]+"</th><th>"+dokdata[i]["Приватно\/Државно"]+"</th><th>"+dokdata[i]["Примарно\/Секундарно\/Терциерно"]+"</th><th>"+dokdata[i]["Општина"]+"</th></tr>"

                        }

        } else {
            // console.warn(`Skipping object at index ${i} because something is empty`, dokdata[i]);
        }

    }


}

async function fetchItDataa() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/zdravstvo.json");
    data["Доктори"].forEach(dok => {
        dokdata.push(dok);
    });
    makeDropdownspecijalnost(dokdata)
    createTable()
}

function makeDropdownspecijalnost(data) {
    let dropdown = document.getElementById('specijalnost');
    for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        let key = data[i]["Специјалност"];
        option.value = key;
        option.textContent = key;
        dropdown.appendChild(option);

    }
    const options = [];
    document.querySelectorAll('#specijalnost > option').forEach((option) => {
        if (options.includes(option.value)) option.remove();
        else options.push(option.value);
    });

}

fetchItDataa()

