# Sistema de Gestión para Cafetería "Café Luna"

Este es un prototipo de sistema de gestión para la cafetería "Café Luna", desarrollado con HTML, CSS y JavaScript puro. El sistema está diseñado para demostrar funcionalidades clave en la administración de una cafetería, incluyendo gestión de inventario, sistema de pedidos para el personal, reportes financieros y, ahora, una interfaz de pedidos para el cliente con simulación de pago.

## Funcionalidades Principales

El sistema aborda varios Requerimientos No Funcionales (RNF) y Funcionales (RNF) clave para una operación eficiente:

### Para el Personal (Interfaz de Administración)
Accesible vía `index.html`

* **RNF-001 (Autenticación de Usuarios):** Sistema de inicio de sesión con roles diferenciados.
* **RNF-005 (Dashboard):** Panel de control principal después del inicio de sesión.
* **RNF-007 (Control de Inventario):** Visualización y gestión de stock de ingredientes y productos.
* **RNF-008 (Gestión de Stock):** No permite agregar productos a pedidos si el stock es 0.
* **RNF-010 (Edición de Inventario):** La propietaria puede editar y agregar ítems al inventario.
* **RNF-006 (Sistema de Pedidos):** Registro de pedidos por parte del personal (Baristas/Meseros).
* **RNF-012 (Horario de Venta):** Deshabilita la toma de pedidos (y pagos) después de las 9:30 PM.
* **RNF-013 (Gestión de Pedidos):** Simulación de seguimiento y manejo de pedidos.
* **RNF-014 (Productos Populares):** (Futura Implementación/Indicador) Permite identificar productos de alta demanda.
* **RNF-003 (Cierre de Caja):** Simulación de proceso de cierre de caja.
* **RNF-016 (Reportes de Ventas):** Generación de reportes diarios y financieros (accesible solo por propietaria).
* **RNF-017 (Registro de Pagos):** Simulación de registro de transacciones de pago.

### Para el Cliente (Interfaz de Pedidos)
Accesible vía `client_order.html`

* **Página Exclusiva de Pedidos:** Una interfaz simplificada para que los clientes exploren el menú y realicen sus pedidos sin necesidad de autenticación.
* **Visualización del Menú:** Muestra los productos disponibles del inventario con sus precios.
* **Construcción de Pedidos:** Los clientes pueden añadir ítems a su carrito.
* **Resumen del Pedido:** Muestra el total a pagar y los productos seleccionados.
* **RNF-012 (Horario de Venta):** También deshabilita la toma de pedidos para clientes después de las 9:30 PM.

### Simulación de Proceso de Pago
Accesible vía `payment_simulation.html` (Redireccionado desde `client_order.html`)

* **Simulación de Pago con Tarjeta:** Una página para demostrar el proceso de pago con un formulario de tarjeta de crédito/débito.
* **Resumen del Monto:** Muestra el total a pagar del pedido que se va a procesar.
* **Validación Básica:** Incluye validaciones simples de formato para los campos de la tarjeta.
* **Estado de la Transacción:** Simula un resultado exitoso o fallido del pago con un mensaje al usuario.
* **RNF-017 (Registro de Pagos):** Aunque es una simulación, representa el punto donde se registraría la transacción.

## Estructura del Proyecto:

├── index.html                  # Interfaz de administración (login, dashboard, inventario, pedidos, reportes)
├── client_order.html           # Interfaz para que el cliente realice pedidos
├── payment_simulation.html     # Interfaz de simulación de pago con tarjeta
├── style.css                   # Estilos CSS para ambas interfaces
├── script.js                   # Lógica JavaScript (autenticación, inventario, pedidos, reportes)
└── README.md                   # Este archivo

## Acceso y Navegación

### Credenciales de Acceso (para `index.html`)

| Usuario       | Contraseña | Rol         | Secciones Accesibles                 |
| :------------ | :--------- | :---------- | :----------------------------------- |
| `propietaria` | `pass123`  | Propietaria | Dashboard, Inventario, Pedidos, Pagos y Caja, Reportes |
| `barista`     | `pass123`  | Barista     | Dashboard, Pedidos                   |
| `mesero`      | `pass123`  | Mesero      | Dashboard, Pedidos                   |

### Enlaces para Demostración

* **Interfaz de Administración:** [TuLinkDeGitHubPages]/index.html
    * Ejemplo: `https://TuUsuario.github.io/tu-repositorio/index.html`
* **Interfaz de Pedidos para Clientes:** [TuLinkDeGitHubPages]/client_order.html
    * Ejemplo: `https://TuUsuario.github.io/tu-repositorio/client_order.html`

**Nota:** Reemplaza `[TuLinkDeGitHubPages]` o `TuUsuario.github.io/tu-repositorio/` con la URL real de tu GitHub Pages.

## Cómo Usar (Localmente)

1.  Clona o descarga este repositorio.
2.  Abre los archivos `index.html`, `client_order.html` o `payment_simulation.html` directamente en tu navegador.

## Estado del Proyecto

Este es un prototipo demostrativo. Los datos de inventario y pedidos son volátiles y se reinician al recargar la página, ya que no hay una base de datos persistente. La funcionalidad de pago es meramente una simulación.

---
