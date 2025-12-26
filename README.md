## 🚀 How to Run **pers-fe** Locally

### 1. **Prerequisites**

Make sure you have these installed:

✔️ **Git** (to clone the repository)
✔️ **Node.js** and **npm** (or **yarn**) — typically Node 16+ for modern front-end projects ([GitHub Docs][2])

To check your versions:

```bash
npm --version
```

---

### 2. **Clone the Repo**

Run this in your terminal to clone it locally:

```bash
git clone https://github.com/arcielor/pers-fe.git
cd pers-fe
```

---

### 3. **Install Dependencies**

Install the project dependencies defined in `package.json`.

If using npm:

```bash
npm install
```

This will create the `node_modules` folder and install everything the project needs to run. ([DEV Community][3])

---

### 4. **Set Up Environment Variables (If Needed)**

Some front-end apps require a `.env.local` file to run locally.
Check the repo root to see if there’s a `.env.example` or similar file; if so:

```bash
cp .env.example .env.local
```

Then update values like API URLs as needed.

If *no* environment config is mentioned in the project files, you can skip this step.

---

### 5. **Start the Development Server**

Now launch the local dev environment.

With npm:

```bash
npm run dev
```

🔎 Most front-end projects will then launch on:

```
http://localhost:3000/
```

(Or whichever port the dev script defines in `package.json`.) ([DEV Community][3])

---

### 6. **View in Browser**

Open:

```
http://localhost:3000
```

You should see the running application.
If the port is different, your console will show what it is after starting the server.

---

## 📌 Notes & Tips

* If you get errors about missing modules or peers, run:

  ```bash
  npm install
  ```

  again or delete `node_modules` + `package-lock.json` and reinstall.

* If the project uses **TypeScript** (likely, since TS config is in the repo), then errors may show up at compile time — fix or install missing types.

* If the repo uses **Next.js**, then `npm run dev` corresponds to `next dev`.

---

## ❓ What to Do If You See Errors

If the above commands fail (e.g., missing scripts), check these places:

* `package.json` → “scripts” section contains entries like `dev`, `start`, `build`
* Project readme (if available) for custom local instructions
* Any `.env.example` for required environment vars

[1]: https://github.com/arcielor/pers-fe "GitHub - arcielor/pers-fe"
[2]: https://docs.github.com/en/get-started/learning-to-code/developing-your-project-locally?utm_source=chatgpt.com "Developing your project locally - GitHub Docs"
[3]: https://dev.to/ceceliacreates/how-to-run-a-project-from-github-locally-30d1?utm_source=chatgpt.com "How to run a project from GitHub locally - DEV Community"
