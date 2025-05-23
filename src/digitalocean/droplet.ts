import { local } from "@pulumi/command";
import {
  Droplet as DODroplet,
  DropletArgs as DODropletArguments,
  getSshKeysOutput,
  ProjectResources,
  ReservedIpAssignment,
} from "@pulumi/digitalocean";
import {
  ComponentResource,
  ComponentResourceOptions,
  interpolate,
  Output,
} from "@pulumi/pulumi";
import { Environment, FileSystemLoader, NodeResolveLoader } from "nunjucks";

export interface DropletArguments extends DODropletArguments {
  packages?: string[];
  projectId?: string;
  reservedIpId?: string;
  sshKeyNames?: string[];
  swapFile?: string[];
  swapSize?: string;
  userDataTemplate?: string;
  users: User[];
  volumes?: Volume[];
}

export interface User {
  groups: string;
  publicKeys: string[];
  username: string;
}

export interface Volume {
  group: string;
  name: string;
  path: string;
  user: string;
}

export class Droplet extends ComponentResource {
  createdAt: Output<string>;
  disk: Output<number>;
  dropletUrn: Output<string>;
  id: Output<string>;
  ipv4Address: Output<string>;
  ipv4AddressPrivate: Output<string>;
  locked: Output<boolean>;
  memory: Output<number>;
  name: Output<string>;
  priceHourly: Output<number>;
  priceMonthly: Output<number>;
  status: Output<string>;
  vcpus: Output<number>;

  constructor(
    name: string,
    args: DropletArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:digitalocean:Droplet", name, args, opts);

    const doArguments = {
      ...args,
      userData: this.generateUserData(
        args.userDataTemplate || "./cloud-config.njx",
        args,
      ),
    };

    if (args?.sshKeyNames) {
      doArguments.sshKeys = this.getSshKeys(args.sshKeyNames);
    }

    const droplet = new DODroplet(name, doArguments, opts);

    // Add droplet to project
    if (args.projectId) {
      new ProjectResources(
        name,
        {
          project: args.projectId,
          resources: [droplet.dropletUrn],
        },
        {
          dependsOn: droplet,
          parent: droplet,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );
    }

    // Assign reserved ip to droplet
    if (args.reservedIpId) {
      new ReservedIpAssignment(
        name,
        {
          ipAddress: args.reservedIpId,
          dropletId: droplet.id.apply(Number),
        },
        {
          dependsOn: droplet,
          parent: droplet,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );
    }

    const ipAddress = args.reservedIpId || droplet.ipv4Address;

    new local.Command(
      `addOrRemoveDropletToOrFromKnownHosts-${name}`,
      {
        create: interpolate`sleep 30 && ssh-keyscan ${ipAddress} 2>&1 | grep -vE '^#' >> ~/.ssh/known_hosts`,
        delete: interpolate`sed -i -e '/^${ipAddress} .*/d' ~/.ssh/known_hosts`,
      },
      {
        dependsOn: droplet,
        parent: droplet,
      },
    );

    this.createdAt = droplet.createdAt;
    this.disk = droplet.disk;
    this.dropletUrn = droplet.dropletUrn;
    this.id = droplet.id;
    this.ipv4Address = droplet.ipv4Address;
    this.ipv4AddressPrivate = droplet.ipv4AddressPrivate;
    this.locked = droplet.locked;
    this.memory = droplet.memory;
    this.name = droplet.name;
    this.priceHourly = droplet.priceHourly;
    this.priceMonthly = droplet.priceMonthly;
    this.status = droplet.status;
    this.vcpus = droplet.vcpus;

    this.registerOutputs();
  }

  private generateUserData(
    template: string,
    context: DropletArguments,
  ): string {
    const env = new Environment([
      new FileSystemLoader(),
      new NodeResolveLoader(),
    ]);

    return env.render(template, context);
  }

  private getSshKeys(keyNames: string[]) {
    const keys = getSshKeysOutput({
      filters: [
        {
          key: "name",
          values: keyNames,
        },
      ],
    });

    return keys.apply((keys) =>
      keys.sshKeys.map((key) => key.id as unknown as string),
    );
  }
}
