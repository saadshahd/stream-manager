import * as Eventer from '../../app/bundle/event';
import * as chai from 'chai';
import spies from 'chai-spies';

chai.use(spies);

const expect = chai.expect;

export function test() {
  beforeEach(() => {
    global.window = {};
  });

  describe('Event on', () => {
    it('should add listener', () => {
      window.addEventListener = chai.spy();

      Eventer.on('test', () => {});

      expect(window.addEventListener).to.have.been.called.with('message');
    });
  });

  describe('Event emit', () => {
    it('should trigger event', () => {
      window.postMessage = chai.spy();

      Eventer.emit('test', 'data');

      expect(window.postMessage).to.have.been.called.with({
        type: 'StreamManager:test',
        detail: 'data'
      });
    });
  });
}
