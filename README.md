# Open-Source, Customizable Jeopardy. Name likely to change due to IP concerns.

Dear future employers: This was thrown together in 4 days as a solo hackathon-type binge. 

Code standards will not be strictly adhered to. Things will be run in dev-mode because this will not be productionized (by me). I'll abuse features for tiny pros, ignoring the intended usecase (e.g. using `ModelViewSets` and then only allowing `POST` and manually defining `create` so really all it did was set up the URL for me)

Time results in better code, I promise.


## Notes for getting it to run
Redis backend for sockets:
`docker run -p 6379:6379 -d redis:5`

Installed pip packages (hopefully didn't miss any)
`asgi-redis`, `asgiref`, `channels`, `channels-redis`, `Django`, `redis`
