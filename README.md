# initialization steps

npm init
npm install --save-dev typescript tailwindcss postcss parcel
npm install flowbite
npx tsc --init
# configure tsconfig.json
mkdir src
touch src/index.html
npx tailwindcss init
touch .postcssrc
# configure postcssrc ... i have no idea ... {  "plugins": {    tailwindcss": {}  }}

# add content to tailwind.config.js
# create src/index.css
# create index.ts
# add "./node_modules/flowbite/**/*.js" to tailwind.config.js content

#####

npx parcel src/index.html

### I had a problem with including assets into parcel dist directory
npm install @parcel/transformer-raw --save-dev
