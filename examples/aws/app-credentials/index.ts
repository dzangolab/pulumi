import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { AppCredentials } from "../../../src/aws/appCredentials";

export = async () => {
  const config = await getConfig();

  const version = new AppCredentials(config.name, config);

  return {
    arn: interpolate`${version.arn}`,
    id: interpolate`${version.id}`,
    versionId: interpolate`${version.versionId}`,
  };
};
