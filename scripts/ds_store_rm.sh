#!/usr/bin/env bash
USAGE=""
DESC="Deletes all .DS_Store files recursivley"

function ds_store_rm () {
  find . -name '.DS_Store' -type f -delete 
}