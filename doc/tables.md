# List

| Champ | Type | Peut être null | Valeur par défaut |
|---|---|---|---|
| id | SERIAL | non | aucun|
| name | TEXT | non | "" |
| page_order | INTEGER | non | 0 |
| createdAt | DATE | oui | null |
| updatedAt | DATE | oui | null |


# Card

| Champ | Type | Peut être null | Valeur par défaut |
|---|---|---|---|
| id | SERIAL | non | aucun|
| title | TEXT | non | "" |
| color | TEXT | non | "#FFF" |
| list_id | INTEGER | non | 0 |
| position | INTEGER | non | 0 |
| createdAt | DATE | oui | null |
| updatedAt | DATE | oui | null |

# Tag

| Champ | Type | Peut être null | Valeur par défaut |
|---|---|---|---|
| id | SERIAL | non | aucun|
| title | TEXT | non | "" |
| color | TEXT | non | "#FFF" |
| createdAt | DATE | oui | null |
| updatedAt | DATE | oui | null |

# Card_has_Tag

| Champ | Type | Peut être null | Valeur par défaut |
|---|---|---|---|
| card_id | INTEGER | non | aucun |
| tag_id | INTEGER | non | aucun |