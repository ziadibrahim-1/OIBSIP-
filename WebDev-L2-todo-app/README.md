# TaskFlow - Advanced To-Do Dashboard Application

A professional, dashboard-style task management web application built using HTML5, CSS3, and Vanilla JavaScript. Developed as a Level 2 task for the **Oasis Infobyte Internship**.

---

## 🌟 Key Features

### 📋 Core To-Do Features
- **Task Management (CRUD)**: Create, view, edit, check off, and delete tasks dynamically.
- **Categorization**: Group tasks by categories (Work, Personal, Shopping, Health, Education, Urgent) using representative emoji badges.
- **Priority Assessment**: Set task priority (Low, Medium, High) with corresponding color-coded pills.
- **Due Dates & Overdue Warnings**: Set task deadlines. The app automatically scans dates, highlighting pending tasks with red tags and warning messages if they pass the current date.
- **Statistics Summary**: Real-time dashboard tracker counting total, pending, and completed tasks alongside a smooth horizontal progress bar depicting completion percentages.
- **Empty State**: Friendly vector graphics and helpful instructional texts displaying when a filter result is empty or the database is cleared.
- **Data Persistence**: Tasks, completions, edits, ordering, and theme preferences sync to local browser memory via `localStorage`.

### ⚡ Extended Premium Features
- **Advanced Query Engine**: Real-time filtering by status, category, and priority combined with instant character-matching title searches.
- **Sorting System**: Order tasks by Date Created (Newest/Oldest), Due Date (Soonest/Furthest), Priority (High to Low/Low to High), and Alphabetical (A-Z/Z-A).
- **HTML5 Drag & Drop**: Click and drag any task card to manually reorder its position in the list. The new sequence automatically saves to local memory.
- **Custom Alert Modals**: Styled confirmation dialogs override native browser alerts when clearing databases, deleting entries, or running bulk tasks.
- **Reactive Toast Alerts**: Non-blocking color-coded overlays fly in from the corner to confirm actions (Success, Warning, Danger, Info).
- **Dark/Light Mode**: Smooth variables transition between a clean light dashboard and an eye-friendly slate-dark theme.
- **Export & Import Backup**:
  - **Export**: Generates a standard formatted `.json` file of the current state and downloads it.
  - **Import**: Uploads backup `.json` files, runs structural integrity checks, and merges tasks into the local list.

---

## 📁 Project Structure

```text
WebDev-L2-todo-app/
│
├── index.html          # Semantic HTML markup & dialog containers
├── README.md           # Documentation
│
├── css/
│   └── style.css       # Clean layout grids, dark variables, indicators, animations
│
└── js/
    └── app.js          # Controller handling state, imports, sorting, drag, and DOM
```

---

## ⚙️ Technical Highlights

### 🛡️ Secure Data Binding
All modifications to the UI, data edits, and checks go through a single state controller `tasks = [...]`. The view is rendered from a pure functional projection of this state through the query filters, preventing UI state desynchronization.

### 🔄 Array Reordering from DOM Position
During drag and drop, rather than maintaining temporary arrays, the app maps elements to their raw DOM offsets and uses `insertBefore`/`after` to establish positions visually. On `dragend`, `reorderTasksFromDOM()` reads the final DOM hierarchy, maps identifiers back, and commits the new sorting order to state and LocalStorage.

---

## 🚀 How to Run the Project

1. Clone or download the repository workspace.
2. Open `WebDev-L2-todo-app/index.html` directly in any modern web browser.
3. Or launch using any local web development server (e.g. live-server).

---

## 📄 License
This project is licensed under the MIT License.
