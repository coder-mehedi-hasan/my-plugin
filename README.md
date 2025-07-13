# 🧩 My Plugin

A modern WordPress plugin powered by:

- ⚛️ React (with TypeScript)
- 🌬 Tailwind CSS
- 📦 Webpack for build
- 🔐 Secure REST integration
- 🧩 Admin page and frontend shortcode UI, both rendered via React

---

## 📦 Features

- Fully React-based **WordPress admin page**
- Chatbox rendered on any page via shortcode: `[my_plugin_chatbox]`
- Tailwind CSS for styling in both admin and frontend
- TypeScript-based React components
- Secure REST API communication using `wp_create_nonce()`
- Code-splitting: separate builds for admin and frontend

---

## 🚀 Quick Start

### ✅ Requirements

- Node.js v16+
- WordPress (local or remote install)
- npm (comes with Node)

---

## 🔧 Installation

### 1. Copy plugin to your WordPress site

Place the plugin folder (e.g. `my-plugin/`) into:

```
wp-content/plugins/my-plugin/
```

### 2. Install dependencies

In the plugin directory:

```bash
npm install
```

---

## 🧪 Development Mode

Use Webpack’s watch mode for live rebuilding while coding:

```bash
npm run dev
```

- Watches changes in `src/`
- Rebuilds `build/admin.js`, `build/chatbox.js`, and their CSS automatically

---

## 🚀 Production Build

When you're ready to deploy:

```bash
npm run build
```

This will:

- Compile & minify React and Tailwind into the `build/` folder
- Produce optimized CSS/JS assets for admin and frontend

---

## 📜 Usage

### 🛠 Admin Interface

After activation, you’ll see a new menu in WP Admin:

> **AI Plugin** → React-based admin page

This is rendered via React (`src/admin.tsx`).

---

### 💬 Frontend Chatbox

Add the shortcode below to **any page/post**:

```text
[my_plugin_chatbox]
```

This renders the React-powered chatbox UI (`src/chatbox.tsx`) on the frontend.

---

## 🗂 Folder Structure

```
my-plugin/
├── admin/                     # Admin page PHP logic
│   └── class-my-plugin-admin.php
├── frontend/                  # Shortcode logic
│   └── class-my-plugin-frontend.php
├── build/                     # Webpack outputs (JS/CSS)
├── src/                       # React source files
│   ├── admin.tsx
│   ├── chatbox.tsx
│   └── index.css              # Tailwind CSS entry point
├── my-plugin.php              # Plugin bootstrap
├── webpack.config.js          # Webpack config
├── postcss.config.js          # PostCSS (Tailwind) config
├── tailwind.config.js         # Tailwind scan rules
├── tsconfig.json              # TypeScript config
├── package.json               # Project metadata/scripts
└── README.md
```

---

## 🔧 NPM Scripts

| Command         | Purpose                         |
|-----------------|----------------------------------|
| `npm run dev`   | Rebuild on file changes (dev)   |
| `npm run build` | Compile for production (minify) |

---

## 🛡 Security Best Practices

- **Nonces**: REST requests are protected with `wp_create_nonce()` and validated using `check_ajax_referer()` or permission callbacks.
- **Scoped Rendering**: React is mounted only in safe containers (`#my-plugin-admin-root`, `#my-plugin-chatbox-root`) to avoid DOM collisions.
- **No global scripts**: JavaScript and CSS are only loaded on relevant admin screens or pages with the shortcode.

---

## 🚚 Deployment

1. Run production build:

   ```bash
   npm run build
   ```

2. (Optional) Clean dev-only files before zipping:

   ```bash
   rm -rf node_modules src *.config.js tsconfig.json package*.json
   ```

3. Zip the plugin:

   ```bash
   zip -r my-plugin.zip my-plugin/
   ```

4. Upload and activate via **WordPress Admin > Plugins**

---

## 💡 Advanced Ideas (Optional)

- Use `@tanstack/react-query` for API state management
- Integrate chatbot APIs (OpenAI, Dialogflow, etc.)
- Persist settings using `register_setting()` + REST endpoints

---

## 🧑‍💻 Credits

Developed by [Your Name]  
MIT License — Use and adapt freely.

---

## 💬 Need Help?

If you run into issues, feel free to open a GitHub issue or contact the plugin author.
