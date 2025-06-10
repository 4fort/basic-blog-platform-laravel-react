# Basic Blog Platform

A modern blog platform built with [Laravel](https://laravel.com) backend and [React](https://react.dev) frontend using [Inertia.js](https://inertiajs.com).

## 👯‍♂️ Members

- **Dexter Fort Silva**
- **Charles Dave Avenido**
- **James Christian Montealto**

## 🚀 Getting Started

### Prerequisites

- PHP (version 8.2 or higher)
- Composer
- Node.js (version 16 or higher)
- npm, yarn, or pnpm package manager
- MySQL or PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd basic-blog-platform-laravel-react
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

4. Set up environment configuration:

```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in the `.env` file:

```env
DB_CONNECTION=sqlite
# For MySQL, use:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

6. Run database migrations:

```bash
php artisan migrate
```

7. Start the development servers:

```bash
# Run both frontend and backend in 1 terminal
composer run dev

# Or run separately:
# Terminal 1 - Laravel backend
php artisan serve

# Terminal 2 - React frontend (Vite)
npm run dev
```

8. Open [http://localhost:8000](http://localhost:8000) in your browser to see the Laravel application.
   Frontend assets will be served via Vite at [http://localhost:5173](http://localhost:5173).

## 📁 Project Structure

```
basic-blog-platform-laravel-react/
├── app/                             # Laravel application logic
│   ├── Http/Controllers/            # Controllers
│   ├── Http/Middleware/             # Custom middleware
│   ├── Models/                      # Eloquent models
│   └── ...
├── resources/
│   ├── js/                          # React components and TypeScript
│   │   ├── components/              # React components
│   │   ├── pages/                   # Inertia page components
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── app.tsx                  # Main React entry point
│   │   └── ssr.tsx                  # Server-side rendering entry
│   ├── views/                       # Blade templates (minimal with Inertia)
│   └── css/                         # Tailwind CSS styles
├── routes/
│   ├── web.php                      # Web routes (Inertia)
│   └── console.php                  # Artisan commands
├── database/
│   ├── migrations/                  # Database migrations
│   └── seeders/                     # Database seeders
├── public/                          # Public assets
├── bootstrap/                       # Application bootstrap
├── config/                          # Configuration files
└── ...
```

## 🛠️ Available Scripts

### Laravel Commands

- `php artisan serve` - Start Laravel development server
- `php artisan migrate` - Run database migrations
- `php artisan migrate:refresh --seed` - Reset and seed database
- `php artisan make:controller ControllerName` - Create new controller
- `php artisan make:model ModelName -m` - Create model with migration
- `php artisan inertia:start-ssr` - Start server-side rendering

### Frontend Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build assets for production
- `npm run build:ssr` - Build assets with SSR support
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run types` - Type check TypeScript

### Composer Scripts

- `composer run dev` - Start both Laravel and Vite servers
- `composer run dev:ssr` - Start with SSR support
- `composer run test` - Run PHP tests

### Git Commit Message Conventions

This project follows strict commit message conventions to maintain a clear and consistent Git history.

#### Commit Message Structure

```
<type>: <short summary> (max 50 characters)
```

#### Example

```
feat: Add user authentication system
```

### Commit Types

| Type       | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `feat`     | A new feature for the project                                   |
| `fix`      | A bug fix                                                       |
| `docs`     | Documentation-only changes                                      |
| `style`    | Changes that don't affect code meaning (formatting, whitespace) |
| `refactor` | Code changes that neither fix bugs nor add features             |
| `perf`     | Performance improvements                                        |
| `test`     | Adding or correcting tests                                      |
| `chore`    | Build process, package manager, or auxiliary tool changes       |

### Commit Header Guidelines

- **Limit to 50 characters**
- **Capitalize** the first word
- **No period** at the end
- **Use imperative mood** ("Add feature" not "Added feature")
- **Be descriptive** but concise

### Best Practices

- ✅ **One purpose per commit** - Keep commits focused
- ✅ **Consistent tags** - Use the same commit types throughout
- ✅ **Reference issues** - Link commits to project issues when applicable
- ❌ **Avoid mixing** unrelated changes in a single commit

## 🔧 Development

### Backend Development

- Routes are defined in `routes/web.php` using Inertia responses
- Controllers return Inertia responses instead of JSON
- Use Laravel's built-in validation and error handling
- Middleware handles Inertia requests and shared data

### Frontend Development

- React components are located in `resources/js/components/`
- Page components are in `resources/js/pages/`
- Uses Inertia.js for seamless SPA experience
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/ui components for UI elements

### Key Technologies

- **Inertia.js** - Modern monolith approach
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Fast build tool
- **Shadcn/ui** - Component library

## 📚 Learn More

- [Laravel Documentation](https://laravel.com/docs) - Learn about Laravel features and API
- [Inertia.js Documentation](https://inertiajs.com) - Learn about Inertia.js
- [React Documentation](https://react.dev) - Learn about React
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn Tailwind CSS
- [Vite Documentation](https://vitejs.dev/guide/) - Learn about Vite build tool

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
