# Pera-Verse Frontend

A React-based frontend application for the Pera-Verse event management system, featuring an interactive map interface.

## Features

- Interactive map with zoom, pan, and touch support
- Mobile-responsive design
- Search and filter functionality
- Location markers and details
- Full-screen map view optimized for mobile devices

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Pera-Verse-Frontend.git
cd Pera-Verse-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Deployment to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. Push your code to the `main` branch
2. The GitHub Actions workflow will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/Pera-Verse-Frontend/`

### Method 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions" (for automatic deployment) or "Deploy from a branch" (for manual deployment)
4. If using manual deployment, select the `gh-pages` branch

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.js          # Main dashboard component
│   └── Dashboard.css         # Dashboard styles
├── index.tsx                 # Application entry point
└── App.tsx                   # Main app component

public/
├── images/                   # Static images
└── manifest.json            # PWA manifest

.github/
└── workflows/
    └── deploy.yml           # GitHub Actions deployment workflow
```

## Technologies Used

- React 18
- Vite (build tool)
- TypeScript
- CSS3 with responsive design
- GitHub Pages (hosting)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.