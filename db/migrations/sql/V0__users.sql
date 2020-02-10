CREATE TABLE users (
  user_id integer NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  encoded_password text NOT NULL,
  activated boolean DEFAULT false NOT NULL,
  signup_date timestamp with time zone NOT NULL
);

CREATE SEQUENCE users_user_id_sequence
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE users_user_id_sequence OWNED BY users.user_id;

ALTER TABLE ONLY users ALTER COLUMN user_id
SET DEFAULT nextval('users_user_id_sequence'::regclass);

ALTER TABLE ONLY users
ADD CONSTRAINT users_pk PRIMARY KEY (user_id);
