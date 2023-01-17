window.addEventListener('DOMContentLoaded', (event) => {
    // alert('DOM fully loaded and parsed');
});

const openCard = document.getElementById('open')
const closeCard = document.getElementById('close')
const contCard = document.getElementById('card')

function cardShow(){
    openCard.classList.toggle('hidden')
    closeCard.classList.toggle('hidden')
    contCard.classList.toggle('-translate-x-[24.5rem]')
}   


