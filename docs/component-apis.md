# Component APIs: Button and TextField

Status: proposal. Source: `docs/ux-handoff.md` and the current `Button.tsx`. Items the handoff marks TBD are listed under open questions, not designed here. React 19, so `ref` is a regular prop and `forwardRef` is not needed.

---

## Button

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  variant?: ButtonVariant // default 'primary'  (new)
  size?: ButtonSize       // default 'md'        (exists)
  leadingIcon?: ReactNode // decorative, aria-hidden (exists)
  children: ReactNode     // visible label       (exists)
}
```

**Variant and size**
- `variant` is new. Each value maps to a modifier class, the same way `size` does today (`button--secondary`).
- Sizes are 32, 40 and 48px high, as in the spec.

**Composition and slots**
- One slot, `leadingIcon`, rendered before the label and hidden from assistive tech.
- No trailing icon or compound parts, because the spec has neither.

**Controlled vs. uncontrolled**
- Not applicable. Button holds no state. Behavior comes from native props such as `onClick` and `disabled`.

**Ref forwarding**
- `ref` goes to the root `<button>`.

**Native prop spreading**
- All native button props are accepted and spread onto `<button>`, after the component's own props.
- `type` defaults to `'button'` so the button never submits a form by accident.
- `className` is merged with the component's classes, not replaced.

---

## TextField

```ts
export interface TextFieldProps
  extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label: string          // required, always visible, sentence case
  hint?: string          // helper text below the input
  error?: string         // replaces the hint when set
  required?: boolean     // marks the label with *
  maxLength?: number     // native; also enables the counter
  showCounter?: boolean  // "42 / 100", needs maxLength
}
```

**Variant and size**
- None. The spec defines a single size and no variants. The visual states (hover, focus, error, read-only, disabled) come from props and native attributes, not from a `variant` prop.

**Composition and slots**
- `label`, `hint`, `error` and the counter are props, not children or compound components. This keeps the label and error wiring inside the component.
- The wrapper renders: label, input, then the error or hint, with the counter bottom-right.
- `id` is optional and falls back to `useId()`. The component links:
  - `<label htmlFor>` to the input.
  - `aria-describedby` to the hint or error, and to the counter.
  - `aria-invalid="true"` when `error` is set.

**Controlled vs. uncontrolled**
- Both are supported and follow native `<input>` rules. The component keeps no value state of its own.
  - Controlled: `value` with `onChange`.
  - Uncontrolled: `defaultValue`, optionally with `onChange`.
- The counter needs the current length. In controlled mode it reads `value`. In uncontrolled mode it tracks length from the `onChange` event, seeded from `defaultValue`.

**Ref forwarding**
- `ref` goes to the `<input>`, not the wrapper, so callers can call `focus()` and read `value`.

**Native prop spreading**
- Remaining props (`type`, `name`, `placeholder`, `disabled`, `readOnly`, `autoComplete`, `onBlur`, and so on) are spread onto the `<input>`.
- `size` is omitted because the native `size` attribute would conflict with a future size prop.
- `className` is applied to the wrapper. The input's own classes are internal.
- A caller-supplied `aria-describedby` is merged with the generated ids, not replaced.
