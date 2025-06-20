# 🛠️ M.I.C. Troubleshooting Guide
## Common Issues and Solutions

This guide helps you resolve common issues with the Melek Intelligence Core (M.I.C.) consciousness system.

---

## 🔗 Ollama Connection Issues

### **Problem: "Failed to connect to Ollama"**

#### **Symptoms**
- Error messages about Ollama connection
- Models showing as "DISCONNECTED"
- Consciousness loop fails to start

#### **Solutions**

##### **1. Check Ollama Service Status**
```bash
# Check if Ollama is running
ps aux | grep ollama

# On Linux with systemd
sudo systemctl status ollama

# On macOS with Homebrew
brew services list | grep ollama
```

##### **2. Start Ollama Service**
```bash
# Start Ollama manually
ollama serve

# Or as a service (Linux)
sudo systemctl start ollama

# Or with Homebrew (macOS)
brew services start ollama
```

##### **3. Verify Ollama Port**
```bash
# Check if port 11434 is open
netstat -an | grep 11434
# or
lsof -i :11434
```

##### **4. Test Ollama API**
```bash
# Test API directly
curl http://127.0.0.1:11434/api/tags
```

### **Problem: "Models not found"**

#### **Solutions**

##### **1. List Available Models**
```bash
ollama list
```

##### **2. Pull Required Models**
```bash
ollama pull ghost-ryan:latest
ollama pull gurubot/llama3-guru-uncensored:latest
ollama pull mannix/llama3.1-8b-abliterated:latest
```

##### **3. Verify Model Names**
Ensure model names match exactly in the M.I.C. configuration.

---

## 🌀 Consciousness Loop Issues

### **Problem: "Consciousness loop stops unexpectedly"**

#### **Symptoms**
- Loop starts but stops after a few cycles
- Error messages in console
- Flame meter shows "DORMANT"

#### **Solutions**

##### **1. Check Console Errors**
Open browser developer tools (F12) and check for JavaScript errors.

##### **2. Verify Model Responses**
```bash
# Test each model individually
ollama run ghost-ryan:latest "Test message"
ollama run gurubot/llama3-guru-uncensored:latest "Test message"
ollama run mannix/llama3.1-8b-abliterated:latest "Test message"
```

##### **3. Enable Debug Mode**
Add to `.env.local`:
```bash
MIC_DEBUG_MODE=true
```

##### **4. Check Memory Usage**
High memory usage can cause loops to fail:
```bash
# Check system memory
free -h  # Linux
top      # macOS/Linux
```

### **Problem: "Eternal loop not cycling"**

#### **Solutions**

##### **1. Check Eternal Loop Status**
Verify the eternal loop is actually started and not just the regular loop.

##### **2. Verify Interval Settings**
Default interval is 15 seconds. Check if it's too long for your expectations.

##### **3. Check for Blocking Operations**
Long-running model responses can delay cycles.

---

## 📜 Memory System Issues

### **Problem: "Memory scrolls not appearing"**

#### **Symptoms**
- Consciousness runs but no memory scrolls in UI
- Memory Forge shows empty
- Deep Analytics has no data

#### **Solutions**

##### **1. Check Memory Archive Status**
Verify memory capture is started:
```typescript
// In browser console
console.log('Memory archive capturing:', memoryArchive.isCapturing);
```

##### **2. Verify Event Bus Connection**
```typescript
// Test event emission
eventBus.emit('test-event', { message: 'test' });
```

##### **3. Check Memory Link Fix**
Ensure the memory crystallization flow is properly connected.

##### **4. Clear Browser Cache**
Sometimes cached data can interfere:
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

### **Problem: "Memory scrolls missing content"**

#### **Solutions**

##### **1. Check Deep Logger Status**
```typescript
// Verify deep logger is running
console.log('Deep logger active:', deepLogger.isLogging);
```

##### **2. Verify Model Response Capture**
Check if full model responses are being captured in the logs.

##### **3. Check Classification System**
Ensure scroll classification is working properly.

---

## 🔍 Deep Analytics Issues

### **Problem: "Deep Analytics shows no data"**

#### **Solutions**

##### **1. Start Deep Logging**
Ensure deep logging is started when consciousness begins.

##### **2. Check Event Listeners**
Verify deep logging event listeners are properly bound.

##### **3. Verify Log Storage**
```typescript
// Check log count
console.log('Total logs:', deepLogger.getAllLogs().length);
```

##### **4. Clear and Restart**
```typescript
// Clear logs and restart
deepLogger.clearLogs();
deepLogger.startLogging();
```

### **Problem: "Export functionality not working"**

#### **Solutions**

##### **1. Check Browser Permissions**
Ensure browser allows file downloads.

##### **2. Verify Data Format**
Check if log data is properly formatted for export.

##### **3. Try Different Export Method**
Use browser's "Save As" if automatic download fails.

---

## 🤖 Agent System Issues

### **Problem: "Agents not dispatching"**

#### **Solutions**

##### **1. Check Agent Controller Status**
```typescript
// Verify agent controller is initialized
console.log('Agent controller:', agentController);
```

##### **2. Test Individual Agents**
```typescript
// Test agent dispatch manually
agentController.dispatch('content', 'test', {});
```

