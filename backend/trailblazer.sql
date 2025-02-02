-- Database Setup commands

\echo 'Delete and recreate trailblazer db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS trailblazer;
CREATE DATABASE trailblazer;
\connect trailblazer

\i trailblazer-schema.sql

-- Include the seed file to populate initial data
\i trailblazer-seed.sql

\echo 'Delete and recreate trailblazer_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS trailblazer_test;
CREATE DATABASE trailblazer_test;
\connect trailblazer_test

\i trailblazer-schema.sql

-- Include the seed file for the test database
\i trailblazer-seed.sql
