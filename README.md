<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

<h1 align="center">⚡ LabSnap</h1>

<p align="center">
  <strong>AI-Powered Lab Record Generator for Engineering Students</strong>
</p>

<p align="center">
  Generate perfect lab documentation with a single click. No more manual formatting!
</p>

<p align="center">
  <a href="https://lab-snap.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-violet?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Generation** | Automatically generates code, output, and theory using advanced AI models |
| 📄 **DOCX Export** | Download print-ready Word documents instantly |
| 🎨 **Smart Formatter** | Already have code? Paste it with screenshots to create formatted lab records |
| ☁️ **Cloud Save** | Save experiments to your dashboard for easy access |
| 🖨️ **Ink Saver** | Optimized output formatting to save printer ink |
| ⚡ **Instant Generation** | Get your complete lab record in under 30 seconds |
| 🆓 **Freemium Model** | Try 5 generations free as a guest, 20 credits on signup |

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Provider:** [Novita AI](https://novita.ai/) (MiMo-V2-Flash model)
- **Document Generation:** [docx](https://www.npmjs.com/package/docx) library
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/)

## 📁 Project Structure

```
labsnap/
├── prisma/
│   └── schema.prisma      # Database schema (User, Experiment, GuestUsage)
├── public/                # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/  # AI generation endpoint
│   │   │   └── experiments/# Experiment CRUD operations
│   │   ├── dashboard/     # User dashboard (protected)
│   │   ├── format/        # Smart Formatter page
│   │   ├── generate/      # Main generation page
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── LabForm.tsx    # Main experiment form
│   │   ├── FakeTerminal.tsx # Terminal output preview
│   │   └── ...
│   ├── lib/
│   │   ├── db.ts          # Prisma client
│   │   ├── generateDoc.ts # DOCX generation logic
│   │   └── utils.ts       # Utility functions
│   └── middleware.ts      # Auth & route protection
├── .env.local             # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- [Clerk](https://clerk.com/) account for authentication
- [Novita AI](https://novita.ai/) API key for AI generation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/labsnap.git
   cd labsnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/labsnap"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # AI Provider
   NOVITA_API_KEY=your_novita_api_key
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Push database schema**
   ```bash
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Generate a Lab Record

1. Go to the **Generate** page
2. Fill in the experiment details:
   - **Experiment Number**
   - **Date**
   - **Subject** (C++, Java, Python, DBMS, etc.)
   - **Aim** of the experiment
   - **Name** and **Roll Number** (optional)
3. Click **Generate**
4. Preview the code and terminal output
5. Download as a formatted DOCX file

### Smart Formatter

Already have your own code? Use the **Smart Formatter**:
1. Paste your code
2. Upload output screenshots
3. Get a perfectly formatted lab record document

### Dashboard

Sign in to access:
- Saved experiments
- Credit balance
- Re-download previous records

## 🌐 Supported Subjects

| Subject | Features |
|---------|----------|
| **C++** | Code + Console Output |
| **Java** | Code + Console Output |
| **Python** | Code + Console Output |
| **DSA** | Code + Console Output |
| **DBMS/SQL** | Theory + Syntax + Code + ASCII Table Output |

## 📝 API Reference

### `POST /api/generate`

Generate lab record content using AI.

**Request Body:**
```json
{
  "aim": "Write a program to implement bubble sort",
  "subject": "C++",
  "name": "John Doe",
  "rollNo": "21CS101",
  "mode": "full"
}
```

**Response:**
```json
{
  "type": "coding",
  "code": "// Source code here...",
  "output_text": "// Console output here..."
}
```

## 🔐 Authentication

LabSnap uses [Clerk](https://clerk.com/) for authentication:

- **Guest Users:** 5 free generations (tracked by IP)
- **Signed-in Users:** 20 credits on signup
- **Protected Routes:** `/dashboard`, `/api/experiments/*`

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Novita AI](https://novita.ai/) for AI inference
- [Clerk](https://clerk.com/) for seamless authentication
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling

---

<p align="center">
  Made with ❤️ for Engineering Students
</p>
