# VentNoir SecretSpy

## Prérequis
- Node.js (version 20.x ou supérieure)
- npm (version 10.x ou supérieure)

## Installation

### Backend
1. Naviguez dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur :
   ```bash
   npm start
   ```
   Le serveur sera accessible sur `http://localhost:3001`.

### Frontend
1. Naviguez dans le dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   Le frontend sera accessible sur `http://localhost:5173` (port par défaut de Vite).

### Build pour production
Dans le dossier `frontend`, exécutez :
```bash
npm run build
```
Cela génère les fichiers statiques dans le dossier `dist`.

## Notes
- Assurez-vous que le backend est en cours d'exécution avant de lancer le frontend.
- Pour une intégration réelle avec Second Life, vous devrez implémenter une communication HTTP entre le serveur Express et les scripts LSL.