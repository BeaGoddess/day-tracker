# DayTracker

DayTracker is a project built for learning Angular, designed to help organize and keep track of daily tasks. The app currently lets you add, monitor, and remove tasks.

As a future feature, support habits created by repeats, such as setting up a lesson once a week so it automatically appears every Monday or any other selected day.

## Features

- **Add, edit, and delete daily habits** (all stored via localStorage)
- **Confirmation dialogs** for destructive actions

## Project Folder Structure

```
src/
  app/
    components/
    pages/
    types/
    utils/
    services/                             
    app.config.ts            
    app.routes.ts            
    app.ts                   
  assets/                    
  environments/              
angular.json, package.json   
...
```

## How to Run the Project

1. **Install dependencies**

   If you haven’t already, install the project dependencies via npm:

   ```bash
   npm install
   ```

2. **Start the development server**

   Run:

   ```bash
   ng serve
   ```

   or (if you prefer using npm):

   ```bash
   npm start
   ```

   The app will be available at [http://localhost:4200/](http://localhost:4200/).

## Building for Production

To create an optimized production build, run:

```bash
ng build
```

Output files will appear in the `dist/` directory.

## Running Tests

- **Unit tests:**  
  Uses [Vitest](https://vitest.dev/).

  ```bash
  ng test
  ```