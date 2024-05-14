const menu = document.getElementById('menu')
const displayContainer = document.getElementById('displayContainer')
const menuDisplay = document.getElementById('menuDisplay')
let scrollVar = false

menu.addEventListener('click', () => {
    displayContainer.style.display = 'flex'
    menu.style.display = 'none'
    menu.style.top = '-10.5%'
    let brojac = 27
    let startingLeft = -20.75
    function moveMenu() {
        startingLeft += 0.75;

        menuDisplay.style.left = startingLeft + '%';
        brojac--
        if (brojac <= 0) {
            clearInterval(inter)
        }
    }
    let inter = setInterval(moveMenu, 10)

    scrollVar = false
})

window.addEventListener('click', (e) => {
    if (e.target == displayContainer) {
        if (scrollVar) {
            return
        }
        scrollVar = true
        let brojac = 27
        let startingLeft = -0.5

        function moveMenu() {
            startingLeft -= 0.75;

            menuDisplay.style.left = startingLeft + '%';
            brojac--
            if (brojac <= 0) {
                clearInterval(inter)
            }
        }

        let inter = setInterval(moveMenu, 10)

        setTimeout(function() {
            displayContainer.style.display = 'none';
            menu.style.display = 'flex';
            menuDisplay.style.left = '-20.75%'

            let brojac1 = 10
            let startingLeft1 = -10.5

            function moveMenu() {
                startingLeft1 += 1;

                menu.style.top = startingLeft1 + '%';
                brojac1--
                if (brojac1 <= 0) {
                    clearInterval(inter1)
                }
            }

            let inter1 = setInterval(moveMenu, 10)
        }, 300);
    }
})

window.addEventListener('scroll', function (e) {

    if (scrollVar) {
        return
    }
    scrollVar = true

    let brojac = 27
    let startingLeft = -0.5

    function moveMenu() {
        startingLeft -= 0.75;

        menuDisplay.style.left = startingLeft + '%';
        brojac--
        if (brojac <= 0) {
            clearInterval(inter)
        }
    }

    let inter = setInterval(moveMenu, 10)

    setTimeout(function() {
        displayContainer.style.display = 'none';
        menu.style.display = 'flex';
        menuDisplay.style.left = '-20.75%'

        let brojac1 = 10
        let startingLeft1 = -10.5

        function moveMenu() {
            startingLeft1 += 1;

            menu.style.top = startingLeft1 + '%';
            brojac1--
            if (brojac1 <= 0) {
                clearInterval(inter1)
            }
        }

        let inter1 = setInterval(moveMenu, 10)
    }, 300);
});

