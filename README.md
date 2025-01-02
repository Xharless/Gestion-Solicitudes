# Gestion-Solicitudes
App sobre gestión de solicitudes echa con Electron como Frontend Framework y sqlite3 como BD 

## Consideraciones
* Para ejecutar el codigo, hay que hacer las siguientes lineas de codigo
  1. npm install
  2. npm init -y
  3. npm install electron --save-dev
- Luego configurar package.json para que en el script pueda comenzar con npm start. Como vamos a ocupar sqlite3, debemos hacer npm install sqlite3
- Para crear la BD hay que hacer node database.js 
- Para empaquetar la app primero debemos hacer:
  1. npm install --save-dev electron-builder
  2. Luego modificar el package.json
  3. npm run dist