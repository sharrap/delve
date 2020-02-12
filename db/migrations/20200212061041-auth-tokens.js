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
    'auth_tokens',
    {
      id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        unsigned: true,
        primaryKey: true,
      },
      selector: {
        type: 'char(36)',
        notNull: true,
        unique: true,
      },
      hashed_validator: {
        type: 'char(64)',
        notNull: true,
      },
      user_id: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
          name: 'auth_tokens_user_id_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            user_id: 'id',
          },
        },
      },
      expires_ts: {
        type: 'timestamptz',
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function(db, callback) {
  db.dropTable('auth_tokens', callback);
};

exports._meta = {
  version: 1,
};
