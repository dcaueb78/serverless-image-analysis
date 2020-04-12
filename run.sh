# deploy
sls deploy

# invoke AWS
sls invoke -f img-analysis --path request.json --log

# invoke local
sls invoke -f local img-analysis --path request.json --log

## request example in request.json