# Server for collecting GSR packets

Would be handy if you got utility to perform request from terminal.

I'm using [httpie.org](https://httpie.org)

Commands for server are at [httpie.md](httpie.md)

[Doc of file upload form for httpie ](https://httpie.org/doc#file-upload-forms)

Example of request using httpie
```
⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znacka' gsr@1498683512_OM3KAA__skCUBE.gsr
POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 728
Content-Type: multipart/form-data; boundary=6ef3a15a2088493681453063a1e8febd
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
Date: Sun, 30 Jul 2017 11:53:04 GMT
ETag: W/"11a-j09WhvauNv+cSpE9LqLpT8XywJo"
X-Powered-By: Express

{
    "_id": "3ec376ae-6bd0-4da4-a4d5-68250848c6f2",
    "checksum": "1287950ff554c15972befe7049eb754c5292240e39bc3007fad585d856d2daee945cb6817ec7f3855d6a1382dca8444dcee4cd01612a1dbf10e043581e43d92b",
    "fileName": "3ec376ae-6bd0-4da4-a4d5-68250848c6f2_1498683512_OM3KAA__skCUBE.gsr",
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
