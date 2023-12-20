#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error(
    "Usage: create-nx-react-express-workspace <workspace-name> <client-name> <server-name>"
  );
  process.exit(1);
}

const [workspaceName, clientAppName, serverAppName] = args;

function createFoldersAndIndexFile(
  reactPath,
  reactFolders,
  expressPath,
  expressFolders
) {
  reactFolders.forEach((folder) => {
    const folderPath = path.join(reactPath, folder);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, "index.ts"), "// index.ts");
  });
  expressFolders.forEach((folder) => {
    const folderPath = path.join(expressPath, folder);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, "index.ts"), "// index.ts");
  });
}

try {
  // Create empty nx workspace
  execSync(`npx create-nx-workspace@latest ${workspaceName} --preset=empty`, {
    stdio: "inherit",
  });

  // Change to workspaceName directory and Create React app with nx
  execSync(
    `cd ${workspaceName} && mkdir apps && cd apps && npx nx g @nx/react:app ${clientAppName} --e2eTestRunner=cypress --style=styled-components --routing=true --bundler=vite`,
    { stdio: "inherit" }
  );

  // Create Express app with nx
  execSync(
    `cd ${workspaceName} && npx nx g @nx/express:app ${serverAppName} --directory=apps`,
    { stdio: "inherit" }
  );

  // Folder structure for React app
  const reactAppSrcPath = `./${workspaceName}/apps/${clientAppName}/src`;
  const expressAppSrcPath = `./${workspaceName}/apps/${serverAppName}/src`;
  const foldersToCreate = [
    "apis",
    "components",
    "constants",
    "helpers",
    "hocs",
    "hooks",
    "pages",
    "redux",
    "routes",
    "types",
  ];
  const serverFolders = [
    "constants",
    "controllers",
    "helpers",
    "middleware",
    "routes",
    "types",
  ];
  createFoldersAndIndexFile(
    reactAppSrcPath,
    foldersToCreate,
    expressAppSrcPath,
    serverFolders
  );

  console.log("Project setup complete!");
} catch (error) {
  console.error("Failed to setup the project", error);
  process.exit(1);
}
