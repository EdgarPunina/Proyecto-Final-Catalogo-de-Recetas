# Catálogo de Recetas

Monorepo cliente-servidor para gestionar exclusivamente las recetas del usuario autenticado. Incluye registro, login, tokens Sanctum, CRUD, búsqueda por título, filtros por categoría/dificultad y orden descendente de creación. Los datos proceden de Laravel y persisten en SQLite; MySQL es una alternativa configurable.

## Estructura y stack

```text
catalogo-recetas/
├── backend/       Laravel 10, Sanctum 3, Eloquent, PHPUnit
│   ├── app/       Controllers, Requests, Resources, Services, Models, Observers
│   ├── database/ migraciones, factories y seeder
│   ├── tests/    pruebas de autenticación, CRUD, aislamiento y Observer
│   └── .env.example
├── frontend/      React 19, Vite 8, React Router 7
│   ├── src/      componentes, páginas y servicio API
│   ├── tests/    flujo real en Chrome con Playwright
│   └── .env.example
├── docs/ARQUITECTURA.md
└── .gitignore
```

Requisitos: PHP 8.1 o superior compatible con composer.lock, extensiones PDO/SQLite, mbstring, XML, ctype, curl, fileinfo, OpenSSL y tokenizer; Composer 2; Node.js 22.12+ o 24 LTS; npm; Git. Para MySQL se necesita pdo_mysql. El entorno comprobado usa PHP 8.1.25 y Node 24.16.0. Se conserva Laravel 10 del proyecto recibido por compatibilidad con PHP instalado.

## Instalar y levantar el backend

Desde la raíz, en PowerShell:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php -r "if (!file_exists('database/database.sqlite')) { touch('database/database.sqlite'); }"
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

En Linux/macOS sustituye `Copy-Item` por `cp`. No sobrescribas un `.env` existente al volver a iniciar el proyecto. SQLite queda en `backend/database/database.sqlite`, excluido de Git. La configuración resuelve la ruta incluida en el ejemplo desde el directorio del backend, tanto para HTTP como para Artisan.

Para MySQL crea una base vacía `catalogo_recetas` y configura en `.env` `DB_CONNECTION=mysql`, `DB_DATABASE=catalogo_recetas`, `DB_HOST`, `DB_PORT`, `DB_USERNAME` y `DB_PASSWORD` según tu servidor. Ejecuta después las migraciones. No publiques credenciales.

Para reiniciar únicamente una base de desarrollo desechable, `php artisan migrate:fresh --seed` elimina todas sus tablas y vuelve a crear los datos de demostración.

## Instalar y levantar el frontend

En otra terminal, desde la raíz:

```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev -- --host 127.0.0.1
```

Abre `http://127.0.0.1:5173`. El ejemplo contiene `VITE_API_URL=http://127.0.0.1:8000/api`; reinicia Vite si modificas esta variable. En Linux/macOS usa `npm` en lugar de `npm.cmd`. En Windows `.cmd` evita el bloqueo de scripts PowerShell sin cambiar la política del equipo.

## API

| Método | Ruta | Acceso |
|---|---|---|
| POST | /api/register | Público: name, email, password de al menos 8 caracteres |
| POST | /api/login | Público: email, password |
| POST | /api/logout | Token: revoca únicamente el token actual |
| GET | /api/user | Token: consulta la sesión, sin CRUD de usuarios |
| GET, POST | /api/recipes | Token: listar propias o crear |
| GET, PUT, PATCH, DELETE | /api/recipes/{recipe} | Token: consultar, modificar o eliminar propia |

Envía `Accept: application/json`, `Content-Type: application/json` si hay cuerpo y `Authorization: Bearer` seguido del token para rutas privadas. Registro y creación devuelven 201; credenciales inválidas y ausencia de token devuelven 401; validación devuelve 422 con `errors`. Una receta ajena o inexistente devuelve 404. PUT/PATCH admiten actualizar los campos enviados. Las recetas se serializan dentro de `data`; el servicio React centralizado extrae ese contenido.

