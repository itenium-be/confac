confac-back
===========
Starting DEV:

```
# Start Mongo
cd ../
vagrant up

# Run Mongo Migrations
npm run mm

# Start server
npm start
```

Migrations
----------
https://github.com/afloyd/mongo-migrate

Migrate to specific:

```
npm run mm down 5
npm run mm up 15
```

TODO
----
- Backup mongo to folder synced with local system in vagrant
- Form to set config.nextInvoiceNumber and config.defaultClient