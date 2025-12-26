## Tushar Kajania Work Portfolio

Work portfolio site for Tushar Kajania. This is a static website designed for GitHub Pages and custom domain hosting.

### Overview
- Modern, responsive single-page site with sections: Hero, About, Achievements, Stats, Contact
- Smooth scroll, parallax, animated particles, and on-scroll animations (AOS)
- Lightweight JS with accessibility updates and mobile-friendly design

### Project Structure
- [index.html](index.html): Main page markup
- [css/style.css](css/style.css): Theme, layout, responsive styles
- [js/particles.js](js/particles.js): Canvas particle background for the hero
- [js/script.js](js/script.js): Navigation, animations, project rendering
- [assets/favicon.svg](assets/favicon.svg): Site favicon

### Local Preview
You can open the site directly in a browser by double-clicking `index.html`. For a local server (helps with relative paths):

```powershell
# From the project folder
python -m http.server 8080
# Then open http://localhost:8080
```

Alternatively, on Node.js:
```powershell
npx serve .
```

### Deploy on GitHub Pages
### Projects Configuration
The Projects section is populated from a simple array in [js/script.js](js/script.js). Update `PROJECTS` with your items:

```js
const PROJECTS = [
	{ title: 'Project A', description: 'Short summary', tags: ['React','API'], path: 'project-a' },
	{ title: 'Project B', description: 'Another demo', tags: ['Node','Express'], path: 'project-b' }
];
```

- `path`: Will link to `https://warningod.me/<path>/`. If you want the root, set `path: ''`.
- If your projects live on separate branches, publish each branch to a path. Common approaches:
	- Build/deploy each branch into a subfolder within the Pages site (e.g., `docs/project-a/`) via GitHub Actions.
	- Use separate repositories configured with the same custom domain, then link directly to `https://warningod.me/project-a/`.

I can set up a minimal GitHub Actions workflow to deploy branch builds into subfolders if you want.
1. Push this folder to a GitHub repository.
2. In the repo settings, enable Pages (Source: `main` branch, root).
3. Pages will publish the site at `https://<username>.github.io/<repo>/`.

### Custom Domain
If you have a custom domain, create a `CNAME` file at the repository root containing your domain (e.g., `warningod.me` or `warning.me`).

```text
warningod.me
```

Also configure DNS to point your domain to GitHub Pages. Add these A records:
- `@` → `185.199.108.153`
- `@` → `185.199.109.153`
- `@` → `185.199.110.153`
- `@` → `185.199.111.153`

And a CNAME:
- `www` → `<username>.github.io`

Reference: GitHub Pages custom domains docs.

### Editing Tips
- Update social links in the Contact section (`Discord`, `Twitter`) with actual URLs.
- Replace or customize the favicon in [assets/favicon.svg](assets/favicon.svg).
- For SEO, consider adding Open Graph and Twitter cards (title, description, image) in `index.html`.

### License
MIT License. See [LICENSE](LICENSE).
