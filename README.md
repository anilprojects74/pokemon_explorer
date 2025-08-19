# 🐾 Pokémon Explorer  

A modern **React + Vite** web app to explore Pokémon using the [PokéAPI](https://pokeapi.co).  
Discover Pokémon, mark your favorites ❤️, write personal notes 📝, and explore them in a clean UI with **dark mode** and **pagination**.  

---

## ✨ Features  
- 🔍 **Search Pokémon** by name or ID (with debounce & `Ctrl+K` shortcut).  
- 🎨 **Dark/Light mode toggle** (persisted via localStorage).  
- ❤️ **Favorites system** (store and manage favorites locally).  
- 📝 **Personal notes** per Pokémon (saved in localStorage).  
- 🗂 **Filter by type** (fire, water, grass, etc.).  
- ↕️ **Sort Pokémon** (by ID, name, height, weight).  
- 📄 **Pagination** (backend-driven using PokéAPI `offset` & `limit`).  
- 📊 **Detailed modal view** with stats, abilities, height, weight, and base experience.  
- 💾 **Persistent data** — favorites, notes, and dark mode survive refresh.  

---

## 🏗️ Tech Stack  
- ⚛️ **React 18 + Vite** — fast dev environment  
- 🎨 **Tailwind CSS** — modern styling  
- 🌐 **PokéAPI** — free Pokémon API  
- 💾 **LocalStorage** — persistence for favorites, notes, dark mode  

---

## 📂 Project Structure  
```
src/
├── components/      # UI components (Card, Filters, Detail modal, Pagination, etc.)
├── hooks/           # Custom hooks (useLocalStorage, useUrlState)
├── services/        # API functions (pokemonApi.js)
├── App.jsx          # Main app component
├── main.jsx         # ReactDOM entry point
└── index.css        # Tailwind + custom styles
```

---

## 🚀 Getting Started  

### 1. Clone repo  
```bash
git clone https://github.com/anilprojects74/pokemon_explorer.git
cd pokemon-explorer
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Start dev server  
```bash
npm run dev
```

Open 👉 [http://localhost:5173](http://localhost:5173)  

## 🙌 Acknowledgments  
- [PokéAPI](https://pokeapi.co) for Pokémon data  
- [TailwindCSS](https://tailwindcss.com) for utility-first styling  
- [Vite](https://vitejs.dev) for blazing-fast development  

---

## 📜 License  
This project is open source under the [MIT License](LICENSE).  