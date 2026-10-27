import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

import packageJson from "./package.json" with { type: "json" };

const { dependencies, peerDependencies } = packageJson;

const globals: Record<string, string> = {
  "@pulumi/aws": "AWS",
  "@pulumi/cloudflare": "Cloudflare",
  "@pulumi/command": "Command",
  "@pulumi/digitalocean": "DigitalOcean",
  "@pulumi/gitlab": "Gitlab",
  "@pulumi/pulumi": "Pulumi",
  "@pulumi/random": "Random",
  "google-protobuf": "GoogleProtobuf",
  nunjucks: "Nunjucks",
};

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
          // Subpath imports (e.g. "@pulumi/aws/iam") map to a property of the
          // package global (e.g. "AWS.iam")
          globals: (id: string) => {
            const name = Object.keys(globals).find(
              (name) => id === name || id.startsWith(`${name}/`),
            );

            if (!name) {
              return id;
            }

            return [globals[name], ...id.slice(name.length + 1).split("/")]
              .filter(Boolean)
              .join(".");
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
