import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { AppResources } from "../../../src/digitalocean/appResources";

export = async () => {
  const config = await getConfig();

  const resources = new AppResources("test", config);

  return {
    projectId: interpolate`${resources.projectId}`,
    reservedIpId: interpolate`${resources.reservedIpId}`,
    volumeId: interpolate`${resources.volumeId}`,
    volumeName: interpolate`${resources.volumeName}`,
    vpcId: interpolate`${resources.vpcId}`,
  };
};
