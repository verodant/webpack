import { Sticky } from '../sticky.js';

jest.mock('../sticky.js');


describe('suite de test', () => {

    let elementSticky;

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods
        Sticky.mockClear();

        elementSticky = new Sticky({
            sentinel: '.element__sentinel',
            collider: '.element--sticky',
            eventBubbling: true
        });

    });

    it('should be able to call new()', async () => {

        // Ensure constructor have created the object
        expect(elementSticky).toBeTruthy();
    });

});