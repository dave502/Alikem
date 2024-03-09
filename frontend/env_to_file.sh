touch 111.env

for envvar in "$@" 
do
   echo "$envvar" >> 111.env
done
