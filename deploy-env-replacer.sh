#!/bin/bash
# deploy-env-replacer.sh - Fallback script để thay thế environment variables

echo "🔧 Starting environment variable replacement..."

# Check if env.js exists
if [ ! -f "env.js" ]; then
    echo "❌ env.js not found!"
    exit 1
fi

# Backup original
cp env.js env.js.backup

# Function to replace environment variable
replace_env_var() {
    local var_name=$1
    local placeholder="{{${var_name}}}"
    
    # Try to get value from environment
    local value=""
    case $var_name in
        "VITE_FIREBASE_API_KEY")
            value="${VITE_FIREBASE_API_KEY:-$GITHUB_VITE_FIREBASE_API_KEY}"
            ;;
        "VITE_FIREBASE_AUTH_DOMAIN")
            value="${VITE_FIREBASE_AUTH_DOMAIN:-$GITHUB_VITE_FIREBASE_AUTH_DOMAIN}"
            ;;
        "VITE_FIREBASE_PROJECT_ID")
            value="${VITE_FIREBASE_PROJECT_ID:-$GITHUB_VITE_FIREBASE_PROJECT_ID}"
            ;;
        "VITE_FIREBASE_STORAGE_BUCKET")
            value="${VITE_FIREBASE_STORAGE_BUCKET:-$GITHUB_VITE_FIREBASE_STORAGE_BUCKET}"
            ;;
        "VITE_FIREBASE_MESSAGING_SENDER_ID")
            value="${VITE_FIREBASE_MESSAGING_SENDER_ID:-$GITHUB_VITE_FIREBASE_MESSAGING_SENDER_ID}"
            ;;
        "VITE_FIREBASE_APP_ID")
            value="${VITE_FIREBASE_APP_ID:-$GITHUB_VITE_FIREBASE_APP_ID}"
            ;;
    esac
    
    if [ -n "$value" ]; then
        # Escape special characters for sed
        escaped_value=$(printf '%s\n' "$value" | sed 's/[[\.*^$()+?{|]/\\&/g')
        sed -i "s/${placeholder}/${escaped_value}/g" env.js
        echo "✅ Replaced $var_name"
    else
        echo "⚠️ No value found for $var_name"
    fi
}

# Replace all variables
replace_env_var "VITE_FIREBASE_API_KEY"
replace_env_var "VITE_FIREBASE_AUTH_DOMAIN"
replace_env_var "VITE_FIREBASE_PROJECT_ID"
replace_env_var "VITE_FIREBASE_STORAGE_BUCKET"
replace_env_var "VITE_FIREBASE_MESSAGING_SENDER_ID"
replace_env_var "VITE_FIREBASE_APP_ID"

# Verify replacements
if grep -q "{{" env.js; then
    echo "⚠️ WARNING: Some placeholders were not replaced:"
    grep "{{" env.js
    echo "📄 Full env.js content:"
    cat env.js
else
    echo "✅ All placeholders successfully replaced"
fi

echo "🏁 Environment replacement complete"
