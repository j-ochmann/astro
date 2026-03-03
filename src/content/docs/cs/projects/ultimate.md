---
title: 'Ultimate Stack'
sidebar:
  label: Ultimate
  order: 20
translation_status: original
---

```yaml
services:
  postgres-db:
    container_name: postgres-db
    # ...
  api-server:
    container_name: api-server
    depends_on:
      - postgres-db
    # ...
  next-app:
    container_name: next-app
    depends_on:
      - api-server    
    # ...
  astro-web:
    container_name: astro-web
    depends_on:
      - api-server
    # ...
```
