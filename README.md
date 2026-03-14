# saas-ai-ui
A Web-UI-Interface to create and edit a (TypeScript / node.js based) SaaS application with AI (openrouter/free).<br/>
It has been developed based on https://github.com/Steffen-1967/saas-ai-cli/
For backward compatibility the CLI-Interface has been reworked to use the same services as the Web-UI-Interface.

## Purpose
This project is a self-made CLI, to create and edit a (TypeScript / node.js based) SaaS application with AI (openrouter/free).<br/>
This Web-UI-Interface has been created to edit source code in a convenient way and also in parallel with a team.<br/>
The whole CLI was generated with _Microsoft Copilot_ on 2026-03-09.

## Warning
For local storage use a user-folder!
- e.g. ```C:\Users\<DEINNAME>\Documents\saas-ai-coding```
- or   ```C:\Users\<DEINNAME>\Desktop\saas-ai-coding```
Don't use
- ```C:\Data\...```
- ```C:\root\...```
- ```C:\dev\...```
- ```C:\projects\...```
- ```C:\GitHub\...```
- network folders
- mounted folders
Next.js 16 + Turbopack create ```/ROOT``` in Windows, if the project is stored in ```C:\Data\...``` or similar.
**Downgrade to Next.js 15, because Next.js 16 has a known bug to fall back to the ```/ROOT```-Sandbox-FS always.**

## CLI-Interface/backend for backward compatibility.
The functionality of https://github.com/Steffen-1967/saas-ai-cli/ has not been extended.<br/>
The CLI-Interface uses the same services as the Web-UI-Interface.<br/>
For manual editing of source code _VS Code_ is planned.<br/>

### How the CLI/backend can be run locally now (the CLI code is used as a backend now)
1. Install the commands (if not done already).<br/>
--> ```npm install```<br/>
2. Run the command.<br/>
--> ```npm run server```<br/>

### How the UI can be run locally now
1. Install the commands (if not done already).<br/>
- Die Komponente ```express``` muss installiert sein.
- --> ```npm install express```
- Die Komponenten ```cors``` und ```body-parser``` sollten auch installiert sein.
- --> ```npm install cors body-parser```
--> ```npm install```<br/>
- Die Komponenten ```react``` und ```react-dom``` müssen installiert sein.
- --> ```npm install next react react-dom```
- Die Komponenten ```@monaco-editor/react``` und ```zustand``` müssen installiert sein.
- --> ```npm install @monaco-editor/react zustand```
- Die Komponenten ```tailwindcss``` und ```@tailwindcss/postcss``` müssen installiert sein.
- --> ```npm install -D tailwindcss @tailwindcss/postcss```
- Eventuell ist es erforderlich eine spezielle Version zu installieren - z. B. ```postcss@8.4.31```
2. Run the backend.<br/>
--> ```npm run dev```<br/>

## General
This is a  Web-GUI-Interface project targeted to create and edit _TypeScript_ source code. The runtime environment shold be _node.js_.<br/>
The project has been initiated with _node.js_ version 24.14.0 (LTS).<br/>
The project was initially configured to use the ES-Module-Syntax (import/export).<br/>
--> ```"type": "module"``` in ```package.json```<br/>
--> file suffix ```*.mts```<br/>
It has been extended later to be more flexible and convenient.

The _OpenRouter_ has been chosen as the AI model provider.<br/>
The _openrouter/free_ has been chosen as the free (zero cost) AI model for coding.<br/>
--> https://openrouter.ai/openrouter/free<br/>
The _SaaS-Dev-01_ API key has been created to be used with _openrouter/free_.<br/>
--> ```Expires: never```<br/>
--> ```Usage: $0.00```<br/>
--> ```Limit: unlimited TOTAL```<br/>
--> https://openrouter.ai/settings/keys<br/>

The access to the _OpenRouter_ HTTP-API is implemented using _fetch_ (instead of _axios_) to simplify deployment.<br/>

This Web-GUI-Interface is based on an _API-Server_, that uses an _engine_.<br/>
The _engine_ is stored in ```server/core/engine.js```.<br/>
The _engine_ is used by
* ```/server/routes/files.js```
* ```/server/routes/process.js```
* ```/server/routes/config.js```
* ```/server/index.js```
So the collaboration between the components looks like:
* CLI/backend → Engine
* API → Engine
* Web‑UI → API → Engine
The folder structure is set up for a clean separation:
* ```/routes``` contains the HTTP endpoints
* ```/services``` contains the helper methods
* ```/core``` contains the engine (the _core_)
The Web-GUI can run on
* http://localhost:3000
* https://mylife.org (needs adoption to get rid of the port 3000)

## Prerequisits
The API key for _openrouter/free_ must be stored in such a way that it is available system-wide, but not checked in into _github_.<br/>
--> Environment variables for this account<br/>
--> ```OPENROUTER_API_KEY```<br/>
To link this CLI/backend globally:<br/>
--> ```npm link``` (run in the root-folder of the project).<br/>
To use this CLI/backend in other projects:<br/>
--> ```saas-ai-coding src/_name_.ts``` (sample without command)<br/>
--> ```saas-ai-coding src/_name_.ts "refactor the code for better testability"``` (sample with command)

## Functionality
This Web-GUI-Appication was automatically created with _Microsoft Copilot_.<br/>
The backend component is evolved from the https://github.com/Steffen-1967/saas-ai-cli project.

## Application
This CLI/backend is system-globally available with the call ```saas-ai-coding```.<br/>
It has been tested with the _Windows PowerShell_.<br/>
It should be called from the root-folder of the project, that hosts the code to apply the CLI/backend on.<br/>
--> ```saas-ai .\src\visualizer\flow-visualizer.mts "Schreibe code, der .\src\visualizer\test-daten.json in den Speicher liest."```