# NextJS Boilerplate with Typescript

This is a boilerplate for any NextJS project that is using typescript. Other stacks used in this boilerplate are the following:

1. Prettier
2. Eslint
3. Husky
4. Lint-stage
5. TailwindCSS

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

## Additional Folder Structure

Include this folders as needed in root. These are preferred folder names but not required.

1. `components` - All the components that are not pages will be under this folder. Create subfolders as needed (eg. layouts, etc)
2. `store` - For third party state management storage
3. `hooks` - For custom hooks and context
4. `services` - For api calls
5. `utils` - For helper functions
