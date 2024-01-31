SELECT 'CREATE DATABASE nombre_de_la_base_de_datos'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tienda');

DROP TABLE IF EXISTS "funkos";
DROP SEQUENCE IF EXISTS funkos_id_seq;
DROP TABLE IF EXISTS "user_roles";
DROP TABLE IF EXISTS "usuarios";
DROP SEQUENCE IF EXISTS usuarios_id_seq;
DROP TABLE IF EXISTS "categorias";

-- Cuiddado con las secuencias, si se borran se pierde el autoincremento, ponemos el start a 6 para que empiece en 6
CREATE SEQUENCE funkos_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 6 CACHE 1;

CREATE TABLE "public"."funkos"
(
    "is_deleted"   boolean          DEFAULT false,
    "precio"       double precision DEFAULT '0.0',
    "stock"        integer          DEFAULT '0',
    "created_at"   timestamp        DEFAULT CURRENT_TIMESTAMP           NOT NULL,
    "id"           bigint           DEFAULT nextval('productos_id_seq') NOT NULL,
    "updated_at"   timestamp        DEFAULT CURRENT_TIMESTAMP           NOT NULL,
    "categoria_id" uuid,
    "uuid"         uuid                                                 NOT NULL,
    "descripcion"  character varying(255),
    "imagen"       text             DEFAULT 'https://via.placeholder.com/150',
    "nombre"        character varying(255),
    CONSTRAINT "funkos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "funkos_uuid_key" UNIQUE ("uuid")
) WITH (oids = false);

INSERT INTO "funkos" ("is_deleted", "precio", "stock", "created_at", "id", "updated_at", "categoria_id", "uuid",
                         "descripcion", "imagen", "nombre")
VALUES ('f', 10.99, 5, '2023-11-02 11:43:24.722473', 1, '2023-11-02 11:43:24.722473',
        'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9', '19135792-b778-441f-871e-d6e6096e0ddc', 'Descripción1',
        'https://via.placeholder.com/150', 'IronMan'),
       ('f', 19.99, 10, '2023-11-02 11:43:24.722473', 2, '2023-11-02 11:43:24.722473',
        '6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154', '8c5c06ba-49d6-46b6-85cc-8246c0f362bc', 'Descripción2',
        'https://via.placeholder.com/150', 'BatMan'),
       ('f', 15.99, 2, '2023-11-02 11:43:24.722473', 3, '2023-11-02 11:43:24.722473',
        'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9', '6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154', 'Descripción3',
        'https://via.placeholder.com/150', 'Stitch'),
       ('f', 25.99, 8, '2023-11-02 11:43:24.722473', 4, '2023-11-02 11:43:24.722473',
        '6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154', '9def16db-362b-44c4-9fc9-77117758b5b0', 'Descripción4',
        'https://via.placeholder.com/150', 'Pikachu'),
       ('f', 12.99, 3, '2023-11-02 11:43:24.722473', 5, '2023-11-02 11:43:24.722473',
        '6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154', '8c5c06ba-49d6-46b6-85cc-8246c0f362bc', 'Descripción5',
        'https://via.placeholder.com/150', 'Joker');


CREATE TABLE "public"."user_roles"
(
    "user_id" bigint NOT NULL,
    "roles"   character varying(255)
) WITH (oids = false);

INSERT INTO "user_roles" ("user_id", "roles")
VALUES (1, 'USER'),
       (1, 'ADMIN'),
       (2, 'USER'),
       (2, 'USER'),
       (3, 'USER');

CREATE SEQUENCE usuarios_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 5 CACHE 1;

CREATE TABLE "public"."usuarios"
(
    "is_deleted" boolean   DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP          NOT NULL,
    "id"         bigint    DEFAULT nextval('usuarios_id_seq') NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP          NOT NULL,
    "apellidos"  character varying(255)                       NOT NULL,
    "email"      character varying(255)                       NOT NULL,
    "nombre"     character varying(255)                       NOT NULL,
    "password"   character varying(255)                       NOT NULL,
    "username"   character varying(255)                       NOT NULL,
    CONSTRAINT "usuarios_email_key" UNIQUE ("email"),
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "usuarios_username_key" UNIQUE ("username")
) WITH (oids = false);

INSERT INTO "usuarios" ("is_deleted", "created_at", "id", "updated_at", "apellidos", "email", "nombre", "password",
                        "username")
VALUES ('f', '2023-11-02 11:43:24.724871', 1, '2023-11-02 11:43:24.724871', 'Admin Admin', 'admin@prueba.net', 'Admin',
        '$2a$10$vPaqZvZkz6jhb7U7k/V/v.5vprfNdOnh4sxi/qpPRkYTzPmFlI9p2', 'admin'),
       ('f', '2023-11-02 11:43:24.730431', 2, '2023-11-02 11:43:24.730431', 'User User', 'user@prueba.net', 'User',
        '$2a$12$RUq2ScW1Kiizu5K4gKoK4OTz80.DWaruhdyfi2lZCB.KeuXTBh0S.', 'user'),
       ('f', '2023-11-02 11:43:24.733552', 3, '2023-11-02 11:43:24.733552', 'Test Test', 'test@prueba.net', 'Test',
        '$2a$10$Pd1yyq2NowcsDf4Cpf/ZXObYFkcycswqHAqBndE1wWJvYwRxlb.Pu', 'test'),
       ('f', '2023-11-02 11:43:24.736674', 4, '2023-11-02 11:43:24.736674', 'Otro Otro', 'otro@prueba.net', 'otro',
        '$2a$12$3Q4.UZbvBMBEvIwwjGEjae/zrIr6S50NusUlBcCNmBd2382eyU0bS', 'otro');


CREATE TABLE "public"."categorias"
(
    "activa" boolean   DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "id"         uuid                                NOT NULL,
    "nombre"     character varying(255)              NOT NULL,
    CONSTRAINT "categorias_nombre_key" UNIQUE ("nombre"),
    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "categorias" ("activa", "created_at", "updated_at", "id", "nombre")
VALUES ('t', '2023-11-02 11:43:24.717712', '2023-11-02 11:43:24.717712', 'd69cf3db-b77d-4181-b3cd-5ca8107fb6a9',
        'Marvel'),
       ('t', '2023-11-02 11:43:24.717712', '2023-11-02 11:43:24.717712', '6dbcbf5e-8e1c-47cc-8578-7b0a33ebc154',
        'Disney'),
       ('t', '2023-11-02 11:43:24.717712', '2023-11-02 11:43:24.717712', '9def16db-362b-44c4-9fc9-77117758b5b0',
        'Pokemon'),
       ('t', '2023-11-02 11:43:24.717712', '2023-11-02 11:43:24.717712', '8c5c06ba-49d6-46b6-85cc-8246c0f362bc',
        'DC'),
       ('t', '2023-11-02 11:43:24.717712', '2023-11-02 11:43:24.717712', 'bb51d00d-13fb-4b09-acc9-948185636f79',
        'OTROS');

ALTER TABLE ONLY "public"."funkos"
    ADD CONSTRAINT "fk2fwq10nwymfv7fumctxt9vpgb" FOREIGN KEY (categoria_id) REFERENCES categorias (id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "fk2chxp26bnpqjibydrikgq4t9e" FOREIGN KEY (user_id) REFERENCES usuarios (id) NOT DEFERRABLE;
