
```
docker pull webpagetest/server
docker pull webpagetest/agent
```

#### 制作镜像

```
mkdir wpt-mac-server
cd wpt-mac-server

vim Dockerfile
  FROM webpagetest/server
  ADD locations.ini /var/www/html/settings/

vim locations.ini
  [locations]
  1=Test_loc
  [Test_loc]
  1=Test
  label=Test Location
  group=Desktop
  [Test]
  browser=Chrome,Firefox
  label="Test Location"
  connectivity=LAN

// 打包server
docker build -t wpt-mac-server .
```

```
mkdir wpt-mac-agent
cd wpt-mac-agent

vim Dockerfile
  FROM webpagetest/agent
  ADD script.sh /
  ENTRYPOINT /srcipt.sh

vim srcipt.sh
  #!/bin/bash
  set -e
  if [ -z "$SERVER_URL" ]; then
    echo >&2 'SERVER_URL not set'
    exit 1
  fi
  if [ -z "$LOCATION" ]; then
    echo >&2 'LOCATION not set'
    exit 1
  fi
  EXTRA_ARGS=""
  if [ -n "$NAME" ]; then
    EXTRA_ARGS="$EXTRA_ARGS --name $NAME"
  fi
  python /wptagent/wptagent.py --server $SERVER_URL --location $LOCATION $EXTRA_ARGS --xvfb --dockerized -vvvvv --shaper none

  // 修改script.sh权限
  chmod u+x script.sh
  // 打包server
  docker build -t wpt-mac-agent .
```

用新镜像运行实例 (注意先停掉之前运行的containers)
    
```
docker run -d -p 4000:80 --rm wpt-mac-server
       
docker run -d -p 4001:80 --network="host" -e "SERVER_URL=http://localhost:4000/work/" -e "LOCATION=Test" wpt-mac-agent
```   