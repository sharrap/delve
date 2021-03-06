'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable(
    'users',
    {
      user_id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        unsigned: true,
        primaryKey: true,
      },
      email: { type: 'text', notNull: true, unique: true },
      hashed_password: { type: 'text', notNull: true },
      activated: { type: 'boolean', defaultValue: 'false', notNull: true },
      signup_ts: {
        type: 'timestamptz',
        defaultValue: new String('current_timestamp'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};

exports._meta = {
  version: 1,
};
