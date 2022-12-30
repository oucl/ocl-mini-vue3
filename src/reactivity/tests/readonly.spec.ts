
import { readonly, isProxy, isReactive, isReadonly } from '../reactive'
describe('readonly', () => {
    it('should make nested values readonly', () => {
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)

        expect(wrapped).not.toBe(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReactive(wrapped)).toBe(false)
        expect(isProxy(wrapped)).toBe(true)
        expect(isReadonly(wrapped.bar)).toBe(true)
        expect(isReactive(wrapped.bar)).toBe(false)


        expect(isReactive(original)).toBe(false)
        expect(isReadonly(original)).toBe(false)
        expect(wrapped.foo).toBe(1)
    });
})