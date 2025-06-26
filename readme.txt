# Sistema de Gestión para Cafetería "Café Luna"

Este proyecto es una propuesta de sistema integral de gestión para la cafetería "Café Luna", diseñado para optimizar sus operaciones diarias, desde el manejo de pedidos hasta el control de inventario y la generación de reportes financieros.

## Problemática Identificada

Actualmente, "Café Luna" enfrenta desafíos debido al manejo manual de sus operaciones, lo que genera pérdidas operativas, dificultades en el control de inventario y una comunicación ineficiente entre el personal.

## Propuesta Central

Implementar un sistema digital completo que elimine el manejo manual de pedidos, proporcione control automático del inventario, genere reportes financieros detallados, respete las reglas operativas internas y mejore la comunicación entre el personal, garantizando un servicio más eficiente y reduciendo las pérdidas operativas.

## Funcionalidades Principales

1.  **Control Automático de Inventario:**
    * Registro permanente de ingredientes y productos.
    * Alertas automáticas si el stock de un ingrediente baja del 20% (RN-010).
    * Solo el Barista Senior puede editar el inventario (RN-007).
    * No se permite registrar pedidos si no hay inventario suficiente (RN-008).

2.  **Sistema Digital de Pedidos Multiplataforma:**
    * Menú dinámico que solo muestra productos disponibles.
    * Cálculo automático de totales (productos + IVA – descuento) (RN-015).
    * Descuentos mayores al 15% requieren autorización de la Propietaria (RN-006).
    * Funciones de venta desactivadas después de las 9:30 PM (RN-012).
    * No se pueden cancelar pedidos si faltan menos de 30 minutos para la entrega (RN-018).
    * Asignación automática de "cliente frecuente" (más de 10 compras/mes) (RN-013).
    * Marcar producto como "popular" si supera 50 unidades vendidas/semana (RN-014).
    * Autenticación de usuario con credenciales únicas (RN-009).

3.  **Gestión Completa de Pagos y Caja:**
    * Registro de pagos en efectivo o bancarios.
    * Control automático de cierre de caja (antes de las 9:30 PM) (RN-003).
    * Reportes diarios generados automáticamente (7:00 AM - 9:00 PM) (RN-016).
    * Sistema operativo desde 6:30 AM (RN-002).
    * Extensión de horario en días festivos hasta las 10:00 PM con autorización (RN-004).
    * Backup automático cada 4 horas y a las 10:00 PM (RN-017 - **NOTA: Esta funcionalidad se implementaría a nivel de backend**).

4.  **Sistema de Comunicación Interna:**
    * Coordinación de roles: Propietaria, Barista Senior, Barista, Mesero.
    * Pedidos registrados por mesero aparecen instantáneamente a baristas.
    * Alertas automáticas distribuidas al equipo autorizado.

## Tecnologías Utilizadas

* **HTML5:** Estructura de la aplicación.
* **CSS3:** Estilos y diseño de la interfaz de usuario.
* **JavaScript (Vanilla JS):** Lógica del sistema, interactividad y manejo de datos del frontend.

## Cómo Ejecutar el Proyecto

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/cafe-luna-system.git](https://github.com/tu-usuario/cafe-luna-system.git)
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd cafe-luna-system
    ```
3.  **Abre el archivo `index.html` en tu navegador web preferido.** No necesitas un servidor local para empezar, ya que es un proyecto puramente de frontend.

## Credenciales de Prueba (Simuladas)

Para probar los diferentes roles:

* **Propietaria:** `usuario: propietaria`, `contraseña: pass123`
* **Barista Senior:** `usuario: baristasenior`, `contraseña: pass123`
* **Barista:** `usuario: barista`, `contraseña: pass123`
* **Mesero:** `usuario: mesero`, `contraseña: pass123`

## Futuras Mejoras (Consideraciones para el Backend)

Para una implementación completa y robusta de todas las reglas de negocio, especialmente las relacionadas con persistencia de datos, seguridad avanzada, backups y comunicación en tiempo real, se requeriría un **backend** con tecnologías como Node.js, Python/Django, PHP/Laravel, etc., y una base de datos (SQL o NoSQL).

Funcionalidades que idealmente requieren backend:
* Persistencia de inventario, pedidos, usuarios, etc.
* Sistema de autenticación y autorización seguro.
* Generación de reportes complejos.
* Manejo de transacciones de pago reales.
* Comunicación en tiempo real (websockets).
* Gestión de clientes y su historial de compras (RN-013).
* Contador de productos vendidos para determinar "popularidad" (RN-014).
* La funcionalidad de "backup automático" (RN-017) es puramente de backend.