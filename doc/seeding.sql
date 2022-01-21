BEGIN;

/* Once tables are created, we fill them up */

INSERT INTO "list" ("name")
VALUES ('Première liste' );

INSERT INTO "card" ("content", "color", "list_id")
VALUES ('Carte 1', '#fff696', 1),
       ('2ème carte', '#c1e7ff', 1);

INSERT INTO "tag" ("name", "color")
VALUES ('Urgent', '#F00');

-- Same for the liaison table
INSERT INTO "card_has_tag" ("card_id", "tag_id")
VALUES (1,1);

COMMIT;