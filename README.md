# Image Background Remover

Free AI-powered image background remover. Remove backgrounds from photos instantly — no signup required.

🌐 **Live Demo:** [Deploy to Vercel](#deploy)

## Features

- ✂️ AI-powered background removal (remove.bg API)
- 🆓 Free to use, no signup
- ⚡ Results in seconds
- 🎨 Before/After comparison slider
- 📥 One-click PNG download
- 🔒 Images are never stored

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI Engine:** remove.bg API
- **Deployment:** Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/kingmcqueen710/image-background-remover.git
cd image-background-remover
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file:

```env
REMOVE_BG_API_KEY=your_api_key_here
```

Get your free API key at [remove.bg/api](https://www.remove.bg/api) (50 free images/month).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kingmcqueen710/image-background-remover)

Set `REMOVE_BG_API_KEY` in your Vercel environment variables.

## License

MIT
