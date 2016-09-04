import * as Eventer from '../../app/bundle/event';
import * as chai from 'chai';
import spies from 'chai-spies';
import {mocks} from 'mock-browser';

chai.use(spies);

const expect = chai.expect;
const browser = new mocks.MockBrowser();

export function test() {
  beforeEach(() => {
    global.window = browser.getWindow();
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
