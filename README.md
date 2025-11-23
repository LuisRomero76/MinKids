# API MinKids - Control Parental

Backend desarrollado con NestJS, TypeORM y JWT para una aplicación móvil de control parental.

## Estructura del Proyecto

```
src/
├── auth/               # Autenticación y JWT
├── user/               # Gestión de usuarios
├── parent-children/    # Relación padre-hijo
├── applications/       # Catálogo de apps
├── child-app-limits/   # Límites de uso de apps
├── child-app-usage/    # Registro de uso de apps
├── child-location/     # Ubicación de los hijos
└── Common/             # Enums, guards y decorators
```

## Endpoints

### 🔐 Autenticación (`/auth`)

#### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "padre"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

---

### 👥 Usuarios (`/user`)

Todos los endpoints requieren autenticación (Bearer token).

#### Listar todos los usuarios
```http
GET /user
Authorization: Bearer {token}
```

#### Obtener usuario por ID
```http
GET /user/:id
Authorization: Bearer {token}
```

---

### 👨‍👧 Relación Padre-Hijo (`/parent-children`)

**Requiere rol: PADRE**

#### Agregar hijo por código
```http
POST /parent-children/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "child_code": "ABC123"
}
```

#### Listar mis hijos
```http
GET /parent-children/my-children
Authorization: Bearer {token}
```

#### Eliminar vínculo con hijo
```http
DELETE /parent-children/:child_id
Authorization: Bearer {token}
```

---

### 📱 Aplicaciones (`/applications`)

**Requiere rol: PADRE**

#### Crear aplicación
```http
POST /applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "TikTok",
  "package_name": "com.zhiliaoapp.musically",
  "icon_url": "https://example.com/icon.png"
}
```

#### Listar todas las aplicaciones
```http
GET /applications
Authorization: Bearer {token}
```

#### Obtener aplicación por ID
```http
GET /applications/:id
Authorization: Bearer {token}
```

#### Actualizar aplicación
```http
PATCH /applications/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "TikTok Updated",
  "icon_url": "https://example.com/new-icon.png"
}
```

#### Eliminar aplicación
```http
DELETE /applications/:id
Authorization: Bearer {token}
```

---

### ⏱️ Límites de Uso (`/child-app-limits`)

**Requiere rol: PADRE**

#### Asignar límite
```http
POST /child-app-limits
Authorization: Bearer {token}
Content-Type: application/json

{
  "child_id": 2,
  "app_id": 1,
  "daily_limit_minutes": 60,
  "enabled": true
}
```

#### Actualizar límite
```http
PATCH /child-app-limits/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "daily_limit_minutes": 120,
  "enabled": false
}
```

#### Obtener límites de un hijo
```http
GET /child-app-limits/child/:child_id
Authorization: Bearer {token}
```

#### Eliminar límite
```http
DELETE /child-app-limits/:id
Authorization: Bearer {token}
```

---

### 📊 Registro de Uso (`/child-app-usage`)

#### Registrar uso (desde app del hijo)
```http
POST /child-app-usage/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "child_id": 2,
  "app_id": 1,
  "usage_minutes": 30,
  "date": "2025-11-22"
}
```

#### Obtener uso diario (solo padres)
```http
GET /child-app-usage/daily/:child_id?date=2025-11-22
Authorization: Bearer {token}
```

#### Obtener uso mensual (solo padres)
```http
GET /child-app-usage/monthly/:child_id?year=2025&month=11
Authorization: Bearer {token}
```

#### Obtener uso por app (solo padres)
```http
GET /child-app-usage/by-app/:child_id/:app_id?fecha_inicio=2025-11-01&fecha_fin=2025-11-30
Authorization: Bearer {token}
```

---

### 📍 Ubicación (`/child-location`)

#### Registrar ubicación (desde app del hijo)
```http
POST /child-location/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "child_id": 2,
  "latitude": -12.0464,
  "longitude": -77.0428
}
```

#### Obtener ubicación actual (solo padres)
```http
GET /child-location/current/:child_id
Authorization: Bearer {token}
```

#### Obtener histórico de ubicaciones (solo padres)
```http
GET /child-location/history/:child_id?fecha_inicio=2025-11-01T00:00:00&fecha_fin=2025-11-22T23:59:59
Authorization: Bearer {token}
```

---

## Seguridad

### Guards Implementados

1. **AuthGuard**: Verifica que el usuario esté autenticado con JWT
2. **RolesGuard**: Verifica que el usuario tenga el rol necesario

### Roles

- **padre**: Puede gestionar hijos, límites, ver estadísticas y ubicaciones
- **hijo**: Puede registrar uso de apps y ubicación

### Validaciones

- Verificación de vínculos padre-hijo antes de permitir acciones
- Validaciones con `class-validator` en todos los DTOs
- Manejo de errores con excepciones de NestJS

## Base de Datos

### Tablas Principales

1. **user**: Usuarios (padres e hijos)
2. **parent_child**: Relación padre-hijo
3. **application**: Catálogo de aplicaciones
4. **application_limit**: Límites de uso por hijo y app
5. **usage_time**: Registro de uso real
6. **location**: Registro de ubicaciones

### Relaciones

- `parent_child` → `user` (ManyToOne con parent y child)
- `application_limit` → `user` (ManyToOne)
- `application_limit` → `application` (ManyToOne)
- `usage_time` → `user` (ManyToOne)
- `usage_time` → `application` (ManyToOne)
- `location` → `user` (ManyToOne)

## Variables de Entorno

Crear archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=minkids
SECRET_KEY=your_jwt_secret_key
```

## Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm run start:dev

# Construir para producción
pnpm run build

# Ejecutar en producción
pnpm run start:prod
```

## Flujo de Uso

1. **Padre se registra** → Obtiene código único
2. **Hijo se registra** → Obtiene código único
3. **Padre agrega hijo** → Usa el código del hijo
4. **Padre configura apps** → Crea catálogo de apps
5. **Padre asigna límites** → Define minutos por app
6. **App del hijo** → Registra uso en tiempo real
7. **App del hijo** → Envía ubicación periódicamente
8. **Padre consulta** → Ve estadísticas y ubicación

---

Desarrollado con ❤️ para MinKids
