export default function(db, passwordConfig) {
  function user(res) {
    if (!res || !res.rows || res.rows.length !== 1) {
      throw new Error('Unrecognized number of rows');
    }
    return {
      id: parseInt(res.rows[0]['id']),
      email: res.rows[0]['email'],
      hashedPassword: res.rows[0]['hashed_password'],
    };
  }

  async function getById(id) {
    const res = await db.query(
      'SELECT id, email \
       FROM users \
       WHERE id = $1::integer;',
      [id]
    );
    return user(res);
  }

  async function getByEmail(email) {
    const lcEmail = (email || '').toLowerCase();
    const res = await db.query(
      'SELECT id, email \
       FROM users \
       WHERE email = $1::text;',
      [lcEmail]
    );
    return user(res);
  }

  async function getWithPasswordByEmail(email) {
    const lcEmail = (email || '').toLowerCase();
    const res = await db.query(
      'SELECT id, email, hashed_password \
       FROM users \
       WHERE email = $1::text;',
      [lcEmail]
    );
    return user(res);
  }

  async function addPassword(id, password) {
    const hash = passwordConfig.hashSync(Buffer.from(password));

    await db.query(
      'UPDATE users SET hashed_password = $2::text \
      WHERE id = $1',
      [id, hash.toString().replace(/\0+$/g, '')]
    );
  }

  async function add(email, password) {
    const lcEmail = (email || '').toLowerCase();
    const emailExists = await db.query(
      'SELECT TRUE FROM users WHERE email = $1::text',
      [lcEmail]
    );

    if (emailExists.rows.length > 0) {
      throw { emailTaken: true };
    }

    const hash = passwordConfig.hashSync(Buffer.from(password));

    const user = await db.query(
      'INSERT INTO users (email, hashed_password) \
           VALUES ($1::text, $2::text)',
      [lcEmail, hash.toString().replace(/\0+$/g, '')]
    );

    return user;
  }

  return {
    getById: getById,
    getByEmail: getByEmail,
    getWithPasswordByEmail: getWithPasswordByEmail,
    add: add,
    addPassword: addPassword,
  };
}
