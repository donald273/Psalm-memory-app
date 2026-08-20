# Psalm Source

A personal, static web app for practising source recall from the 1650 Scottish Psalter.

## Database
The app uses the supplied machine-readable 1650 transcription. It contains 183 entries, including:
- 150 Psalm numbers
- 12 second versions
- 22 sections of Psalm 119

The range selector works by biblical Psalm number, so selecting 119–119 randomly chooses among the 22 Psalm 119 sections.

## Publish with GitHub Pages
1. Create a new GitHub repository (for example `psalm-source`).
2. Upload everything in this folder, keeping `data/psalms.json` in the `data` folder.
3. In the repository, go to Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the `main` branch and `/ (root)`, then Save.
6. GitHub Pages will publish the site at the repository's Pages URL.

GitHub Pages supports static HTML, CSS and JavaScript and is available with GitHub Free for public repositories.
