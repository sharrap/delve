import crypto from 'crypto';

export default function(db) {
  async function clear(selector) {
    await db.query('DELETE FROM auth_tokens WHERE selector = $1;', [selector]);
  }

  async function get(selector, validator) {
    const hashedValidator = crypto
      .createHash('sha256')
      .update(validator)
      .digest('hex');

    const res = await db.query(
      'SELECT user_id, (expires_ts <= current_timestamp) AS outdated \
      FROM auth_tokens \
      WHERE selector = $1 AND hashed_validator = $2',
      [selector, hashedValidator]
    );

    if (!res || !res.rows || res.rows.length !== 1) return false;

    if (res.rows[0]['outdated']) {
      await clear(selector);
      return false;
    }

    return res.rows[0]['user_id'];
  }

  async function add(userId, selector, validator, duration) {
    const hashedValidator = crypto
      .createHash('sha256')
      .update(validator)
      .digest('hex');

    await db.query(
      "INSERT INTO auth_tokens \
    (selector, hashed_validator, user_id, expires_ts) VALUES \
    ($1, $2, $3, current_timestamp + $4::int * '1 millisecond'::interval);",
      [selector, hashedValidator, userId, duration]
    );
  }

  return {
    add: add,
    get: get,
    clear: clear,
  };
}
