#!/bin/bash
set -e

npm install --no-audit --no-fund
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_add_course_interest_columns.sql
