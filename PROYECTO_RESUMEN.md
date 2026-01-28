# Nexus CRM - Resumen del Proyecto

Este documento detalla las funcionalidades principales y la arquitectura técnica del sistema Nexus CRM, desarrollado para la gestión inmobiliaria avanzada.

## 🚀 Arquitectura Técnica
*   **Frontend**: React + TypeScript + Vite.
*   **Estilos**: Tailwind CSS con diseño de alta fidelidad (Glassmorphism, Modo Oscuro).
*   **Base de Datos**: Supabase (PostgreSQL) con autenticación integrada.
*   **Animaciones**: Framer Motion para transiciones y micro-interacciones suaves.
*   **Iconos**: Lucide React.
*   **Gráficos**: Recharts para visualización de métricas.

## ✨ Funcionalidades Implementadas

### 1. Dashboard Inteligente
*   **KPIs en Tiempo Real**: Visualización de ventas totales, propiedades activas, rentabilidad neta y agentes operativos.
*   **Gráficos de Tendencia**: Seguimiento mensual de ingresos.
*   **Feed de Actividad**: Registro dinámico de las últimas acciones realizadas por el equipo.

### 2. Gestión de Propiedades
*   **Inventario Completo**: Lista filtrable por estados (Captado, Visitado, Vendido, etc.).
*   **Captación Nueva**: Modal optimizado para añadir inmuebles con asignación de agentes.
*   **Detalle Profundo**: Ficha técnica del inmueble con visor de imágenes y datos de transacciones.
*   **Bitácora de CRM**: Historial cronológico de interacciones (visitas, llamadas, ofertas) por cada propiedad.

### 3. Centro de Notificaciones
*   **Alertas Globales**: Sistema de notificaciones en tiempo real para eventos críticos.
*   **Tipos de Alerta**: Éxito (Verde), Advertencia (Ámbar), Info (Azul) y Error (Rojo).
*   **Gestión de Estado**: Contador de notificaciones no leídas y panel de limpieza.

### 4. Gestión de Equipo (Agentes)
*   **Control de Roles**: Diferenciación de permisos entre Administradores, Editores y Agentes.
*   **Administración**: Alta y baja de miembros con confirmación de seguridad.

### 5. Administración de Sistema
*   **Modo Mantenimiento**: Interruptor global para restringir acceso durante actualizaciones técnicas.
*   **Monitor de Recursos**: Visualización simulada de uso de CPU, RAM y latencia.

## 🔐 Seguridad
*   **Autenticación**: Manejo integral de sesiones mediante Supabase Auth.
*   **Protección de Rutas**: Acceso restringido a usuarios no autenticados.

---
*Desarrollado con alto estándar de diseño y funcionalidad real.*
