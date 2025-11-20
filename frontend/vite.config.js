// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//    server: {
//     proxy: {
//       "/api":  import.meta.env.VITE_BACKEND_URL
//     }
//   }
// })


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default ({ mode }) => {
  // Charge les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL // <- maintenant c’est défini
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  })
}

