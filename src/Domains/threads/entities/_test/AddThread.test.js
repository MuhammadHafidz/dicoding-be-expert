const AddThread = require('../AddThread');

describe('AddThread entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      title: 'judul',
    };

    expect(() => new AddThread({ ...payload })).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  
  it('should throw error when auth property is missing', () => {
    const payload = {
      title: 'judul',
      body: 'isi thread',
    };

    expect(() => new AddThread({ ...payload })).toThrow('ADD_THREAD.AUTH_HEADER_NOT_VALID');
  });

  it('should throw error when data types do not match', () => {
    const payload = {
      title: 123,
      body: true,
    };

    const userId = 123
    expect(() => new AddThread(payload, userId)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    const payload = {
      title: 'judul',
      body: 'isi thread'
    };

    const userId = 'user-123';

    const addThread = new AddThread(payload, userId);

    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.userId).toEqual(userId);
  });
});
