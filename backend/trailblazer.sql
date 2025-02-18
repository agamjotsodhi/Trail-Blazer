-- Database Setup Commands
-- This script deletes and recreates the databases for Trailblazer.

\echo 'Delete and recreate trailblazer database?'
\prompt 'Press Enter to continue or Ctrl+C to cancel > ' foo

-- Drop and recreate the main database
DROP DATABASE IF EXISTS trailblazer;
CREATE DATABASE trailblazer;
\connect trailblazer

-- Load the schema for the main database
\i trailblazer-schema.sql

-- Populate the main database with initial seed data
\i trailblazer-seed.sql

\echo 'Delete and recreate trailblazer_test database?'
\prompt 'Press Enter to continue or Ctrl+C to cancel > ' foo

-- Drop and recreate the test database
DROP DATABASE IF EXISTS trailblazer_test;
CREATE DATABASE trailblazer_test;
\connect trailblazer_test

-- Load the schema for the test database
\i trailblazer-schema.sql

-- Populate the test database with initial seed data
\i trailblazer-seed.sql
