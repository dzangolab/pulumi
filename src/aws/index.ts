import { AppSecret } from "./appSecret";
import { ECRRepository } from "./ecrRepository";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";

export const aws = {
  AppSecret,
  ECRRepository,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
};
