# Server for collecting GSR packets

Would be handy if you got utility to perform request from terminal.

I'm using [httpie.org](https://httpie.org)

Commands for server are at [httpie.md](httpie.md)

[Doc of file upload form for httpie ](https://httpie.org/doc#file-upload-forms)

Example of request using httpie, where you get response on unique gsr packet and already seen gsr packet
```
⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znackaa' gsr@1498683574_OM3KAA__skCUBE.gsr
POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 729
Content-Type: multipart/form-data; boundary=cb9abb60a49442f385545ddafe3c03ee
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
Date: Sun, 30 Jul 2017 13:27:51 GMT
ETag: W/"11a-b15KksHDgR9DDA+SdnU97jnVZzc"
X-Powered-By: Express

{
    "_id": "e713c8d6-d23f-4ec3-882e-f61f529e1692",
    "checksum": "05f47d4770a15ab6e972a0f9f4d965547f4f4324a8f95d94f180b9bda6afde8a8bdf322053ce174e8237b749427d9f5f10487a9ed0f8e90f3cff67b76a681153",
    "fileName": "e713c8d6-d23f-4ec3-882e-f61f529e1692_1498683574_OM3KAA__skCUBE.gsr",
    "status": "ok"
}

⫸  http -v -f POST :9001/v1/raw sourceCallsign='skCUBE' destinationCallsign='OM3KAA' meta='znackaa' gsr@1498683574_OM3KAA__skCUBE.gsr

POST /v1/raw HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 729
Content-Type: multipart/form-data; boundary=c9676dd35dfc493e9047e428fddb032e
Host: localhost:9001
User-Agent: HTTPie/0.9.9



+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 294
Content-Type: application/json; charset=utf-8
Date: Sun, 30 Jul 2017 13:27:57 GMT
ETag: W/"126-s0k36r0idzBJGSDzKOxPgPJX4ew"
X-Powered-By: Express

{
    "_id": "e713c8d6-d23f-4ec3-882e-f61f529e1692",
    "checksum": "05f47d4770a15ab6e972a0f9f4d965547f4f4324a8f95d94f180b9bda6afde8a8bdf322053ce174e8237b749427d9f5f10487a9ed0f8e90f3cff67b76a681153",
    "dupe": true,
    "filename": "e713c8d6-d23f-4ec3-882e-f61f529e1692_1498683574_OM3KAA__skCUBE.gsr",
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
