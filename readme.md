## How to get started

## Prerequisites

Have a modern version of Node.installed. Last check was with v20.11

## How to set up

- Open a Terminal in the folder containing the package.json
- Type `npm i` to install the dependencies inside of the project automatically
- Type `npm run dev` into the terminal and see if your files would be compiled correctly
- Take a look at the `index.ts`, the package.json and the `tsconfig.json` file to see how they work
- The `index.ts` file is the entry-point of your application (defined in `rollup.config.js`) - see how it can import other modules
- after you watched how the typescript modules work with each other you can delete all .ts files in the src folder except `index.ts`
- then empty the `index.ts` file and empty the body of your `index.html` file and start building your own app

## Starting the app

- After you did set up your application, run `npm run build` to compile it. If there are no erros, there should be a "build"-folder in your project folder
- take a look at `index.html` - it should already have a script file connected to your TypeScript (The browser can only run JavaScript)
-

Write any source files in typescript inside the source folder, the main file being index.ts as entry file for vite.

run `npm run preview` to preview your executed build
