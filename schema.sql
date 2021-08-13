
-- Tables
CREATE DATABASE sdc_reviews

USE sdc_reviews

CREATE TABLE products
(
    id SERIAL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

CREATE TABLE characteristics
(
    id SERIAL,
    product_id integer,
    name text COLLATE pg_catalog."default",
    CONSTRAINT characteristics_pkey PRIMARY KEY (id),
    CONSTRAINT fk_prod FOREIGN KEY (product_id)
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE reviews
(
    id SERIAL,
    product_id integer,
    rating integer,
    date bigint,
    summary text COLLATE pg_catalog."default",
    body text COLLATE pg_catalog."default",
    recommend boolean,
    reported boolean,
    reviewer_name text,
    reviewer_email text,
    response text,
    helpfulness integer,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT fk_prod FOREIGN KEY (product_id)
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE photos
(
    id SERIAL,
    review_id integer,
    url text,
    CONSTRAINT photos_pkey PRIMARY KEY (id),
    CONSTRAINT fk_review FOREIGN KEY (review_id)
        REFERENCES reviews (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE characteristic_reviews
(
    id SERIAL,
    characteristic_id integer,
    review_id integer,
    value integer,
    CONSTRAINT characteristic_reviews_pkey PRIMARY KEY (id),
    CONSTRAINT fk_char FOREIGN KEY (characteristic_id)
        REFERENCES characteristics (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_rev FOREIGN KEY (review_id)
        REFERENCES reviews (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


-- Indexes

CREATE INDEX reviews_productid_idx
    ON reviews USING btree
    (product_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX photos_reviewid_idx
    ON photos USING btree
    (review_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX char_productid_idx
    ON characteristics USING btree
    (product_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX char_reviews_charid_idx
    ON characteristic_reviews USING btree
    (characteristic_id ASC NULLS LAST)
    TABLESPACE pg_default;