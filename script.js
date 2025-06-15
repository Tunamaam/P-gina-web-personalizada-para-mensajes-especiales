document.addEventListener('DOMContentLoaded', () => {
    const mainMessageElement = document.getElementById('mainMessage');
    const subMessageElement = document.getElementById('subMessage');
    const heartRainContainer = document.querySelector('.heart-rain-container');
    const particlesContainer = document.querySelector('.particles-container');
    const coupleAnimationContainer = document.getElementById('coupleAnimation');
    const proposalSection = document.getElementById('proposalSection');
    const questionElements = document.querySelectorAll('.animated-text-question');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const finalMessageSection = document.getElementById('finalMessageSection');
    const finalVisualEffect = document.querySelector('.final-visual-effect'); // Nuevo elemento para el efecto final
    
    // --- Parámetros de la página (puedes dejarlos fijos para probar localmente) ---
    const nombre = getUrlParameter('nombre') || 'Mi Ronal Precioso';
    const mensaje = getUrlParameter('mensaje') || '¡Eres mi universo, mi más grande sueño!';
    const tuNombre = getUrlParameter('tuNombre') || 'Tu bebe Brandom';
    const musicaUrl = getUrlParameter('musica') || 'assets/music/tu_cancion.mp3'; // <-- ¡Tu MP3 local o URL pública!
    const animacionParejaUrl = getUrlParameter('animacionPareja') || 'assets/animations/mi_pareja_animada.json'; // <-- ¡Tu JSON local o URL pública!
    const corazonColor = getUrlParameter('corazonColor') || '#FF69B4'; // Color base de corazón (rosa)

    // --- Función para obtener parámetros de la URL ---
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // --- Animación de Texto (Máquina de Escribir Perfeccionada) ---
    function typeWriterEffect(element, text, delay = 50, startDelay = 0, callback = () => {}) {
        setTimeout(() => {
            element.innerHTML = '';
            element.style.display = 'block';

            let charIndex = 0;
            const originalText = text;

            function addNextChar() {
                if (charIndex < originalText.length) {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = originalText.charAt(charIndex);
                    charSpan.style.animationDelay = `${charIndex * 0.025}s`; // Corresponde al 0.025s en CSS
                    element.appendChild(charSpan);
                    charIndex++;
                    setTimeout(addNextChar, delay);
                } else {
                    callback();
                }
            }
            addNextChar();
        }, startDelay);
    }


    // --- Ejecución de las animaciones de texto iniciales ---
    typeWriterEffect(mainMessageElement, `${nombre}, ${mensaje}`, 60, 0, () => {
        typeWriterEffect(subMessageElement, `De ${tuNombre}, para ${nombre}`, 50, 800, () => {
            setTimeout(() => {
                questionElements.forEach((el, index) => {
                    typeWriterEffect(el, el.textContent, 70, index * 800);
                });
                setTimeout(() => {
                    yesButton.style.display = 'block';
                    noButton.style.display = 'block';
                }, questionElements.length * 800 + 1500);
                
                proposalSection.style.opacity = 1;
                proposalSection.style.transform = 'translateY(0)';
            }, 1500);
        });
    });


    // --- Lógica de Corazones y Partículas de Brillo ---
    function createHeartOrParticle() {
        const isHeart = Math.random() < 0.75; // Aumentar aún más los corazones
        const element = document.createElement('div');
        element.classList.add(isHeart ? 'heart' : 'particle');

        if (isHeart) {
            if (Math.random() < 0.2) {
                element.classList.add('blue-heart');
            }
            element.textContent = '❤️';
            element.style.color = corazonColor;
        }
        
        element.style.left = `${Math.random() * 100}vw`;
        element.style.animationDuration = `${Math.random() * 6 + 9}s`; // Más lento para una sensación más mágica
        element.style.animationDelay = `${Math.random() * 9}s`;
        
        (isHeart ? heartRainContainer : particlesContainer).appendChild(element);

        element.addEventListener('animationend', () => {
            element.remove();
        });
    }

    setInterval(createHeartOrParticle, 150); // Generar más rápido para mayor densidad


    // --- Lógica de Animación de Pareja Lottie ---
    if (animacionParejaUrl) {
        coupleAnimationContainer.innerHTML = '';
        lottie.loadAnimation({
            container: coupleAnimationContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animacionParejaUrl
        });
    } else {
        // Fallback si no hay animación Lottie
        coupleAnimationContainer.innerHTML = '<img src="https://via.placeholder.com/500x450?text=Tu+y+Yo+Infinito" alt="Pareja hacia el infinito">';
        coupleAnimationContainer.style.background = 'transparent';
    }


    // --- Lógica de Música de Fondo (¡Autoplay Forzado al Máximo!) ---
    const audio = new Audio(musicaUrl);
    audio.loop = true;
    audio.volume = 0.75; // Volumen optimizado

    // Esta es la implementación clave para el autoplay.
    // Creamos una función que intenta reproducir el audio.
    // Usamos un pequeño delay y lo envolvemos en un setTimeout para dar tiempo al DOM y al navegador.
    // También escuchamos el evento 'canplaythrough' para asegurarnos de que el archivo esté listo.
    function startAudioPlayback() {
        audio.play().catch(error => {
            console.error("Error intentando reproducir audio:", error);
            // En caso de que falle de forma persistente (raro con esta estrategia),
            // se podría considerar un popup o un mensaje en el futuro, pero la idea es que NO HAYA BOTÓN.
        });
    }

    // Estrategia más robusta: Intenta reproducir después de un breve momento.
    // Esto a menudo sortea las restricciones de autoplay que requieren interacción
    // porque el navegador ya "cargó" la página.
    setTimeout(startAudioPlayback, 1000); // Intenta reproducir 1 segundo después de cargar

    // Además, para mayor robustez en iOS y algunos Android,
    // donde el navegador puede requerir la primera interacción del usuario.
    // Aunque no haya un botón, un toque o clic en cualquier parte de la pantalla
    // activará la música si no lo hizo automáticamente.
    let audioStartedByInteraction = false;
    const activateAudioOnInteraction = () => {
        if (!audioStartedByInteraction) {
            startAudioPlayback();
            audioStartedByInteraction = true;
            // Eliminar listeners una vez que la música ha empezado
            document.removeEventListener('click', activateAudioOnInteraction);
            document.removeEventListener('touchend', activateAudioOnInteraction);
        }
    };
    document.addEventListener('click', activateAudioOnInteraction);
    document.addEventListener('touchend', activateAudioOnInteraction);


    // --- Lógica de Botones de Propuesta ---

    // Botón "Sí, quiero ser tu novia"
    yesButton.addEventListener('click', () => {
        audio.pause(); // Detener la música
        audio.currentTime = 0; // Reiniciar por si se reproduce de nuevo

        proposalSection.style.display = 'none';
        finalMessageSection.style.display = 'flex'; // Mostrar el mensaje final

        // Activar el efecto de brillo de la "explosión"
        const sparkleBurst = document.createElement('div');
        sparkleBurst.classList.add('sparkle-burst');
        finalVisualEffect.appendChild(sparkleBurst); // Añadirlo al contenedor del efecto

        // Si tienes un GIF para el efecto final, asegúrate de que esté visible
        const infinityGif = document.querySelector('.infinity-gif');
        if (infinityGif) {
            infinityGif.style.display = 'block';
        }

        // Remover la explosión después de su animación
        sparkleBurst.addEventListener('animationend', () => {
            sparkleBurst.remove();
        }, { once: true });
    });

    // Botón "No" que se escapa como un gusano indomable
    noButton.addEventListener('mouseover', (e) => {
        if (noButton.classList.contains('moving')) {
            return;
        }

        const buttonRect = noButton.getBoundingClientRect();
        const containerRect = proposalSection.getBoundingClientRect();

        // Calcular nueva posición dentro del contenedor
        // Queremos que se mueva cerca del ratón, pero siempre lejos
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Cuadrante relativo del ratón respecto al centro del botón
        const relativeX = mouseX - (buttonRect.left + buttonRect.width / 2);
        const relativeY = mouseY - (buttonRect.top + buttonRect.height / 2);

        // Fuerza de escape (aumenta para movimientos más salvajes)
        const escapeForce = 100; // Pixeles de desplazamiento base

        // Calcular un nuevo destino que empuje el botón lejos del cursor
        // Ajustamos los multiplicadores para movimientos más erráticos
        let newX = buttonRect.left + (Math.random() > 0.5 ? 1 : -1) * (escapeForce + Math.random() * 50);
        let newY = buttonRect.top + (Math.random() > 0.5 ? 1 : -1) * (escapeForce + Math.random() * 50);
        
        // Convertir a coordenadas relativas al proposalSection (para CSS translate)
        newX = newX - containerRect.left;
        newY = newY - containerRect.top;

        // Asegurarse de que no se salga del contenedor padre (proposalSection)
        const maxX = containerRect.width - buttonRect.width - 20; // 20px de margen
        const maxY = containerRect.height - buttonRect.height - 20;

        newX = Math.max(20, Math.min(newX, maxX));
        newY = Math.max(20, Math.min(newY, maxY));
        
        // Calcular los puntos intermedios para la animación de "gusano"
        const currentTransform = window.getComputedStyle(noButton).transform;
        const currentLeft = parseFloat(noButton.style.left || 0);
        const currentTop = parseFloat(noButton.style.top || 0);

        noButton.style.setProperty('--prevX', `${currentLeft}px`);
        noButton.style.setProperty('--prevY', `${currentTop}px`);

        noButton.style.setProperty('--midX1', `${currentLeft + (newX - currentLeft) * 0.25 + (Math.random() > 0.5 ? 30 : -30)}px`);
        noButton.style.setProperty('--midY1', `${currentTop + (newY - currentTop) * 0.25 + (Math.random() > 0.5 ? 30 : -30)}px`);
        noButton.style.setProperty('--midX2', `${currentLeft + (newX - currentLeft) * 0.75 + (Math.random() > 0.5 ? -30 : 30)}px`);
        noButton.style.setProperty('--midY2', `${currentTop + (newY - currentTop) * 0.75 + (Math.random() > 0.5 ? -30 : 30)}px`);
        noButton.style.setProperty('--nextX', `${newX}px`);
        noButton.style.setProperty('--nextY', `${newY}px`);
        noButton.style.setProperty('--finalX', `${newX}px`); // El destino final es la nueva posición calculada
        noButton.style.setProperty('--finalY', `${newY}px`);

        noButton.classList.add('moving');
        noButton.style.position = 'absolute'; // Necesario para posicionamiento absoluto
        noButton.style.pointerEvents = 'none'; // Desactivar eventos durante la animación

        noButton.addEventListener('animationend', () => {
            noButton.classList.remove('moving');
            noButton.style.left = `${newX}px`;
            noButton.style.top = `${newY}px`;
            noButton.style.transform = 'translate(0, 0)'; // Resetear transform para la siguiente animación
            noButton.style.opacity = 1;
            noButton.style.pointerEvents = 'auto'; // Habilitar clics de nuevo
        }, { once: true });
    });

    // Manejo para dispositivos táctiles (touchstart simula el mouseover)
    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevenir el desplazamiento de la página
        if (!noButton.classList.contains('moving')) {
            // Reutilizamos la lógica del mouseover, ajustando la entrada del evento
            const simulatedEvent = {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            };
            noButton.dispatchEvent(new MouseEvent('mouseover', simulatedEvent));
        }
    });
});
