import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
import { Droplet } from "../../../src/digitalocean/Droplet";

export = async () => {
  const config = await getConfig();

  const droplet = new Droplet("test", config);

  return {
    droplet_id: interpolate`${droplet.id}`,
  };
};
