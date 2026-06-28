# Nexus Sales Portal — v0.9.0

Portal comercial interno para equipos de venta de energía, telefonía y alarmas. Hub centralizado con asistente IA, gestión de leads en tiempo real y panel de administración.

---

## Módulos

### 1. Suite Comercial — Escritorio del agente
- **Lanzadera de apps**: acceso a herramientas externas embebidas mediante iframe, sin salir del portal.
- **AgentDashboard**: KPIs de leads en tiempo real por agente (nuevo / en proceso / finalizado) con Supabase Realtime.
- **Live Ticker**: barra de avisos urgentes con estética de mercados financieros.
- **Feed de noticias**: tarjetas dinámicas con promociones y actualizaciones del sector.
- **Barra de rendimiento**: visualización de objetivos comerciales.
- **Comisiones**: visor del informe de comisiones del CRM (configurable vía `NEXT_PUBLIC_COMISIONES_URL`).

### 2. NexusAI — Asistente comercial
- Chat embebido entrenado en argumentario de venta (energía, fibra, alarmas).
- Motor: Anthropic Claude (`@anthropic-ai/sdk`).
- Accesible desde cualquier pantalla sin abandonar el flujo de trabajo.

### 3. Presencia Corporativa
- Páginas Nosotros y Empresa con contenido configurable desde el admin.
- Formulario de captación de leads integrado con Supabase.
- Soporte completo dark/light mode y temas de color persistentes.

### 4. Panel de Administración
- Dashboard analítico con gráficas de leads por estado y por agente (Recharts).
- Mini CRM: asignación de leads a agentes, cambio de estado y notas de seguimiento.
- KanbanBoard de leads en tiempo real.
- Gestor de usuarios: perfiles, roles y permisos por app.
- Configurador no-code del sitio (contacto, footer, contenidos corporativos).
- Audit log de actividad (quién, qué, cuándo).

### 5. PWA & Movilidad
- Instalable en iOS, Android y Desktop.
- Service Worker para funcionamiento con conexión inestable.
- Diseño mobile-first, probado de móvil a ultrawide.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL + Realtime) |
| Autenticación | Supabase Auth (SSR) |
| IA | Anthropic Claude (`@anthropic-ai/sdk ^0.74`) |
| Internacionalización | next-intl 4 (ES / EN) |
| Gráficos | Recharts 3 |
| Iconos | Lucide React |
| Temas | next-themes + CSS custom properties persistidas en localStorage |

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=

# URL del informe de comisiones del CRM (deja vacío para mostrar pantalla "Próximamente")
NEXT_PUBLIC_COMISIONES_URL=
```

---

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5174
```

---

## Estado del proyecto

| Área | Estado |
|---|---|
| Autenticación y permisos | Completo |
| AgentDashboard + Realtime | Completo |
| NexusAI | Completo |
| Admin (KPIs, leads, usuarios, audit) | Completo |
| PWA / Service Worker | Completo |
| Internacionalización ES/EN | Completo |
| Comisiones | Pendiente de URL del CRM |
| Datos de producción (apps, noticias, leads) | Pendiente de configuración |
