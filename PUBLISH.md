# Publishing Guide (CI/CD)

This project is configured with a fully automated CI/CD pipeline via GitHub Actions.

To publish a new version to NPM, follow these steps:

1. **Update the version** in `package.json` (e.g., `"version": "1.0.1"`).
2. **Commit the change**: 
   ```bash
   git commit -am "chore: bump version to 1.0.1"
   ```
3. **Create a tag** with the `v` prefix:
   ```bash
   git tag v1.0.1
   ```
4. **Push to GitHub**:
   ```bash
   git push && git push --tags
   ```

Once the tag is pushed, the `publish.yml` GitHub Action will automatically:
- Run tests and build the project.
- Publish the new version to NPM.

*(Note: Ensure you have added your NPM automation token as a repository secret named `NPM_TOKEN` in GitHub: Settings → Secrets and variables → Actions).*
