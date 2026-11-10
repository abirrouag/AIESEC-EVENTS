# RAPPORT DE PROJET MERN : AIESEC HUB

**Plateforme collaborative de gestion d’événements et retours associatifs**  
*Projet de Développement Web Avancé (Stack MERN)*  
*Année Universitaire : 2025 / 2026*  

---

## Sommaire

1. [Introduction & Contexte du Projet](#1-introduction--contexte-du-projet)
2. [Cahier des Charges & Fonctionnalités](#2-cahier-des-charges--fonctionnalités)
3. [Architecture Globale & Choix Technologiques](#3-architecture-globale--choix-technologiques)
4. [Modélisation des Données (MongoDB & Mongoose)](#4-modélisation-des-données-mongodb--mongoose)
5. [Sécurité & Authentification Back-End (Express & JWT)](#5-sécurité--authentification-back-end-express--jwt)
6. [Architecture & Développement Front-End (React & Vite)](#6-architecture--développement-front-end-react--vite)
7. [Guide de Déploiement Cloud (Atlas, Render, Vercel)](#7-guide-de-déploiement-cloud-atlas-render-vercel)
8. [Validation & Procédure de Tests](#8-validation--procédure-de-tests)
9. [Cahier de Captures d'Écran (Pour la version finale)](#9-cahier-de-captures-décran)
10. [Conclusion & Perspectives](#10-conclusion--perspectives)

---

## 1. Introduction & Contexte du Projet

Dans le cadre des organisations étudiantes internationales telles qu'**AIESEC**, la coordination des comités locaux repose sur une communication rapide et la mobilisation autour de projets phares (villages globaux, conférences de leadership, programmes d'échanges internationaux).

La problématique observée au sein des comités locaux est la dispersion des informations concernant les événements et le manque de retour qualitatif structuré de la part des membres.

**AIESEC Hub** a été conçu pour répondre à ce besoin à travers une application web monopage (SPA) épurée, performante et sécurisée, permettant aux membres du comité d'annoncer leurs activités et de collecter les avis constructifs de leur communauté.

---

## 2. Cahier des Charges & Fonctionnalités

L'application sépare distinctement deux niveaux d'accès :

### 2.1. Mode Visiteur (Non Connecté)
- Accès en lecture seule à la liste chronologique de tous les événements publiés par le comité.
- Consultation de l'ensemble des feedbacks et commentaires pour chaque événement.
- Impossibilité de publier un événement, de commenter ou de supprimer du contenu.
- Liens d'accès vers les pages d'inscription et de connexion.

### 2.2. Mode Membre (Authentifié via JWT)
- Création d'événements associatifs avec formulaire contrôlé (Titre, Date, Description).
- Suppression restreinte : un membre peut **uniquement supprimer ses propres événements**.
- Publication de commentaires / retours d'expérience sur n'importe quel événement.
- Suppression restreinte des commentaires : un membre peut **uniquement supprimer ses propres feedbacks**.
- Session persistante dans le navigateur (`localStorage`) assurant une reconnexion automatique.

---

## 3. Architecture Globale & Choix Technologiques

Le projet adopte l'architecture standard et éprouvée **MERN** (MongoDB, Express, React, Node.js) :

```text
┌─────────────────────────────────────────────────────────────┐
│                   Client Browser (React 18)                 │
│         Vite + Axios + Intercepteur JWT + LocalStorage      │
└──────────────────────────────▲──────────────────────────────┘
                               │ HTTPS (REST API JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Serveur d'API (Express / Node.js)           │
│      Middlewares : CORS, express.json, Protect (JWT)        │
│      Routes : /api/auth, /api/events, /api/feedbacks        │
└──────────────────────────────▲──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Base de Données Cloud (MongoDB Atlas M0)          │
│          Collections : Users, Events, Feedbacks             │
└─────────────────────────────────────────────────────────────┘
```

### Justification des choix technologiques :
- **Node.js & Express.js :** Environnement asynchrone idéal pour bâtir des API REST légères, modulaires et rapides.
- **MongoDB & Mongoose :** Base NoSQL orientée documents offrant une grande flexibilité de schéma, complétée par la rigueur de validation et la puissance de population relationnelle (`ref` / `.populate()`) de Mongoose.
- **React 18 & Vite :** Vite offre un temps de démarrage quasi-instantané via les modules ES natifs. L'utilisation exclusive des hooks natifs (`useState`, `useEffect`) garantit un code sans dépendances superflues (ni Redux, ni TypeScript), très facile à auditer et à expliquer lors de la soutenance.
- **Axios & Intercepteur :** Centralisation de la configuration HTTP et injection automatique du jeton d'authentification Bearer.

---

## 4. Modélisation des Données (MongoDB & Mongoose)

Le projet implémente **3 entités Mongoose** reliées par des relations **One-to-Many (1 → N)** :

```
     ┌──────────────┐
     │     User     │
     └──────┬───────┘
            │ 1
            │
            ├────────────────────────┐
            │ N                      │ N
     ┌──────▼───────┐         ┌──────▼───────┐
     │    Event     │ 1 ──── N│   Feedback   │
     └──────────────┘         └──────────────┘
```

### 4.1. Modèle `User` (`server/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true } // Haché via bcrypt
}, { timestamps: true });
```

### 4.2. Modèle `Event` (`server/models/Event.js`)
```javascript
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
```

### 4.3. Modèle `Feedback` (`server/models/Feedback.js`)
```javascript
const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 4.4. Relation et Jointure Dynamique via `.populate()`
Pour afficher le nom de l'organisateur ou de l'auteur d'un retour sans exposer son mot de passe, nous utilisons `.populate('author', 'name')` dans les routes :
```javascript
const events = await Event.find().populate('author', 'name').sort({ date: 1 });
```

---

## 5. Sécurité & Authentification Back-End (Express & JWT)

### 5.1. Chiffrement des Mots de Passe (`bcryptjs`)
Lors de l'inscription (`POST /api/auth/register`), le mot de passe n'est jamais stocké en clair. Il fait l'objet d'un salage cryptographique puis d'un hachage irréversible :
```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```
À la connexion (`POST /api/auth/login`), `bcrypt.compare()` compare le mot de passe fourni avec le haché en base de données de façon sécurisée contre les attaques temporelles.

### 5.2. Jeton JSON Web Token (JWT)
Un jeton signé contenant l'identifiant MongoDB de l'utilisateur (`{ id: user._id }`) est généré avec une clé secrète (`JWT_SECRET`) et transmis au client pour une validité de 7 jours.

### 5.3. Middleware Sentinelle `protect` (`server/middleware/protect.js`)
Ce middleware intercepte les requêtes sur les routes protégées (`POST`, `PUT`, `DELETE`) :
1. Extraction de l'en-tête `Authorization: Bearer <token>`.
2. Renvoi immédiat d'une erreur `401 Unauthorized` si le jeton est manquant.
3. Vérification de la signature cryptographique via `jwt.verify(token, process.env.JWT_SECRET)`.
4. Récupération de l'utilisateur depuis la base (`User.findById(decoded.id).select('-password')`).
5. Injection de l'objet dans `req.user` et passage au contrôleur suivant via `next()`.

### 5.4. Matrice des Routes de l'API

| Méthode | Route | Rôle | Accès | Code Succès |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Créer un compte membre | Public | `201 Created` |
| `POST` | `/api/auth/login` | Authentification & émission du JWT | Public | `200 OK` |
| `GET` | `/api/events` | Liste des événements (avec auteur) | Public | `200 OK` |
| `POST` | `/api/events` | Publier un nouvel événement | **Protégé (JWT)** | `201 Created` |
| `PUT` | `/api/events/:id` | Modifier son événement | **Protégé (Auteur)** | `200 OK` |
| `DELETE` | `/api/events/:id` | Supprimer son événement | **Protégé (Auteur)** | `200 OK` |
| `GET` | `/api/feedbacks/:eventId` | Liste des avis d'un événement | Public | `200 OK` |
| `POST` | `/api/feedbacks` | Déposer un avis sur un événement | **Protégé (JWT)** | `201 Created` |
| `DELETE` | `/api/feedbacks/:id` | Supprimer son propre avis | **Protégé (Auteur)** | `200 OK` |

---

## 6. Architecture & Développement Front-End (React & Vite)

### 6.1. Organisation des Composants
```text
client/src/
├── components/
│   ├── Navbar.jsx        # En-tête de navigation et état de session
│   ├── EventCard.jsx     # Carte événement, formatage date et toggle commentaires
│   ├── EventForm.jsx     # Formulaire contrôlé d'ajout d'événement
│   └── FeedbackList.jsx  # Affichage et soumission des avis
├── pages/
│   ├── Home.jsx          # Page principale (tableau de bord des événements)
│   ├── Login.jsx         # Formulaire d'authentification
│   └── Register.jsx      # Formulaire de création de compte
├── api.js                # Instance Axios + Intercepteur d'en-tête JWT
├── App.jsx               # Gestionnaire d'état racine et routage SPA
└── index.css             # Feuille de style épurée aux couleurs AIESEC (#037EF3)
```

### 6.2. Intercepteur Axios (`client/src/api.js`)
L'intercepteur injecte automatiquement le jeton présent dans `localStorage` dans chaque requête sortante, évitant la duplication de code :
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6.3. Gestion de l'État & Rendu Conditionnel
- **`useState` :** Maintien des données dynamiques (valeurs des champs de saisie, liste des événements, utilisateur actif).
- **`useEffect` :** Chargement initial asynchrone des événements et commentaires lors du montage des composants.
- **Rendu Conditionnel :** Les boutons d'action critique (suppression, formulaires de publication) ne sont affichés que si l'identifiant de l'utilisateur connecté correspond à `event.author._id` ou `feedback.author._id`.

---

## 7. Guide de Déploiement Cloud (Atlas, Render, Vercel)

### 7.1. Base de Données : MongoDB Atlas
- Création d'un cluster M0 Sandbox (gratuit).
- Configuration de l'utilisateur applicatif dans **Database Access**.
- Autorisation de l'accès réseau (`0.0.0.0/0`) dans **Network Access**.
- Récupération de l'URI de connexion (`mongodb+srv://...`).

### 7.2. Back-End : Render.com
- Création d'un **Web Service** lié au dépôt GitHub.
- Répertoire racine : `server`.
- Commande de build : `npm install`.
- Commande de démarrage : `node server.js`.
- Variables d'environnement configurées sur Render :
  - `PORT=5000`
  - `MONGO_URI=<Chaîne MongoDB Atlas>`
  - `JWT_SECRET=<Clé secrète cryptographique>`
  - `CLIENT_URL=<URL Vercel du client>`

### 7.3. Front-End : Vercel.com
- Importation du dépôt GitHub.
- Répertoire racine : `client`.
- Framework prédéfini : `Vite`.
- Variable d'environnement configurée sur Vercel :
  - `VITE_API_URL=https://<votre-api-render>.onrender.com/api`
- Fichier `vercel.json` configuré pour rediriger toutes les routes vers `/index.html`.

---

## 8. Validation & Procédure de Tests

La suite de tests automatisée intégrée (`server/test-server.js`) a validé le comportement de l'API :
1. **Accès API public :** `GET /` renvoie `200 OK` avec le message de santé.
2. **Validation des entrées :** `POST /api/auth/register` sans données renvoie `400 Bad Request`.
3. **Protection des routes privées :** `POST /api/events` et `POST /api/feedbacks` sans jeton JWT renvoient rigoureusement `401 Unauthorized`.
4. **Vérification cryptographique :** Hachage et vérification `bcrypt` conformes ; encodage et décodage des jetons `jwt` conformes.
5. **Compilation Frontend :** Build Vite de production sans aucune erreur ni avertissement.

---

## 9. Cahier de Captures d'Écran

*(À compléter avec les captures réelles de votre application déployée)*

### Figure 1 : Page d'Accueil - Vue Visiteur (Non Connecté)
> *Description : Affichage de la bannière AIESEC Hub, de la liste chronologique des événements et du bouton invitant à la connexion.*  
> `[Insérer ici la capture d'écran de la page Home en mode visiteur]`

---

### Figure 2 : Formulaire de Connexion & Inscription
> *Description : Interface d'authentification avec validation des champs et messages d'erreur contextuels.*  
> `[Insérer ici la capture d'écran des formulaires Login / Register]`

---

### Figure 3 : Tableau de Bord Membre & Ajout d'Événement
> *Description : Vue une fois connecté, affichant le message "Hi, [Nom]", le formulaire d'ajout d'événement et le bouton Déconnexion.*  
> `[Insérer ici la capture d'écran de l'espace membre connecté]`

---

### Figure 4 : Consultation et Ajout de Feedbacks
> *Description : Vue détaillée des commentaires avec mention de l'auteur, de la date et bouton de suppression pour ses propres avis.*  
> `[Insérer ici la capture d'écran du bloc Feedbacks]`

---

### Figure 5 : Tableaux de Bord de Déploiement Cloud (Render & Vercel)
> *Description : Statut "Live" du service API sur Render et déploiement "Ready" sur Vercel.*  
> `[Insérer ici la capture d'écran de Render.com et Vercel.com]`

---

## 10. Conclusion & Perspectives

Le projet **AIESEC Hub** valide l'intégralité des objectifs pédagogiques et techniques fixés pour l'évaluation :
- Maîtrise complète de la pile MERN sans dépendance superflue.
- Respect strict des bonnes pratiques de sécurité (chiffrement, jetons JWT, variables d'environnement masquées).
- Séparation étanche des droits entre visiteurs et membres.
- Architecture prête au déploiement continu sur le cloud en HTTPS.

### Perspectives d'évolution :
1. Ajout de catégories d'événements (ex : *O-Xchange*, *Youth Speak*, *Team Building*).
2. Système de vote par étoiles (ratings 1 à 5) en plus du commentaire textuel.
3. Téléversement d'affiches d'événements via un stockage cloud (ex : Cloudinary).

