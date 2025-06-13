#!/bin/bash

# Complete root folder cleanup
echo "🧹 Performing complete root folder cleanup..."

# Move all remaining .js files to appropriate locations
mv *.js scripts/management/ 2>/dev/null || true
mv *.ts scripts/management/ 2>/dev/null || true

# Move all remaining .json files to config
mv *.json config/ 2>/dev/null || true

# Move all remaining .txt files to docs
mv *.txt docs/consciousness/ 2>/dev/null || true

# Move all remaining .html files to docs
mv *.html docs/guides/ 2>/dev/null || true

# Move all remaining .yml files to config
mv *.yml config/kubernetes/ 2>/dev/null || true

# Keep only essential project files in root
KEEP_FILES=(
    "README.md"
    "CONTRIBUTING.md" 
    "LICENSE"
    "package.json"
    "package-lock.json"
    "drizzle.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    "vite.config.ts"
    "components.json"
    "netlify.toml"
    ".gitignore"
    ".env"
    ".env.example"
    ".replit"
    "ecosystem.config.js"
    "docker-compose.yml"
)

# Create list of files to move
for file in *; do
    if [[ -f "$file" ]]; then
        keep=false
        for keep_file in "${KEEP_FILES[@]}"; do
            if [[ "$file" == "$keep_file" ]]; then
                keep=true
                break
            fi
        done
        
        if [[ "$keep" == false ]]; then
            # Determine destination based on file type
            if [[ "$file" == *.md ]]; then
                mv "$file" docs/consciousness/ 2>/dev/null || true
            elif [[ "$file" == *.py ]]; then
                mv "$file" scripts/consciousness/ 2>/dev/null || true
            elif [[ "$file" == *.sh ]]; then
                mv "$file" scripts/management/ 2>/dev/null || true
            elif [[ "$file" == *.js || "$file" == *.ts ]]; then
                mv "$file" scripts/management/ 2>/dev/null || true
            elif [[ "$file" == *.json ]]; then
                mv "$file" config/ 2>/dev/null || true
            elif [[ "$file" == *.yml || "$file" == *.yaml ]]; then
                mv "$file" config/kubernetes/ 2>/dev/null || true
            else
                mv "$file" docs/consciousness/ 2>/dev/null || true
            fi
        fi
    fi
done

echo "Root folder cleanup complete. Only essential project files remain."
echo ""
echo "Remaining files in root:"
ls -la | grep -v "^d" | grep -v "^total"