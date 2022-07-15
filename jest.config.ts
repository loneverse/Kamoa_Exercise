module.exports = {
	roots: ["<rootDir>/infra", "<rootDir>/src"],
	coverageDirectory: "<rootDir>/coverage",
	setupFiles: ["<rootDir>/jest.setup.ts"],
	collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
	reporters: ["default"],
	verbose: true,
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	testMatch: ["**/*.test.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	resetMocks: false,
};
