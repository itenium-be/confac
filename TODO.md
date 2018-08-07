Zeker te doen:
- remove the "update pdf" button: just do always (always see the preview button)
- Inloggen Google met email (config)
- Template selecteren met dropdown
- New invoice & New Quotation
- New invoice: Create/Edit client with popup
- remember on edit page that there are changes and need to be saved?
- Jos zijn template
- CarPass & stuff
- do not go back to overview after saving (add extra button "save and return?")
- componentDidMount invoice, client, config -> scroll.toTop()

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


