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
  Output,
} from "@pulumi/pulumi";

export interface AppResourcesArguments {
  description?: string;
  environment?: string;
  region: string;
  volumeSize: number;
}

export class AppResources extends ComponentResource {
  projectId: Output<string>;
  reservedIpId: Output<string>;
  volumeId: Output<string>;
  volumeName: Output<string>;
  vpcId: Output<string>;

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
        name,
        purpose: "Web Application",
      },
      {
        ...opts,
        parent: this,
      },
    );

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

    new ProjectResources(
      name,
      {
        project: project.id,
        resources: [volume.volumeUrn],
      },
      {
        parent: project,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.projectId = project.id;
    this.reservedIpId = reservedIp.id;
    this.volumeId = volume.id;
    this.volumeName = volume.name;
    this.vpcId = vpc.id;

    this.registerOutputs();
  }
}
