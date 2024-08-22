// Uso de mi API del precio del dólar en Venezuela

fetch ("https://ve.dolarapi.com/v1/dolares/oficial")
    .then(response => response.json())
    .then(data => {
        const promedio = data.promedio;
        const elementoPromedio = document.querySelector('.promedio');
        elementoPromedio.textContent = `Bs. ${promedio}`;
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

// Usando SweetAlert para los tres botones del registro

function mostrarSweetAlert() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "¡Registrado con éxito!"
    });
}

const boton1 = document.getElementById('btnRegistrar');
const boton2 = document.getElementById('btnRegistrar2');
const boton3 = document.getElementById('btnRegistrar3');

boton1.addEventListener('click', mostrarSweetAlert);
boton2.addEventListener('click', mostrarSweetAlert);
boton3.addEventListener('click', mostrarSweetAlert);


// Función para agregar una fila a una tabla

function addRowToTable(tableId, transaction) {
    const table = document.getElementById(tableId);
    const newRow = table.insertRow(-1);

    const cells = ["tipo", "descripcion", "monto"];
    cells.forEach(cell => {
        const newCell = newRow.insertCell();
        newCell.textContent = transaction[cell];
    });

    // Nueva celda para el botón "Eliminar"
    const deleteCell = newRow.insertCell();
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => deleteRow(tableId, newRow));
    deleteCell.appendChild(deleteButton);
}

function deleteRow(tableId, row) {
    const table = document.getElementById(tableId);
    table.deleteRow(row.rowIndex);

    // Actualizar el localStorage
    const transactions = JSON.parse(localStorage.getItem(tableId)) || [];
    transactions.splice(row.rowIndex - 1, 1); // Ajustará el índice si hay un encabezado
    localStorage.setItem(tableId, JSON.stringify(transactions));

    // Recalcular el balance
    updateBalanceTable();
}

// Función para "manejar" el envío de un formulario

function handleFormSubmit(formId, tableId) {
    const form = document.getElementById(formId);
    const table = document.getElementById(tableId);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Sacar los datos del formulario
        const formData = new FormData(form);
        const newTransaction = {
            tipo: formData.get('tipo'),
            descripcion: formData.get('descripcion'),
            monto: formData.get('monto'),
        };

        // Agregará la nueva transacción al localStorage
        const transactions = JSON.parse(localStorage.getItem(tableId)) || [];
        transactions.push(newTransaction);
        localStorage.setItem(tableId, JSON.stringify(transactions));

        // Agregará la nueva fila a la tabla
        addRowToTable(tableId, newTransaction);

        // Actualizará la tabla de balance
        updateBalanceTable();
    });
}

// Asociando las funciones a cada formulario

handleFormSubmit("formularioIngresos", "tablaTransaccionesIngresos");
handleFormSubmit("formulario", "tablaTransacciones");
handleFormSubmit("formularioGastos", "tablaTransaccionesGastos");

// Función para calcular el balance. Primero suma todos los ingresos

function calculateTotalIngresos() {
    const ingresosTable = document.getElementById('tablaTransaccionesIngresos');
    let totalIngresos = 0;

    for (let i = 1; i < ingresosTable.rows.length; i++) {
        const montoCell = ingresosTable.rows[i].cells[2];
        totalIngresos += parseFloat(montoCell.textContent);
    }
    return totalIngresos;
}

// Luego, suma los egresos
function calculateTotalEgresos() {
    const egresosTable = document.getElementById('tablaTransacciones');
    const gastosTable = document.getElementById('tablaTransaccionesGastos');
    let totalEgresos = 0;

    // Sumar egresos y gastos
    for (let i = 1; i < egresosTable.rows.length; i++) {
        const montoCell = egresosTable.rows[i].cells[2];
        totalEgresos += parseFloat(montoCell.textContent);
    }
    for (let i = 1; i < gastosTable.rows.length; i++) {
        const montoCell = gastosTable.rows[i].cells[2];
        totalEgresos += parseFloat(montoCell.textContent);
    }
    return totalEgresos;
}

function calculateBalance() {
    const totalIngresos = calculateTotalIngresos();
    const totalEgresos = calculateTotalEgresos();
    return totalIngresos - totalEgresos;
}

// Actualizar la tabla del balance

function updateBalanceTable() {
    const balanceTable = document.getElementById('tablaBalance');
    const totalIngresos = calculateTotalIngresos();
    const totalEgresos = calculateTotalEgresos();
    const balance = calculateBalance();

    // Crear un objeto para almacenar el balance
    const balanceData = {
        totalIngresos: totalIngresos,
        totalEgresos: totalEgresos,
        balance: balance
    };

    // Almacenar el balance en localStorage
    localStorage.setItem('balance', JSON.stringify(balanceData));

    // Actualizar la tabla del balance
    balanceTable.innerHTML = `
    <tr>
        <th>Ingresos totales: ${totalIngresos.toFixed(2)}</th>
        <th>Egresos totales: ${totalEgresos.toFixed(2)}</th>
        <th>Tu adicional: ${balance.toFixed(2)}</th>
    </tr>
    `;
}

// Función para cargar transacciones desde el localStorage

function loadTransactions(tableId) {
    const transactions = JSON.parse(localStorage.getItem(tableId)) || [];
    transactions.forEach(transaction => addRowToTable(tableId, transaction));
}

// Función para cargar el balance desde el localStorage

function loadBalance() {
    const balanceData = JSON.parse(localStorage.getItem('balance')) || {};
    const totalIngresos = balanceData.totalIngresos || 0;
    const totalEgresos = balanceData.totalEgresos || 0;
    const balance = balanceData.balance || 0;

    // Actualizar la tabla del balance
    updateBalanceTable(totalIngresos, totalEgresos, balance);
}

// Cargar las transacciones y el balance al cargar la página

window.onload = () => {
    loadTransactions("tablaTransaccionesIngresos");
    loadTransactions("tablaTransacciones");
    loadTransactions("tablaTransaccionesGastos");
    loadBalance();
};