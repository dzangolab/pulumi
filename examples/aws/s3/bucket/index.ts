import { aws } from "@dzangolab/pulumi";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const bucket = new aws.S3Bucket(config.bucket, {});

  return {
    bucket_arn: interpolate`${bucket.arn}`,
  };
};
