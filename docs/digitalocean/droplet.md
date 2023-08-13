# Digital Ocean Droplet

## Example usage

``` typescript
import { digitalocean } from "@dzangolab/pulumi";

export = async () => {
    const droplet = new digitalocean.Droplet(
        "prod",
        {
            // args
        },
    );

    return {
        dropletId: droplet.id,
    };
}
```

## Resources created

### Droplet

An instance of [digitalocean.Droplet](https://www.pulumi.com/registry/packages/digitalocean/api-docs/droplet/).

### ProjectResources

If `projectId` input is present, the droplet will be added to the specified project and a [digitalocean.ProjectResources](https://www.pulumi.com/registry/packages/digitalocean/api-docs/projectresources/) resource will be created.

### ReservedIpAssignment

If `reservedIpId` input is present, the specified `ReservedIp` will be associated with the droplet and a [digitalocean.ReservedIpAssignment](https://www.pulumi.com/registry/packages/digitalocean/api-docs/reservedipassignment/) resource will be created. 

### Firewall

FIXME!

### Command

A [command.local.Command](https://www.pulumi.com/registry/packages/command/api-docs/local/) resource named `addOrRemoveDropletToOrFromKnownHosts` will be created. Its purpose is to add the droplet's SSH host key to your local `~/.ssh/known_hosts`.

The host key is based on:

* the droplet's reserved ip address if set
* the droplet's `ipv4Address` otherwise

When the droplet is destroyed, the command will remove the relevant entry in `~/.ssh/known_hosts`.

## Inputs

The `Droplet` component resource supports all the [original `digitalocean.Droplet` inputs](https://www.pulumi.com/registry/packages/digitalocean/api-docs/droplet/#inputs) with the following additional inputs:

| input              | type       | Comments | 
|--------------------|------------|----------|
| `packages`         | `string[]` | Optional. An array of packages to be installed via cloud-init. |
| `projectId`        | `string`   | Optional. The id of the project to which this droplet must be attached. |
| `reservedIpId`     | `string`   | Optional. The id of the reserved IP address to associate with this droplet. |
| `sshKeyNames`      | `string[]` | The names of the DO ssh keys to associate to this droplet. If specified, this inputwill override the original `sshKeys` input. |
| `swapFile`         | `string`   | Optional. The name to use for the swap file is one is required. Requires `swapsize` attribute to be set. |
| `swapSize`         | `number`   | Optional. The size of the swap file. |
| `userdataTemplate` | `string`   | The template used to generate the user data. |
| `users`            | `User[]`   | User accounts to create on the droplet. |
| `volumes`          | `Volume[]` | Optional. Volumes to be mounted on the droplet. |  

## Outputs

The resource's outputs are identical to the [original `digitalocean.Droplet`'s outputs](https://www.pulumi.com/registry/packages/digitalocean/api-docs/droplet/#outputs). 

[&#10092; Home](../index.md)