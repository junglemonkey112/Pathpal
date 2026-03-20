# PathPal Deployment

## 外网访问地址
https://robert-coordinates-sizes-consistency.trycloudflare.com

## 启动命令
```bash
# 1. 启动 Next.js
cd /home/admin/.openclaw/workspace/pathpal
npm run dev

# 2. 启动 Tunnel (新终端)
/tmp/cloudflared tunnel --url http://127.0.0.1:3000
```

## 注意事项
- 使用 background 模式运行，避免进程被杀掉
- 每次重启后需要重新创建 tunnel