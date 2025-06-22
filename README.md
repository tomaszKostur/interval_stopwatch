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
* Initial countdown -  ok
* create favicon.ico - ok
* configure nginx to right path /interval_stopwartch instead of / - ok
* Buy me a coffee button - ok
* create presets - ok
* for some reason I cant hear sound in tauri app
* even more funny is that on adnroid dev everythink seems to be ok - i need to check forreal app

