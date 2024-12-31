const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const tipoFiltro = document.getElementById('tipoFiltro'); // Dropdown para filtrar
    const tbody = document.getElementById('solicitudesTable').querySelector('tbody');
    let solicitudes = []; // Almacena todas las solicitudes para el filtro

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
        
        closeModal('solicitudModal');
    });

    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const date = document.getElementById('editDate').value;
        const tipo = document.getElementById('editTipo').value;
        const telefono = document.getElementById('editTelefono').value;
        const informacion = document.getElementById('editInformacion').value;

        const solicitud = { id, date, tipo, telefono, informacion };
        ipcRenderer.send('edit-solicitud', solicitud);
        
        closeModal('editModal');
    });

    ipcRenderer.on('solicitudes', (event, data) => {
        solicitudes = data; // Guardar todas las solicitudes
        actualizarOpcionesFiltro(); // Actualizar el filtro dinámicamente
        renderizarTabla(solicitudes);
    });

    // Actualizar las opciones del filtro dinámicamente
    function actualizarOpcionesFiltro() {
        const tiposUnicos = [...new Set(solicitudes.map(s => s.tipo))]; // Obtener tipos únicos
        tipoFiltro.innerHTML = '<option value="todos">Todos</option>'; // Resetear opciones
        tiposUnicos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            tipoFiltro.appendChild(option);
        });
    }

    // Renderizar la tabla con los datos proporcionados
    function renderizarTabla(data) {
        tbody.innerHTML = ''; // Vaciar la tabla
        if (data.length > 0) {
            data.forEach(solicitud => {
                const row = document.createElement('tr');
                const dateform = formatDate(solicitud.date);
                const dateclass = DateDays(solicitud.date) ? 'highlight' : '';
                row.innerHTML = `
                    <td>${solicitud.id}</td>
                    <td class="${dateclass}">${dateform}</td>
                    <td>${solicitud.tipo}</td>
                    <td>${solicitud.telefono}</td>   
                    <td class="tooltip-container">
                        ${solicitud.informacion.length > 20 ? solicitud.informacion.substring(0, 20) + '...' : solicitud.informacion}
                        <div class="tooltip">${solicitud.informacion}</div>
                    </td>
                    <td><input type="checkbox" ${solicitud.completado ? 'checked' : ''} data-id="${solicitud.id}"></td>
                    <td>
                        <button class="editBtn" data-id="${solicitud.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${solicitud.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            agregarEventos(); // Volver a agregar eventos después de renderizar
        } else {
            tbody.innerHTML = '<tr><td colspan="7">No hay solicitudes registradas</td></tr>';
        }
    }

    // Filtrar la tabla al cambiar el filtro
    tipoFiltro.addEventListener('change', (event) => {
        const filtro = event.target.value;
        if (filtro === 'todos') {
            renderizarTabla(solicitudes); // Mostrar todas las solicitudes
        } else {
            const solicitudesFiltradas = solicitudes.filter(s => s.tipo === filtro);
            renderizarTabla(solicitudesFiltradas); // Mostrar solicitudes filtradas
        }
    });

    function agregarEventos() {
        document.querySelectorAll('.editBtn').forEach(editBtn => {
            editBtn.addEventListener('click', (event) => {
                const id = event.currentTarget.getAttribute('data-id');
                const solicitud = solicitudes.find(s => s.id == id);
                if (solicitud) {
                    document.getElementById('editId').value = solicitud.id;
                    document.getElementById('editDate').value = solicitud.date;
                    document.getElementById('editTipo').value = solicitud.tipo;
                    document.getElementById('editTelefono').value = solicitud.telefono;
                    document.getElementById('editInformacion').value = solicitud.informacion;
                    openModal('editModal');
                } else {
                    console.error('Solicitud no encontrada');
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                Swal.fire({
                    title: '¿Estás seguro?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Eliminar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        ipcRenderer.send('delete-solicitud', id);
                        Swal.fire(
                            'Eliminado!',
                            'La solicitud ha sido eliminada.',
                            'success'
                        );
                    }
                });
            });
        });

        document.querySelectorAll('#solicitudesTable input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const id = event.target.getAttribute('data-id');
                const completado = event.target.checked ? 1 : 0;
                ipcRenderer.send('update-completado', { id, completado });
            });
        });
        
        document.querySelectorAll('.tooltip-container').forEach(container => {
            container.addEventListener('mouseenter', () => {
                const tooltip = container.querySelector('.tooltip');
                tooltip.style.display = 'block';
            });
            container.addEventListener('mouseleave', () => {
                const tooltip = container.querySelector('.tooltip');
                tooltip.style.display = 'none';
            });
        });
    }

    const modal = document.getElementById('solicitudModal');
    const editModal = document.getElementById('editModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalSpans = document.querySelectorAll('.close');

    openModalBtn.onclick = function() {
        openModal('solicitudModal');
    }

    closeModalSpans.forEach(span => {
        span.onclick = function() {
            closeModal(span.closest('.modal').id);
        }
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal('solicitudModal');
        } else if (event.target == editModal) {
            closeModal('editModal');
        }
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    ipcRenderer.on('solicitud-editada', (event, message) => {
        Swal.fire({
            icon: 'success',
            title: 'Edición Exitosa',
            text: message,
            showConfirmButton: false,
            timer: 1500
        });
    });

    ipcRenderer.on('error-editar', (event, message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });
    });

    function formatDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function DateDays(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5 || diffDays <= 0;
    }
});
