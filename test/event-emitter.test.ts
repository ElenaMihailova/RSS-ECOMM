// import EventEmitter from '../src/controller/event-emitter';

// const callbackMock = jest.fn();

// const eventsMock = {
//   'event: event': [callbackMock],
// };

// describe('event emitter methods', () => {
//   const emitter = new EventEmitter();
//   emitter.events = eventsMock;
//   const newEvent = 'event: new-event';
//   const oldEvent = 'event: event';
//   const callback = (a?: string): void => {
//     a = '1';
//   };
//   const callback2 = (b?: string): void => {
//     b = '2';
//   };
//   const data = { name: 'value' };

//   test('check subscribe to new event', () => {
//     emitter.subscribe(newEvent, callback);
//     expect(emitter.events[newEvent]).toStrictEqual([callback]);
//   });

//   test('check subscribe to old event', () => {
//     emitter.subscribe(oldEvent, callback);
//     expect(emitter.events[oldEvent]).toStrictEqual([callbackMock, callback]);
//   });

//   test('check unsubscribe method', () => {
//     emitter.subscribe(newEvent, callback2);
//     emitter.unsubscribe(newEvent, callback2);
//     expect(emitter.events[newEvent]).toStrictEqual([callback]);
//   });

//   test('check emit method', () => {
//     emitter.emit(oldEvent, data);
//     expect(callbackMock).toHaveBeenCalledWith(data.name);
//   });
// });
