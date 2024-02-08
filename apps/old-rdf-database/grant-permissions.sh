#!/bin/sh
sudo docker exec -i klofan-virtuoso isql 1111 <<EOF
mysecret
DB.DBA.RDF_DEFAULT_USER_PERMS_SET ('SPARQL', 7);
GRANT SPARQL_UPDATE TO "SPARQL";
EOF