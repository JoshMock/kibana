#!/usr/bin/env bash
set -euo pipefail

DEPLOY_TAG="deploy@$(date +%s%3N)"
KIBANA_COMMIT_SHA=$(buildkite-agent meta-data get selected-commit-hash)

if [[ -z "$KIBANA_COMMIT_SHA" ]]; then
  echo "Commit sha is not set, exiting."
  exit 1
fi

echo "--- Creating deploy tag $DEPLOY_TAG at $KIBANA_COMMIT_SHA"

# Set git identity to whomever triggered the buildkite job
git config user.email "$BUILDKITE_BUILD_CREATOR_EMAIL"
git config user.name "$BUILDKITE_BUILD_CREATOR"

# Create a tag for the deploy
git tag -a "$DEPLOY_TAG" "$KIBANA_COMMIT_SHA" \
 -m "Tagging release $KIBANA_COMMIT_SHA as: $DEPLOY_TAG, by $BUILDKITE_BUILD_CREATOR_EMAIL"

# Set meta-data for the deploy tag
buildkite-agent meta-data set deploy-tag "$DEPLOY_TAG"

# Push the tag to GitHub
if [[ -z "${DRY_RUN:-}" ]]; then
  echo "Pushing tag to GitHub..."
  # git push origin --tags
else
  echo "Skipping tag push to GitHub due to DRY_RUN=$DRY_RUN"
fi

echo "Created deploy tag: $DEPLOY_TAG - your QA release should start @ https://buildkite.com/elastic/kibana-serverless-release/builds?branch=$DEPLOY_TAG"

# TODO: add more helpful links like we have in the github job
