import { Policy } from "@pulumi/aws/iam";
import {
  Secret as AWSSecret,
  SecretArgs,
  SecretVersion,
} from "@pulumi/aws/secretsmanager";
import {
  ComponentResource,
  ComponentResourceOptions,
  Input,
  Output,
} from "@pulumi/pulumi";

export interface SecretArguments extends SecretArgs {
  secretString?: Input<string>;
}

export class Secret extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  name: Output<string>;
  policyArn: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: SecretArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:AppSecret", name, args, opts);

    const secret = new AWSSecret(name, args, {
      ...opts,
      parent: this,
    });

    const policy = new Policy(
      `${name}-secret-read-write`,
      {
        path: "/",
        description: `Read/write access to secret ${name}`,
        policy: secret.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["secretsmanager:GetSecretValue"],
                Effect: "Allow",
                Resource: arn,
              },
            ],
          }),
        ),
      },
      {
        dependsOn: secret,
        parent: secret,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    if (args.secretString) {
      new SecretVersion(
        name,
        {
          secretId: secret.id,
          secretString: args.secretString,
        },
        {
          parent: secret,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );
    }

    this.arn = secret.arn;
    this.id = secret.id;
    this.name = secret.name;
    this.policyArn = policy.arn;
    this.tagsAll = secret.tagsAll;

    this.registerOutputs();
  }
}
