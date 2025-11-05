// Configurá la fecha y hora del evento
const eventDate = new Date('2025-11-25T00:00:00'); // Acá se cambia la hora

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date();
    const distance = eventDate - now;

    if (distance <= 0) {
        document.querySelector('.countdown-wrapper').innerHTML =
            '<div style="font-size:1.5rem;color:#c2185b;font-weight:600;">¡EL INFORME YA ESTÁ DISPONIBLE!</div>';
        clearInterval(timer);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const format = (n) => (n < 10 ? '0' + n : n);

    daysEl.textContent = format(days);
    hoursEl.textContent = format(hours);
    minutesEl.textContent = format(minutes);
    secondsEl.textContent = format(seconds);

    // Efecto de pulso solo en segundos
    secondsEl.classList.add('beat');
    setTimeout(() => secondsEl.classList.remove('beat'), 500);
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();