# BK3-Supabase
🛒 Proyecto POS — Módulo 2

Frontend React + TypeScript + Supabase (Auth, DB, Policies)
Verdulería / Minimarket — Punto de Venta (POS)

📌 1. Descripción General

El Módulo 2 integra completamente el frontend del POS con Supabase: datos reales en Postgres, autenticación, control de roles y registro de ventas y movimientos de caja en tiempo real.

Objetivo: lograr un POS funcional y conectado, operado por usuarios de tipo admin y cajero.

📌 2. Alcance del Módulo 2

❌ Funcionalidades NO implementadas en esta fase
- Integración real con balanza física
- Impresión de tickets ESC/POS
- Facturación electrónica SUNAT
- Reportes contables avanzados / dashboard financiero
- Permisos avanzados por pantalla

✅ Funcionalidades implementadas correctamente
- Modelo de base de datos real en Supabase
- Tablas: `users`, `categories`, `products`, `sales_header`, `sales_detail`, `cash_movements`
- Autenticación real con Supabase Auth
- Sistema de roles (admin/cajero)
- Inicio de sesión real
- Listado de productos desde Supabase
- Registro de ventas (cabecera + detalle)
- Registro de movimientos de caja: apertura, ingreso, salida, cierre
- Cálculo de totales y saldos
- Persistencia completa en base de datos (sin localStorage)
- Panel del cajero 100% funcional

⚠️ Funcionalidad parcial
- Reporte de caja para administradores (admin): el cajero registra correctamente; el administrador no visualiza todavía por conflicto entre `user_id` y políticas RLS. Pendiente de alineación.

📌 3. Arquitectura del Proyecto

🖥️ Frontend
- React + TypeScript + Vite
- Tailwind CSS
- Rutas protegidas según rol
- Servicios modulares (`services/`)
- Contexto global de sesión
- Componentes limpios y reutilizables

☁️ Backend (Supabase)
- Base de datos Postgres
- Supabase Auth
- Row Level Security (RLS)
- Policies configuradas para admin y cajero
- Modelo relacional completo

📌 4. Modelo de Base de Datos

Tablas utilizadas:
- `users`
  - Campos: `id (uuid, FK a auth.users.id)`, `auth_user_id (uuid, id real de Auth)`, `email (text)`, `role (text: admin/cajero)`, `created_at (timestamptz)`
- `categories`
  - Campos: `id`, `name`
- `products`
  - Campos: `id`, `name`, `price`, `category_id`, `image_url`, `is_active`
- `sales_header`
  - Campos: `id`, `user_id`, `total`, `payment_method`, `created_at`
- `sales_detail`
  - Campos: `id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`
- `cash_movements`
  - Campos: `id`, `user_id`, `type`, `amount`, `note`, `created_at`, `auth_user_id`

📌 5. Políticas RLS implementadas

✔ Cajero puede insertar movimientos
```
CREATE POLICY "cajero puede insertar movimientos"
ON cash_movements
FOR INSERT
TO authenticated
USING (auth.uid() = auth_user_id);
```

✔ Cajero solo ve sus movimientos
```
CREATE POLICY "cajero ve sus movimientos"
ON cash_movements
FOR SELECT
USING (user_id = auth.uid());
```

✔ Admin ve todos los movimientos
```
CREATE POLICY "admin ve todo"
ON cash_movements
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');
```

📌 6. Flujo funcional logrado

👤 Cajero
- Inicia sesión
- Ve la lista de productos
- Registra ventas
- Movimientos de caja: apertura, ingreso, salida, cierre
- Todo se registra en Supabase correctamente

👨‍💼 Administrador
- Inicia sesión
- Puede ver: Usuarios, Productos, Categorías, Historial de ventas
- ❌ Pendiente: Ver reporte de caja (por conflicto técnico en `user_id`)

📌 7. Problemas encontrados y soluciones aplicadas

❗ Problema 1 — Reporte de caja no muestra data al admin
- Causa: la tabla `cash_movements` tiene `user_id` (UUID manual del grupo) y `auth_user_id` (UUID real de Supabase Auth). Las policies filtran con `auth.uid()`, pero el frontend lee `user_id`.
- Estado: ✔ El cajero registra bien; ❌ El admin no ve los datos. Se documenta como pendiente del módulo.

📌 8. Capturas obligatorias para entregar

El grupo debe adjuntar en Drive:
- 🟢 Supabase Studio: tablas creadas, datos insertados, policies RLS, Auth → lista de usuarios, diagrama relacional (Schema Visualizer)
- 🟢 Frontend: login funcionando, panel de cajero, registro de ventas, movimientos de caja funcionando, vista admin, error del reporte de caja (documentado)

