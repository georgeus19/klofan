#!/bin/sh
# export DBA_PASSWORD=secret
# export DAV_PASSWORD=secret

    # --env DAV_PASSWORD=$DAV_PASSWORD \

rm -rf $HOME/.klofan-virtuoso-data
mkdir $HOME/.klofan-virtuoso-data

sudo docker run \
    --name klofan-virtuoso \
    -i --tty  \
    --env DBA_PASSWORD=mysecret \
    --publish 1111:1111 \
    --publish 8890:8890 \
    --volume $HOME/.klofan-virtuoso-data:/database \
    --volume /tmp:/opt/virtuoso-opensource/vsp/tmp \
    openlink/virtuoso-opensource-7:7.2.10



# ➜  ~ sudo docker exec -i klofan-virtuoso isql 1111
# OpenLink Virtuoso Interactive SQL (Virtuoso)
# Version 07.20.3237 as of Jun  7 2023
# Type HELP; for help and EXIT; to exit.

# *** Error 28000: [Virtuoso Driver]CL034: Bad login
# at line 0 of Top-Level:


# Enter password for dba :mysecret
# Connected to OpenLink Virtuoso
# Driver: 07.20.3237 OpenLink Virtuoso ODBC Driver
# SQL> DB.DBA.RDF_DEFAULT_USER_PERMS_SET ('SPARQL', 7);
# SQL> GRANT SPARQL_UPDATE TO "SPARQL";

# Done. -- 5 msec.
# SQL> 