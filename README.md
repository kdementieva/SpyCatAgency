## SpyCatAgency

### Running PostgreSQL

```bash
docker-compose up -d
```

### Backend API endpoints

- `GET /cat/` — list cats  
- `POST /cat/` — create cat (`name`, `years_of_experience`, `breed`, `salary`)  
- `GET /cat/{id}/` — retrieve cat  
- `PATCH /cat/{id}/` — update cat fields (used for salary updates)  
- `DELETE /cat/{id}/` — delete cat

Missions/targets:
- `GET /mission/`, `POST /mission/` — list/create mission (supports nested `targets`)  
- `GET /mission/{id}/`, `PATCH /mission/{id}/`, `DELETE /mission/{id}/`  
  - delete blocked if mission is assigned to a cat  
- `GET /target/`, `PATCH /target/{id}/` — update target (mark complete or notes; notes blocked when target/mission completed)

### Example curl calls

Assuming API at `http://localhost:8000` and an empty database (ids start at 1).

**Cats**
```bash
# Create a cat
curl -X POST http://localhost:8000/cat/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Whiskers","years_of_experience":3,"breed":"Siberian","salary":"5000.00"}'

# List cats
curl -X GET http://localhost:8000/cat/

# Get a single cat (id=1)
curl -X GET http://localhost:8000/cat/1/

# Update salary (id=1)
curl -X PATCH http://localhost:8000/cat/1/ \
  -H "Content-Type: application/json" \
  -d '{"salary":"5200.00"}'

# Delete cat (id=1)
curl -X DELETE http://localhost:8000/cat/1/
```

**Missions / Targets**
```bash
# Create a mission with targets (no cat assigned)
curl -X POST http://localhost:8000/mission/ \
  -H "Content-Type: application/json" \
  -d '{
    "cat": null,
    "completed": false,
    "targets": [
      {"name": "Alpha", "country": "PL", "notes": "first target", "completed": false},
      {"name": "Bravo", "country": "US", "notes": "second target", "completed": false}
    ]
  }'

# List missions
curl -X GET http://localhost:8000/mission/

# Get a mission (id=1)
curl -X GET http://localhost:8000/mission/1/

# Assign a cat to a mission (id=1, cat id=1)
curl -X PATCH http://localhost:8000/mission/1/ \
  -H "Content-Type: application/json" \
  -d '{"cat":1}'

# Mark a target completed (target id=1)
curl -X PATCH http://localhost:8000/target/1/ \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Update target notes (target id=2; only if target/mission not completed)
curl -X PATCH http://localhost:8000/target/2/ \
  -H "Content-Type: application/json" \
  -d '{"notes": "updated notes"}'
```
