/* First table : List */

-- we start a transaction ensure global consistency of the DB
BEGIN;

-- We first delete the table 'if it exists"
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";

-- Then we (re)create it

CREATE TABLE "list" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "position" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);


/* Second table: Card */

CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "content" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  -- if we want to be bale to delete a list which contains cards, we have to specify "ON DELETE CASCADE" which will make sure to remove all the cards related to that list
  "list_id" INTEGER NOT NULL REFERENCES list("id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

/* Third table: Tag */

CREATE TABLE "tag" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

/* Liaison table ! */

CREATE TABLE "card_has_tag" (
  -- if we want to be able to delete a card or a tag, we have to specify "ON DELETE CASCADE" which will delete all associations related to that deleted card or that deleted tag
  "card_id" INTEGER NOT NULL REFERENCES card("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES tag("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- here no need for updated_at because a relationship doesn't get updated, it is added or deleted, nothing else
);

COMMIT;