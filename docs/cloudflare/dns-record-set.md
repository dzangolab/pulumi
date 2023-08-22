# DnsRecordSet

Provisions DNS records in a cloudflare zone.

## Requirements

Install [`@pulumi/cloudflare`](https://www.pulumi.com/registry/packages/cloudflare/installation-configuration/#cloudflare-installation-configuration).

Add `CLOUDFLARE_API_TOKEN` to your environment variables.

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| A record | [`cloudflare.Record`](https://www.pulumi.com/registry/packages/cloudflare/api-docs/record/#cloudflare-record) | (1) |
| CNAME records | [`cloudflare.Record`](https://www.pulumi.com/registry/packages/cloudflare/api-docs/record/#cloudflare-record) |  (2)

### Notes

1. One `A` DNS record will be created. 
2. One `CNAME` DNS record will be created for each alias provided in the arguments.


## Inputs

| input                       | type       | Comments | Notes |
|-----------------------------|------------|----------|-------|
| `aliases`   | `string[]` | A collection of sub-domains for which to create `CNAME` records. | (1) |
| `domain`    | `string`   | The domain in the zone of which the DNS records will be created |  |
| `host`      | `string`   | The name of the host for which an `A` record will be createrd. |  |
| `ip`        | `string`   | The IP address for the shot record. |  |
| `subdomain` | `string`   | Optional. A subdomain in which all records will be created. |  |
| `ttl`       | `string`   | Optional. The ttl for the records. Defaults to 3600. |  |

### Notes

1. May include `"*"` for a wildcard `CNAME` record.

## Outputs

| output    | type     | comments                             |
|-----------|----------|--------------------------------------|
| `a`       | `string` | The FQDN of the `A` record created.    |

[&#10092; Home](../index.md)