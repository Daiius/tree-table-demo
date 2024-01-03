module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  reporters: ["default", "jest-junit"],
  moduleDirectories: ['node_modules', 'src'],
};

