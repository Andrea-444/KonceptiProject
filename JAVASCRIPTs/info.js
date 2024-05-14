const info = document.getElementById('info')
const infoCont = document.getElementById('infoContainter')
const infoDisplay = document.getElementById('infoDisplay')

info.addEventListener('click', () => {
    infoCont.style.display = 'block'
    info.style.display = 'none'
})

window.addEventListener('click', (e) => {
    if (e.target == infoCont) {
        infoCont.style.display = 'none'
        info.style.display = 'flex'
    }
})
