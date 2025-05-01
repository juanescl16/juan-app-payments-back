# Payment App - Backend

Backend API desarrollada como parte de la prueba técnica para integración de pagos usando Wompi.

---

## 📦 Tecnologías utilizadas

- Node.js
- NestJS
- PostgreSQL
- TypeORM
- Docker
- Jest (pruebas unitarias)
- Swagger (documentación de API)
- Hexagonal Architecture (Ports & Adapters)
- Railway Oriented Programming (ROP)

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/juanescl16/juan-app-payments-back.git
cd juan-app-payments-back
```

2. Instalar dependencias:

```
npm install
```

3. Clonar el archivo `.env.template` y renombrarlo a `.env`

4. Levantar base de datos PostgreSQL con Docker:

```
docker-compose up -d
```

Levantar el servidor NestJS en desarrollo:

```
npm run start:dev
```

Una vez levantado el servidor, puedes acceder a Swagger en:

```
http://localhost:3000/api
```

Notas: 

La aplicación sigue una estructura basada en Hexagonal Architecture:
src/
├── common/ (utils, Result pattern)
├── products/ (dominio, casos de uso, infraestructura)
├── transactions/ (dominio, casos de uso, infraestructura)
├── wompi/ (integración con API de Wompi)
├── app.module.ts (configuración global)

Para correr pruebas:

```
npm run test
```

Para generar reporte de cobertura:

```
npm run test:cov
```

Notas:
El sistema simula un flujo de compra de productos y pagos con tarjeta.
Usa principios de arquitectura limpia para mantener el código desacoplado y testeable.
Las pruebas cubren los principales casos de uso (crear transacción, pagar, actualizar estado, etc).