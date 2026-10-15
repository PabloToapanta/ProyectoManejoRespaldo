// Comprueba el estado del backend a través del proxy de Nginx (/api/).
const STATUS_ENDPOINT = '/api/v1/health';

const STATUS_CONTENT = {
  up: { className: 'alert alert-success', message: 'Servicio disponible.' },
  down: { className: 'alert alert-danger', message: 'Servicio no disponible en este momento.' },
  unreachable: { className: 'alert alert-danger', message: 'No se pudo contactar con el servicio.' },
};

function renderStatus(key) {
  const statusElement = document.querySelector('#api-status');
  if (!statusElement) {
    return;
  }

  statusElement.className = STATUS_CONTENT[key].className;
  statusElement.textContent = STATUS_CONTENT[key].message;
}

async function checkApiStatus() {
  try {
    const response = await fetch(STATUS_ENDPOINT);
    const data = await response.json();
    renderStatus(response.ok && data.database === 'up' ? 'up' : 'down');
  } catch {
    renderStatus('unreachable');
  }
}

checkApiStatus();
