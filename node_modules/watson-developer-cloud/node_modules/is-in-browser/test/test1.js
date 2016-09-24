import test from 'tape';
import myModule from '../src/index';


test('Your module', t => {
    t.plan(1);
    let truthBomb = myModule();
    t.equal(false, truthBomb, 'works as expected...');
});
