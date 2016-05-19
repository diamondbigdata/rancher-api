# rancher-api
NodeJS Wrapper for Rancher Docker UI API

## About
This is just a little project i thought I would kick-up, seeing that I was in need of a NodeJS interface for Rancher, with just some light-weight functionality.

## Usage

```javascript
npm install --save rancher-api
```

**Instantiate it:**

```javascript
var rancher = require('rancher-api')('127.0.0.1', 8080, 'MY_KEY', 'MY_SECRET');
```

**Create Container:**
The *create* method accepts 2 parameters, a json object, detailed below - which contain the info for the container you would like to create & a call back function, which returns a json object with the successfully created container.

The code below, creates a container for the sabnzbd torrent client, by linuxserver - maps and exposes ports 8080 and 9090 as well as some volumes.

I've found that the best way to generate this object, is to go to the rancher UI, create a container and look at the requests made via the browser console, you should be able to find the request and extract the object from there.

```javascript
var data = {
  "startOnCreate":true,
  "publishAllPorts":false,
  "privileged":false,
  "stdinOpen":true,
  "tty":true,
  "readOnly":false,
  "networkMode":"managed",
  "type":"container",
  "requestedHostId":"1h1",
  "imageUuid":"docker:linuxserver/sabnzbd:latest",
  "ports":[
    "8080:8080/tcp",
    "9090:9090/tcp"
  ],
  "dataVolumes":[
    "/root/apps/sabnzbd:/config",
    "/root/data:/downloads",
    "/root/apps/sabnzbd:/incomplete-downloads",
    "/etc/localtime:/etc/localtime:ro"
  ],
  "dataVolumesFrom":[

  ],
  "dataVolumesFromLaunchConfigs":[

  ],
  "dns":[

  ],
  "dnsSearch":[

  ],
  "instanceLinks":{

  },
  "capAdd":[

  ],
  "capDrop":[

  ],
  "devices":[

  ],
  "logConfig":{
    "driver":"",
    "config":{

    }
  },
  "labels":{
    "io.rancher.container.pull_image":"always"
  },
  "name":"SABnzbd",
  "count":null,
  "createIndex":null,
  "created":null,
  "deploymentUnitUuid":null,
  "description":null,
  "externalId":null,
  "firstRunning":null,
  "healthState":null,
  "hostname":null,
  "kind":null,
  "removed":null,
  "startCount":null,
  "systemContainer":null,
  "uuid":null,
  "volumeDriver":null,
  "workingDir":null,
  "user":null,
  "domainName":null,
  "memorySwap":null,
  "memory":null,
  "cpuSet":null,
  "cpuShares":null,
  "pidMode":null
};

rancher.create(data, function(data){console.log(data)});

```

**Stop, Remove & Purge Container:**

```javascript
rancher.stop(id, function(data){console.log(data)}); 
// where id is rancher's ID from the container, the create method returns this on the callback

rancher.remove(id, function(data){console.log(data)}); 
// where id is rancher's ID from the container, the create method returns this on the callback

rancher.purge(id, function(data){console.log(data)}); 
// where id is rancher's ID from the container, the create method returns this on the callback
```
