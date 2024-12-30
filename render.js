const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('solicitudForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('id').value;
        const date = document.getElementById('date').value;
        const tipo = document.getElementById('tipo').value;
        const telefono = document.getElementById('telefono').value;
        const informacion = document.getElementById('informacion').value;
        const completado = document.getElementById('completado').checked ? 1 : 0;

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
            row.innerHTML = `
                <td>${solicitud.id}</td>
                <td>${solicitud.date}</td>
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