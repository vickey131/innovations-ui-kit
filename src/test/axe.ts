import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import { axe } from 'vitest-axe'

// Vitest globals are off, so Testing Library does not auto-clean between tests.
afterEach(cleanup)

/** Asserts that the rendered container has no axe accessibility violations. */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe(container)
  expect(results.violations).toEqual([])
}
