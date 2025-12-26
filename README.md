Here are **clean, npm-only instructions** to run **`pers-fe` locally on Antigravity** (or any local machine).

---

## ✅ Prerequisites

Make sure you have:

* **Node.js (v18 or later)**
  Check with:

  ```bash
  node -v
  ```
* **npm** (comes with Node.js)

---

## 🚀 Steps to Run `pers-fe` Locally (Using npm)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/arcielor/pers-fe.git
cd pers-fe
```

---

### 2️⃣ Install Dependencies (npm only)

```bash
npm install
```

This will install all required packages listed in `package.json`.

---

### 3️⃣ Start the Development Server

```bash
npm run dev
```

---

### 4️⃣ Open the App

Once the server starts, open your browser and go to:

```
http://localhost:3000
```

You should now see the PERS frontend running locally 🎉

---

## 🧠 Running in **Antigravity**

1. Open **Antigravity**
2. Open the `pers-fe` project folder
3. Open the **integrated terminal**
4. Run:

   ```bash
   npm install
   npm run dev
   ```
5. Access the app via `http://localhost:3000`

Antigravity works similarly to VS Code, so no extra configuration is needed.

---

## 🛠 Optional: Environment Variables

If the app later requires backend URLs or API keys:

* Create a file named:

  ```
  .env.local
  ```
* Add required variables (if any)
