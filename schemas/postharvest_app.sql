DROP TABLE IF EXISTS "public"."commodities";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."commodities" (
    "id" varchar(25) NOT NULL,
    "commodity_name" text NOT NULL,
    "variety" text,
    "scientific_name" text,
    "cooling_method" text,
    "climacteric" bool,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."ethylene_sensitivity";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS ethylene_sensitivity_id_seq;

-- Table Definition
CREATE TABLE "public"."ethylene_sensitivity" (
    "commodity_id" varchar NOT NULL,
    "temperature" varchar,
    "c2h4_production" varchar,
    "c2h4_class" varchar,
    "id" int4 NOT NULL DEFAULT nextval('ethylene_sensitivity_id_seq'::regclass),
    CONSTRAINT "ethylene_sensitivity_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "public"."references";

CREATE TABLE "public"."references" (
    "commodity_id" varchar NOT NULL,
    "source" text NOT NULL,
    CONSTRAINT "references_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "public"."respiration_rates";

CREATE SEQUENCE IF NOT EXISTS respiration_rates_id_seq;

CREATE TABLE "public"."respiration_rates" (
    "commodity_id" text,
    "temperature_celsius" numeric,
    "rr_mg_kg_hr" text,
    "rr_class" text,
    "id" int4 NOT NULL DEFAULT nextval('respiration_rates_id_seq'::regclass),
    CONSTRAINT "respiration_rates_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "public"."shelf_life";

CREATE SEQUENCE IF NOT EXISTS shelf_life_id_seq;

CREATE TABLE "public"."shelf_life" (
    "commodity_id" text,
    "temperature_celsius" numeric,
    "shelf_life" text,
    "packaging" text,
    "description" text,
    "id" int4 NOT NULL DEFAULT nextval('shelf_life_id_seq'::regclass),
    CONSTRAINT "shelf_life_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "public"."temperature_recommendations";

CREATE SEQUENCE IF NOT EXISTS temperature_recommendations_id_seq;

CREATE TABLE "public"."temperature_recommendations" (
    "commodity_id" text NOT NULL,
    "min_temp_celsius" text,
    "optimum_temp_celsius" text,
    "description" text,
    "rh" text,
    "id" int4 NOT NULL DEFAULT nextval('temperature_recommendations_id_seq'::regclass),
    CONSTRAINT "temperature_recommendations_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "public"."users";

CREATE TABLE "public"."users" (
    "username" varchar(25) NOT NULL,
    "password" text NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text NOT NULL,
    "job_title" text,
    "is_admin" bool NOT NULL DEFAULT false,
    PRIMARY KEY ("username")
);

DROP TABLE IF EXISTS "public"."windham_studies";

CREATE SEQUENCE IF NOT EXISTS windham_studies_id_seq;

CREATE TABLE "public"."windham_studies" (
    "title" text NOT NULL,
    "date" text,
    "source" text,
    "objective" text,
    "id" int4 NOT NULL DEFAULT nextval('windham_studies_id_seq'::regclass),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."windham_studies_commodities";

CREATE TABLE "public"."windham_studies_commodities" (
    "study_id" int4,
    "commodity_id" text,
    CONSTRAINT "windham_studies_commodities_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "public"."windham_studies"("id"),
    CONSTRAINT "windham_studies_commodities_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "public"."commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "public"."commodities" ("id", "commodity_name", "variety", "scientific_name", "cooling_method", "climacteric") VALUES
('ASP-GRN', 'Asparagus', 'Green', 'Asparagus officinalis', 'Hydrocooling or Forced Air', 'f');
INSERT INTO "public"."commodities" ("id", "commodity_name", "variety", "scientific_name", "cooling_method", "climacteric") VALUES
('LET-ROM', 'Lettuce', 'Romaine', 'Lactuca sativa var. longifolia', 'Vacuum or Hydrocooling', 'f');
INSERT INTO "public"."commodities" ("id", "commodity_name", "variety", "scientific_name", "cooling_method", "climacteric") VALUES
('LET-GRE', 'Lettuce', 'Green Leaf', 'Lactuca sativa', 'Vacuum or Hydrocooling', 'f');
INSERT INTO "public"."commodities" ("id", "commodity_name", "variety", "scientific_name", "cooling_method", "climacteric") VALUES
('AVO-HAS', 'Avocado', 'Hass', 'Persea americana ''Hass''', 'Room Cooling, Forced Air, Hydrocooling', 't'),
('LET-BIB', 'Lettuce', 'Bibb', 'Lactuca sativa ''Bibb''', 'Vacuum or Hydrocooling', 'f'),
('APP-HON', 'Apple', 'Honeycrisp', 'Malus domestica ''Honeycrisp''', 'Room Cooling, Forced Air, Hydrocooling', 't'),
('APP-MUT', 'Apple', 'Mutsu', 'Malus domestica ''Mutsu''', 'Room Cooling, Forced Air, Hydrocooling', 't'),
('APP-FAL', 'Apple', 'Fall', 'Malus domestica', 'Room Cooling, Forced Air, Hydrocooling', 't'),
('APP-SPR', 'Apple', 'Spring', 'Malus domestica', 'Room Cooling, Forced Air, Hydrocooling', 't'),
('DRAGON', 'Dragonfruit', NULL, 'Selenicereus undatus', NULL, NULL),
('BRO-CAL', 'Broccoli', 'Calabrese', 'Brassica oleracea', 'Packaged Ice', 't');

INSERT INTO "public"."ethylene_sensitivity" ("commodity_id", "temperature", "c2h4_production", "c2h4_class", "id") VALUES
('ASP-GRN', '20', '<10', 'Ethylene Sensitive', 1);
INSERT INTO "public"."ethylene_sensitivity" ("commodity_id", "temperature", "c2h4_production", "c2h4_class", "id") VALUES
('LET-ROM', '20', '<10', 'Ethylene Sensitive', 2);
INSERT INTO "public"."ethylene_sensitivity" ("commodity_id", "temperature", "c2h4_production", "c2h4_class", "id") VALUES
('LET-GRE', '20', '<10', 'Ethylene Sensitive', 3);
INSERT INTO "public"."ethylene_sensitivity" ("commodity_id", "temperature", "c2h4_production", "c2h4_class", "id") VALUES
('AVO-HAS', '20', '>100', 'Ethylene Sensitive', 4),
('LET-BIB', '20', '<10', 'Ethylene Sensitive', 5),
('APP-HON', '20', '13-20', 'Ethylene Producer', 6);

INSERT INTO "public"."references" ("commodity_id", "source") VALUES
('ASP-GRN', 'https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/Datastores/Vegetables_English/?uid=2&ds=799');
INSERT INTO "public"."references" ("commodity_id", "source") VALUES
('LET-ROM', 'https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/Datastores/Vegetables_English/?uid=20&ds=799');
INSERT INTO "public"."references" ("commodity_id", "source") VALUES
('AVO-HAS', 'https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/Datastores/Fruit_English/?uid=8&ds=798');

INSERT INTO "public"."respiration_rates" ("commodity_id", "temperature_celsius", "rr_mg_kg_hr", "rr_class", "id") VALUES
('ASP-GRN', 0, '14-40', 'extremely high', 1);
INSERT INTO "public"."respiration_rates" ("commodity_id", "temperature_celsius", "rr_mg_kg_hr", "rr_class", "id") VALUES
('ASP-GRN', 5, '28-68', 'extremely high', 2);
INSERT INTO "public"."respiration_rates" ("commodity_id", "temperature_celsius", "rr_mg_kg_hr", "rr_class", "id") VALUES
('ASP-GRN', 10, '45-152', 'extremely high', 3);
INSERT INTO "public"."respiration_rates" ("commodity_id", "temperature_celsius", "rr_mg_kg_hr", "rr_class", "id") VALUES
('ASP-GRN', 15, '80-168', 'extremely high', 4),
('ASP-GRN', 20, '138-250', 'extremely high', 5),
('ASP-GRN', 25, '350-300', 'extremely high', 6),
('LET-ROM', 5, '9-12', 'mod', 7),
('LET-ROM', 10, '15-20', 'mod', 8),
('LET-ROM', 15, '19-25', 'mod', 9),
('LET-ROM', 20, '30-38', 'mod', 10),
('AVO-HAS', 5, '10-25', 'high', 11),
('AVO-HAS', 10, '25-80', 'high', 12),
('AVO-HAS', 20, '40-150', 'high', 13),
('APP-FAL', 0, '3', 'low', 14),
('APP-FAL', 5, '6', 'low', 15),
('APP-FAL', 10, '9', 'low', 16),
('APP-FAL', 15, '15', 'low', 17),
('APP-FAL', 10, '10', 'low', 18);

INSERT INTO "public"."shelf_life" ("commodity_id", "temperature_celsius", "shelf_life", "packaging", "description", "id") VALUES
('ASP-GRN', 2, '12-21 days', 'air', NULL, 1);
INSERT INTO "public"."shelf_life" ("commodity_id", "temperature_celsius", "shelf_life", "packaging", "description", "id") VALUES
('LET-ROM', 5, '14 days', 'air', NULL, 2);
INSERT INTO "public"."shelf_life" ("commodity_id", "temperature_celsius", "shelf_life", "packaging", "description", "id") VALUES
('LET-ROM', 4, '20+ days', 'tray and lidding film - 36P at 40-45units', NULL, 3);
INSERT INTO "public"."shelf_life" ("commodity_id", "temperature_celsius", "shelf_life", "packaging", "description", "id") VALUES
('LET-BIB', 4, '20+ days', 'tray and lidding film - 36P at 40-45units', NULL, 4),
('APP-MUT', 0, '3-4 months', 'air', NULL, 5),
('AVO-HAS', 3, '2-4 weeks', 'air', 'Ripe', 6),
('AVO-HAS', 10, '3-4 weeks', 'air', 'Mature Green', 7);

INSERT INTO "public"."temperature_recommendations" ("commodity_id", "min_temp_celsius", "optimum_temp_celsius", "description", "rh", "id") VALUES
('ASP-GRN', '0', '2', NULL, '95-100%', 1);
INSERT INTO "public"."temperature_recommendations" ("commodity_id", "min_temp_celsius", "optimum_temp_celsius", "description", "rh", "id") VALUES
('LET-ROM', '0', '0', 'NULL', '>95%', 2);
INSERT INTO "public"."temperature_recommendations" ("commodity_id", "min_temp_celsius", "optimum_temp_celsius", "description", "rh", "id") VALUES
('AVO-HAS', '2', '4', 'Ripe', '90-95%', 3);
INSERT INTO "public"."temperature_recommendations" ("commodity_id", "min_temp_celsius", "optimum_temp_celsius", "description", "rh", "id") VALUES
('AVO-HAS', '5', '13', 'Mature Green', '90-95%', 4),
('APP-HON', '0', '3', NULL, '90-95%', 5);

INSERT INTO "public"."users" ("username", "password", "first_name", "last_name", "email", "job_title", "is_admin") VALUES
('gah1289', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Gabriela', 'McCarthy', 'gah1289@gmail.com', 'Postharvest Specialist', 't');
INSERT INTO "public"."users" ("username", "password", "first_name", "last_name", "email", "job_title", "is_admin") VALUES
('evm', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Liz', 'Marston', 'evmarston@windhampkg.com', 'Owner', 't');


INSERT INTO "public"."windham_studies" ("title", "date", "source", "objective", "id") VALUES
('Miami Agro Kroger Asparagus Study', '10/23/2018', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/asparagus/Kroger Miami Agro Asparagus Study.pdf', 'The purpose of the trial was to determine if: Windham Packaging bags with lower O2 flux rates would extend asparagus shelf life after being stored in room temperature for 3 days; and if spraying the asparagus with water would keep the tips from drying out', 1);
INSERT INTO "public"."windham_studies" ("title", "date", "source", "objective", "id") VALUES
('Springworks Peel/Reseal Lidding Film Study', '01/11/2023', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/leafy-greens/romaine/Springworks Study 2023 01 - FINAL.pptx', 'The objective of the study was to test Windham Packaging resealable lidding films on Springworks products to determine if increased perforation patterns would help decrease condensation within the package. 
', 2);
INSERT INTO "public"."windham_studies" ("title", "date", "source", "objective", "id") VALUES
('Springworks OTR 3 Study', '03/07/2019', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/leafy-greens/romaine/Springworks Study 3 FINAL.pptx', 'To test the shelf life of Springworks romaine packaged at a higher OTR rate (OTR 3)', 3);
INSERT INTO "public"."windham_studies" ("title", "date", "source", "objective", "id") VALUES
('Springworks OTR 1 and OTR 2 Study', '02/07/2019', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/leafy-greens/romaine/Springworks Study 2019 02 07 FINAL.pptx', 'To test the shelf life of Springworks romaine at OTR 1 and OTR 2', 4),
('Springworks Farm Preliminary Study', '01/16/2019', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/leafy-greens/romaine/Springworks Study 2019 01 16 FINAL.pptx', 'To determine whether Windham Packaging MAP (Modified Atmosphere Packaging) will extend the shelf life of Springworks Farm baby romaine and green leaf heads.  The goal is to retain romaine and green leaf quality for up to 17 days at a realistic temperature regime.', 5),
('Avocado Preliminary Study', '10/24/2017', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/avocado/Avocado Preliminary Shelf Life Study Windham Packaging.pdf', 'To test hydro-sure packaging on avocados compared to control hot-needle perforated bags', 6),
('Fruitripe Avocado Study', '05/24/2018', '/home/gah1289/springboard_assignments/50-capstone-two/postharvest-app-backend/windham-studies/avocado/Fruitripe Avocado Shelf Life Study.pptx', 'To compare the shelf life of Fruitripe avocados in control (netted), hydro-sure, and laminate MAP pouches', 7);

INSERT INTO "public"."windham_studies_commodities" ("study_id", "commodity_id") VALUES
(1, 'ASP-GRN');
INSERT INTO "public"."windham_studies_commodities" ("study_id", "commodity_id") VALUES
(2, 'LET-ROM');
INSERT INTO "public"."windham_studies_commodities" ("study_id", "commodity_id") VALUES
(3, 'LET-ROM');
INSERT INTO "public"."windham_studies_commodities" ("study_id", "commodity_id") VALUES
(4, 'LET-ROM'),
(5, 'LET-ROM'),
(4, 'LET-GRE'),
(2, 'LET-GRE'),
(5, 'LET-GRE'),
(6, 'AVO-HAS'),
(7, 'AVO-HAS'),
(2, 'LET-BIB');
