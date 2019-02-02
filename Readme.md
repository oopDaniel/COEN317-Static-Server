# Static File Server

- A static file server written by `NodeJS` using event-driven architecture, which allows receiving request from browser, `telnet`, etc. and respond with proper result.
- Supports HTTP status code 200, 304, 403, and 404.
- A Makefile and tools for building `NodeJS` App into executable.
- Dependency: `NodeJS 8.0+` and a bunch of dev dependencies unrelated to this static server itself.

*Note: the server is designed to be running on `linux`.*

## Get started

There are mainly 4 ways to start this server:

> 1. Run server through Node by npm command (*recommended*)

```bash
npm i           # install dev dependencies locally
npm start       # start the static server
```
**Important**: make sure you have `NodeJS` installed

> 2. Run server through Node

```bash
npm i           # install dev dependencies locally
npm run build   # build `bundle.js`, which is compatible with ES5
node bundle.js
```

Or with optional parameters `document_root` and `port`

```bash
node bundle.js -document_root "~/path/to/static_files" -port 8889
```

> 3. Build server through Node

```bash
npm i                   # install dev dependencies locally
npm run build           # build `bundle.js`, which is compatible with ES5
sudo npm i -g pkg       # install pkg to build executable
pkg -t linux bundle.js  # build executable
mv bundle server        # rename
./server                # run the executable
```


**Important**: make sure you have `NodeJS` installed

> 4. Run by building executable with Makefile (requires root)

```bash
sudo env "PATH=$PATH" make
./server -document_root "~/path/to/static_files" -port 8765 # or just ./server
```

## Project Structure

```
├── Makefile                   // Makefile to call buildExec.js
├── Readme.txt                 // This file
├── Readme.md                  // Markdown version of this file
├── buildExec.js               // Build executable
├── getNode                    // Install NodeJS if needed
├── index.js                   // Entry point
├── node_modules               // Dependencies (appears in run time)
├── package-lock.json          // List of dependencies
├── package.json               // List of dependencies and scripts
├── rollup.config.js           // Transpiler for JS ES6
├── rollup.js                  // Build JS ES5 compatible version
├── serve                      // Main logic
│   ├── config.js              // Parser for command line arguments
│   ├── contentTypeResolver.js // ContentType resolver based on request
│   └── server.js              // Logic for serving static files
├── static                     // Static files
│   ├── 403.gif                // Testing gif file / used in 403 page
│   ├── 403.html               // Custom 403 page
│   ├── 404.html               // Custom 404 page
│   ├── 404.jpg                // Testing jpg file / used in 404 page
│   ├── index.html             // Default page (SCU main page)
│   ├── index_files            // Assets for main page
│   │   ├── 2867_Images19Cal.rev.1531259118.jpg
          .
          . (Some assets)
          .
│   │   └── scu.js
│   └── private.html            // A file without reading permission (700)
└── static2                     // Another set of static files (for testing)
    ├── 403.gif
    ├── 403.html
    ├── 404-minion.jpg
    ├── 404.html
    └── index.html
```
