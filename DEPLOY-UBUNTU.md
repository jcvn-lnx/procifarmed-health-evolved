# Deploy em Servidor Ubuntu (Frontend + Backend próprio + PostgreSQL)

Guia para fazer deploy do **frontend (Vite/React)** e do seu **backend próprio (API)** em um servidor Linux Ubuntu, usando **PostgreSQL** como banco de dados.


## Pré-requisitos

- Servidor Ubuntu 20.04+ com acesso root ou sudo
- Domínio apontando para o IP do servidor
- Acesso SSH ao servidor

## 1. Atualizar o Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Instalar Node.js

Instale o Node.js 18+ usando NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verifique a instalação:

```bash
node --version
npm --version
```

## 3. Instalar e Configurar Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 4. Instalar e Configurar PostgreSQL

> Esta seção é para o **seu servidor** (onde o Postgres vai rodar). Se você vai usar Postgres em outro host, pule e apenas ajuste o backend com a URL correta.

```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 4.1. Criar usuário e banco

> Troque `procifarmed` e `SENHA_FORTE_AQUI` conforme sua necessidade.

```bash
sudo -u postgres psql <<'SQL'
create user procifarmed with password 'SENHA_FORTE_AQUI';
create database procifarmed owner procifarmed;
\c procifarmed
-- extensões comuns (opcional)
create extension if not exists pgcrypto;
SQL
```

### 4.2. Backup e restore (recomendado)

```bash
# backup
sudo -u postgres pg_dump -Fc procifarmed > /var/backups/procifarmed.dump

# restore
# sudo -u postgres pg_restore -d procifarmed --clean /var/backups/procifarmed.dump
```

### 4.3. Migrações do banco (IMPORTANTE)

O deploy do **frontend** (Nginx + `dist/`) **não** executa migrações automaticamente.
As migrações devem ser rodadas pelo **seu backend** (ex.: Prisma, Knex, Flyway, Liquibase) como parte do deploy.

Exemplos (ajuste para sua stack):

```bash
# Exemplo Prisma
# npx prisma migrate deploy

# Exemplo Knex
# npx knex migrate:latest
```

## 5. Preparar a Aplicação

### 5.1. Clonar ou Transferir o Código

Se estiver usando Git:

```bash
cd /var/www
sudo git clone <seu-repositorio> procifarmed
cd procifarmed
```

Ou transfira os arquivos via SCP/SFTP para `/var/www/procifarmed`

### 5.2. Configurar Variáveis de Ambiente (Frontend)

> Como você vai usar **backend próprio + PostgreSQL**, o frontend **não** deve ter credenciais de banco.
> Ele apenas aponta para a URL da sua API.

Crie o arquivo `.env` na raiz do projeto:

```bash
sudo nano .env
```

Exemplo (ajuste a URL/porta da sua API):

```env
# URL base da sua API (backend próprio)
VITE_API_URL=http://localhost:3000
```

### 5.3. Instalar Dependências e Build

```bash
sudo npm install
sudo npm run build
```

Os arquivos otimizados estarão em `dist/`

## 6. Configurar Nginx

### 6.1. Criar Configuração do Site

```bash
sudo nano /etc/nginx/sites-available/procifarmed
```

Cole a seguinte configuração (inclui **no-cache** para `index.html`, cache agressivo para assets e **MIME correto para fontes**; isso evita CSS antigo e garante que `woff2` seja servido como `font/woff2`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;

    root /var/www/procifarmed/dist;
    index index.html;

    # Importante: mime types (garante woff/woff2 com Content-Type correto)
    include /etc/nginx/mime.types;

    # Fallback explícito (algumas distros não trazem woff2 no mime.types)
    types {
        font/woff2 woff2;
        font/woff  woff;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # NÃO cachear HTML (evita servir HTML antigo apontando pra bundles antigos)
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
        try_files $uri =404;
    }

    # Cache static assets (bundles com hash)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - redireciona todas as rotas para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### 6.2. Ativar o Site

```bash
sudo ln -s /etc/nginx/sites-available/procifarmed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Configurar SSL com Let's Encrypt (Recomendado)

### 7.1. Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2. Obter Certificado SSL

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções interativas. O Certbot configurará automaticamente o HTTPS.

### 7.3. Renovação Automática

O Certbot instala um cron/timer automático. Teste a renovação:

```bash
sudo certbot renew --dry-run
```

## 8. Configurar Firewall (Opcional mas Recomendado)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 9. Monitoramento e Logs

### Ver logs do Nginx

```bash
# Logs de acesso
sudo tail -f /var/log/nginx/access.log

# Logs de erro
sudo tail -f /var/log/nginx/error.log
```

### Verificar status do Nginx

```bash
sudo systemctl status nginx
```

## 10. Atualizações Futuras

Para atualizar a aplicação após mudanças:

```bash
cd /var/www/procifarmed

# Atualizar código (se usando git)
sudo git pull

# Reinstalar dependências (se necessário)
sudo npm install

# Rebuild
sudo npm run build

# Recarregar nginx
sudo systemctl reload nginx
```

## 11. Otimizações Adicionais

### 11.1. Configurar Swap (para servidores com pouca RAM)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 11.2. Rate Limiting no Nginx (proteção contra DDoS)

Adicione ao bloco `http` em `/etc/nginx/nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=limitreq:20m rate=10r/s;
limit_req zone=limitreq burst=20 nodelay;
```

## 12. Troubleshooting

### Problema: "502 Bad Gateway"
- Verifique se o build foi feito corretamente: `ls -la /var/www/procifarmed/dist`
- Verifique permissões: `sudo chown -R www-data:www-data /var/www/procifarmed/dist`

### Problema: Rotas retornam 404
- Certifique-se que `try_files $uri $uri/ /index.html;` está na config do nginx

### Problema: Variáveis de ambiente não funcionam
- Variáveis `VITE_*` precisam estar no `.env` **antes** do build
- Refaça o build após alterar o `.env`

### Problema: Backend não responde
- Verifique se sua API está rodando: `sudo systemctl status seu-backend`
- Confirme que `VITE_API_URL` aponta para a porta/host corretos
- Se estiver usando `http://localhost:3000` no `.env`, o backend **precisa estar rodando no mesmo servidor**

## 13. Segurança Adicional

### Bloquear acesso a arquivos sensíveis

Adicione à config do nginx:

```nginx
location ~ /\. {
    deny all;
}

location ~ \.(env|log|sql)$ {
    deny all;
}
```

### Fail2ban (proteção contra brute force)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Recursos

- [Documentação Nginx](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Importante:** Sempre faça backup antes de mudanças críticas e teste em ambiente de staging quando possível.
