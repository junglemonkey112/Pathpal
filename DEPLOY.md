# PathPal Deployment

## Vercel Deployment (Recommended)

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/junglemonkey112/Pathpal)

### Manual Setup via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New... → Project**
3. Import the `junglemonkey112/Pathpal` GitHub repository
4. Vercel will auto-detect Next.js — keep the default settings
5. Click **Deploy**

### Automated CI/CD via GitHub Actions
The repository includes a GitHub Actions workflow (`.github/workflows/deploy-vercel.yml`) that automatically deploys to Vercel on every push to `main` and creates preview deployments for pull requests.

**Setup steps:**
1. Link the project to Vercel (run `vercel link` locally or connect via the Vercel Dashboard)
2. Retrieve your credentials from the Vercel Dashboard and add them as GitHub repository secrets:
   - `VERCEL_TOKEN` — from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` — from `.vercel/project.json` after running `vercel link`
   - `VERCEL_PROJECT_ID` — from `.vercel/project.json` after running `vercel link`
3. Push to `main` — the workflow will build and deploy automatically

### Local Vercel CLI Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel

# Deploy to production
vercel --prod
```

---

## Legacy: Cloudflare Tunnel Deployment

### 外网访问地址 (历史)
- https://companion-problems-mid-carbon.trycloudflare.com (2026-03-21, expired)
- https://yet-flat-contacting-purpose.trycloudflare.com (2026-03-21, expired)
- https://robert-coordinates-sizes-consistency.trycloudflare.com (历史)

### 启动命令
```bash
# 1. 启动 Next.js
cd /home/admin/.openclaw/workspace/pathpal
npm run dev

# 2. 启动 Tunnel (新终端)
/tmp/cloudflared tunnel --url http://127.0.0.1:3000
```

### 注意事项
- 使用 background 模式运行，避免进程被杀掉
- 每次重启后需要重新创建 tunnel