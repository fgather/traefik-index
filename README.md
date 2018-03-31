# Simple index page generator for Traefik

Obtains the list of front-ends configured by the various backends of the traefik reverse proxy. Then renders a list of hyperlinks for the "Host:" based rules.

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
      }
   ]
}
'
```


## Further information

Traefik-Index is based on the node:alpine base image. 
Provided windows-dockerfile is based on Microsoft Nanoserver and runs as a Windows Docker Container. 

Used technologies: nodejs, express