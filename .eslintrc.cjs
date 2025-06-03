module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["react", "@typescript-eslint", "react-hooks", "react-refresh", "prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/internal-regex": "^@/|^src/",
  },
  rules: {
    // React Refresh (Vite 热重载)
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

    // Prettier 集成
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
      },
      {
        usePrettierrc: true,
      },
    ],

    // 导入排序
    "sort-imports": [
      "warn",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: true,
      },
    ],
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
      },
    ],

    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // TypeScript
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    // 其他规则
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": "off",

    // React 规则
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",

    // Import 规则
    "import/no-unresolved": "error",
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error",
  },
}
