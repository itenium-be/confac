Zeker te doen:
- New Quotation / offertes
--> convert quotation to invoice

- InvoiceList: add icon to view the pdf instead of downloading it

oh boy
--> move from quotation to invoice detail pages
--> translations get all messed up :(

--> go from offerte to "new invoice" --> not translated stuff remains



- Inloggen Google met email (config)
- Jos zijn template
- CarPass & stuff
- remember on edit page that there are changes and need to be saved?

DEPLOY STUFF


Refactoring:  
- Remove the config files from backend-config (into this repo)
- backend-Config: The frontend port is always 9000?
- cleanup frontend config: the switch there is redundant
- then jenkins won't have to explicitly build back anymore when no scm changes


Templates: W:\confac-templates  

--> if templates/path has htmltopdf.json use that one? But will it help against the margin printing problem?
--> if there is a db config file in /templates, use that one?
--> use alpine for docker and check size then?
--> registry: use versions instead of always overwriting latest?
