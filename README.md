# Wave Habitat Control Interface

A modern, marine-themed React application for controlling aquarium/floodlights with a beautiful animated interface.

## Features

- Marine/aquarium themed UI with animated bubbles and waves
- Control panel for Main Light and Night Light
- Status indicators showing ON/OFF/AUTO states
- Ambient underwater sound effects
- Responsive design for all screen sizes
- Beautiful animations and transitions
- Modern, glass-morphism design style

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wave-habitat
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Technologies Used

- React
- TypeScript
- Styled Components
- Font Awesome Icons
- DotLottie Player
- Web Audio API

## Project Structure

```
wave-habitat/
├── src/
│   ├── components/
│   │   ├── Bubbles.tsx
│   │   └── ControlCard.tsx
│   ├── styles/
│   │   └── GlobalStyles.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
│   └── assets/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
