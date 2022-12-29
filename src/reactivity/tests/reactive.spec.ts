import { reactive } from "../reactive";
describe('reactive',()=>{
    it('happy path', () => {
        const origial = {foo: 1}
        const observed = reactive(origial) // 创建 响应数据对象
        expect(observed).not.toBe(origial)
        expect(observed.foo).toBe(1)
    });
})