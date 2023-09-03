import { Policy } from "@pulumi/aws/iam";
import { Bucket, BucketArgs, BucketObject } from "@pulumi/aws/s3";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";
import { FileAsset } from "@pulumi/pulumi/asset";

export interface S3BucketArguments extends BucketArgs {
  folders?: string[];
}

export class S3Bucket extends ComponentResource {
  arn: Output<string>;
  bucketDomainName: Output<string>;
  bucketRegionalDomainName: Output<string>;
  id: Output<string>;
  policyArn: Output<string>;
  region: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: S3BucketArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:S3Bucket", name, args, opts);

    const bucket = new Bucket(name, args, {
      ...opts,
      parent: this,
    });

    const policy = new Policy(
      `${name}-s3-rw`,
      {
        path: "/",
        description: `RW access to S3 bucket ${name}`,
        policy: bucket.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["S3:ListBucket"],
                Effect: "Allow",
                Resource: arn,
              },
              {
                Action: ["S3:PutObject", "S3:GetObject"],
                Effect: "Allow",
                Resource: `${arn}/*`,
              },
            ],
          }),
        ),
      },
      {
        dependsOn: bucket,
        parent: bucket,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    if (args.folders) {
      for (let i = 0; i < (args.folders ? args.folders.length : 0); i++) {
        const path = args?.folders[i];

        new BucketObject(
          `${path}/`,
          {
            bucket,
            source: new FileAsset("/dev/null"), // empty data
          },
          {
            dependsOn: bucket,
            parent: bucket,
            protect: opts?.protect,
            retainOnDelete: opts?.retainOnDelete,
          },
        );
      }
    }

    this.arn = bucket.arn;
    this.bucketDomainName = bucket.bucketDomainName;
    this.bucketRegionalDomainName = bucket.bucketRegionalDomainName;
    this.id = bucket.id;
    this.policyArn = policy.arn;
    this.region = bucket.region;
    this.tagsAll = bucket.tagsAll;
    this.registerOutputs();
  }
}
