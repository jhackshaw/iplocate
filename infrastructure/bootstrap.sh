#/bin/bash

if aws s3api head-bucket --bucket "$TF_VAR_state_bucket" 2>/dev/null;
then
  echo "skiping create state bucket"
else
  echo "creating bucket for terraform state"
  aws s3api create-bucket --acl private --bucket "$TF_VAR_state_bucket"
fi
