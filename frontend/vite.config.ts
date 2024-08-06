import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // 你希望的端口号
    strictPort: true, // 如果端口已被占用则会直接退出，而不是尝试使用下一个可用端口
    host: '0.0.0.0', // 设置为 '0.0.0.0' 以便在局域网中访问
    watch: {
      usePolling: true, // 使用轮询而不是inotify来监视文件更改
    },
  },
})
