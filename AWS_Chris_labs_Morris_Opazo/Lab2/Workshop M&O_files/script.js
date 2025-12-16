let currentUser = null;
let currentLabFile = null;
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutos de inactividad

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const appContent = document.getElementById('app-content');
const contentDiv = document.getElementById('content-area');
const startLabModal = document.getElementById('start-lab-modal');
const apiError = document.getElementById('api-error');
const backgroundContainer = document.querySelector('.background-container');

const labToOU = {
  'lab1.md': 'Workshop RDS DE',
  'lab2.md': 'Workshop Migration DE',
  'lab3.md': 'Workshop Serverless DE',
  'lab4.md': 'Workshop Athena Creation DE'
};

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  resetInactivityTimer();
});

// Función para autenticar con la API
async function authenticate(username, password) {
  const API_URL = "https://s4gc7qoqd5.execute-api.us-east-1.amazonaws.com/auth";
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "login",
        data: {
          identifier: username,
          password: password
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Manejar específicamente el error 401 (Unauthorized)
      if (response.status === 401) {
        throw new Error('Credenciales incorrectas');
      }
      throw new Error(data.message || `Error HTTP: ${response.status}`);
    }

    return {
      success: true,
      user: {
        username: data.user.username,
        fullName: data.user.fullName,
        email: data.user.email,
        status: data.user.status
      }
    };
  } catch (error) {
    console.error("Error en autenticación:", error);
    return {
      success: false,
      message: error.message || "Error al conectar con el servidor de autenticación"
    };
  }
}

// Función para llamar a la API de asignación
async function callApi(payload) {
  const API_URL = "https://koezp60c46.execute-api.us-east-1.amazonaws.com/assign";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": window.location.origin
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No hay cuentas disponibles en este momento. Por favor, inténtalo más tarde.');
      }
      throw new Error(result.message || `Error HTTP: ${response.status}`);
    }

    if (!result.url_acceso_temporal) {
      throw new Error(result.message || 'No se recibió una URL de acceso válida');
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showAppContent();
  } else {
    showLoginModal();
  }
}

function showAppContent() { 
  backgroundContainer.classList.remove('login-view');
  loginModal.classList.add('hidden');
  appContent.classList.remove('hidden');

  if (currentUser && currentUser.fullName) {
    const welcomeTitle = document.querySelector('#content-area h1');
    if (welcomeTitle) {
      welcomeTitle.textContent = `Bienvenido ${currentUser.fullName}`;
    }

    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
      userDisplay.innerHTML = `Sesión iniciada como:<br><strong>${currentUser.fullName}</strong>`;
    }
  }

  resetInactivityTimer();
}

function showLoginModal() {
  backgroundContainer.classList.add('login-view');
  loginModal.classList.remove('hidden');
  appContent.classList.add('hidden');
}

function setupEventListeners() {
  loginForm.addEventListener('submit', handleLogin);
  
  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true });
  });
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  loginError.textContent = "Autenticando...";
  const loginButton = loginForm.querySelector('button[type="submit"]');
  loginButton.disabled = true;

  try {
    const authResult = await authenticate(username, password);
    
    if (authResult.success) {
      currentUser = { 
        username: authResult.user.username,
        fullName: authResult.user.fullName,
        email: authResult.user.email,
        status: authResult.user.status,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      loginError.textContent = '';
      loginForm.reset();
      showAppContent();
    } else {
      loginError.textContent = authResult.message || 'Credenciales incorrectas';
    }
  } catch (error) {
    console.error("Error en login:", error);
    loginError.textContent = 'Error al conectar con el servidor de autenticación';
  } finally {
    loginButton.disabled = false;
  }
}

