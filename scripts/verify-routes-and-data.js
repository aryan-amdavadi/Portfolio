/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Route and Data Integrity Regression Test...\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Verify existence of primary route files
const rootDir = path.resolve(__dirname, '..');
const appDir = path.join(rootDir, 'src/app');

assert(fs.existsSync(path.join(appDir, 'page.tsx')), 'Homepage route file (src/app/page.tsx) exists');
assert(fs.existsSync(path.join(appDir, 'projects/page.tsx')), 'Projects archive route file (src/app/projects/page.tsx) exists');
assert(fs.existsSync(path.join(appDir, 'projects/[id]/page.tsx')), 'Case study detail route file (src/app/projects/[id]/page.tsx) exists');

// 2. Read and parse projects data
const projectsFilePath = path.join(rootDir, 'src/data/projects.ts');
assert(fs.existsSync(projectsFilePath), 'Projects data file (src/data/projects.ts) exists');

const content = fs.readFileSync(projectsFilePath, 'utf8');

// Extract project IDs (top-level project definitions followed by title)
const idMatches = [...content.matchAll(/id:\s*['"]([a-z0-9_-]+)['"],\s*title:/g)].map(m => m[1]);
const uniqueIds = new Set(idMatches);

assert(idMatches.length === 6, `Found 6 projects in catalog (got: ${idMatches.length})`);
assert(uniqueIds.size === idMatches.length, `All project IDs are strictly unique: [${idMatches.join(', ')}]`);

const expectedProjects = ['splitsphere', 'rapaport', 'secretspeak', 'tabster', 'pulsesync', 'enginexus'];
expectedProjects.forEach(pid => {
  assert(uniqueIds.has(pid), `Expected project '${pid}' is present in catalog`);
});

// 3. Verify local artwork assets
const imageMatches = [...content.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
assert(imageMatches.length === 6, `Found 6 image references for all projects (got: ${imageMatches.length})`);

imageMatches.forEach(imgRel => {
  const fullPath = path.join(rootDir, 'public', imgRel.replace(/^\//, ''));
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 1000, `Asset ${imgRel} exists locally and is non-empty (${Math.round(size / 1024)} KB)`);
});

// 4. Verify case study routes
const routeMatches = [...content.matchAll(/caseStudyRoute:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
assert(routeMatches.length === 6, `All 6 projects define an explicit caseStudyRoute`);

routeMatches.forEach(route => {
  assert(route.startsWith('/projects/'), `Route ${route} adheres to /projects/[id] convention`);
});

// 5. Check for forbidden placeholder links (href="#") in core project components
const componentsToCheck = [
  'src/components/projects/ProjectShowcase.tsx',
  'src/components/projects/CaseStudyHero.tsx',
  'src/components/projects/CaseStudyNavigation.tsx',
  'src/components/projects/ProjectLinks.tsx',
  'src/app/projects/[id]/page.tsx',
  'src/app/projects/page.tsx'
];

componentsToCheck.forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const hasHashOnlyHref = /href=["']#["']/g.test(fileContent);
    assert(!hasHashOnlyHref, `File ${relPath} contains no dead href="#" placeholder links`);
  }
});

// 6. Summary
console.log('\n--------------------------------------------------');
if (failed) {
  console.error('❌ REGRESSION TEST FAILED: One or more assertions did not pass.');
  process.exit(1);
} else {
  console.log('✨ ALL REGRESSION CHECKS PASSED: Route mappings, catalog data, and asset integrity verified.');
  process.exit(0);
}
