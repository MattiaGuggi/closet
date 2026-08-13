# 👕 Closet

> **Closet** è un'applicazione web interattiva per la gestione del guardaroba digitale e la creazione di outfit personalizzati con supporto per **modelli 3D** (`.glb`/`.gltf`) e **fotografie con rimozione automatica dello sfondo**.

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Viewer-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.8-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

---

## 📌 Indice
- [Descrizione del Progetto](#-descrizione-del-progetto)
- [Funzionalità Principali](#-funzionalità-principali)
- [Architettura Tecnologica](#-architettura-tecnologica)
- [Integrazione Sicurezza & Autenticazione (bcrypt)](#-integrazione-sicurezza--autenticazione-bcrypt)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Configurazione e Installazione](#-configurazione-e-installazione)
- [Variabili d'Ambiente](#-variabili-dambiente)
- [Licenza](#-licenza)

---

## 📖 Descrizione del Progetto

**Closet** nasce con l'obiettivo innovativo di permettere agli utenti di visualizzare e combinare i propri capi d'abbigliamento in uno spazio tridimensionale interattivo. 

Riconoscendo che la maggior parte degli utenti non dispone inizialmente di modelli 3D dei propri vestiti, **Closet** offre un'esperienza flessibile e ibrida:
- **Modalità 3D**: Rendering avanzato in tempo reale di file `.glb` e `.gltf` mediante **Three.js**.
- **Modalità Standard (2D)**: Caricamento di foto dei capi a cui viene rimosso lo sfondo per una sovrapposizione pulita e realistica.
- **Gestione Capi & Outfit**: Creazione, modifica, rinomina ed eliminazione di capi d'abbigliamento e composizioni di outfit salvati nel proprio profilo personale.

---

## ✨ Funzionalità Principali

### 1. 🖼️ Caricamento Capi con Rimozione Sfondo
- Caricamento foto del capo con **rimozione automatica dello sfondo** per un effetto visivo pulito ed elegante.
- Categorizzazione precisa basata sulle posizioni del corpo:
  - **Top** (Maglietta, felpa, camicia, giacca)
  - **Mid** (Pantaloni, jeans, gonne, shorts)
  - **Bottom** (Scarpe, sneakers, stivali)
- Possibilità opzionale di allegare un file **3D (`.glb` / `.gltf`)** correlato allo stesso capo.

### 2. 👗 Outfit Builder (3D vs Standard)
- Interfaccia interattiva per abbinare capi di diverse categorie e verificare l'armonia dell'outfit.
- **Switch di Modalità**: Pulsante dedicato durante la creazione dell'outfit per scegliere se visualizzare i capi in **Modalità 3D** oppure in **Modalità Standard (foto 2D)**.
- **Gestione Dati Mancanti (Fallback)**: In caso di assenza del dato corrispondente alla modalità scelta (es. modello 3D non presente per un capo o immagine 2D assente), il sistema mostra una semplice scritta esplicativa al posto del visualizzatore.
- Salvataggio rapido degli outfit creati direttamente sul proprio profilo.

### 3. 👤 Gestione Profilo & Account Utente
- **Registrazione ed Autenticazione Obbligatoria**: Ogni utente accede al proprio guardaroba riservato.
- **Gestione Completa (CRUD)**:
  - Assegnazione e modifica dei nomi di capi e outfit.
  - Modifica delle informazioni dei capi.
  - Eliminazione di capi e outfit a proprio piacimento dal profilo personale.

---

## 🛠️ Architettura Tecnologica

| Tecnologia | Descrizione |
| :--- | :--- |
| **[Next.js](https://nextjs.org/)** | Framework React full-stack con TypeScript per routing e API Endpoints |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipizzazione statica sicura su tutta l'applicazione |
| **[MongoDB](https://www.mongodb.com/) + Mongoose** | Database NoSQL per la persistenza di Utenti, Capi e Outfit |
| **[Three.js](https://threejs.org/)** | Libreria 3D WebGL per la resa dei file `.glb` e `.gltf` |
| **[GSAP](https://greensock.com/gsap/)** | Animazioni fluide delle pagine e componenti UI |
| **[Tailwind CSS](https://tailwindcss.com/)** | Styling responsive ed essenziale basato su utility-first CSS |
| **[bcrypt](https://www.npmjs.com/package/bcrypt)** | Hashing sicuro e verifica delle password utente |

---

## 🔐 Integrazione Sicurezza & Autenticazione (bcrypt)

Per garantire la massima sicurezza dei dati, il sistema di autenticazione è stato aggiornato integrandovi **bcrypt** per l'hashing preventivo delle password e la verifica sicura in fase di autenticazione.

Di seguito il codice refactorizzato dei moduli principali:

---

## 📁 Struttura della Repository

```text
closet/
├── public/                  # Assets e modelli 3D di test
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (protected)/     # Zona riservata autenticata
│   │   │   ├── closet/      # Outfit Builder (3D / Standard)
│   │   │   └── profile/     # Vista profilo guardaroba
│   │   ├── api/             # API Endpoints (login, signup, capi, outfit)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── components/      # Componenti react
│   │   ├── context/
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx       # Layout generale
│   │   └── loading.tsx      # Schermata di caricamento
│   │   └── not-found.tsx    # Schermata 404
│   │   └── page.tsx         # Homepage
│   ├── lib/
│   │   ├── database.ts      # Connessione DB e funzioni Mongoose
│   │   ├── models.ts        # Modelli Schema MongoDB (User, Clothes, Outfit)
│   │   ├── interfaces.ts    # Interfacce TypeScript
│   │   └── types.ts         # Tipi personalizzati
│   └── styles/              # Stili Tailwind CSS
├── .env                     # Configurazione locale
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Guida all'Installazione e Avvio

### 1. Clonare la Repository
```bash
git clone https://github.com/tuo-username/closet.git
cd closet
```

### 2. Installare le Dipendenze
```bash
npm install
# oppure
yarn install
```

### 3. Configurare le Variabili d'Ambiente
Crea un file `.env.local` nella cartella principale del progetto e definisci la stringa di connessione MongoDB:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/closet?retryWrites=true&w=majority
```

### 4. Avviare il Server di Sviluppo
```bash
npm run dev
```
L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000).
