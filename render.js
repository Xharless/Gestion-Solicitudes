const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('solicitudForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('id').value;
        const date = document.getElementById('date').value;
        const tipo = document.getElementById('tipo').value;
        const telefono = document.getElementById('telefono').value;
        const informacion = document.getElementById('informacion').value;
        const completado = 0;

        const solicitud = { id, date, tipo, telefono, informacion, completado };
        ipcRenderer.send('add-solicitud', solicitud);
        document.getElementById('solicitudForm').reset();
        
        closeModal();
    });

    ipcRenderer.on('solicitudes', (event, solicitudes) => {
        const tbody = document.getElementById('solicitudesTable').querySelector('tbody');
        tbody.innerHTML = '';
        solicitudes.forEach((solicitud) => {
            const row = document.createElement('tr');
            const dateform = formatDate(solicitud.date);
            const dateclass = DateDays(solicitud.date) ? 'highlight' : '';
            row.innerHTML = `
                <td>${solicitud.id}</td>
                <td class="${dateclass}">${dateform}</td>
                <td>${solicitud.tipo}</td>
                <td>${solicitud.telefono}</td>
                <td>${solicitud.informacion}</td>
                <td><input type="checkbox" ${solicitud.completado ? 'checked' : ''} data-id="${solicitud.id}"></td>
            `;
            tbody.appendChild(row);
        });
         // Agregar manejador de eventos para los checkboxes
        document.querySelectorAll('#solicitudesTable input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const id = event.target.getAttribute('data-id');
                const completado = event.target.checked ? 1 : 0;
                ipcRenderer.send('update-completado', { id, completado });
            });
        });
    });

    const modal = document.getElementById('solicitudModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalSpan = document.getElementsByClassName('close')[0];

    openModalBtn.onclick = function() {
        modal.style.display = 'block';
    }

    closeModalSpan.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }
});

// -----------------------------    INICIO    ----------------------------- //
// funcionalidad para resetear el formato de fecha
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (!day) {
        // Si solo hay año y mes, establece el día en 01
        return `${month}-${year}`;
    }
    const date = new Date(year, month - 1, day); // Usar Date.UTC para evitar problemas de zona horaria
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}
// -----------------------------    FIN    ----------------------------- //

// -----------------------------    INICIO    ----------------------------- //
// funcion para marcar fechas
function DateDays(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 15 || diffDays <= 0;
}
// -----------------------------    FIN    ----------------------------- //