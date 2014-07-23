crowdbase-hackpad-importer
==========================

Small script to import your crowdbase files to hackpad.

## Usage
First, export your crowdbase documents. As an admin, you can download them to your computer as a zip file. Unzip the file.

Go to your hackpad account and view your profile to get your Hackpad API clientId and secret. You will need both of these.

Run the following command, specifying your clientId, secret, and crowdbase directory:
```bash
./import.js -i CLIENTID -t SECRET -p /path/to/crowdbase/directory
```

The script will only import files with valid extensions: `.html`,`.md`, and `.txt` 

If you are using a private hackpad subdomain, you can specify it with the -s option
```bash
./import.js -i CLIENTID -t SECRET -p /path/to/crowdbase/directory -s mycompany.hackpad.com
```

If you'd like to see what files would be imported, but not actually import them yet, you can use the `--dryrun` flag
```bash
./import.js -i CLIENTID -t SECRET -p /path/to/crowdbase/directory -s mycompany.hackpad.com --dryrun
```


To see additional details of how to use this import script
```bash
./import.js --help
```
