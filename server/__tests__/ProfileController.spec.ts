
import supertest from 'supertest'
import createServer from '../utils/server'

const { app } = createServer()
describe('ProfileController', () => {
    describe('ProfileController - first test', () => {
        it('should be true', ()=> {
            expect(true).toBe(true)
        })
    })
    describe('ProfileController - second test', () => {
        it('should be false', ()=> {
            expect(false).toBe(false)
        })
    })
})