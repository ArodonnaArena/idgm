# MongoDB Quick Start Guide

## 🚀 Fast Setup (Choose One)

### Option A: Local MongoDB

```powershell
# 1. Install MongoDB from: https://www.mongodb.com/try/download/community

# 2. Start MongoDB service
net start MongoDB

# 3. Update .env
DATABASE_URL="mongodb://localhost:27017/idgm_db"

# 4. Setup database
npm run db:gen
npm run db:push
npm run db:seed

# 5. Run the app
npm run dev:web
```

### Option B: MongoDB Atlas (Cloud)

```powershell
# 1. Create account at: https://www.mongodb.com/cloud/atlas
# 2. Create FREE cluster (M0)
# 3. Create database user
# 4. Whitelist IP: 0.0.0.0/0 (for development)
# 5. Get connection string

# 6. Update .env
DATABASE_URL="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/idgm_db?retryWrites=true&w=majority"

# 7. Setup database
npm run db:gen
npm run db:push
npm run db:seed

# 8. Run the app
npm run dev:web
```

---

## 📝 Key Changes from MySQL

1. **Database Scripts Updated**
   - ❌ Removed: `npm run db:migrate` (MySQL migrations)
   - ✅ Use: `npm run db:push` (direct schema sync)
   - ✅ New: `npm run db:reset` (reset & reseed)

2. **Data Types Changed**
   - Prices: Decimal → Float
   - IDs: INT → ObjectId (24-char strings)

3. **No Migration Files**
   - MongoDB doesn't use migration files
   - Schema changes are pushed directly

---

## 🛠️ Available Commands

```bash
npm run db:gen        # Generate Prisma client
npm run db:push       # Push schema to MongoDB
npm run db:seed       # Seed initial data
npm run db:studio     # Open database GUI
npm run db:reset      # Reset and reseed database
npm run dev:web       # Start web app
npm run dev:admin     # Start admin dashboard
```

---

## 🔑 Default Credentials

After seeding:
- **Email**: admin@idgm.com
- **Password**: admin123

---

## 📚 Full Documentation

See `MONGODB_MIGRATION.md` for complete setup guide including:
- Detailed installation steps
- MongoDB Atlas configuration
- Troubleshooting
- Best practices

---

## ⚠️ Important Notes

1. **Environment Variables**: Update your `.env` file with MongoDB connection string
2. **XAMPP Not Needed**: MongoDB replaces MySQL, you can stop XAMPP
3. **Compass Tool**: Install MongoDB Compass for easy database management
4. **Backup Data**: If you have existing MySQL data, export it first

---

## 🆘 Quick Troubleshooting

**MongoDB not connecting?**
```powershell
# Check if MongoDB is running
net start MongoDB
```

**Schema errors?**
```powershell
# Reset database
npm run db:reset
```

**Atlas connection issues?**
- Check username/password
- Ensure IP is whitelisted (0.0.0.0/0)
- Verify database name in connection string

---

**Ready to go!** 🎉
