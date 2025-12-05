import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  {languageOptions: { globals: globals.browser }},
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  { 
    ignores: [
      "components/ui/**",
      "app/utils/supabase/**",
      "**/node_modules/**",
      ".next/**"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {rules: {
   "react/react-in-jsx-scope": "off",
   "react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx"] }],
   "react/no-unescaped-entities": "off",
   "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }]
  }},
  {
    files: ["next.config.js", "postcss.config.js"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off"
    }
  }
];
