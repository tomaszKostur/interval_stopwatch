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
# to run dev server
npx parcel src/index.html

# to create prod release
./create_release.sh

######
TODO:
* Initial countdown
* create favicon.ico - ok
* configure nginx to right path /interval_stopwartch instead of / - ok
* Buy me a coffee button - ok
* create presets

