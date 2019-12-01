# Simple index page generator for Traefik

Obtains the list of front-ends (routers in Traefik V2) configured by the various backends of the traefik reverse proxy. Then renders a list of hyperlinks for the "Host:" based rules.

## Configuration via environment variables:

```
ENDPOINTCONFIGURATION = '
{
   "title":"Here are my traefik services: ",
   "endpoints":[
      {
         "sectionTitle":"main",
         "url":"http://mytraefik/api/providers",
         "blacklist":"ignoreThisHostBasedOnAJSRegexp,isACommaSeparatedList"
      },
      {
         "sectionTitle":"sub section",
         "url":"http://mytraefik2/api/providers",
         "blacklist":""
      },
      {
         "sectionTitle":"sub section for traefik v2.0",
         "apiUrl":"http://mytraefik-version2/api/",
         "blacklist":""
       }
   ]
}
'
```


## Further information

Traefik-Index docker container is based on the node:alpine base image or the Microsoft Nanoserver image, respectively. 

Used technologies: nodejs, express
