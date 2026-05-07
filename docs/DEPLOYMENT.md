# SPODTH Deployment Guide

## Backend Deployment (Render)

### Prerequisites
- Render account (https://render.com)
- PostgreSQL database
- Spotify Developer credentials
- Git repository

### Setup PostgreSQL Database

1. **Create Database on Render**
   - Go to Render Dashboard → New → PostgreSQL
   - Choose region, database name: `spodth_db`
   - Copy the connection string

2. **Initialize Database Schema**
   ```bash
   # Copy schema.sql to a migration tool
   # Run migrations using pg CLI or Render web console
   ```

### Deploy Backend

1. **Connect Repository**
   ```bash
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Environment: Node.js
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<your-jwt-secret>
   SPOTIFY_CLIENT_ID=<your-spotify-id>
   SPOTIFY_CLIENT_SECRET=<your-spotify-secret>
   SPOTIFY_REDIRECT_URI=https://<your-backend-url>/api/auth/spotify/callback
   FRONTEND_URL=https://<your-frontend-url>
   RENDER_EXTERNAL_URL=https://<your-backend-url>
   ```

4. **Uptime Ping Strategy**
   - Create a cron job to ping `/api/health` every 14 minutes
   - Use a service like UptimeRobot (https://uptimerobot.com)
   - This keeps your free tier service from sleeping

### Spotify Developer Setup

1. Go to https://developer.spotify.com/dashboard
2. Create an application
3. Add redirect URI: `https://<your-backend-url>/api/auth/spotify/callback`
4. Copy Client ID and Client Secret

---

## Frontend Deployment (Vercel)

### Setup

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Project on Vercel**
   - Go to https://vercel.com
   - Import project from GitHub
   - Select `frontend` directory as root

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://<your-backend-url>
   VITE_SPOTIFY_CLIENT_ID=<your-spotify-id>
   VITE_SPOTIFY_REDIRECT_URI=https://<your-frontend-url>/auth/spotify/callback
   ```

4. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## Database Setup

### Initial Setup

```bash
# Connect to PostgreSQL
psql postgresql://<user>:<password>@<host>:<port>/<database>

# Run schema
\i src/config/schema.sql

# Verify tables
\dt
```

### Backup & Restore

```bash
# Backup
pg_dump postgresql://<user>:<password>@<host>:<port>/<database> > backup.sql

# Restore
psql postgresql://<user>:<password>@<host>:<port>/<database> < backup.sql
```

---

## Monitoring & Maintenance

### Log Monitoring
- Render: Check logs in the dashboard
- Vercel: Check logs in project settings

### Performance Optimization
1. Enable caching on CDN (Vercel auto)
2. Optimize database queries
3. Implement Redis for session caching (future)

### Security Checklist
- ✅ HTTPS enforced
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ JWT tokens validated
- ✅ SQL injection prevention (parameterized queries)

---

## Scaling Strategy

### Phase 2: Increased Traffic
- Move database to managed service (AWS RDS, DigitalOcean)
- Implement Redis for caching
- Add CDN for static assets (CloudFlare)
- Consider database read replicas

### Phase 3: Enterprise
- Microservices architecture
- Kafka for event streaming
- Elasticsearch for search
- Kubernetes deployment
- Multi-region deployment

---

## Cost Optimization

### Current Stack
- Render Free Tier: $0 (with uptime ping)
- Vercel Free Tier: $0
- PostgreSQL Free Tier: $0 (Render)
- **Total: $0**

### With Custom Domain
- Domain: ~$10/year
- Render Pro (if needed): ~$7/month
- Vercel Pro (optional): $20/month
- **Estimated: $15-25/month**

---

## Troubleshooting

### Common Issues

**CORS Errors**
```
Solution: Check CORS configuration in backend
Expected: FRONTEND_URL matches your actual frontend URL
```

**Database Connection Issues**
```
Solution: Verify DATABASE_URL format and network access
Check: Render allows connections from Render IPs
```

**Spotify OAuth Failing**
```
Solution: Verify redirect URI matches exactly
Check: Case-sensitive, HTTPS required in production
```

---

## Next Steps

1. Set up monitoring alerts
2. Implement automated backups
3. Add analytics tracking
4. Set up CI/CD pipeline
5. Plan Phase 2 features