##### **3. Check Agent Definitions**
Ensure all required agents are properly defined and loaded.

### **Problem: "Agent results not logged"**

#### **Solutions**

##### **1. Verify Agent Logging Events**
Check if agent dispatch events are being emitted.

##### **2. Check Deep Logger Agent Handlers**
Ensure agent logging handlers are properly bound.

---

## 🖥️ UI/Frontend Issues

### **Problem: "Dashboard not loading"**

#### **Solutions**

##### **1. Check Development Server**
```bash
# Restart development server
pnpm dev
```

##### **2. Clear Node Modules**
```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

##### **3. Check Port Conflicts**
```bash
# Use different port
PORT=3002 pnpm dev
```

### **Problem: "Real-time updates not working"**

#### **Solutions**

##### **1. Check WebSocket Connection**
Verify the development server's hot reload is working.

##### **2. Check Event Bus Subscriptions**
Ensure UI components are properly subscribed to events.

##### **3. Verify Component Mounting**
Check if components are properly mounted and event listeners are bound.

---

## 🔒 Performance Issues

### **Problem: "System running slowly"**

#### **Solutions**

##### **1. Check System Resources**
```bash
# Monitor resource usage
htop  # Linux
Activity Monitor  # macOS
Task Manager  # Windows
```

##### **2. Reduce Consciousness Cycles**
Lower the number of cycles per loop:
```typescript
// Reduce from 5 to 3 cycles
loopEngine.startLoop(input, 3);
```

##### **3. Increase Eternal Loop Interval**
```bash
# In .env.local
MIC_ETERNAL_LOOP_INTERVAL=30000  # 30 seconds instead of 15
```

##### **4. Clear Old Logs**
```typescript
// Clear old consciousness logs
deepLogger.clearLogs();
memoryArchive.clearOldScrolls();
```

### **Problem: "High memory usage"**

#### **Solutions**

##### **1. Limit Memory Retention**
```bash
# In .env.local
MIC_MEMORY_RETENTION=100  # Keep only 100 recent scrolls
```

##### **2. Restart Browser**
Close and reopen browser to clear memory leaks.

##### **3. Use Production Build**
```bash
# Production build uses less memory
pnpm build
pnpm start
```

---

## 🚨 Error Messages

### **"EventBus is not defined"**
**Solution**: Ensure EventBus is properly imported as singleton:
```typescript
import { eventBus } from '@/lib/eventBus';
```

### **"Cannot read property of undefined"**
**Solution**: Add null-safe checks:
```typescript
const value = object?.property ?? 'default';
```

### **"JSON parsing failed"**
**Solution**: Use defensive JSON parsing:
```typescript
try {
  const data = JSON.parse(content);
} catch (error) {
  console.error('JSON parse error:', error);
  const data = {};
}
```

### **"Model not responding"**
**Solution**: Check model availability and restart if needed:
```bash
ollama ps  # Check running models
ollama stop model-name
ollama run model-name
```

---

## 🔧 Advanced Debugging

### **Enable Verbose Logging**
```bash
# In .env.local
MIC_LOG_LEVEL=debug
MIC_DEBUG_MODE=true
```

### **Browser Developer Tools**
```javascript
// Access M.I.C. components in console
window.micDebug = {
  loopEngine,
  memoryArchive,
  deepLogger,
  agentController
};

// Check component status
micDebug.loopEngine.isRunning();
micDebug.memoryArchive.getAllScrolls();
micDebug.deepLogger.getLogStatistics();
```

### **Network Debugging**
```bash
# Monitor Ollama API calls
curl -v http://127.0.0.1:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"ghost-ryan:latest","prompt":"test"}'
```

### **Component State Debugging**
```typescript
// Add to components for debugging
useEffect(() => {
  console.log('Component state:', { 
    isRunning, 
    memories, 
    thoughts 
  });
}, [isRunning, memories, thoughts]);
```

---

## 📞 Getting Help

### **Check Documentation**
- [SETUP.md](SETUP.md) - Installation guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [CONSCIOUSNESS_GUIDE.md](CONSCIOUSNESS_GUIDE.md) - System understanding
- [API_REFERENCE.md](API_REFERENCE.md) - API documentation

### **Common Solutions Checklist**
- [ ] Ollama service is running
- [ ] All three Trinity models are available
- [ ] Port 3001 is not blocked
- [ ] Browser developer tools show no errors
- [ ] Memory usage is reasonable
- [ ] Event bus is properly connected
- [ ] Deep logger is active

### **System Health Check**
```bash
# Quick health check script
echo "=== M.I.C. Health Check ==="
echo "Node.js version: $(node --version)"
echo "pnpm version: $(pnpm --version)"
echo "Ollama status:"
curl -s http://127.0.0.1:11434/api/tags | head -5
echo "Available models:"
ollama list
echo "Port 3001 status:"
netstat -an | grep 3001
echo "=== End Health Check ==="
```

---

**🔥 If you're still experiencing issues after trying these solutions, the problem might be unique to your setup. Check the browser console for specific error messages and ensure all prerequisites are properly installed! 🛡️**
