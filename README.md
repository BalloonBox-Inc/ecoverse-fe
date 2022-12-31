# Ecoverse Frontend

Metaverse app built using Nextjs and Typescript

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

   ```
   NEXT_PUBLIC_BACKEND_URL=[URL]
   NEXT_PUBLIC_MAPBOX_KEY=[You mapbox access key]

   NEXT_PUBLIC_MAP_LONGITUDE=102.82019076691307
   NEXT_PUBLIC_MAP_LATITUDE=17.626501946609892
   NEXT_PUBLIC_MAP_INITIAL_ZOOM=5.9
   ```

   Initial values for the longitude, latitude and zoom are from the Sri Trang Group
