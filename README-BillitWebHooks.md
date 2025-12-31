Billit WebHooks
===============


WebhookUrl: http://pongit.synology.me:1710/api/billit/webhooks/order-created
Ip: 192.168.1.163
Port backend: 1710 -> 9000

Create Hooks
------------

```json
{
  "EntityType": "Order",
  "EntityUpdateType": "I",
  "WebhookURL": "http://pongit.synology.me:1710/api/billit/webhooks/order-created"
}
{
  "EntityType": "Order",
  "EntityUpdateType": "U",
  "WebhookURL": "http://pongit.synology.me:1710/api/billit/webhooks/order-updated"
}

{
  "EntityType": "Message",
  "EntityUpdateType": "I",
  "WebhookURL": "http://pongit.synology.me:1710/api/billit/webhooks/message-created"
}
{
  "EntityType": "Message",
  "EntityUpdateType": "U",
  "WebhookURL": "http://pongit.synology.me:1710/api/billit/webhooks/message-updated"
}
```

Message
-------

```json
{  
  "UpdatedEntityID": 100, //(MessageID)
  "UpdatedEntityType": "Message",
  "WebhookUpdateTypeTC": "U",
  "EntityDetail": {
    "OrderID": 2000,
    "Description": "Description",
    "FileID": "GUID-GUID-GUID",
    "CreationDate": "31/01/2000",
    "TransportType": "Peppol", //(Peppol, SDI, Email,...),
    "Destination": "BE1234568",
    "MessageDirection": "Incoming",
    "MessageAdditionalInformation": {
      "EInvoiceFlowState": "Refused", //Sent,Delivered,Accepted,Refuse
      "AdditionalFlowStateInformation": "No Valid VAT"
    }
  }
}
```

### Message Statusses

- Sent: the queue picked up the invoice (data is correct)
- Accepted: the network has successfully acknowledged the invoice
- Delivered: (optional) final state: only when the customer sends the response
- Refused: final state: download the file to get the refusal reason
