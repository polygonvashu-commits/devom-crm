# DEV OM Group — Luxury Real Estate CRM

This is the production-ready high-performance CRM application for **DEV OM Group**. It features a modern, dark-themed glassmorphism visual style, premium fluid animations, custom lead scoring, round-robin agent assignment routing, and a live webhook ingestion simulator.

---

## 🚀 Features Included
1. **Glassmorphism Design System**: Custom variables configured for Deep Navy (`#0F2942`), Muted Gold (`#C5A059`), and Pale Slate (`#F0F4F8`).
2. **GPU scroll-lag optimization**: Uses GPU-backed transformations and hardware rasterization (`will-change: transform`, `translateZ(0)`) to ensure 60fps scrolling and transitions.
3. **Interactive Sales Pipeline**: Fully functional drag-and-drop Kanban board with drop-zone highlight state and target column "Closed Deal" celebration flashes.
4. **Live Webhook Tester**: Submit mock JSON payloads to test the intent scoring algorithm and see new leads dynamically route to online agents via Round-Robin.
5. **Admin Override Panel**: Super administrator login dashboard (authenticated as Naveen Rathee) allows reassigning leads manually to prioritize high-value profiles.
6. **Mobile Responsive**: Custom side navigation collapser and hamburger toggle header triggers for tablet and mobile viewports.

---

## 🛠️ Local Development & Production Build

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+) installed.

### Installation
```bash
# Install dependencies
npm install

# Run local development server (starts on http://localhost:3000)
npm run dev
```

### Production Build
Builds the static assets into the `dist/` directory.
```bash
npm run build
```

---

## 🌐 Production Deployment Guide

The production build yields a zero-dependency static folder (`dist/`) that can be hosted on any web server or CDN. Below are the recommended deployment methods:

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root folder.
3. Follow the prompts to deploy. Vercel automatically detects Vite configurations, runs the build command, and hosts it with SSL active on a secure domain.

### Option 2: Netlify
1. Create a free Netlify account.
2. Link your GitHub repository containing this project.
3. Set the following Build settings:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy**. Netlify automatically generates a free Let's Encrypt SSL certificate for your custom domain.

### Option 3: Nginx with Let's Encrypt SSL (Self-Hosted VPS)
To host the static folder on your own secure server (supporting `https://api.devomgroup.in/webhook/leads` SSL routing):

1. Copy the `dist` folder content to `/var/www/devom-crm` on your Linux VPS.
2. Setup Nginx block config:
   ```nginx
   server {
       listen 80;
       server_name crm.devomgroup.in;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name crm.devomgroup.in;

       ssl_certificate /etc/letsencrypt/live/crm.devomgroup.in/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/crm.devomgroup.in/privkey.pem;

       root /var/www/devom-crm;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
3. Issue SSL certificate using Certbot:
   ```bash
   sudo certbot --nginx -d crm.devomgroup.in
   ```
