#/bin/bash

if aws s3api head-bucket --bucket "iplocate-terraform-state" 2>/dev/null;
then
  echo "skiping create state bucket"
else
  echo "creating bucket for terraform state"
  aws s3api create-bucket --acl private --bucket "iplocate-terraform-state"
fi
