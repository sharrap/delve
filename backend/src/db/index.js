import pg from 'pg';

export default function() {
  // FIXME TODO XXX when fixing up DB connections in general
  return new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
  });
}
