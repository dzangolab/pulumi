import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { Droplet } from "../../../src/digitalocean/droplet";

export = async () => {
  const config = await getConfig();

  const droplet = new Droplet("test", config);

  return {
    droplet_id: interpolate`${droplet.id}`,
  };
};
