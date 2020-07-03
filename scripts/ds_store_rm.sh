#!/bin/bash

# shellcheck disable=SC2034
USAGE=""
DESC="deletes all .DS_Store files recursivley"

ds_store_rm () {
  find . -name '.DS_Store' -type f -delete 
}