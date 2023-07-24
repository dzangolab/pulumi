import { AppSecret } from "./appSecret";
import { AppUser } from "./appUser";
import { ECRRepository } from "./ecrRepository";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";

export const aws = {
  AppSecret,
  AppUser,
  ECRRepository,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
};
