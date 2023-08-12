import { OpenIdConnectProvider, Policy, Role } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface GithubIdentityProviderArguments {
  tags?: { [key: string]: string };
}

export class GithubIdentityProvider extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: GithubIdentityProviderArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:GithubIdentityProvider", name, args, opts);

    const provider = new OpenIdConnectProvider(
      name,
      {
        clientIdLists: ["sts.amazonaws.com"],
        thumbprintLists: ["1c58a3a8518e8759bf075b76b750d4f2df264fcd"],
        tags: args.tags,
        url: "https://token.actions.githubusercontent.com",
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.arn = provider.arn;
    this.id = provider.id;
    this.tagsAll = provider.tagsAll;

    this.registerOutputs();
  }
}
