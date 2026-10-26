import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { dependencies, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: "dzangolab-pulumi",
        name: "DzangolabPulumi",
      },
      rollupOptions: {
        // Match subpath imports (e.g. "@pulumi/aws/iam") too, not just package names
        external: (id: string) =>
          [...Object.keys(peerDependencies), ...Object.keys(dependencies)].some(
            (name) => id === name || id.startsWith(`${name}/`),
          ),
        output: {
          exports: "named",
          globals: {
            "@pulumi/aws": "AWS",
            "@pulumi/cloudflare": "Cloudflare",
            "@pulumi/command": "Command",
            "@pulumi/digitalocean": "DigitalOcean",
            "@pulumi/gitlab": "Gitlab",
            "@pulumi/pulumi": "Pulumi",
            nunjucks: "Nunjucks",
          },
        },
      },
      target: "es2022",
    },
    resolve: {
      alias: {
        "@/": new URL("src/", import.meta.url).pathname,
      },
    },
    test: {
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
      },
    },
  };
});
