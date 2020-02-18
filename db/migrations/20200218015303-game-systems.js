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
    'game_systems',
    {
      game_system_id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        unsigned: true,
        primaryKey: true,
      },
      name: {
        type: 'text',
        notNull: true,
        unique: true,
      },
    },
    callback);
};

exports.down = function(db, callback) {
  db.dropTable('game_systems', callback);
};

exports._meta = {
  "version": 1
};
