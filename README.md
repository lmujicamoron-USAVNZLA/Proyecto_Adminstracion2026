# Nexus Real Estate CRM

A modern, premium Real Estate Relationship Management system built with React, Vite, and Supabase.

## 🚀 Features

- **Dashboard**: Real-time KPIs and interactive sales performance charts.
- **Property Management**: Advanced tracking of property status (Captured, Visited, Sold, etc.).
- **Property Details**: Transaction tracking, historical timeline, and agent assignment.
- **Modern UI**: Dark mode premium aesthetic using TailwindCSS and Glassmorphism.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Docker Support

The project includes Docker configuration for production deployment.

### Build and Run Container
```bash
# Build the image
docker build -t nexus-crm .

# Run the container (Access at http://localhost)
docker run -p 80:80 nexus-crm
```

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## ☁️ Database (Supabase)

Currently configured to use **Mock Data** for demonstration purposes. 
To connect to a real database:
1. Create a project on [Supabase](https://supabase.com).
2. Create `profiles`, `properties`, `transactions` tables.
3. Add `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## 📝 GitHub Setup (How to upload)

Since Git was not detected, follow these steps to upload:

1. Install [Git](https://git-scm.com/downloads).
2. Open terminal in this folder.
3. Run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Add your remote repository URL
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
