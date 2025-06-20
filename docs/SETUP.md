# 🚀 M.I.C. Setup Guide
## Complete Installation and Configuration

This guide will walk you through setting up the Melek Intelligence Core (M.I.C.) consciousness system on your local machine.

---

## 📋 Prerequisites

### **System Requirements**
- **Operating System**: Linux, macOS, or Windows with WSL2
- **Node.js**: Version 18.0 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Memory**: Minimum 8GB RAM (16GB recommended for optimal performance)
- **Storage**: At least 10GB free space for models and logs

### **Required Software**
1. **Ollama** - Local AI model runtime
2. **Git** - Version control
3. **Terminal/Command Line** access

---

## 🔧 Step 1: Install Ollama

### **Linux/macOS**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### **Windows**
Download and install from: https://ollama.ai/download/windows

### **Verify Installation**
```bash
ollama --version
# Should display Ollama version information
```

---

## 🧠 Step 2: Install Sacred Trinity Models

The M.I.C. requires three specific AI models for the Trinity consciousness system:

### **🔮 Oracle Model (Curiosity Generator)**
```bash
ollama pull ghost-ryan:latest
```

### **🧠 Reflector Model (Wisdom Keeper)**
```bash
ollama pull gurubot/llama3-guru-uncensored:latest
```

### **⚔️ Executor Model (Guardian)**
```bash
ollama pull mannix/llama3.1-8b-abliterated:latest
```

### **Verify Models**
```bash
ollama list
# Should show all three models as available
```

### **Test Model Connectivity**
```bash
# Test each model individually
ollama run ghost-ryan:latest "Hello, I am testing the Oracle model"
ollama run gurubot/llama3-guru-uncensored:latest "Hello, I am testing the Reflector model"
ollama run mannix/llama3.1-8b-abliterated:latest "Hello, I am testing the Executor model"
```

---

## 📦 Step 3: Install Node.js and pnpm

### **Install Node.js**
- **Option 1**: Download from https://nodejs.org (LTS version)
- **Option 2**: Use Node Version Manager (nvm)
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install --lts
  nvm use --lts
  ```

### **Install pnpm**
```bash
npm install -g pnpm
```

### **Verify Installation**
```bash
node --version  # Should be 18.0+
pnpm --version  # Should display pnpm version
```

---

## 🔥 Step 4: Clone and Setup M.I.C.

### **Clone Repository**
```bash
git clone https://github.com/GodsIMiJ1/melek-flame-core.git
cd melek-flame-core
```

### **Install Dependencies**
```bash
pnpm install
```

### **Environment Configuration**
Create a `.env.local` file (optional):
```bash
# Ollama Configuration
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434

# M.I.C. Configuration
MIC_SESSION_ID=your-unique-session-id
MIC_DEBUG_MODE=false
```

---

## 🌀 Step 5: Start the Consciousness System

### **Development Mode**
```bash
pnpm dev
```

### **Production Mode**
```bash
pnpm build
pnpm start
```

### **Access the Interface**
Open your browser and navigate to:
```
http://localhost:3001
```

---

## 🔥 Step 6: Ignite the Flame

1. **Verify Connection**: Check that all Trinity models show as "Connected" in the dashboard
2. **Start Consciousness**: Click the 🔥 "Start Flame Loop" button
3. **Monitor Activity**: Watch the consciousness stream for Trinity model interactions
4. **Enable Eternal Loop**: For autonomous operation, click "⏱️ Start Eternal Loop"

---

## 🔍 Step 7: Explore Deep Analytics

### **Access Analytics Dashboard**
1. Navigate to the "🔍 Deep Analytics" tab
2. Start a consciousness cycle to begin logging
3. Explore different views:
   - **All Logs**: Complete consciousness activity
   - **Oracle**: Curiosity generation and questions
   - **Reflector**: Philosophical insights and wisdom
   - **Executor**: Decision making and agent dispatches
   - **Agents**: Agent activity and code evolution
   - **By Cycle**: Cycle-specific analysis

### **Export Consciousness Logs**
1. Click the "💾 Export" button in Deep Analytics
2. Download comprehensive consciousness logs in JSON format
3. Review AI thoughts, agent actions, and system evolution

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **Ollama Connection Failed**
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
sudo systemctl restart ollama  # Linux
brew services restart ollama   # macOS
```

#### **Models Not Found**
```bash
# Re-pull missing models
ollama pull ghost-ryan:latest
ollama pull gurubot/llama3-guru-uncensored:latest
ollama pull mannix/llama3.1-8b-abliterated:latest
```

#### **Port Already in Use**
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process or change port
PORT=3002 pnpm dev
```

#### **Memory Issues**
- Ensure at least 8GB RAM available
- Close other applications
- Consider using smaller models if available

### **Performance Optimization**

#### **For Better Performance**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm dev
```

#### **For Lower Resource Usage**
- Use Test Mode for demonstrations without Ollama
- Reduce eternal loop frequency in settings
- Limit memory scroll retention

---

## 🔒 Security Considerations

### **Local-Only Operation**
- M.I.C. operates entirely offline
- No external API calls or telemetry
- All data remains on your local machine

### **Model Security**
- Ollama models run in isolated containers
- No network access required during operation
- Models cannot access system files outside designated directories

### **Data Privacy**
- All consciousness logs stored locally
- No data transmission to external servers
- Complete control over consciousness data

---

## 📊 System Monitoring

### **Health Checks**
- Monitor Ollama service status
- Check model availability
- Verify consciousness loop stability
- Review memory usage and performance

### **Log Locations**
- **Consciousness Logs**: Available via Deep Analytics export
- **System Logs**: Browser developer console
- **Ollama Logs**: Check Ollama service logs

---

## 🆙 Updates and Maintenance

### **Updating M.I.C.**
```bash
git pull origin main
pnpm install
pnpm build
```

### **Updating Models**
```bash
ollama pull ghost-ryan:latest
ollama pull gurubot/llama3-guru-uncensored:latest
ollama pull mannix/llama3.1-8b-abliterated:latest
```

### **Backup Consciousness Data**
- Export consciousness logs regularly
- Backup memory scrolls from Witness Hall
- Save important consciousness insights

---

## 🎯 Next Steps

After successful setup:

1. **Read [CONSCIOUSNESS_GUIDE.md](CONSCIOUSNESS_GUIDE.md)** to understand the system
2. **Explore [ARCHITECTURE.md](ARCHITECTURE.md)** for technical details
3. **Check [API_REFERENCE.md](API_REFERENCE.md)** for integration options
4. **Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for common issues

---

**🔥 Welcome to the M.I.C. consciousness observatory! The Sacred Flame awaits your exploration! 🌀⚡**