Recipe contiene title, description opcional, ingredients e instructions como texto, category, difficulty (`easy`, `medium`, `hard`), preparation_time y cooking_time enteros no negativos, servings entero positivo e image_url opcional. La propiedad se toma del usuario autenticado: `user_id` enviado por el cliente no asigna ni cambia el propietario.

## Datos y comprobación del CRUD

| Usuario | Email | Contraseña de demostración | Recetas |
|---|---|---|---|
| Alice | alice@example.com | password123 | 3 |
| Bob | bob@example.com | password123 | 2 |

RecipeFactory genera recetas caseras con ingredientes e instrucciones reales, sin imágenes remotas ficticias. Son datos de demostración almacenados en la base, no mocks de React.

1. Registra una cuenta, cierra sesión y vuelve a entrar.
2. Crea una receta, comprueba su tarjeta y abre Ver detalle.
3. Pulsa Editar desde el detalle, guarda cambios y recarga con F5.
4. Elimina la receta aceptando la confirmación; comprueba que desaparece.
5. Cierra sesión y abre `/dashboard`: debe redirigir a `/login`.
6. Inicia sesión como Alice, anota el ID de una receta y abre otra sesión de navegador como Bob.
7. Bob no debe verla en su listado; abrir `/recipes/ID` con el ID anotado debe fallar. Las pruebas comprueban además GET, PATCH y DELETE cruzados con 404 y que la receta original permanece protegida.

## Arquitectura y patrón GoF

`HTTP → Controller → RecipeService → Recipe/Eloquent → Database`.

Los Form Requests validan, los controllers delegan y los Resources serializan. `backend/app/Services/RecipeService.php` consulta las recetas mediante el usuario y aplica aislamiento antes de leer/modificar/eliminar. Eloquent representa la relación User hasMany Recipe / Recipe belongsTo User.

El patrón **GoF evaluado es Observer**, en `backend/app/Observers/RecipeObserver.php`. Se registra con `Recipe::observe` en `backend/app/Providers/AppServiceProvider.php`. Recipe emite eventos y el observador recibe `created`, `updated` y `deleted`, desacoplando el registro de actividad del controller y del servicio. Cada evento llama `Log::info` con `recipe_id` y `user_id`. Los logs locales están en `backend/storage/logs/laravel.log`. Active Record de Eloquent y las factories son mecanismos adicionales, no el patrón GoF evaluado.

Consulta `docs/ARQUITECTURA.md` para las dos vistas y responsabilidades.

## Verificaciones

```powershell
cd backend
php artisan test
php artisan route:list
cd ../frontend
npm.cmd run build
npm.cmd run lint
npm.cmd exec -- playwright test
```

PHPUnit usa SQLite en memoria, independiente de la base local. Playwright requiere Google Chrome instalado, ambos servidores iniciados en los puertos anteriores y el seeder ejecutado. Ejecuta registro, login, CRUD, edición desde detalle, persistencia tras recarga, aislamiento con Bob, logout y token inválido contra la API real. Crea una cuenta de prueba nueva por ejecución y elimina la receta creada; no borra cuentas mediante endpoints de negocio.

## Git y GitHub

Hay un único Git en la raíz. `.env`, vendor, node_modules, logs, SQLite, cachés y resultados de navegador quedan ignorados; los lockfiles y `.env.example` sí se versionan. La rama principal es `main`. Todavía no existe un remoto GitHub configurado.

Para crear el repositorio único y configurar origin, instala GitHub CLI, autentícate y ejecuta desde la raíz:

```powershell
gh auth login
gh repo create catalogo-recetas --private --source=. --remote=origin
git push -u origin main
git status
```

El repositorio creado contendrá backend y frontend juntos. No ejecutes `git init` dentro de ninguna de esas carpetas. Para publicar cambios posteriores usa `git push`.
