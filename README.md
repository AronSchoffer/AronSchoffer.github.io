## Development
```bash
npm run dev
```

## Build and publish
To build and publish to github pages:  
```bash
git commit -m 'commit comment'
git push origin master
git checkout gh-pages
git merge master
```
Resolve merge conflicts.  
Comment out '/public/build/' in .gitignore with '#' and run:
```bash
npm run build
git subtree push --prefix public/ origin gh-pages
```
**Do not push gh-pages to origin gh-pages**  
Origin gh-pages only contains the build files. It is not the same as the local gh-pages branch.