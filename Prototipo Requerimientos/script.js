document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const inventorySection = document.getElementById('inventory-section');
    const ordersSection = document = document.getElementById('orders-section');
    const paymentsSection = document.getElementById('payments-section');
    const reportsSection = document.getElementById('reports-section');
    const currentUserRoleSpan = document.getElementById('current-user-role');
    const mainNav = document.getElementById('main-nav');

    // Simulación de roles de usuario
    const users = {
        'propietaria': { password: 'pass123', role: 'Propietaria' },
        'barista': { password: 'pass123', role: 'Barista' },
        'mesero': { password: 'pass123', role: 'Mesero' }
    };

    let currentUser = null; // Almacena el usuario autenticado

    // Simulación de datos (esto eventualmente vendría de una base de datos)
    // CAMBIO: Aseguramos que algunos ítems tengan unidades 'g' o 'ml' para probar la conversión
    let inventory = [
        { id: 'ing1', name: 'Café Grano', stock: 1500, unit: 'g' }, // 1.5 kg
        { id: 'ing2', name: 'Leche Entera', stock: 5000, unit: 'ml' }, // 5 lt
        { id: 'ing3', name: 'Azúcar', stock: 200, unit: 'g' },
        { id: 'prod1', name: 'Espresso', stock: 100, unit: 'unidades', price: 35.00 },
        { id: 'prod2', name: 'Latte', stock: 80, unit: 'unidades', price: 45.00 },
        { id: 'prod3', name: 'Croissant', stock: 30, unit: 'unidades', price: 25.00 }
    ];

    let orders = []; // Para almacenar los pedidos

    // --- Funciones de autenticación y navegación ---

    function authenticateUser(username, password) {
        if (users[username] && users[username].password === password) {
            currentUser = { username: username, role: users[username].role };
            return true;
        }
        return false;
    }

    function showSection(sectionElement) {
        const sections = document.querySelectorAll('main section');
        sections.forEach(sec => sec.classList.remove('active'));
        sections.forEach(sec => sec.classList.add('hidden'));
        sectionElement.classList.remove('hidden');
        sectionElement.classList.add('active');
    }

    function updateNavigation() {
        mainNav.innerHTML = ''; // Limpiar navegación actual
        let navItems = [];

        if (currentUser) {
            currentUserRoleSpan.textContent = currentUser.role;
            navItems.push({ text: 'Dashboard', section: dashboardSection });

            if (currentUser.role === 'Propietaria') {
                navItems.push({ text: 'Inventario', section: inventorySection });
            }
            if (currentUser.role === 'Propietaria' || currentUser.role === 'Barista' || currentUser.role === 'Mesero') {
                navItems.push({ text: 'Pedidos', section: ordersSection });
            }
            if (currentUser.role === 'Propietaria') {
                navItems.push({ text: 'Pagos y Caja', section: paymentsSection });
            }
            if (currentUser.role === 'Propietaria') {
                navItems.push({ text: 'Reportes', section: reportsSection });
            }

            navItems.push({ text: 'Cerrar Sesión', action: 'logout' });
        }

        navItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = item.text;
            if (item.section) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection(item.section);
                    if (item.section === inventorySection) {
                        renderInventory();
                    } else if (item.section === ordersSection) {
                        renderMenu();
                    }
                });
            } else if (item.action === 'logout') {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
            li.appendChild(a);
            mainNav.appendChild(li);
        });
    }

    function logout() {
        currentUser = null;
        showSection(loginSection);
        updateNavigation();
        loginForm.reset();
        loginError.textContent = '';
    }

    // --- Lógica de Autenticación ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (authenticateUser(username, password)) {
            loginError.textContent = '';
            showSection(dashboardSection);
            updateNavigation();
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });

    // --- Funcionalidad de Inventario (RN-010, RN-007, RN-008) ---
    const inventoryList = document.getElementById('inventory-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const addItemForm = document.getElementById('add-item-form');
    const newItemNameInput = document.getElementById('item-name');
    const newItemStockInput = document.getElementById('item-stock');
    const newItemUnitSelect = document.getElementById('item-unit'); // CAMBIO: Nueva referencia
    const saveNewItemBtn = document.getElementById('save-new-item');

    function renderInventory() {
        inventoryList.innerHTML = '';
        inventory.forEach(item => {
            const li = document.createElement('li');
            let status = '';
            // RN-010: Alerta si baja del 20%
            const threshold = item.stock * 0.20;
            if (item.stock < threshold) {
                 status = '<span style="color: red; font-weight: bold;"> (¡Stock bajo!)</span>';
            }

            // CAMBIO: Mostrar equivalente en kg o lt si aplica
            let displayStock = `${item.stock} ${item.unit}`;
            if (item.unit === 'g' && item.stock >= 1000) {
                displayStock += ` (${(item.stock / 1000).toFixed(2)} kg)`;
            } else if (item.unit === 'ml' && item.stock >= 1000) {
                displayStock += ` (${(item.stock / 1000).toFixed(2)} lt)`;
            }

            li.innerHTML = `
                <span>${item.name}: ${displayStock}</span>
                ${status}
                ${currentUser.role === 'Propietaria' ? `<button data-id="${item.id}" class="edit-item-btn">Editar Stock</button>` : ''}
            `;
            inventoryList.appendChild(li);
        });

        if (currentUser.role === 'Propietaria') {
            addItemBtn.classList.remove('hidden');
        } else {
            addItemBtn.classList.add('hidden');
            addItemForm.classList.add('hidden');
        }

        inventoryList.querySelectorAll('.edit-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const itemToEdit = inventory.find(item => item.id === itemId);
                if (itemToEdit) {
                    const newStock = prompt(`Editar stock para ${itemToEdit.name}. Stock actual: ${itemToEdit.stock} ${itemToEdit.unit}. Ingresa el nuevo stock:`);
                    if (newStock !== null) {
                        const parsedStock = parseInt(newStock);
                        if (!isNaN(parsedStock) && parsedStock >= 0) {
                            itemToEdit.stock = parsedStock;
                            renderInventory();
                        } else {
                            alert('Por favor, ingresa un número válido para el stock.');
                        }
                    }
                }
            });
        });
    }

    addItemBtn.addEventListener('click', () => {
        addItemForm.classList.remove('hidden');
    });

    saveNewItemBtn.addEventListener('click', () => {
        const itemName = newItemNameInput.value.trim();
        const itemStock = parseInt(newItemStockInput.value);
        const itemUnit = newItemUnitSelect.value; // CAMBIO: Captura la unidad seleccionada

        if (itemName && !isNaN(itemStock) && itemStock >= 0) {
            const newId = 'item_' + Date.now();
            // CAMBIO: Se guarda la unidad seleccionada. Asignamos precio por defecto solo si es 'unidades' o algo que se vendería directamente.
            // Para 'g' y 'ml' son generalmente ingredientes, no productos de venta directa.
            const isProduct = itemUnit === 'unidades'; // O podrías añadir un checkbox para "Es producto vendible"
            inventory.push({
                id: newId,
                name: itemName,
                stock: itemStock,
                unit: itemUnit,
                price: isProduct ? 0.00 : undefined // Los ingredientes no tienen precio directo en el menú
            });
            renderInventory();
            addItemForm.classList.add('hidden');
            newItemNameInput.value = '';
            newItemStockInput.value = '';
            newItemUnitSelect.value = 'unidades'; // Reiniciar a la opción por defecto
            alert(`"${itemName}" agregado al inventario con unidad: ${itemUnit}.`);
        } else {
            alert('Por favor, ingresa un nombre, stock válido y selecciona una unidad para el nuevo ítem.');
        }
    });

    // --- Funcionalidad de Pedidos (RN-015, RN-006, RN-012, RN-018, RN-013, RN-014) ---
    const menuDisplay = document.getElementById('menu-display');
    const orderList = document.getElementById('order-list');
    const orderTotalSpan = document.getElementById('order-total');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const cancelOrderBtn = document.getElementById('cancel-order-btn');

    let currentOrderItems = [];
    let currentOrderTotal = 0;

    function renderMenu() {
        menuDisplay.innerHTML = '<h3>Menú</h3>';
        // Filtrar productos disponibles (ítems con precio y stock > 0)
        const availableProducts = inventory.filter(item => item.price !== undefined && item.stock > 0);

        if (availableProducts.length === 0) {
            menuDisplay.innerHTML += '<p>No hay productos disponibles en el menú en este momento.</p>';
        }

        availableProducts.forEach(product => {
            const productDiv = document.createElement('div');
            let popularTag = '';

            productDiv.innerHTML = `
                <span>${product.name} - $${product.price.toFixed(2)}</span> ${popularTag}
                <button data-id="${product.id}" class="add-to-order-btn">Agregar</button>
            `;
            menuDisplay.appendChild(productDiv);
        });

        menuDisplay.querySelectorAll('.add-to-order-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const product = inventory.find(item => item.id === productId);

                if (product && product.stock > 0) {
                    currentOrderItems.push(product);
                    product.stock--; // Simular reducción de inventario (temporal para el pedido)
                    updateOrderSummary();
                    renderMenu(); // Actualizar el menú si se agota un producto
                } else if (product && product.stock <= 0) {
                    alert(`¡${product.name} está agotado! No se puede registrar el pedido (RN-008).`);
                }
            });
        });

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour > 21 || (currentHour === 21 && currentMinute >= 30)) {
            placeOrderBtn.disabled = true;
            menuDisplay.querySelectorAll('.add-to-order-btn').forEach(btn => btn.disabled = true);
            alert('Las funciones de venta están desactivadas después de las 9:30 PM (RN-012).');
        } else {
            placeOrderBtn.disabled = false;
        }
    }

    function updateOrderSummary() {
        orderList.innerHTML = '';
        currentOrderTotal = 0;
        const itemCounts = {};

        currentOrderItems.forEach(item => {
            itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
        });

        for (const itemId in itemCounts) {
            const product = inventory.find(item => item.id === itemId);
            if (product) {
                const li = document.createElement('li');
                const quantity = itemCounts[itemId];
                const itemPrice = product.price * quantity;
                li.innerHTML = `${product.name} x${quantity} - $${itemPrice.toFixed(2)}`;
                orderList.appendChild(li);
                currentOrderTotal += itemPrice;
            }
        }
        orderTotalSpan.textContent = currentOrderTotal.toFixed(2);
    }

    placeOrderBtn.addEventListener('click', () => {
        if (currentOrderItems.length === 0) {
            alert('No hay productos en el pedido.');
            return;
        }

        const order = {
            id: 'ORD' + Date.now(),
            items: currentOrderItems,
            total: currentOrderTotal,
            timestamp: new Date(),
            status: 'Pendiente',
        };
        orders.push(order);
        alert('Pedido realizado con éxito!');
        console.log('Nuevo Pedido:', order);

        currentOrderItems = [];
        updateOrderSummary();
        renderMenu();

        if (currentUser.role === 'Mesero') {
            console.log(`Alerta: Nuevo pedido registrado por Mesero. ID: ${order.id}. Visible para Baristas.`);
        }
    });

    cancelOrderBtn.addEventListener('click', () => {
        const confirmCancel = confirm('¿Estás seguro de que quieres cancelar el pedido?');
        if (confirmCancel) {
            currentOrderItems.forEach(item => {
                const productInInventory = inventory.find(p => p.id === item.id);
                if (productInInventory) {
                    productInInventory.stock++;
                }
            });
            currentOrderItems = [];
            updateOrderSummary();
            renderMenu();
            alert('Pedido cancelado.');
        }
    });

    // --- Gestión de Pagos y Caja (RN-003, RN-016, RN-002, RN-004, RN-017) ---
    const closeCashRegisterBtn = document.getElementById('close-cash-register-btn');
    const dailyReportsDiv = document.getElementById('daily-reports');

    closeCashRegisterBtn.addEventListener('click', () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour > 21 || (currentHour === 21 && currentMinute >= 30)) {
            alert('No se puede cerrar caja después de las 9:30 PM (RN-003).');
            return;
        }
        alert('Caja cerrada con éxito. Generando reporte diario...');
        generateDailyReport();
    });

    function generateDailyReport() {
        const now = new Date();
        const currentHour = now.getHours();
        if (currentHour < 7 || currentHour > 21) {
            console.warn('Reportes diarios solo se generan entre 7 AM y 9 PM (RN-016).');
        }

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const reportContent = `
            <h3>Reporte Diario (${new Date().toLocaleDateString()})</h3>
            <p>Total de Ventas: $${totalSales.toFixed(2)}</p>
            <p>Número de Pedidos: ${orders.length}</p>
        `;
        dailyReportsDiv.innerHTML = reportContent;
    }

    function renderFinancialReports() {
        const financialReportsDisplay = document.getElementById('financial-reports-display');
        financialReportsDisplay.innerHTML = '<h3>Reportes Financieros Detallados</h3>';
        if (currentUser.role === 'Propietaria') {
            financialReportsDisplay.innerHTML += `<p>Acceso total a reportes. Detalles de ventas, inventario, ganancias, etc.</p>`;
        } else {
            financialReportsDisplay.innerHTML += `<p>No tienes permisos para ver los reportes financieros detallados.</p>`;
        }
    }

    // --- Inicialización ---
    showSection(loginSection);
    updateNavigation();
});