📌 9. Estructura final del proyecto (Frontend)
```
frontend/
│
├── public/
├── src/
│   ├── assets/
│   │   ├── carrusel/
│   │   ├── evidencias/
│   │   ├── iconos/
│   │   └── imágenes de productos
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── CashierLayout.tsx
│   │   │   └── ClientLayout.tsx
│   │   ├── CartModal.tsx
│   │   ├── Filters.tsx
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── SearchBar.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Categorias.tsx
│   │   │   ├── Configuracion.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HistorialVentas.tsx
│   │   │   ├── MovimientosCaja.tsx
│   │   │   ├── Productos.tsx
│   │   │   ├── ReporteCaja.tsx
│   │   │   ├── ReportesVentas.tsx
│   │   │   └── Usuarios.tsx
│   │   ├── cajero/
│   │   │   ├── MisVentas.tsx
│   │   │   ├── MovimientosCaja.tsx
│   │   │   ├── POS.tsx
│   │   │   └── Perfil.tsx
│   │   ├── client/
│   │   │   ├── Login.tsx
│   │   │   ├── Pedidos.tsx
│   │   │   ├── Perfil.tsx
│   │   │   └── Register.tsx
│   │   ├── checkout.tsx
│   │   ├── inicio.tsx
│   │   ├── preguntas.tsx
│   │   ├── productos.tsx
│   │   ├── trabaja-con-nosotros.tsx
│   │   └── ubicame.tsx
│   ├── router/
│   │   └── AppRouter.tsx
│   ├── services/
│   │   ├── assetsMap.ts
│   │   ├── authService.ts
│   │   ├── cashService.ts
│   │   ├── categoryService.ts
│   │   ├── credenciales.ts
│   │   ├── productService.ts
│   │   ├── salesService.ts
│   │   ├── supabaseClient.ts
│   │   ├── testConnection.ts
│   │   └── userService.ts
│   ├── styles/
│   │   └── app.css
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── package.json
├── vite.config.ts
└── README.md
```
📌 10. Conclusión del Módulo 2

El equipo completó:
- ✔ Conexión total del POS con Supabase
- ✔ Login + Roles
- ✔ CRUD real de productos, categorías y usuarios
- ✔ Registro verdadero de ventas
- ✔ Registro real de caja
- ✔ Seguridad por RLS
- ✔ Deploy funcional y estable

❗ Único pendiente:
- El reporte de caja para administrador requiere alinear `user_id`, `auth_user_id` y policies RLS.

El módulo cumple criterios fundamentales y demuestra un POS funcional conectado a una base de datos real.

📸 Evidencias Supabase

Tablas Supabase:
- Diagrama relacional del esquema `public` con entidades y relaciones principales: `users`, `categories`, `products`, `sales_header`, `sales_detail`, `cash_movements`.
- Conexiones clave: `sales_header.user_id` → usuario; `sales_detail.sale_id` → cabecera; `sales_detail.product_id` → producto; `products.category_id` → categoría; `cash_movements` con `user_id` y `auth_user_id`.

![Tablas Supabase](frontend/src/assets/evidencias/tabla%20supabase.png)

Tabla `users` (información real):
- Registros con `id`, `auth_user_id`, `email`, `role`, `created_at`.
- Roles operativos: `admin`, `cajero`, `cliente`.

![Tabla users](frontend/src/assets/evidencias/tabla%20users.png)

Tabla `sales_header` (información real):
- Cabeceras de venta con `user_id`, `total`, `payment_method`, `created_at`.
- Métodos de pago utilizados: efectivo, yape, tarjeta.

![Tabla sales_header](frontend/src/assets/evidencias/tabla%20sales_header.png)

Tabla `sales_detail` (información real):
- Ítems por venta con `product_id`, `quantity`, `unit_price`, `subtotal`.
- Integridad referencial con `sales_header.id`.

![Tabla sales_detail](frontend/src/assets/evidencias/tabla%20sales_detail.png)

Productos reales (con imágenes desde Storage público de Supabase):
- Catálogo con `name`, `price`, `category_id`, `image_url`, `is_active`, `created_at`.
- `image_url` apunta a un bucket público para servir imágenes vía HTTP.

![Tabla products](frontend/src/assets/evidencias/tabla%20products.png)

Bucket de imágenes (Storage):
- Se creó un bucket público en Supabase para almacenar las imágenes de productos y referenciarlas desde `products.image_url`.

![Bucket en Supabase](frontend/src/assets/evidencias/store%20bucket.png)
![Imágenes en el bucket](frontend/src/assets/evidencias/imagenes%20bucket.png)

Tabla `categories` (información real):
- Catálogo de categorías utilizadas por `products.category_id`.

![Tabla categories](frontend/src/assets/evidencias/tabla%20categories.png)

Tabla `cash_movements` (información real):
- Movimientos de caja con `user_id`, `auth_user_id`, `type`, `amount`, `note`, `created_at`.
- Alineado con políticas RLS para inserción por cajero y visibilidad por rol.

![Tabla cash_movements](frontend/src/assets/evidencias/tabla%20cash_movements.png)
