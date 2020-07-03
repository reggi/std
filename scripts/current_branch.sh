#!/bin/bash
USAGE=""
DESC="provides current git branch"

current_branch () {
  git branch --show-current
}