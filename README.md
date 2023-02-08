# Ecoverse Frontend

This is the client side repo for Ecoverse, a metaverse representing real world forests, superimposing it with forestry operations data (tree density, species, CO2 emissions, etc.) and allowing purchase and sale of forest land tiles. The frontend of the dApp was made with the developer experience in mind: Next.js, TypeScript, ESLint, Prettier, Lint-Staged, VSCode, PostCSS, Tailwind CSS, Mapbox. 

## Requirements

1. NodeJS version 16 and up
2. Yarn (preferred)

## Local Development

1. Clone the project
2. Install husky

   `yarn prepare`

3. Install dependencies

   `yarn`

4. Run local development

   `yarn dev`

## Environment variables

1. Create `.env.local`

2. Include the following environment variables

   ```bash
   ENV_CONFIG=development | production
   NODE_ENV=development | production
   
   NEXT_PUBLIC_MAP_LONGITUDE=102.82019076691307 # you can change it to the location you want
   NEXT_PUBLIC_MAP_LATITUDE=17.626501946609892 # you can change it to the location you want
   NEXT_PUBLIC_MAP_INITIAL_ZOOM=5.9 # you can change it to the scale you want
   
   # Initial values for the longitude, latitude and zoom are from the Sri Trang Group
   
   NEXT_PUBLIC_CANDY_MACHINE_ID=your_candy_machine_id
   NEXT_PUBLIC_THIRD_PARTY_SECRET=
   NEXT_PUBLIC_BACKEND_URL=ecoverse_backend_url # check out the 'ecoverse-mock-be' repo
   BACKEND_URL=ecoverse_apis_url # check out the 'ecoverse-apis' repo
   BACKEND_USERNAME=master 
   BACKEND_PASSWORD=secret
   NEXT_PUBLIC_MAPBOX_KEY=your_mapbox_key
 

   RECIPIENT_PRIVATE_KEY=wallet_private_key_of_recipient
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   COINMARKETCAP_BASE_URL=https://pro-api.coinmarketcap.com
   

   
   
   ```


