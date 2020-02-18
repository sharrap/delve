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
    'parties_characters',
    {
      party_character_id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        unsigned: true,
        primaryKey: true,
      },
      party_id: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
          name: 'parties_characters_party_id_fk',
          table: 'parties',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            party_id: 'party_id',
          },
        },
      },
      character_id: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
          name: 'parties_characters_character_id_fk',
          table: 'characters',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            character_id: 'character_id',
          },
        },
      },
    },
    callback);
};

exports.down = function(db, callback) {
  db.dropTable('parties_characters', callback);
};

exports._meta = {
  "version": 1
};
