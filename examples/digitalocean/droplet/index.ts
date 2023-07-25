import { digitalocean } from "@dzangolab/pulumi";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const droplet = new digitalocean.Droplet("test", config);

  return {
    droplet_id: interpolate`${droplet.id}`,
  };
};
