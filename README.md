# Shipment Tracker Frontend

<p align="center">
  <img src="./src/public/Logo-Banner.png" alt="Shipment Tracker banner" width="720" />
</p>


Frontend para rastrear envios de DHL y consultar pedidos asociados a un usuario. La aplicacion esta construida con React, TypeScript y Vite.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3068B7?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)

## Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Leaflet y React Leaflet
- React Hook Form y Zod
- CSS Modules
- Vitest

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`
- npm
- Backend disponible en la URL configurada por `VITE_API_BASE_URL`

## Configuracion

Copia el archivo de ejemplo y ajusta la URL del backend si es necesario:

```bash
cp .env.example .env
```

Variable disponible:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Si no se define `VITE_API_BASE_URL`, la aplicacion usa `http://127.0.0.1:8000` por defecto.

## Instalacion

```bash
npm install
```

## Ejecucion local

```bash
npm run dev
```

Por defecto, Vite levanta la aplicacion en:

```text
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Compila TypeScript y genera la version de produccion en `dist/`.

```bash
npm run preview
```

Sirve localmente el build de produccion.

```bash
npm test
```

Ejecuta las pruebas con Vitest.

## Estructura del proyecto

```text
src/
  app/                 Configuracion de rutas
  components/
    auth/              Componentes de autenticacion
    layout/            Shell principal de la app
    orders/            Tabla, filtros, mapa y panel de detalle
    ui/                Componentes reutilizables
  pages/               Paginas principales
  providers/           AuthProvider y estado de sesion
  services/            Cliente API y servicios HTTP
  styles/              Reset y tokens globales
  types/               Tipos TypeScript compartidos
  utils/               Utilidades de fechas, estados y coordenadas
```
