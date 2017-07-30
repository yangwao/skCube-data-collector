# Server for collecting GSR packets

Would be handy if you got utility to perform request from terminal.

I'm using [httpie.org](https://httpie.org)

Commands for server are at [httpie.md](httpie.md)

[Doc of file upload form for httpie ](https://httpie.org/doc#file-upload-forms)

Example of request using httpie, where you get response on unique gsr packet and already seen gsr packet
```
⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znackaaB' gsr@1498683620_OM3KAA__skCUBE.gsr
POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 640
Content-Type: multipart/form-data; boundary=834c42fe16be42029876487a849bb72b
Host: localhost:9001
User-Agent: HTTPie/0.9.9



+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 282
Content-Type: application/json; charset=utf-8
Date: Sun, 30 Jul 2017 15:03:24 GMT
ETag: W/"11a-8gAdj1lBxp51ElP/ynCBHIr+ork"
X-Powered-By: Express

{
    "_id": "48d620af-8e9f-4fe3-95d5-832c5420d536",
    "checksum": "0ae42784e4141ed1e0fb122b0bdefa18c1eb0b13655eaac91d314c1dc7db3c55813e55660cd6f91f971f9ada584ee1b59a23c6dabfa5cc88c00cccb66211bd14",
    "fileName": "48d620af-8e9f-4fe3-95d5-832c5420d536_1498683620_OM3KAA__skCUBE.gsr",
    "status": "ok"
}

[i] ~/P/s/lab ☭ master ● (^._.^)ﾉ彡ミ
⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znackaaB' gsr@1498683620_OM3KAA__skCUBE.gsr
POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 640
Content-Type: multipart/form-data; boundary=e95ab017531145c7a201d4219cc4ac61
Host: localhost:9001
User-Agent: HTTPie/0.9.9



+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 291
Content-Type: application/json; charset=utf-8
Date: Sun, 30 Jul 2017 15:03:27 GMT
ETag: W/"123-nLYGxw4S51TaLUsJAtzUnaLtKnQ"
X-Powered-By: Express

{
    "_id": "48d620af-8e9f-4fe3-95d5-832c5420d536",
    "checksum": "0ae42784e4141ed1e0fb122b0bdefa18c1eb0b13655eaac91d314c1dc7db3c55813e55660cd6f91f971f9ada584ee1b59a23c6dabfa5cc88c00cccb66211bd14",
    "filename": "48d620af-8e9f-4fe3-95d5-832c5420d536_1498683620_OM3KAA__skCUBE.gsr",
    "seen": 1,
    "status": "ok"
}

[i] ~/P/s/lab ☭ master ● (^._.^)ﾉ彡ミ
⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znackaaB' gsr@1498683620_OM3KAA__skCUBE.gsr
POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 640
Content-Type: multipart/form-data; boundary=c2f30166b3184e3e8e46d156e7ce87a1
Host: localhost:9001
User-Agent: HTTPie/0.9.9



+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 291
Content-Type: application/json; charset=utf-8
Date: Sun, 30 Jul 2017 15:03:31 GMT
ETag: W/"123-sAheATj6+4iZQqWRndqZ7wiN0ks"
X-Powered-By: Express

{
    "_id": "48d620af-8e9f-4fe3-95d5-832c5420d536",
    "checksum": "0ae42784e4141ed1e0fb122b0bdefa18c1eb0b13655eaac91d314c1dc7db3c55813e55660cd6f91f971f9ada584ee1b59a23c6dabfa5cc88c00cccb66211bd14",
    "filename": "48d620af-8e9f-4fe3-95d5-832c5420d536_1498683620_OM3KAA__skCUBE.gsr",
    "seen": 2,
    "status": "ok"
}
```

### v1 api

`POST` request with `Content-Type: multipart/form-data`
required fields inside request are
```
sourceCallsign
destinationCallsign
meta
gsr
```
Where `gsr` is attachment of gsr packet
