# Arquitectura del Catálogo de Recetas

## Vista cliente-servidor

```text
Usuario → SPA React → API Laravel → SQLite o MySQL
                  HTTP/JSON       SQL mediante PDO
```

En desarrollo se usa HTTP local; un despliegue debe configurar HTTPS. React Router define `/`, `/login`, `/register`, `/dashboard` y `/recipes/:id`. Los componentes funcionales usan hooks y consumen exclusivamente `frontend/src/services/api.js`, que toma `VITE_API_URL`, añade cabeceras JSON/Bearer y extrae el campo `data` de los Resources. El token persiste en localStorage; ante 401 privado se elimina la sesión y se redirige a login. PrivateRoute impide entrar sin token; Sanctum valida realmente cada petición al servidor.

## Capas del backend

```text
Routes / HTTP + Sanctum + Form Requests
                 ↓
          RecipeController
                 ↓
           RecipeService
                 ↓
          Recipe (Eloquent)
                 ↓
       Database (SQLite/MySQL)
```

- HTTP: `backend/routes/api.php` protege las recetas con `auth:sanctum`. Form Requests validan y devuelven errores JSON 422.
- Controller: `backend/app/Http/Controllers/RecipeController.php` recibe el usuario autenticado, delega operaciones y devuelve RecipeResource. AuthController registra, verifica contraseñas con hash y emite/revoca tokens.
- Service: `backend/app/Services/RecipeService.php` lista por user_id, crea con propietario derivado de la sesión y localiza cada receta dentro de `$user->recipes()` antes de actualizar o borrar. Una receta ajena o inexistente devuelve 404 consistentemente.
- Model: `backend/app/Models/Recipe.php` implementa persistencia Active Record mediante Eloquent. User tiene muchas recetas y Recipe pertenece a un usuario. User existe para autenticación y propiedad, sin CRUD de usuarios.
- Database: migraciones definen users, personal_access_tokens y recipes, además de tablas auxiliares del esqueleto Laravel. La clave foránea recipes.user_id preserva integridad referencial. No hay otras entidades de negocio.

## GoF Observer

El patrón GoF evaluado es Observer. `backend/app/Observers/RecipeObserver.php` escucha los eventos `created`, `updated` y `deleted` de Recipe. El registro está en `backend/app/Providers/AppServiceProvider.php` mediante `Recipe::observe(RecipeObserver::class)`.

Recipe es el sujeto observable; RecipeObserver recibe las notificaciones del ciclo de vida y ejecuta Log::info con recipe_id y user_id. El servicio no necesita conocer el registro de logs. Esto desacopla el emisor de los efectos asociados a sus cambios. La prueba SecurityAndObserverTest verifica las tres notificaciones y su contexto.

Eloquent usa Active Record y RecipeFactory genera datos persistidos de demostración. Ninguno sustituye Observer como patrón GoF de la rúbrica. No se introduce Repository, CQRS ni entidades adicionales.

## Comprobación

Los Feature Tests usan RefreshDatabase y SQLite en memoria. Verifican autenticación, validaciones, CRUD, aislamiento, imposibilidad de transferir propiedad, hash, revocación del token actual y Observer. Playwright prueba React en Chrome contra Laravel y SQLite real, incluyendo F5 y acceso cruzado de otro usuario. Los archivos de configuración privada, tokens, logs y bases locales se excluyen de Git.
