# DeepDrift

Browser-based AI chat with real-time neural activity monitoring. Runs entirely in your browser using WebGPU and Transformers.js.

🚀 **Live Demo:** [deepdrift.tech/ai](https://deepdrift.tech/ai)

## Features

- 🚀 **No server required** - runs 100% in browser
- 🧠 **Local AI model** - Qwen 0.5B Chat (quantized)
- 📱 **Mobile-friendly** - works on phones with WebGPU support
- 📊 **Real-time visualization** - neural activity monitoring
- 🔒 **Private** - your conversations never leave your device

## Quick Start

1. Open `ai/index.html` in a modern browser (or visit [deepdrift.tech/ai](https://deepdrift.tech/ai))
2. Wait for model to download (~200MB, cached after first load)
3. Start chatting!

## Browser Requirements

- **Chrome/Edge 113+** (desktop/Android) - recommended
- **Safari 18+** (macOS/iOS) - experimental WebGPU support
- **WebGPU must be enabled**

### Enable WebGPU

- Chrome: `chrome://flags/#enable-unsafe-webgpu`
- Safari: Enable in Developer settings

## Deployment

### GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages
3. Source: Deploy from branch `main`
4. Select folder: `/ (root)`
5. Save and wait ~1 minute
6. Your site: `https://yourusername.github.io/deepdrift`

### Custom Domain (deepdrift.tech)

1. In your repo: Create file `CNAME` with content:
   ```
   deepdrift.tech
   ```

2. In your domain registrar (e.g., Namecheap), add DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153

   Type: A
   Host: @
   Value: 185.199.109.153

   Type: A
   Host: @
   Value: 185.199.110.153

   Type: A
   Host: @
   Value: 185.199.111.153

   Type: CNAME
   Host: www
   Value: yourusername.github.io
   ```

3. GitHub Settings → Pages → Custom domain: `deepdrift.tech`
4. Enable "Enforce HTTPS"
5. Wait 10-60 minutes for DNS propagation

## Technical Details

- **Model**: Qwen 1.5 0.5B Chat (quantized to 8-bit)
- **Framework**: Transformers.js (ONNX Runtime)
- **Chart**: Chart.js
- **Size**: ~200MB initial download (cached)
- **Inference**: Client-side WebGPU acceleration

## File Structure

```
deepdrift/
├── index.html          # Landing page
├── ai/
│   ├── index.html      # AI chat interface
│   ├── app.js          # AI logic & UI
│   └── styles.css      # Chat styling
├── CNAME               # Custom domain config
└── README.md           # This file
```

## Customization

### Change AI Model

In `app.js`, line 62:
```javascript
generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat');
```

Options:
- `Xenova/TinyLlama-1.1B-Chat-v1.0` - Smaller, faster
- `Xenova/Phi-2` - Smarter, larger (2.7B)

### Adjust Response Length

In `app.js`, line 91:
```javascript
max_new_tokens: 200, // Increase for longer responses
```

## Troubleshooting

**Model won't load on mobile:**
- Ensure you're on Chrome 113+ for Android
- Check if WebGPU is supported: https://webgpureport.org/
- Try switching to a smaller model (TinyLlama)

**Slow on iPhone:**
- Safari's WebGPU support is experimental
- Use Chrome for better performance

**Chart not updating:**
- Refresh the page
- Check browser console for errors

## License

MIT - feel free to fork and modify!

## Credits

- [Transformers.js](https://github.com/xenova/transformers.js) by Xenova
- [Chart.js](https://www.chartjs.org/)
- Qwen model by Alibaba Cloud

---

Made with ⚡ by DeepDrift | [GitHub](https://github.com/yourusername/deepdrift)
