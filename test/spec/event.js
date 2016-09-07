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
    let spy;
    let listener;
    const detail = 'detail';

    beforeEach(() => {
      spy = chai.spy();

      window.addEventListener = (name, cb) => {
        listener = cb;
      };
    });

    it('should call add addEventListener', () => {
      window.addEventListener = spy;

      Eventer.on('test', () => {});

      expect(window.addEventListener).to.have.been.called.with('message');
    });

    it(`should not invoke the handler if source isn't this window`, () => {
      Eventer.on('test', spy);

      listener({
        source: null,
        data: {
          type: 'StreamManager:test',
          detail
        }
      });

      expect(spy).to.have.not.been.called();
    });

    it(`should not invoke the handler wrong event type`, () => {
      Eventer.on('test1', spy);

      listener({
        source: null,
        data: {
          type: 'StreamManager:test',
          detail
        }
      });

      expect(spy).to.have.not.been.called();
    });

    it('should call handler with detail', () => {
      Eventer.on('test', spy);

      listener({
        source: window,
        data: {
          type: 'StreamManager:test',
          detail
        }
      });

      expect(spy).to.have.been.called.with(detail);
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
