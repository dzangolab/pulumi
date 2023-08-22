import { getZone, Record } from "@pulumi/cloudflare";
import {
  ComponentResource,
  ComponentResourceOptions,
  Input,
  Output,
} from "@pulumi/pulumi";

export interface DnsRecordSetArguments {
  aliases: string[];
  domain: string;
  host: string;
  ip: Input<string>;
  subdomain?: string;
  ttl?: number;
}

export class DnsRecordSet extends ComponentResource {
  a: Output<string>;
  aliases: Output<string>[];

  constructor(
    name: string,
    args: DnsRecordSetArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/cloudflare:DnsRecordSet", name, args, opts);

    const domain = args.domain;

    const zone = getZone({ name: domain });

    const subdomain = args.subdomain;

    const hostname = this.getValue(args.host, subdomain);

    const host = new Record(
      `${hostname}.${args.domain}`,
      {
        name: hostname,
        proxied: false,
        type: "A",
        ttl: args.ttl || 3600,
        value: args.ip,
        zoneId: zone.then((zone) => zone.id),
      },
      {
        ...opts,
        parent: this,
      },
    );

    const cnames = [];

    for (let i = 0; i < args.aliases.length; i++) {
      const alias = this.getValue(args.aliases[i], subdomain);

      cnames.push(
        new Record(
          `${alias}.${args.domain}`,
          {
            name: alias,
            proxied: false,
            type: "CNAME",
            ttl: args.ttl || 3600,
            value: `${hostname}.${args.domain}`,
            zoneId: zone.then((zone) => zone.id),
          },
          {
            ...opts,
            parent: this,
          },
        ),
      );
    }

    this.a = host.hostname;
    this.aliases = cnames.map((alias) => alias.hostname);

    this.registerOutputs();
  }

  private getValue(host: string, subdomain?: string) {
    const tokens = [host];

    if (subdomain) {
      tokens.push(subdomain);
    }

    return tokens.join(".");
  }
}
