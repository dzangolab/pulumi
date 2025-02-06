import { interpolate } from "@pulumi/pulumi";
import "dotenv/config";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { DnsRecordSet } from "../../../src/cloudflare/dnsRecordSet";

export = async () => {
  const config = await getConfig();

  const recordSet = new DnsRecordSet("test", config);

  return {
    a: interpolate`${recordSet.a}`,
  };
};
