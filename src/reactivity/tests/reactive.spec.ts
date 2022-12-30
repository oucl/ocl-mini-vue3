import { reactive, isReactive } from '../reactive';
describe('reactive',()=>{
    it('happy path', () => {
        const origial = {foo: 1}
        const observed = reactive(origial) // 创建 响应数据对象
        expect(observed).not.toBe(origial)
        expect(observed.foo).toBe(1)
    });

    it('nested reactive', () => {
        const original = {
            foo:1, 
            nested: {test:2},
            arr: [{bar:3}]
        }
        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.arr)).toBe(true)
        expect(isReactive(observed.arr[0])).toBe(true)
    });
})