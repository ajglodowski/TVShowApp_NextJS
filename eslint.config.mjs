import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  {languageOptions: { globals: globals.browser }},
  { 
    ignores: [
      "components/ui/**",
      "app/utils/supabase/**",
      "**/node_modules/**"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {rules: {
   "react/react-in-jsx-scope": "off",
   "react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx"] }],
  }},
];