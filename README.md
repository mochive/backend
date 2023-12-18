# Backend

Backend of Mochive

## Requirement

### Program

- Node.js >= 18.12.0
- MariaDB >= 10.5.4
- Redis >= 7.0.10
- Elasticsearch >= 8.10.0

### Environment

|Key|Value|
|-|-|
|DATABASE_URL|mysql://{user}:{password}@{hostname}:{port}/{database}|
|CACHE_DATABASE_URL|redis://{user}:{password}@{hostname}:{port}/{index}|
|SEARCH_DATABASE_URL|https://{user}:{password}@{hostname}:{port}|
|PORT|3000|
|RATE_LIMIT|1024|
|LOG_LEVEL|debug|