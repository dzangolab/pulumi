import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { S3Bucket } from "../../../src/aws/s3Bucket";

export = async () => {
  const config = await getConfig();

  const bucket = new S3Bucket(config.bucket, {
    folders: config.folders,
  });

  const bucket2 = new S3Bucket("test2", {
    folders: config.folders,
  });

  return {
    bucket_arn: interpolate`${bucket.arn}`,
    bucket2_arn: interpolate`${bucket2.arn}`,
  };
};
