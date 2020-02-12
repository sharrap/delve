import uuidv4 from 'uuid/v4.js';

export default function AuthToken(AuthDB, User) {
  const cookie = {
    path: '/',
    httpOnly: true,
    maxAge: 604800000, // 7 days
  };
  async function authorize({ selector, validator }) {
    if (!selector || !validator) throw new Error();

    const id = await AuthDB.get(selector, validator);

    if (!id) return false;

    await User.getById(id);
  }
  async function grant(user) {
    const selector = uuidv4();
    const validator = uuidv4();

    await AuthDB.add(user.id, selector, validator, cookie.maxAge);

    return { selector: selector, validator: validator };
  }
  async function clear({ selector }) {
    if (!selector) throw new Error();
    await AuthDB.clear(selector);
  }
  return { grant: grant, authorize: authorize, clear: clear, cookie: cookie };
}
