sudo docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -m 1GB -e "discovery.type=single-node" -e "xpack.security.enabled=false"  elasticsearch:8.12.2

sudo docker exec -ti elasticsearch /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
sudo docker exec -ti elasticsearch /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic

sudo docker run --name kibana --net elastic -p 5601:5601 kibana:8.12.2