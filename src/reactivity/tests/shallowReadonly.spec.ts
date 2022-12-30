import { isReadonly, isReactive, shallowReadonly } from '../reactive';
describe('shallowReadonly', ()=>{
    it('frist readonly, other reactive', () => {
        const original = { bar: 1, obj: {foo:2} }
        const newObj = shallowReadonly(original)
        expect(isReadonly(newObj)).toBe(true)
        expect(isReactive(newObj)).toBe(false)
        expect(isReadonly(newObj.obj)).toBe(false)
        // expect(isReactive(newObj.obj)).toBe(true)
    });
})