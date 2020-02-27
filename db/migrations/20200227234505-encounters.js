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
    'encounters',
    {
      encounter_id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        unsigned: true,
        primaryKey: true,
      },
      game_system_id: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
          name: 'encounters_game_system_id_fk',
          table: 'game_systems',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            game_system_id: 'game_system_id',
          },
        },
      },
      name: {
        type: 'text',
      },
      data: {
        type: 'jsonb',
        notNull: true,
      },
    },
    callback);
};

exports.down = function(db, callback) {
  db.dropTable('encounters', callback);
};

exports._meta = {
  "version": 1
};
