# Baiboly — Bible malgache en ligne

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Application web de lecture de la Bible en malgache (*Baiboly*), avec une interface
moderne et un mode hors-ligne. Les textes sont récupérés via une API puis mis en
cache localement dans le navigateur (IndexedDB) pour permettre la lecture sans
connexion.

## Fonctionnalités

- Lecture de la Bible en malgache, navigation par livre et par chapitre
- Mise en cache hors-ligne des passages déjà consultés (IndexedDB)
- Interface responsive construite avec shadcn/ui (composants Radix) et Tailwind CSS
- Récupération et synchronisation des données via TanStack Query

## Stack technique

- **Framework** : React 18 + Vite
- **Langage** : TypeScript
- **UI** : shadcn/ui (Radix UI), Tailwind CSS, lucide-react
- **Données** : TanStack Query, service d'accès `bibleApi`, stockage hors-ligne `indexedDbService`
- **Routing** : React Router

## Démarrage

Prérequis : Node.js et npm.

```bash
# Cloner le dépôt
git clone https://github.com/nicolasromanina/baiboly-app.git
cd baiboly-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (Vite) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Analyse statique (ESLint) |

## Structure du projet

```
src/
├── pages/        # Pages (Index, NotFound)
├── components/   # Composants UI réutilisables
├── services/     # bibleApi (accès données) + indexedDbService (cache hors-ligne)
├── contexts/     # Contextes React (état global)
├── hooks/        # Hooks personnalisés
└── types/        # Types TypeScript
```
