# ELK on Docker

## use docker

### create bridge network

```shell
docker network create es
```

### create container

### elasticsearch and kibana

```shell
docker run -d --name elasticsearch-7.1 --net es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.1.0
docker run -d --name kibana-7.1 --net es -p 5601:5601 -e ELASTICSEARCH_URL=http://elasticsearch-7.1:9200 kibana:7.1.0
```

### logstash

```shell
docker run --rm -it -v ~/Project/playground/logstash/logstash-test.conf:/usr/share/logstash/config/logstash.conf logstash:7.1.0
```