async function startLab() {
  if (!currentUser || !currentLabFile) return;

  const modalContent = startLabModal.querySelector('.modal-content');
  const confirmButton = modalContent ? modalContent.querySelector('#confirm-lab-button') : null;
  
  if (confirmButton) {
    confirmButton.disabled = true;
    confirmButton.textContent = 'Procesando...';
  }

  const apiError = modalContent.querySelector('.error-message');
  apiError.textContent = 'Procesando solicitud...';

  try {
    const [nombre, ...apellidosArray] = currentUser.fullName.split(' ');
    const apellido = apellidosArray.join(' ');

    const payload = {
      nombre: nombre,
      apellido: apellido,
      correo: currentUser.email,
      destination_ou: labToOU[currentLabFile] || 'Testing_Roberto'
    };

    apiError.textContent = "Enviando solicitud...";
    const result = await callApi(payload);

    if (result && result.url_acceso_temporal) {
      apiError.textContent = "¡Éxito! Redirigiendo a AWS...";
      closeStartLabModal();

      setTimeout(() => {
        window.open(result.url_acceso_temporal, '_blank');
      }, 1000);
    } else {
      throw new Error('No se recibió una URL de acceso válida');
    }

  } catch (error) {
    console.error("Error al iniciar laboratorio:", error);
    
    if (error.message.includes('404') || error.message.includes('No hay cuentas disponibles')) {
      apiError.textContent = `❌ ERROR: No hay cuentas disponibles en este momento.\n\nPor favor:\n1. Intenta nuevamente más tarde\n2. Prueba con otro laboratorio\n3. Contacta al administrador si el problema persiste`;
    } else if (error.message.includes('Failed to fetch')) {
      apiError.textContent = `❌ ERROR: Problema de conexión\n\nNo se pudo conectar al servidor. Verifica tu conexión a Internet.`;
    } else {
      apiError.textContent = `❌ ERROR: ${error.message}`;
    }

    if (error.message.includes('Failed to fetch')) {
      setTimeout(async () => {
        try {
          apiError.textContent += "\n\nIntentando con proxy CORS...";
          const proxyUrl = `https://corsproxy.io/?https://koezp60c46.execute-api.us-east-1.amazonaws.com/assign`;

          const [nombre, ...apellidosArray] = currentUser.fullName.split(' ');
          const apellido = apellidosArray.join(' ');

          const proxyPayload = {
            nombre: nombre,
            apellido: apellido,
            correo: currentUser.email,
            destination_ou: labToOU[currentLabFile]
          };

          const response = await fetch(proxyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(proxyPayload)
          });

          const result = await response.json();
          if (result.url_acceso_temporal) {
            window.open(result.url_acceso_temporal, '_blank');
          } else {
            throw new Error(result.message || 'Proxy no devolvió URL válida');
          }
        } catch (proxyError) {
          apiError.textContent += `\n❌ Error con proxy: ${proxyError.message}`;
        }
      }, 2000);
    }
  } finally {
    if (confirmButton) {
      confirmButton.disabled = false;
      confirmButton.textContent = 'Enviar Solicitud';
    }
  }
}

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT);
}

function logoutDueToInactivity() {
  if (currentUser) {
    alert('Tu sesión se ha cerrado automáticamente por 60 minutos de inactividad. Por favor, inicia sesión nuevamente.');
    logout();
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showLoginModal();
  contentDiv.innerHTML = '<h1>Bienvenido</h1><p>Selecciona un laboratorio del menú de la izquierda para ver la guía.</p>';
  
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.textContent = '';
  }
}

function loadLabContent(labFile) {
  if (!currentUser) {
    showLoginModal();
    return;
  }

  currentLabFile = labFile;
  const audioFile = labFile.replace('.md', '.wav');

  fetch(labFile)
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el laboratorio');
      return response.text();
    })
.then(markdown => {
  const audioPlayerHTML = `
    <div class="audio-player-container">
      <div class="audio-player-container-inner">
        <h3>Escucha la guía del laboratorio 🎧</h3>
        <audio controls src="${audioFile}"></audio>
        <button class="start-lab-button" onclick="openStartLabModal('${labFile}')">Start Lab</button>
      </div>
    </div>
  `;
  const htmlContent = marked.parse(markdown);
  // ⬇️ envolvemos el markdown para aplicar estilos y enganchar el lightbox
  contentDiv.innerHTML = audioPlayerHTML + `<div class="md-body">${htmlContent}</div>`;
  initMarkdownEnhancements();
})
}

function openStartLabModal(labFile) {
  if (!currentUser) return showLoginModal();
  currentLabFile = labFile;
  
  const [nombre, ...apellidosArray] = currentUser.fullName.split(' ');
  const apellido = apellidosArray.join(' ');
  const labNumber = labFile.replace('.md', '').replace('lab', '');
  
  startLabModal.innerHTML = `
    <div class="modal-content">
      <span class="close-button" onclick="closeStartLabModal()">&times;</span>
      <h2>Confirmar Acceso al Laboratorio</h2>
      <div class="confirmation-message">
        <p>Bienvenido <strong>${nombre} ${apellido}</strong> al Laboratorio ${labNumber}</p>
        <p>Ingresarás con el correo: <strong>${currentUser.email}</strong></p>
        <p>Entorno de trabajo: <strong>${labToOU[labFile]}</strong></p>
      </div>
      <div class="modal-actions">
        <button id="confirm-lab-button" class="submit-button" onclick="startLab()">Enviar Solicitud</button>
        <pre class="error-message"></pre>
      </div>
    </div>
  `;
  
  startLabModal.classList.remove('hidden');
}

function closeStartLabModal() {
  startLabModal.classList.add('hidden');
}

// --- Mejoras para markdown: imágenes clickables + lightbox centrado ---
function initMarkdownEnhancements() {
  const images = contentDiv.querySelectorAll('.md-body img');
  images.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openImageLightbox(img.src, img.alt || ''));
  });
}

function openImageLightbox(src, alt = '') {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <img class="lightbox-image" src="${src}" alt="${alt}"/>
  `;
  document.body.appendChild(overlay);
  
  /* Bloquear scroll de fondo mientras el lightbox está abierto */
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  const close = () => {
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = prevOverflow || ''; // restaurar scroll
    }, 150);
    document.removeEventListener('keydown', onEsc);
  };
  

  const onEsc = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onEsc);

  overlay.addEventListener('click', (e) => {
    // Cierra si haces clic fuera de la imagen
    if (!e.target.classList.contains('lightbox-image')) close();
  });
}

window.loadLabContent = loadLabContent;
window.openStartLabModal = openStartLabModal;
window.startLab = startLab;
window.closeStartLabModal = closeStartLabModal;