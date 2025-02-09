import {
  Project,
  ProjectResources,
  ReservedIp,
  Volume,
  Vpc,
} from "@pulumi/digitalocean";
import {
  ComponentResource,
  ComponentResourceOptions,
  Input,
  Output,
} from "@pulumi/pulumi";

export interface AppResourcesArguments {
  description?: string;
  environment?: string;
  name?: Input<string>;
  region: Input<string>;
  volumeSize: number;
}

export class AppResources extends ComponentResource {
  projectId: Output<string>;
  reservedIpId: Output<string>;
  reservedIpUrn: Output<string>;
  volumeId?: Output<string>;
  volumeName?: Output<string>;
  volumeUrn?: Output<string>;
  vpcId: Output<string>;
  vpcIpRange: Output<string>;
  vpcName: Output<string>;
  vpcUrn: Output<string>;

  constructor(
    name: string,
    args: AppResourcesArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:AppResources", name, args, opts);

    const project = new Project(
      name,
      {
        description: args.description || `${name} infrastructure`,
        environment: args.environment || name,
        name: args.name,
        purpose: "Web Application",
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.projectId = project.id;

    const vpc = new Vpc(
      name,
      {
        region: args.region,
      },
      {
        parent: project,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.vpcId = vpc.id;
    this.vpcIpRange = vpc.ipRange;
    this.vpcName = vpc.name;
    this.vpcUrn = vpc.vpcUrn;

    const resources = [vpc.vpcUrn];

    const reservedIp = new ReservedIp(
      name,
      {
        region: args.region,
      },
      {
        parent: project,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.reservedIpId = reservedIp.id;
    this.reservedIpUrn = reservedIp.reservedIpUrn;

    resources.push(reservedIp.urn);

    if (args.volumeSize) {
      const volume = new Volume(
        name,
        {
          description: `Block-storage volume for ${name}`,
          initialFilesystemType: "ext4",
          region: args.region,
          size: args.volumeSize,
        },
        {
          parent: project,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      this.volumeId = volume.id;
      this.volumeName = volume.name;
      this.volumeUrn = volume.volumeUrn;

      resources.push(volume.urn);
    }

    new ProjectResources(
      name,
      {
        project: project.id,
        resources,
      },
      {
        parent: project,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.registerOutputs();
  }
}
