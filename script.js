document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en la página de administración (index.html) o cliente (client_order.html)
    // Usamos la existencia del formulario de login como indicador.
    const isAdminPage = document.getElementById('login-section') !== null;

    // --- Simulación de Datos Globales (accesibles por ambas partes del script) ---
    // Estos datos se pierden al recargar la página ya que no hay un backend/DB.
    let inventory = [
        { id: 'ing1', name: 'Café Grano', stock: 1500, unit: 'g' }, // 1.5 kg
        { id: 'ing2', name: 'Leche Entera', stock: 5000, unit: 'ml' }, // 5 lt
        { id: 'ing3', name: 'Azúcar', stock: 200, unit: 'g' },
        { id: 'prod1', name: 'Espresso', stock: 100, unit: 'unidades', price: 35.00 },
        { id: 'prod2', name: 'Latte', stock: 80, unit: 'unidades', price: 45.00 },
        { id: 'prod3', name: 'Croissant', stock: 30, unit: 'unidades', price: 25.00 },
        { id: 'prod4', name: 'Té Verde', stock: 70, unit: 'unidades', price: 30.00 } // Más productos para probar
    ];

    let orders = []; // Para almacenar todos los pedidos (tanto de admin/mesero como de clientes)
    let productSalesCount = {}; // Para el reporte de productos más vendidos

    // Variables para el pedido actual (serán usadas tanto por el admin/mesero como por el cliente)
    let currentOrderItems = [];
    let currentOrderTotal = 0;

    // --- Lógica de la Página de Administración (index.html) ---
    if (isAdminPage) {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        const loginSection = document.getElementById('login-section');
        const dashboardSection = document.getElementById('dashboard-section');
        const inventorySection = document.getElementById('inventory-section');
        const ordersSection = document.getElementById('orders-section'); // La sección de pedidos del admin
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
                            renderMenuAdmin(); // Carga el menú específico para admin/mesero
                        } else if (item.section === reportsSection) {
                            renderFinancialReports(); // Carga los reportes
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
        const newItemUnitSelect = document.getElementById('item-unit');
        const saveNewItemBtn = document.getElementById('save-new-item');

        function renderInventory() {
            inventoryList.innerHTML = '';
            inventory.forEach(item => {
                const li = document.createElement('li');
                let status = '';
                const threshold = item.stock * 0.20;
                if (item.stock < threshold) {
                    status = '<span style="color: red; font-weight: bold;"> (¡Stock bajo!)</span>';
                }

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
            const itemUnit = newItemUnitSelect.value;

            if (itemName && !isNaN(itemStock) && itemStock >= 0) {
                const newId = 'item_' + Date.now();
                const isProduct = itemUnit === 'unidades';
                inventory.push({
                    id: newId,
                    name: itemName,
                    stock: itemStock,
                    unit: itemUnit,
                    price: isProduct ? 0.00 : undefined
                });
                renderInventory();
                addItemForm.classList.add('hidden');
                newItemNameInput.value = '';
                newItemStockInput.value = '';
                newItemUnitSelect.value = 'unidades';
                alert(`"${itemName}" agregado al inventario con unidad: ${itemUnit}.`);
            } else {
                alert('Por favor, ingresa un nombre, stock válido y selecciona una unidad para el nuevo ítem.');
            }
        });

        // --- Funcionalidad de Pedidos (RN-015, RN-006, RN-012, RN-018, RN-013, RN-014) para Admin/Mesero ---
        const menuDisplayAdmin = document.getElementById('menu-display');
        const orderListAdmin = document.getElementById('order-list');
        const orderTotalSpanAdmin = document.getElementById('order-total');
        const placeOrderBtnAdmin = document.getElementById('place-order-btn');
        const cancelOrderBtnAdmin = document.getElementById('cancel-order-btn');

        function renderMenuAdmin() { // Función para renderizar el menú en la página de administración
            menuDisplayAdmin.innerHTML = '<h3>Menú</h3>';
            // Filtrar productos disponibles (ítems con precio y stock > 0)
            const availableProducts = inventory.filter(item => item.price !== undefined && item.stock > 0);

            if (availableProducts.length === 0) {
                menuDisplayAdmin.innerHTML += '<p>No hay productos disponibles en el menú en este momento.</p>';
            }

            availableProducts.forEach(product => {
                const productDiv = document.createElement('div');
                let popularTag = ''; // Lógica para RN-014 si se implementara completamente
                productDiv.innerHTML = `
                    <span>${product.name} - $${product.price.toFixed(2)}</span> ${popularTag}
                    <button data-id="${product.id}" class="add-to-order-btn-admin">Agregar</button>
                `;
                menuDisplayAdmin.appendChild(productDiv);
            });

            menuDisplayAdmin.querySelectorAll('.add-to-order-btn-admin').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const product = inventory.find(item => item.id === productId);

                    if (product && product.stock > 0) {
                        currentOrderItems.push(product);
                        product.stock--; // Simular reducción de inventario (temporal para el pedido)
                        updateOrderSummaryAdmin(); // Usa la función de resumen para admin
                        renderMenuAdmin(); // Actualizar el menú si se agota un producto
                    } else if (product && product.stock <= 0) {
                        alert(`¡${product.name} está agotado! No se puede registrar el pedido (RN-008).`);
                    }
                });
            });

            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour > 21 || (currentHour === 21 && currentMinute >= 30)) {
                placeOrderBtnAdmin.disabled = true;
                menuDisplayAdmin.querySelectorAll('.add-to-order-btn-admin').forEach(btn => btn.disabled = true);
                alert('Las funciones de venta están desactivadas después de las 9:30 PM (RN-012).');
            } else {
                placeOrderBtnAdmin.disabled = false;
            }
        }

        function updateOrderSummaryAdmin() { // Función de resumen para admin
            orderListAdmin.innerHTML = '';
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
                    orderListAdmin.appendChild(li);
                    currentOrderTotal += itemPrice;
                }
            }
            orderTotalSpanAdmin.textContent = currentOrderTotal.toFixed(2);
        }

        placeOrderBtnAdmin.addEventListener('click', () => {
            if (currentOrderItems.length === 0) {
                alert('No hay productos en el pedido.');
                return;
            }

            const order = {
                id: 'ORD_ADMIN' + Date.now(), // ID para pedidos de admin
                items: currentOrderItems.map(item => ({ id: item.id, name: item.name, price: item.price })), // Guardar copia de ítems
                total: currentOrderTotal,
                timestamp: new Date().toISOString(),
                status: 'Pendiente',
                customer: currentUser.role // Indicar que fue un pedido del personal
            };
            orders.push(order); // Añadir a la lista global de pedidos

            currentOrderItems.forEach(item => {
                productSalesCount[item.id] = (productSalesCount[item.id] || 0) + 1;
            });

            alert('Pedido realizado con éxito!');
            console.log('Nuevo Pedido (Admin/Mesero):', order);

            // Resetear el pedido y actualizar inventario (esto es una simulación)
            currentOrderItems = [];
            updateOrderSummaryAdmin();
            renderMenuAdmin();

            if (currentUser.role === 'Mesero') {
                console.log(`Alerta: Nuevo pedido registrado por Mesero. ID: ${order.id}. Visible para Baristas.`);
            }
        });

        cancelOrderBtnAdmin.addEventListener('click', () => {
            const confirmCancel = confirm('¿Estás seguro de que quieres cancelar el pedido?');
            if (confirmCancel) {
                currentOrderItems.forEach(item => {
                    const productInInventory = inventory.find(p => p.id === item.id);
                    if (productInInventory) {
                        productInInventory.stock++;
                    }
                });
                currentOrderItems = [];
                updateOrderSummaryAdmin();
                renderMenuAdmin();
                alert('Pedido cancelado.');
            }
        });

        // --- Gestión de Pagos y Caja (RN-003, RN-016, RN-002, RN-004, RN-017) ---
        const closeCashRegisterBtn = document.getElementById('close-cash-register-btn');
        const dailyReportsDiv = document.getElementById('daily-reports');

        if (closeCashRegisterBtn) {
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
        }

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
            if (dailyReportsDiv) dailyReportsDiv.innerHTML = reportContent;
        }

        function renderFinancialReports() {
            const financialReportsDisplay = document.getElementById('financial-reports-display');
            financialReportsDisplay.innerHTML = '<h3>Reportes Financieros Detallados</h3>';

            if (currentUser.role === 'Propietaria') {
                const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
                financialReportsDisplay.innerHTML += `
                    <h4>Ventas Totales</h4>
                    <p>Monto Total Vendido: <strong>$${totalSales.toFixed(2)}</strong></p>
                    <p>Número Total de Pedidos: <strong>${orders.length}</strong></p>
                `;

                financialReportsDisplay.innerHTML += `<h4>Productos Más Vendidos</h4>`;
                const sortedProducts = Object.keys(productSalesCount).map(productId => {
                    const product = inventory.find(item => item.id === productId);
                    return {
                        name: product ? product.name : 'Desconocido',
                        sold: productSalesCount[productId]
                    };
                }).sort((a, b) => b.sold - a.sold);

                if (sortedProducts.length > 0) {
                    const productsList = document.createElement('ul');
                    sortedProducts.forEach(prod => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${prod.name}: ${prod.sold} unidades vendidas`;
                        productsList.appendChild(listItem);
                    });
                    financialReportsDisplay.appendChild(productsList);
                } else {
                    financialReportsDisplay.innerHTML += `<p>Aún no hay productos vendidos para generar este reporte.</p>`;
                }

            } else {
                financialReportsDisplay.innerHTML += `<p>No tienes permisos para ver los reportes financieros detallados.</p>`;
            }
        }

        // --- Inicialización para la página de administración ---
        showSection(loginSection);
        updateNavigation();

    } else { // --- Lógica de la Página de Cliente (client_order.html) ---
        const clientMenuDisplay = document.getElementById('client-menu-display');
        const clientOrderList = document.getElementById('client-order-list');
        const clientOrderTotalSpan = document.getElementById('client-order-total');
        const clientPlaceOrderBtn = document.getElementById('client-place-order-btn');
        const clientCancelOrderBtn = document.getElementById('client-cancel-order-btn');
        const clientOrderSection = document.getElementById('client-order-section');

        // Función para renderizar el menú en la página del cliente
        function renderMenuClient() {
            clientMenuDisplay.innerHTML = ''; // Limpiar el menú anterior
            const availableProducts = inventory.filter(item => item.price !== undefined && item.stock > 0);

            if (availableProducts.length === 0) {
                clientMenuDisplay.innerHTML += '<p>¡Ups! Parece que no hay productos disponibles en este momento. Vuelve más tarde.</p>';
            }

            availableProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('menu-item');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button data-id="${product.id}" class="add-to-order-btn-client">Agregar</button>
                `;
                clientMenuDisplay.appendChild(productDiv);
            });

            clientMenuDisplay.querySelectorAll('.add-to-order-btn-client').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const product = inventory.find(item => item.id === productId);

                    if (product && product.stock > 0) {
                        currentOrderItems.push(product);
                        product.stock--; // Disminuir el stock para este pedido
                        updateOrderSummaryClient();
                        renderMenuClient(); // Actualizar el menú (por si un producto se agota)
                    } else if (product && product.stock <= 0) {
                        alert(`¡Lo sentimos! ${product.name} está agotado en este momento.`);
                    }
                });
            });

            // RN-012: Desactivar funciones de venta después de las 9:30 PM (también para el cliente)
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour > 21 || (currentHour === 21 && currentMinute >= 30)) {
                clientPlaceOrderBtn.disabled = true;
                clientMenuDisplay.querySelectorAll('.add-to-order-btn-client').forEach(btn => btn.disabled = true);
                if (!document.getElementById('closed-message')) {
                    const message = document.createElement('p');
                    message.id = 'closed-message';
                    message.style.color = 'red';
                    message.style.fontWeight = 'bold';
                    message.textContent = '¡Lo sentimos! Hemos cerrado la toma de pedidos por hoy. Vuelve mañana a partir de las 7:00 AM.';
                    clientMenuDisplay.appendChild(message);
                }
            } else {
                clientPlaceOrderBtn.disabled = false;
            }
        }

        // Función para actualizar el resumen del pedido del cliente
        function updateOrderSummaryClient() {
            clientOrderList.innerHTML = '';
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
                    clientOrderList.appendChild(li);
                    currentOrderTotal += itemPrice;
                }
            }
            clientOrderTotalSpan.textContent = currentOrderTotal.toFixed(2);
        }

        clientPlaceOrderBtn.addEventListener('click', () => {
            if (currentOrderItems.length === 0) {
                alert('Por favor, agrega al menos un producto a tu pedido.');
                return;
            }

            const customerName = prompt("¡Gracias por tu pedido! Por favor, ingresa tu nombre (o número de mesa):");
            if (!customerName || customerName.trim() === '') {
                alert("Pedido cancelado. Por favor, ingresa un nombre para continuar.");
                return;
            }

            const order = {
                id: 'ORD_CLIENT' + Date.now(),
                items: currentOrderItems.map(item => ({ id: item.id, name: item.name, price: item.price })),
                total: currentOrderTotal,
                timestamp: new Date().toISOString(),
                status: 'Pendiente',
                customer: customerName.trim()
            };

            // ALMACENAR EL PEDIDO EN SESSIONSTORAGE ANTES DE REDIRIGIR A LA PÁGINA DE PAGO
            sessionStorage.setItem('currentClientOrder', JSON.stringify(order));

            // Guardar el pedido en la lista global de pedidos (para que el admin lo vea en sus reportes)
            orders.push(order);
            
            // Actualizar productSalesCount para los reportes de productos más vendidos
            currentOrderItems.forEach(item => {
                productSalesCount[item.id] = (productSalesCount[item.id] || 0) + 1;
            });


            console.log(`¡Nuevo Pedido de Cliente! Nombre: ${customerName}, Total: $${currentOrderTotal.toFixed(2)}. Redirigiendo a pago.`);

            // Resetear el pedido del cliente y el menú antes de redirigir
            currentOrderItems = [];
            updateOrderSummaryClient();
            // No llamar a renderMenuClient() aquí, ya que vamos a cambiar de página.

            // REDIRIGIR A LA PÁGINA DE SIMULACIÓN DE PAGO
            window.location.href = 'payment_simulation.html';
        });

        clientCancelOrderBtn.addEventListener('click', () => {
            const confirmCancel = confirm('¿Estás seguro de que quieres cancelar todo tu pedido?');
            if (confirmCancel) {
                currentOrderItems.forEach(item => {
                    const productInInventory = inventory.find(p => p.id === item.id);
                    if (productInInventory) {
                        productInInventory.stock++; // Devolver el stock
                    }
                });
                currentOrderItems = [];
                updateOrderSummaryClient();
                renderMenuClient();
                alert('Pedido cancelado.');
            }
        });

        // --- Inicialización para la página de cliente ---
        // Asegúrate de que la sección del cliente sea visible al cargar
        clientOrderSection.classList.add('active');
        renderMenuClient(); // Carga el menú al iniciar la página del cliente
    }
});
