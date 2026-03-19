---
name: deploy
description: 编译并部署 dist 到生产服务器
user_invocable: true
---

# Deploy Skill

编译项目并将 dist 目录部署到生产服务器。

## 服务器信息

- 地址: 152.136.142.90
- 用户: root
- 密码: Wang2002..
- 目标路径: /apps/nginx/html/tools-web/dist

## 执行步骤

当用户调用 `/deploy` 时，按以下顺序执行：

### 1. 编译项目

```bash
npm run build
```

验证编译成功（检查输出中包含 "files generated"）。如果编译失败，停止部署并报告错误。

### 2. 备份远程旧版本

在服务器上将当前 dist 目录重命名为 `dist_bak_` + 日期（精确到分，格式 `YYYYMMDDHHmm`）：

```bash
sshpass -p 'Wang2002..' ssh -o StrictHostKeyChecking=no root@152.136.142.90 "mv /apps/nginx/html/tools-web/dist /apps/nginx/html/tools-web/dist_bak_$(date +%Y%m%d%H%M)"
```

### 3. 上传新 dist

使用 rsync 将本地 dist 目录同步到服务器：

```bash
sshpass -p 'Wang2002..' rsync -avz dist/ root@152.136.142.90:/apps/nginx/html/tools-web/dist/
```

### 4. 验证部署

确认远程 dist 目录存在且包含 index.html：

```bash
sshpass -p 'Wang2002..' ssh -o StrictHostKeyChecking=no root@152.136.142.90 "ls /apps/nginx/html/tools-web/dist/index.html && echo 'deploy success'"
```

### 5. 报告结果

部署成功后输出：
- 备份目录名
- 上传文件数
- 部署状态
