# Simple index page generator for Traefik

Obtains the list of front-ends configured by the docker backend of the traefik reverse proxy. Then renders a list of hyperlinks for the "Host:" based rules.

## Configuration via environment variables:

ENDPOINTURL = "http://mytraefik/api/providers"

INDEXPAGETITLE = "Here are my traefik services: "

## Further information

Provided dockerfile is based on Microsoft Nanoserver and runs as a Windows Docker Container.

Used technologies: nodejs, express