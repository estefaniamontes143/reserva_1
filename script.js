const availablesTables = [
    { number: 1, reserved: false},
    { number: 2, reserved: false},
    { number: 3, reserved: false},
    { number: 4, reserved: false},
    { number: 5, reserved: false},
    { number: 6, reserved: false},
    { number: 7, reserved: false},
    { number: 8, reserved: false},
    { number: 9, reserved: false},
    { number: 10, reserved: false},
    { number: 11, reserved: false},
    { number: 12, reserved: false},     
];

const occupiedTables = [];

document.addEventListener('DOMContentLoaded', () => {
   renderTables();
   document.getElementById('reserveButton').addEventListener('click', reservedTable);
   document.getElementById('reportButton').addEventListener('click', generateReport);
});

function renderTables() {
    const availablesTablesDiv = document.getElementById('availableTables');
    const occupiedTablesDiv = document.getElementById('occupiedTables');

    availablesTablesDiv.innerHTML = '';
    occupiedTablesDiv.innerHTML = '';

    availablesTables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `
            <img src="Mesa-restaurante.jpg" alt="Mesa ${table.number}">
            <div class="table-name">Mesa ${table.number}</div>
        `;

        if (!table.reserved) {
            const reserveButton = document.createElement('button');
            reserveButton.className = "button";
            reserveButton.textContent = 'Reserva';
            reserveButton.onclick = () => reservedTableByNumber(table.number);
            tableDiv.appendChild(reserveButton);
        }
        availablesTablesDiv.appendChild(tableDiv);
    });

    occupiedTables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `
            <img src="Mesa-restaurante.jpg" alt="Mesa ${table.number}">
            <div class="table-name">Mesa ${table.number}</div>
        `;
        const releaseButton = document.createElement('button');
        releaseButton.className = 'button';
        releaseButton.textContent = 'Liberar';
        releaseButton.onclick = () => releaseTable(table.number);
        tableDiv.appendChild(releaseButton);
        occupiedTablesDiv.appendChild(tableDiv);
    });
}

function horaDiferenciaEnHoras(dateTime1, dateTime2) {
    
    const fecha1 = new Date(dateTime1);
    const fecha2 = new Date(dateTime2);
    return Math.abs(fecha1 - fecha2) / (1000 * 60 * 60);
}

function reservedTable() {
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = parseInt(document.getElementById('tableNumber').value);
   const reservationDateTime = document.getElementById('reservationDateTime').value;

    

    if (!customerName || isNaN(tableNumber) || tableNumber < 1 || tableNumber > availablesTables.length || !reservationDateTime) {
        alert('Por favor, ingrese nombre, mesa y fecha/hora válidos.');
        return;
    }

    const reservasMesa = occupiedTables.filter(t => t.number === tableNumber);
    const hayConflicto = reservasMesa.some(t => 
        horaDiferenciaEnHoras(t.dateTime, reservationDateTime) < 3);

    if (hayConflicto) {
        alert('Ya existe una reserva para esa mesa en ese día y el margen horario es menor a 3 horas.');
        return;
    }
   availablesTables.find(t => t.number === tableNumber).reserved = true;
    occupiedTables.push({ 
        number: tableNumber, 
        customer: customerName, 
        dateTime: reservationDateTime 
    });

    renderTables();
    document.getElementById('customerName').value = '';
    document.getElementById('tableNumber').value = '';
    document.getElementById('reservationDateTime').value = '';
}


function reservedTableByNumber(tableNumber) {
    const customerName = document.getElementById('customerName').value.trim();
    const reservationDate = document.getElementById('reservationDate').value;

    if (!customerName) {
        alert('Por favor ingresar un nombre válido');
        return;
    }

    const table = availablesTables.find(t => t.number === tableNumber);
    if (table && !table.reserved) {
        table.reserved = true;
        occupiedTables.push({ number: table.number, customer: customerName, date: reservationDate });
        renderTables();
        document.getElementById('customerName').value = '';
        document.getElementById('reservationDate').value = '';
    } else {
        alert('La mesa ya está reservada o no existe');
    }
}

function releaseTable(tableNumber) {
    const index = occupiedTables.findIndex(t => t.number === tableNumber);
    if (index !== -1) {
        const table = occupiedTables[index];
        availablesTables.find(t => t.number === table.number).reserved = false;
        occupiedTables.splice(index, 1);
        renderTables();
    }
}

function generateReport() {
    const reportOutput = document.getElementById('reportOutput');
    reportOutput.textContent = 'Reporte de Reservas:\n\n';

    occupiedTables.forEach(table => {
        const fecha = new Date(table.dateTime);
        reportOutput.textContent += `Mesa ${table.number} - Reservada por: ${table.customer} - Dia y hora de Reserva: ${fecha.toLocaleString()}\n`;
    });

    if (occupiedTables.length === 0) {
        reportOutput.textContent += 'No hay reservas actuales.';
    }
   
}