# GuSou! osu! Private Server Website

A modern React-based website for the GuSou! osu! private server, featuring user authentication, profile management, and a beautiful UI inspired by contemporary design patterns.

## Features

- 🎵 **User Authentication** - Login and registration with OAuth integration
- 👤 **User Profiles** - View detailed statistics across multiple game modes
- 🏆 **Rankings** - Global and country rankings (coming soon)
- 🎵 **Beatmaps** - Browse and download beatmaps (coming soon)
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📱 **Responsive Design** - Mobile-friendly interface
- ⚡ **Modern Stack** - React 19, TypeScript, Tailwind CSS

## Game Modes Supported

- osu! (standard)
- osu!taiko
- osu!catch (fruits)
- osu!mania
- osu!rx (relax)
- osu!ap (autopilot)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gusou-lazer-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure the API endpoint:
   - Open `src/utils/api.ts`
   - Update `API_BASE_URL` to match your osu! API server URL

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Configuration

The website connects to the osu_lazer_api backend. Make sure to:

1. Update the API base URL in `src/utils/api.ts`
2. Configure client credentials in `CLIENT_CONFIG`
3. Ensure your osu! API server is running and accessible

### Default API Endpoints Used

- `POST /oauth/token` - User authentication
- `POST /users` - User registration
- `GET /api/v2/me/` - Get current user info
- `GET /api/v2/me/{ruleset}` - Get user info for specific game mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Layout)
│   └── UI/             # UI components (LoadingSpinner, GameModeSelector)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useTheme.ts     # Theme management hook
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Login form
│   ├── RegisterPage.tsx # Registration form
│   └── ProfilePage.tsx # User profile page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and API calls
└── styles/             # Global styles and Tailwind config
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Jotai** - State management
- **Vite** - Build tool

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## API Integration

This frontend is designed to work with the `osu_lazer_api-main` backend. The API supports:

- OAuth 2.0 authentication with multiple grant types
- User registration with validation
- Multi-game mode statistics
- Real-time user data updates

### Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/oauth/token` with password grant
3. Backend validates credentials and returns access/refresh tokens
4. Tokens are stored in localStorage for session persistence
5. API requests include Bearer token in Authorization header
6. Automatic token refresh when needed

### User Data

User profiles display comprehensive statistics for each game mode:
- Performance points (pp)
- Accuracy percentage
- Play count and time
- Hit statistics (300s, 100s, 50s, misses)
- Grade counts (SSH, SS, SH, S, A)
- Global and country rankings

## Development Notes

- The website uses CSS custom properties for theming
- All API calls are centralized in `src/utils/api.ts`
- Error handling with user-friendly toast notifications
- Form validation with real-time feedback
- Responsive design with mobile-first approach
- Accessibility considerations with proper ARIA labels

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.