# Setup Supabase para Inmobiliaria API

## Paso 1: Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Crea un nuevo proyecto (free tier está disponible)
3. Espera a que se inicialice
4. Copia las credenciales desde **Settings > Database**

## Paso 2: Configurar variables de entorno local

Copia `.env.example` a `.env` y reemplaza con tus credenciales de Supabase:

```bash
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_aqui
PORT=3000
FRONTEND_URL=http://localhost:3001
```

## Paso 3: Instalar dependencias PostgreSQL

```bash
npm install
# Ya está pg en package.json
```

## Paso 4: Test local con Supabase

```bash
# Corre la API en dev
npm run dev

# Verifica que compile y conecte:
# ✅ API running on port 3000 | Environment: development
```

## Paso 5: Deploy en producción

1. **Backend (API)**: Deploy en Vercel, Render o Railway
   - Pon las variables de entorno en el panel del proveedor
   - Supabase da URLs públicas de Postgre, úsalas directamente

2. **Frontend (Next.js)**: Deploy en Vercel
   - Pon NEXT_PUBLIC_API_URL=tu_api_en_produccion
   - Vercel auto-detecta Next.js

3. **Base de datos**: Ya está en Supabase, no hay que hacer nada
   - Las entidades se sincronizarán automáticamente en el primer run
   - En producción, `synchronize: false` para evitar cambios accidentales

## Variables importantes

| Variable | Supabase get from |
|----------|------------------|
| `DB_HOST` | Settings > Database > Host |
| `DB_USER` | postgres (default) |
| `DB_PASSWORD` | Tu contraseña Supabase |
| `DB_NAME` | postgres (default) |

## Debugging

Si falla conexión:
```bash
# Test conexión PostgreSQL local
psql -h localhost -U postgres -d postgres

# Test Supabase remoto
psql -h your-project.supabase.co -U postgres
```

## Cambios hechos para Supabase

✅ `database.service.ts`: MySQL → PostgreSQL  
✅ `package.json`: mysql2 → pg  
✅ `main.ts`: CORS flexible, puerto configurable  
✅ `.env.example`: Variables de Supabase  

Todos los nombres de variables de negocio se mantuvieron igual.
