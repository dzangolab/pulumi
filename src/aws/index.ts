import { AppUser } from "./appUser";
import { ECRRepository } from "./ecrRepository";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";

export const aws = {
  AppUser,
  ECRRepository,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
  Secret,
};
